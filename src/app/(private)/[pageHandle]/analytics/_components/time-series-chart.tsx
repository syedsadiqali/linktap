"use client";

import { getAnalyticsData } from "@/server/actions/tracking";
import { useQuery } from "@tanstack/react-query";
import { LineChart } from "@tremor/react";
import { useCallback } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import useRouterStuff from "@/lib/use-router-stuff";
import { Button } from "@/components/ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";

export function TimeSeriesChart({ aFor, pageHandle, interval, linkId }: any) {
  const {
    data: dataA,
    error,
    isRefetching,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [`timeseries-${aFor}-${pageHandle}-${interval}`],
    queryFn: () =>
      getAnalyticsData({
        aFor: aFor,
        page_handle: pageHandle,
        interval: interval,
        linkId: linkId,
        aType: "timeseries",
      }),
  });

  const formatDate = useCallback(
    (date: Date) => {
      switch (interval) {
        case "1h":
        case "24h":
          return date.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "numeric",
          });
        case "ytd":
        case "1y":
        case "all":
          return date.toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
          });
        default:
          return date.toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
          });
      }
    },
    [interval]
  );

  let data = dataA?.map((a: any) => {
    return {
      date: formatDate(new Date(a.start)),
      clicks: a.clicks,
    };
  });

  if (isLoading || isRefetching) {
    return (
      <Card>
        <CardHeader>
          <div className="flex justify-between">
            <div>
              <CardTitle>Clicks over time</CardTitle>
              <CardDescription>View your clicks over time</CardDescription>
            </div>
            <Button
              onClick={() => refetch()}
              variant="outline"
              size="icon"
              disabled
            >
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
          <CardTitle>Clicks over time</CardTitle>
          <CardDescription>View your clicks over time</CardDescription>
        </div>
        <Button onClick={() => refetch()} variant="outline" size="icon">
          <ReloadIcon className="h-4 w-4" />
        </Button>
      </div>
      </CardHeader>
      <CardContent>
        <LineChart
          className="mt-4 h-72"
          data={data}
          index="date"
          categories={["clicks"]}
          colors={["blue"]}
          yAxisWidth={30}

          // customTooltip={customTooltip}
        />
      </CardContent>
      {/* <CardFooter>
        <p>Card Footer</p>
      </CardFooter> */}
    </Card>
    // <div>
    //   <h3 className="text-lg font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
    //     Link Clicks
    //   </h3>
    //   <Button onClick={() => refetch()}>Revalidate</Button>
    //   <LineChart
    //     className="mt-4 h-72"
    //     data={data}
    //     index="date"
    //     categories={["clicks"]}
    //     colors={["blue"]}
    //     yAxisWidth={30}
    //     // customTooltip={customTooltip}
    //   />
    // </div>
  );
}
