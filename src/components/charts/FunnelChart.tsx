"use client";

import { useState } from "react";
import { formatNumber } from "@/lib/utils/format";
import type { FunnelStep } from "@/lib/types";

export type FunnelMode = "overall" | "per_step";

interface FunnelChartProps {
  steps: FunnelStep[];
  mode: FunnelMode;
}

export function FunnelChart({ steps, mode }: FunnelChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="space-y-2.5">
      {steps.map((step, i) => {
        const barWidth =
          mode === "overall"
            ? step.percentage
            : i === 0
              ? 100
              : Math.round((step.count / steps[i - 1].count) * 1000) / 10;

        // Previous step bar width (for drop-off zone in overall mode)
        const prevBarWidth =
          mode === "overall" && i > 0 ? steps[i - 1].percentage : 100;

        const isHovered = hoveredIndex === i;
        const hasDim = hoveredIndex !== null && !isHovered;

        return (
          <div
            key={step.key}
            className="group relative"
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div
              className={`flex items-center gap-4 transition-opacity duration-200 ${
                hasDim ? "opacity-50" : "opacity-100"
              }`}
            >
              {/* Step label */}
              <div className="w-36 shrink-0 text-right">
                <span className="text-sm text-[var(--color-text)]">
                  {step.name}
                </span>
              </div>

              {/* Bar track */}
              <div className="relative h-10 flex-1 overflow-hidden rounded-lg bg-[var(--color-surface-secondary)]">
                {/* Drop-off zone (subtle red tint) */}
                {mode === "overall" && step.dropoff > 0 && (
                  <div
                    className="absolute inset-y-0 rounded-r-lg bg-[var(--color-background-danger-solid)]/5 transition-all duration-500"
                    style={{
                      left: `${barWidth}%`,
                      width: `${prevBarWidth - barWidth}%`,
                    }}
                  />
                )}

                {/* Main bar */}
                <div
                  className="absolute inset-y-0 left-0 rounded-lg transition-all duration-500"
                  style={{
                    width: `${barWidth}%`,
                    background: isHovered
                      ? `linear-gradient(90deg, ${step.color}50, ${step.color}cc)`
                      : `linear-gradient(90deg, ${step.color}30, ${step.color}80)`,
                  }}
                />

                {/* Inline bar label (count inside bar if wide enough) */}
                {barWidth > 15 && (
                  <div
                    className="absolute inset-y-0 left-0 flex items-center px-3 transition-all duration-500"
                    style={{ width: `${barWidth}%` }}
                  >
                    <span className="text-xs text-[var(--color-text-secondary)]">
                      {formatNumber(step.count)}
                    </span>
                  </div>
                )}
              </div>

              {/* Metrics */}
              <div className="flex w-48 shrink-0 items-center justify-end gap-3">
                <span className="heading-xs text-[var(--color-text)] w-16 text-right tabular-nums">
                  {formatNumber(step.count)}
                </span>
                <span className="text-xs text-[var(--color-text-tertiary)] w-14 text-right tabular-nums">
                  {mode === "overall"
                    ? `${step.percentage}%`
                    : i === 0
                      ? "100%"
                      : `${barWidth}%`}
                </span>
                {step.dropoff > 0 ? (
                  <span className="text-xs text-[var(--color-background-danger-solid)] w-14 text-right tabular-nums">
                    −{step.dropoff}%
                  </span>
                ) : (
                  <span className="w-14" />
                )}
              </div>
            </div>

            {/* Hover tooltip */}
            {isHovered && i > 0 && (
              <div className="absolute left-40 top-full z-20 mt-1 w-64 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-3 shadow-lg">
                <p className="heading-xs text-[var(--color-text)] mb-2">{step.name}</p>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-xs text-[var(--color-text-secondary)]">Count</span>
                    <span className="text-xs text-[var(--color-text)] tabular-nums">
                      {formatNumber(step.count)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-[var(--color-text-secondary)]">Overall rate</span>
                    <span className="text-xs text-[var(--color-text)] tabular-nums">
                      {step.percentage}% of all
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-[var(--color-text-secondary)]">From previous</span>
                    <span className="text-xs text-[var(--color-text)] tabular-nums">
                      {Math.round((step.count / steps[i - 1].count) * 1000) / 10}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-[var(--color-text-secondary)]">Drop-off</span>
                    <span className="text-xs text-[var(--color-background-danger-solid)] tabular-nums">
                      −{formatNumber(steps[i - 1].count - step.count)} (−{step.dropoff}%)
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
