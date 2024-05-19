import { updateSession } from "@/lib/supabase/middleware";
import { parseMiddlewareReq } from "@/lib/utils";
import { NextResponse } from "next/server";

import type { NextFetchEvent, NextRequest } from "next/server";
import LinkMiddleware from "./lib/middleware/link";
import { getPageByPageHandle } from "./server/actions/page";
import { recordClick } from "./server/actions/tracking";
import reservedRoutesFile from "../reserved_routes.json"

const RESERVED_ROUTES = reservedRoutesFile.folderNames;

export async function middleware(req: NextRequest, ev: NextFetchEvent) {
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-pathname", req.nextUrl.pathname);

  const res = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  const { key, fullKey, lastPathSegment, fullUrl } = parseMiddlewareReq(req);

  if (key === "l") {
    // let url = fullKey.slice(2);

    return LinkMiddleware(req, ev);

    // return NextResponse.redirect(url);
  }
    
  // check if it's a public handle
  if (!RESERVED_ROUTES.includes(`/${lastPathSegment}`)) {
    const { pageDetails } = await getPageByPageHandle(key);
    console.log('shit ', fullUrl)
    if (pageDetails?.id) {
      ev.waitUntil(
        recordClick({
          req,
          id: pageDetails?.id.toString(),
          ...(fullUrl && { url : fullUrl}),
          root: true,
        })
      );
    }
  }

  await updateSession(req);
  return res;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
