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
import { VERIFICATION_TYPE_ANALYTICS_CONFIG } from "@/lib/data";

interface TypeRatesLineChartProps {
  data: TypedTimeSeriesPoint[];
  typeKeys: string[];
}

export function TypeRatesLineChart({ data, typeKeys }: TypeRatesLineChartProps) {
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
        <Tooltip
          contentStyle={{
            backgroundColor: "var(--color-surface-elevated)",
            border: "1px solid var(--color-border)",
            borderRadius: "8px",
            fontSize: "13px",
            color: "var(--color-text)",
          }}
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
          formatter={(value: number, name: string) => [`${value}%`, name]}
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
          <Line
            key={key}
            type="monotone"
            dataKey={key}
            stroke={TYPE_CHART_PALETTE[i % TYPE_CHART_PALETTE.length]}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
            name={VERIFICATION_TYPE_ANALYTICS_CONFIG[key]?.label ?? key}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
