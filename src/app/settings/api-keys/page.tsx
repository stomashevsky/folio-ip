"use client";

import { useState } from "react";
import { TopBar } from "@/components/layout/TopBar";
import {
  CopyButton,
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
import { Menu } from "@plexui/ui/components/Menu";
import { DotsHorizontal, Plus } from "@plexui/ui/components/Icon";

interface ApiKeyItem {
  id: string;
  name: string;
  fullKey: string;
  maskedKey: string;
  created: string;
  lastUsed: string;
  active: boolean;
}

function generateKey() {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let key = "folio_test_";
  for (let i = 0; i < 32; i++) {
    key += chars[Math.floor(Math.random() * chars.length)];
  }
  return key;
}

function maskKey(key: string) {
  const last4 = key.slice(-4);
  return `folio_test_${"•".repeat(13)}${last4}`;
}

const initialKeys: ApiKeyItem[] = [
  {
    id: `key_${Math.random().toString(36).slice(2, 14)}`,
    name: "Default test key",
    fullKey: "folio_test_aBvf7kQ2mN9xLpR3wT5yH8jD",
    maskedKey: "folio_test_•••••••••••••aBvf",
    created: "Jan 15, 2026",
    lastUsed: "Feb 10, 2026",
    active: true,
  },
  {
    id: `key_${Math.random().toString(36).slice(2, 14)}`,
    name: "CI/CD pipeline",
    fullKey: "folio_test_qR3xkV7nW2pJ5sL8mT4yG9bF",
    maskedKey: "folio_test_•••••••••••••qR3x",
    created: "Feb 01, 2026",
    lastUsed: "Feb 09, 2026",
    active: true,
  },
  {
    id: `key_${Math.random().toString(36).slice(2, 14)}`,
    name: "Staging environment",
    fullKey: "folio_test_mN7pxK3dR9wQ2jL5vT8yH4sF",
    maskedKey: "folio_test_•••••••••••••mN7p",
    created: "Feb 05, 2026",
    lastUsed: "Never",
    active: false,
  },
];

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<ApiKeyItem[]>(initialKeys);
  const [createOpen, setCreateOpen] = useState(false);
  const [createName, setCreateName] = useState("");
  const [createdKey, setCreatedKey] = useState<{
    name: string;
    fullKey: string;
  } | null>(null);
  const [revoking, setRevoking] = useState<ApiKeyItem | null>(null);

  const handleCreate = () => {
    if (!createName.trim()) return;
    const fullKey = generateKey();
    const newKey: ApiKeyItem = {
      id: `key_${Math.random().toString(36).slice(2, 14)}`,
      name: createName.trim(),
      fullKey,
      maskedKey: maskKey(fullKey),
      created: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }),
      lastUsed: "Never",
      active: true,
    };
    setKeys((prev) => [newKey, ...prev]);
    setCreatedKey({ name: newKey.name, fullKey });
    setCreateName("");
  };

  const handleCloseCreate = () => {
    setCreateOpen(false);
    setCreateName("");
    setCreatedKey(null);
  };

  const handleToggleActive = (id: string) => {
    setKeys((prev) =>
      prev.map((k) => (k.id === id ? { ...k, active: !k.active } : k)),
    );
  };

  const handleRevoke = () => {
    if (!revoking) return;
    setKeys((prev) => prev.filter((k) => k.id !== revoking.id));
    setRevoking(null);
  };

  return (
    <div className="flex h-full flex-col overflow-auto">
      <TopBar
        title="API keys"
        actions={
          <Button
            color="primary"
            pill={false}
            size="md"
            onClick={() => setCreateOpen(true)}
          >
            <Plus />
            Create new key
          </Button>
        }
      />
      <div className="px-4 py-8 md:px-6">
        <p className="mb-6 text-sm text-[var(--color-text-secondary)]">
          API keys are used to authenticate requests to the Folio API. Keep your
          keys secret — do not share them in client-side code.
        </p>

        <SettingsTable<ApiKeyItem>
          data={keys}
          keyExtractor={(k) => k.id}
          columns={[
            {
              header: "Name",
              render: (apiKey) => (
                <span className="text-sm font-medium text-[var(--color-text)]">
                  {apiKey.name}
                </span>
              ),
            },
            {
              header: "Key",
              render: (apiKey) => (
                <div className="flex items-center gap-1">
                  <span className="font-mono text-sm text-[var(--color-text-secondary)]">
                    {apiKey.maskedKey}
                  </span>
                  <CopyButton value={apiKey.fullKey} />
                </div>
              ),
            },
            {
              header: "Created",
              render: (apiKey) => (
                <span className="text-sm text-[var(--color-text-secondary)]">
                  {apiKey.created}
                </span>
              ),
            },
            {
              header: "Last used",
              render: (apiKey) => (
                <span className="text-sm text-[var(--color-text-secondary)]">
                  {apiKey.lastUsed}
                </span>
              ),
            },
            {
              header: "Status",
              render: (apiKey) => (
                <Badge
                  color={
                    getActiveBadgeColor(apiKey.active) as
                      | "success"
                      | "secondary"
                  }
                >
                  {apiKey.active ? "Active" : "Inactive"}
                </Badge>
              ),
            },
            {
              header: "",
              align: "right" as const,
              render: (apiKey) => (
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
                    <Menu.Item
                      onSelect={() =>
                        navigator.clipboard.writeText(apiKey.fullKey)
                      }
                    >
                      Copy key
                    </Menu.Item>
                    <Menu.Item onSelect={() => handleToggleActive(apiKey.id)}>
                      {apiKey.active ? "Disable" : "Enable"}
                    </Menu.Item>
                    <Menu.Separator />
                    <Menu.Item
                      onSelect={() => setRevoking(apiKey)}
                      className="text-[var(--color-text-danger-ghost)]"
                    >
                      Revoke key
                    </Menu.Item>
                  </Menu.Content>
                </Menu>
              ),
            },
          ]}
          renderMobileCard={(apiKey) => (
            <>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-[var(--color-text)]">
                  {apiKey.name}
                </span>
                <div className="flex items-center gap-2">
                  <Badge
                    color={
                      getActiveBadgeColor(apiKey.active) as
                        | "success"
                        | "secondary"
                    }
                  >
                    {apiKey.active ? "Active" : "Inactive"}
                  </Badge>
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
                      <Menu.Item
                        onSelect={() =>
                          navigator.clipboard.writeText(apiKey.fullKey)
                        }
                      >
                        Copy key
                      </Menu.Item>
                      <Menu.Item onSelect={() => handleToggleActive(apiKey.id)}>
                        {apiKey.active ? "Disable" : "Enable"}
                      </Menu.Item>
                      <Menu.Separator />
                      <Menu.Item
                        onSelect={() => setRevoking(apiKey)}
                        className="text-[var(--color-text-danger-ghost)]"
                      >
                        Revoke key
                      </Menu.Item>
                    </Menu.Content>
                  </Menu>
                </div>
              </div>
              <div className="mt-1.5 flex items-center gap-1">
                <span className="truncate font-mono text-xs text-[var(--color-text-secondary)]">
                  {apiKey.maskedKey}
                </span>
                <CopyButton value={apiKey.fullKey} />
              </div>
              <p className="mt-1 text-xs text-[var(--color-text-tertiary)]">
                Created {apiKey.created} · Last used {apiKey.lastUsed}
              </p>
            </>
          )}
        />
      </div>

      <Modal
        open={createOpen}
        onOpenChange={(open) => {
          if (!open) handleCloseCreate();
        }}
      >
        <ModalHeader>
          <h2 className="heading-sm text-[var(--color-text)]">
            {createdKey ? "API key created" : "Create new API key"}
          </h2>
        </ModalHeader>
        <ModalBody>
          {createdKey ? (
            <>
              <p className="text-sm text-[var(--color-text-secondary)]">
                Make sure to copy your API key now. You won&apos;t be able to
                see it again.
              </p>
              <div className="flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-secondary)] px-3 py-2.5">
                <code className="min-w-0 flex-1 truncate font-mono text-sm text-[var(--color-text)]">
                  {createdKey.fullKey}
                </code>
                <CopyButton value={createdKey.fullKey} />
              </div>
            </>
          ) : (
            <Field label="Key name" size="xl">
              <Input
                value={createName}
                onChange={(e) => setCreateName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleCreate();
                }}
                size="xl"
                autoFocus
                placeholder="e.g. Production API key"
              />
            </Field>
          )}
        </ModalBody>
        <ModalFooter>
          {createdKey ? (
            <Button
              color="primary"
              size="md"
              pill={false}
              onClick={handleCloseCreate}
            >
              Done
            </Button>
          ) : (
            <>
              <Button
                color="secondary"
                variant="soft"
                size="md"
                pill={false}
                onClick={handleCloseCreate}
              >
                Cancel
              </Button>
              <Button
                color="primary"
                size="md"
                pill={false}
                onClick={handleCreate}
                disabled={!createName.trim()}
              >
                Create key
              </Button>
            </>
          )}
        </ModalFooter>
      </Modal>

      <Modal
        open={revoking !== null}
        onOpenChange={(open) => {
          if (!open) setRevoking(null);
        }}
      >
        <ModalHeader>
          <h2 className="heading-sm text-[var(--color-text)]">
            Revoke API key
          </h2>
        </ModalHeader>
        <ModalBody>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Are you sure you want to revoke the API key{" "}
            <span className="font-medium text-[var(--color-text)]">
              &ldquo;{revoking?.name}&rdquo;
            </span>
            ? This action cannot be undone. Any applications using this key will
            stop working.
          </p>
        </ModalBody>
        <ModalFooter>
          <Button
            color="secondary"
            variant="soft"
            size="md"
            pill={false}
            onClick={() => setRevoking(null)}
          >
            Cancel
          </Button>
          <Button
            color="danger"
            size="md"
            pill={false}
            onClick={handleRevoke}
          >
            Revoke
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
