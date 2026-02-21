"use client";

import { Suspense, useState, useMemo, useCallback } from "react";
import { useTabParam } from "@/lib/hooks/useTabParam";
import { DateTime } from "luxon";
import { TopBar, TOPBAR_CONTROL_SIZE, TOPBAR_TOOLBAR_PILL, TOPBAR_ACTION_PILL } from "@/components/layout/TopBar";
import { ChartCard, MetricCard, SavedViewsControl, SectionHeading } from "@/components/shared";
import { StackedTypeBarChart } from "@/components/charts/StackedTypeBarChart";
import { TypeRatesLineChart } from "@/components/charts/TypeRatesLineChart";
import { FunnelSankey, type SankeyMetric } from "@/components/charts/FunnelSankey";
import { FunnelTrendChart } from "@/components/charts/FunnelTrendChart";
import { VolumeComparisonTable } from "./components/VolumeComparisonTable";
import {
  INQUIRY_TYPE_ANALYTICS_CONFIG,
  generateInquiryStackedVolumeTimeSeries,
  generateInquiryMultiTypeRateTimeSeries,
  deriveInquiryTypeRows,
  deriveInquiryTypeAggregateHighlights,
  generateFunnelSteps,
  generateFunnelTimeSeries,
  deriveFunnelHighlights,
  generateSankeyFunnel,
} from "@/lib/data";
import type { TypedTimeSeriesPoint } from "@/lib/data";
import { aggregateTypedVolume, aggregateTypedRates, aggregateFunnelRates } from "@/lib/utils/analytics";
import { DASHBOARD_DATE_SHORTCUTS, type DateRange } from "@/lib/constants/date-shortcuts";
import type { AnalyticsInterval } from "@/lib/types";
import {
  INQUIRY_TYPE_ANALYTICS_OPTIONS,
  ANALYTICS_COUNTRY_OPTIONS,
  ANALYTICS_PLATFORM_OPTIONS,
  ANALYTICS_INTERVAL_OPTIONS,
  ANALYTICS_FUNNEL_TEMPLATE_OPTIONS,
  ANALYTICS_FUNNEL_METRIC_OPTIONS,
  ANALYTICS_TEMPLATE_VERSION_OPTIONS,
} from "@/lib/constants/filter-options";
import { SegmentedControl } from "@plexui/ui/components/SegmentedControl";
import { Select } from "@plexui/ui/components/Select";
import { Button } from "@plexui/ui/components/Button";
import { DateRangePicker } from "@plexui/ui/components/DateRangePicker";
import { Download, InfoCircle } from "@plexui/ui/components/Icon";
import { Switch } from "@plexui/ui/components/Switch";
import { Tooltip } from "@plexui/ui/components/Tooltip";

const tabs = ["Overview", "Conversion Funnel"] as const;
type Tab = (typeof tabs)[number];

const ALL_TYPE_KEYS = Object.keys(INQUIRY_TYPE_ANALYTICS_CONFIG);
const INQUIRY_LABEL_MAP = Object.fromEntries(
  Object.entries(INQUIRY_TYPE_ANALYTICS_CONFIG).map(([k, v]) => [k, v.label]),
);

const SANKEY_METRIC_DESCRIPTIONS: Record<SankeyMetric, string> = {
  counts: "Absolute inquiry counts at each verification step",
  rates: "Percentage of total created inquiries reaching each step",
};

const defaultRange: DateRange = DASHBOARD_DATE_SHORTCUTS[1].getDateRange();

export default function InquiryAnalyticsPage() {
  return (
    <Suspense fallback={null}>
      <InquiryAnalyticsContent />
    </Suspense>
  );
}

function InquiryAnalyticsContent() {
  const [activeTab, setActiveTab] = useTabParam(tabs, "Overview");
  const [dateRange, setDateRange] = useState<DateRange | null>(defaultRange);
  const [interval, setInterval] = useState<AnalyticsInterval>("daily");
  const [funnelMetric, setFunnelMetric] = useState<SankeyMetric>("counts");

  const [typeFilter, setTypeFilter] = useState<string[]>([]);
  const [countryFilter, setCountryFilter] = useState<string[]>([]);
  const [platformFilter, setPlatformFilter] = useState<string[]>([]);
  const [groupByAccounts, setGroupByAccounts] = useState(false);
  const [funnelTemplateFilter, setFunnelTemplateFilter] = useState("");
  const [funnelMetricFilter, setFunnelMetricFilter] = useState("");
  const [funnelTemplateVersion, setFunnelTemplateVersion] = useState("");

  const handleRangeChange = useCallback((next: DateRange | null) => { setDateRange(next); }, []);

  function clearAllFilters() {
    setTypeFilter([]);
    setCountryFilter([]);
    setPlatformFilter([]);
    setGroupByAccounts(false);
    setFunnelTemplateFilter("");
    setFunnelMetricFilter("");
    setFunnelTemplateVersion("");
    setDateRange(defaultRange);
    setInterval("daily");
  }

  const currentViewState = useMemo(() => ({
    filters: {
      type: typeFilter,
      country: countryFilter,
      platform: platformFilter,
      interval: [interval],
    },
    columnVisibility: {},
  }), [typeFilter, countryFilter, platformFilter, interval]);

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
    if (countryFilter.length > 0) scale *= countryFilter.length / ANALYTICS_COUNTRY_OPTIONS.length;
    if (platformFilter.length > 0) scale *= platformFilter.length / ANALYTICS_PLATFORM_OPTIONS.length;
    if (groupByAccounts) scale *= 0.82;
    return scale;
  }, [countryFilter, platformFilter, groupByAccounts]);

  const overviewHighlights = useMemo(() => {
    if (activeTab !== "Overview") return [];
    const raw = deriveInquiryTypeAggregateHighlights(days, activeTypeKeys);
    if (filterScale === 1) return raw;
    return raw.map((m) => {
      if (m.label === "Total Inquiries") {
        const num = Number(m.value.replace(/,/g, ""));
        return { ...m, value: Math.round(num * filterScale).toLocaleString() };
      }
      return m;
    });
  }, [activeTab, days, activeTypeKeys, filterScale]);

  const overviewTableRows = useMemo(() => {
    if (activeTab !== "Overview") return [];
    const raw = deriveInquiryTypeRows(days, activeTypeKeys);
    if (filterScale === 1) return raw;
    return raw.map((r) => ({ ...r, created: Math.round(r.created * filterScale) }));
  }, [activeTab, days, activeTypeKeys, filterScale]);

  const volumeChartData = useMemo(() => {
    if (activeTab !== "Overview") return [];
    const raw = generateInquiryStackedVolumeTimeSeries(days, activeTypeKeys);
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

  const ratesChartData = useMemo(() => {
    if (activeTab !== "Overview") return [];
    return aggregateTypedRates(
      generateInquiryMultiTypeRateTimeSeries(days, activeTypeKeys),
      interval,
      activeTypeKeys,
    );
  }, [activeTab, days, activeTypeKeys, interval]);

  const funnelFilterScale = useMemo(() => {
    let scale = 1;
    if (funnelTemplateFilter) scale *= 0.55;
    if (funnelMetricFilter === "per_step") scale *= 0.8;
    if (funnelTemplateVersion) {
      const versionScales: Record<string, number> = { v5: 0.92, v4: 0.78, v3: 0.65, v2: 0.52, v1: 0.4 };
      scale *= versionScales[funnelTemplateVersion] ?? 0.85;
    }
    return scale;
  }, [funnelTemplateFilter, funnelMetricFilter, funnelTemplateVersion]);

  const rawFunnelSteps = useMemo(() => generateFunnelSteps(days), [days]);
  const funnelSteps = useMemo(() => {
    if (funnelFilterScale === 1) return rawFunnelSteps;
    const first = rawFunnelSteps[0];
    return rawFunnelSteps.map((step) => {
      const scaledCount = Math.round(step.count * funnelFilterScale);
      const scaledFirst = Math.round(first.count * funnelFilterScale);
      return {
        ...step,
        count: scaledCount,
        percentage: step === first ? 100 : Math.round((scaledCount / scaledFirst) * 1000) / 10,
      };
    });
  }, [rawFunnelSteps, funnelFilterScale]);

  const funnelHighlights = useMemo(
    () => deriveFunnelHighlights(funnelSteps),
    [funnelSteps],
  );
  const funnelTrendData = useMemo(
    () => aggregateFunnelRates(generateFunnelTimeSeries(days), interval),
    [days, interval],
  );
  const rawSankeyData = useMemo(() => generateSankeyFunnel(days), [days]);
  const sankeyData = useMemo(() => {
    if (funnelFilterScale === 1) return rawSankeyData;
    return {
      nodes: rawSankeyData.nodes.map((n) => ({ ...n, count: Math.round(n.count * funnelFilterScale) })),
      links: rawSankeyData.links.map((l) => ({ ...l, value: Math.round(l.value * funnelFilterScale) })),
    };
  }, [rawSankeyData, funnelFilterScale]);

  return (
    <div className="flex min-h-full flex-col">
      <TopBar
        title="Inquiry Analytics"
        actions={
          <>
            <SavedViewsControl
              entityType="inquiry-analytics"
              currentState={currentViewState}
              onLoadView={(state) => {
                setTypeFilter(state.filters.type ?? []);
                setCountryFilter(state.filters.country ?? []);
                setPlatformFilter(state.filters.platform ?? []);
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
            <SegmentedControl.Tab value="Overview">Overview</SegmentedControl.Tab>
            <SegmentedControl.Tab value="Conversion Funnel">Conversion Funnel</SegmentedControl.Tab>
          </SegmentedControl>
        }
      />
      <div className="px-4 pb-6 pt-6 md:px-6">
        <p className="text-sm -mt-1 mb-5 text-[var(--color-text-tertiary)]">
          {activeTab === "Overview"
            ? "Creation volume, completion throughput, and approval rates by inquiry template."
            : "Step-by-step conversion funnel for inquiry verification flow."}
        </p>

        {activeTab === "Overview" && (
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
              <div className="w-56">
                <Select
                  options={INQUIRY_TYPE_ANALYTICS_OPTIONS}
                  value={typeFilter}
                  onChange={(opts) => setTypeFilter(opts.map((o) => o.value))}
                  multiple
                  clearable
                  placeholder="All templates"
                  size="sm"
                  variant="outline"
                  listMinWidth={260}
                />
              </div>
              <div className="w-40">
                <Select
                  options={ANALYTICS_COUNTRY_OPTIONS}
                  value={countryFilter}
                  onChange={(opts) => setCountryFilter(opts.map((o) => o.value))}
                  multiple
                  clearable
                  placeholder="All countries"
                  size="sm"
                  variant="outline"
                  listMinWidth={180}
                />
              </div>
              <div className="w-40">
                <Select
                  options={ANALYTICS_PLATFORM_OPTIONS}
                  value={platformFilter}
                  onChange={(opts) => setPlatformFilter(opts.map((o) => o.value))}
                  multiple
                  clearable
                  placeholder="All integrations"
                  size="sm"
                  variant="outline"
                  listMinWidth={180}
                />
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={groupByAccounts}
                  onCheckedChange={setGroupByAccounts}
                />
                <span className="text-xs text-[var(--color-text-secondary)]">Group By Accounts</span>
                <Tooltip content="Dedupes inquiries associated with the same account.">
                  <InfoCircle className="h-3.5 w-3.5 text-[var(--color-text-tertiary)]" />
                </Tooltip>
              </div>
            </div>

            <div>
              <SectionHeading>Highlights</SectionHeading>
              <div className="grid grid-cols-3 gap-3">
                {overviewHighlights.map((metric) => (
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
              <SectionHeading>By Template</SectionHeading>
              <VolumeComparisonTable rows={overviewTableRows} typeKeys={activeTypeKeys} />
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

            <div className="mt-3 space-y-4">
              <ChartCard title="Volume by Template" description="Stacked inquiry volume over time">
                <StackedTypeBarChart data={volumeChartData} typeKeys={activeTypeKeys} labelMap={INQUIRY_LABEL_MAP} />
              </ChartCard>

              <ChartCard title="Approval Rates by Template" description="Approval rate comparison over time">
                <TypeRatesLineChart data={ratesChartData} typeKeys={activeTypeKeys} labelMap={INQUIRY_LABEL_MAP} />
              </ChartCard>
            </div>
          </>
        )}

        {activeTab === "Conversion Funnel" && (
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
              <div className="w-80">
                <Select
                  options={ANALYTICS_FUNNEL_TEMPLATE_OPTIONS}
                  value={funnelTemplateFilter}
                  onChange={(opt) => setFunnelTemplateFilter(opt?.value ?? "")}
                  clearable
                  placeholder="All templates"
                  size="sm"
                  variant="outline"
                  listMinWidth={380}
                />
              </div>
              <div className="w-32">
                <Select
                  options={ANALYTICS_FUNNEL_METRIC_OPTIONS}
                  value={funnelMetricFilter}
                  onChange={(opt) => setFunnelMetricFilter(opt?.value ?? "")}
                  clearable
                  placeholder="Overall"
                  size="sm"
                  variant="outline"
                  listMinWidth={120}
                />
              </div>
              <div className="w-60">
                <Select
                  options={ANALYTICS_TEMPLATE_VERSION_OPTIONS}
                  value={funnelTemplateVersion}
                  onChange={(opt) => setFunnelTemplateVersion(opt?.value ?? "")}
                  clearable
                  placeholder="Version (latest)"
                  size="sm"
                  variant="outline"
                  listMinWidth={260}
                />
              </div>
            </div>

            <div>
              <h3 className="heading-sm text-[var(--color-text)] mb-3">Highlights</h3>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {funnelHighlights.map((metric) => (
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
              <ChartCard
                title="Verification Flow"
                description={SANKEY_METRIC_DESCRIPTIONS[funnelMetric]}
                actions={
                  <SegmentedControl
                    aria-label="Sankey metric"
                    value={funnelMetric}
                    onChange={(v) => setFunnelMetric(v as SankeyMetric)}
                    size="xs"
                    pill
                  >
                    <SegmentedControl.Tab value="counts">Counts</SegmentedControl.Tab>
                    <SegmentedControl.Tab value="rates">Rates</SegmentedControl.Tab>
                  </SegmentedControl>
                }
              >
                <FunnelSankey data={sankeyData} metric={funnelMetric} />
              </ChartCard>
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
              <ChartCard
                title="Funnel Trends"
                description="Step conversion rates over time"
              >
                <FunnelTrendChart data={funnelTrendData} />
              </ChartCard>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
