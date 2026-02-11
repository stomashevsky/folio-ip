"use client";

import { TopBar } from "@/components/layout/TopBar";
import { Button } from "@plexui/ui/components/Button";
import { Badge } from "@plexui/ui/components/Badge";
import { Plus } from "@plexui/ui/components/Icon";

const mockWebhooks = [
  {
    url: "https://api.acmecorp.com/webhooks/persona",
    events: ["inquiry.completed", "inquiry.failed"],
    status: "active" as const,
    created: "Jan 20, 2026",
  },
  {
    url: "https://staging.acmecorp.com/hooks/kyc",
    events: ["verification.passed", "verification.failed"],
    status: "active" as const,
    created: "Feb 01, 2026",
  },
  {
    url: "https://old.acmecorp.com/callback",
    events: ["inquiry.completed"],
    status: "disabled" as const,
    created: "Jan 10, 2026",
  },
];

export default function WebhooksPage() {
  return (
    <div className="flex h-full flex-col overflow-auto">
      <TopBar
        title="Webhooks"
        actions={
          <Button color="primary" pill={false} size="sm">
            <Plus />
            Add endpoint
          </Button>
        }
      />
      <div className="px-6 py-8">
        <p className="mb-6 text-sm text-[var(--color-text-secondary)]">
          Webhook endpoints receive real-time notifications when events occur in
          your organization.
        </p>

        <div className="overflow-hidden rounded-lg border border-[var(--color-border)]">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface-secondary)]">
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[var(--color-text-tertiary)]">
                  Endpoint URL
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[var(--color-text-tertiary)]">
                  Events
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[var(--color-text-tertiary)]">
                  Created
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[var(--color-text-tertiary)]">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {mockWebhooks.map((webhook) => (
                <tr
                  key={webhook.url}
                  className="border-b border-[var(--color-border)] last:border-b-0"
                >
                  <td className="px-4 py-3 font-mono text-sm text-[var(--color-text)]">
                    {webhook.url}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {webhook.events.map((event) => (
                        <Badge key={event} color="secondary">
                          {event}
                        </Badge>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-[var(--color-text-secondary)]">
                    {webhook.created}
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      color={
                        webhook.status === "active" ? "success" : "secondary"
                      }
                    >
                      {webhook.status === "active" ? "Active" : "Disabled"}
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
