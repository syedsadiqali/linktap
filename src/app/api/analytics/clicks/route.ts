import { recordClick } from "@/server/actions/tracking";
import { createClient } from "@/lib/supabase/server";
import { headers } from "next/headers";
import { NextFetchEvent, NextRequest } from "next/server";

import { z } from "zod";

export const runtime = 'edge'


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

// export async function GET(request: Request) {
//   const supabase = createClient();

//   const {
//     data: { session },
//   } = await supabase.auth.getSession();

//   if (!session) {
//     return new Response("UnAuthorized", { status: 401 });
//   }

//   const searchParams = request.nextUrl.searchParams;

//   let filterP = JSON.parse(searchParams.get("filter"));

//   const requestjson = inputSchema.safeParse({
//     groupedBy: searchParams.get("group_by"),
//     aFor: searchParams.get("aFor"),
//     from: searchParams.get("from"),
//     to: searchParams.get("to"),
//     filter: filterP,
//     sort: searchParams.get("sort"),
//     granularity: searchParams.get("granularity"),
//   });

//   if (!requestjson.success) {
//     const { errors } = requestjson.error;

//     return Response.json(
//       {
//         error: { message: "Invalid request", errors },
//       },
//       {
//         status: 400,
//       }
//     );
//   }

//   let { aFor, from, to, filter, sort, groupedBy, granularity } =
//     requestjson.data;

//   let fromD, toD, sortD, filterD, groupD;

//   if (!from) {
//     fromD = new Date(0).toISOString();
//   } else {
//     fromD = new Date(from).toISOString();
//   }

//   if (!to) {
//     toD = new Date().toISOString();
//   } else {
//     toD = new Date(to).toISOString();
//   }

//   if (!filter) {
//     filterD = "";
//   } else {
//     const entries = Object.entries(filter);
//     const keyValuePairs = entries.map(([key, value]) => `${key}='${value}'`);
//     filterD = ` ${keyValuePairs.join(" and ")} `;
//   }

//   if (!sort) {
//     sortD = "";
//   }

//   if (groupedBy == "date") {
//     // we will use date_truc

//     groupD = `date_trunc('${granularity || "day"}', timestamp)`;
//   }

//   const { data, error } = await supabase.rpc("get_grouped_data_query", {
//     table_name: tableMap[aFor],
//     group_by_column: groupD || groupedBy,
//     filter_string: filterD,
//     from_timestamp: fromD,
//     to_timestamp: toD,
//   });

//   const { data: data1, error: error1 } = await supabase.rpc(
//     "get_grouped_data_query1",
//     {
//       table_name: "links_tracking_data",
//       group_by_column: groupD || groupedBy,
//       filter_string: filterD,
//       from_timestamp: fromD,
//       to_timestamp: toD,
//     }
//   );

//   console.log("query was ", data1);

//   console.log("error", error);

//   if (error) {
//     return Response.json(
//       {
//         error: { message: "Invalid request", error },
//       },
//       {
//         status: 400,
//       }
//     );
//   }

//   //
//   //

//   return Response.json({ data });

//   // convert these to utc and send a rpc call to supabase to get the data.

//   // let fromInUtc = new Date(from).toISOString();

//   // let toInUtc = new Date(to).toISOString();
// }
