import { ReactNode } from "react";
import config from "@/config";
import { constructMetadata } from "@/lib/utils/seo";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getCurrentAuthedUser } from "@/server/actions/user";
import { getPageByPageHandle } from "@/server/actions/page";

// export const metadata = constructMetadata({
//   title: `Sign-in to ${config.appName}`,
//   //   canonicalUrlRelative: "/auth/signin",
// });

export default async function Layout({ children }: { children: ReactNode }) {

  
  const headersList = headers();

  let pathname = headersList.get("x-pathname") || "";

  while (pathname.charAt(0) === "/") {
    pathname = pathname.substring(1);
  }
  
  // console.log('waka waka 1', user)

  // if (!user?.id && pathname !== "login") {
  //   console.log('me dobara login yaha hu')

  //   // redirect("/login");
  // }
  
  // console.log('me true hun', isLoggedInAndPageHandleNotCreated, pathname)



  return (
    <div className="flex h-[100vh]">
      <div className="w-[50%] h-[100%] bg-secondary items-center bg-[url('/login-cover.jpg')] bg-center-bottom bg-no-repeat bg-cover mb-8 md:bg-cover hidden md:flex ">
        {/* <Image
          src="/login-cover.jpg"
          alt="Background"
          className="object-cover w-full"
          fill
        /> */}
        <div className="relative hero-overlay bg-neutral bg-opacity-30"></div>
      </div>

      <>{children}</>
    </div>
  );
}
