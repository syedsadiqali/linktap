"use client";

import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { useAddEditDialog } from "@/hooks/useAddEditDialog";
import { useLinks } from "@/hooks/useLinks";
import { addLinkFn, updateLinkByLinkId } from "@/lib/db/links";
import { toast } from "@/components/ui/use-toast";
import Image from "next/image";

export default function AddEditLink({ setShowConfetti, userDetails }: any) {
  const [isUpdating, setIsUpdating] = useState(false);

  const { links, updateLink, addLink } = useLinks();
  const { linkToEdit, setIsDialogOpen } = useAddEditDialog();

  const isEditForm = linkToEdit?.id;

  const formSchema = z.object({
    link_label: z.string().min(2, {
      message: "Please add a link label",
    }),
    link_type: z.string({ required_error: "Please add a Link Type" }),
    link_url: z.string().trim().url(),
  });

  const link_types = [
    { label: "Youtube", value: "youtube" },
    { label: "Facebook", value: "facebook" },
    { label: "Custom", value: "custom" },
  ] as const;

  type FormValues = z.infer<typeof formSchema>;

  const defaultValues: Partial<FormValues> = {
    link_type: linkToEdit?.link_type ?? "custom",
    link_label: linkToEdit?.link_label ?? "",
    link_url: linkToEdit?.link_url ?? "",
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  async function onSubmit(data: FormValues) {
    setIsUpdating(true);

    (isEditForm
      ? updateLinkByLinkId(linkToEdit.id, {
          ...data,
        })
      : addLinkFn({ ...data, user_handle: userDetails?.user_handle as string })
    )
      .then((link) => {
        if (isEditForm) {
          updateLink(link.id, link);
          toast({
            title: `Success!`,
            description: `Link has been updated successfully!`,
          });
        } else {
          addLink(link);

          toast({
            title: `Success!`,
            description: `Link has been added successfully!`,
          });

          if (links?.length === 0) {
            setShowConfetti(true);
            setTimeout(() => {
              setShowConfetti(false);
            }, 5000);
          }
        }

        setIsDialogOpen(false);
        form.reset({});
      })
      .catch((err: Error) => {
        console.log(err);
        form.setError("link_url", {
          type: "custom",
          message:
            err.cause === `duplicate_link`
              ? `This link Already Exist on your Page !!`
              : err.message,
        });
      })
      .finally(() => setIsUpdating(false));
  }

  useEffect(() => {
    if (!open) {
      form.reset({});
    }
  }, [open]);

  useEffect(() => {
    const subscription = form.watch((value, { name, type }) =>
      console.log(value, name, type)
    );
    return () => subscription.unsubscribe();
  }, [form.watch]);

  const types = ["youtube", "reddit", "telegram", "facebook"];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((data) => onSubmit(data))} className="">
        <DialogHeader className="mb-6">
          <DialogTitle>
            {isEditForm ? `Update Link` : `Add New Link`}
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col ">
          <FormField
            key={3}
            control={form.control}
            name="link_type"
            render={({ field }) => (
              <FormItem className="mb-4">
                <FormLabel>Link Type</FormLabel>
                <FormControl key={1}>
                  <section className="flex gap-1">
                    {types?.map((type, index) => {
                      return (
                        <Image
                          key={index}
                          src={`/icons/${type}.svg`}
                          alt={type}
                          width={50}
                          height={50}
                          className={`cursor-pointer p-1 box-content rounded-full border-[2px]  ${
                            field.value === type
                              ? "border-primary"
                              : "border-secondary"
                          }`}
                          onClick={() => {
                            field.onChange(field.value === type ? "" : type);
                          }}
                        />
                      );
                    })}
                  </section>
                </FormControl>
                <FormDescription>This is the type of link</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            key={1}
            control={form.control}
            name="link_label"
            render={({ field }) => (
              <FormItem className="mb-4">
                <FormLabel>Label</FormLabel>
                <FormControl>
                  <Input placeholder="youtube" {...field} />
                </FormControl>
                {/* <FormDescription>This is the type of link</FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            key={2}
            name="link_url"
            render={({ field }) => (
              <FormItem className="mb-4">
                <FormLabel>Link Url</FormLabel>
                <FormControl>
                  <Input placeholder="youtube" {...field} />
                </FormControl>
                {/* <FormDescription>This is the type of link</FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <DialogFooter className="sm:justify-start mt-6">
          <Button
            type="submit"
            isLoading={isUpdating}
            disabled={isUpdating || !form.formState.isDirty}
            variant={
              isUpdating || !form.formState.isDirty ? "ghost" : "default"
            }
          >
            {isEditForm ? `Update Link` : `Add Link`}{" "}
          </Button>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </form>
    </Form>
  );
}
