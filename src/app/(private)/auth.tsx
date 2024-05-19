"use client";

import { getPageByPageHandle } from "@/server/actions/page";
import { getCurrentAuthedUser } from "@/server/actions/user";
import { useEffect, useState } from "react";

export default function Auth({ children }: any) {
  const [user, setUser] = useState();
  const [pageDetails, setPageDetails] = useState();

  useEffect(() => {
    async function getData() {
      Promise.all([getCurrentAuthedUser(), getPageByPageHandle()]).then(
        (res) => {
          console.log(res);
          // setUser(res[0]);
          // setPageDetails(res[1])
        },
      );
    }

    getData();
  }, []);

  // const isLoggedInAndPageHandleNotCreated =
  //   user?.id && !pageDetails?.page_handle;

  // const headersList = headers();

  // let pathname = headersList.get("x-pathname") || "";

  // while (pathname.charAt(0) === "/") {
  //   pathname = pathname.substring(1);
  // }

  // if (!user) {
  //   redirect("/login");
  // }

  // if (isLoggedInAndPageHandleNotCreated && pathname !== "login/init") {
  //   redirect("/login/init");
  // }

  return <>{children}</>;
}
