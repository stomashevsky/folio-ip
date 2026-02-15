"use client";

import React, { Suspense, useState, useMemo, useCallback } from "react";
import { DateTime } from "luxon";
import { TopBar } from "@/components/layout/TopBar";
import { ChartCard, MetricCard } from "@/components/shared";
import { SimpleBarChart } from "@/components/charts/SimpleBarChart";
import { VerificationRatesChart } from "@/components/charts/VerificationRatesChart";
import {
  deriveVerificationHighlights,
  generateVerificationTimeSeries,
  generateVerificationRateTimeSeries,
} from "@/lib/data";
import { aggregateVolume, aggregateVerificationRates } from "@/lib/utils/analytics";
import { DASHBOARD_DATE_SHORTCUTS, type DateRange } from "@/lib/constants/date-shortcuts";
import type { AnalyticsInterval } from "@/lib/types";
import { Select } from "@plexui/ui/components/Select";
import { DateRangePicker } from "@plexui/ui/components/DateRangePicker";
import { ANALYTICS_INTERVAL_OPTIONS } from "@/lib/constants/filter-options";

const INTERVAL_OPTIONS = ANALYTICS_INTERVAL_OPTIONS;
const defaultRange: DateRange = DASHBOARD_DATE_SHORTCUTS[1].getDateRange();

export default function VerificationsAnalyticsPage() {
  return (
    <Suspense fallback={null}>
      <VerificationsAnalyticsContent />
    </Suspense>
  );
}

function VerificationsAnalyticsContent() {
  const [dateRange, setDateRange] = useState<DateRange | null>(defaultRange);
  const [interval, setInterval] = useState<AnalyticsInterval>("daily");

  const handleRangeChange = useCallback((next: DateRange | null) => {
    setDateRange(next);
  }, []);

  const days = useMemo(() => {
    if (!dateRange) return 30;
    return Math.max(1, Math.round(dateRange[1].diff(dateRange[0], "days").days) + 1);
  }, [dateRange]);

  const highlights = useMemo(() => deriveVerificationHighlights(days), [days]);
  const volumeData = useMemo(
    () => aggregateVolume(generateVerificationTimeSeries(days), interval),
    [days, interval],
  );
  const ratesData = useMemo(
    () => aggregateVerificationRates(generateVerificationRateTimeSeries(days), interval),
    [days, interval],
  );

  return (
    <div className="flex min-h-full flex-col">
      <TopBar
        title="Verification Analytics"
        actions={
          <DateRangePicker
            value={dateRange}
            onChange={handleRangeChange}
            shortcuts={DASHBOARD_DATE_SHORTCUTS}
            size="md"
            pill={false}
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
          <ChartCard
            title="Verification Volume"
            description="Number of verifications processed"
          >
            <SimpleBarChart data={volumeData} label="Verifications" />
          </ChartCard>

          <ChartCard
            title="Pass & Processed Rates"
            description="Percentage trends over time"
          >
            <VerificationRatesChart data={ratesData} />
          </ChartCard>
        </div>
      </div>
    </div>
  );
}
