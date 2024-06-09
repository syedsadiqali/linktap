"use server";

import { NextRequest, userAgent } from "next/server";
import { detectBot } from "@/lib/middleware/utils";
import {
  EU_COUNTRY_CODES,
  LOCALHOST_GEO_DATA,
  LOCALHOST_IP,
} from "@/lib/constants";
import { ipAddress } from "@vercel/edge";
import { getIdentityHash } from "@/lib/utils/edge";
import { getDomainWithoutWWW } from "@/lib/utils/domains";
import { capitalize } from "@/lib/utils/capitalize";
import { nanoid } from "@/lib/utils/nanoid";
import { createClient } from "@/lib/supabase/server";

import { z } from "zod";
import { getAnalytics } from "@/lib/analytics";
import { getPageByPageHandle } from "./page";
import { Interval } from "@/types/utils";

export async function recordClick({
  req,
  id,
  url,
  root,
}: {
  req: NextRequest;
  id: string;
  url?: string;
  root?: boolean;
}) {
  console.log("shit   ", url);
  const isBot = detectBot(req);
  if (isBot) {
    return null; // don't record clicks from bots
  }
  // const isQr = detectQr(req);
  let isQr = false;
  const geo = process.env.VERCEL === "1" ? req.geo : LOCALHOST_GEO_DATA;
  const ua = userAgent(req);
  const referer = req.headers.get("referer");
  const ip = process.env.VERCEL === "1" ? ipAddress(req) : LOCALHOST_IP;
  const identity_hash = await getIdentityHash(req);
  // if in production / preview env, deduplicate clicks from the same IP address + link ID – only record 1 click per hour
  // if (process.env.VERCEL === "1") {
  //   const { success } = await ratelimit(2, "1 h").limit(
  //     `recordClick:${ip}:${id}`,
  //   );
  //   if (!success) {
  //     return null;
  //   }
  // }

  const supabase = createClient();

  return await Promise.allSettled([
    fetch(
      `${process.env.TINYBIRD_API_URL}/v0/events?name=click_events&wait=true`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.TINYBIRD_API_KEY}`,
        },
        body: JSON.stringify({
          timestamp: new Date(Date.now()).toISOString(),
          identity_hash,
          click_id: nanoid(16),
          link_id: id,
          alias_link_id: "",
          url: url ?? "",
          ip:
            // only record IP if it's a valid IP and not from EU
            typeof ip === "string" &&
            ip.trim().length > 0 &&
            (!geo?.country ||
              (geo?.country && !EU_COUNTRY_CODES.includes(geo.country)))
              ? ip
              : "",
          country: geo?.country ?? "Unknown",
          city: geo?.city ?? "Unknown",
          region: geo?.region ?? "Unknown",
          latitude: geo?.latitude ?? "Unknown",
          longitude: geo?.longitude ?? "Unknown",
          device: ua.device.type ? capitalize(ua.device.type) : "Desktop",
          device_vendor: ua.device.vendor ?? "Unknown",
          device_model: ua.device.model ?? "Unknown",
          browser: ua.browser.name ?? "Unknown",
          browser_version: ua.browser.version ?? "Unknown",
          engine: ua.engine.name ?? "Unknown",
          engine_version: ua.engine.version ?? "Unknown",
          os: ua.os.name ?? "Unknown",
          os_version: ua.os.version ?? "Unknown",
          cpu_architecture: ua.cpu?.architecture ?? "Unknown",
          ua: ua.ua ?? "Unknown",
          bot: ua.isBot,
          qr: isQr || false,
          referer: referer
            ? getDomainWithoutWWW(referer) ?? "(direct)"
            : "(direct)",
          referer_url: referer ?? "(direct)",
        }),
      }
    )
      .then((res) => res.json())
      .catch((error) =>
        console.log("Error while posting event to tinybird ", error)
      ),

    // increment the click count for the link or domain (based on their ID)
    // also increment the usage count for the workspace
    // and then we have a cron that will reset it at the start of new billing cycle
    root
      ? [await supabase.rpc("increment_page_views", { page_id: id })]
      : [await supabase.rpc("increment_link_clicks", { link_id: id })],
  ]);
}

export async function getLinkTrackingData(link_id: number) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("links_tracking_data")
    .select("*")
    .eq("link_id", link_id);

  if (error) {
    console.log(error);
    // throw new Error({message: JSON.parse(error, null, '/n')})
  }

  return data;
}

// export async function getLinkTrackingClicks(link_id: number, interval: string) {
//   const supabase = createClient();

//   const { data, error } = await supabase.rpc("get_clicks_or_pageviews", {
//     link_id_input: link_id,
//     interval_interval: "30 days",
//   });

//   if (error) {
//     console.log(error);
//     // throw new Error({message: JSON.parse(error, null, '/n')})
//   }

//   return data;
// }

const inputSchema = z.object({
  groupedBy: z.enum(["browser", "device", "country", "city", "region", "date"]),
  granularity: z.enum(["day", "month"]).optional().nullable(),
  aFor: z.enum(["links", "pages"]),
  from: z.string().datetime().optional().nullable(),
  to: z.string().datetime().optional().nullable(),
  filter: z.any(),
  sort: z
    .string()
    .regex(/^[a-zA-Z0-9]+$/)
    .optional()
    .nullable(),
});

const tableMap: Record<string, string> = {
  links: "links_tracking_data",
  pages: "page_tracking_data",
};

interface InputSchema {
  groupedBy:
    | "country"
    | "city"
    | "url"
    | "alias"
    | "device"
    | "browser"
    | "os"
    | "referer"
    | "root";
  granularity?: "1h" | "24h" | "7d" | "30d" | "90d" | "all";
  aFor: "links" | "pages";
  from?: string | null;
  to?: string | null;
  filter?: any; // You can replace 'any' with the specific type of filter
  sort?: string | null;
}

// export async function getTrackingData({
//   groupedBy,
//   granularity,
//   aFor,
//   from,
//   to,
//   filter,
//   sort,
// }: InputSchema) {
//   const supabase = createClient();

//   const {
//     data: { session },
//   } = await supabase.auth.getSession();

// if (!session) {
//   return new Response("UnAuthorized", { status: 401 });
// }

// const searchParams = request.nextUrl.searchParams;

// let filterP = JSON.parse(searchParams.get("filter"));

// const requestjson = inputSchema.safeParse({
//   groupedBy: searchParams.get("group_by"),
//   aFor: searchParams.get("aFor"),
//   from: searchParams.get("from"),
//   to: searchParams.get("to"),
//   filter: filterP,
//   sort: searchParams.get("sort"),
//   granularity: searchParams.get("granularity"),
// });

// if (!requestjson.success) {
//   const { errors } = requestjson.error;

//   return Response.json(
//     {
//       error: { message: "Invalid request", errors },
//     },
//     {
//       status: 400,
//     },
//   );
// }

// let { aFor, from, to, filter, sort, groupedBy, granularity } =
//   requestjson.data;

// let fromD, toD, sortD, filterD, groupD;

// if (!from) {
//   fromD = new Date(0).toISOString();
// } else {
//   fromD = new Date(from).toISOString();
// }

// if (!to) {
//   toD = new Date().toISOString();
// } else {
//   toD = new Date(to).toISOString();
// }

// if (!filter) {
//   filterD = "";
// } else {
//   const entries = Object.entries(filter);
//   const keyValuePairs = entries.map(([key, value]) => `${key}='${value}'`);
//   filterD = ` ${keyValuePairs.join(" and ")} `;
// }

// if (!sort) {
//   sortD = "";
// }

// if (groupedBy == "date") {
//   // we will use date_truc

//   groupD = `date_trunc('${granularity || "day"}', timestamp)`;
// }

// const response = await getAnalytics({
//   // workspaceId can be undefined (for public links that haven't been claimed/synced to a workspace)
//   ...(link.projectId && { workspaceId: link.projectId }),
//   linkId: link.id,
//   endpoint,
//   ...parsedParams,
// });

// const { data, error } = await supabase.rpc("get_grouped_data_query", {
//   table_name: tableMap[aFor],
//   group_by_column: groupD || groupedBy,
//   filter_string: filterD,
//   from_timestamp: fromD,
//   to_timestamp: toD,
// });

// const { data: data1, error: error1 } = await supabase.rpc(
//   "get_grouped_data_query1",
//   {
//     table_name: "links_tracking_data",
//     group_by_column: groupD || groupedBy,
//     filter_string: filterD,
//     from_timestamp: fromD,
//     to_timestamp: toD,
//   }
// );

// console.log("query was ", data1);

// console.log("error", error);

// if (error) {
//   return Response.json(
//     {
//       error: { message: "Invalid request", error },
//     },
//     {
//       status: 400,
//     }
//   );
// }

//
//

// return data;

// convert these to utc and send a rpc call to supabase to get the data.

// let fromInUtc = new Date(from).toISOString();

// let toInUtc = new Date(to).toISOString();
// }

export const getAnalyticsData = async ({
  page_handle,
  linkId,

  aType,
  interval,
  aFor,
}: {
  page_handle?: string;
  linkId?: string;
  aFor?: string;
  interval?: Interval;
  aType?: string;
}) => {
  if (aFor === "page") {
    const { pageDetails } = await getPageByPageHandle(page_handle);

    page_handle = undefined;
    linkId = pageDetails?.id as string;
  }

  const response = await getAnalytics({
    ...(page_handle && { workspaceId: page_handle }),
    ...(linkId && { linkId: linkId }),
    // @ts-ignore
    endpoint: aType,
    interval: interval,
    // ...parsedParams,
  });

  return response;
};

export async function recordLink({
  link,
  deleted,
}: {
  link: Partial<any> & {
    tags?: { tagId: string }[];
  };
  deleted?: boolean;
}) {
  return await fetch(
    `${process.env.TINYBIRD_API_URL}/v0/events?name=links_metadata&wait=true`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.TINYBIRD_API_KEY}`,
      },
      body: JSON.stringify({
        timestamp: new Date(Date.now()).toISOString(),
        link_id: link.id,
        domain: link.domain,
        key: link.key,
        url: link.url,
        tagIds: link.tags?.map(({ tagId }) => tagId) || [],
        page_id: link.pageId || "",
        deleted: deleted ? 1 : 0,
      }),
    }
  ).then((res) => res.json());
}
