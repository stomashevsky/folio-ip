"use client";

import { useState, useMemo } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { DataTable, TableSearch } from "@/components/shared";
import { ColumnSettings, type ColumnConfig } from "@/components/shared/ColumnSettings";
import { dateTimeCell } from "@/lib/utils/columnHelpers";
import type { ColumnDef, VisibilityState } from "@tanstack/react-table";
import { Button } from "@plexui/ui/components/Button";
import { Plus } from "@plexui/ui/components/Icon";

interface CaseQueue {
  id: string;
  name: string;
  description: string;
  openCases: number;
  assignedTo: string[];
  slaHours: number;
  createdAt: string;
}

const MOCK_QUEUES: CaseQueue[] = [
  {
    id: "queue_001",
    name: "General Review",
    description: "Standard case review queue",
    openCases: 12,
    assignedTo: ["John Smith", "Sarah Johnson"],
    slaHours: 24,
    createdAt: "2025-01-10T08:00:00Z",
  },
  {
    id: "queue_002",
    name: "Fraud Investigation",
    description: "High-priority fraud cases",
    openCases: 8,
    assignedTo: ["Mike Chen", "Lisa Wong"],
    slaHours: 12,
    createdAt: "2025-01-15T09:30:00Z",
  },
  {
    id: "queue_003",
    name: "Compliance",
    description: "Regulatory compliance reviews",
    openCases: 5,
    assignedTo: ["Emma Davis", "Robert Brown"],
    slaHours: 48,
    createdAt: "2025-01-20T10:15:00Z",
  },
  {
    id: "queue_004",
    name: "VIP Accounts",
    description: "Premium customer cases",
    openCases: 3,
    assignedTo: ["Alice Martinez"],
    slaHours: 6,
    createdAt: "2025-01-25T11:00:00Z",
  },
  {
    id: "queue_005",
    name: "Escalations",
    description: "Escalated and urgent cases",
    openCases: 15,
    assignedTo: ["James Wilson", "Patricia Lee", "David Garcia"],
    slaHours: 4,
    createdAt: "2025-02-01T12:45:00Z",
  },
];

const COLUMN_CONFIG: ColumnConfig[] = [
  { id: "name", label: "Name" },
  { id: "description", label: "Description" },
  { id: "openCases", label: "Open Cases" },
  { id: "assignedTo", label: "Assigned To" },
  { id: "slaHours", label: "SLA Hours" },
  { id: "createdAt", label: "Created at" },
];

const DEFAULT_VISIBILITY: VisibilityState = {
  name: true,
  description: true,
  openCases: true,
  assignedTo: true,
  slaHours: true,
  createdAt: true,
};

const columns: ColumnDef<CaseQueue, unknown>[] = [
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
    size: 250,
    cell: ({ row }) => (
      <span className="text-[var(--color-text-secondary)]">
        {row.original.description}
      </span>
    ),
  },
  {
    accessorKey: "openCases",
    header: "Open Cases",
    size: 120,
    cell: ({ row }) => (
      <span className="text-[var(--color-text-secondary)]">
        {row.original.openCases}
      </span>
    ),
  },
  {
    accessorKey: "assignedTo",
    header: "Assigned To",
    size: 200,
    cell: ({ row }) => (
      <span className="text-[var(--color-text-secondary)]">
        {row.original.assignedTo.join(", ")}
      </span>
    ),
  },
  {
    accessorKey: "slaHours",
    header: "SLA",
    size: 100,
    cell: ({ row }) => (
      <span className="text-[var(--color-text-secondary)]">
        {row.original.slaHours}h
      </span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Created at (UTC)",
    size: 180,
    cell: dateTimeCell<CaseQueue>((r) => r.createdAt),
  },
];

export default function CaseQueuesPage() {
  const [search, setSearch] = useState("");
  const [columnVisibility, setColumnVisibility] =
    useState<VisibilityState>(DEFAULT_VISIBILITY);

  const filteredData = useMemo(() => {
    if (!search) return MOCK_QUEUES;

    const lowerSearch = search.toLowerCase();
    return MOCK_QUEUES.filter(
      (q) =>
        q.name.toLowerCase().includes(lowerSearch) ||
        q.description.toLowerCase().includes(lowerSearch)
    );
  }, [search]);

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <TopBar
        title="Case Queues"
        actions={
          <div className="flex items-center gap-2">
            <ColumnSettings
              columns={COLUMN_CONFIG}
              visibility={columnVisibility}
              onVisibilityChange={setColumnVisibility}
            />
            <Button color="primary" size="md" pill={false}>
              <Plus />
              <span className="hidden md:inline">Create Queue</span>
            </Button>
          </div>
        }
        toolbar={
          <TableSearch
            value={search}
            onChange={setSearch}
            placeholder="Search queues..."
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
            assignedTo: false,
          }}
        />
      </div>
    </div>
  );
}
