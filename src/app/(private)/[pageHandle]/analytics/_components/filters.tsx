"use client";

import { DateRangePicker } from "@/components/ui/date-range-picker";
import { createUrl } from "@/lib/utils/common";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Filters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  console.log(searchParams);

  // const [tab, setTab] = useState(aFor || "links");

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  return (
    <>
      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Fruits</SelectLabel>
            <SelectItem value="apple">Apple</SelectItem>
            <SelectItem value="banana">Banana</SelectItem>
            <SelectItem value="blueberry">Blueberry</SelectItem>
            <SelectItem value="grapes">Grapes</SelectItem>
            <SelectItem value="pineapple">Pineapple</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <Select
        defaultValue={searchParams.get("interval") || "1h"}
        onValueChange={(value) => {
          const aFor = searchParams.get("aFor");

          let url = createUrl(
            pathname,
            new URLSearchParams({
              ...(aFor && { aFor }),
              interval: value,
            })
          );
          router.push(url);
        }}
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
    </>
  );
}
