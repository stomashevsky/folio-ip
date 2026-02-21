import Link from "next/link";
import { Tooltip } from "@plexui/ui/components/Tooltip";
import { InfoCircle } from "@plexui/ui/components/Icon";
import { InlineEmpty } from "@/components/shared";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatDateTime, formatDuration } from "@/lib/utils/format";
import type { Inquiry } from "@/lib/types";

export function InquiriesTab({ inquiries }: { inquiries: Inquiry[] }) {
  if (inquiries.length === 0) {
    return <InlineEmpty>No inquiries linked to this case.</InlineEmpty>;
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
      <table className="-mb-px w-full table-fixed">
        <colgroup>
          <col className="w-[24%]" />
          <col className="w-[12%]" />
          <col className="w-[14%]" />
          <col className="w-[26%]" />
          <col className="w-[24%]" />
        </colgroup>
        <thead>
          <tr className="border-b border-[var(--color-border)]">
            <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-[0.5px] text-[var(--color-text-tertiary)]">
              Template
            </th>
            <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-[0.5px] text-[var(--color-text-tertiary)]">
              Status
            </th>
            <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-[0.5px] text-[var(--color-text-tertiary)]">
              Duration
            </th>
            <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-[0.5px] text-[var(--color-text-tertiary)]">
              <span className="inline-flex items-center gap-1">
                Inquiry ID
                <Tooltip
                  content="Unique identifier for the inquiry. Click to view inquiry details."
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
              Created at
            </th>
          </tr>
        </thead>
        <tbody>
          {inquiries.map((inquiry) => (
            <tr
              key={inquiry.id}
              className="border-b border-[var(--color-border)] hover:bg-[var(--color-surface-secondary)]"
            >
              <td className="px-4 py-3 text-sm font-medium text-[var(--color-text)]">
                {inquiry.templateName}
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={inquiry.status} />
              </td>
              <td className="px-4 py-3 text-xs text-[var(--color-text-tertiary)]">
                {inquiry.timeToFinish != null
                  ? formatDuration(inquiry.timeToFinish)
                  : "—"}
              </td>
              <td className="max-w-[180px] px-4 py-3">
                <Link
                  href={`/inquiries/${inquiry.id}`}
                  className="block truncate font-mono text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-background-primary-solid)] hover:underline"
                  title={inquiry.id}
                >
                  {inquiry.id}
                </Link>
              </td>
              <td className="px-4 py-3 text-sm text-[var(--color-text)]">
                {formatDateTime(inquiry.createdAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
