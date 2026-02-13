"use client";

import { TopBar } from "@/components/layout/TopBar";
import { Input } from "@plexui/ui/components/Input";
import { Button } from "@plexui/ui/components/Button";
import { Avatar } from "@plexui/ui/components/Avatar";
import { Field } from "@plexui/ui/components/Field";
import { MOCK_USER } from "@/lib/constants/mock-user";

export default function YourProfilePage() {
  return (
    <div className="flex h-full flex-col overflow-auto">
      <TopBar title="Your profile" />
      <div className="mx-auto w-full max-w-2xl px-4 py-8 md:px-6">
        {/* Avatar */}
        <div className="mb-8 flex items-center gap-4">
          <Avatar name={MOCK_USER.name} size={64} color={MOCK_USER.avatarColor} variant="solid" />
          <div>
            <p className="heading-xs text-[var(--color-text)]">{MOCK_USER.name}</p>
            <p className="text-sm text-[var(--color-text-secondary)]">
              {MOCK_USER.email}
            </p>
          </div>
        </div>

        <div className="mb-6">
          <Field label="Name" description="The name associated with this account">
            <Input defaultValue={MOCK_USER.name} />
          </Field>
        </div>

        <div className="mb-6">
          <Field label="Email address" description="The email address associated with this account">
            <Input defaultValue={MOCK_USER.email} disabled />
          </Field>
        </div>

        <div className="mb-6">
          <Field label="Timezone" description="Timezone used for displaying dates and times">
            <Input defaultValue="(UTC+00:00) Coordinated Universal Time" disabled />
          </Field>
        </div>

        <div className="mb-8">
          <Field label="Default organization" description="The organization used by default when making API requests">
            <Input defaultValue={MOCK_USER.organization} disabled />
          </Field>
        </div>

        <Button color="primary" pill={false}>
          Save
        </Button>
      </div>
    </div>
  );
}
