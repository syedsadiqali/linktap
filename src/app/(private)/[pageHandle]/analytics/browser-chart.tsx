// get it's data, show a loading state if no date yet
//
// filers would be global, from and to would be global
// 1. for=links,page | from | to | browser | country | region | city | device

import { getTrackingData } from "@/server/actions/tracking";
import BarChart from "./_components/bar-chart";

export default async function BrowserChart({
  aFor,
  from,
  to,
}: {
  aFor: "links" | "pages";
  from?: string;
  to?: string;
}) {
  const data = await getTrackingData({ aFor, from, to, groupedBy: "browser" });

  return (
    <div className="bg-white shadow-xl rounded-xl border max-h-[400px] overflow-auto">
      <h2 className="p-4 font-bold text-gray-600">Top Browsers</h2>
      <BarChart data={data} />
    </div>
  );
}