import { saveWaitlistUser } from "@/server/actions/waitlist";
import PageClient from "./page-client";

export default function Page() {
  return <PageClient saveWaitlistUser={saveWaitlistUser} />;
}
