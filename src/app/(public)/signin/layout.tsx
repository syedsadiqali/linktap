import { ReactNode } from "react";
import config from "@/config";
import { constructMetadata } from "@/lib/utils/seo";

export const metadata = constructMetadata({
  title: `Sign-in to ${config.appName}`,
  canonicalUrlRelative: "/auth/signin",
});

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
