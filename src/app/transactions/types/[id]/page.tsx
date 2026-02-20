"use client";

import { useParams } from "next/navigation";
import { TopBar, TOPBAR_CONTROL_SIZE, TOPBAR_ACTION_PILL } from "@/components/layout/TopBar";
import { NotFoundPage, SectionHeading } from "@/components/shared";
import { Badge } from "@plexui/ui/components/Badge";
import { Button } from "@plexui/ui/components/Button";
import { Input } from "@plexui/ui/components/Input";
import { Textarea } from "@plexui/ui/components/Textarea";
import { Field } from "@plexui/ui/components/Field";
import { Switch } from "@plexui/ui/components/Switch";
import { Select } from "@plexui/ui/components/Select";

interface TransactionTypeConfig {
  id: string;
  name: string;
  description: string;
  riskLevel: "low" | "medium" | "high";
  requiresReview: boolean;
  autoApproveThreshold: number;
  createdAt: string;
  updatedAt: string;
}

const RISK_LEVEL_OPTIONS = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

const RISK_COLORS: Record<string, "success" | "warning" | "danger"> = {
  low: "success",
  medium: "warning",
  high: "danger",
};

const MOCK_TRANSACTION_TYPES: TransactionTypeConfig[] = [
  { id: "txtype_1", name: "Payment", description: "Standard payment transactions", riskLevel: "low", requiresReview: false, autoApproveThreshold: 5000, createdAt: "2025-12-01T10:00:00Z", updatedAt: "2025-12-15T14:30:00Z" },
  { id: "txtype_2", name: "Withdrawal", description: "Cash withdrawal from account", riskLevel: "medium", requiresReview: true, autoApproveThreshold: 2000, createdAt: "2025-12-02T11:00:00Z", updatedAt: "2025-12-16T09:15:00Z" },
  { id: "txtype_3", name: "Transfer", description: "Inter-account or international transfer", riskLevel: "high", requiresReview: true, autoApproveThreshold: 1000, createdAt: "2025-12-03T12:00:00Z", updatedAt: "2025-12-17T16:45:00Z" },
  { id: "txtype_4", name: "Deposit", description: "Account deposit or funding", riskLevel: "low", requiresReview: false, autoApproveThreshold: 10000, createdAt: "2025-12-04T13:00:00Z", updatedAt: "2025-12-18T11:20:00Z" },
  { id: "txtype_5", name: "Refund", description: "Refund or reversal transaction", riskLevel: "medium", requiresReview: true, autoApproveThreshold: 3000, createdAt: "2025-12-05T14:00:00Z", updatedAt: "2025-12-19T13:50:00Z" },
];

export default function TransactionTypeDetailPage() {
  const params = useParams();
  const txType = MOCK_TRANSACTION_TYPES.find((t) => t.id === params.id);

  if (!txType) {
    return <NotFoundPage section="Transaction Types" backHref="/transactions/types" entity="Transaction Type" />;
  }

  return (
    <div className="flex h-full flex-col overflow-auto">
      <TopBar
        title={txType.name}
        backHref="/transactions/types"
        actions={
          <div className="flex items-center gap-2">
            <Badge color={RISK_COLORS[txType.riskLevel]} variant="soft" size="sm">
              {txType.riskLevel.charAt(0).toUpperCase() + txType.riskLevel.slice(1)} Risk
            </Badge>
            <Button color="primary" size={TOPBAR_CONTROL_SIZE} pill={TOPBAR_ACTION_PILL}>
              Save Changes
            </Button>
          </div>
        }
      />

      <div className="mx-auto w-full max-w-2xl px-4 py-8 md:px-6">
        <SectionHeading size="xs">Details</SectionHeading>
        <div className="mt-4 space-y-4">
          <Field label="Name">
            <Input defaultValue={txType.name} size="sm" />
          </Field>
          <Field label="Description">
            <Textarea defaultValue={txType.description} rows={2} />
          </Field>
        </div>

        <div className="mt-10">
          <SectionHeading size="xs">Risk Configuration</SectionHeading>
          <div className="mt-4 space-y-4">
            <Field label="Risk Level" description="Determines the scrutiny level for this transaction type">
              <div className="w-48">
                <Select
                  options={RISK_LEVEL_OPTIONS}
                  value={txType.riskLevel}
                  onChange={() => {}}
                  size="sm"
                />
              </div>
            </Field>
            <Switch
              checked={txType.requiresReview}
              onCheckedChange={() => {}}
              label="Requires manual review"
            />
          </div>
        </div>

        <div className="mt-10">
          <SectionHeading size="xs">Auto-Approval</SectionHeading>
          <div className="mt-4 space-y-4">
            <Field
              label="Auto-Approve Threshold"
              description="Transactions below this amount are automatically approved (USD)"
            >
              <Input
                type="number"
                defaultValue={String(txType.autoApproveThreshold)}
                size="sm"
              />
            </Field>
            <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-secondary)] p-4">
              <p className="text-sm text-[var(--color-text)]">
                Transactions under{" "}
                <span className="font-medium">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                    minimumFractionDigits: 0,
                  }).format(txType.autoApproveThreshold)}
                </span>{" "}
                will be {txType.requiresReview ? "queued for review" : "automatically approved"}.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
