"use client";

import { useMemo } from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  Line,
} from "recharts";
import type { TimeSeriesPoint, VerificationRatePoint } from "@/lib/types";
import { CHART_COLORS } from "@/lib/constants/chart-colors";

interface VerificationTypeComboChartProps {
  volumeData: TimeSeriesPoint[];
  rateData: VerificationRatePoint[];
}

const TOOLTIP_CONTENT_STYLE: React.CSSProperties = {
  backgroundColor: "var(--color-surface-elevated)",
  border: "1px solid var(--color-border)",
  borderRadius: 8,
  fontSize: 13,
};

export function VerificationTypeComboChart({ volumeData, rateData }: VerificationTypeComboChartProps) {
  const mergedData = useMemo(() => {
    const byDate = new Map<string, { date: string; value: number; passRate: number }>();

    for (const point of volumeData) {
      byDate.set(point.date, { date: point.date, value: point.value, passRate: 0 });
    }

    for (const point of rateData) {
      const existing = byDate.get(point.date);
      if (existing) {
        existing.passRate = point.passRate;
        continue;
      }
      byDate.set(point.date, { date: point.date, value: 0, passRate: point.passRate });
    }

    return Array.from(byDate.values()).sort((a, b) => a.date.localeCompare(b.date));
  }, [volumeData, rateData]);

  return (
    <ResponsiveContainer width="100%" height={240}>
      <ComposedChart data={mergedData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
        <CartesianGrid
          stroke="var(--color-border)"
          strokeDasharray=""
          vertical={false}
        />
        <XAxis
          dataKey="date"
          tickFormatter={(value: string) => {
            const date = new Date(value);
            return date.toLocaleDateString("en-US", { month: "numeric", day: "numeric" });
          }}
          stroke="var(--color-text-tertiary)"
          fontSize={13}
          tickLine={false}
          axisLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          yAxisId="volume"
          stroke="var(--color-text-tertiary)"
          fontSize={13}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          yAxisId="rate"
          orientation="right"
          domain={[0, 100]}
          tickFormatter={(value: number) => `${value}%`}
          stroke="var(--color-text-tertiary)"
          fontSize={13}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          contentStyle={TOOLTIP_CONTENT_STYLE}
          formatter={(value: number | string, name) => {
            if (name === "Pass Rate" && typeof value === "number") {
              return [`${value}%`, name];
            }
            return [value, name];
          }}
          labelFormatter={(value) => {
            const date = new Date(String(value));
            return date.toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
              year: "numeric",
            });
          }}
        />
        <Bar
          yAxisId="volume"
          dataKey="value"
          fill={CHART_COLORS.accent}
          radius={[2, 2, 0, 0]}
          maxBarSize={14}
          name="Volume"
        />
        <Line
          yAxisId="rate"
          type="monotone"
          dataKey="passRate"
          stroke={CHART_COLORS.success}
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4 }}
          name="Pass Rate"
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
