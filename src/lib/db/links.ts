import { LinksRow } from "@/types/utils";
import { getPageByPageHandle, updateSortingOrder } from "./page";
import { createClient } from "@/lib/supabase/client";

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
    .from("links")
    .select("*")
    .eq("page_handle", page_handle);

  return { linksData, linksError };
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
export async function addLinkFn(linkData: Partial<LinksRow>) {
  const supabase = createClient();

  const { pageDetails } = await getPageByPageHandle(linkData?.page_id as string);

  const { link_url, link_type, link_label } = linkData as LinksRow;

  // add the link to table
  const { data: newLink, error: newLinkError } = await supabase
    .from("links")
    .insert({
      link_url: link_url,
      link_type: link_type,
      link_label: link_label,
      page_id: pageDetails?.id
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
    await updateSortingOrder([newLink.id, ...pageDetails?.links_sort_order], pageDetails?.page_handle as string);
  }

  return newLink;
}

export async function updateLinkByLinkId(
  linkId: number,
  dataToUpdate: Partial<LinksRow>
) {
  // update the link data and then revalidate the page, no need to change the sort order anywhere.

  const supabase = createClient();

  const { error, data: linksData } = await supabase
    .from("links")
    .update(dataToUpdate)
    .eq("id", linkId)
    .select()
    .single();

  if (error) {
    let errorMessage = "error";
    if (error.code === "23505") {
      errorMessage = `This link Already Exist on your Page !!`;
    }
    throw new Error(errorMessage);
  }
  return linksData;
}

export async function deleteLinkByLinkId(linkId: string) {
  const supabase = createClient();

  // delete link of that user id and revalidate the page
  // after deleteing also remove the id from sortOrder

  const { data: deletedLink, error: linkDeleteError } = await supabase
    .from("links")
    .delete()
    .eq("id", linkId)
    .select()
    .single();

  // if (linkDeleteError) {
  //   throw new Error(linkDeleteError);
  // }

  // get user data
  const { data: pageDetail } = await supabase
    .from("pages")
    .select("links_sort_order")
    .eq("page_id", deletedLink?.page_id as string)
    .single();

  let newPageDetail = { ...pageDetail };

  newPageDetail.links_sort_order?.splice(
    newPageDetail.links_sort_order.indexOf(deletedLink?.id as string),
    1
  );

  // update the new sort order
  await supabase
    .from("pages")
    .update({ ...newPageDetail })
    .eq("page_id", deletedLink?.page_id as string);

}
