"use client";

import { Suspense, useState, useMemo, useCallback } from "react";
import { useTabParam } from "@/lib/hooks/useTabParam";
import { DateTime } from "luxon";
import { TopBar, TOPBAR_CONTROL_SIZE, TOPBAR_TOOLBAR_PILL, TOPBAR_ACTION_PILL } from "@/components/layout/TopBar";
import { ChartCard, MetricCard, SavedViewsControl, SectionHeading } from "@/components/shared";
import { StackedTypeBarChart } from "@/components/charts/StackedTypeBarChart";
import { TypeRatesLineChart } from "@/components/charts/TypeRatesLineChart";
import { VolumeComparisonTable } from "./components/VolumeComparisonTable";
import { RiskComparisonTable } from "./components/RiskComparisonTable";
import {
  TRANSACTION_TYPE_ANALYTICS_CONFIG,
  generateTransactionStackedVolumeTimeSeries,
  generateTransactionMultiTypeRateTimeSeries,
  deriveTransactionTypeRows,
  deriveTransactionTypeRiskRows,
  deriveTransactionTypeAggregateHighlights,
  deriveTransactionTypeRiskAggregateHighlights,
} from "@/lib/data";
import type { TypedTimeSeriesPoint } from "@/lib/data";
import { aggregateTypedVolume, aggregateTypedRates } from "@/lib/utils/analytics";
import { DASHBOARD_DATE_SHORTCUTS, type DateRange } from "@/lib/constants/date-shortcuts";
import type { AnalyticsInterval } from "@/lib/types";
import {
  TRANSACTION_TYPE_OPTIONS,
  TRANSACTION_STATUS_OPTIONS,
  ANALYTICS_INTERVAL_OPTIONS,
} from "@/lib/constants/filter-options";
import { SegmentedControl } from "@plexui/ui/components/SegmentedControl";
import { Select } from "@plexui/ui/components/Select";
import { Button } from "@plexui/ui/components/Button";
import { DateRangePicker } from "@plexui/ui/components/DateRangePicker";
import { Download } from "@plexui/ui/components/Icon";

const tabs = ["Volume", "Risk"] as const;
type Tab = (typeof tabs)[number];

const ALL_TRANSACTION_TYPE_KEYS = Object.keys(TRANSACTION_TYPE_ANALYTICS_CONFIG);
const TRANSACTION_LABEL_MAP = Object.fromEntries(
  Object.entries(TRANSACTION_TYPE_ANALYTICS_CONFIG).map(([k, v]) => [k, v.label]),
);

const defaultRange: DateRange = DASHBOARD_DATE_SHORTCUTS[1].getDateRange();

export default function TransactionAnalyticsPage() {
  return (
    <Suspense fallback={null}>
      <TransactionAnalyticsContent />
    </Suspense>
  );
}

function TransactionAnalyticsContent() {
  const [activeTab, setActiveTab] = useTabParam(tabs, "Volume");
  const [dateRange, setDateRange] = useState<DateRange | null>(defaultRange);
  const [interval, setInterval] = useState<AnalyticsInterval>("daily");

  const [typeFilter, setTypeFilter] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState("");

  const handleRangeChange = useCallback((next: DateRange | null) => { setDateRange(next); }, []);

  function clearAllFilters() {
    setTypeFilter([]);
    setStatusFilter("");
    setDateRange(defaultRange);
    setInterval("daily");
  }

  const currentViewState = useMemo(() => ({
    filters: {
      type: typeFilter,
      status: statusFilter ? [statusFilter] : [] as string[],
      interval: [interval],
    },
    columnVisibility: {},
  }), [typeFilter, statusFilter, interval]);

  const days = useMemo(() => {
    if (!dateRange) return 30;
    return Math.max(1, Math.round(dateRange[1].diff(dateRange[0], "days").days) + 1);
  }, [dateRange]);

  const activeTypeKeys = useMemo(
    () => (typeFilter.length > 0 ? typeFilter : ALL_TRANSACTION_TYPE_KEYS),
    [typeFilter],
  );

  const filterScale = useMemo(() => {
    let scale = 1;
    if (statusFilter) scale *= 0.6;
    return scale;
  }, [statusFilter]);

  const volumeHighlights = useMemo(() => {
    if (activeTab !== "Volume") return [];
    const raw = deriveTransactionTypeAggregateHighlights(days, activeTypeKeys);
    if (filterScale === 1) return raw;
    return raw.map((m) => {
      if (m.label === "Total Transactions") {
        const num = Number(m.value.replace(/,/g, ""));
        return { ...m, value: Math.round(num * filterScale).toLocaleString() };
      }
      return m;
    });
  }, [activeTab, days, activeTypeKeys, filterScale]);

  const volumeTableRows = useMemo(() => {
    if (activeTab !== "Volume") return [];
    const raw = deriveTransactionTypeRows(days, activeTypeKeys);
    if (filterScale === 1) return raw;
    return raw.map((r) => ({ ...r, created: Math.round(r.created * filterScale) }));
  }, [activeTab, days, activeTypeKeys, filterScale]);

  const volumeChartData = useMemo(() => {
    if (activeTab !== "Volume") return [];
    const raw = generateTransactionStackedVolumeTimeSeries(days, activeTypeKeys);
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

  const riskHighlights = useMemo(() => {
    if (activeTab !== "Risk") return [];
    return deriveTransactionTypeRiskAggregateHighlights(days, activeTypeKeys);
  }, [activeTab, days, activeTypeKeys]);

  const riskTableRows = useMemo(() => {
    if (activeTab !== "Risk") return [];
    return deriveTransactionTypeRiskRows(days, activeTypeKeys);
  }, [activeTab, days, activeTypeKeys]);

  const riskChartData = useMemo(() => {
    if (activeTab !== "Risk") return [];
    const raw = generateTransactionMultiTypeRateTimeSeries(days, activeTypeKeys);
    return aggregateTypedRates(raw, interval, activeTypeKeys);
  }, [activeTab, days, activeTypeKeys, interval]);

  return (
    <div className="flex min-h-full flex-col">
      <TopBar
        title="Transaction Analytics"
        actions={
          <>
            <SavedViewsControl
              entityType="transaction-analytics"
              currentState={currentViewState}
              onLoadView={(state) => {
                setTypeFilter(state.filters.type ?? []);
                setStatusFilter(state.filters.status?.[0] ?? "");
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
          <SegmentedControl
            aria-label="Analytics views"
            value={activeTab}
            onChange={(v) => setActiveTab(v as Tab)}
            size={TOPBAR_CONTROL_SIZE}
            pill={TOPBAR_TOOLBAR_PILL}
          >
            <SegmentedControl.Tab value="Volume">Volume</SegmentedControl.Tab>
            <SegmentedControl.Tab value="Risk">Risk</SegmentedControl.Tab>
          </SegmentedControl>
        }
      />
      <div className="px-4 pb-6 pt-6 md:px-6">
        <p className="text-sm -mt-1 mb-5 text-[var(--color-text-tertiary)]">
          {activeTab === "Volume"
            ? "Creation volume, throughput, and approval rates by transaction type."
            : "Approval/review rates, risk indicators, and processing times by transaction type."}
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
                  options={TRANSACTION_TYPE_OPTIONS}
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
              <div className="w-44">
                <Select
                  options={TRANSACTION_STATUS_OPTIONS}
                  value={statusFilter}
                  onChange={(opt) => setStatusFilter(opt?.value ?? "")}
                  clearable
                  placeholder="All statuses"
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
              <SectionHeading>By Transaction Type</SectionHeading>
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
              <ChartCard title="Volume by Type" description="Stacked transaction volume over time">
                <StackedTypeBarChart data={volumeChartData} typeKeys={activeTypeKeys} labelMap={TRANSACTION_LABEL_MAP} />
              </ChartCard>
            </div>
          </>
        )}

        {activeTab === "Risk" && (
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
                  options={TRANSACTION_TYPE_OPTIONS}
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
              <div className="w-44">
                <Select
                  options={TRANSACTION_STATUS_OPTIONS}
                  value={statusFilter}
                  onChange={(opt) => setStatusFilter(opt?.value ?? "")}
                  clearable
                  placeholder="All statuses"
                  size="sm"
                  variant="outline"
                  listMinWidth={160}
                />
              </div>
            </div>

            <div>
              <SectionHeading>Risk Performance</SectionHeading>
              <div className="grid grid-cols-3 gap-3">
                {riskHighlights.map((metric) => (
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
              <SectionHeading>By Transaction Type</SectionHeading>
              <RiskComparisonTable rows={riskTableRows} typeKeys={activeTypeKeys} />
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
              <ChartCard title="Approval Rates by Type" description="Approval rate comparison over time">
                <TypeRatesLineChart data={riskChartData} typeKeys={activeTypeKeys} labelMap={TRANSACTION_LABEL_MAP} />
              </ChartCard>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
