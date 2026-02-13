"use client";

import { TopBar } from "@/components/layout/TopBar";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { ChartCard, NotFoundPage, InlineEmpty, DetailInfoList, EntityCard, ActivityItem } from "@/components/shared";
import { mockAccounts, mockInquiries, mockVerifications, mockReports } from "@/lib/data";
import { formatDateTime, formatDate, truncateId } from "@/lib/utils/format";
import { useParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import { useTabParam } from "@/lib/hooks/useTabParam";
import { Avatar } from "@plexui/ui/components/Avatar";
import { Tabs } from "@plexui/ui/components/Tabs";
import {
  FileSearch,
  ShieldCheck,
  FileText,
} from "lucide-react";

const tabs = ["Overview", "Inquiries", "Verifications", "Reports"] as const;
type Tab = (typeof tabs)[number];

export default function AccountDetailPage() {
  return (
    <Suspense>
      <AccountDetailContent />
    </Suspense>
  );
}

function AccountDetailContent() {
  const params = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useTabParam(tabs, "Overview");

  const account = mockAccounts.find((a) => a.id === params.id);
  const accountInquiries = mockInquiries.filter(
    (i) => i.accountId === account?.id
  );
  const accountVerifications = mockVerifications.filter((v) =>
    accountInquiries.some((i) => i.id === v.inquiryId)
  );
  const accountReports = mockReports.filter(
    (r) => r.accountId === account?.id
  );

  if (!account) {
    return <NotFoundPage section="Accounts" backHref="/accounts" entity="Account" />;
  }

  return (
    <div className="flex-1">
      <TopBar
        title="Accounts"
        backHref="/accounts"
      />
      <div className="px-4 pb-6 pt-6 md:px-6">
        {/* Profile Header */}
        <div className="flex items-center gap-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
          <Avatar name={account.name} size={64} color="primary" />
          <div className="flex-1">
            <h2 className="heading-sm text-[var(--color-text)]">
              {account.name}
            </h2>
            <p className="font-mono text-xs text-[var(--color-text-tertiary)]">
              {account.id}
            </p>
            {account.address && (
              <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                {account.address}
              </p>
            )}
          </div>
          <div className="flex items-center gap-4">
            <StatusBadge status={account.status} />
            <div className="flex gap-6 text-center">
              {[
                { value: account.inquiryCount, label: "Inquiries" },
                { value: account.verificationCount, label: "Verifications" },
                { value: account.reportCount, label: "Reports" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="heading-sm text-[var(--color-text)]">
                    {stat.value}
                  </p>
                  <p className="text-xs text-[var(--color-text-tertiary)]">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-6">
          <Tabs
            value={activeTab}
            onChange={(v) => setActiveTab(v as Tab)}
            variant="underline"
            aria-label="Account sections"
            size="md"
          >
            <Tabs.Tab value="Overview">Overview</Tabs.Tab>
            <Tabs.Tab value="Inquiries" badge={accountInquiries.length ? { content: accountInquiries.length, pill: true } : undefined}>Inquiries</Tabs.Tab>
            <Tabs.Tab value="Verifications" badge={accountVerifications.length ? { content: accountVerifications.length, pill: true } : undefined}>Verifications</Tabs.Tab>
            <Tabs.Tab value="Reports" badge={accountReports.length ? { content: accountReports.length, pill: true } : undefined}>Reports</Tabs.Tab>
          </Tabs>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === "Overview" && (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <ChartCard title="Profile">
                <DetailInfoList
                  items={[
                    ["Account ID", account.id],
                    ["Reference ID", account.referenceId ?? "—"],
                    ["Type", account.type],
                    ["Birthdate", account.birthdate ? formatDate(account.birthdate) : "—"],
                    ["Age", account.age ? `${account.age} years` : "—"],
                    ["Address", account.address ?? "—"],
                    ["Created At", formatDateTime(account.createdAt)],
                    ["Updated At", formatDateTime(account.updatedAt)],
                  ]}
                />
              </ChartCard>

              <ChartCard title="Activity Summary">
                <div className="space-y-4">
                  <ActivityItem
                    icon={<FileSearch className="h-5 w-5" />}
                    title={`${accountInquiries.length} Inquiries`}
                    subtitle={`${accountInquiries.filter((i) => i.status === "approved").length} approved`}
                  />
                  <ActivityItem
                    icon={<ShieldCheck className="h-5 w-5" />}
                    title={`${accountVerifications.length} Verifications`}
                    subtitle={`${accountVerifications.filter((v) => v.status === "passed").length} passed`}
                  />
                  <ActivityItem
                    icon={<FileText className="h-5 w-5" />}
                    title={`${accountReports.length} Reports`}
                    subtitle={`${accountReports.filter((r) => r.status === "no_matches").length} clean`}
                  />
                </div>
              </ChartCard>
            </div>
          )}

          {activeTab === "Inquiries" && (
            <div className="space-y-3">
              {accountInquiries.length === 0 ? (
                <InlineEmpty>No inquiries for this account.</InlineEmpty>
              ) : (
                accountInquiries.map((inq) => (
                  <EntityCard
                    key={inq.id}
                    title={inq.templateName}
                    subtitle={`${truncateId(inq.id)} · ${formatDateTime(inq.createdAt)}`}
                    status={inq.status}
                    onClick={() => router.push(`/inquiries/${inq.id}`)}
                  />
                ))
              )}
            </div>
          )}

          {activeTab === "Verifications" && (
            <div className="space-y-3">
              {accountVerifications.length === 0 ? (
                <InlineEmpty>No verifications for this account.</InlineEmpty>
              ) : (
                accountVerifications.map((v) => (
                  <EntityCard
                    key={v.id}
                    title={`${v.type.replace("_", " ")} Verification`}
                    subtitle={`${truncateId(v.id)} · ${formatDateTime(v.createdAt)}`}
                    status={v.status}
                    onClick={() => router.push(`/verifications/${v.id}`)}
                    titleClassName="capitalize"
                  />
                ))
              )}
            </div>
          )}

          {activeTab === "Reports" && (
            <div className="space-y-3">
              {accountReports.length === 0 ? (
                <InlineEmpty>No reports for this account.</InlineEmpty>
              ) : (
                accountReports.map((r) => (
                  <EntityCard
                    key={r.id}
                    title={r.templateName}
                    subtitle={`${truncateId(r.id)} · ${formatDateTime(r.createdAt)}`}
                    status={r.status}
                    onClick={() => router.push(`/reports/${r.id}`)}
                  />
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
