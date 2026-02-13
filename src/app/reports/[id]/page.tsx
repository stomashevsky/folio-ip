"use client";

import { TopBar } from "@/components/layout/TopBar";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { ChartCard, NotFoundPage, SummaryCard, DetailInfoList } from "@/components/shared";
import { mockReports } from "@/lib/data";
import { formatDateTime, truncateId } from "@/lib/utils/format";
import { useParams } from "next/navigation";
import { EmptyMessage } from "@plexui/ui/components/EmptyMessage";
import { ShieldCheck, ExclamationMarkCircleFilled } from "@plexui/ui/components/Icon";
import { REPORT_TYPE_LABELS } from "@/lib/constants/report-type-labels";

export default function ReportDetailPage() {
  const params = useParams();

  const report = mockReports.find((r) => r.id === params.id);

  if (!report) {
    return <NotFoundPage section="Reports" backHref="/reports" entity="Report" />;
  }

  return (
    <div className="flex-1">
      <TopBar
        title="Reports"
        backHref="/reports"
      />
      <div className="px-4 pb-6 pt-6 md:px-6">
        {/* Summary */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryCard label="Status">
            <StatusBadge status={report.status} />
          </SummaryCard>
          <SummaryCard label="Matches">
            <p className={`heading-sm ${report.matchCount > 0 ? "text-[var(--color-danger-soft-text)]" : "text-[var(--color-success-soft-text)]"}`}>
              {report.matchCount}
            </p>
          </SummaryCard>
          <SummaryCard label="Continuous Monitoring">
            <p className="text-sm font-medium text-[var(--color-text)]">
              {report.continuousMonitoring ? "Enabled" : "Disabled"}
            </p>
          </SummaryCard>
          <SummaryCard label="Created By">
            <p className="text-sm font-medium capitalize text-[var(--color-text)]">
              {report.createdBy}
            </p>
          </SummaryCard>
        </div>

        {/* Details */}
        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <ChartCard title="Report Details">
            <DetailInfoList
              items={[
                ["Report ID", report.id],
                ["Type", REPORT_TYPE_LABELS[report.type] ?? report.type],
                ["Primary Input", report.primaryInput],
                ["Template", report.templateName],
                ["Created At", formatDateTime(report.createdAt)],
                [
                  "Completed At",
                  report.completedAt
                    ? formatDateTime(report.completedAt)
                    : "—",
                ],
                ["Inquiry ID", report.inquiryId ? truncateId(report.inquiryId) : "—"],
                ["Account ID", report.accountId ? truncateId(report.accountId) : "—"],
              ]}
            />
          </ChartCard>

          <ChartCard title="Screening Results">
            {report.matchCount === 0 ? (
              <EmptyMessage fill="none">
                <EmptyMessage.Icon size="sm"><ShieldCheck /></EmptyMessage.Icon>
                <EmptyMessage.Title>No matches found</EmptyMessage.Title>
                <EmptyMessage.Description>The subject was screened against all available databases.</EmptyMessage.Description>
              </EmptyMessage>
            ) : (
              <EmptyMessage fill="none">
                <EmptyMessage.Icon size="sm" color="danger"><ExclamationMarkCircleFilled /></EmptyMessage.Icon>
                <EmptyMessage.Title color="danger">{report.matchCount} match{report.matchCount > 1 ? "es" : ""} found</EmptyMessage.Title>
                <EmptyMessage.Description>Review required. Match details available via API.</EmptyMessage.Description>
              </EmptyMessage>
            )}
          </ChartCard>
        </div>
      </div>
    </div>
  );
}
