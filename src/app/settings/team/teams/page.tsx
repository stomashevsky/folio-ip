"use client";

import { useState, useMemo } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { DataTable, TableSearch, ColumnSettings } from "@/components/shared";
import type { ColumnConfig } from "@/components/shared/ColumnSettings";
import { Button } from "@plexui/ui/components/Button";
import { Plus } from "@plexui/ui/components/Icon";
import type { ColumnDef, VisibilityState } from "@tanstack/react-table";

interface Team {
  id: string;
  name: string;
  description: string;
  membersCount: number;
  lead: string;
  createdAt: string;
}

const mockTeams: Team[] = [
  {
    id: "team_001",
    name: "Engineering",
    description: "Backend and frontend development team",
    membersCount: 8,
    lead: "Alice Johnson",
    createdAt: "2025-06-15",
  },
  {
    id: "team_002",
    name: "Compliance",
    description: "KYC and regulatory compliance",
    membersCount: 5,
    lead: "Bob Smith",
    createdAt: "2025-07-20",
  },
  {
    id: "team_003",
    name: "Operations",
    description: "Day-to-day operations and support",
    membersCount: 6,
    lead: "Carol White",
    createdAt: "2025-08-10",
  },
  {
    id: "team_004",
    name: "Customer Success",
    description: "Customer support and onboarding",
    membersCount: 4,
    lead: "David Brown",
    createdAt: "2025-09-05",
  },
];

const COLUMN_CONFIG: ColumnConfig[] = [
  { id: "name", label: "Name" },
  { id: "description", label: "Description" },
  { id: "membersCount", label: "Members" },
  { id: "lead", label: "Lead" },
  { id: "createdAt", label: "Created" },
];

const DEFAULT_VISIBILITY: VisibilityState = {
  name: true,
  description: true,
  membersCount: true,
  lead: true,
  createdAt: true,
};

const columns: ColumnDef<Team, unknown>[] = [
  {
    accessorKey: "name",
    header: "Name",
    size: 180,
    cell: ({ row }) => (
      <span className="font-medium text-[var(--color-text)]">
        {row.original.name}
      </span>
    ),
  },
  {
    accessorKey: "description",
    header: "Description",
    size: 280,
    cell: ({ row }) => (
      <span className="text-sm text-[var(--color-text-secondary)]">
        {row.original.description}
      </span>
    ),
  },
  {
    accessorKey: "membersCount",
    header: "Members",
    size: 100,
    cell: ({ row }) => (
      <span className="text-sm text-[var(--color-text-secondary)]">
        {row.original.membersCount}
      </span>
    ),
  },
  {
    accessorKey: "lead",
    header: "Lead",
    size: 160,
    cell: ({ row }) => (
      <span className="text-sm text-[var(--color-text-secondary)]">
        {row.original.lead}
      </span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    size: 140,
    cell: ({ row }) => (
      <span className="text-sm text-[var(--color-text-secondary)]">
        {row.original.createdAt}
      </span>
    ),
  },
];

export default function TeamsPage() {
  const [search, setSearch] = useState("");
  const [columnVisibility, setColumnVisibility] =
    useState<VisibilityState>(DEFAULT_VISIBILITY);

  const filteredData = useMemo(() => {
    if (!search.trim()) return mockTeams;
    const query = search.toLowerCase();
    return mockTeams.filter(
      (team) =>
        team.name.toLowerCase().includes(query) ||
        team.description.toLowerCase().includes(query) ||
        team.lead.toLowerCase().includes(query)
    );
  }, [search]);

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <TopBar
        title="Teams"
        actions={
          <Button color="primary" size="sm" pill={false}>
            <Plus style={{ width: 16, height: 16 }} />
            Create Team
          </Button>
        }
        toolbar={
          <div className="flex items-center gap-2">
            <TableSearch
              value={search}
              onChange={setSearch}
              placeholder="Search teams..."
            />
            <ColumnSettings
              columns={COLUMN_CONFIG}
              visibility={columnVisibility}
              onVisibilityChange={setColumnVisibility}
            />
          </div>
        }
      />
      <div className="flex min-h-0 flex-1 flex-col px-4 pt-2 md:px-6">
        <DataTable
          data={filteredData}
          columns={columns}
          columnVisibility={columnVisibility}
          onColumnVisibilityChange={setColumnVisibility}
          emptyMessage="No teams found."
        />
      </div>
    </div>
  );
}
