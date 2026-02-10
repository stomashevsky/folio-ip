import { TopBar } from "@/components/layout/TopBar";
import { MetricCard, ChartCard } from "@/components/shared";
import { RecentInquiriesTable } from "@/components/shared/RecentInquiriesTable";
import { InquiriesTrendChart } from "@/components/charts/InquiriesTrendChart";
import { StatusDonutChart } from "@/components/charts/StatusDonutChart";
import {
  mockAnalyticsOverview,
  mockInquiriesTimeSeries,
  mockStatusDistribution,
  mockInquiries,
} from "@/lib/data";
import { formatNumber, formatPercent, formatDuration } from "@/lib/utils/format";
import { FileSearch, ShieldCheck, Clock, AlertTriangle } from "lucide-react";

export default function DashboardHome() {
  const overview = mockAnalyticsOverview;
  const recentInquiries = mockInquiries.slice(0, 10);

  return (
    <main className="flex-1 overflow-y-auto">
      <TopBar title="Overview" description="Identity verification dashboard" />
      <div className="px-6 pb-6">
        {/* Metric Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            label="Total Inquiries"
            value={formatNumber(overview.totalInquiries)}
            trend={{ value: overview.inquiriesTrend, label: "vs last period" }}
            icon={<FileSearch className="h-4 w-4" />}
          />
          <MetricCard
            label="Approval Rate"
            value={formatPercent(overview.approvalRate)}
            trend={{ value: overview.approvalTrend, label: "vs last period" }}
            icon={<ShieldCheck className="h-4 w-4" />}
          />
          <MetricCard
            label="Avg Completion Time"
            value={formatDuration(overview.avgCompletionTime)}
            trend={{ value: overview.completionTimeTrend, label: "vs last period" }}
            icon={<Clock className="h-4 w-4" />}
          />
          <MetricCard
            label="Pending Review"
            value={formatNumber(overview.pendingReview)}
            trend={{ value: overview.pendingReviewTrend }}
            icon={<AlertTriangle className="h-4 w-4" />}
          />
        </div>

        {/* Charts Row */}
        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <ChartCard title="Inquiries Trend" description="Last 30 days">
            <InquiriesTrendChart data={mockInquiriesTimeSeries} />
          </ChartCard>
          <ChartCard title="Status Distribution" description="All time">
            <StatusDonutChart data={mockStatusDistribution} />
          </ChartCard>
        </div>

        {/* Recent Inquiries Table */}
        <div className="mt-6">
          <ChartCard title="Recent Inquiries" description="Last 10 inquiries">
            <RecentInquiriesTable data={recentInquiries} />
          </ChartCard>
        </div>
      </div>
    </main>
  );
}
