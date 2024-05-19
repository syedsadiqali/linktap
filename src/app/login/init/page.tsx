import { getPageByPageHandle, updatePage } from "@/server/actions/page";
import { getCurrentAuthedUser } from "@/server/actions/user";
import { ProfileForm } from "@/app/(private)/[pageHandle]/profile/_components/profile-form";
import { redirect } from "next/navigation";

async function redirectTo(to: string) {
  'use server'
  
  redirect(to);
}

export default async function Init() {
  const { user } = await getCurrentAuthedUser();

  const { pageDetails } = await getPageByPageHandle();

  if (!user) {
    redirect("/login");
  }

  return (
    pageDetails && (
      <div className="w-[50%] h-[100%] flex-1 flex mx-auto justify-center gap-2 max-w-lg items-center ">
        <ProfileForm
          user={user}
          pageDetails={pageDetails}
          isInitForm={true}
          updatePage={updatePage}
          redirectTo={redirectTo}
        />
      </div>
    )
  );
}
