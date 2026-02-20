"use client";

import { TopBar, TOPBAR_CONTROL_SIZE, TOPBAR_ACTION_PILL } from "@/components/layout/TopBar";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { NotFoundPage, TagEditModal, InfoRow, DetailPageSidebar } from "@/components/shared";
import { mockTransactions } from "@/lib/data";
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
import { OverviewTab, RelatedTab, LabelsTab, ActivityTab } from "./components";

const tabs = ["Overview", "Related", "Labels", "Activity"] as const;
type Tab = (typeof tabs)[number];

export default function TransactionDetailPage() {
  return (
    <Suspense fallback={null}>
      <TransactionDetailContent />
    </Suspense>
  );
}

function TransactionDetailContent() {
  const params = useParams();
  const [activeTab, setActiveTab] = useTabParam(tabs, "Overview");

  const transaction = mockTransactions.find((t) => t.id === params.id);
  const [tags, setTags] = useState<string[]>(() => transaction?.tags ?? []);
  const [tagModalOpen, setTagModalOpen] = useState(false);
  const allKnownTags = getAllKnownTags();

  if (!transaction) {
    return (
      <NotFoundPage
        section="Transactions"
        backHref="/transactions"
        entity="Transaction"
      />
    );
  }

  return (
    <div className="flex h-full flex-col">
      <TopBar
        title="Transaction"
        backHref="/transactions"
        actions={
          <div className="flex items-center gap-2">
            <Menu>
              <Menu.Trigger>
                <Button color="secondary" variant="soft" size={TOPBAR_CONTROL_SIZE} pill={TOPBAR_ACTION_PILL}>
                  <DotsHorizontal />
                </Button>
              </Menu.Trigger>
              <Menu.Content align="end" minWidth="auto">
                <Menu.Item onSelect={() => {}}>Approve</Menu.Item>
                <Menu.Item onSelect={() => {}}>Decline</Menu.Item>
                <Menu.Item onSelect={() => {}}>Flag</Menu.Item>
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
              aria-label="Transaction sections"
              size="lg"
            >
              <Tabs.Tab value="Overview">Overview</Tabs.Tab>
              <Tabs.Tab value="Related">Related</Tabs.Tab>
              <Tabs.Tab value="Labels">Labels</Tabs.Tab>
              <Tabs.Tab value="Activity">Activity</Tabs.Tab>
            </Tabs>
          </div>

          <div className="flex-1 overflow-auto px-4 py-6 md:px-6">
            {activeTab === "Overview" && <OverviewTab transaction={transaction} />}
            {activeTab === "Related" && <RelatedTab transaction={transaction} />}
            {activeTab === "Labels" && <LabelsTab tags={tags} onEditTags={() => setTagModalOpen(true)} />}
            {activeTab === "Activity" && <ActivityTab transaction={transaction} />}
          </div>
        </div>

        <DetailPageSidebar
          infoRows={
            <>
              <InfoRow label="Transaction ID" copyValue={transaction.id} mono>
                {transaction.id}
              </InfoRow>
              <InfoRow label="Account ID" copyValue={transaction.accountId} mono>
                <Link
                  href={`/accounts/${transaction.accountId}`}
                  className="text-[var(--color-primary-solid-bg)] hover:underline"
                >
                  {transaction.accountId}
                </Link>
              </InfoRow>
              <InfoRow label="Account Name">
                {transaction.accountName}
              </InfoRow>
              <InfoRow label="Status">
                <div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={transaction.status} />
                  </div>
                </div>
              </InfoRow>
              <InfoRow label="Type">
                <span className="capitalize">{transaction.type}</span>
              </InfoRow>
              <InfoRow label="Amount">
                {new Intl.NumberFormat("en-US", { style: "currency", currency: transaction.currency }).format(transaction.amount)}
              </InfoRow>
              <InfoRow label="Currency">
                {transaction.currency}
              </InfoRow>
              <InfoRow label="Risk Score">
                <span>{transaction.riskScore}%</span>
              </InfoRow>
              <InfoRow label="Created At">
                {formatDateTime(transaction.createdAt)} UTC
              </InfoRow>
              {transaction.reviewedAt && (
                <InfoRow label="Reviewed At">
                  {formatDateTime(transaction.reviewedAt)} UTC
                </InfoRow>
              )}
              {transaction.reviewedBy && (
                <InfoRow label="Reviewed By">
                  {transaction.reviewedBy}
                </InfoRow>
              )}
            </>
          }
          tags={tags}
          onEditTags={() => setTagModalOpen(true)}
          events={[]}
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
