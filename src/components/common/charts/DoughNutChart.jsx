/*Component Name: DoughNutChart
Component Functional Details: User can create or update DoughNutChart master details from here.
Created By: chandan
Created Date: <Creation Date>
Modified By: chandan
Modified Date: <Modified Date> */

import React from "react";
import {
  PieChart,
  Pie,
  Cell
} from "recharts";

const DoughNutChart = ({
  width = 100,
  height = 100,
  value,
  pending = "Group A",
  remaining = "Group B",
}) => {
  const data = [
    { name: pending, value: 100 - value },
    { name: remaining, value: 0 + value },
  ];
  const COLORS = ["#e5e7eb", "#4ade80"];

  return (
    <PieChart width={width} height={height}>
      <Pie
        data={data}
        cx={43}
        cy={50}
        innerRadius={32}
        outerRadius={40}
        fill="#e5e7eb"
        paddingAngle={0.1}
        dataKey="value"
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
    </PieChart>
  );
};

export default DoughNutChart;
