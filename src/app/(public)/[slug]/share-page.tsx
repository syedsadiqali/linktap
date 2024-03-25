import { headers } from "next/headers";
import PublicPage from "@/components/public-page";
import { getLinksByUserHandle } from "@/actions/linksActions";
import { notFound } from "next/navigation";
import { constructMetadata } from "@/lib/utils/seo";
import { getUserDetails } from "./getData";
import config from "@/config";

export const dynamic = "force-dynamic";


export default function Page() {
  const headersList = headers();

  let username = headersList.get("x-pathname") || "";

  while (username.charAt(0) === "/") {
    username = username.substring(1);
  }



  return (
    <div className="flex flex-col items-center pt-16 w-full">
		
    </div>
  );
}
