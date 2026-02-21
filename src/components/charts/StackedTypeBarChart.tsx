"use client";

import {
  BarChart,
  Bar,
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

interface StackedTypeBarChartProps {
  data: TypedTimeSeriesPoint[];
  typeKeys: string[];
  /** Map of typeKey → human-readable label. Falls back to raw key if not provided. */
  labelMap?: Record<string, string>;
}

export function StackedTypeBarChart({ data, typeKeys, labelMap = {} }: StackedTypeBarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
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
          stroke="var(--color-text-tertiary)"
          fontSize={13}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip cursor={{ fill: "var(--color-surface-secondary)" }} content={<ChartTooltipContent />} />
        <Legend verticalAlign="top" align="right" content={<ChartLegend />} />
        {typeKeys.map((key, i) => (
          <Bar
            key={key}
            dataKey={key}
            stackId="volume"
            fill={TYPE_CHART_PALETTE[i % TYPE_CHART_PALETTE.length]}
            name={labelMap[key] ?? key}
            radius={i === typeKeys.length - 1 ? [2, 2, 0, 0] : undefined}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
