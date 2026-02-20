"use client";

import Link from "next/link";
import { SectionHeading, InlineEmpty, KeyValueTable } from "@/components/shared";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { mockTransactions } from "@/lib/data";
import { formatDateTime } from "@/lib/utils/format";
import type { Transaction } from "@/lib/types";

export function RelatedTab({ transaction }: { transaction: Transaction }) {
  const otherTransactions = mockTransactions.filter(
    (t) => t.accountId === transaction.accountId && t.id !== transaction.id
  );

  const formattedAmount = (txn: Transaction) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: txn.currency,
    }).format(txn.amount);

  return (
    <div className="space-y-6">
      <div>
        <SectionHeading>Linked account</SectionHeading>
        <KeyValueTable
          labelWidth="w-1/4"
          rows={[
            {
              label: "Account",
              value: (
                <Link
                  href={`/accounts/${transaction.accountId}`}
                  className="group"
                >
                  <span className="text-sm font-medium text-[var(--color-text)] group-hover:underline">
                    {transaction.accountName}
                  </span>
                  <p className="truncate font-mono text-xs text-[var(--color-text-tertiary)]">
                    {transaction.accountId}
                  </p>
                </Link>
              ),
            },
          ]}
        />
      </div>

      <div>
        <SectionHeading badge={otherTransactions.length}>
          Other transactions
        </SectionHeading>
        {otherTransactions.length > 0 ? (
          <div className="overflow-x-auto rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--color-border)]">
                  <th className="whitespace-nowrap px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-[0.5px] text-[var(--color-text-tertiary)]">
                    ID
                  </th>
                  <th className="whitespace-nowrap px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-[0.5px] text-[var(--color-text-tertiary)]">
                    Type
                  </th>
                  <th className="whitespace-nowrap px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-[0.5px] text-[var(--color-text-tertiary)]">
                    Amount
                  </th>
                  <th className="whitespace-nowrap px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-[0.5px] text-[var(--color-text-tertiary)]">
                    Status
                  </th>
                  <th className="whitespace-nowrap px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-[0.5px] text-[var(--color-text-tertiary)]">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {otherTransactions.map((txn) => (
                  <tr
                    key={txn.id}
                    className="border-b border-[var(--color-border)] last:border-b-0"
                  >
                    <td className="px-4 py-3">
                      <Link
                        href={`/transactions/${txn.id}`}
                        className="truncate font-mono text-sm text-[var(--color-primary-solid-bg)] hover:underline"
                      >
                        {txn.id}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-sm capitalize text-[var(--color-text)]">
                      {txn.type}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-[var(--color-text)]">
                      {formattedAmount(txn)}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={txn.status} />
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-[var(--color-text-secondary)]">
                      {formatDateTime(txn.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <InlineEmpty>No other transactions for this account.</InlineEmpty>
        )}
      </div>
    </div>
  );
}
