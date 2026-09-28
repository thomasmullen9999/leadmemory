"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const stageLabels: Record<string, string> = {
  LEAD: "New",
  CONTACTED: "Contacted",
  NEGOTIATING: "Review",
  WON: "Resolved",
  LOST: "Closed",
};

export function PipelineChart({
  data,
}: {
  data: { stage: string; count: number }[];
}) {
  const chartData = data.map((item) => ({
    ...item,
    label: stageLabels[item.stage] ?? item.stage,
  }));

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={chartData}>
        <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />

        <XAxis
          dataKey="label"
          tick={{ fill: "#64748b", fontSize: 12 }}
          tickLine={false}
          axisLine={false}
        />

        <YAxis
          allowDecimals={false}
          tick={{ fill: "#64748b", fontSize: 12 }}
          tickLine={false}
          axisLine={false}
        />

        <Tooltip
          cursor={{ fill: "#f8fafc" }}
          contentStyle={{
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
            fontSize: "12px",
          }}
        />

        <Bar
          dataKey="count"
          name="Cases"
          fill="#0f766e"
          radius={[5, 5, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}