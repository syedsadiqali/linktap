import { getCurrentAuthedUser } from "@/actions/userActions";
import AppHeader from "@/components/app-header";
// import AppHeader from "@/components/AppHeader";
import { headers } from "next/headers";

import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function Layout({ children }: any) {
  const { user, userDetails } = await getCurrentAuthedUser();

  const isLoggedInAndUserHandleNotCreated =
    user?.id && !userDetails?.user_handle;

  const headersList = headers();

  let pathname = headersList.get("x-pathname") || "";

  while (pathname.charAt(0) === "/") {
    pathname = pathname.substring(1);
  }
  
  if(!user) {
    redirect('/login');
  }

  if (isLoggedInAndUserHandleNotCreated && pathname !== "login/init") {
    redirect("/login/init");
  }

  return (
    <>
      <section>
        <Suspense
          fallback={
            <div className="flex w-full px-4 lg:px-40 py-4 items-center text-center gap-8 justify-between h-[69px]" />
          }
        >
          <AppHeader user={user} userDetails={userDetails} />
        </Suspense>
      </section>
      <main className="">{children}</main>
    </>
  );
}
