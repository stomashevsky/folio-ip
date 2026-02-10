"use client";

import type { Inquiry } from "@/lib/types";
import { StatusBadge } from "./StatusBadge";
import { formatDateTime, truncateId } from "@/lib/utils/format";
import { useRouter } from "next/navigation";

interface RecentInquiriesTableProps {
  data: Inquiry[];
}

export function RecentInquiriesTable({ data }: RecentInquiriesTableProps) {
  const router = useRouter();

  return (
    <div className="overflow-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="py-1.5 pr-2 text-left text-xs font-semibold uppercase tracking-[0.5px] text-[var(--color-text)]">
              Name
            </th>
            <th className="py-1.5 pr-2 text-left text-xs font-semibold uppercase tracking-[0.5px] text-[var(--color-text)]">
              Inquiry ID
            </th>
            <th className="py-1.5 pr-2 text-left text-xs font-semibold uppercase tracking-[0.5px] text-[var(--color-text)]">
              Template
            </th>
            <th className="py-1.5 pr-2 text-left text-xs font-semibold uppercase tracking-[0.5px] text-[var(--color-text)]">
              Created at
            </th>
            <th className="py-1.5 pr-2 text-left text-xs font-semibold uppercase tracking-[0.5px] text-[var(--color-text)]">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((inquiry) => (
            <tr
              key={inquiry.id}
              className="cursor-pointer border-t border-[var(--color-border)] transition-colors hover:bg-[var(--color-surface-secondary)]"
              onClick={() => router.push(`/inquiries/${inquiry.id}`)}
            >
              <td className="py-2 pr-2 align-middle text-sm font-medium text-[var(--color-text)]">
                {inquiry.accountName}
              </td>
              <td className="py-2 pr-2 align-middle font-mono text-sm text-[var(--color-text-secondary)]">
                {truncateId(inquiry.id)}
              </td>
              <td className="py-2 pr-2 align-middle text-sm text-[var(--color-text-secondary)]">
                {inquiry.templateName}
              </td>
              <td className="py-2 pr-2 align-middle text-sm text-[var(--color-text-secondary)]">
                {formatDateTime(inquiry.createdAt)}
              </td>
              <td className="py-2 pr-2 align-middle">
                <StatusBadge status={inquiry.status} />
              </td>
            </tr>
          ))}
          {data.length === 0 && (
            <tr>
              <td
                colSpan={5}
                className="py-12 text-center text-sm text-[var(--color-text-tertiary)]"
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
