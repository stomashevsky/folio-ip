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
import type { FunnelTimeSeriesPoint } from "@/lib/types";
import { FUNNEL_STEPS } from "@/lib/data/mock-analytics";
import { ChartLegend } from "./ChartLegend";
import { ChartTooltipContent } from "./ChartTooltipContent";

interface FunnelTrendChartProps {
  data: FunnelTimeSeriesPoint[];
}

export function FunnelTrendChart({ data }: FunnelTrendChartProps) {
  // Skip "Created" (always 100%) — show remaining 6 steps
  const visibleSteps = FUNNEL_STEPS.slice(1);

  return (
    <ResponsiveContainer width="100%" height={320}>
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
          domain={[50, 100]}
          tickFormatter={(v: number) => `${v}%`}
          stroke="var(--color-text-tertiary)"
          fontSize={13}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          content={
            <ChartTooltipContent
              valueFormatter={(v) => `${v}%`}
              nameFormatter={(key) => visibleSteps.find((s) => s.key === key)?.name ?? key}
            />
          }
        />
        <Legend
          verticalAlign="top"
          align="right"
          content={
            <ChartLegend
              formatter={(key) =>
                visibleSteps.find((s) => s.key === key)?.name ?? key
              }
            />
          }
        />
        {visibleSteps.map((step) => (
          <Line
            key={step.key}
            type="monotone"
            dataKey={step.key}
            stroke={step.color}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
            name={step.key}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
