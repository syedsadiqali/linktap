import TabChange from "./_components/tab-change";
import Filters from "./_components/filters";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { getAnalyticsData } from "@/server/actions/tracking";
import { Separator } from "@/components/ui/separator";
import { TimeSeriesChart } from "./_components/time-series-chart";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { BarListComp } from "./_components/bar-list";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Interval } from "@/types/utils";
import { AnalyticsCard } from "./_components/analytics-card";

export const revalidate = 0;

export default function PageA({
  params,
  searchParams,
}: {
  readonly params: { pageHandle: string };
  readonly searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const { aFor, interval, linkId } = searchParams as { [key: string]: string };

  let keyStringForBrowser = `aFor=${aFor}&interval=${interval}`;

  return (
    <>
      <div className="flex justify-between items-center space-y-0.5">
        <TabChange aFor={aFor} />
        <Filters aFor={aFor} pageHandle={params.pageHandle} linkId={linkId} />
      </div>
      <Separator className="my-6" />

      <div className="grid grid-cols-4 gap-4 my-4">
        <AnalyticsCard
          aFor={aFor}
          pageHandle={params.pageHandle}
          interval={interval as Interval}
          linkId={linkId}
          aType={"clicks"}
          title={"Total Clicks"}
        />
        
      </div>

      <div className="w-full grid gap-4 grid-cols-2 grid-rows-3 min-h-[400px]">
        <div className="col-span-2">
          <TimeSeriesChart
            aFor={aFor}
            pageHandle={params.pageHandle}
            interval={interval}
            linkId={linkId}
          />
        </div>

        <div className="min-h-[400px]">
          <BarListComp
            aFor={aFor}
            pageHandle={params.pageHandle}
            interval={interval as Interval}
            linkId={linkId}
            aType={"browser"}
            
          />
        </div>

        <div className="min-h-[400px]">
          <BarListComp
            aFor={aFor}
            pageHandle={params.pageHandle}
            interval={interval as Interval}
            linkId={linkId}
            aType={"country"}
            showCountryFilter={true}
          />
        </div>

        {/* <Suspense
          key={`${keyStringForBrowser}-1`}
          fallback={
            <div className="col-span-2 space-y-6 max-w-md w-80">
              <Loader2 className="animate-spin" />
            </div>
          }
        >
          <div className="col-span-2">
            <WorldMap aFor={aFor} from={from} to={to} />
          </div>
        </Suspense>

        <Suspense
          key={`${keyStringForBrowser}-2`}
          fallback={
            <div className="space-y-6 max-w-md w-80">
              <Loader2 className="animate-spin" />
            </div>
          }
        >
          <BrowserChart aFor={aFor} from={from} to={to} />
        </Suspense>

        <Suspense
          key={`${keyStringForBrowser}-3`}
          fallback={
            <div className="space-y-6 max-w-md w-80">
              <Loader2 className="animate-spin" />
            </div>
          }
        >
          <DeviceChart aFor={aFor} from={from} to={to} />
        </Suspense> */}

        {/* <Suspense
          key={`${keyStringForBrowser}-3`}
          fallback={
            <div className="space-y-6 max-w-md w-80">
              <Loader2 className="animate-spin" />
            </div>
          }
        >
          <Clicks aFor={aFor} from={from} to={to} />
        </Suspense> */}

        {/* <MapChart for={aFor} /> */}

        {/* total clicks
    bounce rate  (only for page views)
    top browsers
    top OS
    top referres (only for page views)

    top country (could be a map)
    top regions
    top cities */}
      </div>
    </>
  );
}
