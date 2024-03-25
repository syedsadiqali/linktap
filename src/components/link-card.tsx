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
      className={`flex flex-row border-none shadow-md shadow-accent items-center justify-between pr-4  ${className} ${
        !isEditable && `hover:scale-105	transition duration-100`
      }`}
    >
      <CardHeader>
        <CardTitle className="inline-flex items-center">
          <p className="line-clamp-2">{link.link_label}</p>
        </CardTitle>
        <CardDescription className="flex items-start flex-col">
          {isEditable ? <p className="mb-8">{link.link_url}</p> : <></>}
          {isEditable ? (
            <div className="flex gap-1">
              <Button
                variant={"destructive"}
                className="rounded-xl "
                isLoading={isDeleting}
                size={"icon"}
                onClick={() => {
                  setIsDeleting(true);

                  deleteLinkByLinkId(link.id as number)
                    .then(() => {
                      // delete link in store

                      deleteLink(link.id as number);

                      toast({
                        title: "Success",
                        description: `Link Deleted Successfully`,
                      });
                    })
                    .finally(() => {
                      setIsDeleting(false);
                    });
                }}
              >
                <Trash2 size={20} className="cursor-pointer drop-shadow-md" />
              </Button>
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
          ) : null}
        </CardDescription>
      </CardHeader>
      {isEditable ? (
        <div className="flex">
          <SortableList.DragHandle />
        </div>
      ) : null}
    </Card>
  );
};
