import { Resend } from "resend";
import * as React from "react";
import WaitlistEnter from "@/emails/waitlist-enter";
import { NextApiRequest, NextApiResponse } from "next";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const { to, subject, variables } = await req.json();

  try {
    const { data, error } = await resend.emails.send({
      from: "LinkTap <noreply@linktap.xyz>",
      to: [to],
      subject: subject,
      react: WaitlistEnter(variables) as React.ReactElement,
    });

    if (error) {
      return Response.json({ error });
    }

    return Response.json({ data });
  } catch (error) {
    return Response.json({ error });
  }
}
