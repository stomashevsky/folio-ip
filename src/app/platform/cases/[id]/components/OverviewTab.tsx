"use client";

import Link from "next/link";
import { Badge } from "@plexui/ui/components/Badge";
import { SectionHeading, KeyValueTable } from "@/components/shared";
import { StatusBadge } from "@/components/shared/StatusBadge";
import type { Case } from "@/lib/types";

const PRIORITY_COLORS: Record<string, "danger" | "warning" | "secondary"> = {
  critical: "danger",
  high: "warning",
  medium: "secondary",
  low: "secondary",
};

function getSlaProgress(caseItem: Case) {
  const created = new Date(caseItem.createdAt).getTime();
  const now = caseItem.resolvedAt
    ? new Date(caseItem.resolvedAt).getTime()
    : Date.now();
  const slaMs = 48 * 60 * 60 * 1000;
  const elapsed = now - created;
  const percent = Math.min(100, Math.round((elapsed / slaMs) * 100));
  const hoursElapsed = Math.round(elapsed / (60 * 60 * 1000));
  return { percent, hoursElapsed, totalHours: 48 };
}

export function OverviewTab({ caseItem }: { caseItem: Case }) {
  const sla = getSlaProgress(caseItem);
  const slaColor =
    sla.percent > 80
      ? "var(--color-danger-solid-bg)"
      : sla.percent > 50
        ? "var(--color-warning-solid-bg)"
        : "var(--color-success-solid-bg)";

  return (
    <div className="space-y-6">
      <div>
        <SectionHeading>Summary</SectionHeading>
        <KeyValueTable
          rows={[
            { label: "Title", value: caseItem.title },
            {
              label: "Priority",
              value: (
                <Badge
                  color={PRIORITY_COLORS[caseItem.priority] ?? "secondary"}
                  size="sm"
                >
                  {caseItem.priority.charAt(0).toUpperCase() +
                    caseItem.priority.slice(1)}
                </Badge>
              ),
            },
            {
              label: "Queue",
              value: caseItem.queue ?? (
                <span className="text-[var(--color-text-tertiary)]">—</span>
              ),
            },
            {
              label: "Assignee",
              value: caseItem.assignee ?? (
                <span className="text-[var(--color-text-tertiary)]">
                  Unassigned
                </span>
              ),
            },
            {
              label: "Status",
              value: <StatusBadge status={caseItem.status} />,
            },
            {
              label: "Description",
              value: caseItem.description ?? (
                <span className="text-[var(--color-text-tertiary)]">—</span>
              ),
            },
          ]}
        />
      </div>

      {(caseItem.accountId || caseItem.inquiryId) && (
        <div>
          <SectionHeading>Linked entities</SectionHeading>
          <div className="grid gap-3 md:grid-cols-2">
            {caseItem.accountId && (
              <Link
                href={`/accounts/${caseItem.accountId}`}
                className="block rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 transition-colors hover:bg-[var(--color-nav-hover-bg)]"
              >
                <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-text-tertiary)]">
                  Account
                </p>
                <p className="mt-1 text-sm font-medium text-[var(--color-text)]">
                  {caseItem.accountName ?? caseItem.accountId}
                </p>
                <p className="mt-0.5 truncate font-mono text-xs text-[var(--color-primary-solid-bg)]">
                  {caseItem.accountId}
                </p>
              </Link>
            )}
            {caseItem.inquiryId && (
              <Link
                href={`/inquiries/${caseItem.inquiryId}`}
                className="block rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 transition-colors hover:bg-[var(--color-nav-hover-bg)]"
              >
                <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-text-tertiary)]">
                  Inquiry
                </p>
                <p className="mt-1 truncate font-mono text-sm text-[var(--color-primary-solid-bg)]">
                  {caseItem.inquiryId}
                </p>
              </Link>
            )}
          </div>
        </div>
      )}

      <div>
        <SectionHeading>SLA</SectionHeading>
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[var(--color-text-secondary)]">
              {sla.hoursElapsed}h of {sla.totalHours}h
            </span>
            <span className="text-sm font-medium text-[var(--color-text)]">
              {sla.percent}%
            </span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--color-border)]">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${sla.percent}%`,
                backgroundColor: slaColor,
              }}
            />
          </div>
          {sla.percent > 80 && (
            <p className="mt-2 text-xs text-[var(--color-danger-soft-text)]">
              SLA deadline approaching
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
