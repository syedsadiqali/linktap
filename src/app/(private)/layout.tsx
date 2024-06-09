import { getPageByPageHandle } from "@/server/actions/page";
import { getCurrentAuthedUser } from "@/server/actions/user";
import AppHeader from "@/components/app-header";
// import AppHeader from "@/components/AppHeader";
import { headers } from "next/headers";
import Link from "next/link";

import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function Layout({ children }: any) {
  // add default page to query params :-

  // when the user comes through init, mark the first created page as default page
  //

  const { user } = await getCurrentAuthedUser();

  const { pageDetails } = await getPageByPageHandle();

  const isLoggedInAndPageHandleNotCreated =
    user?.id && !pageDetails?.page_handle;

  const headersList = headers();

  let pathname = headersList.get("x-pathname") || "";

  while (pathname.charAt(0) === "/") {
    pathname = pathname.substring(1);
  }

  if (!user) {
    redirect("/login");
  }

  if (isLoggedInAndPageHandleNotCreated && pathname !== "login/init") {
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
          <AppHeader user={user} pageDetails={pageDetails} />
        </Suspense>
      </section>
      <main className="">{children}</main>
    </>
  );
}
