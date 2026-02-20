"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { TopBar, TOPBAR_CONTROL_SIZE, TOPBAR_ACTION_PILL } from "@/components/layout/TopBar";
import { NotFoundPage, SectionHeading, DataTable, TableSearch } from "@/components/shared";
import { Badge } from "@plexui/ui/components/Badge";
import { Button } from "@plexui/ui/components/Button";
import { Plus, FileUpload } from "@plexui/ui/components/Icon";
import { dateTimeCell } from "@/lib/utils/columnHelpers";
import type { ColumnDef } from "@tanstack/react-table";

interface List {
  id: string;
  name: string;
  description: string;
  type: "allowlist" | "blocklist" | "watchlist";
  itemCount: number;
  updatedAt: string;
  createdAt: string;
}

interface ListItem {
  id: string;
  value: string;
  addedAt: string;
  addedBy: string;
}

const TYPE_COLORS: Record<string, "success" | "danger" | "warning"> = {
  allowlist: "success",
  blocklist: "danger",
  watchlist: "warning",
};

const MOCK_LISTS: List[] = [
  { id: "list_001", name: "Trusted IPs", description: "IP addresses approved for direct access", type: "allowlist", itemCount: 234, updatedAt: "2025-02-20T14:30:00Z", createdAt: "2025-02-01T10:00:00Z" },
  { id: "list_002", name: "Blocked Countries", description: "Countries restricted from platform access", type: "blocklist", itemCount: 45, updatedAt: "2025-02-19T11:15:00Z", createdAt: "2025-01-15T09:30:00Z" },
  { id: "list_003", name: "VIP Accounts", description: "High-value customer accounts requiring priority", type: "watchlist", itemCount: 156, updatedAt: "2025-02-20T13:45:00Z", createdAt: "2025-01-20T14:20:00Z" },
  { id: "list_004", name: "Sanctioned Entities", description: "OFAC and international sanctions lists", type: "blocklist", itemCount: 892, updatedAt: "2025-02-18T16:00:00Z", createdAt: "2025-01-10T08:45:00Z" },
  { id: "list_005", name: "Approved Domains", description: "Email domains allowed for registration", type: "allowlist", itemCount: 567, updatedAt: "2025-02-20T12:30:00Z", createdAt: "2025-01-25T11:15:00Z" },
  { id: "list_006", name: "Flagged Devices", description: "Devices with suspicious activity patterns", type: "watchlist", itemCount: 123, updatedAt: "2025-02-17T10:00:00Z", createdAt: "2025-02-05T13:30:00Z" },
];

function generateMockItems(listId: string): ListItem[] {
  const items: Record<string, ListItem[]> = {
    list_001: [
      { id: "li_1", value: "192.168.1.100", addedAt: "2025-02-15T10:00:00Z", addedBy: "John Smith" },
      { id: "li_2", value: "10.0.0.50", addedAt: "2025-02-14T09:30:00Z", addedBy: "Sarah Johnson" },
      { id: "li_3", value: "172.16.0.1", addedAt: "2025-02-13T14:20:00Z", addedBy: "Mike Chen" },
      { id: "li_4", value: "203.0.113.42", addedAt: "2025-02-12T11:45:00Z", addedBy: "John Smith" },
      { id: "li_5", value: "198.51.100.99", addedAt: "2025-02-11T16:10:00Z", addedBy: "Lisa Wong" },
    ],
    list_002: [
      { id: "li_1", value: "North Korea (KP)", addedAt: "2025-01-15T09:00:00Z", addedBy: "Compliance Team" },
      { id: "li_2", value: "Iran (IR)", addedAt: "2025-01-15T09:00:00Z", addedBy: "Compliance Team" },
      { id: "li_3", value: "Syria (SY)", addedAt: "2025-01-15T09:00:00Z", addedBy: "Compliance Team" },
      { id: "li_4", value: "Cuba (CU)", addedAt: "2025-01-20T10:30:00Z", addedBy: "Compliance Team" },
    ],
  };
  return items[listId] ?? [
    { id: "li_1", value: "item-001", addedAt: "2025-02-10T10:00:00Z", addedBy: "System" },
    { id: "li_2", value: "item-002", addedAt: "2025-02-09T14:30:00Z", addedBy: "Admin" },
    { id: "li_3", value: "item-003", addedAt: "2025-02-08T09:15:00Z", addedBy: "System" },
    { id: "li_4", value: "item-004", addedAt: "2025-02-07T16:45:00Z", addedBy: "Admin" },
    { id: "li_5", value: "item-005", addedAt: "2025-02-06T11:20:00Z", addedBy: "System" },
    { id: "li_6", value: "item-006", addedAt: "2025-02-05T13:00:00Z", addedBy: "Admin" },
  ];
}

const itemColumns: ColumnDef<ListItem, unknown>[] = [
  {
    accessorKey: "value",
    header: "Value",
    size: 250,
    cell: ({ row }) => <span className="font-mono text-sm">{row.original.value}</span>,
  },
  {
    accessorKey: "addedAt",
    header: "Added",
    size: 180,
    cell: dateTimeCell<ListItem>((r) => r.addedAt),
  },
  {
    accessorKey: "addedBy",
    header: "Added By",
    size: 150,
    cell: ({ row }) => (
      <span className="text-sm text-[var(--color-text-secondary)]">{row.original.addedBy}</span>
    ),
  },
];

export default function ListDetailPage() {
  const params = useParams();
  const list = MOCK_LISTS.find((l) => l.id === params.id);
  const [search, setSearch] = useState("");

  const items = useMemo(() => (list ? generateMockItems(list.id) : []), [list]);

  const filteredItems = useMemo(() => {
    if (!search) return items;
    const q = search.toLowerCase();
    return items.filter((i) => i.value.toLowerCase().includes(q) || i.addedBy.toLowerCase().includes(q));
  }, [items, search]);

  if (!list) {
    return <NotFoundPage section="Lists" backHref="/platform/utilities/lists" entity="List" />;
  }

  return (
    <div className="flex h-full flex-col overflow-auto">
      <TopBar
        title={list.name}
        backHref="/platform/utilities/lists"
        actions={
          <div className="flex items-center gap-2">
            <Badge color={TYPE_COLORS[list.type]} variant="soft" size="sm">
              {list.type.charAt(0).toUpperCase() + list.type.slice(1)}
            </Badge>
            <Button color="secondary" variant="outline" size={TOPBAR_CONTROL_SIZE} pill={TOPBAR_ACTION_PILL}>
              <FileUpload style={{ width: 14, height: 14 }} />
              Import CSV
            </Button>
            <Button color="primary" size={TOPBAR_CONTROL_SIZE} pill={TOPBAR_ACTION_PILL}>
              <Plus />
              Add Item
            </Button>
          </div>
        }
      />

      <div className="mx-auto w-full max-w-4xl px-4 py-8 md:px-6">
        <SectionHeading size="xs">Details</SectionHeading>
        <div className="mt-3 space-y-2 text-sm">
          <div className="flex gap-2">
            <span className="text-[var(--color-text-tertiary)]">Description:</span>
            <span className="text-[var(--color-text)]">{list.description}</span>
          </div>
          <div className="flex gap-2">
            <span className="text-[var(--color-text-tertiary)]">Items:</span>
            <span className="text-[var(--color-text)]">{list.itemCount}</span>
          </div>
        </div>

        <div className="mt-10">
          <div className="flex items-center justify-between">
            <SectionHeading size="xs">Items</SectionHeading>
            <TableSearch value={search} onChange={setSearch} placeholder="Search items..." />
          </div>
          <div className="mt-4">
            <DataTable
              data={filteredItems}
              columns={itemColumns}
              globalFilter={search}
              pageSize={20}
              initialSorting={[{ id: "addedAt", desc: true }]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
