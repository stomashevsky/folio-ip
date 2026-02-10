"use client";

import { TopBar } from "@/components/layout/TopBar";
import { DataTable } from "@/components/shared";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { mockInquiries } from "@/lib/data";
import { formatDateTime, truncateId } from "@/lib/utils/format";
import { useRouter } from "next/navigation";
import type { ColumnDef } from "@tanstack/react-table";
import type { Inquiry } from "@/lib/types";
import { Button } from "@plexui/ui/components/Button";
import { Plus, Download } from "lucide-react";

const columns: ColumnDef<Inquiry, unknown>[] = [
  {
    accessorKey: "accountName",
    header: "Name",
    cell: ({ row }) => (
      <span className="font-medium">{row.original.accountName}</span>
    ),
  },
  {
    accessorKey: "id",
    header: "Inquiry ID",
    cell: ({ row }) => (
      <span className="font-mono text-[var(--color-text-secondary)]">
        {truncateId(row.original.id)}
      </span>
    ),
  },
  {
    accessorKey: "templateName",
    header: "Template",
    cell: ({ row }) => (
      <span className="text-[var(--color-text-secondary)]">
        {row.original.templateName}
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

export default function InquiriesPage() {
  const router = useRouter();

  return (
    <main className="flex-1 overflow-y-auto">
      <TopBar
        title="Inquiries"
        description="All identity verification inquiries"
        actions={
          <div className="flex items-center gap-2">
            <Button color="secondary" variant="outline" size="sm">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button color="primary" size="sm">
              <Plus className="h-4 w-4" />
              Create Inquiry
            </Button>
          </div>
        }
      />
      <div className="px-6 pb-6">
        <DataTable
          data={mockInquiries}
          columns={columns}
          searchPlaceholder="Search by name, ID, or template..."
          searchColumn="accountName"
          onRowClick={(row) => router.push(`/inquiries/${row.id}`)}
          pageSize={10}
        />
      </div>
    </main>
  );
}
