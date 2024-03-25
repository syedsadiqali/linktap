import { getCurrentAuthedUser } from "@/actions/userActions";
import Dashboard from "./dashboard";
export const dynamic = "force-dynamic";

export default async function Page() {
  const { user, userDetails } = await getCurrentAuthedUser();
  
  return <Dashboard userDetails={userDetails} />;
}
