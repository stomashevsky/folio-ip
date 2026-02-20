import Link from "next/link";
import { Badge } from "@plexui/ui/components/Badge";
import { SectionHeading, KeyValueTable } from "@/components/shared";
import type { Transaction } from "@/lib/types";

type RiskLevel = "low" | "medium" | "high";
const levelColors: Record<RiskLevel, "success" | "warning" | "danger"> = {
  low: "success",
  medium: "warning",
  high: "danger",
};

function getRiskFactors(txn: Transaction) {
  const factors: { name: string; level: RiskLevel; description: string }[] = [];
  if (txn.riskScore >= 60) factors.push({ name: "Transaction velocity", level: "high", description: "Multiple transactions in short timeframe" });
  else factors.push({ name: "Transaction velocity", level: "low", description: "Normal transaction frequency" });
  if (txn.amount > 5000) factors.push({ name: "Amount threshold", level: "medium", description: `Above $5,000 single transaction limit` });
  else factors.push({ name: "Amount threshold", level: "low", description: "Within normal range" });
  factors.push({ name: "Geographic risk", level: txn.riskScore > 70 ? "high" : "low", description: txn.riskScore > 70 ? "High-risk jurisdiction detected" : "Known jurisdiction" });
  factors.push({ name: "Account age", level: "low", description: "Account older than 6 months" });
  if (txn.riskScore >= 50) factors.push({ name: "Pattern deviation", level: "medium", description: "Unusual transaction time or amount" });
  return factors;
}

export function OverviewTab({ transaction }: { transaction: Transaction }) {
  const formattedAmount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: transaction.currency,
  }).format(transaction.amount);

  const riskFactors = getRiskFactors(transaction);

  return (
    <div className="space-y-6">
      <div>
        <SectionHeading>Summary</SectionHeading>
        <KeyValueTable
          rows={[
            {
              label: "Type",
              value: (
                <Badge color="secondary" variant="soft" size="sm" pill>
                  {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                </Badge>
              ),
            },
            { label: "Amount", value: <span className="font-medium">{formattedAmount}</span> },
            { label: "Currency", value: transaction.currency },
            {
              label: "Risk Score",
              value: (
                <div className="flex items-center gap-2">
                  <div className="h-2 w-24 overflow-hidden rounded-full bg-[var(--color-border)]">
                    <div
                      className="h-full rounded-full bg-[var(--color-danger-solid-bg)]"
                      style={{ width: `${transaction.riskScore}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium">{transaction.riskScore}%</span>
                </div>
              ),
            },
            ...(transaction.description ? [{ label: "Description", value: transaction.description }] : []),
          ]}
        />
      </div>

      <div>
        <SectionHeading>Risk factors</SectionHeading>
        <div className="overflow-x-auto rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--color-border)]">
                <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-[0.5px] text-[var(--color-text-tertiary)]">Factor</th>
                <th className="w-24 px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-[0.5px] text-[var(--color-text-tertiary)]">Risk</th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-[0.5px] text-[var(--color-text-tertiary)]">Details</th>
              </tr>
            </thead>
            <tbody>
              {riskFactors.map((f) => (
                <tr key={f.name} className="border-b border-[var(--color-border)] last:border-b-0">
                  <td className="px-4 py-3 text-sm font-medium text-[var(--color-text)]">{f.name}</td>
                  <td className="px-4 py-3">
                    <Badge color={levelColors[f.level]} size="sm">{f.level.charAt(0).toUpperCase() + f.level.slice(1)}</Badge>
                  </td>
                  <td className="px-4 py-3 text-sm text-[var(--color-text-secondary)]">{f.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <SectionHeading>Parties</SectionHeading>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-text-tertiary)]">Sender</p>
            <p className="mt-2 text-sm font-medium text-[var(--color-text)]">{transaction.accountName}</p>
            <Link
              href={`/accounts/${transaction.accountId}`}
              className="mt-1 block truncate font-mono text-xs text-[var(--color-primary-solid-bg)] hover:underline"
            >
              {transaction.accountId}
            </Link>
            <p className="mt-1 text-xs text-[var(--color-text-tertiary)]">United States</p>
          </div>
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-text-tertiary)]">Receiver</p>
            <p className="mt-2 text-sm font-medium text-[var(--color-text)]">External Payee</p>
            <p className="mt-1 font-mono text-xs text-[var(--color-text-secondary)]">ext_recipient_001</p>
            <p className="mt-1 text-xs text-[var(--color-text-tertiary)]">United Kingdom</p>
          </div>
        </div>
      </div>
    </div>
  );
}
