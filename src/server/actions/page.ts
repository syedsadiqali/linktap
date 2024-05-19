"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentAuthedUser } from "./user";
import { PagesRow } from "@/types/utils";
import { recordLink } from "./tracking";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const getPageByPageHandle = async (pageHandle?: string) => {
  const supabase = createClient();
  let result;

  if (!pageHandle) {
    let user = await getCurrentAuthedUser();
    result = await supabase
      .from("pages")
      .select("*")
      .eq("user_id", user?.user?.id as string)
      .eq("is_default", true)
      .single();
  } else {
    result = await supabase
      .from("pages")
      .select("*")
      .eq("page_handle", pageHandle)
      .single();
  }

  if (result.error) {
    return { pageDetails: null };
  }

  const { data: pageDetails } = result;

  return {
    pageDetails,
  };
};

export async function updateSortingOrder(
  newSortOrder: string[],
  pageHandle: string
) {
  const supabase = createClient();

  const { data: pageDetails, error: pageDetailsError } = await supabase
    .from("pages")
    .update({ links_sort_order: newSortOrder })
    .eq("page_handle", pageHandle as string)
    .select()
    .single();

  if (pageDetailsError) {
    throw new Error(pageDetailsError.message, { cause: pageDetailsError.code });
  }

  revalidateTag("page_detail");

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
      revalidatePath("/dashboard");
      redirect("/dashboard");
    }
  }
}

export async function updatePage(
  pageData: Partial<PagesRow>,
  pageHandle?: string
) {
  const supabase = createClient();

  let result;

  if (!pageHandle) {
    let user = await getCurrentAuthedUser();
    result = await supabase
      .from("pages")
      .update(pageData)
      .eq("user_id", user?.user?.id as string)
      .eq("is_default", true)
      .select("id,page_handle")
      .single();
  } else {
    result = await supabase
      .from("pages")
      .update(pageData)
      .eq("page_handle", pageHandle)
      .select("id,page_handle")
      .single();
  }

  recordLink({
    link: {
      id: result.data?.id,
      key: "_root",
      url: "",
      domain: "linktap.xyz",
      pageId: result.data?.id,
    },
  });

  if (result.error) {
    return result;
  }

  revalidatePath("/dashboard/[slug]");
  revalidateTag("page_detail");

  return result;
}

export async function getPublicUrl(avatarId: string) {
  const supabase = createClient();

  const { data: publicUrl } = await supabase.storage
    .from("avatars")
    .getPublicUrl(`${avatarId}.png`);

  return publicUrl;
}

export async function removeImage(avatarId: string){
  const supabase = createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  let { data, error } = await supabase.storage
    .from("avatars")
    .remove([`${avatarId}.png`]);

  return {data, error};
}

export async function createOrUpdateAvatar(avatarId: string, image: any) {
  console.log("shit");
  const supabase = createClient();

  let { data, error } = await supabase.storage
    .from("avatars")
    .upload(`${avatarId}.png`, image, {
      cacheControl: "3600",
      upsert: true,
    });

  return { data, error };
}
