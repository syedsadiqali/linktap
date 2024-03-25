"use client";

import { constructMetadata } from "@/lib/utils/seo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { Suspense, useEffect, useState } from "react";
import PublicPage from "@/components/public-page";
import { LinksRow, UsersRow } from "@/types/utils";
import config from "@/config";

export const metadata = constructMetadata({
  title: `Customize – ${config.appName}`,
  description: "Here you can Add / Edit links to be shown on your Page",
  canonicalUrlRelative: "/customize"
});

export default function Customize({
  userDetails,
  links,
}: {
  userDetails: UsersRow;
  links: LinksRow[];
}) {
  const [theme, setTheme] = useState("light");

  return (
    userDetails && (
      <div className="flex items-center justify-center pt-4 w-full">
        <div className="flex flex-col items-center justify-center pt-16 w-5/6 md:w-4/6">
          <Suspense fallback={"hell;ldfskg;lsdkgf;lskd"}>
            <Avatar variant={"xl"}>
              <AvatarImage src={userDetails?.avatar_id as string} />
              <AvatarFallback>
                {getInitials(userDetails?.full_name as string)}
              </AvatarFallback>
            </Avatar>
          </Suspense>
          <div className="text-lg font-semibold">
            @{userDetails?.user_handle}
          </div>

          <div className="w-1/5 mt-2 mb-8 text-center">
            <p className="leading-7 [&:not(:first-child)]:mt-6">
              {userDetails?.bio}
            </p>
          </div>

          <div>
            <div onClick={() => setTheme("pastel")}>pastel theme</div>
            <div onClick={() => setTheme("halloween")}>halloween theme</div>
          </div>
        </div>
        <div className="w-1/6 border-[6px] border-black dark:border-primary rounded-md mr-8 h-[600px] hidden md:block overflow-y-scroll">
          {userDetails && links?.length && (
            <PublicPage
              links={links}
              userDetails={userDetails}
              isPreview={true}
              theme={theme}
            />
          )}
        </div>
      </div>
    )
  );
}
