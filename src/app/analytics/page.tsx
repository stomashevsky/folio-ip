"use client";

import { TopBar } from "@/components/layout/TopBar";
import { MetricCard, ChartCard } from "@/components/shared";
import { InquiriesTrendChart } from "@/components/charts/InquiriesTrendChart";
import { StatusDonutChart } from "@/components/charts/StatusDonutChart";
import {
  mockAnalyticsOverview,
  mockInquiriesTimeSeries,
  mockStatusDistribution,
  mockFunnel,
  mockTopFailureReasons,
} from "@/lib/data";
import { formatNumber, formatPercent, formatDuration } from "@/lib/utils/format";
import { useState } from "react";

const tabs = ["Overview", "Funnel"] as const;
type Tab = (typeof tabs)[number];

export default function AnalyticsPage() {
  const overview = mockAnalyticsOverview;
  const [activeTab, setActiveTab] = useState<Tab>("Overview");

  return (
    <main className="flex-1">
      <TopBar
        title="Analytics"
        description="Identity verification analytics and insights"
      />
      <div className="px-6 pb-6 pt-6">
        {/* Metric Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <MetricCard
            label="Total Inquiries"
            value={formatNumber(overview.totalInquiries)}
            trend={{ value: overview.inquiriesTrend, label: "vs last period" }}
            description="Trending up"
          />
          <MetricCard
            label="Approval Rate"
            value={formatPercent(overview.approvalRate)}
            trend={{ value: overview.approvalTrend, label: "vs last period" }}
            description="Strong rate"
          />
          <MetricCard
            label="Avg Completion"
            value={formatDuration(overview.avgCompletionTime)}
            trend={{
              value: overview.completionTimeTrend,
              label: "vs last period",
            }}
            description="Faster processing"
          />
          <MetricCard
            label="Pending Review"
            value={formatNumber(overview.pendingReview)}
            trend={{ value: overview.pendingReviewTrend }}
            description="Needs attention"
          />
          <MetricCard
            label="Verifications"
            value={formatNumber(overview.totalVerifications)}
            description="Total checks"
          />
          <MetricCard
            label="Accounts"
            value={formatNumber(overview.totalAccounts)}
            description="Active users"
          />
        </div>

        {/* Tabs */}
        <div className="mt-6 flex gap-1 border-b border-[var(--color-border)]">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? "border-b-2 border-[var(--color-primary-solid-bg)] text-[var(--color-text)]"
                  : "text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === "Overview" && (
            <>
              {/* Charts Row */}
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <ChartCard title="Inquiries Trend" description="Last 30 days">
                  <InquiriesTrendChart data={mockInquiriesTimeSeries} />
                </ChartCard>
                <ChartCard
                  title="Status Distribution"
                  description="All time"
                >
                  <StatusDonutChart data={mockStatusDistribution} />
                </ChartCard>
              </div>

              {/* Failure Reasons */}
              <div className="mt-4">
                <ChartCard
                  title="Top Failure Reasons"
                  description="Most common reasons for inquiry failures"
                >
                  <div className="space-y-3">
                    {mockTopFailureReasons.map((reason, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <span className="w-6 text-sm font-medium text-[var(--color-text-tertiary)]">
                          {i + 1}.
                        </span>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-[var(--color-text)]">
                              {reason.reason}
                            </span>
                            <span className="text-sm font-medium text-[var(--color-text)]">
                              {reason.count}
                            </span>
                          </div>
                          <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-[var(--color-surface-secondary)]">
                            <div
                              className="h-full rounded-full bg-[var(--color-danger-soft-bg)]"
                              style={{
                                width: `${reason.percentage}%`,
                              }}
                            />
                          </div>
                        </div>
                        <span className="w-12 text-right text-xs text-[var(--color-text-tertiary)]">
                          {reason.percentage}%
                        </span>
                      </div>
                    ))}
                  </div>
                </ChartCard>
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
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-medium text-[var(--color-text)]">
                        {step.name}
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-[var(--color-text)]">
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
    </main>
  );
}
