"use client";

import { useState, useMemo } from "react";
import { TopBar, TOPBAR_CONTROL_SIZE, TOPBAR_TOOLBAR_PILL, TOPBAR_ACTION_PILL } from "@/components/layout/TopBar";
import { TABLE_PAGE_WRAPPER, TABLE_PAGE_CONTENT } from "@/lib/constants/page-layout";
import { DataTable, TableSearch, ColumnSettings } from "@/components/shared";
import type { ColumnConfig } from "@/components/shared/ColumnSettings";
import { Button } from "@plexui/ui/components/Button";
import { Plus } from "@plexui/ui/components/Icon";
import { Select } from "@plexui/ui/components/Select";
import type { ColumnDef, VisibilityState } from "@tanstack/react-table";

interface Team {
  id: string;
  name: string;
  description: string;
  membersCount: number;
  lead: string;
  createdAt: string;
}

const LEAD_OPTIONS = [
  { value: "Alice Johnson", label: "Alice Johnson" },
  { value: "Bob Smith", label: "Bob Smith" },
  { value: "Carol White", label: "Carol White" },
  { value: "David Brown", label: "David Brown" },
];

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
  const [leadFilter, setLeadFilter] = useState<string[]>([]);
  const [columnVisibility, setColumnVisibility] =
    useState<VisibilityState>(DEFAULT_VISIBILITY);

  const filteredData = useMemo(() => {
    let result = mockTeams;

    if (search.trim()) {
      const query = search.toLowerCase();
      result = result.filter(
        (team) =>
          team.name.toLowerCase().includes(query) ||
          team.description.toLowerCase().includes(query) ||
          team.lead.toLowerCase().includes(query)
      );
    }

    if (leadFilter.length > 0) {
      result = result.filter((team) => leadFilter.includes(team.lead));
    }

    return result;
  }, [search, leadFilter]);

  return (
    <div className={TABLE_PAGE_WRAPPER}>
      <TopBar
        title="Teams"
        actions={
          <div className="flex items-center gap-2">
            <ColumnSettings
              columns={COLUMN_CONFIG}
              visibility={columnVisibility}
              onVisibilityChange={setColumnVisibility}
            />
            <Button color="primary" size={TOPBAR_CONTROL_SIZE} pill={TOPBAR_ACTION_PILL}>
              <Plus style={{ width: 16, height: 16 }} />
              Create Team
            </Button>
          </div>
        }
        toolbar={
          <>
            <TableSearch
              value={search}
              onChange={setSearch}
              placeholder="Search teams..."
            />
            <div className="w-40">
              <Select
                multiple
                clearable
                block
                pill={TOPBAR_TOOLBAR_PILL}
                listMinWidth={180}
                options={LEAD_OPTIONS}
                value={leadFilter}
                onChange={(opts) => setLeadFilter(opts.map((o) => o.value))}
                placeholder="Lead"
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
          columnVisibility={columnVisibility}
          onColumnVisibilityChange={setColumnVisibility}
          emptyMessage="No teams found."
        />
      </div>
    </div>
  );
}
