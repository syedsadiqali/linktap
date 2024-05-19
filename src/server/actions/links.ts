"use server";

import { LinksRow } from "@/types/utils";
import { revalidatePath, revalidateTag } from "next/cache";
import { getPageByPageHandle, updateSortingOrder } from "./page";
import { createClient } from "@/lib/supabase/server";
import { recordLink } from "./tracking";

const handleErrors = (e: unknown) => {
  const errMsg = "Error, please try again.";
  if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg;
  if (e && typeof e === "object" && "error" in e) {
    const errAsStr = e.error as string;
    return errAsStr.length > 0 ? errAsStr : errMsg;
  }
  return errMsg;
};

export async function getLinksByPageHandle(page_handle: string) {
  const supabase = createClient();

  const { data: linksData, error: linksError } = await supabase
    .from("pages")
    .select(
      `id, links (
      *
    )`
    )
    .eq("page_handle", page_handle);

  if (!linksData) {
    return { linksData: null, linksError };
  }

  return { linksData: linksData[0].links, linksError };
}

export async function getLinkByLinkUrl(link_url: string) {
  const supabase = createClient();

  const { data: linksData, error: linksError } = await supabase
    .from("links")
    .select("*")
    .eq("link_url", link_url)
    .single();

  return { linksData, linksError };
}

// add link to the currently authed user
export async function addLinkFn(
  linkData: Partial<LinksRow>,
  pageHandle: string
) {
  const supabase = createClient();

  // get the current authed user.
  const { pageDetails } = await getPageByPageHandle(pageHandle);

  const { link_url, link_type, link_label } = linkData as LinksRow;

  // add the link to table
  const { data: newLink, error: newLinkError } = await supabase
    .from("links")
    .insert({
      link_url: link_url,
      link_type: link_type,
      link_label: link_label,
      page_id: pageDetails.id,
    })
    .select()
    .single();

  if (newLinkError) {
    let errorMessage = "error";
    if (newLinkError.code === "23505") {
      errorMessage = `This link Already Exist on your Page !!`;
    }
    throw new Error(errorMessage);
  }

  if (newLink && pageDetails?.links_sort_order) {
    await updateSortingOrder(
      [newLink.id, ...pageDetails?.links_sort_order],
      pageDetails?.page_handle as string
    );
  }

  // record link in Tinybird
  recordLink({
    link: {
      id: newLink.id,
      domain: "",
      key: newLink.id,
      url: newLink.link_url,
      pageId: pageDetails?.page_handle,
    },
  });

  revalidateTag("links_slug_page");

  return newLink;
}

export async function updateLinkByLinkId(
  linkId: number,
  dataToUpdate: Partial<LinksRow>
) {
  // update the link data and then revalidate the page, no need to change the sort order anywhere.
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("links")
      .update(dataToUpdate)
      .eq("id", linkId)
      .select()
      .single();

    console.log("errror", error);

    if (error) {
      let errorMessage = "error";
      if (error.code === "23505") {
        errorMessage = `This link Already Exist on your Page !!`;
      }
      throw new Error(errorMessage);
    }
    revalidatePath("/dashboard");
    revalidateTag("links_slug_page");

    return data;
  } catch (e) {
    console.log("error 1", e);
    return handleErrors(e);
  }
}

export async function deleteLinkByLinkId(linkId: string) {
  try {
    const supabase = createClient();

    // delete link of that user id and revalidate the page
    // after deleteing also remove the id from sortOrder

    const { data: deletedLink, error: linkDeleteError } = await supabase
      .from("links")
      .delete()
      .eq("id", linkId as string)
      .select()
      .single();

    // if (linkDeleteError) {
    //   throw new Error(linkDeleteError);
    // }

    // get user data
    const { data: userDetail } = await supabase
      .from("pages")
      .select("links_sort_order")
      .eq("id", deletedLink?.page_id as string)
      .single();

    let newUserDetail = { ...userDetail };

    newUserDetail.links_sort_order?.splice(
      newUserDetail.links_sort_order.indexOf(deletedLink?.id as string),
      1
    );

    // update the new sort order
    await supabase
      .from("pages")
      .update({ ...newUserDetail })
      .eq("id", deletedLink?.page_id as string);
      
      // record link in Tinybird
      recordLink({
        link: {
          id: newLink.id,
          domain: "",
          key: newLink.id,
          url: newLink.link_url,
          pageId: pageDetails?.page_handle,
        },  
      });

    revalidatePath("/dashboard");
  } catch (e) {
    return handleErrors(e);
  }
}
