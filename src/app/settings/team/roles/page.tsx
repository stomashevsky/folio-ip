"use client";

import { useState, useMemo } from "react";
import { TopBar, TOPBAR_CONTROL_SIZE, TOPBAR_TOOLBAR_PILL, TOPBAR_ACTION_PILL } from "@/components/layout/TopBar";
import { TABLE_PAGE_WRAPPER, TABLE_PAGE_CONTENT } from "@/lib/constants/page-layout";
import { DataTable, TableSearch, ColumnSettings } from "@/components/shared";
import type { ColumnConfig } from "@/components/shared/ColumnSettings";
import { dateTimeCell } from "@/lib/utils/columnHelpers";
import { Plus } from "@plexui/ui/components/Icon";
import { Button } from "@plexui/ui/components/Button";
import { Select } from "@plexui/ui/components/Select";
import type { ColumnDef, VisibilityState } from "@tanstack/react-table";

interface Role {
  id: string;
  name: string;
  description: string;
  membersCount: number;
  permissions: string[];
  createdAt: string;
  updatedAt: string;
}

const MEMBERS_COUNT_OPTIONS = [
  { value: "1", label: "1 member" },
  { value: "2", label: "2 members" },
  { value: "3", label: "3 members" },
  { value: "4", label: "4 members" },
  { value: "5", label: "5 members" },
  { value: "8", label: "8 members" },
];

const mockRoles: Role[] = [
  {
    id: "role_owner",
    name: "Owner",
    description: "Full access to all features and settings",
    membersCount: 1,
    permissions: ["manage_users", "manage_settings", "manage_billing", "view_reports"],
    createdAt: "2025-01-15T10:30:00Z",
    updatedAt: "2025-02-10T14:20:00Z",
  },
  {
    id: "role_admin",
    name: "Admin",
    description: "Administrative access with limited billing controls",
    membersCount: 3,
    permissions: ["manage_users", "manage_settings", "view_reports"],
    createdAt: "2025-01-15T10:30:00Z",
    updatedAt: "2025-02-08T09:15:00Z",
  },
  {
    id: "role_analyst",
    name: "Analyst",
    description: "Can view reports and manage inquiries",
    membersCount: 5,
    permissions: ["view_reports", "manage_inquiries", "export_data"],
    createdAt: "2025-01-20T11:45:00Z",
    updatedAt: "2025-02-05T16:30:00Z",
  },
  {
    id: "role_reviewer",
    name: "Reviewer",
    description: "Can review and approve inquiries",
    membersCount: 4,
    permissions: ["review_inquiries", "approve_inquiries"],
    createdAt: "2025-01-25T13:20:00Z",
    updatedAt: "2025-02-12T11:00:00Z",
  },
  {
    id: "role_viewer",
    name: "Viewer",
    description: "Read-only access to reports and data",
    membersCount: 8,
    permissions: ["view_reports", "view_inquiries"],
    createdAt: "2025-02-01T08:00:00Z",
    updatedAt: "2025-02-10T10:30:00Z",
  },
  {
    id: "role_developer",
    name: "Developer",
    description: "API access and integration management",
    membersCount: 2,
    permissions: ["manage_api_keys", "view_reports", "manage_integrations"],
    createdAt: "2025-02-03T14:15:00Z",
    updatedAt: "2025-02-11T15:45:00Z",
  },
];

const COLUMN_CONFIG: ColumnConfig[] = [
  { id: "name", label: "Name" },
  { id: "description", label: "Description" },
  { id: "membersCount", label: "Members" },
  { id: "permissions", label: "Permissions" },
  { id: "createdAt", label: "Created at" },
  { id: "updatedAt", label: "Updated at" },
];

const DEFAULT_VISIBILITY: VisibilityState = {
  name: true,
  description: true,
  membersCount: true,
  permissions: true,
  createdAt: true,
  updatedAt: true,
};

const columns: ColumnDef<Role, unknown>[] = [
  {
    accessorKey: "name",
    header: "Name",
    size: 150,
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
    accessorKey: "membersCount",
    header: "Members",
    size: 100,
    cell: ({ row }) => <span>{row.original.membersCount}</span>,
  },
  {
    accessorKey: "permissions",
    header: "Permissions",
    size: 200,
    cell: ({ row }) => {
      const perms = row.original.permissions;
      const displayed = perms.slice(0, 3).join(", ");
      const remaining = perms.length - 3;
      return (
        <span className="text-[var(--color-text-secondary)]">
          {displayed}
          {remaining > 0 ? ` +${remaining} more` : ""}
        </span>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created at (UTC)",
    size: 180,
    cell: dateTimeCell<Role>((r) => r.createdAt),
  },
  {
    accessorKey: "updatedAt",
    header: "Updated at (UTC)",
    size: 180,
    cell: dateTimeCell<Role>((r) => r.updatedAt),
  },
];

export default function TeamRolesPage() {
  const [search, setSearch] = useState("");
  const [membersFilter, setMembersFilter] = useState<string[]>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(DEFAULT_VISIBILITY);

  const hasActiveFilters = membersFilter.length > 0;

  function clearAllFilters() {
    setMembersFilter([]);
  }

  const filteredData = useMemo(() => {
    let result = mockRoles;

    if (search.trim()) {
      const query = search.toLowerCase();
      result = result.filter(
        (role) =>
          role.name.toLowerCase().includes(query) ||
          role.description.toLowerCase().includes(query)
      );
    }

    if (membersFilter.length > 0) {
      result = result.filter((role) =>
        membersFilter.includes(role.membersCount.toString())
      );
    }

    return result;
  }, [search, membersFilter]);

  return (
    <div className={TABLE_PAGE_WRAPPER}>
      <TopBar
        title="Roles"
        actions={
          <div className="flex items-center gap-2">
            <ColumnSettings
              columns={COLUMN_CONFIG}
              visibility={columnVisibility}
              onVisibilityChange={setColumnVisibility}
            />
            <Button color="primary" size={TOPBAR_CONTROL_SIZE} pill={TOPBAR_ACTION_PILL}>
              <Plus />
              <span className="hidden md:inline">Create Role</span>
            </Button>
          </div>
        }
        toolbar={
          <>
            <TableSearch
              value={search}
              onChange={setSearch}
              placeholder="Search roles..."
            />
            <div className="w-40">
              <Select
                multiple
                clearable
                block
                pill={TOPBAR_TOOLBAR_PILL}
                listMinWidth={180}
                options={MEMBERS_COUNT_OPTIONS}
                value={membersFilter}
                onChange={(opts) => setMembersFilter(opts.map((o) => o.value))}
                placeholder="Members"
                variant="outline"
                size={TOPBAR_CONTROL_SIZE}
              />
            </div>

            {hasActiveFilters && (
              <Button color="secondary" variant="soft" size={TOPBAR_CONTROL_SIZE} pill={TOPBAR_TOOLBAR_PILL} onClick={clearAllFilters}>
                Clear filters
              </Button>
            )}
          </>
        }
      />

      <div className={TABLE_PAGE_CONTENT}>
        <DataTable
          data={filteredData}
          columns={columns}
          globalFilter={search}
          pageSize={50}
          initialSorting={[{ id: "name", desc: false }]}
          columnVisibility={columnVisibility}
          onColumnVisibilityChange={setColumnVisibility}
        />
      </div>
    </div>
  );
}
