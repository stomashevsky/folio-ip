"use client";

import { useState, useMemo } from "react";
import { TopBar, TOPBAR_CONTROL_SIZE, TOPBAR_TOOLBAR_PILL } from "@/components/layout/TopBar";
import { TABLE_PAGE_WRAPPER, TABLE_PAGE_CONTENT } from "@/lib/constants/page-layout";
import { DataTable, TableSearch } from "@/components/shared";
import { ColumnSettings, type ColumnConfig } from "@/components/shared/ColumnSettings";
import { dateTimeCell } from "@/lib/utils/columnHelpers";
import type { ColumnDef, VisibilityState } from "@tanstack/react-table";
import { Badge } from "@plexui/ui/components/Badge";
import { Button } from "@plexui/ui/components/Button";
import { Plus } from "@plexui/ui/components/Icon";
import { Select } from "@plexui/ui/components/Select";

interface GraphTemplate {
  id: string;
  name: string;
  description: string;
  nodeTypes: string[];
  edgeTypes: string[];
  isDefault: boolean;
  createdAt: string;
}

const TYPE_OPTIONS = [
  { value: "default", label: "Default" },
  { value: "custom", label: "Custom" },
];

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
  const [typeFilter, setTypeFilter] = useState<string[]>([]);
  const [columnVisibility, setColumnVisibility] =
    useState<VisibilityState>(DEFAULT_VISIBILITY);

  const hasActiveFilters = typeFilter.length > 0;

  function clearAllFilters() {
    setTypeFilter([]);
  }

  const filteredData = useMemo(() => {
    return mockTemplates.filter((template) => {
      if (typeFilter.length > 0) {
        const val = template.isDefault ? "default" : "custom";
        if (!typeFilter.includes(val)) return false;
      }
      if (search) {
        const searchLower = search.toLowerCase();
        return (
          template.name.toLowerCase().includes(searchLower) ||
          template.description.toLowerCase().includes(searchLower)
        );
      }
      return true;
    });
  }, [search, typeFilter]);

  return (
    <div className={TABLE_PAGE_WRAPPER}>
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
             <div className="w-36">
               <Select multiple clearable block pill={TOPBAR_TOOLBAR_PILL} listMinWidth={180} options={TYPE_OPTIONS} value={typeFilter} onChange={(opts) => setTypeFilter(opts.map((o) => o.value))} placeholder="Type" variant="outline" size={TOPBAR_CONTROL_SIZE} />
             </div>
             {hasActiveFilters && (
               <Button color="secondary" variant="soft" size={TOPBAR_CONTROL_SIZE} pill={TOPBAR_TOOLBAR_PILL} onClick={clearAllFilters}>
                 Clear filters
               </Button>
             )}
             <Button color="info" size={TOPBAR_CONTROL_SIZE} pill={TOPBAR_TOOLBAR_PILL}>
               <Plus className="h-4 w-4" />
               Create Template
             </Button>
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
        />
      </div>
    </div>
  );
}
