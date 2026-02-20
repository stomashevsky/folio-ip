"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { TopBar, TOPBAR_CONTROL_SIZE, TOPBAR_TOOLBAR_PILL, TOPBAR_ACTION_PILL } from "@/components/layout/TopBar";
import { TABLE_PAGE_WRAPPER, TABLE_PAGE_CONTENT } from "@/lib/constants/page-layout";
import { DataTable, TableSearch, ColumnSettings } from "@/components/shared";
import type { ColumnConfig } from "@/components/shared/ColumnSettings";
import type { ColumnDef, VisibilityState } from "@tanstack/react-table";
import { Badge } from "@plexui/ui/components/Badge";
import { Select } from "@plexui/ui/components/Select";
import { Button } from "@plexui/ui/components/Button";
import { Plus } from "@plexui/ui/components/Icon";

interface DeveloperWebhook {
  id: string;
  url: string;
  status: "active" | "disabled";
  events: string[];
  successRate: number;
  totalDeliveries: number;
  failedDeliveries: number;
  lastDeliveryAt: string;
  avgResponseTime: number;
  createdAt: string;
}

const mockWebhooks: DeveloperWebhook[] = [
  {
    id: "wh_001",
    url: "https://api.lunacorp.com/webhooks/persona",
    status: "active",
    events: ["inquiry.completed", "inquiry.failed"],
    successRate: 99.8,
    totalDeliveries: 12450,
    failedDeliveries: 25,
    lastDeliveryAt: "2026-02-20T14:28:00Z",
    avgResponseTime: 145,
    createdAt: "2025-06-15T10:00:00Z",
  },
  {
    id: "wh_002",
    url: "https://staging.lunacorp.com/hooks/kyc",
    status: "active",
    events: ["verification.passed", "verification.failed"],
    successRate: 98.5,
    totalDeliveries: 8920,
    failedDeliveries: 134,
    lastDeliveryAt: "2026-02-20T13:45:00Z",
    avgResponseTime: 210,
    createdAt: "2025-08-20T14:30:00Z",
  },
  {
    id: "wh_003",
    url: "https://old.lunacorp.com/callback",
    status: "disabled",
    events: ["inquiry.completed"],
    successRate: 85.2,
    totalDeliveries: 3200,
    failedDeliveries: 474,
    lastDeliveryAt: "2026-01-15T10:00:00Z",
    avgResponseTime: 890,
    createdAt: "2025-03-01T08:00:00Z",
  },
  {
    id: "wh_004",
    url: "https://api.lunacorp.com/hooks/reports",
    status: "active",
    events: ["report.ready", "report.match"],
    successRate: 100,
    totalDeliveries: 456,
    failedDeliveries: 0,
    lastDeliveryAt: "2026-02-20T12:30:00Z",
    avgResponseTime: 98,
    createdAt: "2025-11-12T11:00:00Z",
  },
  {
    id: "wh_005",
    url: "https://api.lunacorp.com/hooks/accounts",
    status: "active",
    events: ["account.created", "inquiry.completed", "verification.passed"],
    successRate: 97.3,
    totalDeliveries: 5670,
    failedDeliveries: 153,
    lastDeliveryAt: "2026-02-20T14:10:00Z",
    avgResponseTime: 178,
    createdAt: "2025-09-05T09:00:00Z",
  },
];

const STATUS_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "disabled", label: "Disabled" },
];

const COLUMN_CONFIG: ColumnConfig[] = [
  { id: "url", label: "URL" },
  { id: "status", label: "Status" },
  { id: "events", label: "Events" },
  { id: "successRate", label: "Success rate" },
  { id: "totalDeliveries", label: "Deliveries" },
  { id: "avgResponseTime", label: "Avg response" },
  { id: "lastDeliveryAt", label: "Last delivery" },
];

const DEFAULT_VISIBILITY: VisibilityState = {
  url: true,
  status: true,
  events: true,
  successRate: true,
  totalDeliveries: true,
  avgResponseTime: true,
  lastDeliveryAt: true,
};

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

const columns: ColumnDef<DeveloperWebhook, unknown>[] = [
  {
    accessorKey: "url",
    header: "URL",
    size: 300,
    cell: ({ row }) => (
      <span className="font-mono text-sm text-[var(--color-text-secondary)] truncate block max-w-[280px]">
        {row.original.url}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    size: 100,
    cell: ({ row }) => (
      <Badge
        color={row.original.status === "active" ? "success" : "secondary"}
        variant="soft"
        size="sm"
      >
        {row.original.status === "active" ? "Active" : "Disabled"}
      </Badge>
    ),
  },
  {
    accessorKey: "events",
    header: "Events",
    size: 200,
    cell: ({ row }) => {
      const events = row.original.events;
      const displayed = events.slice(0, 2).join(", ");
      const remaining = events.length - 2;
      return (
        <span className="text-[var(--color-text-secondary)]">
          {displayed}
          {remaining > 0 ? ` +${remaining} more` : ""}
        </span>
      );
    },
  },
  {
    accessorKey: "successRate",
    header: "Success rate",
    size: 120,
    cell: ({ row }) => {
      const rate = row.original.successRate;
      const color = rate >= 99 ? "success" : rate >= 95 ? "warning" : "danger";
      return (
        <Badge color={color} variant="soft" size="sm">
          {rate}%
        </Badge>
      );
    },
  },
  {
    accessorKey: "totalDeliveries",
    header: "Deliveries",
    size: 120,
    cell: ({ row }) => (
      <span className="tabular-nums">
        {row.original.totalDeliveries.toLocaleString()}
      </span>
    ),
  },
  {
    accessorKey: "avgResponseTime",
    header: "Avg response",
    size: 130,
    cell: ({ row }) => (
      <span className="tabular-nums">{row.original.avgResponseTime}ms</span>
    ),
  },
  {
    accessorKey: "lastDeliveryAt",
    header: "Last delivery",
    size: 180,
    cell: ({ row }) => (
      <span className="text-[var(--color-text-secondary)]">
        {formatDateTime(row.original.lastDeliveryAt)}
      </span>
    ),
  },
];

export default function DeveloperWebhooksPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(DEFAULT_VISIBILITY);

  const hasActiveFilters = statusFilter.length > 0;

  function clearAllFilters() {
    setStatusFilter([]);
  }

  const filteredData = useMemo(() => {
    return mockWebhooks.filter((wh) => {
      if (statusFilter.length > 0 && !statusFilter.includes(wh.status)) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          wh.url.toLowerCase().includes(q) ||
          wh.events.some((e) => e.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [search, statusFilter]);

  return (
    <div className={TABLE_PAGE_WRAPPER}>
      <TopBar
        title="Webhooks"
        actions={
          <div className="flex items-center gap-2">
            <ColumnSettings
              columns={COLUMN_CONFIG}
              visibility={columnVisibility}
              onVisibilityChange={setColumnVisibility}
            />
            <Link href="/settings/webhooks">
              <Button
                color="primary"
                size={TOPBAR_CONTROL_SIZE}
                pill={TOPBAR_ACTION_PILL}
              >
                <Plus />
                <span className="hidden md:inline">Manage Webhooks</span>
              </Button>
            </Link>
          </div>
        }
        toolbar={
          <>
            <TableSearch
              value={search}
              onChange={setSearch}
              placeholder="Search webhooks..."
            />
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
          initialSorting={[{ id: "totalDeliveries", desc: true }]}
          columnVisibility={columnVisibility}
          onColumnVisibilityChange={setColumnVisibility}
          mobileColumnVisibility={{
            avgResponseTime: false,
            lastDeliveryAt: false,
          }}
        />
      </div>
    </div>
  );
}
