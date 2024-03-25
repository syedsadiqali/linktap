"use client";

import { Button } from "@/components/ui/button";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageUploadDialog from "@/components/image-upload-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";
import {
  getPublicUrl,
  removeImage,
  createOrUpdateAvatar,
  updateUser,
} from "@/lib/db/user";
import { Textarea } from "@/components/ui/textarea";

interface IProps {
  user: any;
  userDetails: any;
  revalidateCache: any;
}

export default function InitForm({
  user,
  userDetails,
  revalidateCache,
}: IProps) {
  const [open, setOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  type ProfileFormValues = z.infer<typeof profileFormSchema>;

  const defaultValues: Partial<ProfileFormValues> = {
    username: "",
  };

  const profileFormSchema = z.object({
    username: z
      .string()
      .min(2, {
        message: "Username must be at least 2 characters.",
      })
      .max(30, {
        message: "Username must not be longer than 30 characters.",
      }),
    fullname: z
      .string()
      .min(2, {
        message: "Name must be at least 2 characters.",
      })
      .max(30, {
        message: "Name must not be longer than 30 characters.",
      }),
    bio: z.string().max(160).min(0),
    avatar_id: z.string().nullable(),
  });

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: "onChange",
  });

  async function onSubmit(data: ProfileFormValues) {
    setIsLoading(true);
    if (userDetails?.user_handle) {
      const { data: dataA, error } = await updateUser(
        data,
        userDetails?.user_handle
      );

      if (error) {
        form.setError("username", {
          type: "custom",
          message:
            error?.code === "23505"
              ? "Username already exists!!"
              : error?.message,
        });
      } else {
        toast({ title: "Success", description: "Data Updation Succesfull" });
      }
      setIsLoading(false);
      revalidateCache("/", true);
    }
  }

  async function handleRemoveImage() {
    let { data: imageRemovedSuccess, error: imageRemovedError } =
      await removeImage(userDetails.user_handle as string);

    if (imageRemovedError) {
      toast({
        title: "Error",
        description: `Can't Remove Image because ${imageRemovedError.message}`,
        variant: "destructive",
      });
    }

    if (imageRemovedSuccess && userDetails?.user_handle) {
      const { data: userUpdateSuccessdata, error: userUpdateError } =
        await updateUser(
          { avatar_id: null },
          userDetails.user_handle as string
        );

      if (userUpdateError) {
        toast({
          title: "Error",
          description: `Can't Remove Image because ${userUpdateError.message}`,
          variant: "destructive",
        });
      } else {
        form.setValue("avatar_id", null);
        toast({
          title: "Success",
          description: `Image Removed Successfully`,
        });
      }
    }
  }

  return (
    <div className="w-[50%] h-[100%] flex-1 flex mx-auto justify-center gap-2 max-w-lg items-center ">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-5/6">
          <Card className="w-full">
            <CardHeader>
              <CardTitle> Choose a User Handle </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <FormField
                control={form.control}
                name="avatar_id"
                defaultValue={userDetails.user_handle}
                render={({ field }) => {
                  let uncachedFile = field?.value
                    ? (`${field?.value}?cache=${Date.now()}` as string)
                    : null;

                  return (
                    <FormItem>
                      <FormLabel>Avatar</FormLabel>
                      <FormControl>
                        <>
                          <div className="flex flex-column items-center cursor-pointer">
                            <Avatar variant={"xxl"} className="mr-2">
                              <AvatarImage
                                src={uncachedFile as string}
                                className="ring-offset-2 ring-2"
                              />
                              <AvatarFallback>
                                {getInitials(userDetails?.full_name as string)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col space-y-2">
                              <Button
                                variant={"secondary"}
                                onClick={() => setOpen(true)}
                                type={"button"}
                              >
                                {field?.value ? `Update` : `Upload`}
                              </Button>
                              {field?.value && (
                                <Button
                                  variant={"destructive"}
                                  type={"button"}
                                  onClick={handleRemoveImage}
                                >
                                  Remove
                                </Button>
                              )}
                            </div>
                          </div>

                          <ImageUploadDialog
                            open={open}
                            setOpen={setOpen}
                            aspect={1}
                            cropShape="round"
                            showGrid={false}
                            oldAvatarUrl={uncachedFile as string}
                            onSaveImage={async (croppedImage: File) => {
                              let updatedUrl;

                              let { error, data } = await createOrUpdateAvatar(
                                userDetails.user_handle as string,
                                croppedImage
                              );

                              if (error) {
                                toast({
                                  title: "Error",
                                  description: `Can't Create / Update Image because ${error.message}`,
                                  variant: "destructive",
                                });
                                return;
                              }

                              let publicUrl = await getPublicUrl(
                                userDetails.user_handle as string
                              );

                              if (publicUrl?.publicUrl) {
                                form.setValue(
                                  "avatar_id",
                                  publicUrl.publicUrl
                                );
                              }

                              updateUser(
                                { avatar_id: publicUrl.publicUrl },
                                userDetails.user_handle as string
                              );

                              setOpen(false);
                            }}
                          />
                        </>
                      </FormControl>

                      <FormDescription>
                        This is your public display avatar.
                      </FormDescription>

                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="username"
                defaultValue={"zuck"}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="zuck" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is your public display name.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fullname"
                defaultValue={userDetails?.full_name as string}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Mark Zukku" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is your public display name.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us a little bit about yourself"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      This bio is visible on your public facing profile page.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                isLoading={isLoading}
                disabled={isLoading || !form.formState.isDirty}
                variant={
                  isLoading || !form.formState.isDirty ? "ghost" : "default"
                }
                size={"lg"}
              >
                Update profile
              </Button>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
}
