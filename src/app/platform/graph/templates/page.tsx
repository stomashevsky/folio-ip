"use client";

import { useState, useMemo } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { DataTable, TableSearch } from "@/components/shared";
import { ColumnSettings, type ColumnConfig } from "@/components/shared/ColumnSettings";
import { dateTimeCell } from "@/lib/utils/columnHelpers";
import type { ColumnDef, VisibilityState } from "@tanstack/react-table";
import { Badge } from "@plexui/ui/components/Badge";
import { Button } from "@plexui/ui/components/Button";
import { Plus } from "@plexui/ui/components/Icon";

interface GraphTemplate {
  id: string;
  name: string;
  description: string;
  nodeTypes: string[];
  edgeTypes: string[];
  isDefault: boolean;
  createdAt: string;
}

const mockTemplates: GraphTemplate[] = [
  {
    id: "tpl_001",
    name: "Full Network",
    description: "Complete graph with all entity types and relationships",
    nodeTypes: ["account", "inquiry", "verification", "device"],
    edgeTypes: ["owns", "submitted", "verified_by", "same_device", "same_ip", "linked_to"],
    isDefault: true,
    createdAt: "2025-02-15T10:00:00Z",
  },
  {
    id: "tpl_002",
    name: "Account Connections",
    description: "Focus on account relationships and linked accounts",
    nodeTypes: ["account", "device"],
    edgeTypes: ["same_device", "same_ip", "linked_to"],
    isDefault: false,
    createdAt: "2025-02-14T14:30:00Z",
  },
  {
    id: "tpl_003",
    name: "Device Fingerprints",
    description: "Device-centric view with shared attributes",
    nodeTypes: ["device", "account"],
    edgeTypes: ["same_device", "same_ip"],
    isDefault: false,
    createdAt: "2025-02-13T09:15:00Z",
  },
  {
    id: "tpl_004",
    name: "Verification Chain",
    description: "Inquiry and verification flow visualization",
    nodeTypes: ["inquiry", "verification", "account"],
    edgeTypes: ["submitted", "verified_by", "owns"],
    isDefault: false,
    createdAt: "2025-02-12T16:45:00Z",
  },
  {
    id: "tpl_005",
    name: "Fraud Ring Detection",
    description: "Suspicious pattern detection across entities",
    nodeTypes: ["account", "device", "inquiry"],
    edgeTypes: ["same_ip", "same_device", "linked_to"],
    isDefault: false,
    createdAt: "2025-02-11T11:20:00Z",
  },
];

const COLUMN_CONFIG: ColumnConfig[] = [
  { id: "name", label: "Name" },
  { id: "description", label: "Description" },
  { id: "nodeTypes", label: "Node Types" },
  { id: "edgeTypes", label: "Edge Types" },
  { id: "isDefault", label: "Status" },
  { id: "createdAt", label: "Created at" },
];

const DEFAULT_VISIBILITY: VisibilityState = {
  name: true,
  description: true,
  nodeTypes: true,
  edgeTypes: true,
  isDefault: true,
  createdAt: true,
};

const columns: ColumnDef<GraphTemplate, unknown>[] = [
  {
    accessorKey: "name",
    header: "Name",
    size: 180,
    cell: ({ row }) => (
      <span className="font-medium">{row.original.name}</span>
    ),
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
    accessorKey: "nodeTypes",
    header: "Node Types",
    size: 200,
    cell: ({ row }) => (
      <span className="text-sm">{row.original.nodeTypes.join(", ")}</span>
    ),
  },
  {
    accessorKey: "edgeTypes",
    header: "Edge Types",
    size: 240,
    cell: ({ row }) => (
      <span className="text-sm">{row.original.edgeTypes.join(", ")}</span>
    ),
  },
  {
    accessorKey: "isDefault",
    header: "Status",
    size: 120,
    cell: ({ row }) =>
      row.original.isDefault ? (
        <Badge color="info" variant="soft" size="sm">
          Default
        </Badge>
      ) : (
        <Badge color="secondary" variant="soft" size="sm">
          Custom
        </Badge>
      ),
  },
  {
    accessorKey: "createdAt",
    header: "Created at",
    size: 180,
    cell: dateTimeCell<GraphTemplate>((r) => r.createdAt),
  },
];

export default function GraphTemplatesPage() {
  const [search, setSearch] = useState("");
  const [columnVisibility, setColumnVisibility] =
    useState<VisibilityState>(DEFAULT_VISIBILITY);

  const filteredData = useMemo(() => {
    return mockTemplates.filter((template) => {
      if (search) {
        const searchLower = search.toLowerCase();
        return (
          template.name.toLowerCase().includes(searchLower) ||
          template.description.toLowerCase().includes(searchLower)
        );
      }
      return true;
    });
  }, [search]);

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <TopBar
        title="Graph Templates"
        actions={
          <ColumnSettings
            columns={COLUMN_CONFIG}
            visibility={columnVisibility}
            onVisibilityChange={setColumnVisibility}
          />
        }
        toolbar={
          <>
            <TableSearch
              value={search}
              onChange={setSearch}
              placeholder="Search templates..."
            />
            <Button color="info" size="sm" pill>
              <Plus className="h-4 w-4" />
              Create Template
            </Button>
          </>
        }
      />

      <div className="flex min-h-0 flex-1 flex-col px-4 pt-2 md:px-6">
        <DataTable
          data={filteredData}
          columns={columns}
          globalFilter={search}
          pageSize={50}
          initialSorting={[{ id: "createdAt", desc: true }]}
          columnVisibility={columnVisibility}
          onColumnVisibilityChange={setColumnVisibility}
        />
      </div>
    </div>
  );
}
