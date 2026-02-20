"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@plexui/ui/components/Button";
import { Badge, type BadgeProps } from "@plexui/ui/components/Badge";
import { getPriorityColor } from "@/lib/utils/format";
import { Tabs } from "@plexui/ui/components/Tabs";
import { DotsHorizontal } from "@plexui/ui/components/Icon";
import { Menu } from "@plexui/ui/components/Menu";
import { TopBar, TOPBAR_CONTROL_SIZE, TOPBAR_ACTION_PILL } from "@/components/layout/TopBar";
import { StatusBadge } from "@/components/shared/StatusBadge";
import {
  NotFoundPage,
  InfoRow,
  TagEditModal,
  DetailPageSidebar,
} from "@/components/shared";
import {
  mockCases,
  mockInquiries,
  mockVerifications,
  mockReports,
  getEventsForCase,
} from "@/lib/data";
import { formatDateTime } from "@/lib/utils/format";
import { getAllKnownTags } from "@/lib/utils/tags";
import { useTabParam } from "@/lib/hooks/useTabParam";
import {
  OverviewTab,
  InquiriesTab,
  VerificationsTab,
  ReportsTab,
  DocumentsTab,
  CommentsTab,
  ActivityTab,
} from "./components";

const tabs = ["Overview", "Inquiries", "Verifications", "Reports", "Documents", "Comments", "Activity"] as const;
type Tab = (typeof tabs)[number];



export default function CaseDetailPage() {
  return (
    <Suspense fallback={null}>
      <CaseDetailContent />
    </Suspense>
  );
}

function CaseDetailContent() {
  const params = useParams();
  const [activeTab, setActiveTab] = useTabParam(tabs, "Overview");

  const caseItem = mockCases.find((c) => c.id === params.id);
  const [tags, setTags] = useState<string[]>(() => caseItem?.tags ?? []);
  const [tagModalOpen, setTagModalOpen] = useState(false);
  const allKnownTags = getAllKnownTags();

  if (!caseItem) {
    return (
      <NotFoundPage
        section="Cases"
        backHref="/platform/cases"
        entity="Case"
      />
    );
  }

  const events = getEventsForCase(caseItem.id);

  // Compute linked entities through account
  const caseInquiries = caseItem.accountId
    ? mockInquiries.filter((i) => i.accountId === caseItem.accountId)
    : [];
  const caseVerifications = caseItem.accountId
    ? mockVerifications.filter((v) =>
        caseInquiries.some((i) => i.id === v.inquiryId),
      )
    : [];
  const caseReports = caseItem.accountId
    ? mockReports.filter((r) => r.accountId === caseItem.accountId)
    : [];
  const _totalMatches = caseReports.reduce(
    (sum, r) => sum + (r.matchCount ?? 0),
    0,
  );

  return (
    <div className="flex h-full flex-col">
      <TopBar
        title="Case"
        backHref="/platform/cases"
        actions={
          <div className="flex items-center gap-2">
            <Menu>
              <Menu.Trigger>
                <Button color="secondary" variant="soft" size={TOPBAR_CONTROL_SIZE} pill={TOPBAR_ACTION_PILL}>
                  <DotsHorizontal />
                </Button>
              </Menu.Trigger>
              <Menu.Content align="end" minWidth="auto">
                <Menu.Item onSelect={() => {}}>Resolve</Menu.Item>
                <Menu.Item onSelect={() => {}}>Escalate</Menu.Item>
                <Menu.Item onSelect={() => {}}>Reassign</Menu.Item>
                <Menu.Item onSelect={() => {}}>Change status</Menu.Item>
                <Menu.Separator />
                <Menu.Item onSelect={() => {}} className="text-[var(--color-text-danger-ghost)]">Delete</Menu.Item>
              </Menu.Content>
            </Menu>
            <Button color="primary" size={TOPBAR_CONTROL_SIZE} pill={TOPBAR_ACTION_PILL}>Review</Button>
          </div>
        }
      />

      <div className="flex flex-1 flex-col overflow-auto md:flex-row md:overflow-hidden">
        <div className="flex shrink-0 flex-col md:min-w-0 md:flex-1 md:overflow-auto">
          <div className="shrink-0 overflow-x-auto px-4 pt-4 md:px-6" style={{ "--color-ring": "transparent" } as React.CSSProperties}>
            <Tabs
              value={activeTab}
              onChange={(v) => setActiveTab(v as Tab)}
              variant="underline"
              aria-label="Case sections"
              size="lg"
            >
              <Tabs.Tab value="Overview">Overview</Tabs.Tab>
              <Tabs.Tab value="Inquiries" badge={caseInquiries.length ? { content: caseInquiries.length, pill: true } : undefined}>Inquiries</Tabs.Tab>
              <Tabs.Tab value="Verifications" badge={caseVerifications.length ? { content: caseVerifications.length, pill: true } : undefined}>Verifications</Tabs.Tab>
              <Tabs.Tab value="Reports" badge={caseReports.length ? { content: caseReports.length, pill: true } : undefined}>Reports</Tabs.Tab>
              <Tabs.Tab value="Documents">Documents</Tabs.Tab>
              <Tabs.Tab value="Comments">Comments</Tabs.Tab>
              <Tabs.Tab value="Activity" badge={events.length ? { content: events.length, pill: true } : undefined}>Activity</Tabs.Tab>
            </Tabs>
          </div>

          <div className="flex-1 overflow-auto px-4 py-6 md:px-6">
            {activeTab === "Overview" && (
              <OverviewTab
                caseItem={caseItem}
                inquiriesCount={caseInquiries.length}
                verificationsCount={caseVerifications.length}
                reportsCount={caseReports.length}
              />
            )}
            {activeTab === "Inquiries" && (
              <InquiriesTab inquiries={caseInquiries} />
            )}
            {activeTab === "Verifications" && (
              <VerificationsTab verifications={caseVerifications} />
            )}
            {activeTab === "Reports" && (
              <ReportsTab reports={caseReports} />
            )}
            {activeTab === "Documents" && (
              <DocumentsTab verifications={caseVerifications} />
            )}
            {activeTab === "Comments" && <CommentsTab />}
            {activeTab === "Activity" && <ActivityTab events={events} />}
          </div>
        </div>

        <DetailPageSidebar
          infoRows={
            <>
              <InfoRow label="Case ID" copyValue={caseItem.id} mono>
                {caseItem.id}
              </InfoRow>
              <InfoRow label="Status">
                <StatusBadge status={caseItem.status} />
              </InfoRow>
              <InfoRow label="Priority">
                <Badge color={getPriorityColor(caseItem.priority) as BadgeProps["color"]} variant="soft" size="sm">
                  {caseItem.priority.charAt(0).toUpperCase() + caseItem.priority.slice(1)}
                </Badge>
              </InfoRow>
              <InfoRow label="Queue">
                {caseItem.queue ?? (
                  <span className="text-[var(--color-text-tertiary)]">—</span>
                )}
              </InfoRow>
              <InfoRow label="Assignee">
                {caseItem.assignee ?? (
                  <span className="text-[var(--color-text-tertiary)]">Unassigned</span>
                )}
              </InfoRow>
              {caseItem.accountId && (
                <InfoRow label="Account ID" copyValue={caseItem.accountId} mono>
                  <Link
                    href={`/accounts/${caseItem.accountId}`}
                    className="text-[var(--color-primary-solid-bg)] hover:underline"
                  >
                    {caseItem.accountId}
                  </Link>
                </InfoRow>
              )}
              {caseItem.inquiryId && (
                <InfoRow label="Inquiry ID" copyValue={caseItem.inquiryId} mono>
                  <Link
                    href={`/inquiries/${caseItem.inquiryId}`}
                    className="text-[var(--color-primary-solid-bg)] hover:underline"
                  >
                    {caseItem.inquiryId}
                  </Link>
                </InfoRow>
              )}
              <InfoRow label="Created At">
                {formatDateTime(caseItem.createdAt)} UTC
              </InfoRow>
              <InfoRow label="Updated At">
                {formatDateTime(caseItem.updatedAt)} UTC
              </InfoRow>
              {caseItem.resolvedAt && (
                <InfoRow label="Resolved At">
                  {formatDateTime(caseItem.resolvedAt)} UTC
                </InfoRow>
              )}
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
