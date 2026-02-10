"use client";

import { useState, useMemo } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { MetricCard, ChartCard } from "@/components/shared";
import { RecentInquiriesTable } from "@/components/shared/RecentInquiriesTable";
import { InquiriesTrendChart } from "@/components/charts/InquiriesTrendChart";
import { StatusDonutChart } from "@/components/charts/StatusDonutChart";
import { SegmentedControl } from "@plexui/ui/components/SegmentedControl";
import {
  mockInquiries,
  generateTimeSeries,
} from "@/lib/data";
import { formatNumber, formatPercent, formatDuration } from "@/lib/utils/format";
import type { StatusDistribution } from "@/lib/types";

const periods = [
  { value: "all", label: "All time" },
  { value: "3m", label: "Last 3 months" },
  { value: "30d", label: "Last 30 days" },
  { value: "7d", label: "Last 7 days" },
] as const;

type Period = (typeof periods)[number]["value"];

const periodTrendLabels: Record<Period, string> = {
  all: "all time",
  "3m": "vs prev 3 months",
  "30d": "vs prev 30 days",
  "7d": "vs prev 7 days",
};

const periodDescriptions: Record<Period, string> = {
  all: "All time",
  "3m": "Last 3 months",
  "30d": "Last 30 days",
  "7d": "Last 7 days",
};

// Simulated metrics per period (in real app this comes from API)
const metricsByPeriod: Record<
  Period,
  {
    totalInquiries: number;
    approvalRate: number;
    avgCompletionTime: number;
    pendingReview: number;
    inquiriesTrend: number;
    approvalTrend: number;
    completionTimeTrend: number;
    pendingReviewTrend: number;
    description: {
      inquiries: string;
      approval: string;
      completion: string;
      pending: string;
    };
  }
> = {
  all: {
    totalInquiries: 12847,
    approvalRate: 86.2,
    avgCompletionTime: 295,
    pendingReview: 23,
    inquiriesTrend: 34.1,
    approvalTrend: 4.8,
    completionTimeTrend: -12.3,
    pendingReviewTrend: -2.1,
    description: {
      inquiries: "Since launch",
      approval: "Overall rate",
      completion: "Improving steadily",
      pending: "Current backlog",
    },
  },
  "3m": {
    totalInquiries: 3456,
    approvalRate: 87.5,
    avgCompletionTime: 272,
    pendingReview: 23,
    inquiriesTrend: 18.5,
    approvalTrend: 3.2,
    completionTimeTrend: -8.1,
    pendingReviewTrend: 5.4,
    description: {
      inquiries: "Trending up this quarter",
      approval: "Strong verification rate",
      completion: "Faster processing",
      pending: "Slight increase",
    },
  },
  "30d": {
    totalInquiries: 1234,
    approvalRate: 89.1,
    avgCompletionTime: 258,
    pendingReview: 23,
    inquiriesTrend: 12.3,
    approvalTrend: 2.1,
    completionTimeTrend: -5.2,
    pendingReviewTrend: 8.7,
    description: {
      inquiries: "Trending up this month",
      approval: "Strong verification rate",
      completion: "Faster processing",
      pending: "Needs attention",
    },
  },
  "7d": {
    totalInquiries: 312,
    approvalRate: 91.3,
    avgCompletionTime: 245,
    pendingReview: 23,
    inquiriesTrend: 5.8,
    approvalTrend: 1.4,
    completionTimeTrend: -3.1,
    pendingReviewTrend: 15.2,
    description: {
      inquiries: "Steady this week",
      approval: "Above average",
      completion: "Processing faster",
      pending: "Spike this week",
    },
  },
};

// Simulated status distribution per period
const statusByPeriod: Record<Period, StatusDistribution[]> = {
  all: [
    { status: "Approved", count: 11072, percentage: 86.2, color: "#30a46c" },
    { status: "Declined", count: 899, percentage: 7.0, color: "#e5484d" },
    { status: "Needs Review", count: 23, percentage: 0.2, color: "#f5a623" },
    { status: "Pending", count: 385, percentage: 3.0, color: "#8b8d98" },
    { status: "Expired", count: 321, percentage: 2.5, color: "#63646e" },
    { status: "Created", count: 147, percentage: 1.1, color: "#505159" },
  ],
  "3m": [
    { status: "Approved", count: 3024, percentage: 87.5, color: "#30a46c" },
    { status: "Declined", count: 207, percentage: 6.0, color: "#e5484d" },
    { status: "Needs Review", count: 23, percentage: 0.7, color: "#f5a623" },
    { status: "Pending", count: 97, percentage: 2.8, color: "#8b8d98" },
    { status: "Expired", count: 69, percentage: 2.0, color: "#63646e" },
    { status: "Created", count: 36, percentage: 1.0, color: "#505159" },
  ],
  "30d": [
    { status: "Approved", count: 1079, percentage: 87.4, color: "#30a46c" },
    { status: "Declined", count: 74, percentage: 6.0, color: "#e5484d" },
    { status: "Needs Review", count: 23, percentage: 1.9, color: "#f5a623" },
    { status: "Pending", count: 35, percentage: 2.8, color: "#8b8d98" },
    { status: "Expired", count: 18, percentage: 1.5, color: "#63646e" },
    { status: "Created", count: 5, percentage: 0.4, color: "#505159" },
  ],
  "7d": [
    { status: "Approved", count: 285, percentage: 91.3, color: "#30a46c" },
    { status: "Declined", count: 12, percentage: 3.8, color: "#e5484d" },
    { status: "Needs Review", count: 8, percentage: 2.6, color: "#f5a623" },
    { status: "Pending", count: 4, percentage: 1.3, color: "#8b8d98" },
    { status: "Expired", count: 2, percentage: 0.6, color: "#63646e" },
    { status: "Created", count: 1, percentage: 0.3, color: "#505159" },
  ],
};

export default function DashboardHome() {
  const recentInquiries = mockInquiries.slice(0, 10);
  const [period, setPeriod] = useState<Period>("30d");

  const metrics = metricsByPeriod[period];
  const trendLabel = periodTrendLabels[period];
  const periodDesc = periodDescriptions[period];
  const trendData = useMemo(() => generateTimeSeries(period), [period]);
  const statusData = statusByPeriod[period];

  return (
    <main className="flex-1 overflow-y-auto">
      <TopBar
        title="Overview"
        description="Identity verification dashboard"
        actions={
          <SegmentedControl
            value={period}
            onChange={(v: string) => setPeriod(v as Period)}
            aria-label="Select time period"
            size="xs"
          >
            {periods.map((p) => (
              <SegmentedControl.Option key={p.value} value={p.value}>
                {p.label}
              </SegmentedControl.Option>
            ))}
          </SegmentedControl>
        }
      />
      <div className="px-6 pb-6">
        {/* Metric Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            label="Total Inquiries"
            value={formatNumber(metrics.totalInquiries)}
            trend={{ value: metrics.inquiriesTrend, label: trendLabel }}
            description={metrics.description.inquiries}
          />
          <MetricCard
            label="Approval Rate"
            value={formatPercent(metrics.approvalRate)}
            trend={{ value: metrics.approvalTrend, label: trendLabel }}
            description={metrics.description.approval}
          />
          <MetricCard
            label="Avg Completion Time"
            value={formatDuration(metrics.avgCompletionTime)}
            trend={{ value: metrics.completionTimeTrend, label: trendLabel }}
            description={metrics.description.completion}
          />
          <MetricCard
            label="Pending Review"
            value={formatNumber(metrics.pendingReview)}
            trend={{ value: metrics.pendingReviewTrend, label: trendLabel }}
            description={metrics.description.pending}
          />
        </div>

        {/* Charts Row */}
        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <ChartCard title="Inquiries Trend" description={periodDesc}>
            <InquiriesTrendChart data={trendData} />
          </ChartCard>
          <ChartCard title="Status Distribution" description={periodDesc}>
            <StatusDonutChart data={statusData} />
          </ChartCard>
        </div>

        {/* Recent Inquiries */}
        <div className="mt-8">
          <h2 className="text-sm font-semibold text-[var(--color-text)]">
            Recent Inquiries
          </h2>
          <p className="mt-0.5 text-xs text-[var(--color-text-tertiary)]">
            Last 10 inquiries
          </p>
          <div className="mt-4">
            <RecentInquiriesTable data={recentInquiries} />
          </div>
        </div>
      </div>
    </main>
  );
}
