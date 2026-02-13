"use client";

import { TopBar } from "@/components/layout/TopBar";
import { ChartCard } from "@/components/shared";
import { VolumeChart } from "@/components/charts/VolumeChart";
import {
  mockVolumeChartSections,
  mockHighlights,
  mockFunnel,
} from "@/lib/data";
import { formatNumber } from "@/lib/utils/format";
import { useState } from "react";
import { Tabs } from "@plexui/ui/components/Tabs";
import { Tooltip } from "@plexui/ui/components/Tooltip";
import { Info } from "lucide-react";

const tabs = ["Overview", "Funnel"] as const;
type Tab = (typeof tabs)[number];

export default function InquiryAnalyticsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("Overview");

  return (
    <div className="flex min-h-full flex-col">
      <TopBar title="Inquiry Analytics" />
      <div className="px-4 pb-6 md:px-6">
        {/* Tabs */}
        <Tabs
          value={activeTab}
          onChange={(v) => setActiveTab(v as Tab)}
          variant="underline"
          aria-label="Analytics views"
          size="md"
        >
          <Tabs.Tab value="Overview">Overview</Tabs.Tab>
          <Tabs.Tab value="Funnel">Funnel</Tabs.Tab>
        </Tabs>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === "Overview" && (
            <>
              {/* Highlights */}
              <div>
                <h3 className="heading-sm text-[var(--color-text)] mb-3">Highlights</h3>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
                  {mockHighlights.map((metric) => (
                    <div
                      key={metric.label}
                      className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3"
                    >
                      <div className="flex items-center gap-1">
                        <p className="text-xs text-[var(--color-text-secondary)] truncate">
                          {metric.label}
                        </p>
                        {metric.tooltip && (
                          <Tooltip content={metric.tooltip}>
                            <Info className="h-3.5 w-3.5 shrink-0 text-[var(--color-text-tertiary)] cursor-help" />
                          </Tooltip>
                        )}
                      </div>
                      <p className="mt-1.5 heading-md text-[var(--color-text)]">
                        {metric.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Volume chart sections */}
              <div className="mt-4 space-y-4">
                {mockVolumeChartSections.map((section) => (
                  <ChartCard key={section.title} title={section.title}>
                    <VolumeChart
                      data={section.data}
                      volumeLabel={section.volumeLabel}
                      rateLabel={section.rateLabel}
                      rateSublabel={section.rateSublabel}
                    />
                  </ChartCard>
                ))}
              </div>
            </>
          )}

          {activeTab === "Funnel" && (
            <ChartCard
              title="Verification Funnel"
              description="Drop-off analysis across verification steps"
            >
              <div className="space-y-4">
                {mockFunnel.map((step, i) => (
                  <div key={i} className="relative">
                    <div className="mb-1.5 flex items-center justify-between">
                      <span className="text-sm text-[var(--color-text)]">
                        {step.name}
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="heading-xs text-[var(--color-text)]">
                          {formatNumber(step.count)}
                        </span>
                        <span className="text-xs text-[var(--color-text-tertiary)]">
                          {step.percentage}%
                        </span>
                        {step.dropoff > 0 && (
                          <span className="text-xs text-[var(--color-danger-soft-text)]">
                            −{step.dropoff}%
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="h-8 w-full overflow-hidden rounded-lg bg-[var(--color-surface-secondary)]">
                      <div
                        className="h-full rounded-lg bg-[var(--color-primary-soft-bg)] transition-all duration-500"
                        style={{ width: `${step.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </ChartCard>
          )}
        </div>
      </div>
    </div>
  );
}
