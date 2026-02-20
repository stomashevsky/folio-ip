"use client";

import { useState, useMemo } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { DataTable, TableSearch } from "@/components/shared";
import { ColumnSettings, type ColumnConfig } from "@/components/shared/ColumnSettings";
import { dateTimeCell, statusCell } from "@/lib/utils/columnHelpers";
import type { ColumnDef, VisibilityState } from "@tanstack/react-table";
import { Button } from "@plexui/ui/components/Button";
import { Badge } from "@plexui/ui/components/Badge";
import { Plus } from "@plexui/ui/components/Icon";

interface CaseTemplate {
  id: string;
  name: string;
  description: string;
  status: "active" | "draft";
  priority: string;
  queue: string;
  stepsCount: number;
  createdAt: string;
  updatedAt: string;
}

const MOCK_TEMPLATES: CaseTemplate[] = [
  {
    id: "tmpl_001",
    name: "Fraud Investigation",
    description: "Standard fraud case workflow with verification steps",
    status: "active",
    priority: "high",
    queue: "Fraud Investigation",
    stepsCount: 5,
    createdAt: "2025-01-15T10:30:00Z",
    updatedAt: "2025-02-10T14:20:00Z",
  },
  {
    id: "tmpl_002",
    name: "Compliance Review",
    description: "Regulatory compliance case template",
    status: "active",
    priority: "critical",
    queue: "Compliance",
    stepsCount: 7,
    createdAt: "2025-01-10T09:15:00Z",
    updatedAt: "2025-02-05T11:45:00Z",
  },
  {
    id: "tmpl_003",
    name: "VIP Account Onboarding",
    description: "Enhanced onboarding for VIP customers",
    status: "active",
    priority: "high",
    queue: "VIP Accounts",
    stepsCount: 4,
    createdAt: "2025-01-20T13:00:00Z",
    updatedAt: "2025-02-08T16:30:00Z",
  },
  {
    id: "tmpl_004",
    name: "General Review",
    description: "Standard case review workflow",
    status: "draft",
    priority: "medium",
    queue: "General Review",
    stepsCount: 3,
    createdAt: "2025-02-01T08:00:00Z",
    updatedAt: "2025-02-15T10:00:00Z",
  },
  {
    id: "tmpl_005",
    name: "Escalation Handler",
    description: "Workflow for escalated cases",
    status: "active",
    priority: "critical",
    queue: "Escalations",
    stepsCount: 6,
    createdAt: "2025-01-25T12:30:00Z",
    updatedAt: "2025-02-12T09:20:00Z",
  },
];

const COLUMN_CONFIG: ColumnConfig[] = [
  { id: "name", label: "Name" },
  { id: "description", label: "Description" },
  { id: "status", label: "Status" },
  { id: "priority", label: "Priority" },
  { id: "stepsCount", label: "Steps" },
  { id: "queue", label: "Queue" },
  { id: "createdAt", label: "Created at" },
];

const DEFAULT_VISIBILITY: VisibilityState = {
  name: true,
  description: true,
  status: true,
  priority: true,
  stepsCount: true,
  queue: true,
  createdAt: true,
};

const columns: ColumnDef<CaseTemplate, unknown>[] = [
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
    accessorKey: "status",
    header: "Status",
    size: 120,
    cell: statusCell<CaseTemplate>((r) => r.status),
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
    accessorKey: "stepsCount",
    header: "Steps",
    size: 80,
    cell: ({ row }) => (
      <span className="text-[var(--color-text-secondary)]">
        {row.original.stepsCount}
      </span>
    ),
  },
  {
    accessorKey: "queue",
    header: "Queue",
    size: 140,
    cell: ({ row }) => (
      <span className="text-[var(--color-text-secondary)]">
        {row.original.queue}
      </span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Created at (UTC)",
    size: 180,
    cell: dateTimeCell<CaseTemplate>((r) => r.createdAt),
  },
];

export default function CaseTemplatesPage() {
  const [search, setSearch] = useState("");
  const [columnVisibility, setColumnVisibility] =
    useState<VisibilityState>(DEFAULT_VISIBILITY);

  const filteredData = useMemo(() => {
    if (!search) return MOCK_TEMPLATES;

    const lowerSearch = search.toLowerCase();
    return MOCK_TEMPLATES.filter(
      (t) =>
        t.name.toLowerCase().includes(lowerSearch) ||
        t.description.toLowerCase().includes(lowerSearch) ||
        t.queue.toLowerCase().includes(lowerSearch)
    );
  }, [search]);

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <TopBar
        title="Case Templates"
        actions={
          <div className="flex items-center gap-2">
            <ColumnSettings
              columns={COLUMN_CONFIG}
              visibility={columnVisibility}
              onVisibilityChange={setColumnVisibility}
            />
            <Button color="primary" size="md" pill={false}>
              <Plus />
              <span className="hidden md:inline">Create Template</span>
            </Button>
          </div>
        }
        toolbar={
          <TableSearch
            value={search}
            onChange={setSearch}
            placeholder="Search templates..."
          />
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
            stepsCount: false,
            queue: false,
          }}
        />
      </div>
    </div>
  );
}
