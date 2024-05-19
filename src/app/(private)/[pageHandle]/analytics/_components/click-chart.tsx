"use client";

import { useCallback, useMemo } from "react";
import TimeSeriesChart from "@/components/charts/time-series-chart";
import Areas from "@/components/charts/areas";
import XAxis from "@/components/charts/x-axis";
import YAxis from "@/components/charts/y-axis";
import { nFormatter } from "@/lib/utils/formatter";

export default function ClickChart({
  data,
  interval,
}: {
  data?: any;
  interval?: string;
}) {
  console.log("data ", data);
  const chartData = useMemo(
    () =>
      data?.map(({ gbc, count }) => ({
        date: new Date(gbc),
        values: { count },
      })) ?? null,
    [data],
  );

  const formatDate = useCallback(
    (date: Date) => {
      switch (interval) {
        case "1h":
        case "24h":
          return date.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "numeric",
          });
        case "all":
          return date.toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
          });
        default:
          return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          });
      }
    },
    [interval],
  );

  return (
    <div className="flex h-96 w-full items-center justify-center">
      {chartData ? (
        <TimeSeriesChart
          key={1}
          data={chartData}
          series={[{ id: "clicks", valueAccessor: (d) => d.values.clicks }]}
          tooltipContent={(d) => (
            <>
              <p className="text-gray-700">
                <strong className="text-gray-800">
                  {nFormatter(d.values.clicks, { full: true })}
                </strong>{" "}
                clicks
              </p>
              <p className="text-sm text-gray-500">{formatDate(d.date)}</p>
            </>
          )}
        >
          <Areas />
          <XAxis tickFormat={formatDate} />
          <YAxis showGridLines tickFormat={nFormatter} />
        </TimeSeriesChart>
      ) : (
        <p>hello</p>
      )}
    </div>
  );
}
