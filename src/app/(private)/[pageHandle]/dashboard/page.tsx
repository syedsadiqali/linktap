import Dashboard from "./dashboard";
import { getPageByPageHandle, getPublicUrl } from "@/server/actions/page";
import { notFound } from "next/navigation";
import { getLinksByPageHandle } from "@/server/actions/links";

// export const dynamic = "force-dynamic";

export default async function Page({
  params,
}: {
  params: { pageHandle: string };
}) {
  const { pageDetails } = await getPageByPageHandle(params.pageHandle);

  if (!pageDetails) {
    return notFound();
  }

  return (
    <Dashboard
      pageDetails={pageDetails}
      getLinksByPageHandle={getLinksByPageHandle}
      getPublicUrl={getPublicUrl}
    />
  );
}
