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
import { VERIFICATION_TYPE_ANALYTICS_CONFIG } from "@/lib/data";

interface StackedTypeBarChartProps {
  data: TypedTimeSeriesPoint[];
  typeKeys: string[];
}

export function StackedTypeBarChart({ data, typeKeys }: StackedTypeBarChartProps) {
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
          cursor={{ fill: "var(--color-surface-secondary)" }}
        />
        <Legend
          verticalAlign="top"
          align="right"
          content={({ payload }) => (
            <ul style={{ display: "flex", flexWrap: "wrap", gap: "6px 20px", justifyContent: "flex-end", listStyle: "none", margin: 0, padding: "0 0 4px" }}>
              {payload?.map((entry) => (
                <li key={entry.value} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--color-text-secondary)" }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: entry.color, flexShrink: 0 }} />
                  {entry.value}
                </li>
              ))}
            </ul>
          )}
        />
        {typeKeys.map((key, i) => (
          <Bar
            key={key}
            dataKey={key}
            stackId="volume"
            fill={TYPE_CHART_PALETTE[i % TYPE_CHART_PALETTE.length]}
            name={VERIFICATION_TYPE_ANALYTICS_CONFIG[key]?.label ?? key}
            radius={i === typeKeys.length - 1 ? [2, 2, 0, 0] : undefined}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
