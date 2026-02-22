"use client";

import { useState, useMemo } from "react";
import { TopBar, TOPBAR_CONTROL_SIZE, TOPBAR_TOOLBAR_PILL } from "@/components/layout/TopBar";
import { TABLE_PAGE_WRAPPER, TABLE_PAGE_CONTENT } from "@/lib/constants/page-layout";
import { DataTable, TableSearch, SummaryCard } from "@/components/shared";
import { ColumnSettings, type ColumnConfig } from "@/components/shared/ColumnSettings";
import { dateTimeCell } from "@/lib/utils/columnHelpers";
import type { ColumnDef, VisibilityState } from "@tanstack/react-table";
import { Badge, type BadgeProps } from "@plexui/ui/components/Badge";
import { getDataOpStatusColor } from "@/lib/utils/format";
import { Select } from "@plexui/ui/components/Select";
import { Button } from "@plexui/ui/components/Button";

interface ActivityRecord {
  id: string;
  action: "import" | "export";
  type: string;
  recordCount: number;
  status: "completed" | "processing" | "failed";
  createdAt: string;
  createdBy: string;
}

const mockActivity: ActivityRecord[] = [
  { id: "act_001", action: "import", type: "CSV Upload", recordCount: 15234, status: "completed", createdAt: "2025-02-20T14:30:00Z", createdBy: "John Smith" },
  { id: "act_002", action: "export", type: "Report Export", recordCount: 8456, status: "completed", createdAt: "2025-02-20T13:45:00Z", createdBy: "Sarah Johnson" },
  { id: "act_003", action: "import", type: "JSON Batch", recordCount: 3200, status: "processing", createdAt: "2025-02-20T13:15:00Z", createdBy: "Mike Chen" },
  { id: "act_004", action: "export", type: "Compliance Report", recordCount: 12500, status: "completed", createdAt: "2025-02-20T12:30:00Z", createdBy: "Emma Davis" },
  { id: "act_005", action: "import", type: "XLSX Import", recordCount: 5678, status: "failed", createdAt: "2025-02-20T11:45:00Z", createdBy: "Alex Rodriguez" },
  { id: "act_006", action: "export", type: "Analytics Export", recordCount: 9234, status: "completed", createdAt: "2025-02-20T11:00:00Z", createdBy: "Lisa Wong" },
  { id: "act_007", action: "import", type: "API Sync", recordCount: 2100, status: "completed", createdAt: "2025-02-20T10:15:00Z", createdBy: "James Miller" },
  { id: "act_008", action: "export", type: "Audit Trail", recordCount: 18900, status: "processing", createdAt: "2025-02-20T09:30:00Z", createdBy: "Patricia Brown" },
  { id: "act_009", action: "import", type: "Watchlist Sync", recordCount: 890, status: "completed", createdAt: "2025-02-19T16:00:00Z", createdBy: "David Kim" },
  { id: "act_010", action: "export", type: "Account Summary", recordCount: 6700, status: "completed", createdAt: "2025-02-19T14:20:00Z", createdBy: "Rachel Green" },
];

const ACTION_OPTIONS = [
  { value: "import", label: "Import" },
  { value: "export", label: "Export" },
];

const STATUS_OPTIONS = [
  { value: "completed", label: "Completed" },
  { value: "processing", label: "Processing" },
  { value: "failed", label: "Failed" },
];

const COLUMN_CONFIG: ColumnConfig[] = [
  { id: "action", label: "Action" },
  { id: "type", label: "Type" },
  { id: "recordCount", label: "Records" },
  { id: "status", label: "Status" },
  { id: "createdBy", label: "Created By" },
  { id: "createdAt", label: "Date" },
];

const DEFAULT_VISIBILITY: VisibilityState = {
  action: true,
  type: true,
  recordCount: true,
  status: true,
  createdBy: true,
  createdAt: true,
};



const columns: ColumnDef<ActivityRecord, unknown>[] = [
  {
    accessorKey: "action",
    header: "Action",
    size: 100,
    cell: ({ row }) => (
      <Badge pill color={row.original.action === "import" ? "info" : "secondary"} variant="soft" size="sm">{row.original.action === "import" ? "Import" : "Export"}</Badge>
    ),
  },
  {
    accessorKey: "type",
    header: "Type",
    size: 180,
    cell: ({ row }) => <span className="font-medium">{row.original.type}</span>,
  },
  {
    accessorKey: "recordCount",
    header: "Records",
    size: 120,
    cell: ({ row }) => (
      <span className="text-[var(--color-text-secondary)]">{row.original.recordCount.toLocaleString()}</span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    size: 120,
    cell: ({ row }) => (
      <Badge pill color={getDataOpStatusColor(row.original.status) as BadgeProps["color"]} variant="soft" size="sm">{row.original.status.charAt(0).toUpperCase() + row.original.status.slice(1)}</Badge>
    ),
  },
  {
    accessorKey: "createdBy",
    header: "Created By",
    size: 140,
    cell: ({ row }) => (
      <span className="text-[var(--color-text-secondary)]">{row.original.createdBy}</span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    size: 180,
    cell: dateTimeCell<ActivityRecord>((r) => r.createdAt),
  },
];

export default function DataPage() {
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(DEFAULT_VISIBILITY);

  const hasActiveFilters = actionFilter.length > 0 || statusFilter.length > 0;

  const filteredData = useMemo(() => {
    return mockActivity.filter((item) => {
      if (actionFilter.length > 0 && !actionFilter.includes(item.action)) return false;
      if (statusFilter.length > 0 && !statusFilter.includes(item.status)) return false;
      if (search) {
        const s = search.toLowerCase();
        return (
          item.type.toLowerCase().includes(s) ||
          item.createdBy.toLowerCase().includes(s)
        );
      }
      return true;
    });
  }, [search, actionFilter, statusFilter]);

  function clearAllFilters() {
    setActionFilter([]);
    setStatusFilter([]);
  }

  return (
    <div className={TABLE_PAGE_WRAPPER}>
      <TopBar
        title="Data"
        actions={
          <ColumnSettings
            columns={COLUMN_CONFIG}
            visibility={columnVisibility}
            onVisibilityChange={setColumnVisibility}
          />
        }
        toolbar={
          <>
            <TableSearch value={search} onChange={setSearch} placeholder="Search activity..." />
             <div className="w-36">
               <Select
                 multiple
                 clearable
                 block
                 pill={TOPBAR_TOOLBAR_PILL}
                 listMinWidth={160}
                 options={ACTION_OPTIONS}
                 value={actionFilter}
                 onChange={(opts) => setActionFilter(opts.map((o) => o.value))}
                 placeholder="Action"
                 variant="outline"
                 size={TOPBAR_CONTROL_SIZE}
               />
             </div>
             <div className="w-36">
               <Select
                 multiple
                 clearable
                 block
                 pill={TOPBAR_TOOLBAR_PILL}
                 listMinWidth={180}
                 options={STATUS_OPTIONS}
                 value={statusFilter}
                 onChange={(opts) => setStatusFilter(opts.map((o) => o.value))}
                 placeholder="Status"
                 variant="outline"
                 size={TOPBAR_CONTROL_SIZE}
               />
             </div>
             {hasActiveFilters && (
               <Button color="secondary" variant="soft" size={TOPBAR_CONTROL_SIZE} pill={TOPBAR_TOOLBAR_PILL} onClick={clearAllFilters}>
                 Clear filters
               </Button>
             )}
          </>
        }
      />

      <div className="flex min-h-0 flex-1 flex-col">
        <div className="shrink-0 px-4 pt-4 pb-2 md:px-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <SummaryCard label="Total Records">
              <div className="heading-lg">847,293</div>
            </SummaryCard>
            <SummaryCard label="Imports">
              <div className="heading-lg">34</div>
            </SummaryCard>
            <SummaryCard label="Exports">
              <div className="heading-lg">12</div>
            </SummaryCard>
            <SummaryCard label="Storage Used">
              <div className="heading-lg">2.4 GB</div>
            </SummaryCard>
          </div>
        </div>

        <div className={TABLE_PAGE_CONTENT}>
          <DataTable
            data={filteredData}
            columns={columns}
            globalFilter={search}
            pageSize={50}
            initialSorting={[{ id: "createdAt", desc: true }]}
            columnVisibility={columnVisibility}
            onColumnVisibilityChange={setColumnVisibility}
            mobileColumnVisibility={{ createdBy: false, recordCount: false }}
          />
        </div>
      </div>
    </div>
  );
}
