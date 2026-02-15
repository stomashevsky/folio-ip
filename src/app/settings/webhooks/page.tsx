"use client";

import { useState } from "react";
import { TopBar } from "@/components/layout/TopBar";
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  SettingsTable,
} from "@/components/shared";
import { getActiveBadgeColor } from "@/lib/utils/format";
import { Button } from "@plexui/ui/components/Button";
import { Badge } from "@plexui/ui/components/Badge";
import { Input } from "@plexui/ui/components/Input";
import { Field } from "@plexui/ui/components/Field";
import { Checkbox } from "@plexui/ui/components/Checkbox";
import { Menu } from "@plexui/ui/components/Menu";
import { DotsHorizontal, Plus } from "@plexui/ui/components/Icon";

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
    url: "https://api.lunacorp.com/webhooks/persona",
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

export default function WebhooksPage() {
  const [webhooks, setWebhooks] = useState<WebhookItem[]>(initialWebhooks);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<WebhookItem | null>(null);
  const [draft, setDraft] = useState<{ url: string; events: string[] }>(
    EMPTY_DRAFT,
  );
  const [deleting, setDeleting] = useState<WebhookItem | null>(null);

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

  return (
    <div className="flex h-full flex-col overflow-auto">
      <TopBar
        title="Webhooks"
        actions={
          <Button color="primary" pill={false} size="md" onClick={openAdd}>
            <Plus />
            Add endpoint
          </Button>
        }
      />
      <div className="px-4 py-8 md:px-6">
        <p className="mb-6 text-sm text-[var(--color-text-secondary)]">
          Webhook endpoints receive real-time notifications when events occur in
          your organization.
        </p>

        <SettingsTable<WebhookItem>
          data={webhooks}
          keyExtractor={(w) => w.id}
          columns={[
            {
              header: "Endpoint URL",
              render: (webhook) => (
                <span className="font-mono text-sm text-[var(--color-text)]">
                  {webhook.url}
                </span>
              ),
            },
            {
              header: "Events",
              render: (webhook) => (
                <div className="flex flex-wrap gap-1">
                  {webhook.events.map((event) => (
                    <Badge key={event} color="secondary">
                      {event}
                    </Badge>
                  ))}
                </div>
              ),
            },
            {
              header: "Created",
              render: (webhook) => (
                <span className="text-sm text-[var(--color-text-secondary)]">
                  {webhook.created}
                </span>
              ),
            },
            {
              header: "Status",
              render: (webhook) => (
                <Badge
                  color={
                    getActiveBadgeColor(webhook.status === "active") as
                      | "success"
                      | "secondary"
                  }
                >
                  {webhook.status === "active" ? "Active" : "Disabled"}
                </Badge>
              ),
            },
            {
              header: "",
              align: "right" as const,
              render: (webhook) => (
                <Menu>
                  <Menu.Trigger>
                    <Button
                      color="secondary"
                      variant="ghost"
                      size="sm"
                      pill={false}
                    >
                      <DotsHorizontal />
                    </Button>
                  </Menu.Trigger>
                  <Menu.Content align="end" minWidth="auto">
                    <Menu.Item onSelect={() => openEdit(webhook)}>
                      Edit
                    </Menu.Item>
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
              ),
            },
          ]}
          renderMobileCard={(webhook) => (
            <>
              <div className="flex items-center justify-between">
                <Badge
                  color={
                    getActiveBadgeColor(webhook.status === "active") as
                      | "success"
                      | "secondary"
                  }
                >
                  {webhook.status === "active" ? "Active" : "Disabled"}
                </Badge>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[var(--color-text-tertiary)]">
                    {webhook.created}
                  </span>
                  <Menu>
                    <Menu.Trigger>
                      <Button
                        color="secondary"
                        variant="ghost"
                        size="sm"
                      >
                        <DotsHorizontal />
                      </Button>
                    </Menu.Trigger>
                    <Menu.Content align="end" minWidth="auto">
                      <Menu.Item onSelect={() => openEdit(webhook)}>
                        Edit
                      </Menu.Item>
                      <Menu.Item
                        onSelect={() => handleToggleStatus(webhook.id)}
                      >
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
                </div>
              </div>
              <p className="mt-1.5 truncate font-mono text-xs text-[var(--color-text)]">
                {webhook.url}
              </p>
              <div className="mt-2 flex flex-wrap gap-1">
                {webhook.events.map((event) => (
                  <Badge key={event} color="secondary">
                    {event}
                  </Badge>
                ))}
              </div>
            </>
          )}
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

      <Modal
        open={deleting !== null}
        onOpenChange={(open) => {
          if (!open) setDeleting(null);
        }}
      >
        <ModalHeader>
          <h2 className="heading-sm text-[var(--color-text)]">
            Delete webhook
          </h2>
        </ModalHeader>
        <ModalBody>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Are you sure you want to delete the endpoint{" "}
            <span className="font-mono font-medium text-[var(--color-text)]">
              {deleting?.url}
            </span>
            ? It will no longer receive event notifications.
          </p>
        </ModalBody>
        <ModalFooter>
          <Button
            color="secondary"
            variant="soft"
            size="md"
            pill={false}
            onClick={() => setDeleting(null)}
          >
            Cancel
          </Button>
          <Button
            color="danger"
            size="md"
            pill={false}
            onClick={handleDelete}
          >
            Delete
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
