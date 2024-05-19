"use client";

import { Button } from "@/components/ui/button";
import { getAnalyticsData } from "@/server/actions/tracking";
import { useQuery } from "@tanstack/react-query";
import { BarList, LineChart } from "@tremor/react";
import { useCallback, useEffect, useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { ReloadIcon } from "@radix-ui/react-icons";

export function BrowserBarList({
  aFor,
  pageHandle,
  interval,
  linkId,
}: {
  aFor: string;
  pageHandle: string;
  readonly interval: string;
  linkId?: string;
}) {
  const {
    data: dataA,
    error,
    isRefetching,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [`browsers-${aFor}-${pageHandle}-${interval}`],
    queryFn: () =>
      getAnalyticsData({
        aFor: aFor,
        page_handle: pageHandle,
        interval: interval as string,
        linkId: linkId,
        aType: "browser",
      }),
  });

  let data = dataA?.map((a) => {
    return {
      name: a.browser,
      value: a.clicks,
    };
  });

  if (isLoading || isRefetching) {
    return (
      <Card>
        <CardHeader>
          <div className="flex justify-between">
            <div>
              <CardTitle>Browsers</CardTitle>
              <CardDescription>Card Description</CardDescription>
            </div>
            <Button onClick={() => refetch()} variant="outline" size="icon" disabled>
            <ReloadIcon className="h-4 w-4" />
          </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Loader2 className="animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between">
          <div>
            <CardTitle>Browsers</CardTitle>
            <CardDescription>Card Description</CardDescription>
          </div>
          <Button onClick={() => refetch()} variant="outline" size="icon">
            <ReloadIcon className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <BarList data={data} className="mt-2" />
      </CardContent>
      {/* <CardFooter>
        <p>Card Footer</p>
      </CardFooter> */}
    </Card>
  );
}
