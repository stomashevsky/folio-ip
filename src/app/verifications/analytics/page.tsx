"use client";

import { Suspense, useState, useMemo, useCallback } from "react";
import { useTabParam } from "@/lib/hooks/useTabParam";
import { DateTime } from "luxon";
import { TopBar, TOPBAR_CONTROL_SIZE, TOPBAR_TOOLBAR_PILL, TOPBAR_ACTION_PILL } from "@/components/layout/TopBar";
import { ChartCard, MetricCard, SavedViewsControl, SectionHeading } from "@/components/shared";
import { StackedTypeBarChart } from "@/components/charts/StackedTypeBarChart";
import { TypeRatesLineChart } from "@/components/charts/TypeRatesLineChart";
import { VolumeComparisonTable } from "./components/VolumeComparisonTable";
import { ChecksComparisonTable } from "./components/ChecksComparisonTable";
import {
  VERIFICATION_TYPE_ANALYTICS_CONFIG,
  generateStackedVolumeTimeSeries,
  generateMultiTypeRateTimeSeries,
  deriveVerificationTypeRows,
  deriveVerificationTypeCheckRows,
  deriveVerificationTypeAggregateHighlights,
  deriveVerificationTypeCheckAggregateHighlights,
} from "@/lib/data";
import type { TypedTimeSeriesPoint } from "@/lib/data";
import { aggregateTypedVolume, aggregateTypedRates } from "@/lib/utils/analytics";
import { DASHBOARD_DATE_SHORTCUTS, type DateRange } from "@/lib/constants/date-shortcuts";
import type { AnalyticsInterval } from "@/lib/types";
import {
  VERIFICATION_TYPE_OPTIONS,
  INQUIRY_TEMPLATE_OPTIONS,
  CHECK_REQUIREMENT_OPTIONS,
  ANALYTICS_INTERVAL_OPTIONS,
} from "@/lib/constants/filter-options";
import { SegmentedControl } from "@plexui/ui/components/SegmentedControl";
import { Select } from "@plexui/ui/components/Select";
import { Button } from "@plexui/ui/components/Button";
import { DateRangePicker } from "@plexui/ui/components/DateRangePicker";
import { Download, InfoCircle } from "@plexui/ui/components/Icon";
import { Switch } from "@plexui/ui/components/Switch";
import { Tooltip } from "@plexui/ui/components/Tooltip";

const tabs = ["Volume", "Checks"] as const;
type Tab = (typeof tabs)[number];

const ALL_TYPE_KEYS = Object.keys(VERIFICATION_TYPE_ANALYTICS_CONFIG);
const VERIFICATION_LABEL_MAP = Object.fromEntries(
  Object.entries(VERIFICATION_TYPE_ANALYTICS_CONFIG).map(([k, v]) => [k, v.label]),
);

const defaultRange: DateRange = DASHBOARD_DATE_SHORTCUTS[1].getDateRange();

export default function VerificationsAnalyticsPage() {
  return (
    <Suspense fallback={null}>
      <VerificationsAnalyticsContent />
    </Suspense>
  );
}

function VerificationsAnalyticsContent() {
  const [activeTab, setActiveTab] = useTabParam(tabs, "Volume");
  const [dateRange, setDateRange] = useState<DateRange | null>(defaultRange);
  const [interval, setInterval] = useState<AnalyticsInterval>("daily");

  const [typeFilter, setTypeFilter] = useState<string[]>([]);
  const [templateFilter, setTemplateFilter] = useState("");
  const [checkRequirementFilter, setCheckRequirementFilter] = useState("");
  const [groupByInquiries, setGroupByInquiries] = useState(true);

  const handleRangeChange = useCallback((next: DateRange | null) => { setDateRange(next); }, []);

  function clearAllFilters() {
    setTypeFilter([]);
    setTemplateFilter("");
    setCheckRequirementFilter("");
    setGroupByInquiries(true);
    setDateRange(defaultRange);
    setInterval("daily");
  }

  const currentViewState = useMemo(() => ({
    filters: {
      type: typeFilter,
      template: templateFilter ? [templateFilter] : [] as string[],
      checkRequirement: checkRequirementFilter ? [checkRequirementFilter] : [] as string[],
      interval: [interval],
    },
    columnVisibility: {},
  }), [typeFilter, templateFilter, checkRequirementFilter, interval]);

  const days = useMemo(() => {
    if (!dateRange) return 30;
    return Math.max(1, Math.round(dateRange[1].diff(dateRange[0], "days").days) + 1);
  }, [dateRange]);

  const activeTypeKeys = useMemo(
    () => (typeFilter.length > 0 ? typeFilter : ALL_TYPE_KEYS),
    [typeFilter],
  );

  const filterScale = useMemo(() => {
    let scale = 1;
    if (templateFilter) scale *= 0.5;
    if (groupByInquiries) scale *= 0.85;
    return scale;
  }, [templateFilter, groupByInquiries]);

  const checkFilterScale = useMemo(() => {
    let scale = filterScale;
    if (checkRequirementFilter === "required") scale *= 0.7;
    if (checkRequirementFilter === "optional") scale *= 0.3;
    return scale;
  }, [filterScale, checkRequirementFilter]);

  const volumeHighlights = useMemo(() => {
    if (activeTab !== "Volume") return [];
    const raw = deriveVerificationTypeAggregateHighlights(days, activeTypeKeys);
    if (filterScale === 1) return raw;
    return raw.map((m) => {
      if (m.label === "Total Verifications") {
        const num = Number(m.value.replace(/,/g, ""));
        return { ...m, value: Math.round(num * filterScale).toLocaleString() };
      }
      return m;
    });
  }, [activeTab, days, activeTypeKeys, filterScale]);

  const volumeTableRows = useMemo(() => {
    if (activeTab !== "Volume") return [];
    const raw = deriveVerificationTypeRows(days, activeTypeKeys);
    if (filterScale === 1) return raw;
    return raw.map((r) => ({ ...r, created: Math.round(r.created * filterScale) }));
  }, [activeTab, days, activeTypeKeys, filterScale]);

  const volumeChartData = useMemo(() => {
    if (activeTab !== "Volume") return [];
    const raw = generateStackedVolumeTimeSeries(days, activeTypeKeys);
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

  const checkHighlights = useMemo(() => {
    if (activeTab !== "Checks") return [];
    const raw = deriveVerificationTypeCheckAggregateHighlights(days, activeTypeKeys);
    if (checkFilterScale === 1) return raw;
    const rateShift = (1 - checkFilterScale) * 8;
    return raw.map((m) => {
      if (m.label === "Avg Pass Rate") {
        const num = parseFloat(m.value);
        return { ...m, value: `${Math.round((num + rateShift) * 10) / 10}%` };
      }
      if (m.label === "Avg Fail Rate") {
        const num = parseFloat(m.value);
        return { ...m, value: `${Math.max(0.1, Math.round((num - rateShift * 0.6) * 10) / 10)}%` };
      }
      if (m.label === "Avg Processing") {
        const num = parseInt(m.value, 10);
        const scaled = Math.max(3, Math.round(num * (0.6 + checkFilterScale * 0.4)));
        return { ...m, value: `${scaled}s` };
      }
      return m;
    });
  }, [activeTab, days, activeTypeKeys, checkFilterScale]);

  const checkTableRows = useMemo(() => {
    if (activeTab !== "Checks") return [];
    const raw = deriveVerificationTypeCheckRows(days, activeTypeKeys);
    if (checkFilterScale === 1) return raw;
    const rateShift = (1 - checkFilterScale) * 8;
    return raw.map((r) => ({
      ...r,
      passRate: Math.round(Math.min(99.9, r.passRate + rateShift) * 10) / 10,
      failRate: Math.max(0.1, Math.round((r.failRate - rateShift * 0.6) * 10) / 10),
      avgProcessing: Math.max(3, Math.round(r.avgProcessing * (0.6 + checkFilterScale * 0.4))),
    }));
  }, [activeTab, days, activeTypeKeys, checkFilterScale]);

  const checkChartData = useMemo(() => {
    if (activeTab !== "Checks") return [];
    const raw = generateMultiTypeRateTimeSeries(days, activeTypeKeys);
    const aggregated = aggregateTypedRates(raw, interval, activeTypeKeys);
    if (checkFilterScale === 1) return aggregated;
    const rateShift = (1 - checkFilterScale) * 8;
    return aggregated.map((point) => {
      const scaled: TypedTimeSeriesPoint = { date: point.date };
      for (const key of activeTypeKeys) {
        scaled[key] = Math.min(100, Math.round(((point[key] as number) + rateShift) * 10) / 10);
      }
      return scaled;
    });
  }, [activeTab, days, activeTypeKeys, interval, checkFilterScale]);

  return (
    <div className="flex min-h-full flex-col">
      <TopBar
        title="Verification Analytics"
        actions={
          <>
            <SavedViewsControl
              entityType="verification-analytics"
              currentState={currentViewState}
              onLoadView={(state) => {
                setTypeFilter(state.filters.type ?? []);
                setTemplateFilter(state.filters.template?.[0] ?? "");
                setCheckRequirementFilter(state.filters.checkRequirement?.[0] ?? "");
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
            <SegmentedControl.Tab value="Checks">Checks</SegmentedControl.Tab>
          </SegmentedControl>
        }
      />
      <div className="px-4 pb-6 pt-6 md:px-6">
        <p className="text-sm -mt-1 mb-5 text-[var(--color-text-tertiary)]">
          {activeTab === "Volume"
            ? "Creation volume, processing throughput, and pass rates by verification type."
            : "Pass/fail rates, check outcomes, and average processing times by verification type."}
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
                  options={VERIFICATION_TYPE_OPTIONS}
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
              <div className="w-64">
                <Select
                  options={INQUIRY_TEMPLATE_OPTIONS}
                  value={templateFilter}
                  onChange={(opt) => setTemplateFilter(opt?.value ?? "")}
                  clearable
                  placeholder="All templates"
                  size="sm"
                  variant="outline"
                  listMinWidth={280}
                />
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={groupByInquiries}
                  onCheckedChange={setGroupByInquiries}
                />
                <span className="text-xs text-[var(--color-text-secondary)]">Group by Inquiries</span>
                <Tooltip content="Dedupes verifications associated with the same inquiry.">
                  <InfoCircle className="h-3.5 w-3.5 text-[var(--color-text-tertiary)]" />
                </Tooltip>
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
              <SectionHeading>By Verification Type</SectionHeading>
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
              <ChartCard title="Volume by Type" description="Stacked verification volume over time">
                <StackedTypeBarChart data={volumeChartData} typeKeys={activeTypeKeys} labelMap={VERIFICATION_LABEL_MAP} />
              </ChartCard>
            </div>
          </>
        )}

        {activeTab === "Checks" && (
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
                  options={VERIFICATION_TYPE_OPTIONS}
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
              <div className="w-64">
                <Select
                  options={INQUIRY_TEMPLATE_OPTIONS}
                  value={templateFilter}
                  onChange={(opt) => setTemplateFilter(opt?.value ?? "")}
                  clearable
                  placeholder="All templates"
                  size="sm"
                  variant="outline"
                  listMinWidth={280}
                />
              </div>
              <div className="w-44">
                <Select
                  options={CHECK_REQUIREMENT_OPTIONS}
                  value={checkRequirementFilter}
                  onChange={(opt) => setCheckRequirementFilter(opt?.value ?? "")}
                  clearable
                  placeholder="All requirements"
                  size="sm"
                  variant="outline"
                  listMinWidth={160}
                />
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={groupByInquiries}
                  onCheckedChange={setGroupByInquiries}
                />
                <span className="text-xs text-[var(--color-text-secondary)]">Group by Inquiries</span>
                <Tooltip content="Dedupes verifications associated with the same inquiry.">
                  <InfoCircle className="h-3.5 w-3.5 text-[var(--color-text-tertiary)]" />
                </Tooltip>
              </div>
            </div>

            <div>
              <SectionHeading>Check Performance</SectionHeading>
              <div className="grid grid-cols-3 gap-3">
                {checkHighlights.map((metric) => (
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
              <SectionHeading>By Verification Type</SectionHeading>
              <ChecksComparisonTable rows={checkTableRows} typeKeys={activeTypeKeys} />
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
              <ChartCard title="Pass Rates by Type" description="Pass rate comparison over time">
                <TypeRatesLineChart data={checkChartData} typeKeys={activeTypeKeys} labelMap={VERIFICATION_LABEL_MAP} />
              </ChartCard>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
