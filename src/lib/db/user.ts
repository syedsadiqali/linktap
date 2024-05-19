import { createClient } from "@/lib/supabase/client";

export async function getCurrentAuthedUser() {
  const supabase = createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) {
    return {
      user: null,
    };
  }

  return {
    user: session?.user,
  };
}
