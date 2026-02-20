"use client";

import { useState, useMemo } from "react";
import { TopBar, TOPBAR_CONTROL_SIZE, TOPBAR_TOOLBAR_PILL } from "@/components/layout/TopBar";
import { TABLE_PAGE_WRAPPER, TABLE_PAGE_CONTENT } from "@/lib/constants/page-layout";
import { DataTable, TableSearch, ColumnSettings } from "@/components/shared";
import type { ColumnConfig } from "@/components/shared/ColumnSettings";
import { idCell, dateTimeCell } from "@/lib/utils/columnHelpers";
import { Select } from "@plexui/ui/components/Select";
import { Button } from "@plexui/ui/components/Button";
import type { ColumnDef, VisibilityState } from "@tanstack/react-table";

interface AuditLog {
  id: string;
  action: string;
  actor: string;
  actorEmail: string;
  resourceType: string;
  resourceId: string;
  ipAddress: string;
  createdAt: string;
}

const mockAuditLogs: AuditLog[] = [
  {
    id: "log_001",
    action: "inquiry.approved",
    actor: "John Doe",
    actorEmail: "john@example.com",
    resourceType: "Inquiry",
    resourceId: "inq_abc123",
    ipAddress: "192.168.1.100",
    createdAt: "2025-02-20T14:30:00Z",
  },
  {
    id: "log_002",
    action: "inquiry.declined",
    actor: "Jane Smith",
    actorEmail: "jane@example.com",
    resourceType: "Inquiry",
    resourceId: "inq_def456",
    ipAddress: "203.0.113.45",
    createdAt: "2025-02-20T13:15:00Z",
  },
  {
    id: "log_003",
    action: "template.created",
    actor: "Bob Johnson",
    actorEmail: "bob@example.com",
    resourceType: "Template",
    resourceId: "tmpl_ghi789",
    ipAddress: "198.51.100.22",
    createdAt: "2025-02-20T12:00:00Z",
  },
  {
    id: "log_004",
    action: "template.updated",
    actor: "Alice Brown",
    actorEmail: "alice@example.com",
    resourceType: "Template",
    resourceId: "tmpl_jkl012",
    ipAddress: "192.0.2.88",
    createdAt: "2025-02-20T11:45:00Z",
  },
  {
    id: "log_005",
    action: "template.deleted",
    actor: "Charlie Wilson",
    actorEmail: "charlie@example.com",
    resourceType: "Template",
    resourceId: "tmpl_mno345",
    ipAddress: "203.0.113.99",
    createdAt: "2025-02-20T10:30:00Z",
  },
  {
    id: "log_006",
    action: "workflow.published",
    actor: "Diana Martinez",
    actorEmail: "diana@example.com",
    resourceType: "Workflow",
    resourceId: "wf_pqr678",
    ipAddress: "198.51.100.55",
    createdAt: "2025-02-20T09:15:00Z",
  },
  {
    id: "log_007",
    action: "user.invited",
    actor: "Eve Taylor",
    actorEmail: "eve@example.com",
    resourceType: "User",
    resourceId: "usr_stu901",
    ipAddress: "192.168.1.50",
    createdAt: "2025-02-20T08:00:00Z",
  },
  {
    id: "log_008",
    action: "user.removed",
    actor: "Frank Anderson",
    actorEmail: "frank@example.com",
    resourceType: "User",
    resourceId: "usr_vwx234",
    ipAddress: "203.0.113.77",
    createdAt: "2025-02-19T16:45:00Z",
  },
  {
    id: "log_009",
    action: "settings.updated",
    actor: "Grace Lee",
    actorEmail: "grace@example.com",
    resourceType: "Settings",
    resourceId: "set_yz567",
    ipAddress: "198.51.100.11",
    createdAt: "2025-02-19T15:30:00Z",
  },
  {
    id: "log_010",
    action: "api_key.created",
    actor: "Henry Clark",
    actorEmail: "henry@example.com",
    resourceType: "API Key",
    resourceId: "key_abc890",
    ipAddress: "192.0.2.33",
    createdAt: "2025-02-19T14:15:00Z",
  },
  {
    id: "log_011",
    action: "api_key.revoked",
    actor: "John Doe",
    actorEmail: "john@example.com",
    resourceType: "API Key",
    resourceId: "key_def123",
    ipAddress: "192.168.1.100",
    createdAt: "2025-02-19T13:00:00Z",
  },
  {
    id: "log_012",
    action: "inquiry.approved",
    actor: "Jane Smith",
    actorEmail: "jane@example.com",
    resourceType: "Inquiry",
    resourceId: "inq_ghi456",
    ipAddress: "203.0.113.45",
    createdAt: "2025-02-19T11:45:00Z",
  },
  {
    id: "log_013",
    action: "template.created",
    actor: "Bob Johnson",
    actorEmail: "bob@example.com",
    resourceType: "Template",
    resourceId: "tmpl_jkl789",
    ipAddress: "198.51.100.22",
    createdAt: "2025-02-19T10:30:00Z",
  },
  {
    id: "log_014",
    action: "workflow.published",
    actor: "Alice Brown",
    actorEmail: "alice@example.com",
    resourceType: "Workflow",
    resourceId: "wf_mno012",
    ipAddress: "192.0.2.88",
    createdAt: "2025-02-19T09:15:00Z",
  },
  {
    id: "log_015",
    action: "user.invited",
    actor: "Charlie Wilson",
    actorEmail: "charlie@example.com",
    resourceType: "User",
    resourceId: "usr_pqr345",
    ipAddress: "203.0.113.99",
    createdAt: "2025-02-19T08:00:00Z",
  },
];

const ACTION_OPTIONS = [
  { value: "inquiry.approved", label: "Inquiry Approved" },
  { value: "inquiry.declined", label: "Inquiry Declined" },
  { value: "template.created", label: "Template Created" },
  { value: "template.updated", label: "Template Updated" },
  { value: "template.deleted", label: "Template Deleted" },
  { value: "workflow.published", label: "Workflow Published" },
  { value: "user.invited", label: "User Invited" },
  { value: "user.removed", label: "User Removed" },
  { value: "settings.updated", label: "Settings Updated" },
  { value: "api_key.created", label: "API Key Created" },
  { value: "api_key.revoked", label: "API Key Revoked" },
];

const RESOURCE_TYPE_OPTIONS = [
  { value: "Inquiry", label: "Inquiry" },
  { value: "Template", label: "Template" },
  { value: "Workflow", label: "Workflow" },
  { value: "User", label: "User" },
  { value: "Settings", label: "Settings" },
  { value: "API Key", label: "API Key" },
];

const COLUMN_CONFIG: ColumnConfig[] = [
  { id: "action", label: "Action" },
  { id: "actor", label: "Actor" },
  { id: "actorEmail", label: "Email" },
  { id: "resourceType", label: "Resource Type" },
  { id: "resourceId", label: "Resource ID" },
  { id: "ipAddress", label: "IP Address" },
  { id: "createdAt", label: "Timestamp" },
];

const DEFAULT_VISIBILITY: VisibilityState = {
  action: true,
  actor: true,
  actorEmail: true,
  resourceType: true,
  resourceId: true,
  ipAddress: true,
  createdAt: true,
};

const columns: ColumnDef<AuditLog, unknown>[] = [
  {
    accessorKey: "action",
    header: "Action",
    size: 180,
    cell: ({ row }) => (
      <span className="font-medium">{row.original.action}</span>
    ),
  },
  {
    accessorKey: "actor",
    header: "Actor",
    size: 150,
    cell: ({ row }) => (
      <span className="text-[var(--color-text-secondary)]">
        {row.original.actor}
      </span>
    ),
  },
  {
    accessorKey: "actorEmail",
    header: "Email",
    size: 200,
    cell: ({ row }) => (
      <span className="text-[var(--color-text-secondary)]">
        {row.original.actorEmail}
      </span>
    ),
  },
  {
    accessorKey: "resourceType",
    header: "Resource Type",
    size: 130,
    cell: ({ row }) => (
      <span className="text-[var(--color-text-secondary)]">
        {row.original.resourceType}
      </span>
    ),
  },
  {
    accessorKey: "resourceId",
    header: "Resource ID",
    size: 150,
    cell: idCell<AuditLog>((r) => r.resourceId),
  },
  {
    accessorKey: "ipAddress",
    header: "IP Address",
    size: 150,
    cell: ({ row }) => (
      <span className="font-mono text-[var(--color-text-secondary)]">
        {row.original.ipAddress}
      </span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Timestamp (UTC)",
    size: 180,
    cell: dateTimeCell<AuditLog>((r) => r.createdAt),
  },
];

export default function AuditLogsPage() {
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState<string[]>([]);
  const [resourceTypeFilter, setResourceTypeFilter] = useState<string[]>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(DEFAULT_VISIBILITY);

  const hasActiveFilters = actionFilter.length > 0 || resourceTypeFilter.length > 0;

  function clearAllFilters() {
    setActionFilter([]);
    setResourceTypeFilter([]);
  }

  const filteredData = useMemo(() => {
    let result = mockAuditLogs;

    if (search.trim()) {
      const query = search.toLowerCase();
      result = result.filter(
        (log) =>
          log.action.toLowerCase().includes(query) ||
          log.actor.toLowerCase().includes(query) ||
          log.actorEmail.toLowerCase().includes(query) ||
          log.resourceId.toLowerCase().includes(query)
      );
    }

    if (actionFilter.length > 0) {
      result = result.filter((log) => actionFilter.includes(log.action));
    }

    if (resourceTypeFilter.length > 0) {
      result = result.filter((log) =>
        resourceTypeFilter.includes(log.resourceType)
      );
    }

    return result;
  }, [search, actionFilter, resourceTypeFilter]);

  return (
    <div className={TABLE_PAGE_WRAPPER}>
      <TopBar
        title="Audit Logs"
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
              placeholder="Search audit logs..."
            />

            <div className="w-40">
              <Select
                multiple
                clearable
                block
                pill={TOPBAR_TOOLBAR_PILL}
                listMinWidth={200}
                options={ACTION_OPTIONS}
                value={actionFilter}
                onChange={(opts) => setActionFilter(opts.map((o) => o.value))}
                placeholder="Action"
                variant="outline"
                size={TOPBAR_CONTROL_SIZE}
              />
            </div>

            <div className="w-40">
              <Select
                multiple
                clearable
                block
                pill={TOPBAR_TOOLBAR_PILL}
                listMinWidth={180}
                options={RESOURCE_TYPE_OPTIONS}
                value={resourceTypeFilter}
                onChange={(opts) =>
                  setResourceTypeFilter(opts.map((o) => o.value))
                }
                placeholder="Resource Type"
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
          initialSorting={[{ id: "createdAt", desc: true }]}
          columnVisibility={columnVisibility}
          onColumnVisibilityChange={setColumnVisibility}
        />
      </div>
    </div>
  );
}
