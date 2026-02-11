"use client";

import { TopBar } from "@/components/layout/TopBar";
import { Input } from "@plexui/ui/components/Input";
import { Button } from "@plexui/ui/components/Button";

export default function ProjectGeneralPage() {
  return (
    <div className="flex h-full flex-col overflow-auto">
      <TopBar title="Project settings" />
      <div className="mx-auto w-full max-w-2xl px-6 py-8">
        {/* Project details */}
        <h2 className="heading-xs mb-4 text-[var(--color-text)]">Details</h2>

        <div className="mb-6">
          <label className="text-sm font-medium text-[var(--color-text)]">
            Project name
          </label>
          <p className="mb-2 text-sm text-[var(--color-text-secondary)]">
            A friendly name for this project, visible across dashboards and
            reports
          </p>
          <Input defaultValue="Default project" size="md" />
          <div className="mt-3">
            <Button color="secondary" variant="outline" pill={false} size="sm">
              Save
            </Button>
          </div>
        </div>

        <div className="mb-8">
          <label className="text-sm font-medium text-[var(--color-text)]">
            Project ID
          </label>
          <p className="mb-2 text-sm text-[var(--color-text-secondary)]">
            Unique identifier for API requests scoped to this project
          </p>
          <Input
            defaultValue="proj_default_2026_aBcDe"
            size="md"
            disabled
          />
        </div>

        {/* Configuration */}
        <h2 className="heading-xs mb-4 text-[var(--color-text)]">
          Configuration
        </h2>

        <div className="mb-6">
          <label className="text-sm font-medium text-[var(--color-text)]">
            Default inquiry template
          </label>
          <p className="mb-2 text-sm text-[var(--color-text-secondary)]">
            The template used when creating new inquiries without specifying one
          </p>
          <Input
            defaultValue="Government ID + Selfie"
            size="md"
            disabled
          />
        </div>

        <div className="mb-6">
          <label className="text-sm font-medium text-[var(--color-text)]">
            Data source
          </label>
          <p className="mb-2 text-sm text-[var(--color-text-secondary)]">
            Where verification data is sourced from for this project
          </p>
          <Input defaultValue="API" size="md" disabled />
        </div>
      </div>
    </div>
  );
}
