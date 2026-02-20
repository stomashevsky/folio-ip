"use client";

import { TopBar } from "@/components/layout/TopBar";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { NotFoundPage, TagEditModal, InfoRow, DetailPageSidebar } from "@/components/shared";
import {
  mockInquiries,
  mockVerifications,
  mockReports,
  getEventsForInquiry,
  getSessionsForInquiry,
  getSignalsForInquiry,
  getBehavioralRiskForInquiry,
} from "@/lib/data";
import { formatDateTime } from "@/lib/utils/format";
import { getAllKnownTags } from "@/lib/utils/tags";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Suspense, useState } from "react";
import { useTabParam } from "@/lib/hooks/useTabParam";
import { Button } from "@plexui/ui/components/Button";
import { Tabs } from "@plexui/ui/components/Tabs";
import { DotsHorizontal } from "@plexui/ui/components/Icon";
import { Menu } from "@plexui/ui/components/Menu";
import {
  OverviewTab,
  VerificationsTab,
  SessionsTab,
  SignalsTab,
  ReportsTab,
  ListMatchesTab,
} from "./components";

const tabs = [
  "Overview",
  "Verifications",
  "Sessions",
  "Signals",
  "Reports",
  "List Matches",
] as const;
type Tab = (typeof tabs)[number];

export default function InquiryDetailPage() {
  return (
    <Suspense fallback={null}>
      <InquiryDetailContent />
    </Suspense>
  );
}

function InquiryDetailContent() {
  const params = useParams();
  const [activeTab, setActiveTab] = useTabParam(tabs, "Overview");

  const inquiry = mockInquiries.find((i) => i.id === params.id);
  const [tags, setTags] = useState<string[]>(() => inquiry?.tags ?? []);
  const [tagModalOpen, setTagModalOpen] = useState(false);
  const allKnownTags = getAllKnownTags();

  const verifications = mockVerifications.filter(
    (v) => v.inquiryId === inquiry?.id
  );
  const reports = mockReports.filter((r) => r.inquiryId === inquiry?.id);
  const totalMatches = reports.reduce((sum, r) => sum + (r.matchCount ?? 0), 0);

  if (!inquiry) {
    return (
      <NotFoundPage
        section="Inquiries"
        backHref="/inquiries"
        entity="Inquiry"
      />
    );
  }

  const events = getEventsForInquiry(inquiry.id);
  const sessions = getSessionsForInquiry(inquiry.id);
  const signals = getSignalsForInquiry(inquiry.id);
  const behavioralRisk = getBehavioralRiskForInquiry(inquiry.id);

  const featuredSignals = signals.filter((s) => s.category === "featured");

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <TopBar
        title="Inquiry"
        backHref="/inquiries"
        actions={
          <div className="flex items-center gap-2">
            <Menu>
              <Menu.Trigger>
                <Button color="secondary" variant="soft" size="md" pill={false}>
                  <DotsHorizontal />
                </Button>
              </Menu.Trigger>
              <Menu.Content align="end" minWidth="auto">
                <Menu.Item onSelect={() => {}}>Approve</Menu.Item>
                <Menu.Item onSelect={() => {}}>Decline</Menu.Item>
                <Menu.Item onSelect={() => {}}>Mark as needs review</Menu.Item>
                <Menu.Separator />
                <Menu.Item onSelect={() => {}}>Archive</Menu.Item>
                <Menu.Separator />
                <Menu.Item onSelect={() => {}} className="text-[var(--color-text-danger-ghost)]">Delete</Menu.Item>
              </Menu.Content>
            </Menu>
            <Button color="primary" size="md" pill={false}>Review</Button>
          </div>
        }
      />

      {/* Content + Sidebar */}
      <div className="flex flex-1 flex-col overflow-auto md:flex-row md:overflow-hidden">
        {/* Main content */}
        <div className="flex shrink-0 flex-col md:min-w-0 md:flex-1 md:overflow-auto">
          {/* Tabs */}
          <div className="shrink-0 overflow-x-auto px-4 pt-4 md:px-6" style={{ "--color-ring": "transparent" } as React.CSSProperties}>
            <Tabs
              value={activeTab}
              onChange={(v) => setActiveTab(v as Tab)}
              variant="underline"
              aria-label="Inquiry sections"
              size="lg"
            >
              <Tabs.Tab value="Overview">Overview</Tabs.Tab>
              <Tabs.Tab value="Verifications" badge={verifications.length ? { content: verifications.length, pill: true } : undefined}>Verifications</Tabs.Tab>
              <Tabs.Tab value="Sessions" badge={sessions.length ? { content: sessions.length, pill: true } : undefined}>Sessions</Tabs.Tab>
              <Tabs.Tab value="Signals">Signals</Tabs.Tab>
              <Tabs.Tab value="Reports" badge={reports.length ? { content: reports.length, pill: true } : undefined}>Reports</Tabs.Tab>
              <Tabs.Tab value="List Matches" badge={totalMatches > 0 ? { content: totalMatches, pill: true } : undefined}>List Matches</Tabs.Tab>
            </Tabs>
          </div>

          {/* Tab content */}
          <div className="flex-1 overflow-auto px-4 py-6 md:px-6">
            {activeTab === "Overview" && (
              <OverviewTab
                inquiry={inquiry}
                verifications={verifications}
                sessions={sessions}
                signals={featuredSignals}
                behavioralRisk={behavioralRisk}
              />
            )}
            {activeTab === "Verifications" && (
              <VerificationsTab verifications={verifications} />
            )}
            {activeTab === "Sessions" && <SessionsTab sessions={sessions} />}
            {activeTab === "Signals" && <SignalsTab signals={signals} />}
            {activeTab === "Reports" && <ReportsTab reports={reports} />}
            {activeTab === "List Matches" && (
              <ListMatchesTab reports={reports} />
            )}
          </div>
        </div>

        {/* Right sidebar */}
        <DetailPageSidebar
          infoRows={
            <>
              <InfoRow label="Inquiry ID" copyValue={inquiry.id} mono>
                {inquiry.id}
              </InfoRow>
              <InfoRow label="Reference ID" copyValue={inquiry.referenceId} mono={!!inquiry.referenceId}>
                {inquiry.referenceId ?? (
                  <span className="text-[var(--color-text-tertiary)]">—</span>
                )}
              </InfoRow>
              <InfoRow label="Account ID" copyValue={inquiry.accountId} mono>
                <Link
                  href={`/accounts/${inquiry.accountId}`}
                  className="text-[var(--color-primary-solid-bg)] hover:underline"
                >
                  {inquiry.accountId}
                </Link>
              </InfoRow>
              <InfoRow label="Created At">
                {formatDateTime(inquiry.createdAt)} UTC
              </InfoRow>
              <InfoRow label="Template">
                <span className="text-[var(--color-primary-solid-bg)]">
                  {inquiry.templateName}
                </span>
              </InfoRow>
              <InfoRow label="Status">
                <div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={inquiry.status} />
                  </div>
                  {inquiry.status !== "created" && inquiry.status !== "pending" && (
                    <p className="mt-1 text-sm text-[var(--color-text-tertiary)]">
                      by Workflow: {inquiry.templateName}
                    </p>
                  )}
                </div>
              </InfoRow>
              <InfoRow label="Notes">
                <span className="text-[var(--color-text-tertiary)]">—</span>
              </InfoRow>
            </>
          }
          tags={tags}
          onEditTags={() => setTagModalOpen(true)}
          events={events}
        />
      </div>

      {/* Tag Edit Modal */}
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
