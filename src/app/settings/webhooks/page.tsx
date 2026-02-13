"use client";

import { TopBar } from "@/components/layout/TopBar";
import { SettingsTable } from "@/components/shared";
import { getActiveBadgeColor } from "@/lib/utils/format";
import { Button } from "@plexui/ui/components/Button";
import { Badge } from "@plexui/ui/components/Badge";
import { Plus } from "@plexui/ui/components/Icon";

const mockWebhooks = [
  {
    url: "https://api.lunacorp.com/webhooks/persona",
    events: ["inquiry.completed", "inquiry.failed"],
    status: "active" as const,
    created: "Jan 20, 2026",
  },
  {
    url: "https://staging.lunacorp.com/hooks/kyc",
    events: ["verification.passed", "verification.failed"],
    status: "active" as const,
    created: "Feb 01, 2026",
  },
  {
    url: "https://old.lunacorp.com/callback",
    events: ["inquiry.completed"],
    status: "disabled" as const,
    created: "Jan 10, 2026",
  },
];

type Webhook = (typeof mockWebhooks)[number];

export default function WebhooksPage() {
  return (
    <div className="flex h-full flex-col overflow-auto">
      <TopBar
        title="Webhooks"
        actions={
          <Button color="primary" pill={false} size="md">
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

        <SettingsTable<Webhook>
          data={mockWebhooks}
          keyExtractor={(w) => w.url}
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
                  color={getActiveBadgeColor(webhook.status === "active") as "success" | "secondary"}
                >
                  {webhook.status === "active" ? "Active" : "Disabled"}
                </Badge>
              ),
            },
          ]}
          renderMobileCard={(webhook) => (
            <>
              <div className="flex items-center justify-between">
                <Badge
                  color={getActiveBadgeColor(webhook.status === "active") as "success" | "secondary"}
                >
                  {webhook.status === "active" ? "Active" : "Disabled"}
                </Badge>
                <span className="text-xs text-[var(--color-text-tertiary)]">
                  {webhook.created}
                </span>
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
    </div>
  );
}
