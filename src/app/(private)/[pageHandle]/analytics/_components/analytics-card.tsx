"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getAnalyticsData } from "@/server/actions/tracking";
import { Interval } from "@/types/utils";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

export function AnalyticsCard({
  title,
  aType,
  aFor,
  pageHandle,
  interval,
  linkId,
}: {
  readonly title: string;
  readonly aType: string;
  readonly aFor: string;
  readonly pageHandle: string;
  readonly interval: Interval;
  readonly linkId?: string;
}) {
  const {
    data: dataA,
    error,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [aType, aFor, pageHandle, interval, linkId],
    queryFn: () =>
      getAnalyticsData({
        aFor: aFor,
        page_handle: pageHandle,
        interval: interval,
        ...(linkId && linkId !== "all" && { linkId: linkId }),
        aType: aType,
      }),
  });

  if (isLoading) {
    return (
      <Card className="border border-b-4 border-b-primary">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 mt-2 w-full flex justify-center items-center">
          </Skeleton>
          {/* <p className="text-xs text-muted-foreground">+20.1% from last month</p> */}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-b-4 border-b-primary">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{dataA}</div>
        {/* <p className="text-xs text-muted-foreground">+20.1% from last month</p> */}
      </CardContent>
    </Card>
  );
}
