"use server";
import { createClient } from "@/lib/supabase/server";

export async function getCurrentAuthedUser() {
  const supabase = createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();
  
  console.log(session?.user)

  if (!session?.user) {
    return {
      user: null,
    };
  }

  return {
    user: session?.user,
  };
}
