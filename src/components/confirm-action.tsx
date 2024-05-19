"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";

interface IProps {
  readonly buttonLabel: string | JSX.Element;
  readonly title: string | JSX.Element;
  readonly question: string | JSX.Element;
  readonly confirmAction: any;
  readonly isLoading?: boolean;
}

export function ConfirmAction({
  buttonLabel,
  question,
  title,
  confirmAction,
  isLoading,
}: IProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <Popover onOpenChange={setIsOpen} open={isOpen}>
      <PopoverTrigger asChild>
        <Button className="rounded-xl" variant={"destructive"} size={"icon"}>
          {buttonLabel}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">{title}</h4>
            <p className="text-sm text-muted-foreground">{question}</p>
          </div>
          <div className="space-x-2">
            <Button
              variant={"destructive"}
              onClick={confirmAction}
              isLoading={isLoading}
            >
              Delete
            </Button>
            <Button variant={"outline"} onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
