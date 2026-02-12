"use client";

import { TopBar } from "@/components/layout/TopBar";
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
      <div className="px-6 py-8">
        <p className="mb-6 text-sm text-[var(--color-text-secondary)]">
          API keys are used to authenticate requests to the Folio API. Keep your
          keys secret — do not share them in client-side code.
        </p>

        <div className="overflow-hidden rounded-lg border border-[var(--color-border)]">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface-secondary)]">
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[var(--color-text-tertiary)]">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[var(--color-text-tertiary)]">
                  Key
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[var(--color-text-tertiary)]">
                  Created
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[var(--color-text-tertiary)]">
                  Last used
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[var(--color-text-tertiary)]">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {mockApiKeys.map((apiKey) => (
                <tr
                  key={apiKey.key}
                  className="border-b border-[var(--color-border)] last:border-b-0"
                >
                  <td className="px-4 py-3 text-sm font-medium text-[var(--color-text)]">
                    {apiKey.name}
                  </td>
                  <td className="px-4 py-3 font-mono text-sm text-[var(--color-text-secondary)]">
                    {apiKey.key}
                  </td>
                  <td className="px-4 py-3 text-sm text-[var(--color-text-secondary)]">
                    {apiKey.created}
                  </td>
                  <td className="px-4 py-3 text-sm text-[var(--color-text-secondary)]">
                    {apiKey.lastUsed}
                  </td>
                  <td className="px-4 py-3">
                    <Badge color={apiKey.active ? "success" : "secondary"}>
                      {apiKey.active ? "Active" : "Inactive"}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
