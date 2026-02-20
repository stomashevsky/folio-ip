"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@plexui/ui/components/Button";
import { Badge } from "@plexui/ui/components/Badge";
import { Tabs } from "@plexui/ui/components/Tabs";
import { DotsHorizontal } from "@plexui/ui/components/Icon";
import { Menu } from "@plexui/ui/components/Menu";
import { TopBar, TOPBAR_CONTROL_SIZE, TOPBAR_ACTION_PILL } from "@/components/layout/TopBar";
import {
  NotFoundPage,
  InfoRow,
  TagEditModal,
  DetailPageSidebar,
} from "@/components/shared";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { REPORT_TYPE_LABELS } from "@/lib/constants/report-type-labels";
import { mockReports, getEventsForReport } from "@/lib/data";
import { formatDateTime, toTitleCase } from "@/lib/utils/format";
import { getAllKnownTags } from "@/lib/utils/tags";
import { useTabParam } from "@/lib/hooks/useTabParam";
import { OverviewTab, MatchesTab, MonitoringTab } from "./components";

const tabs = ["Overview", "Matches", "Monitoring"] as const;
type Tab = (typeof tabs)[number];

export default function ReportDetailPage() {
  return (
    <Suspense fallback={null}>
      <ReportDetailContent />
    </Suspense>
  );
}

function ReportDetailContent() {
  const params = useParams();
  const [activeTab, setActiveTab] = useTabParam(tabs, "Overview");
  const report = mockReports.find((r) => r.id === params.id);
  const [tags, setTags] = useState<string[]>([]);
  const [tagModalOpen, setTagModalOpen] = useState(false);
  const allKnownTags = getAllKnownTags();

  if (!report) {
    return (
      <NotFoundPage
        section="Reports"
        backHref="/reports"
        entity="Report"
      />
    );
  }

  const reportType = REPORT_TYPE_LABELS[report.type] ?? report.type;
  const events = getEventsForReport(report.id);

  return (
    <div className="flex h-full flex-col">
      <TopBar
        title="Report"
        backHref="/reports"
        actions={
          <Menu>
            <Menu.Trigger>
              <Button color="secondary" variant="soft" size={TOPBAR_CONTROL_SIZE} pill={TOPBAR_ACTION_PILL}>
                <DotsHorizontal />
              </Button>
            </Menu.Trigger>
              <Menu.Content align="end" minWidth="auto">
                <Menu.Item onSelect={() => {}}>Rerun report</Menu.Item>
                <Menu.Item onSelect={() => {}}>
                  {report.continuousMonitoring ? "Pause monitoring" : "Resume monitoring"}
                </Menu.Item>
                <Menu.Separator />
                <Menu.Item onSelect={() => {}}>Archive</Menu.Item>
                <Menu.Separator />
                <Menu.Item onSelect={() => {}} className="text-[var(--color-text-danger-ghost)]">Delete</Menu.Item>
              </Menu.Content>
          </Menu>
        }
      />

      <div className="flex flex-1 flex-col overflow-auto md:flex-row md:overflow-hidden">
        <div className="flex shrink-0 flex-col md:min-w-0 md:flex-1 md:overflow-auto">
          <div className="shrink-0 overflow-x-auto px-4 pt-4 md:px-6" style={{ "--color-ring": "transparent" } as React.CSSProperties}>
            <Tabs
              value={activeTab}
              onChange={(v) => setActiveTab(v as Tab)}
              variant="underline"
              aria-label="Report sections"
              size="lg"
            >
              <Tabs.Tab value="Overview">Overview</Tabs.Tab>
              <Tabs.Tab value="Matches" badge={report.matchCount ? { content: report.matchCount, pill: true } : undefined}>Matches</Tabs.Tab>
              <Tabs.Tab value="Monitoring">Monitoring</Tabs.Tab>
            </Tabs>
          </div>

          <div className="flex-1 overflow-auto px-4 py-6 md:px-6">
            {activeTab === "Overview" && <OverviewTab report={report} />}
            {activeTab === "Matches" && <MatchesTab report={report} />}
            {activeTab === "Monitoring" && <MonitoringTab report={report} />}
          </div>
        </div>

        <DetailPageSidebar
          infoRows={
            <>
              <InfoRow label="Report ID" copyValue={report.id} mono>
                {report.id}
              </InfoRow>
              <InfoRow label="Type">{reportType}</InfoRow>
              <InfoRow label="Status">
                <StatusBadge
                  status={report.status}
                  label={
                    report.status === "no_matches"
                      ? "No Matches"
                      : undefined
                  }
                />
              </InfoRow>
              <InfoRow label="Primary Input">
                {toTitleCase(report.primaryInput)}
              </InfoRow>
              <InfoRow label="Template">{report.templateName}</InfoRow>
              <InfoRow label="Created By">
                <span className="capitalize">{report.createdBy}</span>
              </InfoRow>
              <InfoRow label="Created At">
                {formatDateTime(report.createdAt)} UTC
              </InfoRow>
              <InfoRow label="Completed At">
                {report.completedAt ? (
                  `${formatDateTime(report.completedAt)} UTC`
                ) : (
                  <span className="text-[var(--color-text-tertiary)]">
                    —
                  </span>
                )}
              </InfoRow>
              <InfoRow label="Inquiry ID" copyValue={report.inquiryId} mono>
                {report.inquiryId ? (
                  <Link
                    href={`/inquiries/${report.inquiryId}`}
                    className="text-[var(--color-primary-solid-bg)] hover:underline"
                  >
                    {report.inquiryId}
                  </Link>
                ) : (
                  <span className="text-[var(--color-text-tertiary)]">
                    —
                  </span>
                )}
              </InfoRow>
              <InfoRow label="Account ID" copyValue={report.accountId} mono>
                {report.accountId ? (
                  <Link
                    href={`/accounts/${report.accountId}`}
                    className="text-[var(--color-primary-solid-bg)] hover:underline"
                  >
                    {report.accountId}
                  </Link>
                ) : (
                  <span className="text-[var(--color-text-tertiary)]">
                    —
                  </span>
                )}
              </InfoRow>
              <InfoRow label="Matches">
                <span
                  className={
                    report.matchCount > 0
                      ? "font-medium text-[var(--color-danger-soft-text)]"
                      : "text-[var(--color-text-secondary)]"
                  }
                >
                  {report.matchCount}
                </span>
              </InfoRow>
              <InfoRow label="Continuous Monitoring">
                {report.continuousMonitoring ? (
                  <Badge color="success" size="sm">
                    Enabled
                  </Badge>
                ) : (
                  "Disabled"
                )}
              </InfoRow>
            </>
          }
          tags={tags}
          onEditTags={() => setTagModalOpen(true)}
          events={events}
          tagEmptyMessage="No tags assigned."
        />
      </div>

      <TagEditModal
        open={tagModalOpen}
        onOpenChange={setTagModalOpen}
        tags={tags}
        onSave={setTags}
        allTags={allKnownTags}
      />
    </div>
  );
}
