"use client";

import { useState, useMemo } from "react";
import { TopBar, TOPBAR_CONTROL_SIZE, TOPBAR_TOOLBAR_PILL, TOPBAR_ACTION_PILL } from "@/components/layout/TopBar";
import { TABLE_PAGE_WRAPPER, TABLE_PAGE_CONTENT } from "@/lib/constants/page-layout";
import { DataTable, TableSearch } from "@/components/shared";
import { ColumnSettings, type ColumnConfig } from "@/components/shared/ColumnSettings";
import { dateTimeCell } from "@/lib/utils/columnHelpers";
import { getListTypeColor } from "@/lib/utils/format";
import type { ColumnDef, VisibilityState } from "@tanstack/react-table";
import { Badge, type BadgeProps } from "@plexui/ui/components/Badge";
import { Button } from "@plexui/ui/components/Button";
import { Plus } from "@plexui/ui/components/Icon";
import { Select } from "@plexui/ui/components/Select";

interface List {
  id: string;
  name: string;
  description: string;
  type: "allowlist" | "blocklist" | "watchlist";
  itemCount: number;
  updatedAt: string;
  createdAt: string;
}

const TYPE_OPTIONS = [
  { value: "allowlist", label: "Allowlist" },
  { value: "blocklist", label: "Blocklist" },
  { value: "watchlist", label: "Watchlist" },
];

const mockLists: List[] = [
  {
    id: "list_001",
    name: "Trusted IPs",
    description: "IP addresses approved for direct access",
    type: "allowlist",
    itemCount: 234,
    updatedAt: "2025-02-20T14:30:00Z",
    createdAt: "2025-02-01T10:00:00Z",
  },
  {
    id: "list_002",
    name: "Blocked Countries",
    description: "Countries restricted from platform access",
    type: "blocklist",
    itemCount: 45,
    updatedAt: "2025-02-19T11:15:00Z",
    createdAt: "2025-01-15T09:30:00Z",
  },
  {
    id: "list_003",
    name: "VIP Accounts",
    description: "High-value customer accounts requiring priority",
    type: "watchlist",
    itemCount: 156,
    updatedAt: "2025-02-20T13:45:00Z",
    createdAt: "2025-01-20T14:20:00Z",
  },
  {
    id: "list_004",
    name: "Sanctioned Entities",
    description: "OFAC and international sanctions lists",
    type: "blocklist",
    itemCount: 892,
    updatedAt: "2025-02-18T16:00:00Z",
    createdAt: "2025-01-10T08:45:00Z",
  },
  {
    id: "list_005",
    name: "Approved Domains",
    description: "Email domains allowed for registration",
    type: "allowlist",
    itemCount: 567,
    updatedAt: "2025-02-20T12:30:00Z",
    createdAt: "2025-01-25T11:15:00Z",
  },
  {
    id: "list_006",
    name: "Flagged Devices",
    description: "Devices with suspicious activity patterns",
    type: "watchlist",
    itemCount: 123,
    updatedAt: "2025-02-17T10:00:00Z",
    createdAt: "2025-02-05T13:30:00Z",
  },
];

const COLUMN_CONFIG: ColumnConfig[] = [
  { id: "name", label: "Name" },
  { id: "description", label: "Description" },
  { id: "type", label: "Type" },
  { id: "itemCount", label: "Items" },
  { id: "updatedAt", label: "Updated at" },
  { id: "createdAt", label: "Created at" },
];

const DEFAULT_VISIBILITY: VisibilityState = {
  name: true,
  description: true,
  type: true,
  itemCount: true,
  updatedAt: true,
  createdAt: true,
};

const columns: ColumnDef<List, unknown>[] = [
  {
    accessorKey: "name",
    header: "Name",
    size: 200,
    cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
  },
  {
    accessorKey: "description",
    header: "Description",
    size: 280,
    cell: ({ row }) => (
      <span className="text-[var(--color-text-secondary)]">
        {row.original.description}
      </span>
    ),
  },
   {
     accessorKey: "type",
     header: "Type",
     size: 120,
     cell: ({ row }) => (
       <Badge pill color={getListTypeColor(row.original.type) as BadgeProps["color"]} variant="soft" size="sm">{row.original.type.charAt(0).toUpperCase() +
         row.original.type.slice(1)}</Badge>
     ),
   },
  {
    accessorKey: "itemCount",
    header: "Items",
    size: 100,
    cell: ({ row }) => <span>{row.original.itemCount}</span>,
  },
  {
    accessorKey: "updatedAt",
    header: "Updated at (UTC)",
    size: 180,
    cell: dateTimeCell<List>((r) => r.updatedAt),
  },
  {
    accessorKey: "createdAt",
    header: "Created at (UTC)",
    size: 180,
    cell: dateTimeCell<List>((r) => r.createdAt),
  },
];

export default function UtilityListsPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string[]>([]);
  const [columnVisibility, setColumnVisibility] =
    useState<VisibilityState>(DEFAULT_VISIBILITY);

  const filteredData = useMemo(() => {
    let result = mockLists;

    if (typeFilter.length > 0) {
      result = result.filter((list) => typeFilter.includes(list.type));
    }

    if (!search) return result;

    const searchLower = search.toLowerCase();
    return result.filter(
      (list) =>
        list.name.toLowerCase().includes(searchLower) ||
        list.description.toLowerCase().includes(searchLower)
    );
  }, [search, typeFilter]);

  return (
    <div className={TABLE_PAGE_WRAPPER}>
      <TopBar
        title="Lists"
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
              <span className="hidden md:inline">Create List</span>
            </Button>
          </div>
        }
        toolbar={
          <>
            <TableSearch
              value={search}
              onChange={setSearch}
              placeholder="Search lists..."
            />
            <div className="w-40">
              <Select
                multiple
                clearable
                block
                pill={TOPBAR_TOOLBAR_PILL}
                listMinWidth={180}
                options={TYPE_OPTIONS}
                value={typeFilter}
                onChange={(opts) => setTypeFilter(opts.map((o) => o.value))}
                placeholder="Type"
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
          initialSorting={[{ id: "updatedAt", desc: true }]}
          columnVisibility={columnVisibility}
          onColumnVisibilityChange={setColumnVisibility}
          mobileColumnVisibility={{
            description: false,
            createdAt: false,
          }}
        />
      </div>
    </div>
  );
}
