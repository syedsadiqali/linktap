"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function TabChange({ aFor }: { aFor: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [tab, setTab] = useState(aFor || "links");

  // Get a new searchParams string by merging the current
  // searchParams with a provided key/value pair
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      
      if(value === "page") {
        params.delete("linkId")
      }

      return params.toString();
    },
    [searchParams]
  );

  return (
    <Tabs
      defaultValue="account"
      className=""
      value={tab}
      onValueChange={(newValue) => {
        setTab(newValue);
        router.push(pathname + "?" + createQueryString("aFor", newValue));
      }}
    >
      <TabsList>
        <TabsTrigger value="page">Page</TabsTrigger>
        <TabsTrigger value="links">Links</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
