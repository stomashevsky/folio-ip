"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { TypedTimeSeriesPoint } from "@/lib/data";
import { TYPE_CHART_PALETTE } from "@/lib/constants/chart-colors";
import { ChartLegend } from "./ChartLegend";
import { ChartTooltipContent } from "./ChartTooltipContent";

interface TypeRatesLineChartProps {
  data: TypedTimeSeriesPoint[];
  typeKeys: string[];
  labelMap?: Record<string, string>;
}

export function TypeRatesLineChart({ data, typeKeys, labelMap = {} }: TypeRatesLineChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
        <CartesianGrid
          stroke="var(--color-border)"
          strokeDasharray=""
          vertical={false}
        />
        <XAxis
          dataKey="date"
          tickFormatter={(v: string) => {
            const d = new Date(v);
            return d.toLocaleDateString("en-US", { month: "numeric", day: "numeric" });
          }}
          stroke="var(--color-text-tertiary)"
          fontSize={13}
          tickLine={false}
          axisLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          domain={[0, 100]}
          tickFormatter={(v: number) => `${v}%`}
          stroke="var(--color-text-tertiary)"
          fontSize={13}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip content={<ChartTooltipContent valueFormatter={(v) => `${v}%`} />} />
        <Legend verticalAlign="top" align="right" content={<ChartLegend />} />
        {typeKeys.map((key, i) => (
          <Line
            key={key}
            type="monotone"
            dataKey={key}
            stroke={TYPE_CHART_PALETTE[i % TYPE_CHART_PALETTE.length]}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
            name={labelMap[key] ?? key}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
