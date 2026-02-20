"use client";

import { useMemo } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { SummaryCard, SectionHeading } from "@/components/shared";
import { mockTransactions } from "@/lib/data";
import { Badge } from "@plexui/ui/components/Badge";

export default function TransactionAnalyticsPage() {
  const stats = useMemo(() => {
    const total = mockTransactions.length;
    const totalVolume = mockTransactions.reduce((sum, txn) => sum + txn.amount, 0);
    const avgAmount = total > 0 ? totalVolume / total : 0;
    const flaggedCount = mockTransactions.filter((txn) => txn.status === "flagged").length;
    const flaggedRate = total > 0 ? (flaggedCount / total) * 100 : 0;

    const statusBreakdown = mockTransactions.reduce(
      (acc, txn) => {
        const existing = acc.find((s) => s.status === txn.status);
        if (existing) {
          existing.count += 1;
        } else {
          acc.push({ status: txn.status, count: 1 });
        }
        return acc;
      },
      [] as Array<{ status: string; count: number }>
    );

    const typeBreakdown = mockTransactions.reduce(
      (acc, txn) => {
        const existing = acc.find((t) => t.type === txn.type);
        if (existing) {
          existing.count += 1;
          existing.totalAmount += txn.amount;
        } else {
          acc.push({ type: txn.type, count: 1, totalAmount: txn.amount });
        }
        return acc;
      },
      [] as Array<{ type: string; count: number; totalAmount: number }>
    );

    return {
      total,
      totalVolume,
      avgAmount,
      flaggedRate,
      statusBreakdown,
      typeBreakdown,
    };
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "success";
      case "declined":
        return "danger";
      case "flagged":
        return "danger";
      case "reviewed":
        return "info";
      case "created":
        return "secondary";
      default:
        return "secondary";
    }
  };

  return (
    <div className="flex h-full flex-col overflow-auto">
      <TopBar title="Transaction Analytics" />

      <div className="space-y-6 px-4 py-6 md:px-6">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <SummaryCard label="Total Transactions">
            <span className="text-lg font-semibold">
              {stats.total.toLocaleString()}
            </span>
          </SummaryCard>
          <SummaryCard label="Total Volume">
            <span className="text-lg font-semibold">
              {formatCurrency(stats.totalVolume)}
            </span>
          </SummaryCard>
          <SummaryCard label="Avg Amount">
            <span className="text-lg font-semibold">
              {formatCurrency(stats.avgAmount)}
            </span>
          </SummaryCard>
          <SummaryCard label="Flagged Rate">
            <span className="text-lg font-semibold">
              {stats.flaggedRate.toFixed(1)}%
            </span>
          </SummaryCard>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]">
            <div className="border-b border-[var(--color-border)] px-6 py-4">
              <SectionHeading size="xs">Status Breakdown</SectionHeading>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[var(--color-border)]">
                    <th className="px-6 py-3 text-left text-sm font-medium text-[var(--color-text-secondary)]">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-sm font-medium text-[var(--color-text-secondary)]">
                      Count
                    </th>
                    <th className="px-6 py-3 text-right text-sm font-medium text-[var(--color-text-secondary)]">
                      Percentage
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {stats.statusBreakdown.map((row) => (
                    <tr
                      key={row.status}
                      className="border-b border-[var(--color-border)] last:border-b-0"
                    >
                      <td className="px-6 py-3">
                        <Badge
                          color={getStatusColor(row.status)}
                          variant="soft"
                          size="sm"
                        >
                          {row.status.charAt(0).toUpperCase() +
                            row.status.slice(1)}
                        </Badge>
                      </td>
                      <td className="px-6 py-3 text-right font-medium">
                        {row.count}
                      </td>
                      <td className="px-6 py-3 text-right text-[var(--color-text-secondary)]">
                        {(
                          (row.count / stats.total) *
                          100
                        ).toFixed(1)}
                        %
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Type breakdown */}
          <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]">
            <div className="border-b border-[var(--color-border)] px-6 py-4">
              <SectionHeading size="xs">Type Breakdown</SectionHeading>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[var(--color-border)]">
                    <th className="px-6 py-3 text-left text-sm font-medium text-[var(--color-text-secondary)]">
                      Type
                    </th>
                    <th className="px-6 py-3 text-right text-sm font-medium text-[var(--color-text-secondary)]">
                      Count
                    </th>
                    <th className="px-6 py-3 text-right text-sm font-medium text-[var(--color-text-secondary)]">
                      Total Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {stats.typeBreakdown.map((row) => (
                    <tr
                      key={row.type}
                      className="border-b border-[var(--color-border)] last:border-b-0"
                    >
                      <td className="px-6 py-3 font-medium">
                        {row.type.charAt(0).toUpperCase() + row.type.slice(1)}
                      </td>
                      <td className="px-6 py-3 text-right">
                        {row.count}
                      </td>
                      <td className="px-6 py-3 text-right font-medium">
                        {formatCurrency(row.totalAmount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
