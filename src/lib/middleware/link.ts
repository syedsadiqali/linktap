import { getLinkByLinkUrl } from "@/server/actions/links";
import { recordClick } from "@/server/actions/tracking";
import { detectBot, getFinalUrl, parse } from "@/lib/middleware/utils";
import {
  NextFetchEvent,
  NextRequest,
  NextResponse,
  userAgent,
} from "next/server";
import { LINKTAP_HEADERS } from "./constants";

export default async function LinkMiddleware(
  req: NextRequest,
  ev: NextFetchEvent
) {
  let { domain, restSlug: linkSlug } = parse(req);

    if (!domain || !linkSlug) {
      return NextResponse.next();
    }

  // links on Dub are case insensitive by default
  //   key = key.toLowerCase();

  //   const demoLink = DUB_DEMO_LINKS.find(
  //     (l) => l.domain === domain && l.key === key,
  //   );

  //   // if it's a demo link, block bad referrers in production
  //   if (
  //     process.env.NODE_ENV !== "development" &&
  //     demoLink &&
  //     (await isBlacklistedReferrer(req.headers.get("referer")))
  //   ) {
  //     return new Response("Don't DDoS me pls 🥺", { status: 429 });
  //   }

  //   const inspectMode = key.endsWith("+");
  //   // if inspect mode is enabled, remove the trailing `+` from the key
  //   if (inspectMode) {
  //     key = key.slice(0, -1);
  //   }

  //   let link = await redis.hget<RedisLinkProps>(domain, key);

  //   if (!link) {
  //     const linkData = await getLinkViaEdge(domain, key);

  //     if (!linkData) {
  //       // short link not found, redirect to root
  //       // TODO: log 404s (https://github.com/dubinc/dub/issues/559)
  //       return NextResponse.redirect(new URL("/", req.url), {
  //         ...DUB_HEADERS,
  //         status: 302,
  //       });
  //     }

  //     // format link to fit the RedisLinkProps interface
  //     link = await formatRedisLink(linkData as any);

  //     ev.waitUntil(
  //       redis.hset(domain, {
  //         [key]: link,
  //       }),
  //     );
  //   }

  let { linksData, linksError } = await getLinkByLinkUrl(linkSlug);

  if(!linksData) {
    throw new Error('links data not found!')
  }
  
  const { id, link_url: url } = linksData;

  // only show inspect modal if the link is not password protected
  //   if (inspectMode && !password) {
  //     return NextResponse.rewrite(
  //       new URL(`/inspect/${domain}/${encodeURIComponent(key)}+`, req.url),
  //       DUB_HEADERS,
  //     );
  //   }

  //   // if the link is password protected
  //   if (password) {
  //     const pw = req.nextUrl.searchParams.get("pw");

  //     // rewrite to auth page (/password/[domain]/[key]) if:
  //     // - no `pw` param is provided
  //     // - the `pw` param is incorrect
  //     // this will also ensure that no clicks are tracked unless the password is correct
  //     if (!pw || (await getLinkViaEdge(domain, key))?.password !== pw) {
  //       return NextResponse.rewrite(
  //         new URL(`/password/${domain}/${encodeURIComponent(key)}`, req.url),
  //         DUB_HEADERS,
  //       );
  //     } else if (pw) {
  //       // strip it from the URL if it's correct
  //       req.nextUrl.searchParams.delete("pw");
  //     }
  //   }

  //   // if the link is banned
  //   if (link.projectId === LEGAL_WORKSPACE_ID) {
  //     return NextResponse.rewrite(new URL("/banned", req.url), DUB_HEADERS);
  //   }

  //   // if the link has expired
  //   if (expiresAt && new Date(expiresAt) < new Date()) {
  //     return NextResponse.rewrite(new URL("/expired", req.url), DUB_HEADERS);
  //   }

  //   const searchParams = req.nextUrl.searchParams;
  //   // only track the click when there is no `dub-no-track` header or query param
  //   if (
  //     !(
  //       req.headers.get("dub-no-track") ||
  //       searchParams.get("dub-no-track") === "1"
  //     )
  //   ) {
  //     ev.waitUntil(recordClick({ req, id, url: getFinalUrl(url, { req }) }));
  //   }

  ev.waitUntil(recordClick({ req, id: id.toString(), url: getFinalUrl(url, { req }) }));

  return NextResponse.redirect(getFinalUrl(url, { req }), {
    ...LINKTAP_HEADERS,
    status: 302,
  });

  //   const isBot = detectBot(req);

  //   const { country } =
  //     process.env.VERCEL === "1" && req.geo ? req.geo : LOCALHOST_GEO_DATA;

  //   // rewrite to proxy page (/proxy/[domain]/[key]) if it's a bot and proxy is enabled
  //   if (isBot && proxy) {
  //     return NextResponse.rewrite(
  //       new URL(`/proxy/${domain}/${encodeURIComponent(key)}`, req.url),
  //       DUB_HEADERS,
  //     );

  //     // rewrite to target URL if link cloaking is enabled
  //   } else if (rewrite) {
  //     if (iframeable) {
  //       return NextResponse.rewrite(
  //         new URL(`/cloaked/${encodeURIComponent(url)}`, req.url),
  //         DUB_HEADERS,
  //       );
  //     } else {
  //       // if link is not iframeable, use Next.js rewrite instead
  //       return NextResponse.rewrite(url, DUB_HEADERS);
  //     }

  //     // redirect to iOS link if it is specified and the user is on an iOS device
  //   } else if (ios && userAgent(req).os?.name === "iOS") {
  //     return NextResponse.redirect(getFinalUrl(ios, { req }), {
  //       ...DUB_HEADERS,
  //       status: 302,
  //     });

  //     // redirect to Android link if it is specified and the user is on an Android device
  //   } else if (android && userAgent(req).os?.name === "Android") {
  //     return NextResponse.redirect(getFinalUrl(android, { req }), {
  //       ...DUB_HEADERS,
  //       status: 302,
  //     });

  //     // redirect to geo-specific link if it is specified and the user is in the specified country
  //   } else if (geo && country && country in geo) {
  //     return NextResponse.redirect(getFinalUrl(geo[country], { req }), {
  //       ...DUB_HEADERS,
  //       status: 302,
  //     });

  //     // regular redirect
  //   } else {
  //     return NextResponse.redirect(getFinalUrl(url, { req }), {
  //       ...DUB_HEADERS,
  //       status: 302,
  //     });
  //   }
}
