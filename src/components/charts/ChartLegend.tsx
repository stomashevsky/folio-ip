"use client";

import type { Payload } from "recharts/types/component/DefaultLegendContent";
import { CHART_LEGEND } from "@/lib/constants/chart-colors";

interface ChartLegendProps {
  payload?: Payload[];
  formatter?: (value: string) => string;
}

export function ChartLegend({ payload, formatter }: ChartLegendProps) {
  if (!payload?.length) return null;

  return (
    <ul
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: CHART_LEGEND.gap,
        justifyContent: "flex-end",
        listStyle: "none",
        margin: 0,
        padding: `0 0 ${CHART_LEGEND.paddingBottom}px`,
      }}
    >
      {payload.map((entry) => (
        <li
          key={String(entry.value)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: CHART_LEGEND.fontSize,
            color: CHART_LEGEND.color,
          }}
        >
          <span
            style={{
              width: CHART_LEGEND.iconSize,
              height: CHART_LEGEND.iconSize,
              borderRadius: "50%",
              backgroundColor: entry.color,
              flexShrink: 0,
            }}
          />
          {formatter ? formatter(String(entry.value)) : String(entry.value)}
        </li>
      ))}
    </ul>
  );
}
