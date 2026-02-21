"use client";

import { Suspense, useCallback, useMemo, useState } from "react";
import { DateTime } from "luxon";
import { TopBar, TOPBAR_ACTION_PILL, TOPBAR_CONTROL_SIZE, TOPBAR_TOOLBAR_PILL } from "@/components/layout/TopBar";
import { SavedViewsControl } from "@/components/shared";
import { VerificationTypeSection } from "./components/VerificationTypeSection";
import {
  VERIFICATION_TYPE_ANALYTICS_CONFIG,
  deriveVerificationTypeCheckHighlights,
  deriveVerificationTypeHighlights,
  generateVerificationTypeRateTimeSeries,
  generateVerificationTypeTimeSeries,
} from "@/lib/data";
import { aggregateVerificationRates, aggregateVolume } from "@/lib/utils/analytics";
import { DASHBOARD_DATE_SHORTCUTS, type DateRange } from "@/lib/constants/date-shortcuts";
import type { AnalyticsInterval } from "@/lib/types";
import {
  ANALYTICS_INTERVAL_OPTIONS,
  CHECK_REQUIREMENT_OPTIONS,
  INQUIRY_TEMPLATE_OPTIONS,
  VERIFICATION_TYPE_OPTIONS,
} from "@/lib/constants/filter-options";
import { useTabParam } from "@/lib/hooks/useTabParam";
import { Button } from "@plexui/ui/components/Button";
import { DateRangePicker } from "@plexui/ui/components/DateRangePicker";
import { Download, InfoCircle } from "@plexui/ui/components/Icon";
import { SegmentedControl } from "@plexui/ui/components/SegmentedControl";
import { Select } from "@plexui/ui/components/Select";
import { Switch } from "@plexui/ui/components/Switch";
import { Tooltip } from "@plexui/ui/components/Tooltip";

const tabs = ["Volume", "Checks"] as const;
type Tab = (typeof tabs)[number];

const ALL_TYPE_KEYS = Object.keys(VERIFICATION_TYPE_ANALYTICS_CONFIG);
const defaultRange: DateRange = DASHBOARD_DATE_SHORTCUTS[1].getDateRange();

interface VerificationTypeSectionData {
  typeKey: string;
  typeLabel: string;
  highlights: ReturnType<typeof deriveVerificationTypeHighlights>;
  volumeData: ReturnType<typeof aggregateVolume>;
  rateData: ReturnType<typeof aggregateVerificationRates>;
}

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

  const handleRangeChange = useCallback((next: DateRange | null) => {
    setDateRange(next);
  }, []);

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

  const volumeSections = useMemo<VerificationTypeSectionData[]>(() => {
    if (activeTab !== "Volume") return [];

    return activeTypeKeys.map((typeKey) => {
      const typeLabel = VERIFICATION_TYPE_ANALYTICS_CONFIG[typeKey]?.label ?? typeKey;

      const highlights = deriveVerificationTypeHighlights(days, typeKey).map((metric) => {
        if (metric.label !== "Created" || filterScale === 1) return metric;
        const count = Number(String(metric.value).replace(/,/g, ""));
        return { ...metric, value: Math.round(count * filterScale).toLocaleString() };
      });

      const volumeData = aggregateVolume(generateVerificationTypeTimeSeries(days, typeKey), interval).map((point) => ({
        ...point,
        value: filterScale === 1 ? point.value : Math.round(point.value * filterScale),
      }));

      const rateData = aggregateVerificationRates(generateVerificationTypeRateTimeSeries(days, typeKey), interval);

      return {
        typeKey,
        typeLabel,
        highlights,
        volumeData,
        rateData,
      };
    });
  }, [activeTab, activeTypeKeys, days, interval, filterScale]);

  const checkSections = useMemo<VerificationTypeSectionData[]>(() => {
    if (activeTab !== "Checks") return [];

    const rateShift = (1 - checkFilterScale) * 8;
    return activeTypeKeys.map((typeKey) => {
      const typeLabel = VERIFICATION_TYPE_ANALYTICS_CONFIG[typeKey]?.label ?? typeKey;

      const highlights = deriveVerificationTypeCheckHighlights(days, typeKey).map((metric) => {
        if (checkFilterScale === 1) return metric;

        if (metric.label === "Pass Rate") {
          const value = parseFloat(String(metric.value));
          return { ...metric, value: `${Math.min(99.9, Math.round((value + rateShift) * 10) / 10)}%` };
        }

        if (metric.label === "Fail Rate") {
          const value = parseFloat(String(metric.value));
          return { ...metric, value: `${Math.max(0.1, Math.round((value - rateShift * 0.6) * 10) / 10)}%` };
        }

        if (metric.label === "Avg Processing") {
          const value = parseInt(String(metric.value), 10);
          const scaled = Math.max(3, Math.round(value * (0.6 + checkFilterScale * 0.4)));
          return { ...metric, value: `${scaled}s` };
        }

        return metric;
      });

      const volumeData = aggregateVolume(generateVerificationTypeTimeSeries(days, typeKey), interval).map((point) => ({
        ...point,
        value: checkFilterScale === 1 ? point.value : Math.round(point.value * checkFilterScale),
      }));

      const rateData = aggregateVerificationRates(generateVerificationTypeRateTimeSeries(days, typeKey), interval).map((point) => ({
        ...point,
        passRate: checkFilterScale === 1
          ? point.passRate
          : Math.min(100, Math.round((point.passRate + rateShift) * 10) / 10),
      }));

      return {
        typeKey,
        typeLabel,
        highlights,
        volumeData,
        rateData,
      };
    });
  }, [activeTab, activeTypeKeys, days, interval, checkFilterScale]);

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
            onChange={(value) => setActiveTab(value as Tab)}
            size={TOPBAR_CONTROL_SIZE}
            pill={TOPBAR_TOOLBAR_PILL}
          >
            <SegmentedControl.Tab value="Volume">Volume</SegmentedControl.Tab>
            <SegmentedControl.Tab value="Checks">Checks</SegmentedControl.Tab>
          </SegmentedControl>
        }
      />

      <div className="px-4 pb-6 pt-6 md:px-6">
        <p className="-mt-1 mb-5 text-sm text-[var(--color-text-tertiary)]">
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
                  onChange={(options) => setTypeFilter(options.map((option) => option.value))}
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
                  onChange={(option) => setTemplateFilter(option?.value ?? "")}
                  clearable
                  placeholder="All templates"
                  size="sm"
                  variant="outline"
                  listMinWidth={280}
                />
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={groupByInquiries} onCheckedChange={setGroupByInquiries} />
                <span className="text-xs text-[var(--color-text-secondary)]">Group by Inquiries</span>
                <Tooltip content="Dedupes verifications associated with the same inquiry.">
                  <InfoCircle className="h-3.5 w-3.5 text-[var(--color-text-tertiary)]" />
                </Tooltip>
              </div>
            </div>

            <div className="mb-6 flex items-center">
              <div className="w-[120px]">
                <Select
                  options={ANALYTICS_INTERVAL_OPTIONS}
                  value={interval}
                  onChange={(option) => {
                    if (option) setInterval(option.value as AnalyticsInterval);
                  }}
                  size="sm"
                  pill
                  variant="outline"
                  listMinWidth={120}
                />
              </div>
            </div>

            <div className="space-y-8">
              {volumeSections.map((section) => (
                <VerificationTypeSection
                  key={section.typeKey}
                  typeKey={section.typeKey}
                  typeLabel={section.typeLabel}
                  highlights={section.highlights}
                  volumeData={section.volumeData}
                  rateData={section.rateData}
                />
              ))}
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
                  onChange={(options) => setTypeFilter(options.map((option) => option.value))}
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
                  onChange={(option) => setTemplateFilter(option?.value ?? "")}
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
                  onChange={(option) => setCheckRequirementFilter(option?.value ?? "")}
                  clearable
                  placeholder="All requirements"
                  size="sm"
                  variant="outline"
                  listMinWidth={160}
                />
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={groupByInquiries} onCheckedChange={setGroupByInquiries} />
                <span className="text-xs text-[var(--color-text-secondary)]">Group by Inquiries</span>
                <Tooltip content="Dedupes verifications associated with the same inquiry.">
                  <InfoCircle className="h-3.5 w-3.5 text-[var(--color-text-tertiary)]" />
                </Tooltip>
              </div>
            </div>

            <div className="mb-6 flex items-center">
              <div className="w-[120px]">
                <Select
                  options={ANALYTICS_INTERVAL_OPTIONS}
                  value={interval}
                  onChange={(option) => {
                    if (option) setInterval(option.value as AnalyticsInterval);
                  }}
                  size="sm"
                  pill
                  variant="outline"
                  listMinWidth={120}
                />
              </div>
            </div>

            <div className="space-y-8">
              {checkSections.map((section) => (
                <VerificationTypeSection
                  key={section.typeKey}
                  typeKey={section.typeKey}
                  typeLabel={section.typeLabel}
                  highlights={section.highlights}
                  volumeData={section.volumeData}
                  rateData={section.rateData}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
