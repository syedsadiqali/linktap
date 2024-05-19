// get it's data, show a loading state if no date yet
//
// filers would be global, from and to would be global
// 1. for=links,page | from | to | browser | country | region | city | device

import MapChart from "./_components/map-chart";

export default async function WorldMap({
  aFor,
  from,
  to,
}: {
  aFor: "links" | "pages";
  from?: string;
  to?: string;
}) {
  // const data = await getTrackingData({ aFor, from, to, groupedBy: "country" });

  return <MapChart data={{}} />;
}
