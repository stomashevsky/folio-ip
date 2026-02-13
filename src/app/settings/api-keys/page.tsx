"use client";

import { TopBar } from "@/components/layout/TopBar";
import { SettingsTable } from "@/components/shared";
import { getActiveBadgeColor } from "@/lib/utils/format";
import { Button } from "@plexui/ui/components/Button";
import { Badge } from "@plexui/ui/components/Badge";
import { Plus } from "@plexui/ui/components/Icon";

const mockApiKeys = [
  {
    name: "Default test key",
    key: "sk_test_•••••••••••••aBvf",
    created: "Jan 15, 2026",
    lastUsed: "Feb 10, 2026",
    active: true,
  },
  {
    name: "CI/CD pipeline",
    key: "sk_test_•••••••••••••qR3x",
    created: "Feb 01, 2026",
    lastUsed: "Feb 09, 2026",
    active: true,
  },
  {
    name: "Staging environment",
    key: "sk_test_•••••••••••••mN7p",
    created: "Feb 05, 2026",
    lastUsed: "Never",
    active: false,
  },
];

type ApiKey = (typeof mockApiKeys)[number];

export default function ApiKeysPage() {
  return (
    <div className="flex h-full flex-col overflow-auto">
      <TopBar
        title="API keys"
        actions={
          <Button color="primary" pill={false} size="md">
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

        <SettingsTable<ApiKey>
          data={mockApiKeys}
          keyExtractor={(k) => k.key}
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
                <span className="font-mono text-sm text-[var(--color-text-secondary)]">
                  {apiKey.key}
                </span>
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
                <Badge color={getActiveBadgeColor(apiKey.active) as "success" | "secondary"}>
                  {apiKey.active ? "Active" : "Inactive"}
                </Badge>
              ),
            },
          ]}
          renderMobileCard={(apiKey) => (
            <>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-[var(--color-text)]">
                  {apiKey.name}
                </span>
                <Badge color={getActiveBadgeColor(apiKey.active) as "success" | "secondary"}>
                  {apiKey.active ? "Active" : "Inactive"}
                </Badge>
              </div>
              <p className="mt-1.5 truncate font-mono text-xs text-[var(--color-text-secondary)]">
                {apiKey.key}
              </p>
              <p className="mt-1 text-xs text-[var(--color-text-tertiary)]">
                Created {apiKey.created} · Last used {apiKey.lastUsed}
              </p>
            </>
          )}
        />
      </div>
    </div>
  );
}
