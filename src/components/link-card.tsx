"use client";

import React, { useState } from "react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LinksRow } from "@/types/utils";
import { PencilLine, Trash2 } from "lucide-react";
import Link from "next/link";
import { toast } from "./ui/use-toast";
import { SortableList } from "./SortableList";
import { Button } from "./ui/button";
import { deleteLinkByLinkId } from "@/lib/db/links";
import { useLinks } from "@/hooks/useLinks";
import { useAddEditDialog } from "@/hooks/useAddEditDialog";
import Image from "next/image";
import { ConfirmAction } from "./confirm-action";

interface IProps {
  link: LinksRow | Partial<LinksRow>;
  isEditable?: boolean;
  className?: string;
  isPreview?: boolean;
}

export const LinkCard = (props: IProps) => {
  return !props.isEditable ? (
    <Link
      href={`/l/${props.link.link_url}`}
      target="_blank"
      className={`${props.isPreview ? `lg:w-5/6` : `w-5/6`} lg:w-1/3 my-2`}
    >
      <CardA {...props} />
    </Link>
  ) : (
    <CardA {...props} className="w-full sm:w-5/6 lg:w-3/5 my-2" />
  );
};

const CardA = ({ link, isEditable, className }: IProps) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const { deleteLink } = useLinks();
  const { setIsDialogOpen } = useAddEditDialog();

  return (
    <Card
      className={`flex flex-row shadow-md shadow-accent items-center justify-between pr-4  ${className} ${
        !isEditable && `hover:scale-105	transition duration-100`
      }`}
    >
      <CardHeader className="w-full">
        <div className="flex justify-center items-center w-full">
          {link.link_type === "custom" ? (
            <></>
          ) : (
            <Image
              src={`/icons/${link?.link_type}.svg`}
              alt={link?.link_label || ""}
              width={50}
              height={50}
              className={`cursor-pointer p-1 box-content rounded-full`}
            />
          )}

          <div className="flex flex-row items-stretch justify-between w-full">
            <div className={link.link_type === "custom" ? "" : "ml-2"}>
              <CardTitle className="inline-flex items-center">
                <p className="line-clamp-2">{link.link_label}</p>
              </CardTitle>
              <CardDescription className="flex items-start flex-col">
                {isEditable ? <p className="">{link.link_url}</p> : <></>}
              </CardDescription>
            </div>
            {isEditable ? (
              <CardDescription className="">
                <div className="flex gap-1">
                  <ConfirmAction
                    buttonLabel={<Trash2
                      size={20}
                      className="cursor-pointer drop-shadow-md"
                    />}
                    title={'Confirm Delete'}
                    question={'Are you sure you want to delete this link ?'}
                    isLoading={isDeleting}
                    confirmAction={() => {
                      setIsDeleting(true);

                      deleteLinkByLinkId(link.id as string)
                        .then(() => {
                          // delete link in store

                          deleteLink(link.id as string);

                          toast({
                            title: "Success",
                            description: `Link Deleted Successfully`,
                          });
                        })
                        .finally(() => {
                          setIsDeleting(false);
                        });
                    }}
                  />
                  <Button
                    variant={"outline"}
                    className="rounded-xl"
                    // @ts-ignore
                    onClick={() => setIsDialogOpen(true, link)}
                    size={"icon"}
                  >
                    <PencilLine
                      size={20}
                      className="cursor-pointer drop-shadow-md"
                      absoluteStrokeWidth
                    />
                  </Button>
                </div>
              </CardDescription>
            ) : null}
          </div>
        </div>
      </CardHeader>
      {isEditable ? (
        <div className="flex">
          <SortableList.DragHandle />
        </div>
      ) : null}
    </Card>
  );
};
