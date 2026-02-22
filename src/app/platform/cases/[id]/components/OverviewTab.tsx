"use client";

import Link from "next/link";
import { Badge, type BadgeProps } from "@plexui/ui/components/Badge";
import { SectionHeading, KeyValueTable } from "@/components/shared";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { getPriorityColor } from "@/lib/utils/format";
import { mockCases } from "@/lib/data";
import type { Case } from "@/lib/types";



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

export function OverviewTab({
  caseItem,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  inquiriesCount,
  verificationsCount,
  reportsCount,
}: {
  caseItem: Case;
  inquiriesCount: number;
  verificationsCount: number;
  reportsCount: number;
}) {
  const sla = getSlaProgress(caseItem);
  const slaColor =
    sla.percent > 80
      ? "var(--color-background-danger-solid)"
      : sla.percent > 50
        ? "var(--color-background-warning-solid)"
        : "var(--color-background-success-solid)";

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
                <Badge pill color={getPriorityColor(caseItem.priority) as BadgeProps["color"]}
                variant="soft"
                size="sm">{caseItem.priority.charAt(0).toUpperCase() +
                  caseItem.priority.slice(1)}</Badge>
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

       <div>
         <SectionHeading>Linked entities</SectionHeading>
         <KeyValueTable
           rows={[
             ...(caseItem.accountId
               ? [
                   {
                     label: "Account",
                     value: (
                       <Link
                         href={`/accounts/${caseItem.accountId}`}
                         className="truncate font-mono text-sm text-[var(--color-background-primary-solid)] hover:underline"
                       >
                         {caseItem.accountId}
                       </Link>
                     ),
                   },
                 ]
               : []),
            ...(caseItem.inquiryId
              ? [
                  {
                    label: "Inquiry",
                    value: (
                      <Link
                        href={`/inquiries/${caseItem.inquiryId}`}
                        className="truncate font-mono text-sm text-[var(--color-background-primary-solid)] hover:underline"
                      >
                        {caseItem.inquiryId}
                      </Link>
                    ),
                  },
                ]
              : []),
            {
              label: "Verifications",
              value: (
                <span className="text-sm text-[var(--color-text-secondary)]">
                  {verificationsCount} linked
                </span>
              ),
            },
            {
              label: "Reports",
              value: (
                <span className="text-sm text-[var(--color-text-secondary)]">
                  {reportsCount} linked
                </span>
              ),
            },
          ]}
        />
      </div>

      {caseItem.accountId && (() => {
        const relatedCases = mockCases.filter(
          (c) => c.accountId === caseItem.accountId && c.id !== caseItem.id,
        );
        return relatedCases.length > 0 ? (
           <div>
             <SectionHeading badge={relatedCases.length}>Related cases</SectionHeading>
             <div className="overflow-x-auto rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
               <table className="-mb-px w-full table-fixed">
                 <colgroup>
                   <col className="w-[30%]" />
                   <col className="w-[30%]" />
                   <col className="w-[20%]" />
                   <col className="w-[20%]" />
                 </colgroup>
                 <thead>
                   <tr className="border-b border-[var(--color-border)]">
                     <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-[0.5px] text-[var(--color-text-tertiary)]">Title</th>
                     <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-[0.5px] text-[var(--color-text-tertiary)]">Case ID</th>
                     <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-[0.5px] text-[var(--color-text-tertiary)]">Status</th>
                     <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-[0.5px] text-[var(--color-text-tertiary)]">Priority</th>
                   </tr>
                 </thead>
                 <tbody>
                   {relatedCases.map((rc) => (
                     <tr key={rc.id} className="border-b border-[var(--color-border)] hover:bg-[var(--color-surface-secondary)]">
                       <td className="px-4 py-3">
                         <Link href={`/platform/cases/${rc.id}`} className="text-sm font-medium text-[var(--color-text)] hover:text-[var(--color-background-primary-solid)] hover:underline">
                           {rc.title}
                         </Link>
                       </td>
                       <td className="px-4 py-3">
                         <p className="truncate font-mono text-xs text-[var(--color-text-tertiary)]">{rc.id}</p>
                       </td>
                       <td className="px-4 py-3"><StatusBadge status={rc.status} /></td>
                       <td className="px-4 py-3">
                         <Badge pill color={getPriorityColor(rc.priority) as BadgeProps["color"]} variant="soft" size="sm">{rc.priority.charAt(0).toUpperCase() + rc.priority.slice(1)}</Badge>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
           </div>
        ) : null;
      })()}

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
            <p className="mt-2 text-xs text-[var(--color-text-danger-soft)]">
              SLA deadline approaching
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
