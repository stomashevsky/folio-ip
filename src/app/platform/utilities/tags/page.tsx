"use client";

import { useState, useMemo } from "react";
import { TopBar, TOPBAR_CONTROL_SIZE, TOPBAR_TOOLBAR_PILL, TOPBAR_ACTION_PILL } from "@/components/layout/TopBar";
import { TABLE_PAGE_WRAPPER, TABLE_PAGE_CONTENT } from "@/lib/constants/page-layout";
import { DataTable, TableSearch } from "@/components/shared";
import { ColumnSettings, type ColumnConfig } from "@/components/shared/ColumnSettings";
import { dateTimeCell } from "@/lib/utils/columnHelpers";
import type { ColumnDef, VisibilityState } from "@tanstack/react-table";
import { Button } from "@plexui/ui/components/Button";
import { Plus } from "@plexui/ui/components/Icon";
import { Select } from "@plexui/ui/components/Select";

interface Tag {
  id: string;
  name: string;
  color: string;
  usageCount: number;
  createdBy: string;
  createdAt: string;
}

const CREATED_BY_OPTIONS = [
  { value: "John Smith", label: "John Smith" },
  { value: "Sarah Johnson", label: "Sarah Johnson" },
  { value: "Mike Chen", label: "Mike Chen" },
  { value: "Emma Davis", label: "Emma Davis" },
  { value: "Alex Rodriguez", label: "Alex Rodriguez" },
  { value: "Lisa Wong", label: "Lisa Wong" },
  { value: "James Miller", label: "James Miller" },
  { value: "Patricia Brown", label: "Patricia Brown" },
  { value: "Robert Taylor", label: "Robert Taylor" },
  { value: "Jennifer Lee", label: "Jennifer Lee" },
];

const mockTags: Tag[] = [
  {
    id: "tag_001",
    name: "High Risk",
    color: "#ef4444",
    usageCount: 234,
    createdBy: "John Smith",
    createdAt: "2025-02-15T10:30:00Z",
  },
  {
    id: "tag_002",
    name: "VIP",
    color: "#10b981",
    usageCount: 156,
    createdBy: "Sarah Johnson",
    createdAt: "2025-02-14T14:15:00Z",
  },
  {
    id: "tag_003",
    name: "Returning Customer",
    color: "#3b82f6",
    usageCount: 892,
    createdBy: "Mike Chen",
    createdAt: "2025-02-13T09:45:00Z",
  },
  {
    id: "tag_004",
    name: "Flagged",
    color: "#f59e0b",
    usageCount: 45,
    createdBy: "Emma Davis",
    createdAt: "2025-02-12T16:20:00Z",
  },
  {
    id: "tag_005",
    name: "Manual Review",
    color: "#8b5cf6",
    usageCount: 123,
    createdBy: "Alex Rodriguez",
    createdAt: "2025-02-11T11:00:00Z",
  },
  {
    id: "tag_006",
    name: "Auto Approved",
    color: "#06b6d4",
    usageCount: 567,
    createdBy: "Lisa Wong",
    createdAt: "2025-02-10T13:30:00Z",
  },
  {
    id: "tag_007",
    name: "International",
    color: "#ec4899",
    usageCount: 234,
    createdBy: "James Miller",
    createdAt: "2025-02-09T10:15:00Z",
  },
  {
    id: "tag_008",
    name: "Business",
    color: "#14b8a6",
    usageCount: 345,
    createdBy: "Patricia Brown",
    createdAt: "2025-02-08T15:45:00Z",
  },
  {
    id: "tag_009",
    name: "Compliance Hold",
    color: "#dc2626",
    usageCount: 78,
    createdBy: "Robert Taylor",
    createdAt: "2025-02-07T12:00:00Z",
  },
  {
    id: "tag_010",
    name: "Expedited",
    color: "#059669",
    usageCount: 456,
    createdBy: "Jennifer Lee",
    createdAt: "2025-02-06T08:30:00Z",
  },
];

const COLUMN_CONFIG: ColumnConfig[] = [
  { id: "name", label: "Name" },
  { id: "usageCount", label: "Usage Count" },
  { id: "createdBy", label: "Created By" },
  { id: "createdAt", label: "Created at" },
];

const DEFAULT_VISIBILITY: VisibilityState = {
  name: true,
  usageCount: true,
  createdBy: true,
  createdAt: true,
};

const columns: ColumnDef<Tag, unknown>[] = [
  {
    accessorKey: "name",
    header: "Name",
    size: 200,
    cell: ({ row }) => (
      <span className="flex items-center gap-2">
        <span
          className="inline-block h-3 w-3 rounded-full"
          style={{ backgroundColor: row.original.color }}
        />
        <span className="font-medium">{row.original.name}</span>
      </span>
    ),
  },
  {
    accessorKey: "usageCount",
    header: "Usage Count",
    size: 120,
    cell: ({ row }) => <span>{row.original.usageCount}</span>,
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
    cell: dateTimeCell<Tag>((r) => r.createdAt),
  },
];

export default function UtilityTagsPage() {
  const [search, setSearch] = useState("");
  const [createdByFilter, setCreatedByFilter] = useState<string[]>([]);
  const [columnVisibility, setColumnVisibility] =
    useState<VisibilityState>(DEFAULT_VISIBILITY);

  const filteredData = useMemo(() => {
    let result = mockTags;

    if (createdByFilter.length > 0) {
      result = result.filter((tag) => createdByFilter.includes(tag.createdBy));
    }

    if (!search) return result;

    const searchLower = search.toLowerCase();
    return result.filter(
      (tag) =>
        tag.name.toLowerCase().includes(searchLower) ||
        tag.createdBy.toLowerCase().includes(searchLower)
    );
  }, [search, createdByFilter]);

  return (
    <div className={TABLE_PAGE_WRAPPER}>
      <TopBar
        title="Tags"
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
              <span className="hidden md:inline">Create Tag</span>
            </Button>
          </div>
        }
        toolbar={
          <>
            <TableSearch
              value={search}
              onChange={setSearch}
              placeholder="Search tags..."
            />
            <div className="w-48">
              <Select
                multiple
                clearable
                block
                pill={TOPBAR_TOOLBAR_PILL}
                listMinWidth={200}
                options={CREATED_BY_OPTIONS}
                value={createdByFilter}
                onChange={(opts) => setCreatedByFilter(opts.map((o) => o.value))}
                placeholder="Created By"
                variant="outline"
                size={TOPBAR_CONTROL_SIZE}
              />
            </div>
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
            createdBy: false,
          }}
        />
      </div>
    </div>
  );
}
