"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { TopBar, TOPBAR_CONTROL_SIZE, TOPBAR_ACTION_PILL } from "@/components/layout/TopBar";
import { NotFoundPage, SectionHeading } from "@/components/shared";
import { DataTable } from "@/components/shared";
import { Badge } from "@plexui/ui/components/Badge";
import { Button } from "@plexui/ui/components/Button";
import { Input } from "@plexui/ui/components/Input";
import { Field } from "@plexui/ui/components/Field";
import { Switch } from "@plexui/ui/components/Switch";
import { Checkbox } from "@plexui/ui/components/Checkbox";
import type { ColumnDef } from "@tanstack/react-table";

interface DeveloperWebhook {
  id: string;
  url: string;
  status: "active" | "disabled";
  description: string;
  events: string[];
  successRate: number;
  totalDeliveries: number;
  failedDeliveries: number;
  lastDeliveryAt: string;
  avgResponseTime: number;
  secret: string;
  createdAt: string;
}

interface DeliveryAttempt {
  id: string;
  eventType: string;
  statusCode: number;
  responseTime: number;
  success: boolean;
  deliveredAt: string;
  requestBody: string;
}

const EVENT_GROUPS: Record<string, string[]> = {
  Inquiry: [
    "inquiry.created",
    "inquiry.completed",
    "inquiry.failed",
    "inquiry.expired",
    "inquiry.approved",
    "inquiry.declined",
  ],
  Verification: [
    "verification.initiated",
    "verification.submitted",
    "verification.passed",
    "verification.failed",
    "verification.requires_retry",
  ],
  Report: [
    "report.pending",
    "report.ready",
    "report.match",
    "report.no_match",
  ],
  Account: [
    "account.created",
    "account.archived",
    "account.restored",
    "account.tag_added",
  ],
  Case: [
    "case.created",
    "case.resolved",
    "case.escalated",
  ],
  Transaction: [
    "transaction.created",
    "transaction.approved",
    "transaction.declined",
  ],
};

const MOCK_WEBHOOKS: DeveloperWebhook[] = [
  {
    id: "wh_001",
    url: "https://api.lunacorp.com/webhooks/persona",
    status: "active",
    description: "Production webhook for inquiry lifecycle events",
    events: ["inquiry.completed", "inquiry.failed", "inquiry.approved", "inquiry.declined"],
    successRate: 99.8,
    totalDeliveries: 12450,
    failedDeliveries: 25,
    lastDeliveryAt: "2026-02-20T14:28:00Z",
    avgResponseTime: 145,
    secret: "whsec_abc123def456",
    createdAt: "2025-06-15T10:00:00Z",
  },
  {
    id: "wh_002",
    url: "https://staging.lunacorp.com/hooks/kyc",
    status: "active",
    description: "Staging webhook for verification events",
    events: ["verification.passed", "verification.failed"],
    successRate: 98.5,
    totalDeliveries: 8920,
    failedDeliveries: 134,
    lastDeliveryAt: "2026-02-20T13:45:00Z",
    avgResponseTime: 210,
    secret: "whsec_staging789",
    createdAt: "2025-08-20T14:30:00Z",
  },
  {
    id: "wh_003",
    url: "https://old.lunacorp.com/callback",
    status: "disabled",
    description: "Legacy callback endpoint (deprecated)",
    events: ["inquiry.completed"],
    successRate: 85.2,
    totalDeliveries: 3200,
    failedDeliveries: 474,
    lastDeliveryAt: "2026-01-15T10:00:00Z",
    avgResponseTime: 890,
    secret: "whsec_old_legacy",
    createdAt: "2025-03-01T08:00:00Z",
  },
  {
    id: "wh_004",
    url: "https://api.lunacorp.com/hooks/reports",
    status: "active",
    description: "Report webhook for watchlist and background check results",
    events: ["report.ready", "report.match"],
    successRate: 100,
    totalDeliveries: 456,
    failedDeliveries: 0,
    lastDeliveryAt: "2026-02-20T12:30:00Z",
    avgResponseTime: 98,
    secret: "whsec_reports456",
    createdAt: "2025-11-12T11:00:00Z",
  },
  {
    id: "wh_005",
    url: "https://api.lunacorp.com/hooks/accounts",
    status: "active",
    description: "Account lifecycle and multi-event webhook",
    events: ["account.created", "inquiry.completed", "verification.passed"],
    successRate: 97.3,
    totalDeliveries: 5670,
    failedDeliveries: 153,
    lastDeliveryAt: "2026-02-20T14:10:00Z",
    avgResponseTime: 178,
    secret: "whsec_accounts012",
    createdAt: "2025-09-05T09:00:00Z",
  },
];

function generateDeliveries(webhookId: string): DeliveryAttempt[] {
  const events = ["inquiry.completed", "verification.passed", "report.ready", "account.created", "inquiry.failed"];
  const statuses = [200, 200, 200, 200, 200, 200, 200, 500, 502, 408];
  return Array.from({ length: 20 }, (_, i) => {
    const statusCode = statuses[i % statuses.length];
    return {
      id: `del_${webhookId}_${String(i + 1).padStart(3, "0")}`,
      eventType: events[i % events.length],
      statusCode,
      responseTime: Math.floor(Math.random() * 400) + 50,
      success: statusCode >= 200 && statusCode < 300,
      deliveredAt: new Date(Date.now() - i * 3600000).toISOString(),
      requestBody: `{"event":"${events[i % events.length]}","data":{"id":"obj_${String(i).padStart(3, "0")}"}}`,
    };
  });
}

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

function formatRelative(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

const deliveryColumns: ColumnDef<DeliveryAttempt, unknown>[] = [
  {
    accessorKey: "eventType",
    header: "Event",
    size: 200,
    cell: ({ row }) => (
      <span className="font-mono text-xs text-[var(--color-text-secondary)]">
        {row.original.eventType}
      </span>
    ),
  },
  {
    accessorKey: "statusCode",
    header: "Status",
    size: 100,
    cell: ({ row }) => {
      const code = row.original.statusCode;
      const color = code >= 200 && code < 300 ? "success" : "danger";
      return (
        <Badge color={color} variant="soft" size="sm">
          {code}
        </Badge>
      );
    },
  },
  {
    accessorKey: "responseTime",
    header: "Response time",
    size: 120,
    cell: ({ row }) => (
      <span className="tabular-nums text-sm">{row.original.responseTime}ms</span>
    ),
  },
  {
    accessorKey: "success",
    header: "Result",
    size: 100,
    cell: ({ row }) => (
      <Badge
        color={row.original.success ? "success" : "danger"}
        variant="soft"
        size="sm"
      >
        {row.original.success ? "Success" : "Failed"}
      </Badge>
    ),
  },
  {
    accessorKey: "deliveredAt",
    header: "Delivered",
    size: 150,
    cell: ({ row }) => (
      <span className="text-sm text-[var(--color-text-secondary)]">
        {formatRelative(row.original.deliveredAt)}
      </span>
    ),
  },
];

export default function WebhookDetailPage() {
  const params = useParams();
  const webhook = MOCK_WEBHOOKS.find((w) => w.id === params.id);
  const [selectedEvents, setSelectedEvents] = useState<Set<string>>(
    new Set(webhook?.events ?? [])
  );
  const [isEnabled, setIsEnabled] = useState(webhook?.status === "active");

  const deliveries = useMemo(
    () => (webhook ? generateDeliveries(webhook.id) : []),
    [webhook]
  );

  if (!webhook) {
    return (
      <NotFoundPage
        section="Webhooks"
        backHref="/settings/webhooks"
        entity="Webhook"
      />
    );
  }

  function toggleEvent(event: string) {
    setSelectedEvents((prev) => {
      const next = new Set(prev);
      if (next.has(event)) next.delete(event);
      else next.add(event);
      return next;
    });
  }

  function toggleGroup(group: string) {
    const events = EVENT_GROUPS[group];
    const allSelected = events.every((e) => selectedEvents.has(e));
    setSelectedEvents((prev) => {
      const next = new Set(prev);
      for (const e of events) {
        if (allSelected) next.delete(e);
        else next.add(e);
      }
      return next;
    });
  }

  const successColor =
    webhook.successRate >= 99
      ? "success"
      : webhook.successRate >= 95
        ? "warning"
        : "danger";

  return (
    <div className="flex h-full flex-col overflow-auto">
      <TopBar
        title={webhook.url.replace(/^https?:\/\//, "")}
        backHref="/settings/webhooks"
        actions={
          <div className="flex items-center gap-2">
            <Badge
              color={isEnabled ? "success" : "secondary"}
              variant="soft"
              size="sm"
            >
              {isEnabled ? "Active" : "Disabled"}
            </Badge>
            <Button
              color="primary"
              size={TOPBAR_CONTROL_SIZE}
              pill={TOPBAR_ACTION_PILL}
            >
              Save Changes
            </Button>
          </div>
        }
      />

      <div className="mx-auto w-full max-w-3xl px-4 py-8 md:px-6">
        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="rounded-lg border border-[var(--color-border)] p-4">
            <p className="text-xs text-[var(--color-text-tertiary)]">
              Success Rate
            </p>
            <p className="heading-md mt-1">
              <Badge color={successColor} variant="soft" size="md">
                {webhook.successRate}%
              </Badge>
            </p>
          </div>
          <div className="rounded-lg border border-[var(--color-border)] p-4">
            <p className="text-xs text-[var(--color-text-tertiary)]">
              Total Deliveries
            </p>
            <p className="heading-md mt-1 tabular-nums">
              {webhook.totalDeliveries.toLocaleString()}
            </p>
          </div>
          <div className="rounded-lg border border-[var(--color-border)] p-4">
            <p className="text-xs text-[var(--color-text-tertiary)]">
              Failed
            </p>
            <p className="heading-md mt-1 tabular-nums text-[var(--color-danger-solid-bg)]">
              {webhook.failedDeliveries.toLocaleString()}
            </p>
          </div>
          <div className="rounded-lg border border-[var(--color-border)] p-4">
            <p className="text-xs text-[var(--color-text-tertiary)]">
              Avg Response
            </p>
            <p className="heading-md mt-1 tabular-nums">
              {webhook.avgResponseTime}ms
            </p>
          </div>
        </div>

        <SectionHeading size="xs">Configuration</SectionHeading>
        <div className="mt-4 space-y-4">
          <Field label="Endpoint URL">
            <Input defaultValue={webhook.url} size="sm" />
          </Field>
          <Field label="Description">
            <Input defaultValue={webhook.description} size="sm" />
          </Field>
          <Field
            label="Signing Secret"
            description="Used to verify webhook signatures"
          >
            <Input defaultValue={webhook.secret} size="sm" type="password" />
          </Field>
          <Switch
            checked={isEnabled}
            onCheckedChange={setIsEnabled}
            label="Webhook enabled"
          />
        </div>

        <div className="mt-10">
          <SectionHeading size="xs">Event Subscriptions</SectionHeading>
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
            Select which events trigger this webhook.{" "}
            <span className="font-medium">
              {selectedEvents.size} event
              {selectedEvents.size !== 1 ? "s" : ""} selected
            </span>
          </p>
          <div className="mt-4 space-y-6">
            {Object.entries(EVENT_GROUPS).map(([group, events]) => {
              const allSelected = events.every((e) => selectedEvents.has(e));
              const _someSelected =
                !allSelected && events.some((e) => selectedEvents.has(e));
              return (
                <div key={group}>
                  <Checkbox
                    checked={allSelected}
                    onCheckedChange={() => toggleGroup(group)}
                    label={group}
                  />
                  <div className="ml-6 mt-2 space-y-1.5">
                    {events.map((event) => (
                      <Checkbox
                        key={event}
                        checked={selectedEvents.has(event)}
                        onCheckedChange={() => toggleEvent(event)}
                        label={
                          <span className="font-mono text-xs">{event}</span>
                        }
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-10">
          <SectionHeading size="xs">Recent Deliveries</SectionHeading>
          <p className="mt-1 mb-4 text-sm text-[var(--color-text-secondary)]">
            Last {deliveries.length} delivery attempts. Last delivery:{" "}
            {formatDateTime(webhook.lastDeliveryAt)}
          </p>
          <DataTable
            data={deliveries}
            columns={deliveryColumns}
            pageSize={10}
            initialSorting={[{ id: "deliveredAt", desc: true }]}
          />
        </div>

        <div className="mt-10 border-t border-[var(--color-border)] pt-6">
          <div className="flex items-center justify-between text-sm text-[var(--color-text-tertiary)]">
            <span>Created {formatDateTime(webhook.createdAt)}</span>
            <span>ID: {webhook.id}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
