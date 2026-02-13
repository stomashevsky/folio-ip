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
          contentStyle={{
            backgroundColor: "var(--color-surface-elevated)",
            border: "1px solid var(--color-border)",
            borderRadius: "8px",
            fontSize: "13px",
            color: "var(--color-text)",
          }}
          itemStyle={{ color: "var(--color-text)" }}
          labelStyle={{ color: "var(--color-text)" }}
          labelFormatter={(label: string) => {
            const d = new Date(label);
            return d.toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
              year: "numeric",
            });
          }}
          formatter={(value: number, name: string) => [
            `${value}%`,
            visibleSteps.find((s) => s.key === name)?.name ?? name,
          ]}
        />
        <Legend
          verticalAlign="top"
          align="right"
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ fontSize: "12px", paddingBottom: "8px" }}
          formatter={(value: string) =>
            visibleSteps.find((s) => s.key === value)?.name ?? value
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
