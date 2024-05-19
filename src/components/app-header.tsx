"use client";

import Link from "next/link";
import { CircleUser, ExternalLink, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import LinkTapLogo from "./LinkTapLogo";
import { ModeToggle } from "./dark-mode-toggle";
import { usePathname } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { PagesRow } from "@/types/utils";

function AppHeader({
  user,
  pageDetails,
}: {
  user: any;
  pageDetails: PagesRow | null;
}) {
  const links: {
    href: string;
    label: string;
    comingSoon?: boolean;
    icon?: any;
    external?: boolean;
  }[] = [
    {
      href: `/${pageDetails?.page_handle}/dashboard`,
      label: "Dashobard",
    },
    {
      href: `/${pageDetails?.page_handle}/profile`,
      label: "Profile",
    },

    {
      href: `/${pageDetails?.page_handle}/analytics?aFor=links&interval=24h`,
      label: "Analytics",
    },
    {
      href: "/customize",
      label: "Customize",
      comingSoon: true,
    },
  ];

  const pathname = usePathname();

  return (
    <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-semibold md:text-base"
        >
          <LinkTapLogo />
          <span className="sr-only">LinkTap</span>
        </Link>
        {links?.map((link, index) =>
          link.comingSoon ? (
            <TooltipProvider key={index}>
              <Tooltip delayDuration={100}>
                <TooltipTrigger asChild>
                  <Button
                    variant={"link"}
                    className="p-0 text-muted-foreground transition-colors no-underline hover:no-underline"
                  >
                    {link.label}
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-accent  text-black">
                  <p>Coming Soon!</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <Link
              key={index}
              href={link.href}
              className={`${
                link.href.includes(pathname)
                  ? "text-foreground"
                  : "text-muted-foreground"
              } transition-colors hover:text-foreground flex justify-center items-center gap-1`}
              target={link.external ? "_blank" : "_self"}
            >
              {link.label}
              {link.icon}
            </Link>
          )
        )}
      </nav>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <nav className="grid gap-6 text-lg font-medium">
            {links?.map((link, index) => (
              <Link
                key={index}
                href={`${link.comingSoon ? "" : link.href}`}
                className={`${
                  link.href.includes(pathname) || !link.comingSoon
                    ? "text-foreground"
                    : "text-muted-foreground"
                } transition-colors hover:text-foreground`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              key={100}
              href={`/${pageDetails?.page_handle}`}
              className={`${
                pathname === pageDetails?.page_handle
                  ? "text-foreground"
                  : "text-muted-foreground"
              } transition-colors hover:text-foreground flex gap-1`}
              target={"_blank"}
            >
              Preview
              <ExternalLink />
            </Link>
          </nav>
        </SheetContent>
      </Sheet>
      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <form className="ml-auto flex-1 sm:flex-initial">
          {/* <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
            />
          </div> */}
        </form>
        <Link
          key={99}
          href={`/${pageDetails?.page_handle}`}
          className={`hidden md:flex ${
            pathname === pageDetails?.page_handle
              ? "text-foreground"
              : "text-muted-foreground"
          } transition-colors hover:text-foreground flex justify-center items-center gap-1`}
          target={"_blank"}
        >
          Preview
          <ExternalLink />
        </Link>
        <ModeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
              <CircleUser className="h-5 w-5" />
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {/* <DropdownMenuItem onClick={}>Settings</DropdownMenuItem> */}
            {/* <DropdownMenuItem>Support</DropdownMenuItem> */}
            {/* <DropdownMenuSeparator /> */}
            <form
              action="/auth/sign-out"
              method="post"
              className="flex flex-col"
            >
              <DropdownMenuItem>
                <button type="submit">Logout</button>
              </DropdownMenuItem>
            </form>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

export default AppHeader;
