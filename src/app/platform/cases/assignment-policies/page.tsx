"use client";

import { useState, useMemo } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { DataTable, TableSearch } from "@/components/shared";
import { ColumnSettings, type ColumnConfig } from "@/components/shared/ColumnSettings";
import { dateTimeCell } from "@/lib/utils/columnHelpers";
import type { ColumnDef, VisibilityState } from "@tanstack/react-table";
import { Button } from "@plexui/ui/components/Button";
import { Badge } from "@plexui/ui/components/Badge";
import { Plus } from "@plexui/ui/components/Icon";
import { Select } from "@plexui/ui/components/Select";

interface AssignmentPolicy {
  id: string;
  name: string;
  description: string;
  strategy: "round_robin" | "least_busy" | "manual" | "skill_based";
  priority: string;
  queue: string;
  status: "active" | "inactive";
  enabled: boolean;
  createdAt: string;
}

const STATUS_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

const MOCK_POLICIES: AssignmentPolicy[] = [
  {
    id: "pol_001",
    name: "Round Robin - General",
    description: "Distribute cases evenly across team members",
    strategy: "round_robin",
    priority: "medium",
    queue: "General Review",
    status: "active",
    enabled: true,
    createdAt: "2025-01-10T08:00:00Z",
  },
  {
    id: "pol_002",
    name: "Least Busy - Fraud",
    description: "Assign to team member with lowest workload",
    strategy: "least_busy",
    priority: "high",
    queue: "Fraud Investigation",
    status: "active",
    enabled: true,
    createdAt: "2025-01-15T09:30:00Z",
  },
  {
    id: "pol_003",
    name: "Skill-based - Compliance",
    description: "Assign based on compliance expertise",
    strategy: "skill_based",
    priority: "critical",
    queue: "Compliance",
    status: "active",
    enabled: true,
    createdAt: "2025-01-20T10:15:00Z",
  },
  {
    id: "pol_004",
    name: "Manual - VIP Accounts",
    description: "Manual assignment for VIP customers",
    strategy: "manual",
    priority: "high",
    queue: "VIP Accounts",
    status: "inactive",
    enabled: false,
    createdAt: "2025-01-25T11:00:00Z",
  },
];

const COLUMN_CONFIG: ColumnConfig[] = [
  { id: "name", label: "Name" },
  { id: "description", label: "Description" },
  { id: "strategy", label: "Strategy" },
  { id: "queue", label: "Queue" },
  { id: "priority", label: "Priority" },
  { id: "enabled", label: "Status" },
  { id: "createdAt", label: "Created at" },
];

const DEFAULT_VISIBILITY: VisibilityState = {
  name: true,
  description: true,
  strategy: true,
  queue: true,
  priority: true,
  enabled: true,
  createdAt: true,
};

const columns: ColumnDef<AssignmentPolicy, unknown>[] = [
  {
    accessorKey: "name",
    header: "Name",
    size: 200,
    cell: ({ row }) => (
      <span className="font-medium">{row.original.name}</span>
    ),
  },
  {
    accessorKey: "description",
    header: "Description",
    size: 250,
    cell: ({ row }) => (
      <span className="text-[var(--color-text-secondary)]">
        {row.original.description}
      </span>
    ),
  },
  {
    accessorKey: "strategy",
    header: "Strategy",
    size: 140,
    cell: ({ row }) => (
      <Badge color="secondary" size="sm">
        {row.original.strategy.replace(/_/g, " ")}
      </Badge>
    ),
  },
  {
    accessorKey: "queue",
    header: "Queue",
    size: 160,
    cell: ({ row }) => (
      <span className="text-[var(--color-text-secondary)]">
        {row.original.queue}
      </span>
    ),
  },
  {
    accessorKey: "priority",
    header: "Priority",
    size: 120,
    cell: ({ row }) => {
      const p = row.original.priority;
      const color =
        p === "critical" || p === "high"
          ? "danger"
          : p === "medium"
            ? "warning"
            : "secondary";
      return <Badge color={color} size="sm">{p}</Badge>;
    },
  },
  {
    accessorKey: "enabled",
    header: "Status",
    size: 120,
    cell: ({ row }) => (
      <Badge
        color={row.original.enabled ? "success" : "secondary"}
        size="sm"
      >
        {row.original.enabled ? "Active" : "Disabled"}
      </Badge>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Created at (UTC)",
    size: 180,
    cell: dateTimeCell<AssignmentPolicy>((r) => r.createdAt),
  },
];

export default function CaseAssignmentPoliciesPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [columnVisibility, setColumnVisibility] =
    useState<VisibilityState>(DEFAULT_VISIBILITY);

  const filteredData = useMemo(() => {
    let result = MOCK_POLICIES;

    if (statusFilter.length > 0) {
      result = result.filter((p) => statusFilter.includes(p.status));
    }

    if (!search) return result;

    const lowerSearch = search.toLowerCase();
    return result.filter(
      (p) =>
        p.name.toLowerCase().includes(lowerSearch) ||
        p.description.toLowerCase().includes(lowerSearch) ||
        p.queue.toLowerCase().includes(lowerSearch)
    );
  }, [search, statusFilter]);

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <TopBar
        title="Assignment Policies"
        actions={
          <div className="flex items-center gap-2">
            <ColumnSettings
              columns={COLUMN_CONFIG}
              visibility={columnVisibility}
              onVisibilityChange={setColumnVisibility}
            />
            <Button color="primary" size="md" pill={false}>
              <Plus />
              <span className="hidden md:inline">Create Policy</span>
            </Button>
          </div>
        }
        toolbar={
          <>
            <TableSearch
              value={search}
              onChange={setSearch}
              placeholder="Search policies..."
            />
            <div className="w-36">
              <Select
                multiple
                clearable
                block
                pill
                listMinWidth={180}
                options={STATUS_OPTIONS}
                value={statusFilter}
                onChange={(opts) => setStatusFilter(opts.map((o) => o.value))}
                placeholder="Status"
                variant="outline"
                size="sm"
              />
            </div>
          </>
        }
      />

      <div className="flex min-h-0 flex-1 flex-col px-4 pt-4 md:px-6">
        <DataTable
          data={filteredData}
          columns={columns}
          globalFilter={search}
          pageSize={50}
          initialSorting={[{ id: "createdAt", desc: true }]}
          columnVisibility={columnVisibility}
          onColumnVisibilityChange={setColumnVisibility}
          mobileColumnVisibility={{
            description: false,
            queue: false,
          }}
        />
      </div>
    </div>
  );
}
