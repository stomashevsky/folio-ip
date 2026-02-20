"use client";

import { useState, useMemo } from "react";
import { TopBar, TOPBAR_CONTROL_SIZE, TOPBAR_TOOLBAR_PILL } from "@/components/layout/TopBar";
import { TABLE_PAGE_WRAPPER, TABLE_PAGE_CONTENT } from "@/lib/constants/page-layout";
import { DataTable, TableSearch } from "@/components/shared";
import { ColumnSettings, type ColumnConfig } from "@/components/shared/ColumnSettings";
import type { ColumnDef, VisibilityState } from "@tanstack/react-table";
import { Badge, type BadgeProps } from "@plexui/ui/components/Badge";
import { getRateLimitStatusColor } from "@/lib/utils/format";
import { Select } from "@plexui/ui/components/Select";
import { Button } from "@plexui/ui/components/Button";

interface RateLimit {
  id: string;
  name: string;
  endpoint: string;
  limit: number;
  window: string;
  currentUsage: number;
  status: "active" | "exceeded" | "warning";
}

const STATUS_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "warning", label: "Warning" },
  { value: "exceeded", label: "Exceeded" },
];

const mockRateLimits: RateLimit[] = [
  {
    id: "rl_001",
    name: "Global Default",
    endpoint: "All endpoints",
    limit: 10000,
    window: "1 hour",
    currentUsage: 4523,
    status: "active",
  },
  {
    id: "rl_002",
    name: "Inquiry Create",
    endpoint: "/api/v1/inquiries",
    limit: 1000,
    window: "1 minute",
    currentUsage: 245,
    status: "active",
  },
  {
    id: "rl_003",
    name: "Verification Submit",
    endpoint: "/api/v1/verifications",
    limit: 500,
    window: "1 minute",
    currentUsage: 487,
    status: "warning",
  },
  {
    id: "rl_004",
    name: "Report Generate",
    endpoint: "/api/v1/reports",
    limit: 100,
    window: "1 minute",
    currentUsage: 98,
    status: "active",
  },
  {
    id: "rl_005",
    name: "Webhook Send",
    endpoint: "/webhooks",
    limit: 5000,
    window: "1 hour",
    currentUsage: 5000,
    status: "exceeded",
  },
  {
    id: "rl_006",
    name: "Account Search",
    endpoint: "/api/v1/accounts/search",
    limit: 2000,
    window: "1 hour",
    currentUsage: 1234,
    status: "active",
  },
];

const COLUMN_CONFIG: ColumnConfig[] = [
  { id: "name", label: "Name" },
  { id: "endpoint", label: "Endpoint" },
  { id: "limit", label: "Limit" },
  { id: "window", label: "Window" },
  { id: "currentUsage", label: "Current Usage" },
  { id: "status", label: "Status" },
];

const DEFAULT_VISIBILITY: VisibilityState = {
  name: true,
  endpoint: true,
  limit: true,
  window: true,
  currentUsage: true,
  status: true,
};

const columns: ColumnDef<RateLimit, unknown>[] = [
  {
    accessorKey: "name",
    header: "Name",
    size: 180,
    cell: ({ row }) => (
      <span className="font-medium text-[var(--color-text)]">{row.original.name}</span>
    ),
  },
  {
    accessorKey: "endpoint",
    header: "Endpoint",
    size: 240,
    cell: ({ row }) => (
      <span className="font-mono text-[var(--color-text-secondary)]">
        {row.original.endpoint}
      </span>
    ),
  },
  {
    accessorKey: "limit",
    header: "Limit",
    size: 120,
    cell: ({ row }) => (
      <span className="text-[var(--color-text)]">
        {row.original.limit.toLocaleString()}/{row.original.window}
      </span>
    ),
  },
  {
    accessorKey: "window",
    header: "Window",
    size: 100,
    cell: ({ row }) => (
      <span className="text-[var(--color-text)]">{row.original.window}</span>
    ),
  },
  {
    accessorKey: "currentUsage",
    header: "Current Usage",
    size: 140,
    cell: ({ row }) => {
      const usage = row.original.currentUsage;
      const limit = row.original.limit;
      const percentage = ((usage / limit) * 100).toFixed(0);
      return (
        <span className="text-[var(--color-text)]">
          {usage.toLocaleString()} ({percentage}%)
        </span>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    size: 120,
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <Badge color={getRateLimitStatusColor(status) as BadgeProps["color"]} variant="soft">
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      );
    },
  },
];

export default function ApiRateLimitsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [columnVisibility, setColumnVisibility] =
    useState<VisibilityState>(DEFAULT_VISIBILITY);

  const hasActiveFilters = statusFilter.length > 0;

  const filteredData = useMemo(() => {
    return mockRateLimits.filter((item) => {
      if (statusFilter.length > 0 && !statusFilter.includes(item.status)) {
        return false;
      }

      if (search) {
        const searchLower = search.toLowerCase();
        return (
          item.name.toLowerCase().includes(searchLower) ||
          item.endpoint.toLowerCase().includes(searchLower)
        );
      }

      return true;
    });
  }, [statusFilter, search]);

  function clearAllFilters() {
    setStatusFilter([]);
  }

  return (
    <div className={TABLE_PAGE_WRAPPER}>
      <TopBar
        title="API Rate Limits"
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
              placeholder="Search rate limits..."
            />

            <div className="w-40">
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
          columnVisibility={columnVisibility}
          onColumnVisibilityChange={setColumnVisibility}
        />
      </div>
    </div>
  );
}
