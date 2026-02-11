"use client";

import { TopBar } from "@/components/layout/TopBar";
import { Input } from "@plexui/ui/components/Input";
import { Button } from "@plexui/ui/components/Button";
import { Avatar } from "@plexui/ui/components/Avatar";

export default function YourProfilePage() {
  return (
    <div className="flex h-full flex-col overflow-auto">
      <TopBar title="Your profile" />
      <div className="mx-auto w-full max-w-2xl px-6 py-8">
        {/* Avatar */}
        <div className="mb-8 flex items-center gap-4">
          <Avatar name="Alex Smith" size={64} color="primary" variant="solid" />
          <div>
            <p className="heading-xs text-[var(--color-text)]">Alex Smith</p>
            <p className="text-sm text-[var(--color-text-secondary)]">
              alex.smith@acmecorp.com
            </p>
          </div>
        </div>

        {/* Name */}
        <div className="mb-6">
          <label className="text-sm font-medium text-[var(--color-text)]">
            Name
          </label>
          <p className="mb-2 text-sm text-[var(--color-text-secondary)]">
            The name associated with this account
          </p>
          <Input defaultValue="Alex Smith" size="md" />
        </div>

        {/* Email */}
        <div className="mb-6">
          <label className="text-sm font-medium text-[var(--color-text)]">
            Email address
          </label>
          <p className="mb-2 text-sm text-[var(--color-text-secondary)]">
            The email address associated with this account
          </p>
          <Input defaultValue="alex.smith@acmecorp.com" size="md" disabled />
        </div>

        {/* Timezone */}
        <div className="mb-6">
          <label className="text-sm font-medium text-[var(--color-text)]">
            Timezone
          </label>
          <p className="mb-2 text-sm text-[var(--color-text-secondary)]">
            Timezone used for displaying dates and times
          </p>
          <Input
            defaultValue="(UTC+00:00) Coordinated Universal Time"
            size="md"
            disabled
          />
        </div>

        {/* Default organization */}
        <div className="mb-8">
          <label className="text-sm font-medium text-[var(--color-text)]">
            Default organization
          </label>
          <p className="mb-2 text-sm text-[var(--color-text-secondary)]">
            The organization used by default when making API requests
          </p>
          <Input defaultValue="Acme Corp" size="md" disabled />
        </div>

        <Button color="primary" pill={false}>
          Save
        </Button>
      </div>
    </div>
  );
}
