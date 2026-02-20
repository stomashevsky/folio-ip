"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { TopBar, TOPBAR_CONTROL_SIZE, TOPBAR_TOOLBAR_PILL, TOPBAR_ACTION_PILL } from "@/components/layout/TopBar";
import { TABLE_PAGE_WRAPPER, TABLE_PAGE_CONTENT } from "@/lib/constants/page-layout";
import { DataTable, TableSearch, ColumnSettings } from "@/components/shared";
import type { ColumnConfig } from "@/components/shared/ColumnSettings";
import { dateTimeCell } from "@/lib/utils/columnHelpers";
import type { ColumnDef, VisibilityState } from "@tanstack/react-table";
import { Badge } from "@plexui/ui/components/Badge";
import { Select } from "@plexui/ui/components/Select";
import { Button } from "@plexui/ui/components/Button";
import { Plus } from "@plexui/ui/components/Icon";

interface DeveloperApiKey {
  id: string;
  name: string;
  keyPrefix: string;
  environment: "sandbox" | "production";
  permissions: string[];
  lastUsedAt: string;
  requestsToday: number;
  requestsThisMonth: number;
  createdAt: string;
  status: "active" | "revoked";
}

const mockApiKeys: DeveloperApiKey[] = [
  {
    id: "key_abc123",
    name: "Production Backend",
    keyPrefix: "pk_live_abc1••••",
    environment: "production",
    permissions: ["read:all", "write:inquiries", "write:verifications"],
    lastUsedAt: "2026-02-20T14:30:00Z",
    requestsToday: 1243,
    requestsThisMonth: 28450,
    createdAt: "2025-06-15T10:00:00Z",
    status: "active",
  },
  {
    id: "key_def456",
    name: "Staging Server",
    keyPrefix: "pk_test_def4••••",
    environment: "sandbox",
    permissions: ["read:all", "write:all"],
    lastUsedAt: "2026-02-20T12:15:00Z",
    requestsToday: 567,
    requestsThisMonth: 8920,
    createdAt: "2025-08-20T14:30:00Z",
    status: "active",
  },
  {
    id: "key_ghi789",
    name: "Mobile App",
    keyPrefix: "pk_live_ghi7••••",
    environment: "production",
    permissions: ["read:inquiries", "write:inquiries"],
    lastUsedAt: "2026-02-19T22:45:00Z",
    requestsToday: 89,
    requestsThisMonth: 3210,
    createdAt: "2025-10-05T09:00:00Z",
    status: "active",
  },
  {
    id: "key_jkl012",
    name: "Internal Tools",
    keyPrefix: "pk_test_jkl0••••",
    environment: "sandbox",
    permissions: ["read:all"],
    lastUsedAt: "2026-02-18T16:30:00Z",
    requestsToday: 0,
    requestsThisMonth: 456,
    createdAt: "2025-11-12T11:00:00Z",
    status: "active",
  },
  {
    id: "key_mno345",
    name: "Legacy Integration",
    keyPrefix: "pk_live_mno3••••",
    environment: "production",
    permissions: ["read:inquiries"],
    lastUsedAt: "2026-01-15T10:00:00Z",
    requestsToday: 0,
    requestsThisMonth: 0,
    createdAt: "2025-03-01T08:00:00Z",
    status: "revoked",
  },
];

const ENVIRONMENT_OPTIONS = [
  { value: "sandbox", label: "Sandbox" },
  { value: "production", label: "Production" },
];

const STATUS_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "revoked", label: "Revoked" },
];

const COLUMN_CONFIG: ColumnConfig[] = [
  { id: "name", label: "Name" },
  { id: "keyPrefix", label: "Key" },
  { id: "environment", label: "Environment" },
  { id: "status", label: "Status" },
  { id: "requestsToday", label: "Requests today" },
  { id: "requestsThisMonth", label: "Requests (month)" },
  { id: "lastUsedAt", label: "Last used" },
  { id: "createdAt", label: "Created at" },
];

const DEFAULT_VISIBILITY: VisibilityState = {
  name: true,
  keyPrefix: true,
  environment: true,
  status: true,
  requestsToday: true,
  requestsThisMonth: true,
  lastUsedAt: true,
  createdAt: false,
};

const columns: ColumnDef<DeveloperApiKey, unknown>[] = [
  {
    accessorKey: "name",
    header: "Name",
    size: 180,
    cell: ({ row }) => (
      <span className="font-medium">{row.original.name}</span>
    ),
  },
  {
    accessorKey: "keyPrefix",
    header: "Key",
    size: 180,
    cell: ({ row }) => (
      <span className="font-mono text-[var(--color-text-secondary)]">
        {row.original.keyPrefix}
      </span>
    ),
  },
  {
    accessorKey: "environment",
    header: "Environment",
    size: 130,
    cell: ({ row }) => (
      <Badge
        color={row.original.environment === "production" ? "info" : "secondary"}
        variant="soft"
        size="sm"
      >
        {row.original.environment === "production" ? "Production" : "Sandbox"}
      </Badge>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    size: 100,
    cell: ({ row }) => (
      <Badge
        color={row.original.status === "active" ? "success" : "danger"}
        variant="soft"
        size="sm"
      >
        {row.original.status === "active" ? "Active" : "Revoked"}
      </Badge>
    ),
  },
  {
    accessorKey: "requestsToday",
    header: "Requests today",
    size: 140,
    cell: ({ row }) => (
      <span className="tabular-nums">{row.original.requestsToday.toLocaleString()}</span>
    ),
  },
  {
    accessorKey: "requestsThisMonth",
    header: "Requests (month)",
    size: 150,
    cell: ({ row }) => (
      <span className="tabular-nums">{row.original.requestsThisMonth.toLocaleString()}</span>
    ),
  },
  {
    accessorKey: "lastUsedAt",
    header: "Last used (UTC)",
    size: 180,
    cell: dateTimeCell<DeveloperApiKey>((r) => r.lastUsedAt),
  },
  {
    accessorKey: "createdAt",
    header: "Created at (UTC)",
    size: 180,
    cell: dateTimeCell<DeveloperApiKey>((r) => r.createdAt),
  },
];

export default function DeveloperApiKeysPage() {
  const [search, setSearch] = useState("");
  const [envFilter, setEnvFilter] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(DEFAULT_VISIBILITY);

  const hasActiveFilters = envFilter.length > 0 || statusFilter.length > 0;

  function clearAllFilters() {
    setEnvFilter([]);
    setStatusFilter([]);
  }

  const filteredData = useMemo(() => {
    return mockApiKeys.filter((key) => {
      if (envFilter.length > 0 && !envFilter.includes(key.environment)) return false;
      if (statusFilter.length > 0 && !statusFilter.includes(key.status)) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          key.name.toLowerCase().includes(q) ||
          key.keyPrefix.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [search, envFilter, statusFilter]);

  return (
    <div className={TABLE_PAGE_WRAPPER}>
      <TopBar
        title="API Keys"
        actions={
          <div className="flex items-center gap-2">
            <ColumnSettings
              columns={COLUMN_CONFIG}
              visibility={columnVisibility}
              onVisibilityChange={setColumnVisibility}
            />
            <Link href="/settings/api-keys">
              <Button
                color="primary"
                size={TOPBAR_CONTROL_SIZE}
                pill={TOPBAR_ACTION_PILL}
              >
                <Plus />
                <span className="hidden md:inline">Manage Keys</span>
              </Button>
            </Link>
          </div>
        }
        toolbar={
          <>
            <TableSearch
              value={search}
              onChange={setSearch}
              placeholder="Search keys..."
            />
            <div className="w-40">
              <Select
                multiple
                clearable
                block
                pill={TOPBAR_TOOLBAR_PILL}
                listMinWidth={180}
                options={ENVIRONMENT_OPTIONS}
                value={envFilter}
                onChange={(opts) => setEnvFilter(opts.map((o) => o.value))}
                placeholder="Environment"
                variant="outline"
                size={TOPBAR_CONTROL_SIZE}
              />
            </div>
            <div className="w-36">
              <Select
                multiple
                clearable
                block
                pill={TOPBAR_TOOLBAR_PILL}
                listMinWidth={160}
                options={STATUS_OPTIONS}
                value={statusFilter}
                onChange={(opts) => setStatusFilter(opts.map((o) => o.value))}
                placeholder="Status"
                variant="outline"
                size={TOPBAR_CONTROL_SIZE}
              />
            </div>
            {hasActiveFilters && (
              <Button
                color="secondary"
                variant="soft"
                size={TOPBAR_CONTROL_SIZE}
                pill={TOPBAR_TOOLBAR_PILL}
                onClick={clearAllFilters}
              >
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
          initialSorting={[{ id: "requestsToday", desc: true }]}
          columnVisibility={columnVisibility}
          onColumnVisibilityChange={setColumnVisibility}
          mobileColumnVisibility={{
            requestsThisMonth: false,
            lastUsedAt: false,
            createdAt: false,
          }}
        />
      </div>
    </div>
  );
}
