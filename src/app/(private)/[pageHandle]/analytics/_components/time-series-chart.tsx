"use client";

import { getAnalyticsData } from "@/server/actions/tracking";
import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";
import { Skeleton } from "@/components/ui/skeleton";
import { LineChart } from "@/components/ui/line-chart";

export function TimeSeriesChart({ aFor, pageHandle, interval, linkId }: any) {
  const {
    data: dataA,
    error,
    isRefetching,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [`timeseries-${aFor}-${pageHandle}-${interval}-${linkId}`],
    queryFn: () =>
      getAnalyticsData({
        aFor: aFor,
        page_handle: pageHandle,
        interval: interval,
        ...(linkId && linkId !== "all" && { linkId: linkId }),
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
  
  
  if (isLoading || isRefetching) {
    return (
      <Layout aFor={aFor} refetch={refetch}>
        <Skeleton className="h-full w-full flex justify-center items-center">
          <Loader2 className="animate-spin" />
        </Skeleton>
      </Layout>
    );
  }
  
  let isNoData = true;

  let data = dataA?.map((a: any) => {
    
    if(a.clicks > 0 && isNoData) {
      isNoData = false;
    }
    
    return {
      date: formatDate(new Date(a.start)),
      clicks: a.clicks,
    };
  });
  
  if (isNoData) {
    return (
      <Layout aFor={aFor} refetch={refetch}>
        <div className="bg-muted w-full h-full flex justify-center items-center">
          <p className="text-xl text-muted-foreground">No Data</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout aFor={aFor} refetch={refetch}>
      <LineChart
        className="mt-4 h-72"
        data={data}
        index="date"
        categories={["clicks"]}
        colors={["amber"]}
        yAxisWidth={30}

        // customTooltip={customTooltip}
      />
    </Layout>

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

const Layout = ({
  aFor,
  refetch,
  children,
}: {
  aFor: string;
  refetch: any;
  children: JSX.Element;
}) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between">
          <div>
            <CardTitle>
              {aFor === "links" ? "Clicks" : "Page Views"} over time
            </CardTitle>
            <CardDescription>
              View your {aFor === "links" ? "clicks" : "page views"} over time
            </CardDescription>
          </div>
          <Button
            onClick={() => refetch()}
            variant="outline"
            size="icon"
          >
            <ReloadIcon className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="h-80">{children}</CardContent>
    </Card>
  );
};
