"use client";

import { TopBar } from "@/components/layout/TopBar";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { NotFoundPage, TagEditModal, InfoRow, DetailPageSidebar, InlineEmpty } from "@/components/shared";
import { mockTransactions } from "@/lib/data";
import { formatDateTime } from "@/lib/utils/format";
import { getAllKnownTags } from "@/lib/utils/tags";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Suspense, useState } from "react";
import { useTabParam } from "@/lib/hooks/useTabParam";
import { Button } from "@plexui/ui/components/Button";
import { Tabs } from "@plexui/ui/components/Tabs";
import { Badge } from "@plexui/ui/components/Badge";
import { DotsHorizontal } from "@plexui/ui/components/Icon";
import { Menu } from "@plexui/ui/components/Menu";

const tabs = ["Overview", "Activity"] as const;
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

  const transactionTypeColor = {
    payment: "secondary",
    withdrawal: "warning",
    transfer: "info",
    deposit: "success",
    refund: "discovery",
  } as const;

  const formattedAmount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: transaction.currency,
  }).format(transaction.amount);

  return (
    <div className="flex h-full flex-col">
      <TopBar
        title="Transaction"
        backHref="/transactions"
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
                <Menu.Item onSelect={() => {}}>Flag</Menu.Item>
                <Menu.Separator />
                <Menu.Item onSelect={() => {}} className="text-[var(--color-text-danger-ghost)]">Delete</Menu.Item>
              </Menu.Content>
            </Menu>
            <Button color="primary" size="md" pill={false}>Review</Button>
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
              <Tabs.Tab value="Activity">Activity</Tabs.Tab>
            </Tabs>
          </div>

          <div className="flex-1 overflow-auto px-4 py-6 md:px-6">
            {activeTab === "Overview" && (
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-sm text-[var(--color-text-secondary)]">Type</p>
                    <div className="mt-2">
                      <Badge
                        color={transactionTypeColor[transaction.type]}
                        variant="soft"
                        size="md"
                        pill
                      >
                        {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-[var(--color-text-secondary)]">Amount</p>
                    <p className="mt-2 text-lg font-semibold">{formattedAmount}</p>
                  </div>

                  <div>
                    <p className="text-sm text-[var(--color-text-secondary)]">Risk Score</p>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-[var(--color-border)]">
                        <div
                          className="h-full bg-[var(--color-danger-solid-bg)]"
                          style={{ width: `${transaction.riskScore}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{transaction.riskScore}%</span>
                    </div>
                  </div>
                </div>

                {transaction.description && (
                  <div>
                    <p className="text-sm text-[var(--color-text-secondary)]">Description</p>
                    <p className="mt-2 text-sm">{transaction.description}</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "Activity" && (
              <InlineEmpty>No activity yet.</InlineEmpty>
            )}
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
                {formattedAmount}
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
