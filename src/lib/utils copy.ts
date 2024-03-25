
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { LinksRow } from "@/types/utils";
import { NextRequest } from "next/server";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function streamToString(
  stream: ReadableStream<Uint8Array>
): Promise<string> {
  const reader = stream.getReader();
  const decoder = new TextDecoder("utf-8");
  let result = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) {
      break;
    }
    result += decoder.decode(value);
  }

  reader.releaseLock();
  return result;
}

export function parseMiddlewareReq(req: NextRequest) {
  const domain = req.headers.get("host") as string;

  let path = req.nextUrl.pathname;

  const searchParams = req.nextUrl.searchParams;

  const key = decodeURIComponent(path.split("/")[1]); // key is the first part of the path (e.g. dub.co/stats/github -> stats)

  const fullKey = decodeURIComponent(path.slice(1)); // fullKey is the full path without the first slash (to account for multi-level subpaths, e.g. dub.sh/github/repo -> github/repo)

  return { domain, key, fullKey, searchParams };
}

export function getInitials(name: string): string {
  if (!name || name?.length < 2) {
    return "AB";
  }

  let nameSplit = name.split(" ");

  if (nameSplit?.length < 2) {
    return "AB";
  }

  return `${nameSplit[0].slice(0, 1)}${nameSplit[1].slice(0, 1)}`.toUpperCase();
}

export function isValidHttpUrl(string: string) {
  let url;

  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }

  return url.protocol === "http:" || url.protocol === "https:";
}

export const getSortedLinks = (
  links: Partial<LinksRow>[],
  sortOrder: number[]
): Partial<LinksRow>[] => {
  return links.sort(
    (a: Partial<LinksRow>, b: Partial<LinksRow>) =>
      sortOrder?.indexOf(a?.id as number) - sortOrder?.indexOf(b?.id as number)
  );
};

export function uuidv4() {
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c: any) =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}