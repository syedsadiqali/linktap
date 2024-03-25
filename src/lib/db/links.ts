import { LinksRow } from "@/types/utils";
import { getCurrentAuthedUser, updateSortingOrder } from "./user";
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

export async function getLinksByUserHandle(user_handle?: string) {
  const supabase = createClient();

  // get the user_handle of current authed user if not provided

  if (!user_handle) {
    const { userDetails } = await getCurrentAuthedUser();
    user_handle = userDetails?.user_handle as string;
  }

  const { data: linksData, error: linksError } = await supabase
    .from("links")
    .select("*")
    .eq("user_handle", user_handle);

  return { linksData, linksError };
}

// add link to the currently authed user
export async function addLinkFn(linkData: Partial<LinksRow>) {
  const supabase = createClient();

  // get the current authed user.
  const { userDetails } = await getCurrentAuthedUser();

  const { link_url, link_type, link_label } = linkData as LinksRow;

  // add the link to table
  const { data: newLink, error: newLinkError } = await supabase
    .from("links")
    .insert({
      link_url: link_url,
      link_type: link_type,
      link_label: link_label,
      user_handle: userDetails?.user_handle as string,
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

  if (newLink && userDetails?.links_sort_order) {
    await updateSortingOrder([newLink.id, ...userDetails?.links_sort_order]);
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

export async function deleteLinkByLinkId(linkId: number) {
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
  const { data: userDetail } = await supabase
    .from("users")
    .select("links_sort_order")
    .eq("user_handle", deletedLink?.user_handle as string)
    .single();

  let newUserDetail = { ...userDetail };

  newUserDetail.links_sort_order?.splice(
    newUserDetail.links_sort_order.indexOf(deletedLink?.id as number),
    1
  );

  // update the new sort order
  await supabase
    .from("users")
    .update({ ...newUserDetail })
    .eq("user_handle", deletedLink?.user_handle as string);

}
