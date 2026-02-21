import Link from "next/link";
import { InlineEmpty, StatusBadge } from "@/components/shared";
import { REPORT_TYPE_LABELS } from "@/lib/constants/report-type-labels";
import { toTitleCase, formatDateTime } from "@/lib/utils/format";
import type { Report } from "@/lib/types";

const thClass =
  "px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-[0.5px] text-[var(--color-text-tertiary)]";

export function ReportsTab({ reports }: { reports: Report[] }) {
  if (reports.length === 0) {
    return <InlineEmpty>No reports linked to this inquiry.</InlineEmpty>;
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
      <table className="-mb-px w-full table-fixed">
        <colgroup>
          <col className="w-[24%]" />
          <col className="w-[20%]" />
          <col className="w-[20%]" />
          <col className="w-[22%]" />
          <col className="w-[14%]" />
        </colgroup>
        <thead>
          <tr className="border-b border-[var(--color-border)]">
            <th className={thClass}>Type</th>
            <th className={thClass}>Subject</th>
            <th className={thClass}>Completed</th>
            <th className={thClass}>Report ID</th>
            <th className={thClass}>Status</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((report) => (
            <tr key={report.id} className="group border-b border-[var(--color-border)]">
              <td className="p-0">
                <Link href={`/reports/${report.id}`} className="block px-4 py-3 text-sm font-medium text-[var(--color-text)] group-hover:bg-[var(--color-surface-secondary)]">
                  {REPORT_TYPE_LABELS[report.type] ?? report.type}
                </Link>
              </td>
              <td className="p-0">
                <Link href={`/reports/${report.id}`} className="block px-4 py-3 text-sm text-[var(--color-text)] group-hover:bg-[var(--color-surface-secondary)]">
                  {toTitleCase(report.primaryInput)}
                </Link>
              </td>
              <td className="p-0">
                <Link href={`/reports/${report.id}`} className="block px-4 py-3 text-sm text-[var(--color-text-secondary)] group-hover:bg-[var(--color-surface-secondary)]">
                  {report.completedAt ? formatDateTime(report.completedAt) : "Pending"}
                </Link>
              </td>
              <td className="p-0">
                <Link href={`/reports/${report.id}`} className="block truncate px-4 py-3 font-mono text-sm text-[var(--color-text-secondary)] group-hover:bg-[var(--color-surface-secondary)]" title={report.id}>
                  {report.id}
                </Link>
              </td>
              <td className="p-0">
                <Link href={`/reports/${report.id}`} className="flex px-4 py-3 group-hover:bg-[var(--color-surface-secondary)]">
                  <StatusBadge
                    status={report.status}
                    label={report.status === "no_matches" ? "No Matches" : undefined}
                  />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
