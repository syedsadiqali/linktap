"use server";

import { revalidatePath } from "next/cache";
import React from "react";
import { Resend } from "resend";

export async function revalidateData(path: string, layout: boolean = false) {
  revalidatePath(path, layout ? "layout" : undefined);
}

export async function sendEmail(
  to: string,
  subject: string,
  template: React.ComponentType<any>,
  variables: Record<string, string>
) {
  
  const resend = new Resend(process.env.RESEND_API_KEY);

  const { data, error } = await resend.emails.send({
    from: 'LinkTap <hi@linktap.xyz>',
    to: [to],
    subject: subject,
    react: React.createElement(template, variables)
  });
  
    
  return {data, error}
}
