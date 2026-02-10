"use client";

import { TopBar } from "@/components/layout/TopBar";
import { DataTable } from "@/components/shared";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { mockAccounts } from "@/lib/data";
import { formatDateTime, truncateId } from "@/lib/utils/format";
import { useRouter } from "next/navigation";
import type { ColumnDef } from "@tanstack/react-table";
import type { Account } from "@/lib/types";

const columns: ColumnDef<Account, unknown>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-primary-soft-bg)] text-xs font-semibold text-[var(--color-primary-soft-text)]">
          {row.original.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .slice(0, 2)}
        </div>
        <span className="font-medium">{row.original.name}</span>
      </div>
    ),
  },
  {
    accessorKey: "id",
    header: "Account ID",
    cell: ({ row }) => (
      <span className="font-mono text-[var(--color-text-secondary)]">
        {truncateId(row.original.id)}
      </span>
    ),
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => (
      <span className="text-[var(--color-text-secondary)]">
        {row.original.type}
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

export default function AccountsPage() {
  const router = useRouter();

  return (
    <main className="flex-1 overflow-y-auto">
      <TopBar
        title="Accounts"
        description="All identity accounts"
      />
      <div className="px-6 pb-6">
        <DataTable
          data={mockAccounts}
          columns={columns}
          searchPlaceholder="Search by name or ID..."
          searchColumn="name"
          onRowClick={(row) => router.push(`/accounts/${row.id}`)}
          pageSize={10}
        />
      </div>
    </main>
  );
}
