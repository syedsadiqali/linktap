import { WaitlistEnter } from "@/emails/waitlist-enter";

import { createClient } from "@/lib/supabase/client";
import { sendEmail } from "@/actions/commonActions";

export async function saveWaitlistUser(email: string) {
  const supabase = createClient();

  const { data: waitlistDetails, error: waitlistError } = await supabase
    .from("waitlist")
    .insert({ email: email })
    .select()
    .single();

  if (waitlistError) {
    return { waitlistError };
  }

  fetch("/api/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      to: email,
      subject: "You're on the waitlist!",
      variables: {
        userEmail: waitlistDetails?.email,
      },
    }),
  });

  return {
    waitlistDetails,
  };
}
