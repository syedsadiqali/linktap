"use client";

import { Loader2, Plus } from "lucide-react";
import { Suspense, useCallback, useEffect, useState } from "react";

import { updateSortingOrder } from "@/actions/userActions";
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
import { getLinksByUserHandle } from "@/lib/db/links";
import { useLinks } from "@/hooks/useLinks";
import { useAddEditDialog } from "@/hooks/useAddEditDialog";
import { getPublicUrl } from "@/lib/db/user";
import ConfettiA from "@/components/confetti";

export const metadata = constructMetadata({
  title: `Dashboard – ${config.appName}`,
  description: "Here you can Add / Edit links to be shown on your Page",
  canonicalUrlRelative: "/dashboard",
});

export default function Dashboard({ userDetails }: any) {
  const [showConfetti, setShowConfetti] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>();

  const { isDialogOpen, linkToEdit, setIsDialogOpen } = useAddEditDialog();
  const { links, setLinks } = useLinks((state) => state);

  let sortOrder = userDetails?.links_sort_order as number[];

  let isNoLinks = links?.length === 0;
  // let isNoLinks = true;

  const getSortedLinks = useCallback(
    (linksData: any) => {
      return linksData.sort(
        (a: LinksRow, b: LinksRow) =>
          sortOrder.indexOf(a.id) - sortOrder.indexOf(b.id)
      );
    },
    [sortOrder]
  );

  useEffect(() => {}, [links]);

  useEffect(() => {
    async function getLinks() {
      setIsLoading(true);
      const { linksData, linksError } = await getLinksByUserHandle();

      if (linksError) {
        //
        console.log(linksError);
      }

      if (linksData && sortOrder) {
        setLinks(getSortedLinks(linksData));
        setIsLoading(false);
      }
    }

    async function getAvatarUrl() {
      const { publicUrl } = await getPublicUrl(userDetails?.avatar_id);

      setAvatarUrl(publicUrl);
    }

    getLinks();
    getAvatarUrl();
  }, [sortOrder]);

  useEffect(() => {
    if (!isDialogOpen && linkToEdit?.id) {
      setIsDialogOpen(false, undefined);
    }
  }, [isDialogOpen, linkToEdit]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-12">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <div
      className="flex items-start justify-center pt-4 w-full overflow-scroll overflow-x-hidden"
      style={{ height: `calc(100vh - 80px)` }}
    >
      {showConfetti && <ConfettiA />}
      <div className="flex flex-col items-center justify-center pt-16 w-5/6 md:w-4/6">
        <Suspense fallback={"hell;ldfskg;lsdkgf;lskd"}>
          <Avatar variant={"xl"}>
            <AvatarImage src={avatarUrl as string} />
            <AvatarFallback>
              {getInitials(userDetails?.full_name as string)}
            </AvatarFallback>
          </Avatar>
        </Suspense>
        <div className="text-lg font-semibold">@{userDetails?.user_handle}</div>

        <div className="w-4/5 sm:w-1/5 mt-2 mb-8 text-center ">
          <p className="leading-7 [&:not(:first-child)]:mt-6">
            {userDetails?.bio}
          </p>
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
              userDetails={userDetails}
            />
          </DialogContent>
        </Dialog>

        {links && userDetails && (
          <LinksList
            user={userDetails}
            links={links}
            setLinks={setLinks}
            sortOrder={userDetails?.links_sort_order}
            updateSortingOrder={updateSortingOrder}
          />
        )}
      </div>
      {!isNoLinks && (
        <>
          <div className="w-1/6 hidden lg:block"></div>
          <div className="fixed w-1/6 max-w-[300px] hidden lg:block right-[10%] top-[20%] mx-auto bg-background border-border border-[14px] rounded-[2.5rem] h-[600px] shadow-xl">
            <div className="z-[100] w-[148px] h-[18px] bg-border top-0 rounded-b-[1rem] left-1/2 -translate-x-1/2 absolute"></div>
            <div className="z-[100] h-[46px] w-[3px] bg-border absolute -start-[17px] top-[124px] rounded-s-lg"></div>
            <div className="z-[100] h-[46px] w-[3px] bg-border absolute -start-[17px] top-[178px] rounded-s-lg"></div>
            <div className="z-[100] h-[64px] w-[3px] bg-border absolute -end-[17px] top-[142px] rounded-e-lg"></div>
            <div className="rounded-[2rem] overflow-hidden w-[272px] h-[572px] bg-background">
              {userDetails && Boolean(links?.length) && (
                <PublicPage
                  links={links}
                  userDetails={userDetails}
                  isPreview={true}
                  avatarUrl={avatarUrl}
                  className="h-[600px] overflow-y-scroll"
                />
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
