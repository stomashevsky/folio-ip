"use client";

import { useState, useMemo } from "react";
import { TopBar, TOPBAR_CONTROL_SIZE, TOPBAR_TOOLBAR_PILL, TOPBAR_ACTION_PILL } from "@/components/layout/TopBar";
import { TABLE_PAGE_WRAPPER, TABLE_PAGE_CONTENT } from "@/lib/constants/page-layout";
import {
  DataTable,
  TableSearch,
  ConfirmDeleteModal,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "@/components/shared";
import { ColumnSettings, type ColumnConfig } from "@/components/shared/ColumnSettings";
import { getActiveBadgeColor } from "@/lib/utils/format";
import type { ColumnDef, VisibilityState } from "@tanstack/react-table";
import { Button } from "@plexui/ui/components/Button";
import { Badge } from "@plexui/ui/components/Badge";
import { Input } from "@plexui/ui/components/Input";
import { Field } from "@plexui/ui/components/Field";
import { Checkbox } from "@plexui/ui/components/Checkbox";
import { Menu } from "@plexui/ui/components/Menu";
import { DotsHorizontal, Plus } from "@plexui/ui/components/Icon";
import { Select } from "@plexui/ui/components/Select";

const WEBHOOK_EVENTS = [
  { value: "inquiry.created", label: "Inquiry created" },
  { value: "inquiry.completed", label: "Inquiry completed" },
  { value: "inquiry.failed", label: "Inquiry failed" },
  { value: "inquiry.expired", label: "Inquiry expired" },
  { value: "verification.passed", label: "Verification passed" },
  { value: "verification.failed", label: "Verification failed" },
  { value: "report.ready", label: "Report ready" },
  { value: "report.match", label: "Report match" },
  { value: "account.created", label: "Account created" },
];

interface WebhookItem {
  id: string;
  url: string;
  events: string[];
  status: "active" | "disabled";
  created: string;
}

const initialWebhooks: WebhookItem[] = [
  {
    id: `wh_${Math.random().toString(36).slice(2, 14)}`,
    url: "https://api.lunacorp.com/webhooks/identity",
    events: ["inquiry.completed", "inquiry.failed"],
    status: "active",
    created: "Jan 20, 2026",
  },
  {
    id: `wh_${Math.random().toString(36).slice(2, 14)}`,
    url: "https://staging.lunacorp.com/hooks/kyc",
    events: ["verification.passed", "verification.failed"],
    status: "active",
    created: "Feb 01, 2026",
  },
  {
    id: `wh_${Math.random().toString(36).slice(2, 14)}`,
    url: "https://old.lunacorp.com/callback",
    events: ["inquiry.completed"],
    status: "disabled",
    created: "Jan 10, 2026",
  },
];

const EMPTY_DRAFT = { url: "", events: [] as string[] };

const STATUS_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "disabled", label: "Disabled" },
];

const COLUMN_CONFIG: ColumnConfig[] = [
  { id: "url", label: "Endpoint URL" },
  { id: "events", label: "Events" },
  { id: "created", label: "Created" },
  { id: "status", label: "Status" },
  { id: "actions", label: "Actions" },
];

const DEFAULT_VISIBILITY: VisibilityState = {
  url: true,
  events: true,
  created: true,
  status: true,
  actions: true,
};

export default function WebhooksPage() {
  const [webhooks, setWebhooks] = useState<WebhookItem[]>(initialWebhooks);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<WebhookItem | null>(null);
  const [draft, setDraft] = useState<{ url: string; events: string[] }>(
    EMPTY_DRAFT,
  );
  const [deleting, setDeleting] = useState<WebhookItem | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(DEFAULT_VISIBILITY);
  const hasActiveFilters = statusFilter.length > 0;

  const openAdd = () => {
    setEditing(null);
    setDraft(EMPTY_DRAFT);
    setModalOpen(true);
  };

  const openEdit = (webhook: WebhookItem) => {
    setEditing(webhook);
    setDraft({ url: webhook.url, events: [...webhook.events] });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditing(null);
    setDraft(EMPTY_DRAFT);
  };

  const toggleEvent = (event: string) => {
    setDraft((prev) => ({
      ...prev,
      events: prev.events.includes(event)
        ? prev.events.filter((e) => e !== event)
        : [...prev.events, event],
    }));
  };

  const canSave = draft.url.trim() !== "" && draft.events.length > 0;

  const handleSave = () => {
    if (!canSave) return;
    if (editing) {
      setWebhooks((prev) =>
        prev.map((w) =>
          w.id === editing.id
            ? { ...w, url: draft.url.trim(), events: draft.events }
            : w,
        ),
      );
    } else {
      const newWebhook: WebhookItem = {
        id: `wh_${Math.random().toString(36).slice(2, 14)}`,
        url: draft.url.trim(),
        events: draft.events,
        status: "active",
        created: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        }),
      };
      setWebhooks((prev) => [...prev, newWebhook]);
    }
    closeModal();
  };

  const handleToggleStatus = (id: string) => {
    setWebhooks((prev) =>
      prev.map((w) =>
        w.id === id
          ? {
              ...w,
              status: w.status === "active" ? "disabled" : "active",
            }
          : w,
      ),
    );
  };

  const handleDelete = () => {
    if (!deleting) return;
    setWebhooks((prev) => prev.filter((w) => w.id !== deleting.id));
    setDeleting(null);
  };

  function clearAllFilters() {
    setStatusFilter([]);
  }

  const filteredData = useMemo(() => {
    let result = webhooks;
    if (statusFilter.length > 0) {
      result = result.filter((w) => statusFilter.includes(w.status));
    }
    if (search) {
      const lowerSearch = search.toLowerCase();
      result = result.filter(
        (w) =>
          w.url.toLowerCase().includes(lowerSearch) ||
          w.events.some((e) => e.toLowerCase().includes(lowerSearch)),
      );
    }
    return result;
  }, [webhooks, statusFilter, search]);

  const columns: ColumnDef<WebhookItem, unknown>[] = [
    {
      accessorKey: "url",
      header: "Endpoint URL",
      size: 300,
      cell: ({ row }) => (
        <span className="font-mono text-sm text-[var(--color-text)]">
          {row.original.url}
        </span>
      ),
    },
    {
      accessorKey: "events",
      header: "Events",
      size: 280,
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1">
          {row.original.events.map((event) => (
            <Badge pill key={event} color="secondary" variant="soft">{event}</Badge>
          ))}
        </div>
      ),
    },
    {
      accessorKey: "created",
      header: "Created",
      size: 140,
      cell: ({ row }) => (
        <span className="text-sm text-[var(--color-text-secondary)]">
          {row.original.created}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      size: 100,
      cell: ({ row }) => (
        <Badge pill color={
          getActiveBadgeColor(row.original.status === "active") as
            | "success"
            | "secondary"
        }
        variant="soft">{row.original.status === "active" ? "Active" : "Disabled"}</Badge>
      ),
    },
    {
      id: "actions",
      header: "",
      size: 60,
      cell: ({ row }) => {
        const webhook = row.original;
        return (
          <Menu>
            <Menu.Trigger>
              <Button color="secondary" variant="ghost" size="sm" pill={false}>
                <DotsHorizontal />
              </Button>
            </Menu.Trigger>
            <Menu.Content align="end" minWidth="auto">
              <Menu.Item onSelect={() => openEdit(webhook)}>Edit</Menu.Item>
              <Menu.Item onSelect={() => handleToggleStatus(webhook.id)}>
                {webhook.status === "active" ? "Disable" : "Enable"}
              </Menu.Item>
              <Menu.Separator />
              <Menu.Item
                onSelect={() => setDeleting(webhook)}
                className="text-[var(--color-text-danger-ghost)]"
              >
                Delete
              </Menu.Item>
            </Menu.Content>
          </Menu>
        );
      },
    },
  ];

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
            <Button color="primary" pill={TOPBAR_ACTION_PILL} size={TOPBAR_CONTROL_SIZE} onClick={openAdd}>
              <Plus />
              <span className="hidden md:inline">Add Endpoint</span>
            </Button>
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
          columnVisibility={columnVisibility}
          onColumnVisibilityChange={setColumnVisibility}
          mobileColumnVisibility={{
            events: false,
            created: false,
          }}
        />
      </div>

      <Modal
        open={modalOpen}
        onOpenChange={(open) => {
          if (!open) closeModal();
        }}
        maxWidth="max-w-lg"
      >
        <ModalHeader>
          <h2 className="heading-sm text-[var(--color-text)]">
            {editing ? "Edit endpoint" : "Add endpoint"}
          </h2>
        </ModalHeader>
        <ModalBody>
          <Field label="Endpoint URL" size="xl">
            <Input
              value={draft.url}
              onChange={(e) =>
                setDraft((prev) => ({ ...prev, url: e.target.value }))
              }
              size="xl"
              autoFocus
              placeholder="https://example.com/webhooks"
            />
          </Field>
          <div>
            <p className="mb-3 text-sm font-medium text-[var(--color-text)]">
              Events
            </p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {WEBHOOK_EVENTS.map((event) => (
                <Checkbox
                  key={event.value}
                  checked={draft.events.includes(event.value)}
                  onCheckedChange={() => toggleEvent(event.value)}
                  label={event.label}
                />
              ))}
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            color="secondary"
            variant="soft"
            size="md"
            pill={false}
            onClick={closeModal}
          >
            Cancel
          </Button>
          <Button
            color="primary"
            size="md"
            pill={false}
            onClick={handleSave}
            disabled={!canSave}
          >
            {editing ? "Save changes" : "Add endpoint"}
          </Button>
        </ModalFooter>
      </Modal>

      <ConfirmDeleteModal
        open={deleting !== null}
        onOpenChange={(open) => { if (!open) setDeleting(null); }}
        title="Delete webhook"
        confirmLabel="Delete"
        onConfirm={handleDelete}
      >
        <p className="text-sm text-[var(--color-text-secondary)]">
          Are you sure you want to delete the endpoint{" "}
          <span className="font-mono font-medium text-[var(--color-text)]">
            {deleting?.url}
          </span>
          ? It will no longer receive event notifications.
        </p>
      </ConfirmDeleteModal>
    </div>
  );
}
