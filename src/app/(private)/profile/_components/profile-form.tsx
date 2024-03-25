"use client";

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
import { UsersRow } from "@/types/utils";
import { z } from "zod";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ImageUploadDialog from "@/components/image-upload-dialog";
import { getInitials, uuidv4 } from "@/lib/utils";
import {
  getPublicUrl,
  removeImage,
  createOrUpdateAvatar,
  updateUser,
} from "@/lib/db/user";

const profileFormSchema = z.object({
  username: z
    .string()
    .min(2, {
      message: "Username must be at least 2 characters.",
    })
    .max(30, {
      message: "Username must not be longer than 30 characters.",
    }),
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

interface IProps {
  user: any;
  revalidateCache: any;
  userDetails: UsersRow;
  isInitForm?: boolean;
}

export function ProfileForm({
  user,
  userDetails,
  revalidateCache,
  isInitForm = false,
}: IProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [avatarToShow, setAvatarToShow] = useState<string | null>(null);

  const defaultValues: Partial<ProfileFormValues> = {
    username: userDetails.user_handle ?? "",
    bio: userDetails.bio ?? "",
    email: user?.email,
    avatar_id: userDetails.avatar_id,
    fullname: userDetails.full_name ?? "",
  };

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: "onChange",
  });

  async function onSubmit(data: ProfileFormValues) {
    setIsLoading(true);
    if (user?.id) {
      const { data: dataA, error } = await updateUser(
        { user_handle: data.username, full_name: data.fullname, bio: data.bio },
        user?.id
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
      await removeImage(userDetails.avatar_id as string);

    if (imageRemovedError) {
      toast({
        title: "Error",
        description: `Can't Remove Image because ${imageRemovedError.message}`,
        variant: "destructive",
      });
    }

    if (imageRemovedSuccess && user?.id) {
      const { data: userUpdateSuccessdata, error: userUpdateError } =
        await updateUser({ avatar_id: null }, user.id as string);
        
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
    getImage(userDetails?.avatar_id as string);
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
                      oldAvatarUrl={avatarToShow as string}
                      onSaveImage={async (croppedImage: File) => {
                        let updatedUrl;

                        let avatarId = userDetails?.avatar_id;

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

                        updateUser(
                          { avatar_id: avatarId.toString() },
                          user?.id as string
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
          defaultValue={userDetails.user_handle as string}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="syedsadiqali" {...field} />
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

        {!isInitForm && (
          <FormField
            control={form.control}
            name="email"
            // TODO: build logic to change email
            disabled={true}
            defaultValue={user?.email}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="me@mymail.com" {...field} />
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
