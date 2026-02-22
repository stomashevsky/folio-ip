"use client";

import { useState, useMemo } from "react";
import { TopBar, TOPBAR_CONTROL_SIZE, TOPBAR_TOOLBAR_PILL, TOPBAR_ACTION_PILL } from "@/components/layout/TopBar";
import { TABLE_PAGE_WRAPPER, TABLE_PAGE_CONTENT } from "@/lib/constants/page-layout";
import { DataTable, TableSearch } from "@/components/shared";
import { ColumnSettings, type ColumnConfig } from "@/components/shared/ColumnSettings";
import { dateTimeCell } from "@/lib/utils/columnHelpers";
import type { ColumnDef, VisibilityState } from "@tanstack/react-table";
import { Badge, type BadgeProps } from "@plexui/ui/components/Badge";
import { getFormatColor, getDataOpStatusColor } from "@/lib/utils/format";
import { Select } from "@plexui/ui/components/Select";
import { Button } from "@plexui/ui/components/Button";
import { Plus } from "@plexui/ui/components/Icon";

interface Import {
  id: string;
  name: string;
  source: string;
  recordCount: number;
  status: "completed" | "processing" | "failed" | "queued";
  format: "csv" | "json" | "xlsx";
  createdAt: string;
  completedAt?: string;
  createdBy: string;
}

const mockImports: Import[] = [
  {
    id: "imp_001",
    name: "Q1 Customer Data",
    source: "Salesforce",
    recordCount: 15234,
    status: "completed",
    format: "csv",
    createdAt: "2025-02-20T14:30:00Z",
    completedAt: "2025-02-20T14:45:00Z",
    createdBy: "John Smith",
  },
  {
    id: "imp_002",
    name: "Verification Batch 2025",
    source: "Internal API",
    recordCount: 8456,
    status: "processing",
    format: "json",
    createdAt: "2025-02-20T13:45:00Z",
    createdBy: "Sarah Johnson",
  },
  {
    id: "imp_003",
    name: "Legacy Account Migration",
    source: "PostgreSQL",
    recordCount: 32100,
    status: "completed",
    format: "xlsx",
    createdAt: "2025-02-20T12:30:00Z",
    completedAt: "2025-02-20T13:15:00Z",
    createdBy: "Mike Chen",
  },
  {
    id: "imp_004",
    name: "Risk Score Update",
    source: "Third-party Service",
    recordCount: 5678,
    status: "failed",
    format: "json",
    createdAt: "2025-02-20T11:45:00Z",
    createdBy: "Emma Davis",
  },
  {
    id: "imp_005",
    name: "Compliance Data Feed",
    source: "Compliance System",
    recordCount: 12500,
    status: "completed",
    format: "csv",
    createdAt: "2025-02-20T10:15:00Z",
    completedAt: "2025-02-20T10:30:00Z",
    createdBy: "Alex Rodriguez",
  },
  {
    id: "imp_006",
    name: "Transaction History",
    source: "Payment Gateway",
    recordCount: 45600,
    status: "queued",
    format: "json",
    createdAt: "2025-02-20T09:30:00Z",
    createdBy: "Lisa Wong",
  },
  {
    id: "imp_007",
    name: "Address Validation",
    source: "USPS API",
    recordCount: 2100,
    status: "completed",
    format: "csv",
    createdAt: "2025-02-20T08:45:00Z",
    completedAt: "2025-02-20T08:50:00Z",
    createdBy: "James Miller",
  },
  {
    id: "imp_008",
    name: "KYC Documents Batch",
    source: "Document Management",
    recordCount: 18900,
    status: "processing",
    format: "xlsx",
    createdAt: "2025-02-20T07:30:00Z",
    createdBy: "Patricia Brown",
  },
];

const STATUS_OPTIONS = [
  { value: "completed", label: "Completed" },
  { value: "processing", label: "Processing" },
  { value: "failed", label: "Failed" },
  { value: "queued", label: "Queued" },
];

const FORMAT_OPTIONS = [
  { value: "csv", label: "CSV" },
  { value: "json", label: "JSON" },
  { value: "xlsx", label: "XLSX" },
];

const COLUMN_CONFIG: ColumnConfig[] = [
  { id: "name", label: "Name" },
  { id: "source", label: "Source" },
  { id: "format", label: "Format" },
  { id: "recordCount", label: "Records" },
  { id: "status", label: "Status" },
  { id: "createdBy", label: "Created By" },
  { id: "createdAt", label: "Created at" },
];

const DEFAULT_VISIBILITY: VisibilityState = {
  name: true,
  source: true,
  format: true,
  recordCount: true,
  status: true,
  createdBy: true,
  createdAt: true,
};

const columns: ColumnDef<Import, unknown>[] = [
  {
    accessorKey: "name",
    header: "Name",
    size: 200,
    cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
  },
  {
    accessorKey: "source",
    header: "Source",
    size: 160,
    cell: ({ row }) => (
      <span className="text-[var(--color-text-secondary)]">
        {row.original.source}
      </span>
    ),
  },
  {
    accessorKey: "format",
    header: "Format",
    size: 100,
    cell: ({ row }) => {
      return (
        <Badge pill color={getFormatColor(row.original.format) as BadgeProps["color"]} variant="soft" size="sm">{row.original.format.toUpperCase()}</Badge>
      );
    },
  },
  {
    accessorKey: "recordCount",
    header: "Records",
    size: 120,
    cell: ({ row }) => (
      <span>{row.original.recordCount.toLocaleString()}</span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    size: 120,
    cell: ({ row }) => {
      return (
        <Badge pill color={getDataOpStatusColor(row.original.status) as BadgeProps["color"]} variant="soft" size="sm">{row.original.status.charAt(0).toUpperCase() +
          row.original.status.slice(1)}</Badge>
      );
    },
  },
  {
    accessorKey: "createdBy",
    header: "Created By",
    size: 140,
    cell: ({ row }) => (
      <span className="text-[var(--color-text-secondary)]">
        {row.original.createdBy}
      </span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Created at (UTC)",
    size: 180,
    cell: dateTimeCell<Import>((r) => r.createdAt),
  },
];

export default function DataImportsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [formatFilter, setFormatFilter] = useState<string[]>([]);
  const [columnVisibility, setColumnVisibility] =
    useState<VisibilityState>(DEFAULT_VISIBILITY);

  const hasActiveFilters = statusFilter.length > 0 || formatFilter.length > 0;

  const filteredData = useMemo(() => {
    return mockImports.filter((item) => {
      if (statusFilter.length > 0 && !statusFilter.includes(item.status)) {
        return false;
      }

      if (formatFilter.length > 0 && !formatFilter.includes(item.format)) {
        return false;
      }

      if (search) {
        const searchLower = search.toLowerCase();
        return (
          item.name.toLowerCase().includes(searchLower) ||
          item.source.toLowerCase().includes(searchLower) ||
          item.createdBy.toLowerCase().includes(searchLower)
        );
      }

      return true;
    });
  }, [statusFilter, formatFilter, search]);

  function clearAllFilters() {
    setStatusFilter([]);
    setFormatFilter([]);
  }

  return (
    <div className={TABLE_PAGE_WRAPPER}>
      <TopBar
        title="Imports"
        actions={
          <div className="flex items-center gap-2">
            <ColumnSettings
              columns={COLUMN_CONFIG}
              visibility={columnVisibility}
              onVisibilityChange={setColumnVisibility}
            />
            <Button
              color="primary"
              size={TOPBAR_CONTROL_SIZE}
              pill={TOPBAR_ACTION_PILL}
              onClick={() => {}}
            >
              <Plus />
              <span className="hidden md:inline">New Import</span>
            </Button>
          </div>
        }
        toolbar={
          <>
            <TableSearch
              value={search}
              onChange={setSearch}
              placeholder="Search imports..."
            />

             <div className="w-40">
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

             <div className="w-32">
               <Select
                 multiple
                 clearable
                 block
                 pill={TOPBAR_TOOLBAR_PILL}
                 listMinWidth={140}
                 options={FORMAT_OPTIONS}
                 value={formatFilter}
                 onChange={(opts) => setFormatFilter(opts.map((o) => o.value))}
                 placeholder="Format"
                 variant="outline"
                 size={TOPBAR_CONTROL_SIZE}
               />
             </div>

             {hasActiveFilters && (
               <Button
                 color="secondary"
                 variant="soft"
                 size={TOPBAR_CONTROL_SIZE}
                 pill={TOPBAR_TOOLBAR_PILL}
                 onClick={clearAllFilters}
               >
                 Clear filters
               </Button>
             )}
          </>
        }
      />

      <div className={TABLE_PAGE_CONTENT}>
        <DataTable
          data={filteredData}
          columns={columns}
          globalFilter={search}
          pageSize={50}
          initialSorting={[{ id: "createdAt", desc: true }]}
          columnVisibility={columnVisibility}
          onColumnVisibilityChange={setColumnVisibility}
          mobileColumnVisibility={{
            source: false,
            createdBy: false,
          }}
        />
      </div>
    </div>
  );
}
