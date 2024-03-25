import { ProfileForm } from "./_components/profile-form";
import { createClient } from "@/lib/supabase/server";

import { redirect } from "next/navigation";
import { constructMetadata } from "@/lib/utils/seo";
import config from "@/config";
import { getCurrentAuthedUser } from "@/actions/userActions";
import { revalidateData } from "@/actions/commonActions";

export const dynamic = "force-dynamic";

export const metadata = constructMetadata({
  title: `Profile Page – ${config.appName}`,
  description: "Set your profile like User Handle, Full Name, Bio etc",
});

export default async function SettingsProfilePage() {
  const { user, userDetails } = await getCurrentAuthedUser();

  if (!user) {
    redirect("/");
  }

  return (
    <div className=" space-y-6 max-w-md w-80">
      {userDetails && (
        <ProfileForm
          user={user}
          userDetails={userDetails}
          revalidateCache={revalidateData}
        />
      )}
    </div>
  );
}
