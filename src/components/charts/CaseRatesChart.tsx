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
import type { CaseRatePoint } from "@/lib/types";
import { CHART_COLORS } from "@/lib/constants/chart-colors";
import { ChartLegend } from "./ChartLegend";
import { ChartTooltipContent } from "./ChartTooltipContent";

interface CaseRatesChartProps {
  data: CaseRatePoint[];
}

export function CaseRatesChart({ data }: CaseRatesChartProps) {
  return (
    <ResponsiveContainer width="100%" height={280}>
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
        <Line
          type="monotone"
          dataKey="resolutionRate"
          stroke={CHART_COLORS.primary}
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4 }}
          name="Resolution Rate"
        />
        <Line
          type="monotone"
          dataKey="slaComplianceRate"
          stroke={CHART_COLORS.success}
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4 }}
          name="SLA Compliance"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
