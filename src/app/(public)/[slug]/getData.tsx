import { getUserByUserHandle } from "@/actions/userActions";
import { cache } from "react";

let userCacheInstance: any = null;

export function getUserDetails() {
  if (!userCacheInstance) {
    userCacheInstance = cache(getUserByUserHandle);
  }

  return userCacheInstance;
}
