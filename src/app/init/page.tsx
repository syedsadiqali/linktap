import { createClient } from "@/lib/supabase/server";
import Init from "./page-client";

export const dynamic = "force-dynamic";

export default async function Index() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <Init user={user} />;
}
