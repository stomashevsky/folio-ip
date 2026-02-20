import Link from "next/link";
import { Tooltip } from "@plexui/ui/components/Tooltip";
import { InfoCircle } from "@plexui/ui/components/Icon";
import { InlineEmpty } from "@/components/shared/InlineEmpty";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatDateTime, toTitleCase } from "@/lib/utils/format";
import type { Report } from "@/lib/types";

interface ReportsTableProps {
  reports: Report[];
  emptyMessage?: string;
}

export function ReportsTable({
  reports,
  emptyMessage = "No reports found.",
}: ReportsTableProps) {
  if (reports.length === 0) {
    return <InlineEmpty>{emptyMessage}</InlineEmpty>;
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
      <table className="-mb-px w-full">
        <thead>
          <tr className="border-b border-[var(--color-border)]">
            <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-[0.5px] text-[var(--color-text-tertiary)]">
              <span className="inline-flex items-center gap-1">
                Primary Input
                <Tooltip
                  content="The name or identifier used as the primary search input for this report"
                  side="top"
                  maxWidth={260}
                >
                  <span className="inline-flex shrink-0 cursor-help items-center text-[var(--color-text-tertiary)]">
                    <InfoCircle style={{ width: 14, height: 14 }} />
                  </span>
                </Tooltip>
              </span>
            </th>
            <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-[0.5px] text-[var(--color-text-tertiary)]">
              Status
            </th>
            <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-[0.5px] text-[var(--color-text-tertiary)]">
              <span className="inline-flex items-center gap-1">
                Report ID
                <Tooltip
                  content="Unique identifier for the report. Click to view report details."
                  side="top"
                  maxWidth={260}
                >
                  <span className="inline-flex shrink-0 cursor-help items-center text-[var(--color-text-tertiary)]">
                    <InfoCircle style={{ width: 14, height: 14 }} />
                  </span>
                </Tooltip>
              </span>
            </th>
            <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-[0.5px] text-[var(--color-text-tertiary)]">
              Last updated at
            </th>
          </tr>
        </thead>
        <tbody>
          {reports.map((r) => {
            const typeLabel =
              r.type === "pep"
                ? "Politically Exposed Person Report"
                : r.type === "watchlist"
                  ? "Watchlist Report"
                  : "Adverse Media Report";
            return (
              <tr
                key={r.id}
                className="border-b border-[var(--color-border)] hover:bg-[var(--color-surface-secondary)]"
              >
                <td className="px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-[var(--color-text)]">
                      {toTitleCase(r.primaryInput)}
                    </p>
                    <p className="mt-0.5 text-xs text-[var(--color-text-tertiary)]">
                      {typeLabel}
                    </p>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <StatusBadge
                    status={r.status}
                    label={r.status === "no_matches" ? "No Matches" : undefined}
                  />
                </td>
                <td className="max-w-[180px] px-4 py-3">
                  <Link
                    href={`/reports/${r.id}`}
                    className="block truncate font-mono text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary-solid-bg)] hover:underline"
                    title={r.id}
                  >
                    {r.id}
                  </Link>
                </td>
                <td className="px-4 py-3 text-sm text-[var(--color-text)]">
                  {r.completedAt ? formatDateTime(r.completedAt) : "—"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
