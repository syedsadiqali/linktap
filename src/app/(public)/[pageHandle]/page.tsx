import PublicPage from "@/components/public-page";
import { notFound } from "next/navigation";
import { constructMetadata } from "@/lib/utils/seo";
import config from "@/config";
import { getSortedLinks } from "@/lib/utils";
import { getPageByPageHandle, getPublicUrl } from "@/server/actions/page";
import { getLinksByPageHandle } from "@/server/actions/links";
import { waitUntil } from "@vercel/functions"

async function getPageDetails(page_handle: string) {
  const { pageDetails } = await getPageByPageHandle(page_handle);

  return { pageDetails };
}

async function getPublicUrlA(avatar_id: string) {
  const { publicUrl } = await getPublicUrl(avatar_id);

  return { publicUrl };
}

async function getLinksData(page_handle: string) {
  const { linksData } = await getLinksByPageHandle(page_handle);

  return { linksData };
}

export async function generateMetadata({
  params,
}: {
  params: { pageHandle: string };
}) {
  const { pageDetails } = await getPageDetails(params.pageHandle);

  return constructMetadata({
    title: `${pageDetails?.page_name || "User"} – ${config.appName}`,
    description: pageDetails?.bio || "List of Links",
  });
}

export default async function Page({
  params,
}: {
  params: { pageHandle: string };
}) {
  

  
  const { pageDetails } = await getPageDetails(params.pageHandle);
  const { linksData } = await getLinksData(params.pageHandle);
  
  if (!pageDetails || !linksData) {
    notFound();
  }

  const { publicUrl } = await getPublicUrlA(pageDetails?.avatar_id as string);

  return (
    <div className="flex flex-col items-center pt-16 w-full">
      <PublicPage
        links={getSortedLinks(linksData, pageDetails?.links_sort_order)}
        pageDetails={pageDetails}
        avatarUrl={publicUrl}
      />
    </div>
  );
}
