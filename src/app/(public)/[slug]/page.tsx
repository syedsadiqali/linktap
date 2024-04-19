import { headers } from "next/headers";
import PublicPage from "@/components/public-page";
import { getLinksByUserHandle } from "@/actions/linksActions";
import { notFound } from "next/navigation";
import { constructMetadata } from "@/lib/utils/seo";
import { getUserDetails } from "./getData";
import config from "@/config";
import { getSortedLinks } from "@/lib/utils";
import { getPublicUrl } from "@/lib/db/user";

let userCache = getUserDetails();

export async function generateMetadata({}) {
  const headersList = headers();

  let username = headersList.get("x-pathname") || "";

  while (username.charAt(0) === "/") {
    username = username.substring(1);
  }
  const { userDetails } = await userCache(username);

  return constructMetadata({
    title: `${userDetails?.full_name || "User"} – ${config.appName}`,
    description: userDetails?.bio || "List of Links",
  });
}

export default async function Page() {
  const headersList = headers();

  let username = headersList.get("x-pathname") || "";

  while (username.charAt(0) === "/") {
    username = username.substring(1);
  }

  const { userDetails } = await userCache(username);
  const { linksError, linksData } = await getLinksByUserHandle(username);

  if (linksError || !userDetails) {
    notFound();
  }
  
  const {publicUrl} = await getPublicUrl(userDetails?.avatar_id);
  

  return (
    <div className="flex flex-col items-center pt-16 w-full">
      {linksData && (
        <PublicPage
          links={getSortedLinks(linksData, userDetails?.links_sort_order)}
          userDetails={userDetails}
          avatarUrl={publicUrl}
        />
      )}
    </div>
  );
}
