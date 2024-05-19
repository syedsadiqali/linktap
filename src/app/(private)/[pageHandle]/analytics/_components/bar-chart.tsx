"use client";

import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Rectangle,
  LabelList,
} from "recharts";

function BarChartA({ data, key }: any) {
  let barsToAdd = Array.from({ length: 8 - data?.length }, () => ({
    gbc: "",
    count: 0,
  }));

  data = [
    { gbc: "test", count: 2200 },
    { gbc: "test2", count: 1100 },
    ...data,
    ...barsToAdd,
  ];

  const renderCustomizedLabel = (props) => {
    const { x, y, width, height, value } = props;
    const radius = 10;
    const maxValue = Math.max(...data.map((entry) => entry.count)); // Find the maximum value in the data

    return (
      <g>
        <text
          x={x + width + radius + (maxValue - value)} // Adjust x position based on maximum value
          y={y + height / 2}
          fill="black"
          textAnchor="start"
          dominantBaseline="central"
        >
          {value > 0 ? `A : ${value}` : undefined}
        </text>
      </g>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={300} key={key}>
      <BarChart
        width={500}
        height={300}
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
        layout="vertical"
      >
        <XAxis dataKey={"count"} type="number" hide={true} />
        <YAxis dataKey="gbc" type="category" hide={true} />
        <Bar
          dataKey="count"
          layout="vertical"
          fill="#8884d8"
          shape={<Rectangle fill="orange" stroke="orange" radius={5} />}
          isAnimationActive={false}
        >
          <LabelList
            dataKey="gbc"
            position="insideLeft"
            color="white"
            fill="black"
            // content={renderCustomizedLabel}
          />
          <LabelList
            dataKey="count"
            position="right"
            // content={renderCustomizedLabel}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export default BarChartA;
