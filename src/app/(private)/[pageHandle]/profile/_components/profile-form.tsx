"use client";

import ContentLoader from "react-content-loader";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { PagesRow } from "@/types/utils";
import { z } from "zod";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ImageUploadDialog from "@/components/image-upload-dialog";
import { getInitials, uuidv4 } from "@/lib/utils";
import { getPublicUrl, removeImage } from "@/server/actions/page";
import { createOrUpdateAvatar } from "@/lib/db/page";

interface IProps {
  user: any;
  pageDetails: PagesRow;
  isInitForm?: boolean;
  isLoading?: boolean;
  updatePage?: any;
  isSuspenseLoading?: boolean;
  getPublicUrl?: any;
  removeImage?: any;
  createOrUpdateAvatar?: any;
  redirectTo?: any;
}

export function ProfileForm({
  user,
  pageDetails,
  updatePage,
  isInitForm = false,
  isSuspenseLoading = false,
  redirectTo,
}: // getPublicUrl,
// removeImage,
// createOrUpdateAvatar,
IProps) {
  const profileFormSchema = z.object({
    username: z
      .string()
      .min(2, {
        message: "Username must be at least 2 characters.",
      })
      .max(30, {
        message: "Username must not be longer than 30 characters.",
      })
      .optional()
      .refine((bar) => {
        return bar !== undefined || !isInitForm;
      }, "username is required in init form"),
    email: z
      .string({
        required_error: "Please select an email to display.",
      })
      .email(),
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

  type ProfileFormValues = z.infer<typeof profileFormSchema>;

  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [avatarToShow, setAvatarToShow] = useState<string | null>(null);

  const defaultValues: Partial<ProfileFormValues> = {
    username: pageDetails.page_handle ?? "",
    bio: pageDetails.bio ?? "",
    email: user?.email,
    avatar_id: pageDetails.avatar_id,
    fullname: pageDetails.page_name ?? "",
  };

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: "onChange",
  });

  async function onSubmit(data: ProfileFormValues) {
    setIsLoading(true);

    if (user?.id) {
      const { data: dataA, error } = await updatePage(
        { page_handle: data.username, page_name: data.fullname, bio: data.bio },
        isInitForm ? undefined : pageDetails.page_handle
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
        if (isInitForm) {
          redirectTo(`/${dataA.page_handle}/dashboard`);
        } else {
          toast({ title: "Success", description: "Data Updation Succesfull" });
        }
      }
      setIsLoading(false);
    }
  }

  async function handleRemoveImage() {
    let { data: imageRemovedSuccess, error: imageRemovedError } =
      await removeImage(pageDetails.avatar_id as string);

    if (imageRemovedError) {
      toast({
        title: "Error",
        description: `Can't Remove Image because ${imageRemovedError.message}`,
        variant: "destructive",
      });
    }

    if (imageRemovedSuccess && user?.id && user?.user) {
      const { data: userUpdateSuccessdata, error: userUpdateError } =
        await updatePage({ avatar_id: null }, user.username as string);

      setAvatarToShow(null);

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

  async function getImage(val: string) {
    if (val) {
      let b = await getPublicUrl(val);
      setAvatarToShow(b.publicUrl);
    }
  }

  useEffect(() => {
    getImage(pageDetails?.avatar_id as string);
  }, []);

  // we should not replace cacheId everytime

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 max-w-md"
      >
        <FormField
          control={form.control}
          name="avatar_id"
          defaultValue={avatarToShow}
          render={({ field }) => {
            // let uncachedFile = avatarToShow
            //   ? (`${avatarToShow}?cache=${Date.now()}` as string)
            //   : null;

            return (
              <FormItem>
                <FormLabel>Avatar</FormLabel>
                <FormControl>
                  <>
                    <div className="flex flex-column items-center cursor-pointer">
                      <Avatar variant={"xxl"} className="mr-2">
                        <AvatarImage
                          src={avatarToShow as string}
                          className="ring-offset-2 ring-2"
                        />
                        <AvatarFallback>
                          {getInitials(pageDetails?.page_name as string)}
                        </AvatarFallback>
                      </Avatar>
                      {isSuspenseLoading ? (
                        <ContentLoader
                          width={"100%"}
                          height={100}
                          viewBox="0 0 100% 200"
                          backgroundColor="#d9d9d9"
                          foregroundColor="#ededed"
                          className="rounded-md"
                        >
                          <rect
                            x="10"
                            y="15"
                            rx="3"
                            ry="3"
                            width="80px"
                            height="30"
                          />
                          <rect
                            x="10"
                            y="50"
                            rx="3"
                            ry="3"
                            width="80px"
                            height="30"
                          />
                        </ContentLoader>
                      ) : (
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
                      )}
                    </div>

                    <ImageUploadDialog
                      open={open}
                      setOpen={setOpen}
                      aspect={1}
                      cropShape="round"
                      showGrid={false}
                      oldAvatarUrl={avatarToShow as string}
                      onSaveImage={async (croppedImage: File) => {
                        let updatedUrl;

                        let avatarId = pageDetails?.avatar_id;

                        if (!avatarId) {
                          // generate new id
                          avatarId = uuidv4();
                        }

                        let { error, data } = await createOrUpdateAvatar(
                          avatarId,
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

                        if (avatarId) {
                          form.setValue("avatar_id", avatarId);
                          getImage(avatarId.toString());
                        }

                        updatePage(
                          { avatar_id: avatarId.toString() },
                          pageDetails.page_handle as string
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
          defaultValue={pageDetails.page_handle as string}
          disabled={!isInitForm}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                {isSuspenseLoading ? (
                  <ContentLoader
                    width={"100%"}
                    height={36}
                    viewBox="0 0 100% 100"
                    backgroundColor="#d9d9d9"
                    foregroundColor="#ededed"
                    className="rounded-md"
                  >
                    <rect x="0" y="0" rx="3" ry="3" width="100%" height="50" />
                  </ContentLoader>
                ) : (
                  <Input placeholder="syedsadiqali" {...field} />
                )}
              </FormControl>
              <FormDescription>
                This is your public display name. You will not be able to change
                it.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="fullname"
          defaultValue={pageDetails?.page_name as string}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                {isSuspenseLoading ? (
                  <ContentLoader
                    width={"100%"}
                    height={36}
                    viewBox="0 0 100% 100"
                    backgroundColor="#d9d9d9"
                    foregroundColor="#ededed"
                    className="rounded-md"
                  >
                    <rect x="0" y="0" rx="3" ry="3" width="100%" height="50" />
                  </ContentLoader>
                ) : (
                  <Input placeholder="Mark Zukku" {...field} />
                )}
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {!isInitForm && (
          <FormField
            control={form.control}
            name="email"
            // TODO: build logic to change email
            defaultValue={user?.email}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  {isSuspenseLoading ? (
                    <ContentLoader
                      width={"100%"}
                      height={36}
                      viewBox="0 0 100% 100"
                      backgroundColor="#d9d9d9"
                      foregroundColor="#ededed"
                      className="rounded-md"
                    >
                      <rect
                        x="0"
                        y="0"
                        rx="3"
                        ry="3"
                        width="100%"
                        height="50"
                      />
                    </ContentLoader>
                  ) : (
                    <Input
                      placeholder="me@mymail.com"
                      {...field}
                      disabled={true}
                    />
                  )}
                </FormControl>
                <FormDescription>
                  This is your email. You will have to confirm if you want to
                  change it.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                {isSuspenseLoading ? (
                  <ContentLoader
                    width={"100%"}
                    height={60}
                    viewBox="0 0 100% 100"
                    backgroundColor="#d9d9d9"
                    foregroundColor="#ededed"
                    className="rounded-md"
                  >
                    <rect x="0" y="0" rx="3" ry="3" width="100%" height="60" />
                  </ContentLoader>
                ) : (
                  <Textarea
                    placeholder="Tell us a little bit about yourself"
                    className="resize-none"
                    {...field}
                  />
                )}
              </FormControl>
              <FormDescription>
                This bio is visible on your public facing profile page.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          isLoading={isLoading}
          disabled={isLoading || !form.formState.isDirty}
        >
          Update profile
        </Button>
      </form>
    </Form>
  );
}
