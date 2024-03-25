import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const requestUrl = new URL(request.url);
  const formData = await request.formData();
  const email = String(formData.get("email"));
  const supabase = createClient();

  const { data: waitlistData, error: waitlistError } = await supabase
    .from("waitlist")
    .select("status")
    .eq("email", email as string)
    .single();

  console.log(waitlistData, waitlistError);

  if (waitlistError) {
    return NextResponse.redirect(
      `${requestUrl.origin}/login?error=You need to be waitlist first to sign up&status=NOT_ON_WAITLIST_YET`,
      {
        // a 301 status is required to redirect from a POST to a GET route
        status: 301,
      }
    );
  }

  if (waitlistData?.status === "pending") {
    return NextResponse.redirect(
      `${requestUrl.origin}/login?error=You are not allowed to sign up yet, we will send you an email when you can&status=STATUS_PENDING`,
      {
        // a 301 status is required to redirect from a POST to a GET route
        status: 301,
      }
    );
  }

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${requestUrl.origin}/auth/callback`,
    },
  });

  if (error) {
    return NextResponse.redirect(
      `${requestUrl.origin}/login?error=${error.message}`,
      {
        // a 301 status is required to redirect from a POST to a GET route
        status: 301,
      }
    );
  }

  return NextResponse.redirect(
    `${requestUrl.origin}/login?message=Check email to continue sign in process`,
    {
      // a 301 status is required to redirect from a POST to a GET route
      status: 301,
    }
  );
}
