"use client";
import { LineChart } from "@tremor/react";
import { useCallback } from "react";

export function LineChartUsageExampleWithCustomTooltip({
  chartData,
  interval
}: {
  chartData: any;
  interval: string;
}) {
	
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
		[interval],
	  );
	  
  let data = chartData.map((a:any) => {
    let date = new Date(a.start).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
    });
    return {
      date,
      clicks: a.clicks,
    };
  });

  
  return (
    <>
      <h3 className="text-lg font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
        Average BPM
      </h3>
      <LineChart
        className="mt-4 h-72"
        data={data}
        index="date"
        categories={["clicks"]}
        colors={["blue"]}
        yAxisWidth={30}
        // customTooltip={customTooltip}
      />
    </>
  );
}
