"use client";

import { useState } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { SectionHeading } from "@/components/shared";
import { Button } from "@plexui/ui/components/Button";
import { Badge } from "@plexui/ui/components/Badge";

interface BillingHistoryItem {
  id: string;
  date: string;
  description: string;
  amount: string;
  status: "paid" | "pending" | "failed";
}

const usageItems = [
  { label: "Verifications", used: 2451, limit: 5000 },
  { label: "Inquiries", used: 847, limit: 2000 },
  { label: "Reports", used: 156, limit: 500 },
];

const billingHistory: BillingHistoryItem[] = [
  {
    id: "inv_001",
    date: "2026-02-01",
    description: "Growth Plan - Monthly",
    amount: "$499.00",
    status: "paid",
  },
  {
    id: "inv_002",
    date: "2026-01-01",
    description: "Growth Plan - Monthly",
    amount: "$499.00",
    status: "paid",
  },
  {
    id: "inv_003",
    date: "2025-12-01",
    description: "Growth Plan - Monthly",
    amount: "$499.00",
    status: "paid",
  },
  {
    id: "inv_004",
    date: "2025-11-01",
    description: "Growth Plan - Monthly",
    amount: "$499.00",
    status: "paid",
  },
];

export default function BillingPage() {
  const [upgradeState, setUpgradeState] = useState<"idle" | "loading" | "done">("idle");

  const handleUpgrade = () => {
    setUpgradeState("loading");
    setTimeout(() => {
      setUpgradeState("done");
      setTimeout(() => setUpgradeState("idle"), 1500);
    }, 600);
  };

  return (
    <div className="flex h-full flex-col overflow-auto">
      <TopBar title="Billing" />
      <div className="mx-auto w-full max-w-2xl px-4 py-8 md:px-6">
        {/* Current Plan */}
        <SectionHeading size="xs">Current Plan</SectionHeading>
        <div className="rounded-lg border border-[var(--color-border)] p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="heading-sm">Growth</span>
            <Badge color="success" variant="soft" size="sm">
              Active
            </Badge>
          </div>
          <p className="text-sm text-[var(--color-text-secondary)] mb-3">
            $499/month · Billed monthly
          </p>
          <div className="flex gap-2">
            <Button
              color="primary"
              variant="outline"
              size="sm"
              pill={false}
              onClick={handleUpgrade}
              loading={upgradeState === "loading"}
            >
              {upgradeState === "done" ? "Request sent!" : "Upgrade Plan"}
            </Button>
            <Button
              color="secondary"
              variant="soft"
              size="sm"
              pill={false}
            >
              View Plans
            </Button>
          </div>
        </div>

        {/* Usage This Month */}
        <SectionHeading size="xs">Usage This Month</SectionHeading>
        <div className="space-y-4 mb-6">
          {usageItems.map((item) => (
            <div key={item.label}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">{item.label}</span>
                <span className="text-sm text-[var(--color-text-secondary)]">
                  {item.used} / {item.limit}
                </span>
              </div>
              <div className="h-2 rounded-full bg-[var(--color-border)]">
                <div
                  className="h-2 rounded-full bg-[var(--color-primary-solid-bg)]"
                  style={{ width: `${(item.used / item.limit) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Payment Method */}
        <SectionHeading size="xs">Payment Method</SectionHeading>
        <div className="rounded-lg border border-[var(--color-border)] p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm font-medium">Visa ending in 4242</p>
              <p className="text-sm text-[var(--color-text-secondary)]">
                Expires 12/27
              </p>
            </div>
          </div>
          <Button
            color="secondary"
            variant="soft"
            size="sm"
            pill={false}
          >
            Update payment method
          </Button>
        </div>

        {/* Billing History */}
        <SectionHeading size="xs">Billing History</SectionHeading>
        <div className="rounded-lg border border-[var(--color-border)] overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
                <th className="px-4 py-3 text-left text-sm font-medium text-[var(--color-text)]">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[var(--color-text)]">
                  Description
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[var(--color-text)]">
                  Amount
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[var(--color-text)]">
                  Status
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-[var(--color-text)]">
                  Invoice
                </th>
              </tr>
            </thead>
            <tbody>
              {billingHistory.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-[var(--color-border)] last:border-b-0"
                >
                  <td className="px-4 py-3 text-sm text-[var(--color-text-secondary)]">
                    {item.date}
                  </td>
                  <td className="px-4 py-3 text-sm text-[var(--color-text)]">
                    {item.description}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-[var(--color-text)]">
                    {item.amount}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <Badge
                      color={item.status === "paid" ? "success" : "secondary"}
                      variant="soft"
                      size="sm"
                    >
                      {item.status.charAt(0).toUpperCase() +
                        item.status.slice(1)}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right text-sm">
                    <Button color="secondary" variant="soft" size="sm" pill={false}>
                      Download
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
