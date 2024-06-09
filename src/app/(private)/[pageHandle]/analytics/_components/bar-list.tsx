"use client";

import { Button } from "@/components/ui/button";
import { getAnalyticsData } from "@/server/actions/tracking";
import { useQuery } from "@tanstack/react-query";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Filter, Loader2, Menu } from "lucide-react";
import { ReloadIcon } from "@radix-ui/react-icons";
import { Interval } from "@/types/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { BarList } from "@/components/ui/bar-list";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export function BarListComp({
  aType,
  aFor,
  pageHandle,
  interval,
  linkId,
  showCountryFilter = false,
}: {
  readonly aType: string;
  readonly aFor: string;
  readonly pageHandle: string;
  readonly interval: Interval;
  readonly linkId?: string;
  readonly showCountryFilter?: boolean;
}) {
  const [aTypeL, setAType] = useState(aType);

  const {
    data: dataA,
    error,
    isRefetching,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [`${aTypeL}-${aFor}-${pageHandle}-${interval}-${linkId}`, aTypeL],
    queryFn: () =>
      getAnalyticsData({
        aFor: aFor,
        page_handle: pageHandle,
        interval: interval,
        ...(linkId && linkId !== "all" && { linkId: linkId }),
        aType: aTypeL,
      }),
  });

  let data = dataA?.map((a: any) => {
    return {
      name: a[aTypeL],
      value: a.clicks,
    };
  });

  if (data?.length === 0) {
    return (
      <Layout
        aFor={aFor}
        refetch={refetch}
        aType={aTypeL}
        setAType={setAType}
        showCountryFilter={showCountryFilter}
      >
        <div className="bg-muted w-full h-full flex justify-center items-center">
          <p className="text-xl text-muted-foreground">No Data</p>
        </div>
      </Layout>
    );
  }

  if (isLoading || isRefetching) {
    return (
      <Layout
        aFor={aFor}
        refetch={refetch}
        aType={aTypeL}
        setAType={setAType}
        showCountryFilter={showCountryFilter}
      >
        <Skeleton className="h-full w-full flex justify-center items-center">
          <Loader2 className="animate-spin" />
        </Skeleton>
      </Layout>
    );
  }

  return (
    <Layout
      aFor={aFor}
      refetch={refetch}
      aType={aTypeL}
      setAType={setAType}
      showCountryFilter={showCountryFilter}
    >
      <BarList data={data} className="mt-2" />
    </Layout>
  );
}

const Layout = ({
  showCountryFilter = false,
  setAType,
  aType,
  aFor,
  refetch,
  children,
}: {
  showCountryFilter?: boolean;
  aType: string;
  setAType: any;
  aFor: string;
  refetch: any;
  children: JSX.Element;
}) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between">
          <div>
            <CardTitle className="capitalize">{aType}</CardTitle>
            <CardDescription>
              {aFor === "links" ? "clicks" : "page views"} by {aType}
            </CardDescription>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {showCountryFilter ? (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant={"outline"}>
                    <Filter className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-40">
                  <div className="grid gap-4">
                    {/* <div className="space-y-2">
                    <h4 className="font-medium leading-none">
                      Location Granularity
                    </h4>
                    <p className="text-sm text-muted-foreground">Locat</p>
                  </div> */}
                    <div className="grid gap-2">
                      <RadioGroup
                        defaultValue="country"
                        value={aType}
                        onValueChange={(value: string) => {
                          setAType(value);
                        }}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="country" id="r1" />
                          <Label htmlFor="r1">Country</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="city" id="r3" />
                          <Label htmlFor="r3">City</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            ) : null}
            <Button onClick={() => refetch()} variant="outline" size="icon">
              <ReloadIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="h-80">{children}</CardContent>
    </Card>
  );
};
