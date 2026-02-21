"use client";

import { InfoCircle } from "@plexui/ui/components/Icon";
import { Tooltip } from "@plexui/ui/components/Tooltip";

interface MetricCardProps {
  label: string;
  value: string | number;
  trend?: {
    value: number;
    label?: string;
  };
  /** When true, a positive trend is bad (red) and negative is good (green). Use for metrics like "Avg Completion Time", "Error Rate", "Pending Review". */
  invertTrend?: boolean;
  tooltip?: string;
  description?: string;
  variant?: "default" | "compact";
}

function trendStyle(value: number, invert: boolean): React.CSSProperties {
  if (value === 0) return { color: "var(--color-text-tertiary)" };
  const isGood = invert ? value < 0 : value > 0;
  return { color: isGood ? "var(--color-text-success-soft)" : "var(--color-text-danger-soft)" };
}

function formatTrend(value: number): string {
  if (value === 0) return "0%";
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
}

export function MetricCard({
  label,
  value,
  trend,
  invertTrend = false,
  tooltip,
  description,
  variant = "default",
}: MetricCardProps) {
  const trendEl = trend != null && (
    <span
      className={`${variant === "compact" ? "text-xs" : "text-sm"} font-semibold`}
      style={trendStyle(trend.value, invertTrend)}
    >
      {formatTrend(trend.value)}
    </span>
  );

  if (variant === "compact") {
    return (
      <div className="h-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3">
        <div className="flex items-center gap-1">
          <p className="text-xs whitespace-nowrap text-[var(--color-text-secondary)]">{label}</p>
          {tooltip && (
            <Tooltip content={tooltip}>
              <InfoCircle className="h-3.5 w-3.5 shrink-0 cursor-help text-[var(--color-text-tertiary)]" />
            </Tooltip>
          )}
        </div>
        <div className="mt-1.5 flex items-baseline gap-1.5">
          <p className="heading-md text-[var(--color-text)]">{value}</p>
          {trendEl}
        </div>
        {description && (
          <p className="mt-0.5 text-xs text-[var(--color-text-tertiary)]">{description}</p>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-between rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
      <p className="text-sm text-[var(--color-text-secondary)]">{label}</p>

      <div className="mt-3 flex items-baseline gap-2">
        <p className="heading-xl text-[var(--color-text)]">{value}</p>
        {trendEl}
      </div>

      {/* Bottom row: description + trend label */}
      {(description || trend?.label) && (
        <div className="mt-2">
          {description && (
            <p className="text-sm text-[var(--color-text)]">{description}</p>
          )}
          {trend?.label && (
            <p className="text-sm text-[var(--color-text-tertiary)]">
              {trend.label}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
