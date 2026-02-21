"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { TimeSeriesPoint } from "@/lib/types";
import { CHART_COLORS } from "@/lib/constants/chart-colors";
import { ChartTooltipContent } from "./ChartTooltipContent";

interface SimpleBarChartProps {
  data: TimeSeriesPoint[];
  label?: string;
}

export function SimpleBarChart({ data, label = "Inquiries" }: SimpleBarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={280}>
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
        <Tooltip
          content={<ChartTooltipContent />}
          cursor={{ fill: "var(--color-surface-secondary)" }}
        />
        <Bar
          dataKey="value"
          fill={CHART_COLORS.accent}
          radius={[2, 2, 0, 0]}
          maxBarSize={14}
          name={label}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
