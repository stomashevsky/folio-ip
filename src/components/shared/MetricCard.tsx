"use client";

import { TrendingUp, TrendingDown } from "lucide-react";

interface MetricCardProps {
  label: string;
  value: string | number;
  trend?: {
    value: number;
    label?: string;
  };
  icon?: React.ReactNode;
}

export function MetricCard({ label, value, trend, icon }: MetricCardProps) {
  const isPositive = trend && trend.value >= 0;

  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-[var(--color-text-secondary)]">
          {label}
        </p>
        {icon && (
          <div className="text-[var(--color-text-tertiary)]">{icon}</div>
        )}
      </div>
      <p className="mt-2 text-2xl font-semibold tracking-tight text-[var(--color-text)]">
        {value}
      </p>
      {trend && (
        <div className="mt-1 flex items-center gap-1">
          {isPositive ? (
            <TrendingUp className="h-3 w-3 text-[var(--color-success-solid-bg)]" />
          ) : (
            <TrendingDown className="h-3 w-3 text-[var(--color-danger-solid-bg)]" />
          )}
          <span
            className={`text-xs font-medium ${
              isPositive
                ? "text-[var(--color-success-solid-bg)]"
                : "text-[var(--color-danger-solid-bg)]"
            }`}
          >
            {trend.value >= 0 ? "+" : ""}
            {trend.value.toFixed(1)}%
          </span>
          {trend.label && (
            <span className="text-xs text-[var(--color-text-tertiary)]">
              {trend.label}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
