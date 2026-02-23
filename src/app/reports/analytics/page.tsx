"use client";

import { Suspense, useState, useMemo, useCallback } from "react";
import { useTabParam } from "@/lib/hooks/useTabParam";
import { DateTime } from "luxon";
import { TopBar, TOPBAR_CONTROL_SIZE, TOPBAR_TOOLBAR_PILL, TOPBAR_ACTION_PILL } from "@/components/layout/TopBar";
import { ChartCard, MetricCard, SavedViewsControl, SectionHeading } from "@/components/shared";
import { StackedTypeBarChart } from "@/components/charts/StackedTypeBarChart";
import { TypeRatesLineChart } from "@/components/charts/TypeRatesLineChart";
import { VolumeComparisonTable } from "./components/VolumeComparisonTable";
import { ScreeningComparisonTable } from "./components/ScreeningComparisonTable";
import {
  REPORT_TYPE_ANALYTICS_CONFIG,
  generateReportStackedVolumeTimeSeries,
  generateReportMultiTypeRateTimeSeries,
  deriveReportTypeRows,
  deriveReportTypeScreeningRows,
  deriveReportTypeAggregateHighlights,
  deriveReportTypeScreeningAggregateHighlights,
} from "@/lib/data";
import type { TypedTimeSeriesPoint } from "@/lib/data";
import { aggregateTypedVolume, aggregateTypedRates } from "@/lib/utils/analytics";
import { DASHBOARD_DATE_SHORTCUTS, type DateRange } from "@/lib/constants/date-shortcuts";
import type { AnalyticsInterval } from "@/lib/types";
import {
  REPORT_TYPE_ANALYTICS_OPTIONS,
  REPORT_CREATED_BY_OPTIONS,
  ANALYTICS_INTERVAL_OPTIONS,
} from "@/lib/constants/filter-options";
import { Tabs } from "@plexui/ui/components/Tabs";
import { Select } from "@plexui/ui/components/Select";
import { Button } from "@plexui/ui/components/Button";
import { DateRangePicker } from "@plexui/ui/components/DateRangePicker";
import { Download } from "@plexui/ui/components/Icon";

const tabs = ["Volume", "Screening"] as const;
type Tab = (typeof tabs)[number];

const ALL_REPORT_TYPE_KEYS = Object.keys(REPORT_TYPE_ANALYTICS_CONFIG);
const REPORT_LABEL_MAP = Object.fromEntries(
  Object.entries(REPORT_TYPE_ANALYTICS_CONFIG).map(([k, v]) => [k, v.label]),
);

const defaultRange: DateRange = DASHBOARD_DATE_SHORTCUTS[1].getDateRange();

export default function ReportsAnalyticsPage() {
  return (
    <Suspense fallback={null}>
      <ReportsAnalyticsContent />
    </Suspense>
  );
}

function ReportsAnalyticsContent() {
  const [activeTab, setActiveTab] = useTabParam(tabs, "Volume");
  const [dateRange, setDateRange] = useState<DateRange | null>(defaultRange);
  const [interval, setInterval] = useState<AnalyticsInterval>("daily");

  const [typeFilter, setTypeFilter] = useState<string[]>([]);
  const [createdByFilter, setCreatedByFilter] = useState("");

  const handleRangeChange = useCallback((next: DateRange | null) => { setDateRange(next); }, []);

  function clearAllFilters() {
    setTypeFilter([]);
    setCreatedByFilter("");
    setDateRange(defaultRange);
    setInterval("daily");
  }

  const currentViewState = useMemo(() => ({
    filters: {
      type: typeFilter,
      createdBy: createdByFilter ? [createdByFilter] : [] as string[],
      interval: [interval],
    },
    columnVisibility: {},
  }), [typeFilter, createdByFilter, interval]);

  const days = useMemo(() => {
    if (!dateRange) return 30;
    return Math.max(1, Math.round(dateRange[1].diff(dateRange[0], "days").days) + 1);
  }, [dateRange]);

  const activeTypeKeys = useMemo(
    () => (typeFilter.length > 0 ? typeFilter : ALL_REPORT_TYPE_KEYS),
    [typeFilter],
  );

  const filterScale = useMemo(() => {
    let scale = 1;
    if (createdByFilter) scale *= 0.5;
    return scale;
  }, [createdByFilter]);

  const volumeHighlights = useMemo(() => {
    if (activeTab !== "Volume") return [];
    const raw = deriveReportTypeAggregateHighlights(days, activeTypeKeys);
    if (filterScale === 1) return raw;
    return raw.map((m) => {
      if (m.label === "Total Reports") {
        const num = Number(m.value.replace(/,/g, ""));
        return { ...m, value: Math.round(num * filterScale).toLocaleString() };
      }
      return m;
    });
  }, [activeTab, days, activeTypeKeys, filterScale]);

  const volumeTableRows = useMemo(() => {
    if (activeTab !== "Volume") return [];
    const raw = deriveReportTypeRows(days, activeTypeKeys);
    if (filterScale === 1) return raw;
    return raw.map((r) => ({ ...r, created: Math.round(r.created * filterScale) }));
  }, [activeTab, days, activeTypeKeys, filterScale]);

  const volumeChartData = useMemo(() => {
    if (activeTab !== "Volume") return [];
    const raw = generateReportStackedVolumeTimeSeries(days, activeTypeKeys);
    const aggregated = aggregateTypedVolume(raw, interval, activeTypeKeys);
    if (filterScale === 1) return aggregated;
    return aggregated.map((point) => {
      const scaled: TypedTimeSeriesPoint = { date: point.date };
      for (const key of activeTypeKeys) {
        scaled[key] = Math.round((point[key] as number) * filterScale);
      }
      return scaled;
    });
  }, [activeTab, days, activeTypeKeys, interval, filterScale]);

  const screeningHighlights = useMemo(() => {
    if (activeTab !== "Screening") return [];
    return deriveReportTypeScreeningAggregateHighlights(days, activeTypeKeys);
  }, [activeTab, days, activeTypeKeys]);

  const screeningTableRows = useMemo(() => {
    if (activeTab !== "Screening") return [];
    return deriveReportTypeScreeningRows(days, activeTypeKeys);
  }, [activeTab, days, activeTypeKeys]);

  const screeningChartData = useMemo(() => {
    if (activeTab !== "Screening") return [];
    const raw = generateReportMultiTypeRateTimeSeries(days, activeTypeKeys);
    return aggregateTypedRates(raw, interval, activeTypeKeys);
  }, [activeTab, days, activeTypeKeys, interval]);

  return (
    <div className="flex min-h-full flex-col">
      <TopBar
        title="Report Analytics"
        actions={
          <>
            <SavedViewsControl
              entityType="report-analytics"
              currentState={currentViewState}
              onLoadView={(state) => {
                setTypeFilter(state.filters.type ?? []);
                setCreatedByFilter(state.filters.createdBy?.[0] ?? "");
                if (state.filters.interval?.[0]) setInterval(state.filters.interval[0] as AnalyticsInterval);
              }}
              onClearView={clearAllFilters}
            />
            <Button
              color="secondary"
              variant="outline"
              size={TOPBAR_CONTROL_SIZE}
              pill={TOPBAR_ACTION_PILL}
            >
              <Download /> Export
            </Button>
          </>
        }
        toolbar={
          <Tabs
            aria-label="Analytics views"
            value={activeTab}
            onChange={(v) => setActiveTab(v as Tab)}
            size={TOPBAR_CONTROL_SIZE}
            pill={TOPBAR_TOOLBAR_PILL}
          >
            <Tabs.Tab value="Volume">Volume</Tabs.Tab>
            <Tabs.Tab value="Screening">Screening</Tabs.Tab>
          </Tabs>
        }
      />
      <div className="px-4 pb-6 pt-6 md:px-6">
        <p className="text-sm -mt-1 mb-5 text-[var(--color-text-tertiary)]">
          {activeTab === "Volume"
            ? "Creation volume, processing throughput, and match rates by report type."
            : "Match/no-match rates, screening outcomes, and average processing times by report type."}
        </p>

        {activeTab === "Volume" && (
          <>
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <DateRangePicker
                value={dateRange}
                onChange={handleRangeChange}
                shortcuts={DASHBOARD_DATE_SHORTCUTS}
                size="sm"
                max={DateTime.local().endOf("day")}
                triggerDateFormat="MM/dd/yy"
              />
              <div className="w-48">
                <Select
                  options={REPORT_TYPE_ANALYTICS_OPTIONS}
                  value={typeFilter}
                  onChange={(opts) => setTypeFilter(opts.map((o) => o.value))}
                  multiple
                  clearable
                  placeholder="All types"
                  size="sm"
                  variant="outline"
                  listMinWidth={220}
                />
              </div>
              <div className="w-40">
                <Select
                  options={REPORT_CREATED_BY_OPTIONS}
                  value={createdByFilter}
                  onChange={(opt) => setCreatedByFilter(opt?.value ?? "")}
                  clearable
                  placeholder="All sources"
                  size="sm"
                  variant="outline"
                  listMinWidth={160}
                />
              </div>
            </div>

            <div>
              <SectionHeading>Highlights</SectionHeading>
              <div className="grid grid-cols-3 gap-3">
                {volumeHighlights.map((metric) => (
                  <MetricCard
                    key={metric.label}
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
            </div>

            <div className="mt-6">
              <SectionHeading>By Report Type</SectionHeading>
              <VolumeComparisonTable rows={volumeTableRows} typeKeys={activeTypeKeys} />
            </div>

            <div className="mt-6 flex items-center">
              <div className="w-[120px]">
                <Select
                  options={ANALYTICS_INTERVAL_OPTIONS}
                  value={interval}
                  onChange={(opt) => {
                    if (opt) setInterval(opt.value as AnalyticsInterval);
                  }}
                  size="sm"
                  pill
                  variant="outline"
                  listMinWidth={120}
                />
              </div>
            </div>

            <div className="mt-3">
              <ChartCard title="Volume by Type" description="Stacked report volume over time">
                <StackedTypeBarChart data={volumeChartData} typeKeys={activeTypeKeys} labelMap={REPORT_LABEL_MAP} />
              </ChartCard>
            </div>
          </>
        )}

        {activeTab === "Screening" && (
          <>
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <DateRangePicker
                value={dateRange}
                onChange={handleRangeChange}
                shortcuts={DASHBOARD_DATE_SHORTCUTS}
                size="sm"
                max={DateTime.local().endOf("day")}
                triggerDateFormat="MM/dd/yy"
              />
              <div className="w-48">
                <Select
                  options={REPORT_TYPE_ANALYTICS_OPTIONS}
                  value={typeFilter}
                  onChange={(opts) => setTypeFilter(opts.map((o) => o.value))}
                  multiple
                  clearable
                  placeholder="All types"
                  size="sm"
                  variant="outline"
                  listMinWidth={220}
                />
              </div>
              <div className="w-40">
                <Select
                  options={REPORT_CREATED_BY_OPTIONS}
                  value={createdByFilter}
                  onChange={(opt) => setCreatedByFilter(opt?.value ?? "")}
                  clearable
                  placeholder="All sources"
                  size="sm"
                  variant="outline"
                  listMinWidth={160}
                />
              </div>
            </div>

            <div>
              <SectionHeading>Screening Performance</SectionHeading>
              <div className="grid grid-cols-3 gap-3">
                {screeningHighlights.map((metric) => (
                  <MetricCard
                    key={metric.label}
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
            </div>

            <div className="mt-6">
              <SectionHeading>By Report Type</SectionHeading>
              <ScreeningComparisonTable rows={screeningTableRows} typeKeys={activeTypeKeys} />
            </div>

            <div className="mt-6 flex items-center">
              <div className="w-[120px]">
                <Select
                  options={ANALYTICS_INTERVAL_OPTIONS}
                  value={interval}
                  onChange={(opt) => {
                    if (opt) setInterval(opt.value as AnalyticsInterval);
                  }}
                  size="sm"
                  pill
                  variant="outline"
                  listMinWidth={120}
                />
              </div>
            </div>

            <div className="mt-3">
              <ChartCard title="Match Rates by Type" description="Match rate comparison over time">
                <TypeRatesLineChart data={screeningChartData} typeKeys={activeTypeKeys} labelMap={REPORT_LABEL_MAP} />
              </ChartCard>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
