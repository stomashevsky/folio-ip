"use client";

import React, { Suspense, useState, useMemo, useCallback } from "react";
import { useTabParam } from "@/lib/hooks/useTabParam";
import { DateTime } from "luxon";
import { TopBar, TOPBAR_CONTROL_SIZE, TOPBAR_TOOLBAR_PILL } from "@/components/layout/TopBar";
import { ChartCard, MetricCard } from "@/components/shared";
import { SimpleBarChart } from "@/components/charts/SimpleBarChart";
import { CaseRatesChart } from "@/components/charts/CaseRatesChart";
import {
  deriveCaseHighlights,
  generateCaseTimeSeries,
  generateCaseRateTimeSeries,
} from "@/lib/data";
import { aggregateVolume, aggregateCaseRates } from "@/lib/utils/analytics";
import { DASHBOARD_DATE_SHORTCUTS, type DateRange } from "@/lib/constants/date-shortcuts";
import type { AnalyticsInterval } from "@/lib/types";
import { SegmentedControl } from "@plexui/ui/components/SegmentedControl";
import { Select } from "@plexui/ui/components/Select";
import { DateRangePicker } from "@plexui/ui/components/DateRangePicker";
import { ANALYTICS_INTERVAL_OPTIONS } from "@/lib/constants/filter-options";

const tabs = ["Overview", "SLA"] as const;
type Tab = (typeof tabs)[number];

const INTERVAL_OPTIONS = ANALYTICS_INTERVAL_OPTIONS;

const defaultRange: DateRange = DASHBOARD_DATE_SHORTCUTS[1].getDateRange();

export default function CaseAnalyticsPage() {
  return (
    <Suspense fallback={null}>
      <CaseAnalyticsContent />
    </Suspense>
  );
}

function CaseAnalyticsContent() {
  const [activeTab, setActiveTab] = useTabParam(tabs, "Overview");
  const [dateRange, setDateRange] = useState<DateRange | null>(defaultRange);
  const [interval, setInterval] = useState<AnalyticsInterval>("daily");

  const handleRangeChange = useCallback(
    (next: DateRange | null) => {
      setDateRange(next);
    },
    [],
  );

  const days = useMemo(() => {
    if (!dateRange) return 30;
    return Math.max(1, Math.round(dateRange[1].diff(dateRange[0], "days").days) + 1);
  }, [dateRange]);

  const highlights = useMemo(() => deriveCaseHighlights(days), [days]);
  const volumeData = useMemo(
    () => aggregateVolume(generateCaseTimeSeries(days), interval),
    [days, interval],
  );
  const ratesData = useMemo(
    () => aggregateCaseRates(generateCaseRateTimeSeries(days), interval),
    [days, interval],
  );

  const slaHighlights = useMemo(() => {
    const hl = deriveCaseHighlights(days);
    return hl.filter(
      (h) =>
        h.label === "SLA Compliance" ||
        h.label === "Avg Resolution" ||
        h.label === "Open" ||
        h.label === "Escalated",
    );
  }, [days]);

  return (
    <div className="flex min-h-full flex-col">
      <TopBar
        title="Case Analytics"
        toolbar={
          <div className="flex w-full items-center justify-between">
            <SegmentedControl
              aria-label="Analytics views"
              value={activeTab}
              onChange={(v) => setActiveTab(v as Tab)}
              size={TOPBAR_CONTROL_SIZE}
              pill={TOPBAR_TOOLBAR_PILL}
            >
              <SegmentedControl.Tab value="Overview">Overview</SegmentedControl.Tab>
              <SegmentedControl.Tab value="SLA">SLA &amp; Performance</SegmentedControl.Tab>
            </SegmentedControl>
            <DateRangePicker
              value={dateRange}
              onChange={handleRangeChange}
              shortcuts={DASHBOARD_DATE_SHORTCUTS}
              size={TOPBAR_CONTROL_SIZE}
              pill={TOPBAR_TOOLBAR_PILL}
              max={DateTime.local().endOf("day")}
              triggerDateFormat="MM/dd/yy"
            />
          </div>
        }
      />
      <div className="px-4 pb-6 pt-6 md:px-6">
        {activeTab === "Overview" && (
          <>
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
                title="Case Volume"
                description="Number of cases created"
              >
                <SimpleBarChart data={volumeData} />
              </ChartCard>

              <ChartCard
                title="Resolution & SLA Rates"
                description="Percentage trends over time"
              >
                <CaseRatesChart data={ratesData} />
              </ChartCard>
            </div>
          </>
        )}

        {activeTab === "SLA" && (
          <>
            <div>
              <h3 className="heading-sm text-[var(--color-text)] mb-3">SLA Performance</h3>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {slaHighlights.map((metric) => (
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
                title="SLA Compliance Trend"
                description="Percentage of cases resolved within SLA over time"
              >
                <CaseRatesChart data={ratesData} />
              </ChartCard>

              <ChartCard
                title="Case Volume by Period"
                description="Cases created per period"
              >
                <SimpleBarChart data={volumeData} />
              </ChartCard>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
