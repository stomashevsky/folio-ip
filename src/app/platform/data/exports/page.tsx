"use client";

import { useState, useMemo } from "react";
import { TopBar, TOPBAR_CONTROL_SIZE, TOPBAR_TOOLBAR_PILL, TOPBAR_ACTION_PILL } from "@/components/layout/TopBar";
import { TABLE_PAGE_WRAPPER, TABLE_PAGE_CONTENT } from "@/lib/constants/page-layout";
import { DataTable, TableSearch } from "@/components/shared";
import { ColumnSettings, type ColumnConfig } from "@/components/shared/ColumnSettings";
import { dateTimeCell } from "@/lib/utils/columnHelpers";
import type { ColumnDef, VisibilityState } from "@tanstack/react-table";
import { Badge } from "@plexui/ui/components/Badge";
import { Select } from "@plexui/ui/components/Select";
import { Button } from "@plexui/ui/components/Button";
import { Plus } from "@plexui/ui/components/Icon";

interface Export {
  id: string;
  name: string;
  type: string;
  recordCount: number;
  status: "completed" | "processing" | "failed" | "queued";
  format: "csv" | "json" | "xlsx" | "pdf";
  fileSize: string;
  createdAt: string;
  createdBy: string;
}

const mockExports: Export[] = [
  {
    id: "exp_001",
    name: "Monthly Report Q1",
    type: "Analytics Report",
    recordCount: 15234,
    status: "completed",
    format: "pdf",
    fileSize: "2.4 MB",
    createdAt: "2025-02-20T14:30:00Z",
    createdBy: "John Smith",
  },
  {
    id: "exp_002",
    name: "Compliance Export",
    type: "Regulatory Report",
    recordCount: 8456,
    status: "completed",
    format: "xlsx",
    fileSize: "1.8 MB",
    createdAt: "2025-02-20T13:45:00Z",
    createdBy: "Sarah Johnson",
  },
  {
    id: "exp_003",
    name: "Customer Data Dump",
    type: "Data Export",
    recordCount: 32100,
    status: "processing",
    format: "csv",
    fileSize: "5.2 MB",
    createdAt: "2025-02-20T12:30:00Z",
    createdBy: "Mike Chen",
  },
  {
    id: "exp_004",
    name: "Risk Assessment",
    type: "Risk Report",
    recordCount: 5678,
    status: "failed",
    format: "json",
    fileSize: "0.9 MB",
    createdAt: "2025-02-20T11:45:00Z",
    createdBy: "Emma Davis",
  },
  {
    id: "exp_005",
    name: "Audit Trail Export",
    type: "Audit Report",
    recordCount: 12500,
    status: "completed",
    format: "csv",
    fileSize: "3.1 MB",
    createdAt: "2025-02-20T10:15:00Z",
    createdBy: "Alex Rodriguez",
  },
  {
    id: "exp_006",
    name: "Transaction Summary",
    type: "Financial Report",
    recordCount: 45600,
    status: "queued",
    format: "xlsx",
    fileSize: "4.5 MB",
    createdAt: "2025-02-20T09:30:00Z",
    createdBy: "Lisa Wong",
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
  { value: "pdf", label: "PDF" },
];

const COLUMN_CONFIG: ColumnConfig[] = [
  { id: "name", label: "Name" },
  { id: "type", label: "Type" },
  { id: "format", label: "Format" },
  { id: "recordCount", label: "Records" },
  { id: "fileSize", label: "File Size" },
  { id: "status", label: "Status" },
  { id: "createdBy", label: "Created By" },
  { id: "createdAt", label: "Created at" },
];

const DEFAULT_VISIBILITY: VisibilityState = {
  name: true,
  type: true,
  format: true,
  recordCount: true,
  fileSize: true,
  status: true,
  createdBy: true,
  createdAt: true,
};

const columns: ColumnDef<Export, unknown>[] = [
  {
    accessorKey: "name",
    header: "Name",
    size: 200,
    cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
  },
  {
    accessorKey: "type",
    header: "Type",
    size: 160,
    cell: ({ row }) => (
      <span className="text-[var(--color-text-secondary)]">
        {row.original.type}
      </span>
    ),
  },
  {
    accessorKey: "format",
    header: "Format",
    size: 100,
    cell: ({ row }) => {
      const colorMap: Record<string, "secondary" | "info" | "discovery" | "warning"> = {
        csv: "secondary",
        json: "info",
        xlsx: "discovery",
        pdf: "warning",
      };
      return (
        <Badge color={colorMap[row.original.format]} variant="soft" size="sm">
          {row.original.format.toUpperCase()}
        </Badge>
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
    accessorKey: "fileSize",
    header: "File Size",
    size: 120,
    cell: ({ row }) => (
      <span className="text-[var(--color-text-secondary)]">
        {row.original.fileSize}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    size: 120,
    cell: ({ row }) => {
      const colorMap: Record<string, "success" | "warning" | "danger" | "secondary"> = {
        completed: "success",
        processing: "warning",
        failed: "danger",
        queued: "secondary",
      };
      return (
        <Badge color={colorMap[row.original.status]} variant="soft" size="sm">
          {row.original.status.charAt(0).toUpperCase() +
            row.original.status.slice(1)}
        </Badge>
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
    cell: dateTimeCell<Export>((r) => r.createdAt),
  },
];

export default function DataExportsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [formatFilter, setFormatFilter] = useState<string[]>([]);
  const [columnVisibility, setColumnVisibility] =
    useState<VisibilityState>(DEFAULT_VISIBILITY);

  const hasActiveFilters = statusFilter.length > 0 || formatFilter.length > 0;

  const filteredData = useMemo(() => {
    return mockExports.filter((item) => {
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
          item.type.toLowerCase().includes(searchLower) ||
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
        title="Exports"
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
              <span className="hidden md:inline">New Export</span>
            </Button>
          </div>
        }
        toolbar={
          <>
            <TableSearch
              value={search}
              onChange={setSearch}
              placeholder="Search exports..."
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
            type: false,
            fileSize: false,
            createdBy: false,
          }}
        />
      </div>
    </div>
  );
}
