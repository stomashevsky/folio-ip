"use client";

import { useRef, useState } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { SectionHeading } from "@/components/shared";
import { Input } from "@plexui/ui/components/Input";
import { Button } from "@plexui/ui/components/Button";
import { Badge } from "@plexui/ui/components/Badge";
import { Field } from "@plexui/ui/components/Field";
import { MOCK_USER } from "@/lib/constants/mock-user";

export default function OrganizationGeneralPage() {
  const [orgName, setOrgName] = useState(MOCK_USER.organization);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">(
    "idle",
  );
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
        {/* Details */}
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

        {/* Environment */}
        <SectionHeading size="xs">Environment</SectionHeading>

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
