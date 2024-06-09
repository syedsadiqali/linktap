import { ProfileForm } from "./_components/profile-form";

import { notFound, redirect } from "next/navigation";
import { constructMetadata } from "@/lib/utils/seo";
import config from "@/config";
import {
  createOrUpdateAvatar,
  getPageByPageHandle,
  getPublicUrl,
  removeImage,
  updatePage,
} from "@/server/actions/page";
import { getCurrentAuthedUser } from "@/server/actions/user";

export const metadata = constructMetadata({
  title: `Profile Page – ${config.appName}`,
  description: "Set your profile like User Handle, Full Name, Bio etc",
});

async function redirectTo(to: string) {
  "use server";

  redirect(to);
}

export default async function SettingsProfilePage({
  params,
}: {
  params: { pageHandle: string };
}) {
  const { user } = await getCurrentAuthedUser();
  const { pageDetails } = await getPageByPageHandle(params.pageHandle);

  if (!pageDetails) {
    return notFound();
  }

  return (
    <div className="space-y-6 max-w-md w-80">
      <ProfileForm
        user={user}
        pageDetails={pageDetails}
        updatePage={updatePage}
        getPublicUrl={getPublicUrl}
        removeImage={removeImage}
        createOrUpdateAvatar={createOrUpdateAvatar}
        redirectTo={redirectTo}
      />
    </div>
  );
}
