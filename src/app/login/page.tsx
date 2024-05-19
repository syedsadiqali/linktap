import { getPageByPageHandle } from "@/server/actions/page";
import LoginForm from "./login-form";
import { getCurrentAuthedUser } from "@/server/actions/user";
import { redirect } from "next/navigation";

export default async function Login() {
  const { user } = await getCurrentAuthedUser();

  const { pageDetails } = await getPageByPageHandle();

  const isLoggedInAndPageHandleNotCreated =
    user?.id && !pageDetails?.page_handle;
    

  if (isLoggedInAndPageHandleNotCreated) {
    redirect("/login/init");
  }
  
  if(user?.id) {
    redirect(`${pageDetails?.page_handle}/dashboard`)
  }

  return <LoginForm />;
}
