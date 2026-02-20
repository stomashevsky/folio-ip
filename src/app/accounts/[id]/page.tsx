"use client";

import { TopBar, TOPBAR_CONTROL_SIZE, TOPBAR_ACTION_PILL } from "@/components/layout/TopBar";
import { StatusBadge } from "@/components/shared/StatusBadge";
import {
  NotFoundPage,
  TagEditModal,
  InfoRow,
  DetailPageSidebar,
} from "@/components/shared";
import {
  mockAccounts,
  mockInquiries,
  mockVerifications,
  mockReports,
  getEventsForAccount,
} from "@/lib/data";
import { useTabParam } from "@/lib/hooks/useTabParam";
import { formatDateTime } from "@/lib/utils/format";
import { getAllKnownTags } from "@/lib/utils/tags";
import { Button } from "@plexui/ui/components/Button";
import { DotsHorizontal, Plus } from "@plexui/ui/components/Icon";
import { Menu } from "@plexui/ui/components/Menu";
import { Tabs } from "@plexui/ui/components/Tabs";
import { useParams } from "next/navigation";
import { Suspense, useState, type CSSProperties } from "react";
import {
  OverviewTab,
  InquiriesTab,
  VerificationsTab,
  ReportsTab,
  ListMatchesTab,
  DocumentsTab,
  ActivityTab,
} from "./components";

const tabs = ["Overview", "Inquiries", "Verifications", "Reports", "List Matches", "Documents", "Activity"] as const;
type Tab = (typeof tabs)[number];

export default function AccountDetailPage() {
  return (
    <Suspense fallback={null}>
      <AccountDetailContent />
    </Suspense>
  );
}

function AccountDetailContent() {
  const params = useParams();
  const [activeTab, setActiveTab] = useTabParam(tabs, "Overview");

  const account = mockAccounts.find((a) => a.id === params.id);
  const accountInquiries = mockInquiries.filter(
    (inquiry) => inquiry.accountId === account?.id
  );
  const accountVerifications = mockVerifications.filter((verification) =>
    accountInquiries.some((inquiry) => inquiry.id === verification.inquiryId)
  );
  const accountReports = mockReports.filter(
    (report) => report.accountId === account?.id
  );
  const totalMatches = accountReports.reduce((sum, r) => sum + (r.matchCount ?? 0), 0);

  const [tags, setTags] = useState<string[]>(() =>
    Array.from(
      new Set(accountInquiries.flatMap((inquiry) => inquiry.tags))
    ).filter(Boolean)
  );
  const [tagModalOpen, setTagModalOpen] = useState(false);
  const allKnownTags = getAllKnownTags();

  if (!account) {
    return (
      <NotFoundPage
        section="Accounts"
        backHref="/accounts"
        entity="Account"
      />
    );
  }

  const events = getEventsForAccount(account.id);

  return (
    <div className="flex h-full flex-col">
      <TopBar
        title="Account"
        backHref="/accounts"
        actions={
          <div className="flex items-center gap-2">
            <Menu>
              <Menu.Trigger>
                <Button color="secondary" variant="soft" size={TOPBAR_CONTROL_SIZE} pill={TOPBAR_ACTION_PILL}>
                  <DotsHorizontal />
                </Button>
              </Menu.Trigger>
              <Menu.Content align="end" minWidth="auto">
                <Menu.Item onSelect={() => {}}>Suspend account</Menu.Item>
                <Menu.Item onSelect={() => {}}>Close account</Menu.Item>
                <Menu.Separator />
                <Menu.Item onSelect={() => {}}>Archive</Menu.Item>
                <Menu.Separator />
                <Menu.Item onSelect={() => {}} className="text-[var(--color-text-danger-ghost)]">Delete</Menu.Item>
              </Menu.Content>
            </Menu>
            <Button color="primary" size={TOPBAR_CONTROL_SIZE} pill={TOPBAR_ACTION_PILL}>
              <Plus />
              <span className="hidden md:inline">Create inquiry</span>
            </Button>
          </div>
        }
      />

      <div className="flex flex-1 flex-col overflow-auto md:flex-row md:overflow-hidden">
        <div className="flex shrink-0 flex-col md:min-w-0 md:flex-1 md:overflow-auto">
          <div
            className="shrink-0 overflow-x-auto px-4 pt-4 md:px-6"
            style={{ "--color-ring": "transparent" } as CSSProperties}
          >
            <Tabs
              value={activeTab}
              onChange={(value) => setActiveTab(value as Tab)}
              variant="underline"
              aria-label="Account sections"
              size="lg"
            >
              <Tabs.Tab value="Overview">Overview</Tabs.Tab>
              <Tabs.Tab
                value="Inquiries"
                badge={
                  accountInquiries.length
                    ? { content: accountInquiries.length, pill: true }
                    : undefined
                }
              >
                Inquiries
              </Tabs.Tab>
              <Tabs.Tab
                value="Verifications"
                badge={
                  accountVerifications.length
                    ? { content: accountVerifications.length, pill: true }
                    : undefined
                }
              >
                Verifications
              </Tabs.Tab>
              <Tabs.Tab
                value="Reports"
                badge={
                  accountReports.length
                    ? { content: accountReports.length, pill: true }
                    : undefined
                }
              >
                Reports
              </Tabs.Tab>
              <Tabs.Tab
                value="List Matches"
                badge={
                  totalMatches > 0
                    ? { content: totalMatches, pill: true }
                    : undefined
                }
              >
                List Matches
              </Tabs.Tab>
              <Tabs.Tab value="Documents">Documents</Tabs.Tab>
              <Tabs.Tab
                value="Activity"
                badge={
                  events.length
                    ? { content: events.length, pill: true }
                    : undefined
                }
              >
                Activity
              </Tabs.Tab>
            </Tabs>
          </div>

          <div className="flex-1 overflow-auto px-4 py-6 md:px-6">
            {activeTab === "Overview" && (
              <OverviewTab
                account={account}
                inquiries={accountInquiries}
                verifications={accountVerifications}
              />
            )}
            {activeTab === "Inquiries" && (
              <InquiriesTab inquiries={accountInquiries} />
            )}
            {activeTab === "Verifications" && (
              <VerificationsTab verifications={accountVerifications} />
            )}
            {activeTab === "Reports" && (
              <ReportsTab reports={accountReports} />
            )}
            {activeTab === "List Matches" && (
              <ListMatchesTab reports={accountReports} />
            )}
            {activeTab === "Documents" && (
              <DocumentsTab verifications={accountVerifications} />
            )}
            {activeTab === "Activity" && (
              <ActivityTab events={events} />
            )}
          </div>
        </div>

        <DetailPageSidebar
          infoRows={
            <>
              <InfoRow label="Account Type">{account.type}</InfoRow>
              <InfoRow label="Account ID" copyValue={account.id} mono>
                {account.id}
              </InfoRow>
              <InfoRow
                label="Reference ID"
                copyValue={account.referenceId ?? undefined}
                mono={!!account.referenceId}
              >
                {account.referenceId ?? (
                  <span className="text-[var(--color-text-tertiary)]">
                    No reference ID
                  </span>
                )}
              </InfoRow>
              <InfoRow label="Status">
                <StatusBadge status={account.status} />
              </InfoRow>
              <InfoRow label="Created at">
                {formatDateTime(account.createdAt)} UTC
              </InfoRow>
              <InfoRow label="Last updated at">
                {formatDateTime(account.updatedAt)} UTC
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
