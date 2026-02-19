"use client";

import { useEffect, useState } from "react";
import { TopBar } from "@/components/layout/TopBar";
import {
  ConfirmDeleteModal,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  SettingsTable,
} from "@/components/shared";
import { Button } from "@plexui/ui/components/Button";
import { Badge } from "@plexui/ui/components/Badge";
import { Input } from "@plexui/ui/components/Input";
import { Field } from "@plexui/ui/components/Field";
import { Menu } from "@plexui/ui/components/Menu";
import { Select } from "@plexui/ui/components/Select";
import { DotsHorizontal, Plus } from "@plexui/ui/components/Icon";
import {
  FLOW_CHAT_ACTIVE_KEY_ID_STORAGE_KEY,
  FLOW_CHAT_API_KEY_STORAGE_KEY,
  FLOW_CHAT_DEFAULT_PROVIDER,
  FLOW_CHAT_KEYS_STORAGE_KEY,
  FLOW_CHAT_PROVIDER_OPTIONS,
  FLOW_CHAT_PROVIDER_STORAGE_KEY,
} from "@/lib/constants";
import type { FlowChatProvider } from "@/lib/constants";
import type { StoredFlowChatKey } from "@/lib/types";

const AI_PROVIDER_OPTIONS = FLOW_CHAT_PROVIDER_OPTIONS.map((option) => ({
  value: option.value,
  label: option.label,
}));

function normalizeProvider(value?: string | null): FlowChatProvider {
  if (value === "groq" || value === "gemini") return value;
  return FLOW_CHAT_DEFAULT_PROVIDER;
}

function maskKey(key: string): string {
  const trimmed = key.trim();
  if (trimmed.length === 0) return "";
  if (trimmed.length <= 8) {
    return `${trimmed.slice(0, 2)}${"•".repeat(Math.max(trimmed.length - 2, 1))}`;
  }
  return `${trimmed.slice(0, 4)}${"•".repeat(8)}${trimmed.slice(-4)}`;
}

function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

function parseStoredKeys(raw: string | null): StoredFlowChatKey[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is StoredFlowChatKey => {
      return Boolean(
        item
          && typeof item.id === "string"
          && typeof item.name === "string"
          && typeof item.provider === "string"
          && typeof item.apiKey === "string"
          && typeof item.createdAt === "string"
          && typeof item.active === "boolean",
      );
    }).map((item) => ({
      ...item,
      provider: normalizeProvider(item.provider),
    }));
  } catch {
    return [];
  }
}

function createKeyId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `ai_${crypto.randomUUID()}`;
  }
  return `ai_${Date.now()}`;
}

function ensureSingleActive(keys: StoredFlowChatKey[]): StoredFlowChatKey[] {
  const activeIndex = keys.findIndex((key) => key.active);
  if (activeIndex === -1) {
    return keys.map((key, index) => ({ ...key, active: index === 0 }));
  }
  return keys.map((key, index) => ({ ...key, active: index === activeIndex }));
}

function persistKeys(keys: StoredFlowChatKey[]) {
  const normalizedKeys = ensureSingleActive(keys);
  window.localStorage.setItem(FLOW_CHAT_KEYS_STORAGE_KEY, JSON.stringify(normalizedKeys));

  const activeKey = normalizedKeys.find((key) => key.active) ?? null;
  if (!activeKey) {
    window.localStorage.removeItem(FLOW_CHAT_ACTIVE_KEY_ID_STORAGE_KEY);
    window.localStorage.removeItem(FLOW_CHAT_PROVIDER_STORAGE_KEY);
    window.localStorage.removeItem(FLOW_CHAT_API_KEY_STORAGE_KEY);
    return;
  }

  window.localStorage.setItem(FLOW_CHAT_ACTIVE_KEY_ID_STORAGE_KEY, activeKey.id);
  window.localStorage.setItem(FLOW_CHAT_PROVIDER_STORAGE_KEY, activeKey.provider);
  window.localStorage.setItem(FLOW_CHAT_API_KEY_STORAGE_KEY, activeKey.apiKey);
}

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<StoredFlowChatKey[]>([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [createName, setCreateName] = useState("");
  const [createProvider, setCreateProvider] = useState<FlowChatProvider>(FLOW_CHAT_DEFAULT_PROVIDER);
  const [createApiKey, setCreateApiKey] = useState("");
  const [revoking, setRevoking] = useState<StoredFlowChatKey | null>(null);

  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled) return;
      const storedKeys = ensureSingleActive(parseStoredKeys(window.localStorage.getItem(FLOW_CHAT_KEYS_STORAGE_KEY)));
      setKeys(storedKeys);
      persistKeys(storedKeys);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleCloseCreate = () => {
    setCreateOpen(false);
    setCreateName("");
    setCreateProvider(FLOW_CHAT_DEFAULT_PROVIDER);
    setCreateApiKey("");
  };

  const handleCreate = () => {
    if (!createName.trim() || !createApiKey.trim()) return;

    const newKey: StoredFlowChatKey = {
      id: createKeyId(),
      name: createName.trim(),
      provider: createProvider,
      apiKey: createApiKey.trim(),
      createdAt: new Date().toISOString(),
      active: true,
    };

    const nextKeys = [
      newKey,
      ...keys.map((key) => ({
        ...key,
        active: false,
      })),
    ];

    setKeys(nextKeys);
    persistKeys(nextKeys);
    handleCloseCreate();
  };

  const handleRevoke = () => {
    if (!revoking) return;

    const nextKeys = ensureSingleActive(keys.filter((key) => key.id !== revoking.id));
    setKeys(nextKeys);
    persistKeys(nextKeys);
    setRevoking(null);
  };

  return (
    <div className="flex h-full flex-col overflow-auto">
      <TopBar
        title="API keys"
        actions={
          <Button color="primary" pill={false} size="md" onClick={() => setCreateOpen(true)}>
            <Plus />
            Create new key
          </Button>
        }
      />

      <div className="px-4 py-8 md:px-6">
        <p className="mb-6 text-sm text-[var(--color-text-secondary)]">
          Manage external AI provider keys used by Template AI Chat. Keys are stored in this browser profile only.
        </p>

        <SettingsTable<StoredFlowChatKey>
          data={keys}
          keyExtractor={(key) => key.id}
          columns={[
            {
              header: "Name",
              render: (key) => (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-[var(--color-text)]">{key.name}</span>
                  <Badge color="secondary" variant="soft" size="sm">{key.provider}</Badge>
                </div>
              ),
            },
            {
              header: "Key",
              render: (key) => (
                <span className="font-mono text-sm text-[var(--color-text-secondary)]">{maskKey(key.apiKey)}</span>
              ),
            },
            {
              header: "Created",
              render: (key) => (
                <span className="text-sm text-[var(--color-text-secondary)]">{formatDate(key.createdAt)}</span>
              ),
            },
            {
              header: "Status",
              render: (key) => (
                <Badge color={key.active ? "success" : "secondary"}>{key.active ? "Active" : "Inactive"}</Badge>
              ),
            },
            {
              header: "",
              align: "right" as const,
              render: (key) => (
                <Menu>
                  <Menu.Trigger>
                    <Button color="secondary" variant="ghost" size="sm" pill={false}>
                      <DotsHorizontal />
                    </Button>
                  </Menu.Trigger>
                  <Menu.Content align="end" minWidth="auto">
                    <Menu.Item
                      onSelect={() => setRevoking(key)}
                      className="text-[var(--color-text-danger-ghost)]"
                    >
                      Delete key
                    </Menu.Item>
                  </Menu.Content>
                </Menu>
              ),
            },
          ]}
          renderMobileCard={(key) => (
            <>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-[var(--color-text)]">{key.name}</span>
                  <Badge color="secondary" variant="soft" size="sm">{key.provider}</Badge>
                </div>
                <Badge color={key.active ? "success" : "secondary"}>{key.active ? "Active" : "Inactive"}</Badge>
              </div>
              <div className="mt-1.5 flex items-center gap-1.5">
                <span className="truncate font-mono text-xs text-[var(--color-text-secondary)]">{maskKey(key.apiKey)}</span>
              </div>
              <p className="mt-1 text-xs text-[var(--color-text-tertiary)]">Created {formatDate(key.createdAt)}</p>
            </>
          )}
        />

        {keys.length === 0 && (
          <div className="mt-4 rounded-lg border border-dashed border-[var(--color-border)] px-4 py-6 text-sm text-[var(--color-text-secondary)]">
            No API keys yet. Click &quot;Create new key&quot;.
          </div>
        )}
      </div>

      <Modal
        open={createOpen}
        onOpenChange={(open) => {
          if (!open) handleCloseCreate();
        }}
      >
        <ModalHeader>
          <h2 className="heading-sm text-[var(--color-text)]">Create new API key</h2>
        </ModalHeader>
        <ModalBody>
          <div className="grid gap-3">
            <Field label="Name" size="xl">
              <Input
                value={createName}
                onChange={(event) => setCreateName(event.target.value)}
                size="xl"
                autoFocus
                placeholder="e.g. Groq primary key"
              />
            </Field>
            <Field label="Provider" size="xl">
              <Select
                options={AI_PROVIDER_OPTIONS}
                value={createProvider}
                onChange={(option) => {
                  if (option) setCreateProvider(normalizeProvider(option.value));
                }}
                pill={false}
                block
              />
            </Field>
            <Field label="API key" size="xl">
              <Input
                type="text"
                value={createApiKey}
                onChange={(event) => setCreateApiKey(event.target.value)}
                size="xl"
                placeholder={createProvider === "groq" ? "gsk_..." : "AIza..."}
                autoComplete="off"
                spellCheck={false}
              />
            </Field>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" variant="soft" size="md" pill={false} onClick={handleCloseCreate}>
            Cancel
          </Button>
          <Button
            color="primary"
            size="md"
            pill={false}
            onClick={handleCreate}
            disabled={!createName.trim() || !createApiKey.trim()}
          >
            Create key
          </Button>
        </ModalFooter>
      </Modal>

      <ConfirmDeleteModal
        open={revoking !== null}
        onOpenChange={(open) => {
          if (!open) setRevoking(null);
        }}
        title="Delete API key"
        confirmLabel="Delete"
        onConfirm={handleRevoke}
      >
        <p className="text-sm text-[var(--color-text-secondary)]">
          Delete key <span className="font-medium text-[var(--color-text)]">&ldquo;{revoking?.name}&rdquo;</span>? AI Chat will stop using it.
        </p>
      </ConfirmDeleteModal>
    </div>
  );
}
