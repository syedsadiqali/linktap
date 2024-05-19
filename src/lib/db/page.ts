import { createClient } from "@/lib/supabase/client";
import { PagesRow } from "@/types/utils";
import { redirect } from "next/navigation";
import { getCurrentAuthedUser } from "./user";

export async function getPageByPageHandle(pageHandle?: string) {
  const supabase = createClient();
  let result;

  if (!pageHandle) {
    let user = await getCurrentAuthedUser();
    result = await supabase
      .from("pages")
      .select("*")
      .eq("user_id", user?.user?.id as string)
      .single();
  } else {
    result = await supabase
      .from("pages")
      .select("*")
      .eq("page_handle", pageHandle)
      .single();
  }

  const { data: pageDetails } = result;

  return {
    pageDetails,
  };
}

export async function updateSortingOrder(newSortOrder: string[], pageHandle: string) {
  const supabase = createClient();

  const { data: pageDetails, error: pageDetailsError } = await supabase
    .from("pages")
    .update({ links_sort_order: newSortOrder })
    .eq("page_handle", pageHandle)
    .select()
    .single();

  if (pageDetailsError) {
    throw new Error(pageDetailsError.message, { cause: pageDetailsError.code });
  }

  return pageDetails;
}

export async function setPageHandle({ newHandle }: { newHandle: string }) {
  const supabase = createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session?.user?.id) {
    const { data: dataA, error } = await supabase
      .from("pages")
      .update({
        page_handle: newHandle,
      })
      .eq("user_id", session?.user?.id);

    if (error) {
      if (error?.code === "23505") {
        return { state: "error", message: "Page Handle Already Exists!" };
      } else {
        return { state: "error", message: error.message };
      }
    } else {
      redirect("/dashboard");
    }
  }
}

export async function updatePage(
  pageData: Partial<PagesRow>,
  pageHandle  : string
) {
  const supabase = createClient();

  return supabase.from("page").update(pageData).eq("page_handle", pageHandle);
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
