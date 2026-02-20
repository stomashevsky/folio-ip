"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { TopBar, TOPBAR_CONTROL_SIZE, TOPBAR_TOOLBAR_PILL, TOPBAR_ACTION_PILL } from "@/components/layout/TopBar";
import { TABLE_PAGE_WRAPPER, TABLE_PAGE_CONTENT } from "@/lib/constants/page-layout";
import { DataTable, TableSearch } from "@/components/shared";
import { ColumnSettings, type ColumnConfig } from "@/components/shared/ColumnSettings";
import { dateTimeCell, statusCell } from "@/lib/utils/columnHelpers";
import { getPriorityColor } from "@/lib/utils/format";
import type { ColumnDef, VisibilityState } from "@tanstack/react-table";
import { Button } from "@plexui/ui/components/Button";
import { Badge, type BadgeProps } from "@plexui/ui/components/Badge";
import { Plus } from "@plexui/ui/components/Icon";
import { Select } from "@plexui/ui/components/Select";

interface CaseTemplate {
  id: string;
  name: string;
  description: string;
  status: "active" | "draft" | "archived";
  priority: string;
  queue: string;
  stepsCount: number;
  createdAt: string;
  updatedAt: string;
}

const STATUS_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "draft", label: "Draft" },
  { value: "archived", label: "Archived" },
];

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
      return <Badge color={getPriorityColor(p) as BadgeProps["color"]} variant="soft" size="sm">{p.charAt(0).toUpperCase() + p.slice(1)}</Badge>;
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
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [columnVisibility, setColumnVisibility] =
    useState<VisibilityState>(DEFAULT_VISIBILITY);

  const filteredData = useMemo(() => {
    let result = MOCK_TEMPLATES;

    if (statusFilter.length > 0) {
      result = result.filter((t) => statusFilter.includes(t.status));
    }

    if (!search) return result;

    const lowerSearch = search.toLowerCase();
    return result.filter(
      (t) =>
        t.name.toLowerCase().includes(lowerSearch) ||
        t.description.toLowerCase().includes(lowerSearch) ||
        t.queue.toLowerCase().includes(lowerSearch)
    );
  }, [search, statusFilter]);

  return (
    <div className={TABLE_PAGE_WRAPPER}>
      <TopBar
        title="Case Templates"
        actions={
          <div className="flex items-center gap-2">
            <ColumnSettings
              columns={COLUMN_CONFIG}
              visibility={columnVisibility}
              onVisibilityChange={setColumnVisibility}
            />
            <Button color="primary" size={TOPBAR_CONTROL_SIZE} pill={TOPBAR_ACTION_PILL}>
              <Plus />
              <span className="hidden md:inline">Create Template</span>
            </Button>
          </div>
        }
        toolbar={
          <>
            <TableSearch
              value={search}
              onChange={setSearch}
              placeholder="Search templates..."
            />
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
          onRowClick={(row) => router.push(`/platform/cases/templates/${row.id}`)}
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
