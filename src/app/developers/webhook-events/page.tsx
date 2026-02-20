"use client";

import { useState, useMemo } from "react";
import { TopBar, TOPBAR_CONTROL_SIZE, TOPBAR_TOOLBAR_PILL } from "@/components/layout/TopBar";
import { TABLE_PAGE_WRAPPER, TABLE_PAGE_CONTENT } from "@/lib/constants/page-layout";
import { DataTable, TableSearch, Modal, ModalHeader, ModalBody, KeyValueTable } from "@/components/shared";
import { ColumnSettings, type ColumnConfig } from "@/components/shared/ColumnSettings";
import { dateTimeCell } from "@/lib/utils/columnHelpers";
import type { ColumnDef, VisibilityState } from "@tanstack/react-table";
import { Badge } from "@plexui/ui/components/Badge";
import { Select } from "@plexui/ui/components/Select";
import { Button } from "@plexui/ui/components/Button";

interface WebhookEvent {
  id: string;
  webhookId: string;
  eventType: string;
  url: string;
  statusCode: number;
  attempts: number;
  lastAttemptAt: string;
  createdAt: string;
  status: "delivered" | "failed" | "pending" | "retrying";
}

const mockWebhookEvents: WebhookEvent[] = [
  {
    id: "whe_001",
    webhookId: "wh_001",
    eventType: "inquiry.created",
    url: "https://api.example.com/webhooks/inquiry",
    statusCode: 200,
    attempts: 1,
    lastAttemptAt: "2025-02-20T14:30:00Z",
    createdAt: "2025-02-20T14:30:00Z",
    status: "delivered",
  },
  {
    id: "whe_002",
    webhookId: "wh_002",
    eventType: "verification.passed",
    url: "https://api.example.com/webhooks/verification",
    statusCode: 200,
    attempts: 1,
    lastAttemptAt: "2025-02-20T14:29:15Z",
    createdAt: "2025-02-20T14:29:15Z",
    status: "delivered",
  },
  {
    id: "whe_003",
    webhookId: "wh_003",
    eventType: "report.ready",
    url: "https://api.example.com/webhooks/report",
    statusCode: 500,
    attempts: 3,
    lastAttemptAt: "2025-02-20T14:28:45Z",
    createdAt: "2025-02-20T14:28:45Z",
    status: "failed",
  },
  {
    id: "whe_004",
    webhookId: "wh_001",
    eventType: "account.created",
    url: "https://api.example.com/webhooks/account",
    statusCode: 0,
    attempts: 0,
    lastAttemptAt: "2025-02-20T14:27:30Z",
    createdAt: "2025-02-20T14:27:30Z",
    status: "pending",
  },
  {
    id: "whe_005",
    webhookId: "wh_004",
    eventType: "case.opened",
    url: "https://api.example.com/webhooks/case",
    statusCode: 502,
    attempts: 2,
    lastAttemptAt: "2025-02-20T14:26:00Z",
    createdAt: "2025-02-20T14:26:00Z",
    status: "retrying",
  },
  {
    id: "whe_006",
    webhookId: "wh_005",
    eventType: "inquiry.completed",
    url: "https://api.example.com/webhooks/inquiry-complete",
    statusCode: 200,
    attempts: 1,
    lastAttemptAt: "2025-02-20T14:25:15Z",
    createdAt: "2025-02-20T14:25:15Z",
    status: "delivered",
  },
  {
    id: "whe_007",
    webhookId: "wh_006",
    eventType: "verification.failed",
    url: "https://api.example.com/webhooks/verification-fail",
    statusCode: 404,
    attempts: 2,
    lastAttemptAt: "2025-02-20T14:24:00Z",
    createdAt: "2025-02-20T14:24:00Z",
    status: "failed",
  },
  {
    id: "whe_008",
    webhookId: "wh_007",
    eventType: "workflow.triggered",
    url: "https://api.example.com/webhooks/workflow",
    statusCode: 200,
    attempts: 1,
    lastAttemptAt: "2025-02-20T14:23:30Z",
    createdAt: "2025-02-20T14:23:30Z",
    status: "delivered",
  },
  {
    id: "whe_009",
    webhookId: "wh_008",
    eventType: "case.resolved",
    url: "https://api.example.com/webhooks/case-resolved",
    statusCode: 0,
    attempts: 0,
    lastAttemptAt: "2025-02-20T14:22:45Z",
    createdAt: "2025-02-20T14:22:45Z",
    status: "pending",
  },
  {
    id: "whe_010",
    webhookId: "wh_009",
    eventType: "inquiry.created",
    url: "https://api.example.com/webhooks/inquiry-new",
    statusCode: 503,
    attempts: 4,
    lastAttemptAt: "2025-02-20T14:21:00Z",
    createdAt: "2025-02-20T14:21:00Z",
    status: "retrying",
  },
  {
    id: "whe_011",
    webhookId: "wh_010",
    eventType: "report.ready",
    url: "https://api.example.com/webhooks/report-ready",
    statusCode: 200,
    attempts: 1,
    lastAttemptAt: "2025-02-20T14:20:15Z",
    createdAt: "2025-02-20T14:20:15Z",
    status: "delivered",
  },
  {
    id: "whe_012",
    webhookId: "wh_011",
    eventType: "account.created",
    url: "https://api.example.com/webhooks/account-new",
    statusCode: 500,
    attempts: 5,
    lastAttemptAt: "2025-02-20T14:19:30Z",
    createdAt: "2025-02-20T14:19:30Z",
    status: "failed",
  },
];

const STATUS_OPTIONS = [
  { value: "delivered", label: "Delivered" },
  { value: "failed", label: "Failed" },
  { value: "pending", label: "Pending" },
  { value: "retrying", label: "Retrying" },
];

const EVENT_TYPE_OPTIONS = [
  { value: "inquiry.created", label: "Inquiry Created" },
  { value: "inquiry.completed", label: "Inquiry Completed" },
  { value: "verification.passed", label: "Verification Passed" },
  { value: "verification.failed", label: "Verification Failed" },
  { value: "report.ready", label: "Report Ready" },
  { value: "account.created", label: "Account Created" },
  { value: "case.opened", label: "Case Opened" },
  { value: "case.resolved", label: "Case Resolved" },
  { value: "workflow.triggered", label: "Workflow Triggered" },
];

const COLUMN_CONFIG: ColumnConfig[] = [
  { id: "eventType", label: "Event Type" },
  { id: "url", label: "URL" },
  { id: "statusCode", label: "Status Code" },
  { id: "status", label: "Status" },
  { id: "attempts", label: "Attempts" },
  { id: "lastAttemptAt", label: "Last Attempt" },
  { id: "createdAt", label: "Created at" },
];

const DEFAULT_VISIBILITY: VisibilityState = {
  eventType: true,
  url: true,
  statusCode: true,
  status: true,
  attempts: true,
  lastAttemptAt: true,
  createdAt: false,
};

const columns: ColumnDef<WebhookEvent, unknown>[] = [
  {
    accessorKey: "eventType",
    header: "Event Type",
    size: 220,
    cell: ({ row }) => (
      <span className="font-medium">{row.original.eventType}</span>
    ),
  },
  {
    accessorKey: "url",
    header: "URL",
    size: 280,
    cell: ({ row }) => (
      <span className="truncate text-[var(--color-text-secondary)]">
        {row.original.url}
      </span>
    ),
  },
  {
    accessorKey: "statusCode",
    header: "Status Code",
    size: 120,
    cell: ({ row }) => {
      const code = row.original.statusCode;
      if (code === 0) {
        return <span className="text-[var(--color-text-tertiary)]">—</span>;
      }
      const category = code >= 500 ? "danger" : code >= 400 ? "warning" : "success";
      return (
        <Badge color={category} variant="soft">
          {code}
        </Badge>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    size: 120,
    cell: ({ row }) => {
      const status = row.original.status;
      const colorMap: Record<string, "success" | "danger" | "warning" | "info"> = {
        delivered: "success",
        failed: "danger",
        pending: "info",
        retrying: "warning",
      };
      return (
        <Badge color={colorMap[status]} variant="soft">
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "attempts",
    header: "Attempts",
    size: 100,
    cell: ({ row }) => <span>{row.original.attempts}</span>,
  },
  {
    accessorKey: "lastAttemptAt",
    header: "Last Attempt (UTC)",
    size: 180,
    cell: dateTimeCell<WebhookEvent>((r) => r.lastAttemptAt),
  },
  {
    accessorKey: "createdAt",
    header: "Created at (UTC)",
    size: 180,
    cell: dateTimeCell<WebhookEvent>((r) => r.createdAt),
  },
];

export default function WebhookEventsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [eventTypeFilter, setEventTypeFilter] = useState<string[]>([]);
  const [columnVisibility, setColumnVisibility] =
    useState<VisibilityState>(DEFAULT_VISIBILITY);
  const [selectedEvent, setSelectedEvent] = useState<WebhookEvent | null>(null);

  const hasActiveFilters = statusFilter.length > 0 || eventTypeFilter.length > 0;

  const filteredData = useMemo(() => {
    return mockWebhookEvents.filter((event) => {
      if (statusFilter.length > 0 && !statusFilter.includes(event.status)) {
        return false;
      }

      if (eventTypeFilter.length > 0 && !eventTypeFilter.includes(event.eventType)) {
        return false;
      }

      if (search) {
        const searchLower = search.toLowerCase();
        return (
          event.eventType.toLowerCase().includes(searchLower) ||
          event.url.toLowerCase().includes(searchLower) ||
          event.webhookId.toLowerCase().includes(searchLower)
        );
      }

      return true;
    });
  }, [statusFilter, eventTypeFilter, search]);

  function clearAllFilters() {
    setStatusFilter([]);
    setEventTypeFilter([]);
  }

  return (
    <div className={TABLE_PAGE_WRAPPER}>
      <TopBar
        title="Webhook Events"
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
              placeholder="Search webhook events..."
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

            <div className="w-48">
              <Select
                multiple
                clearable
                block
                pill={TOPBAR_TOOLBAR_PILL}
                listMinWidth={220}
                options={EVENT_TYPE_OPTIONS}
                value={eventTypeFilter}
                onChange={(opts) => setEventTypeFilter(opts.map((o) => o.value))}
                placeholder="Event Type"
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
          initialSorting={[{ id: "createdAt", desc: true }]}
          columnVisibility={columnVisibility}
          onColumnVisibilityChange={setColumnVisibility}
          onRowClick={setSelectedEvent}
          mobileColumnVisibility={{
            url: false,
            lastAttemptAt: false,
            createdAt: false,
          }}
        />
      </div>

      <Modal open={!!selectedEvent} onOpenChange={(open) => { if (!open) setSelectedEvent(null); }} maxWidth="max-w-lg">
        {selectedEvent && (
          <>
            <ModalHeader>
              <h2 className="heading-sm">{selectedEvent.eventType}</h2>
            </ModalHeader>
            <ModalBody>
              <KeyValueTable
                rows={[
                  { label: "Event ID", value: selectedEvent.id },
                  { label: "Webhook ID", value: selectedEvent.webhookId },
                  { label: "Event Type", value: selectedEvent.eventType },
                  { label: "URL", value: selectedEvent.url },
                  { label: "Status", value: selectedEvent.status },
                  { label: "Status Code", value: String(selectedEvent.statusCode) },
                  { label: "Attempts", value: String(selectedEvent.attempts) },
                  { label: "Last Attempt", value: new Date(selectedEvent.lastAttemptAt).toLocaleString() },
                  { label: "Created", value: new Date(selectedEvent.createdAt).toLocaleString() },
                ]}
              />
            </ModalBody>
          </>
        )}
      </Modal>
    </div>
  );
}
