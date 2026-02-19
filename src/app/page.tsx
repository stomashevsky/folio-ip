"use client";

import { useState } from "react";
import { DateTime } from "luxon";
import { ButtonLink } from "@plexui/ui/components/Button";
import { TopBar } from "@/components/layout/TopBar";
import { MetricCard, ChartCard, DataTable } from "@/components/shared";
import { InquiriesTrendChart } from "@/components/charts/InquiriesTrendChart";
import { StatusDonutChart } from "@/components/charts/StatusDonutChart";
import { DateRangePicker } from "@plexui/ui/components/DateRangePicker";
import {
  mockInquiries,
  generateTimeSeries,
} from "@/lib/data";
import { idCell, dateTimeCell, statusCell } from "@/lib/utils/columnHelpers";
import { formatNumber, formatPercent, formatDuration } from "@/lib/utils/format";
import { DASHBOARD_DATE_SHORTCUTS, type DateRangeShortcut } from "@/lib/constants/date-shortcuts";
import { STATUS_COLORS } from "@/lib/constants/status-colors";
import type { ColumnDef } from "@tanstack/react-table";
import type { Inquiry, StatusDistribution } from "@/lib/types";
import type { DateRange } from "@/lib/constants/date-shortcuts";
import { useRouter } from "next/navigation";

/* ── Seeded pseudo-random (Mulberry32) for stable derived data ── */
function seededRandom(seed: number) {
  let t = (seed + 0x6d2b79f5) | 0;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

/** Derive all dashboard data from the number of days in the range */
function deriveMetrics(days: number) {
  // Scale: ~42 inquiries/day base rate
  const dailyRate = 42;
  const totalInquiries = Math.round(dailyRate * days * (0.9 + seededRandom(days) * 0.2));
  const approvalRate = 85 + seededRandom(days * 3) * 7; // 85–92%
  const avgCompletionTime = 230 + Math.round(seededRandom(days * 5) * 70); // 230–300s

  // Trends: smaller periods show bigger relative swings
  const trendScale = Math.min(1, 30 / days);
  const inquiriesTrend = (5 + seededRandom(days * 7) * 30) * trendScale;
  const approvalTrend = (0.5 + seededRandom(days * 11) * 5) * trendScale;
  const completionTimeTrend = -(1 + seededRandom(days * 13) * 12) * trendScale;
  const pendingReviewTrend = (-5 + seededRandom(days * 17) * 25) * trendScale;

  return {
    totalInquiries,
    approvalRate: Math.round(approvalRate * 10) / 10,
    avgCompletionTime,
    pendingReview: 23,
    inquiriesTrend: Math.round(inquiriesTrend * 10) / 10,
    approvalTrend: Math.round(approvalTrend * 10) / 10,
    completionTimeTrend: Math.round(completionTimeTrend * 10) / 10,
    pendingReviewTrend: Math.round(pendingReviewTrend * 10) / 10,
  };
}

function deriveStatusDistribution(days: number): StatusDistribution[] {
  const dailyRate = 42;
  const total = Math.round(dailyRate * days * (0.9 + seededRandom(days) * 0.2));
  const approvalRate = 85 + seededRandom(days * 3) * 7;
  const declinedRate = 3 + seededRandom(days * 9) * 5;
  const needsReviewRate = 0.2 + seededRandom(days * 15) * 2.5;
  const pendingRate = 1 + seededRandom(days * 19) * 3;
  const expiredRate = 0.5 + seededRandom(days * 23) * 2.5;
  const createdRate = 100 - approvalRate - declinedRate - needsReviewRate - pendingRate - expiredRate;

  const rates = [
    { status: "Approved", rate: approvalRate, color: STATUS_COLORS["Approved"] },
    { status: "Declined", rate: declinedRate, color: STATUS_COLORS["Declined"] },
    { status: "Needs Review", rate: needsReviewRate, color: STATUS_COLORS["Needs Review"] },
    { status: "Pending", rate: pendingRate, color: STATUS_COLORS["Pending"] },
    { status: "Expired", rate: expiredRate, color: STATUS_COLORS["Expired"] },
    { status: "Created", rate: Math.max(0.1, createdRate), color: STATUS_COLORS["Created"] },
  ];

  return rates.map((r) => ({
    status: r.status,
    count: Math.max(1, Math.round((r.rate / 100) * total)),
    percentage: Math.round(r.rate * 10) / 10,
    color: r.color,
  }));
}

function describePeriod(days: number, shortcutLabel?: string): string {
  if (shortcutLabel) return shortcutLabel;
  if (days === 1) return "1 day";
  return `${days} days`;
}

function trendLabel(days: number, shortcutLabel?: string): string {
  if (shortcutLabel === "All time") return "all time";
  if (shortcutLabel === "Last 7 days") return "vs prev 7 days";
  if (shortcutLabel === "Last 30 days") return "vs prev 30 days";
  if (shortcutLabel === "Last 3 months") return "vs prev 3 months";
  if (days === 1) return "vs prev day";
  return `vs prev ${days} days`;
}

const defaultRange: DateRange = DASHBOARD_DATE_SHORTCUTS[1].getDateRange();

const recentInquiriesColumns: ColumnDef<Inquiry, unknown>[] = [
  {
    accessorKey: "accountName",
    header: "Name",
    enableSorting: false,
    cell: ({ row }) => (
      <span className="font-medium">{row.original.accountName}</span>
    ),
  },
  {
    accessorKey: "id",
    header: "Inquiry ID",
    enableSorting: false,
    cell: idCell<Inquiry>((r) => r.id),
  },
  {
    accessorKey: "templateName",
    header: "Template",
    enableSorting: false,
    cell: ({ row }) => (
      <span className="text-[var(--color-text-secondary)]">
        {row.original.templateName}
      </span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Created at",
    enableSorting: false,
    cell: dateTimeCell<Inquiry>((r) => r.createdAt),
  },
  {
    accessorKey: "status",
    header: "Status",
    enableSorting: false,
    cell: statusCell<Inquiry>((r) => r.status),
  },
];

export default function DashboardHome() {
  const router = useRouter();
  const recentInquiries = mockInquiries.slice(0, 10);
  const [dateRange, setDateRange] = useState<DateRange | null>(defaultRange);
  const [activeShortcutLabel, setActiveShortcutLabel] = useState<string | undefined>("Last 30 days");

  const handleRangeChange = (next: DateRange | null, shortcut?: DateRangeShortcut) => {
    setDateRange(next);
    setActiveShortcutLabel(shortcut?.label);
  };

  const days = dateRange
    ? Math.max(1, Math.round(dateRange[1].diff(dateRange[0], "days").days) + 1)
    : 30;

  const metrics = deriveMetrics(days);
  const currentTrendLabel = trendLabel(days, activeShortcutLabel);
  const periodDesc = describePeriod(days, activeShortcutLabel);
  const trendData = generateTimeSeries(days);
  const statusData = deriveStatusDistribution(days);

  return (
    <div className="flex-1">
      <TopBar
        title="Overview"
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
        {/* Metric Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            label="Total Inquiries"
            value={formatNumber(metrics.totalInquiries)}
            trend={{ value: metrics.inquiriesTrend, label: currentTrendLabel }}
          />
          <MetricCard
            label="Approval Rate"
            value={formatPercent(metrics.approvalRate)}
            trend={{ value: metrics.approvalTrend, label: currentTrendLabel }}
          />
          <MetricCard
            label="Avg Completion Time"
            value={formatDuration(metrics.avgCompletionTime)}
            trend={{ value: metrics.completionTimeTrend, label: currentTrendLabel }}
          />
          <MetricCard
            label="Pending Review"
            value={formatNumber(metrics.pendingReview)}
            trend={{ value: metrics.pendingReviewTrend, label: currentTrendLabel }}
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
          <div className="flex items-center justify-between">
            <div>
              <h2 className="heading-sm text-[var(--color-text)]">
                Recent Inquiries
              </h2>
            </div>
            <ButtonLink href="/inquiries" color="secondary" variant="soft" size="sm" pill={false}>
              View all
            </ButtonLink>
          </div>
          <div className="mt-4">
            <DataTable
              data={recentInquiries}
              columns={recentInquiriesColumns}
              onRowClick={(row) => router.push(`/inquiries/${row.id}`)}
              emptyMessage="No inquiries found."
            />
          </div>
        </div>
      </div>
    </div>
  );
}
