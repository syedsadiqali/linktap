import { constructMetadata } from "@/lib/utils/seo";
import config from "@/config";
import { revalidateData } from "@/server/actions/common";
import Dashboard from "./dashboard";

export const metadata = constructMetadata({
  title: `Profile Page – ${config.appName}`,
  description: "Set your profile like User Handle, Full Name, Bio etc",
});

export default function Loading() {
  return (
    <div className="space-y-6 max-w-md w-80">
      {/* @ts-ignore */}
      <Dashboard pageDetails={{}} />
    </div>
  );
}
