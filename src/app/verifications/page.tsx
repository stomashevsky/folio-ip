"use client";

import { TopBar } from "@/components/layout/TopBar";
import { DataTable } from "@/components/shared";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { mockVerifications } from "@/lib/data";
import { formatDateTime, truncateId } from "@/lib/utils/format";
import { useRouter } from "next/navigation";
import type { ColumnDef } from "@tanstack/react-table";
import type { Verification } from "@/lib/types";

const columns: ColumnDef<Verification, unknown>[] = [
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => (
      <span className="font-medium capitalize">
        {row.original.type.replace("_", " ")}
      </span>
    ),
  },
  {
    accessorKey: "id",
    header: "Verification ID",
    cell: ({ row }) => (
      <span className="font-mono text-[var(--color-text-secondary)]">
        {truncateId(row.original.id)}
      </span>
    ),
  },
  {
    accessorKey: "inquiryId",
    header: "Inquiry ID",
    cell: ({ row }) => (
      <span className="font-mono text-[var(--color-text-secondary)]">
        {truncateId(row.original.inquiryId)}
      </span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Created at (UTC)",
    cell: ({ row }) => (
      <span className="text-[var(--color-text-secondary)]">
        {formatDateTime(row.original.createdAt)}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
];

export default function VerificationsPage() {
  const router = useRouter();

  return (
    <main className="flex-1 overflow-y-auto">
      <TopBar
        title="Verifications"
        description="All identity verification checks"
      />
      <div className="px-6 pb-6">
        <DataTable
          data={mockVerifications}
          columns={columns}
          searchPlaceholder="Search by type or ID..."
          searchColumn="type"
          onRowClick={(row) => router.push(`/verifications/${row.id}`)}
          pageSize={10}
        />
      </div>
    </main>
  );
}
