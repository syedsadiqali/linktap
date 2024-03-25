import { createClient } from "@/lib/supabase/client";
import { UsersRow } from "@/types/utils";
import { redirect } from "next/navigation";

export async function getUserByUserHandle(userHandle: string) {
  const supabase = createClient();

  const { data: userDetails } = await supabase
    .from("users")
    .select("*")
    .eq("user_handle", userHandle)
    .single();

  return {
    userDetails,
  };
}

export async function getCurrentAuthedUser() {
  const supabase = createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { data: userDetails } = await supabase
    .from("users")
    .select("*")
    .eq("user_id", session?.user?.id as string)
    .single();

  return {
    user: session?.user,
    userDetails,
  };
}

export async function updateSortingOrder(newSortOrder: number[]) {
  const supabase = createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { data: userDetails, error: userDetailsError } = await supabase
    .from("users")
    .update({ links_sort_order: newSortOrder })
    .eq("user_id", session?.user?.id as string)
    .select()
    .single();

  if (userDetailsError) {
    throw new Error(userDetailsError.message, { cause: userDetailsError.code });
  }

  return userDetails;
}

export async function setUserHandle({ newHandle }: { newHandle: string }) {
  const supabase = createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session?.user?.id) {
    const { data: dataA, error } = await supabase
      .from("users")
      .update({
        user_handle: newHandle,
      })
      .eq("user_id", session?.user?.id);

    if (error) {
      if (error?.code === "23505") {
        return { state: "error", message: "Username Already Exists!" };
      } else {
        return { state: "error", message: error.message };
      }
    } else {
      redirect("/dashboard");
    }
  }
}

export async function updateUser(
  userData: Partial<UsersRow>,
  userId  : string
) {
  const supabase = createClient();

  return supabase.from("users").update(userData).eq("user_id", userId);
}

export async function removeImage(avatarId: string) {
  const supabase = createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return supabase.storage.from("avatars").remove([`${avatarId}.png`]);
}

export async function createOrUpdateAvatar(avatarId: string, image: any) {
  const supabase = createClient();

  return supabase.storage.from("avatars").upload(`${avatarId}.png`, image, {
    cacheControl: "3600",
    upsert: true,
  });
}

export async function getPublicUrl(avatarId: string) {
  const supabase = createClient();

  const { data: publicUrl } = await supabase.storage
    .from("avatars")
    .getPublicUrl(`${avatarId}.png`);

  return publicUrl;
}
