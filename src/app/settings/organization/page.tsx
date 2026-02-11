"use client";

import { TopBar } from "@/components/layout/TopBar";
import { Input } from "@plexui/ui/components/Input";
import { Button } from "@plexui/ui/components/Button";
import { Badge } from "@plexui/ui/components/Badge";

export default function OrganizationGeneralPage() {
  return (
    <div className="flex h-full flex-col overflow-auto">
      <TopBar title="Organization settings" />
      <div className="mx-auto w-full max-w-2xl px-6 py-8">
        {/* Details */}
        <h2 className="heading-xs mb-4 text-[var(--color-text)]">Details</h2>

        <div className="mb-6">
          <label className="text-sm font-medium text-[var(--color-text)]">
            Organization name
          </label>
          <p className="mb-2 text-sm text-[var(--color-text-secondary)]">
            Human-friendly label for your organization, shown in user interfaces
          </p>
          <Input defaultValue="Acme Corp" size="md" />
          <div className="mt-3">
            <Button color="secondary" variant="outline" pill={false} size="sm">
              Save
            </Button>
          </div>
        </div>

        <div className="mb-8">
          <label className="text-sm font-medium text-[var(--color-text)]">
            Organization ID
          </label>
          <p className="mb-2 text-sm text-[var(--color-text-secondary)]">
            Identifier for this organization used in API requests
          </p>
          <Input
            defaultValue="org_AcmeCorp2024xYz"
            size="md"
            disabled
          />
        </div>

        {/* Environment */}
        <h2 className="heading-xs mb-4 text-[var(--color-text)]">
          Environment
        </h2>

        <div className="mb-6 rounded-lg border border-[var(--color-border)] p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[var(--color-text)]">
                Sandbox mode
              </p>
              <p className="text-sm text-[var(--color-text-secondary)]">
                Using simulated data for testing and development
              </p>
            </div>
            <Badge color="warning">Sandbox</Badge>
          </div>
        </div>

        <div className="rounded-lg border border-[var(--color-border)] p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[var(--color-text)]">
                Data region
              </p>
              <p className="text-sm text-[var(--color-text-secondary)]">
                Where your organization data is stored
              </p>
            </div>
            <span className="text-sm text-[var(--color-text)]">US (Default)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
