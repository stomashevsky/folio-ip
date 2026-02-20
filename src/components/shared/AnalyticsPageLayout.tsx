"use client";

import React, { useState, useMemo, useCallback, type ReactNode } from "react";
import { DateTime } from "luxon";
import { TopBar, TOPBAR_CONTROL_SIZE, TOPBAR_ACTION_PILL } from "@/components/layout/TopBar";
import { ChartCard, MetricCard } from "@/components/shared";
import { SimpleBarChart } from "@/components/charts/SimpleBarChart";
import { DASHBOARD_DATE_SHORTCUTS, type DateRange } from "@/lib/constants/date-shortcuts";
import type { AnalyticsInterval, TimeSeriesPoint } from "@/lib/types";
import { Select } from "@plexui/ui/components/Select";
import { DateRangePicker } from "@plexui/ui/components/DateRangePicker";
import { ANALYTICS_INTERVAL_OPTIONS } from "@/lib/constants/filter-options";
import { aggregateVolume } from "@/lib/utils/analytics";

interface Highlight {
  label: string;
  value: string | number;
  description?: string;
  tooltip?: string;
}

interface AnalyticsPageLayoutProps {
  title: string;
  deriveHighlights: (days: number) => Highlight[];
  generateVolumeSeries: (days: number) => TimeSeriesPoint[];
  volumeLabel?: string;
  volumeTitle: string;
  volumeDescription: string;
  ratesTitle: string;
  ratesDescription: string;
  renderRatesChart: (volumeData: TimeSeriesPoint[], interval: AnalyticsInterval, days: number) => ReactNode;
}

const INTERVAL_OPTIONS = ANALYTICS_INTERVAL_OPTIONS;
const defaultRange: DateRange = DASHBOARD_DATE_SHORTCUTS[1].getDateRange();

export function AnalyticsPageLayout({
  title,
  deriveHighlights,
  generateVolumeSeries,
  volumeLabel,
  volumeTitle,
  volumeDescription,
  ratesTitle,
  ratesDescription,
  renderRatesChart,
}: AnalyticsPageLayoutProps) {
  const [dateRange, setDateRange] = useState<DateRange | null>(defaultRange);
  const [interval, setInterval] = useState<AnalyticsInterval>("daily");

  const handleRangeChange = useCallback((next: DateRange | null) => {
    setDateRange(next);
  }, []);

  const days = useMemo(() => {
    if (!dateRange) return 30;
    return Math.max(1, Math.round(dateRange[1].diff(dateRange[0], "days").days) + 1);
  }, [dateRange]);

  const highlights = useMemo(() => deriveHighlights(days), [deriveHighlights, days]);
  const volumeData = useMemo(
    () => aggregateVolume(generateVolumeSeries(days), interval),
    [generateVolumeSeries, days, interval],
  );

  return (
    <div className="flex min-h-full flex-col">
      <TopBar
        title={title}
        actions={
          <DateRangePicker
            value={dateRange}
            onChange={handleRangeChange}
            shortcuts={DASHBOARD_DATE_SHORTCUTS}
            size={TOPBAR_CONTROL_SIZE}
            pill={TOPBAR_ACTION_PILL}
            max={DateTime.local().endOf("day")}
            triggerDateFormat="MM/dd/yy"
          />
        }
      />
      <div className="px-4 pb-6 pt-6 md:px-6">
        <div>
          <h3 className="heading-sm text-[var(--color-text)] mb-3">Highlights</h3>
          <div className="grid grid-cols-3 gap-3 xl:grid-cols-6">
            {highlights.map((metric) => (
              <MetricCard
                key={metric.label}
                label={metric.label}
                value={metric.value}
                description={metric.description}
                tooltip={metric.tooltip}
                variant="compact"
              />
            ))}
          </div>
        </div>

        <div className="mt-6 flex items-center">
          <div className="w-[120px]">
            <Select
              options={INTERVAL_OPTIONS}
              value={interval}
              onChange={(opt) => {
                if (opt) setInterval(opt.value as AnalyticsInterval);
              }}
              size="sm"
              pill={false}
              variant="outline"
              listMinWidth={120}
            />
          </div>
        </div>

        <div className="mt-3 space-y-4">
          <ChartCard title={volumeTitle} description={volumeDescription}>
            <SimpleBarChart data={volumeData} label={volumeLabel} />
          </ChartCard>

          <ChartCard title={ratesTitle} description={ratesDescription}>
            {renderRatesChart(volumeData, interval, days)}
          </ChartCard>
        </div>
      </div>
    </div>
  );
}
