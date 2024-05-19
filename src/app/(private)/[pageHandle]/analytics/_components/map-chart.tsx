"use client";

import { world } from "@/lib/geo-json";
import React, { useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Graticule,
  Sphere,
} from "react-simple-maps";

import { scaleLinear } from "d3-scale";

const colorScale = scaleLinear().domain([0, 100]).range(["#ffedea", "#ff5233"]);

export const MapChart = ({ data }: any) => {
  const [hoveredCountry, setHoveredCountry] = useState<Record<
    string,
    string | number
  > | null>(null);

  return (
    <div>
      <div>
        <p>Country : {hoveredCountry?.name}</p>
        <p>{`${hoveredCountry?.clicks} clicks`}</p>
      </div>

      <ComposableMap
        projectionConfig={{
          rotate: [-10, 0, 0],
          scale: 147,
        }}
      >
        {/* <Sphere stroke="#E4E5E6" strokeWidth={0.5} /> */}
        <Graticule stroke="#E4E5E6" strokeWidth={0.5} />
        {/* {data.length > 0 && ( */}
        <Geographies geography={world}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const d = data?.find((s: any) => s.gbc === geo.properties.name);

              let fill = d ? colorScale(d["count"]) : "#F5F4F6";

              return <Geography key={geo.rsmKey} geography={geo} fill={fill} />;
            })
          }
        </Geographies>
        {/* )} */}
      </ComposableMap>
    </div>
  );
};

export default MapChart;
