"use client";

import { Plus } from "lucide-react";
import { Suspense, useCallback, useEffect, useState } from "react";

import {
  getPageByPageHandle,
  getPublicUrl,
  updateSortingOrder,
} from "@/server/actions/page";
import PublicPage from "@/components/public-page";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import config from "@/config";
import { getInitials } from "@/lib/utils";
import { constructMetadata } from "@/lib/utils/seo";
import { LinksRow } from "@/types/utils";

import AddEditLink from "./_components/add-edit-link";
import LinksList from "./_components/links-list";
import { useLinks } from "@/hooks/useLinks";
import { useAddEditDialog } from "@/hooks/useAddEditDialog";
import ConfettiA from "@/components/confetti";
import { useQuery } from "@tanstack/react-query";
import { getLinksByPageHandle } from "@/server/actions/links";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata = constructMetadata({
  title: `Dashboard – ${config.appName}`,
  description: "Here you can Add / Edit links to be shown on your Page",
  canonicalUrlRelative: "/dashboard",
});

export default function Dashboard({
  pageHandle,
}: {
  readonly pageHandle: string;
}) {
  const [showConfetti, setShowConfetti] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>();

  const { isDialogOpen, linkToEdit, setIsDialogOpen } = useAddEditDialog();
  const { links, setLinks } = useLinks((state) => state);

  const {
    data: dataA,
    error: pageDetailsError,
    isLoading: pageLoading,
  } = useQuery({
    queryKey: [`dashboard-page-details`],
    queryFn: () => getPageByPageHandle(pageHandle),
    staleTime: 1000,
  });

  const {
    data: dataB,
    error: linksError,
    isLoading: linksLoading,
  } = useQuery({
    queryKey: [`dashboard-links`],
    queryFn: () => getLinksByPageHandle(pageHandle),
    staleTime: 0,
  });

  let pageDetails = dataA?.pageDetails;

  let sortOrder = pageDetails?.links_sort_order as string[];

  const getSortedLinks = useCallback(
    (linksData: any) => {
      return linksData?.sort(
        (a: LinksRow, b: LinksRow) =>
          sortOrder.indexOf(a.id) - sortOrder.indexOf(b.id)
      );
    },
    [sortOrder]
  );

  useEffect(() => {
    console.log("data", dataB?.linksData);
    // @ts-ignore
    setLinks(getSortedLinks(dataB?.linksData));
  }, [dataB, setLinks, getSortedLinks]);

  useEffect(() => {
    async function getAvatarUrl() {
      if (getPublicUrl) {
        const { publicUrl } = await getPublicUrl(
          pageDetails?.avatar_id as string
        );

        setAvatarUrl(publicUrl);
      }
    }

    getAvatarUrl();
  }, [sortOrder]);

  useEffect(() => {
    if (!isDialogOpen && linkToEdit?.id) {
      setIsDialogOpen(false, undefined);
    }
  }, [isDialogOpen, linkToEdit, setIsDialogOpen]);

  if (linksError || pageDetailsError) {
    return <div>some error happend</div>;
  }

  // if (linksLoading || pageLoading) {
  //   return (
  //     <div className="flex justify-center col-span-2 space-y-6 w-full h-[200px] items-center">
  //       <Loader2 className="animate-spin" />
  //     </div>
  //   );
  // }

  return (
    <div
      className="container flex items-start justify-center pt-4 w-full overflow-scroll no-scrollbar overflow-x-hidden"
      style={{ height: `calc(100vh - 80px)` }}
    >
      {showConfetti && <ConfettiA />}
      <div className="flex flex-col items-center justify-center pt-16 w-5/6 sm:4/6 md:w-4/6">
        <Suspense fallback={"hell;ldfskg;lsdkgf;lskd"}>
          <Avatar variant={"xl"}>
            <AvatarImage src={avatarUrl as string} />
            <AvatarFallback>
              {getInitials(pageDetails?.page_name as string)}
            </AvatarFallback>
          </Avatar>
        </Suspense>

        <div className="text-lg font-semibold">
          {pageLoading ? (
            <Skeleton className="h-6 w-[100px] text-center" />
          ) : (
            `@${pageDetails?.page_handle}`
          )}
        </div>

        <div className="w-4/5 sm:w-1/5 mt-2 mb-8 text-center ">
          {pageLoading ? (
            <Skeleton className="h-6 mt-1 w-[200px] text-center leading-7 [&:not(:first-child)]:mt-6 " />
          ) : (
            <p className="leading-7 [&:not(:first-child)]:mt-6 ">
              {pageDetails?.bio}
            </p>
          )}
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant={"default"} size={"lg"} className="my-4">
              <Plus size={25} /> Add New Link
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <AddEditLink
              setShowConfetti={setShowConfetti}
              pageDetails={pageDetails}
            />
          </DialogContent>
        </Dialog>
        {linksLoading ? (
          <>
            <Skeleton className={`h-24 w-full sm:w-5/6 lg:w-3/5 my-2`} />
            <Skeleton className={`h-24 w-full sm:w-5/6 lg:w-3/5 my-2`} />
          </>
        ) : (
          <LinksList
            pageDetails={pageDetails}
            links={links}
            setLinks={setLinks}
            sortOrder={pageDetails?.links_sort_order}
            updateSortingOrder={updateSortingOrder}
            isLoading={linksLoading}
          />
        )}
      </div>

      <div className="w-/6 hidden sm:w-2/6 md:1/6 md:block"></div>
      <div className="fixed w-1/6 sm:w-2/6 md:1/6 max-w-[300px] hidden md:block right-[10%] top-[20%] mx-auto bg-background border-border border-[14px] rounded-[2.5rem] h-[600px] shadow-xl">
        <div className="z-[100] w-[148px] h-[18px] bg-border top-0 rounded-b-[1rem] left-1/2 -translate-x-1/2 absolute"></div>
        <div className="z-[100] h-[46px] w-[3px] bg-border absolute -start-[17px] top-[124px] rounded-s-lg"></div>
        <div className="z-[100] h-[46px] w-[3px] bg-border absolute -start-[17px] top-[178px] rounded-s-lg"></div>
        <div className="z-[100] h-[64px] w-[3px] bg-border absolute -end-[17px] top-[142px] rounded-e-lg"></div>
        <div className="rounded-[2rem] overflow-hidden w-[272px] h-[572px] bg-background">
          {pageDetails && Boolean(links?.length) && (
            <PublicPage
              links={links}
              pageDetails={pageDetails}
              isPreview={true}
              avatarUrl={avatarUrl}
              className="h-[600px] overflow-y-scroll"
            />
          )}
        </div>
      </div>
    </div>
  );
}
