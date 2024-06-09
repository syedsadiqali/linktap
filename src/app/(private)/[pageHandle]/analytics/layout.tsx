import { SidebarNav } from "@/components/sidebar-nav";
import { Separator } from "@/components/ui/separator";
import { Metadata } from "next";
import Filters from "./_components/filters";

import config from "@/config";
import { constructMetadata } from "@/lib/utils/seo";

export const metadata = constructMetadata({
  title: `Analytics - ${config.appName}`,
  description: "Open Source Link In Bio Tool",
});

const sidebarNavItems = [
  {
    title: "Profile",
    href: "/profile",
  },
];

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default async function SettingsLayout({
  children,
}: SettingsLayoutProps) {
  return (
    <div className="container relative flex flex-col items-center">
      <div className=" space-y-6 p-10 pb-16 w-full">
        
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <div className="flex-1 w-full">{children}</div>
        </div>
      </div>
    </div>
  );
}
