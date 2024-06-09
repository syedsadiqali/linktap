"use client";

import { createUrl } from "@/lib/utils/common";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { getLinksByPageHandle } from "@/server/actions/links";

export default function Filters({
  pageHandle,
  linkId,
  aFor,
}: {
  readonly pageHandle: string;
  readonly linkId: string;
  readonly aFor: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  const {
    data: dataB,
    error: linksError,
    isLoading: linksLoading,
  } = useQuery({
    queryKey: [`dashboard-links`],
    queryFn: () => getLinksByPageHandle(pageHandle),
    staleTime: 0,
  });

  const updateQueryParams = (name: string, value: string) => {
    const aFor = searchParams.get("aFor");
    const interval = searchParams.get("interval");
    
    let newParams: Record<string, string> = {
      ...(aFor && { aFor }),
      ...(interval && { interval }),
    }
    
    newParams[name] = value;

    let url = createUrl(
      pathname,
      new URLSearchParams(newParams)
    );
    
    router.push(url);
  };

  return (
    <div className="flex gap-2">
      {aFor === "links" ? (
        <Select
          defaultValue={linkId || "all"}
          onValueChange={(value) => updateQueryParams("linkId", value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">All</SelectItem>
              {dataB?.linksData?.map((link) => {
                return (
                  <SelectItem key={link.id} value={link.id}>
                    {link.link_url}
                  </SelectItem>
                );
              })}
            </SelectGroup>
          </SelectContent>
        </Select>
      ) : null}
      <Select
        defaultValue={searchParams.get("interval") || "1h"}
        onValueChange={(value) => updateQueryParams("interval", value)}
        >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Interval" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Interval</SelectLabel>
            <SelectItem value="1h">Last 1 Hour</SelectItem>
            <SelectItem value="24h">Last 24 Hour</SelectItem>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 Days</SelectItem>
            <SelectItem value="90d">Last 90 Days</SelectItem>
            <SelectItem value="all">Since big bang</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
