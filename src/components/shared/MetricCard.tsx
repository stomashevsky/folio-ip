"use client";

import { TrendingUp, TrendingDown } from "lucide-react";

interface MetricCardProps {
  label: string;
  value: string | number;
  trend?: {
    value: number;
    label?: string;
  };
  description?: string;
}

export function MetricCard({ label, value, trend, description }: MetricCardProps) {
  const isPositive = trend && trend.value >= 0;

  return (
    <div className="flex flex-col justify-between rounded-[10px] border border-black/10 bg-[var(--color-surface)] p-5 dark:border-white/10">
      {/* Top row: label + trend badge */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-[var(--color-text-secondary)]">
          {label}
        </p>
        {trend && (
          <span
            className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${
              isPositive
                ? "border-[var(--color-border)] text-[var(--color-text-secondary)]"
                : "border-[var(--color-border)] text-[var(--color-text-secondary)]"
            }`}
          >
            {isPositive ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            {trend.value >= 0 ? "+" : ""}
            {trend.value.toFixed(1)}%
          </span>
        )}
      </div>

      {/* Value */}
      <p className="mt-3 text-3xl font-semibold tracking-tight text-[var(--color-text)]">
        {value}
      </p>

      {/* Bottom row: description + trend icon */}
      {(description || trend?.label) && (
        <div className="mt-2 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-[var(--color-text)]">
              {description}
            </p>
            {trend?.label && (
              <p className="text-xs text-[var(--color-text-tertiary)]">
                {trend.label}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
