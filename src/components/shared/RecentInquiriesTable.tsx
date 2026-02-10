"use client";

import type { Inquiry } from "@/lib/types";
import { StatusBadge } from "./StatusBadge";
import { formatDateTime, truncateId, formatDuration } from "@/lib/utils/format";
import { useRouter } from "next/navigation";

interface RecentInquiriesTableProps {
  data: Inquiry[];
}

export function RecentInquiriesTable({ data }: RecentInquiriesTableProps) {
  const router = useRouter();

  return (
    <div className="overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface-secondary)]">
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)]">
              Name
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)]">
              Inquiry ID
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)]">
              Template
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)]">
              Created at
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)]">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((inquiry) => (
            <tr
              key={inquiry.id}
              className="cursor-pointer border-b border-[var(--color-border)] bg-[var(--color-surface)] transition-colors hover:bg-[var(--color-surface-secondary)]"
              onClick={() => router.push(`/inquiries/${inquiry.id}`)}
            >
              <td className="px-4 py-3 text-sm font-medium text-[var(--color-text)]">
                {inquiry.accountName}
              </td>
              <td className="px-4 py-3 text-sm font-mono text-[var(--color-text-secondary)]">
                {truncateId(inquiry.id)}
              </td>
              <td className="px-4 py-3 text-sm text-[var(--color-text-secondary)]">
                {inquiry.templateName}
              </td>
              <td className="px-4 py-3 text-sm text-[var(--color-text-secondary)]">
                {formatDateTime(inquiry.createdAt)}
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={inquiry.status} />
              </td>
            </tr>
          ))}
          {data.length === 0 && (
            <tr>
              <td
                colSpan={5}
                className="px-4 py-12 text-center text-sm text-[var(--color-text-tertiary)]"
              >
                No inquiries found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
