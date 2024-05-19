import { NextRequest } from "next/server";

export const parse = (req: NextRequest) => {
  let domain = req.headers.get("host") as string;
  domain = domain.replace("www.", ""); // remove www. from domain

  // // path is the path of the URL (e.g. dub.co/stats/github -> /stats/github)
  let path = req.nextUrl.pathname;

  // // fullPath is the full URL path (along with search params)
  // const searchParams = req.nextUrl.searchParams.toString();
  // const fullPath = `${path}${
  //   searchParams.length > 0 ? `?${searchParams}` : ""
  // }`;

  // // Here, we are using decodeURIComponent to handle foreign languages like Hebrew
  // const key = decodeURIComponent(path.split("/")[1]); // key is the first part of the path (e.g. dub.co/stats/github -> stats)
  // const fullKey = decodeURIComponent(path.slice(1)); // fullKey is the full path without the first slash (to account for multi-level subpaths, e.g. d.to/github/repo -> github/repo)
  // const restSlug = decodeURIComponent(path.slice(2));
  
  const parts = path.split('/');
  
  let restSlug;
    
    // Find the part containing 'http:' or 'https:' and return it along with the following part
    for (let i = 0; i < parts.length; i++) {
        if ((parts[i] === 'http:' || parts[i] === 'https:') && parts[i + 1] !== undefined) {
            restSlug =  parts[i] + '//' + parts[i + 1];
        }
    }
  
  // let restSlug = decodeURIComponent(path.split("/")[2]);

  return { domain, path, restSlug };
};

export const getFinalUrl = (url: string, { req }: { req: NextRequest }) => {
  // query is the query string (e.g. d.to/github?utm_source=twitter -> ?utm_source=twitter)
  const searchParams = req.nextUrl.searchParams;

  // get the query params of the target url
  const urlObj = new URL(url);

  // if there are no query params, then return the target url as is (no need to parse it)
  // @ts-ignore – until https://github.com/microsoft/TypeScript/issues/54466 is fixed
  if (searchParams.size === 0) return url;

  // if searchParams (type: `URLSearchParams`) has the same key as target url, then overwrite it
  // @ts-ignore
  for (const [key, value] of searchParams) {
    urlObj.searchParams.set(key, value);
  }

  // construct final url
  const finalUrl = urlObj.toString();

  return finalUrl;
};

export const detectBot = (req: NextRequest) => {
  const url = req.nextUrl;
  if (url.searchParams.get("bot")) return true;
  const ua = req.headers.get("User-Agent");
  if (ua) {
    /* Note:
     * - bot is for most bots & crawlers
     * - ChatGPT is for ChatGPT
     * - facebookexternalhit is for Facebook crawler
     * - WhatsApp is for WhatsApp crawler
     * - MetaInspector is for https://metatags.io/
     */
    return /bot|chatgpt|facebookexternalhit|WhatsApp|google|baidu|bing|msn|duckduckbot|teoma|slurp|yandex|MetaInspector/i.test(
      ua
    );
  }
  return false;
};