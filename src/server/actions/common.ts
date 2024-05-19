"use server";

import { sleep } from "@/lib/utils";
import { createUrl } from "@/lib/utils/common";
import { revalidatePath, revalidateTag } from "next/cache";
import { NextApiRequestCookies } from "next/dist/server/api-utils";
import { cookies } from "next/headers";
import React from "react";
import { Resend } from "resend";

export async function revalidateData(path: string, layout: boolean = false) {
  revalidatePath(path, layout ? "layout" : undefined);
}

export async function sendEmail(
  to: string,
  subject: string,
  template: React.ComponentType<any>,
  variables: Record<string, string>,
) {
  const resend = new Resend(process.env.RESEND_API_KEY);

  const { data, error } = await resend.emails.send({
    from: "LinkTap <hi@linktap.xyz>",
    to: [to],
    subject: subject,
    react: React.createElement(template, variables),
  });

  return { data, error };
}

function arrayToCookieString(arr: NextApiRequestCookies[]) {
  return arr.map((item) => `${item?.name}=${item?.value}`).join("; ");
}

export async function getData({
  groupBy,
  aFor,
  from,
  to,
}: {
  groupBy: string;
  aFor: string;
  from?: string;
  to?: string;
}) {
  const cookieHeaders = cookies().getAll();

  let url = createUrl(
    `${process.env.NEXT_PUBLIC_ROUTE}/api/analytics/clicks`,
    new URLSearchParams({
      ...(aFor && { aFor }),
      group_by: groupBy,
      ...(from && { from }),
      ...(to && { to }),
    }),
  );

  const res = await fetch(url, {
    headers: {
      Cookie: arrayToCookieString(cookieHeaders),
    },
    next: { revalidate: 10 },
  });
  
  // record clicks
  

  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  await sleep(2000);

  return res.json();
}
