"use client";

import { TopBar } from "@/components/layout/TopBar";
import { DataTable } from "@/components/shared";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { mockReports } from "@/lib/data";
import { formatDateTime, truncateId } from "@/lib/utils/format";
import { useRouter } from "next/navigation";
import type { ColumnDef } from "@tanstack/react-table";
import type { Report } from "@/lib/types";
import { Button } from "@plexui/ui/components/Button";
import { Plus, Download } from "lucide-react";

const typeLabels: Record<string, string> = {
  watchlist: "🌐 Watchlist Report",
  pep: "🏛️ Politically Exposed Person",
  adverse_media: "📰 Adverse Media",
};

const columns: ColumnDef<Report, unknown>[] = [
  {
    accessorKey: "primaryInput",
    header: "Primary Input",
    cell: ({ row }) => (
      <span className="font-medium">{row.original.primaryInput}</span>
    ),
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => (
      <span className="text-[var(--color-text-secondary)]">
        {typeLabels[row.original.type] ?? row.original.type}
      </span>
    ),
  },
  {
    accessorKey: "id",
    header: "Report ID",
    cell: ({ row }) => (
      <span className="font-mono text-[var(--color-text-secondary)]">
        {truncateId(row.original.id)}
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

export default function ReportsPage() {
  const router = useRouter();

  return (
    <main className="flex-1 overflow-y-auto">
      <TopBar
        title="Reports"
        description="Watchlist, PEP, and adverse media reports"
        actions={
          <div className="flex items-center gap-2">
            <Button color="secondary" variant="outline" size="sm">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button color="primary" size="sm">
              <Plus className="h-4 w-4" />
              Create Report
            </Button>
          </div>
        }
      />
      <div className="px-6 pb-6">
        <DataTable
          data={mockReports}
          columns={columns}
          searchPlaceholder="Search by name or ID..."
          searchColumn="primaryInput"
          onRowClick={(row) => router.push(`/reports/${row.id}`)}
          pageSize={10}
        />
      </div>
    </main>
  );
}
