"use client";

import { ChartCard, MetricCard, SectionHeading } from "@/components/shared";
import { VerificationTypeComboChart } from "@/components/charts/VerificationTypeComboChart";
import type { HighlightMetric, TimeSeriesPoint, VerificationRatePoint } from "@/lib/types";

interface VerificationTypeSectionProps {
  typeKey: string;
  typeLabel: string;
  highlights: HighlightMetric[];
  volumeData: TimeSeriesPoint[];
  rateData: VerificationRatePoint[];
}

export function VerificationTypeSection({
  typeKey,
  typeLabel,
  highlights,
  volumeData,
  rateData,
}: VerificationTypeSectionProps) {
  return (
    <section key={typeKey}>
      <SectionHeading size="sm">{typeLabel}</SectionHeading>
      <div className="grid grid-cols-3 gap-3">
        {highlights.map((metric) => (
          <MetricCard
            key={`${typeKey}-${metric.label}`}
            label={metric.label}
            value={metric.value}
            description={metric.description}
            tooltip={metric.tooltip}
            trend={metric.trend != null ? { value: metric.trend } : undefined}
            invertTrend={metric.invertTrend}
            variant="compact"
          />
        ))}
      </div>
      <div className="mt-3">
        <ChartCard
          title={`${typeLabel} Trends`}
          description="Volume and pass rate over time"
        >
          <VerificationTypeComboChart volumeData={volumeData} rateData={rateData} />
        </ChartCard>
      </div>
    </section>
  );
}
