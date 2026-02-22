"use client";

import { useRef, useState } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { SectionHeading } from "@/components/shared";
import { Input } from "@plexui/ui/components/Input";
import { Button } from "@plexui/ui/components/Button";
import { Badge } from "@plexui/ui/components/Badge";
import { Field } from "@plexui/ui/components/Field";
import { Avatar } from "@plexui/ui/components/Avatar";
import { MOCK_USER } from "@/lib/constants/mock-user";

export default function OrganizationGeneralPage() {
  const [orgName, setOrgName] = useState(MOCK_USER.organization);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("idle");
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const hasChanges = orgName.trim() !== "" && orgName !== MOCK_USER.organization;

  const handleSave = () => {
    if (!hasChanges) return;
    setSaveState("saving");
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setSaveState("saved");
      timerRef.current = setTimeout(() => setSaveState("idle"), 1500);
    }, 600);
  };

  return (
    <div className="flex h-full flex-col overflow-auto">
      <TopBar title="Organization settings" />
      <div className="mx-auto w-full max-w-2xl px-4 py-8 md:px-6">
        <SectionHeading size="xs">Details</SectionHeading>

        <div className="mb-6">
          <Field label="Organization name" description="Human-friendly label for your organization, shown in user interfaces">
            <Input value={orgName} onChange={(e) => setOrgName(e.target.value)} />
          </Field>
          <div className="mt-3">
            <Button
              color="primary"
              pill={false}
              size="sm"
              onClick={handleSave}
              loading={saveState === "saving"}
              disabled={!hasChanges || saveState !== "idle"}
            >
              {saveState === "saved" ? "Saved!" : "Save"}
            </Button>
          </div>
        </div>

        <div className="mb-8">
          <Field label="Organization ID" description="Identifier for this organization used in API requests">
            <Input defaultValue="org_LunaCorp2024xYz" disabled />
          </Field>
        </div>

        <SectionHeading size="xs">Plan &amp; usage</SectionHeading>

        <div className="mb-8 rounded-xl border border-[var(--color-border)]">
          <div className="flex items-center justify-between border-b border-[var(--color-border)] px-4 py-3">
            <div className="flex items-center gap-3">
              <p className="text-sm font-medium text-[var(--color-text)]">Current plan</p>
              <Badge pill color="info" size="sm">Business</Badge>
            </div>
            <Button color="secondary" variant="soft" size="sm" pill={false}>
              Manage plan
            </Button>
          </div>
          <div className="grid grid-cols-3 divide-x divide-[var(--color-border)]">
            <div className="px-4 py-3">
              <p className="text-xs uppercase tracking-wide text-[var(--color-text-tertiary)]">Members</p>
              <p className="mt-1 heading-sm text-[var(--color-text)]">6</p>
            </div>
            <div className="px-4 py-3">
              <p className="text-xs uppercase tracking-wide text-[var(--color-text-tertiary)]">Inquiries (month)</p>
              <p className="mt-1 heading-sm text-[var(--color-text)]">1,247 / 5,000</p>
            </div>
            <div className="px-4 py-3">
              <p className="text-xs uppercase tracking-wide text-[var(--color-text-tertiary)]">Reports (month)</p>
              <p className="mt-1 heading-sm text-[var(--color-text)]">342 / 2,000</p>
            </div>
          </div>
        </div>

        <SectionHeading size="xs">Branding</SectionHeading>

        <div className="mb-8 space-y-4">
          <div className="flex items-center gap-4 rounded-xl border border-[var(--color-border)] p-4">
            <Avatar name={orgName} size={48} color="discovery" variant="solid" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-[var(--color-text)]">Organization logo</p>
              <p className="mt-0.5 text-sm text-[var(--color-text-secondary)]">
                Displayed in the sidebar and shared reports
              </p>
            </div>
            <Button color="secondary" variant="soft" size="sm" pill={false}>
              Upload
            </Button>
          </div>
          <div>
            <Field label="Support email" description="Shown to end-users during the verification flow">
              <Input defaultValue="support@lunacorp.com" disabled />
            </Field>
          </div>
          <div>
            <Field label="Privacy policy URL" description="Link to your privacy policy, shown during data collection">
              <Input defaultValue="https://lunacorp.com/privacy" disabled />
            </Field>
          </div>
        </div>

        <SectionHeading size="xs">Environment</SectionHeading>

        <div className="mb-6 space-y-3">
          <div className="rounded-xl border border-[var(--color-border)] p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[var(--color-text)]">Sandbox mode</p>
                <p className="mt-0.5 text-sm text-[var(--color-text-secondary)]">
                  Using simulated data for testing and development
                </p>
              </div>
              <Badge pill color="warning">Sandbox</Badge>
            </div>
          </div>

          <div className="rounded-xl border border-[var(--color-border)] p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[var(--color-text)]">Data region</p>
                <p className="mt-0.5 text-sm text-[var(--color-text-secondary)]">
                  Where your organization data is stored
                </p>
              </div>
              <span className="text-sm text-[var(--color-text)]">US (Default)</span>
            </div>
          </div>

          <div className="rounded-xl border border-[var(--color-border)] p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[var(--color-text)]">Created</p>
                <p className="mt-0.5 text-sm text-[var(--color-text-secondary)]">
                  When this organization was provisioned
                </p>
              </div>
              <span className="text-sm text-[var(--color-text)]">Jan 15, 2024</span>
            </div>
          </div>
        </div>

        <div className="mt-10">
          <SectionHeading size="xs">Danger zone</SectionHeading>
          <div className="space-y-3">
            <div className="rounded-xl border border-[var(--color-danger-outline-border)] p-4">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-[var(--color-text)]">Transfer ownership</p>
                  <p className="mt-0.5 text-sm text-[var(--color-text-secondary)]">
                    Transfer this organization to another admin member
                  </p>
                </div>
                <Button color="danger" variant="soft" size="sm" pill={false}>
                  Transfer
                </Button>
              </div>
            </div>
            <div className="rounded-xl border border-[var(--color-danger-outline-border)] p-4">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-[var(--color-text)]">Delete organization</p>
                  <p className="mt-0.5 text-sm text-[var(--color-text-secondary)]">
                    Permanently delete this organization and all its data. This action cannot be undone.
                  </p>
                </div>
                <Button color="danger" variant="soft" size="sm" pill={false}>
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
