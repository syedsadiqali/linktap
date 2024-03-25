import {
  getLinksByUserHandle,
} from "@/actions/linksActions";
import { notFound } from "next/navigation";
import { getCurrentAuthedUser } from "@/actions/userActions";
import Customize from "./customize";

export default async function Page() {
  const { linksError, linksData } = await getLinksByUserHandle();

  const { user, userDetails } = await getCurrentAuthedUser();

  if (!linksData || linksError || !userDetails) {
    notFound();
  }

  return (
    <Customize
      links={linksData}
      userDetails={userDetails}
    />
  );
}
