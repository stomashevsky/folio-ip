"use client";

import { useEffect, useState, useMemo } from "react";
import { TopBar, TOPBAR_CONTROL_SIZE, TOPBAR_TOOLBAR_PILL, TOPBAR_ACTION_PILL } from "@/components/layout/TopBar";
import { TABLE_PAGE_CONTENT } from "@/lib/constants/page-layout";
import {
  ConfirmDeleteModal,
  DataTable,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  TableSearch,
} from "@/components/shared";
import { ColumnSettings, type ColumnConfig } from "@/components/shared/ColumnSettings";
import { idCell, dateTimeCell } from "@/lib/utils/columnHelpers";
import type { ColumnDef, VisibilityState } from "@tanstack/react-table";
import { Badge } from "@plexui/ui/components/Badge";
import { Button } from "@plexui/ui/components/Button";
import { Field } from "@plexui/ui/components/Field";
import { Input } from "@plexui/ui/components/Input";
import { Menu } from "@plexui/ui/components/Menu";
import { Select } from "@plexui/ui/components/Select";
import { Tabs } from "@plexui/ui/components/Tabs";
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

// ═══════════════════════════════════════════════════════════════════════════
// Platform API Keys — types & mock data
// ═══════════════════════════════════════════════════════════════════════════

interface PlatformApiKey {
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

const mockPlatformKeys: PlatformApiKey[] = [
  {
    id: "key_abc123",
    name: "Production Backend",
    keyPrefix: "pk_live_...c1aB",
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
    keyPrefix: "pk_test_...f4eQ",
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
    keyPrefix: "pk_live_...i7wN",
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
    keyPrefix: "pk_test_...l0rX",
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
    keyPrefix: "pk_live_...o3pZ",
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

const PLATFORM_STATUS_OPTIONS = [
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

const platformColumns: ColumnDef<PlatformApiKey, unknown>[] = [
  {
    accessorKey: "name",
    header: "Name",
    size: 180,
    cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
  },
  {
    accessorKey: "keyPrefix",
    header: "Key",
    size: 180,
    cell: idCell<PlatformApiKey>((r) => r.keyPrefix),
  },
  {
    accessorKey: "environment",
    header: "Environment",
    size: 130,
    cell: ({ row }) => (
      <Badge pill color={row.original.environment === "production" ? "info" : "secondary"}
      variant="soft"
      size="sm">{row.original.environment === "production" ? "Production" : "Sandbox"}</Badge>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    size: 100,
    cell: ({ row }) => (
      <Badge pill color={row.original.status === "active" ? "success" : "danger"}
      variant="soft"
      size="sm">{row.original.status === "active" ? "Active" : "Revoked"}</Badge>
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
    cell: dateTimeCell<PlatformApiKey>((r) => r.lastUsedAt),
  },
  {
    accessorKey: "createdAt",
    header: "Created at (UTC)",
    size: 180,
    cell: dateTimeCell<PlatformApiKey>((r) => r.createdAt),
  },
  {
    id: "actions",
    header: "",
    size: 50,
    enableSorting: false,
    cell: ({ row }) => (
      <Menu>
        <Menu.Trigger>
          <Button color="secondary" variant="ghost" size="xs" uniform><DotsHorizontal /></Button>
        </Menu.Trigger>
        <Menu.Content align="end" minWidth="auto">
          <Menu.Item>Rotate key</Menu.Item>
          <Menu.Item className="text-[var(--color-text-danger-ghost)]">
            {row.original.status === "active" ? "Revoke key" : "Delete key"}
          </Menu.Item>
        </Menu.Content>
      </Menu>
    ),
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// AI Provider Keys — helpers
// ═══════════════════════════════════════════════════════════════════════════

const PROVIDER_COLUMN_CONFIG: ColumnConfig[] = [
  { id: "name", label: "Name" },
  { id: "provider", label: "Provider" },
  { id: "apiKey", label: "Key" },
  { id: "createdAt", label: "Created at" },
  { id: "active", label: "Status" },
];

const PROVIDER_DEFAULT_VISIBILITY: VisibilityState = {
  name: true,
  provider: true,
  apiKey: true,
  createdAt: true,
  active: true,
};

const AI_PROVIDER_OPTIONS = FLOW_CHAT_PROVIDER_OPTIONS.map((o) => ({ value: o.value, label: o.label }));

const PROVIDER_STATUS_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

function buildProviderColumns(onDelete: (key: StoredFlowChatKey) => void): ColumnDef<StoredFlowChatKey, unknown>[] {
  return [
    {
      accessorKey: "name",
      header: "Name",
      size: 200,
      cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
    },
    {
      accessorKey: "provider",
      header: "Provider",
      size: 120,
      cell: ({ row }) => (
        <Badge pill color="secondary" variant="soft" size="sm">{row.original.provider}</Badge>
      ),
    },
    {
      accessorKey: "apiKey",
      header: "Key",
      size: 220,
      cell: idCell<StoredFlowChatKey>((r) => maskKey(r.apiKey)),
    },
    {
      accessorKey: "createdAt",
      header: "Created at (UTC)",
      size: 180,
      cell: dateTimeCell<StoredFlowChatKey>((r) => r.createdAt),
    },
    {
      accessorKey: "active",
      header: "Status",
      size: 100,
      cell: ({ row }) => (
        <Badge pill color={row.original.active ? "success" : "danger"}
        variant="soft"
        size="sm">{row.original.active ? "Active" : "Inactive"}</Badge>
      ),
    },
    {
      id: "actions",
      header: "",
      size: 50,
      enableSorting: false,
      cell: ({ row }) => (
        <Menu>
          <Menu.Trigger>
            <Button color="secondary" variant="ghost" size="xs" uniform><DotsHorizontal /></Button>
          </Menu.Trigger>
          <Menu.Content align="end" minWidth="auto">
            <Menu.Item onSelect={() => onDelete(row.original)} className="text-[var(--color-text-danger-ghost)]">Delete key</Menu.Item>
          </Menu.Content>
        </Menu>
      ),
    },
  ];
}

function normalizeProvider(value?: string | null): FlowChatProvider {
  if (value === "groq" || value === "gemini") return value;
  return FLOW_CHAT_DEFAULT_PROVIDER;
}

function maskKey(key: string): string {
  const trimmed = key.trim();
  if (trimmed.length === 0) return "";
  if (trimmed.length <= 6) return `${trimmed.slice(0, 2)}...`;
  return `${trimmed.slice(0, 3)}...${trimmed.slice(-4)}`;
}

function parseStoredKeys(raw: string | null): StoredFlowChatKey[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (item): item is StoredFlowChatKey =>
          Boolean(
            item &&
              typeof item.id === "string" &&
              typeof item.name === "string" &&
              typeof item.provider === "string" &&
              typeof item.apiKey === "string" &&
              typeof item.createdAt === "string" &&
              typeof item.active === "boolean",
          ),
      )
      .map((item) => ({ ...item, provider: normalizeProvider(item.provider) }));
  } catch {
    return [];
  }
}

function createKeyId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") return `ai_${crypto.randomUUID()}`;
  return `ai_${Date.now()}`;
}

function ensureSingleActive(keys: StoredFlowChatKey[]): StoredFlowChatKey[] {
  const idx = keys.findIndex((k) => k.active);
  if (idx === -1) return keys.map((k, i) => ({ ...k, active: i === 0 }));
  return keys.map((k, i) => ({ ...k, active: i === idx }));
}

function persistKeys(keys: StoredFlowChatKey[]) {
  const norm = ensureSingleActive(keys);
  window.localStorage.setItem(FLOW_CHAT_KEYS_STORAGE_KEY, JSON.stringify(norm));
  const active = norm.find((k) => k.active) ?? null;
  if (!active) {
    window.localStorage.removeItem(FLOW_CHAT_ACTIVE_KEY_ID_STORAGE_KEY);
    window.localStorage.removeItem(FLOW_CHAT_PROVIDER_STORAGE_KEY);
    window.localStorage.removeItem(FLOW_CHAT_API_KEY_STORAGE_KEY);
    return;
  }
  window.localStorage.setItem(FLOW_CHAT_ACTIVE_KEY_ID_STORAGE_KEY, active.id);
  window.localStorage.setItem(FLOW_CHAT_PROVIDER_STORAGE_KEY, active.provider);
  window.localStorage.setItem(FLOW_CHAT_API_KEY_STORAGE_KEY, active.apiKey);
}

// ═══════════════════════════════════════════════════════════════════════════
// Page
// ═══════════════════════════════════════════════════════════════════════════

export default function ApiKeysPage() {
  const [activeTab, setActiveTab] = useState("platform");

  // ── Platform keys ──
  const [search, setSearch] = useState("");
  const [envFilter, setEnvFilter] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(DEFAULT_VISIBILITY);
  const hasActiveFilters = envFilter.length > 0 || statusFilter.length > 0;

  function clearAllFilters() {
    setEnvFilter([]);
    setStatusFilter([]);
  }

  const filteredPlatformKeys = useMemo(() => {
    return mockPlatformKeys.filter((key) => {
      if (envFilter.length > 0 && !envFilter.includes(key.environment)) return false;
      if (statusFilter.length > 0 && !statusFilter.includes(key.status)) return false;
      if (search) {
        const q = search.toLowerCase();
        return key.name.toLowerCase().includes(q) || key.keyPrefix.toLowerCase().includes(q);
      }
      return true;
    });
  }, [search, envFilter, statusFilter]);

  // ── AI Provider keys ──
  const [providerSearch, setProviderSearch] = useState("");
  const [providerFilter, setProviderFilter] = useState<string[]>([]);
  const [providerStatusFilter, setProviderStatusFilter] = useState<string[]>([]);
  const [providerColumnVisibility, setProviderColumnVisibility] = useState<VisibilityState>(PROVIDER_DEFAULT_VISIBILITY);
  const [providerKeys, setProviderKeys] = useState<StoredFlowChatKey[]>([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [createName, setCreateName] = useState("");
  const [createProvider, setCreateProvider] = useState<FlowChatProvider>(FLOW_CHAT_DEFAULT_PROVIDER);
  const [createApiKey, setCreateApiKey] = useState("");
  const [revoking, setRevoking] = useState<StoredFlowChatKey | null>(null);
  const providerColumns = useMemo(() => buildProviderColumns(setRevoking), []);

  const hasActiveProviderFilters = providerFilter.length > 0 || providerStatusFilter.length > 0;

  function clearProviderFilters() {
    setProviderFilter([]);
    setProviderStatusFilter([]);
  }

  const filteredProviderKeys = useMemo(() => {
    return providerKeys.filter((k) => {
      if (providerFilter.length > 0 && !providerFilter.includes(k.provider)) return false;
      if (providerStatusFilter.length > 0) {
        const status = k.active ? "active" : "inactive";
        if (!providerStatusFilter.includes(status)) return false;
      }
      if (providerSearch) {
        const q = providerSearch.toLowerCase();
        return k.name.toLowerCase().includes(q) || k.provider.toLowerCase().includes(q);
      }
      return true;
    });
  }, [providerKeys, providerSearch, providerFilter, providerStatusFilter]);

  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled) return;
      const stored = ensureSingleActive(parseStoredKeys(window.localStorage.getItem(FLOW_CHAT_KEYS_STORAGE_KEY)));
      setProviderKeys(stored);
      persistKeys(stored);
    });
    return () => { cancelled = true; };
  }, []);

  const handleCloseCreate = () => {
    setCreateOpen(false);
    setCreateName("");
    setCreateProvider(FLOW_CHAT_DEFAULT_PROVIDER);
    setCreateApiKey("");
  };

  const handleCreateProvider = () => {
    if (!createName.trim() || !createApiKey.trim()) return;
    const newKey: StoredFlowChatKey = {
      id: createKeyId(),
      name: createName.trim(),
      provider: createProvider,
      apiKey: createApiKey.trim(),
      createdAt: new Date().toISOString(),
      active: true,
    };
    const next = [newKey, ...providerKeys.map((k) => ({ ...k, active: false }))];
    setProviderKeys(next);
    persistKeys(next);
    handleCloseCreate();
  };

  const handleRevoke = () => {
    if (!revoking) return;
    const next = ensureSingleActive(providerKeys.filter((k) => k.id !== revoking.id));
    setProviderKeys(next);
    persistKeys(next);
    setRevoking(null);
  };

  // ── Tab-specific TopBar content ──
  const platformActions = (
    <div className="flex items-center gap-2">
      <ColumnSettings columns={COLUMN_CONFIG} visibility={columnVisibility} onVisibilityChange={setColumnVisibility} />
      <Button color="primary" size={TOPBAR_CONTROL_SIZE} pill={TOPBAR_ACTION_PILL}>
        <Plus />
        <span className="hidden md:inline">Create API Key</span>
      </Button>
    </div>
  );

  const providerActions = (
    <div className="flex items-center gap-2">
      <ColumnSettings columns={PROVIDER_COLUMN_CONFIG} visibility={providerColumnVisibility} onVisibilityChange={setProviderColumnVisibility} />
      <Button color="primary" pill={TOPBAR_ACTION_PILL} size={TOPBAR_CONTROL_SIZE} onClick={() => setCreateOpen(true)}>
        <Plus />
        <span className="hidden md:inline">Create Provider Key</span>
      </Button>
    </div>
  );

  const toolbar = (
    <>
      <Tabs
        aria-label="API key type"
        value={activeTab}
        onChange={setActiveTab}
        size={TOPBAR_CONTROL_SIZE}
        pill={TOPBAR_TOOLBAR_PILL}
      >
        <Tabs.Tab value="platform">Platform</Tabs.Tab>
        <Tabs.Tab value="providers">AI Providers</Tabs.Tab>
      </Tabs>

      <div className="mx-1 h-5 w-px bg-[var(--color-border)]" />

      {activeTab === "platform" && (
        <>
          <TableSearch value={search} onChange={setSearch} placeholder="Search keys..." />
          <div className="w-40">
            <Select
              multiple clearable block pill={TOPBAR_TOOLBAR_PILL} listMinWidth={180}
              options={ENVIRONMENT_OPTIONS} value={envFilter}
              onChange={(opts) => setEnvFilter(opts.map((o) => o.value))}
              placeholder="Environment" variant="outline" size={TOPBAR_CONTROL_SIZE}
            />
          </div>
          <div className="w-36">
            <Select
              multiple clearable block pill={TOPBAR_TOOLBAR_PILL} listMinWidth={160}
              options={PLATFORM_STATUS_OPTIONS} value={statusFilter}
              onChange={(opts) => setStatusFilter(opts.map((o) => o.value))}
              placeholder="Status" variant="outline" size={TOPBAR_CONTROL_SIZE}
            />
          </div>
          {hasActiveFilters && (
            <Button color="secondary" variant="soft" size={TOPBAR_CONTROL_SIZE} pill={TOPBAR_TOOLBAR_PILL} onClick={clearAllFilters}>
              Clear filters
            </Button>
          )}
        </>
      )}

      {activeTab === "providers" && (
        <>
          <TableSearch value={providerSearch} onChange={setProviderSearch} placeholder="Search providers..." />
          <div className="w-36">
            <Select
              multiple clearable block pill={TOPBAR_TOOLBAR_PILL} listMinWidth={160}
              options={AI_PROVIDER_OPTIONS} value={providerFilter}
              onChange={(opts) => setProviderFilter(opts.map((o) => o.value))}
              placeholder="Provider" variant="outline" size={TOPBAR_CONTROL_SIZE}
            />
          </div>
          <div className="w-36">
            <Select
              multiple clearable block pill={TOPBAR_TOOLBAR_PILL} listMinWidth={160}
              options={PROVIDER_STATUS_OPTIONS} value={providerStatusFilter}
              onChange={(opts) => setProviderStatusFilter(opts.map((o) => o.value))}
              placeholder="Status" variant="outline" size={TOPBAR_CONTROL_SIZE}
            />
          </div>
          {hasActiveProviderFilters && (
            <Button color="secondary" variant="soft" size={TOPBAR_CONTROL_SIZE} pill={TOPBAR_TOOLBAR_PILL} onClick={clearProviderFilters}>
              Clear filters
            </Button>
          )}
        </>
      )}
    </>
  );

  return (
    <div className="flex h-full flex-col overflow-auto">
      <TopBar
        title="API Keys"
        actions={activeTab === "platform" ? platformActions : providerActions}
        toolbar={toolbar}
      />

      {activeTab === "platform" && (
        <div className={TABLE_PAGE_CONTENT}>
          <DataTable
            data={filteredPlatformKeys} columns={platformColumns} globalFilter={search}
            pageSize={50} initialSorting={[{ id: "requestsToday", desc: true }]}
            columnVisibility={columnVisibility} onColumnVisibilityChange={setColumnVisibility}
            mobileColumnVisibility={{ requestsThisMonth: false, lastUsedAt: false, createdAt: false }}
          />
        </div>
      )}

      {activeTab === "providers" && (
        <div className={TABLE_PAGE_CONTENT}>
          <DataTable
            data={filteredProviderKeys}
            columns={providerColumns}
            globalFilter={providerSearch}
            pageSize={50}
            initialSorting={[{ id: "createdAt", desc: true }]}
            columnVisibility={providerColumnVisibility}
            onColumnVisibilityChange={setProviderColumnVisibility}
            getRowId={(row) => row.id}
          />
        </div>
      )}

      <Modal open={createOpen} onOpenChange={(open) => { if (!open) handleCloseCreate(); }}>
        <ModalHeader><h2 className="heading-sm text-[var(--color-text)]">Create provider key</h2></ModalHeader>
        <ModalBody>
          <div className="grid gap-3">
            <Field label="Name" size="xl">
              <Input value={createName} onChange={(e) => setCreateName(e.target.value)} size="xl" autoFocus placeholder="e.g. Groq primary key" />
            </Field>
            <Field label="Provider" size="xl">
              <Select options={AI_PROVIDER_OPTIONS} value={createProvider} onChange={(opt) => { if (opt) setCreateProvider(normalizeProvider(opt.value)); }} pill={false} block />
            </Field>
            <Field label="API key" size="xl">
              <Input type="text" value={createApiKey} onChange={(e) => setCreateApiKey(e.target.value)} size="xl" placeholder={createProvider === "groq" ? "gsk_..." : "AIza..."} autoComplete="off" spellCheck={false} />
            </Field>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" variant="soft" size="md" pill={false} onClick={handleCloseCreate}>Cancel</Button>
          <Button color="primary" size="md" pill={false} onClick={handleCreateProvider} disabled={!createName.trim() || !createApiKey.trim()}>Create key</Button>
        </ModalFooter>
      </Modal>

      <ConfirmDeleteModal
        open={revoking !== null}
        onOpenChange={(open) => { if (!open) setRevoking(null); }}
        title="Delete API key" confirmLabel="Delete" onConfirm={handleRevoke}
      >
        <p className="text-sm text-[var(--color-text-secondary)]">
          Delete key <span className="font-medium text-[var(--color-text)]">&ldquo;{revoking?.name}&rdquo;</span>? AI Chat will stop using it.
        </p>
      </ConfirmDeleteModal>
    </div>
  );
}
