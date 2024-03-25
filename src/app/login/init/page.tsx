import { redirect } from "next/navigation";
import { revalidateData } from "@/actions/commonActions";
import { getCurrentAuthedUser } from "@/actions/userActions";
import { ProfileForm } from "@/app/(private)/profile/_components/profile-form";

export const dynamic = "force-dynamic";

export default async function Login() {
  const { user, userDetails } = await getCurrentAuthedUser();

  if (!user) {
    redirect("/login");
  }

  return (
    userDetails && (
      <div className="w-[50%] h-[100%] flex-1 flex mx-auto justify-center gap-2 max-w-lg items-center ">
        <ProfileForm
          user={user}
          userDetails={userDetails}
          revalidateCache={revalidateData}
          isInitForm={true}
        />
      </div>
    )
  );
}
