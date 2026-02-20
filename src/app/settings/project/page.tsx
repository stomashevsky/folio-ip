"use client";

import { useRef, useState } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { SectionHeading } from "@/components/shared";
import { Input } from "@plexui/ui/components/Input";
import { Button } from "@plexui/ui/components/Button";
import { Badge } from "@plexui/ui/components/Badge";
import { Field } from "@plexui/ui/components/Field";
import { Switch } from "@plexui/ui/components/Switch";

const INITIAL_PROJECT_NAME = "Default project";

export default function ProjectGeneralPage() {
  const [projectName, setProjectName] = useState(INITIAL_PROJECT_NAME);
  const [continuousMonitoring, setContinuousMonitoring] = useState(true);
  const [autoApprove, setAutoApprove] = useState(false);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("idle");
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const hasChanges =
    projectName.trim() !== "" && projectName !== INITIAL_PROJECT_NAME;

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
      <TopBar title="Project settings" />
      <div className="mx-auto w-full max-w-2xl px-4 py-8 md:px-6">
        <SectionHeading size="xs">Details</SectionHeading>

        <div className="mb-6">
          <Field label="Project name" description="A friendly name for this project, visible across dashboards and reports">
            <Input value={projectName} onChange={(e) => setProjectName(e.target.value)} />
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

        <div className="mb-6">
          <Field label="Project ID" description="Unique identifier for API requests scoped to this project">
            <Input defaultValue="proj_default_2026_aBcDe" disabled />
          </Field>
        </div>

        <div className="mb-8">
          <Field label="Environment" description="Current environment for this project">
            <div className="flex items-center gap-2">
              <Input defaultValue="Sandbox" disabled />
              <Badge color="warning" size="sm">Sandbox</Badge>
            </div>
          </Field>
        </div>

        <SectionHeading size="xs">Configuration</SectionHeading>

        <div className="mb-6">
          <Field label="Default inquiry template" description="The template used when creating new inquiries without specifying one">
            <Input defaultValue="Government ID + Selfie" disabled />
          </Field>
        </div>

        <div className="mb-6">
          <Field label="Data source" description="Where verification data is sourced from for this project">
            <Input defaultValue="API" disabled />
          </Field>
        </div>

        <div className="mb-8">
          <Field label="Default report template" description="The template used for automated screening reports">
            <Input defaultValue="Watchlist Standard" disabled />
          </Field>
        </div>

        <SectionHeading size="xs">Automation</SectionHeading>

        <div className="mb-8 space-y-4 rounded-xl border border-[var(--color-border)] p-4">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-[var(--color-text)]">Continuous monitoring</p>
              <p className="mt-0.5 text-sm text-[var(--color-text-secondary)]">
                Automatically re-screen accounts on a recurring schedule
              </p>
            </div>
            <Switch checked={continuousMonitoring} onCheckedChange={setContinuousMonitoring} />
          </div>
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-[var(--color-text)]">Auto-approve low risk</p>
              <p className="mt-0.5 text-sm text-[var(--color-text-secondary)]">
                Automatically approve inquiries with a risk score below the threshold
              </p>
            </div>
            <Switch checked={autoApprove} onCheckedChange={setAutoApprove} />
          </div>
        </div>

        <SectionHeading size="xs">Allowed origins</SectionHeading>

        <div className="mb-8 space-y-4">
          <p className="text-sm text-[var(--color-text-secondary)]">
            Domains allowed to embed the verification flow. Used for CORS and Content Security Policy headers.
          </p>
          <div className="rounded-xl border border-[var(--color-border)]">
            {["https://lunacorp.com", "https://app.lunacorp.com", "http://localhost:3000"].map((origin, i, arr) => (
              <div
                key={origin}
                className={`flex items-center justify-between px-4 py-2.5 ${i < arr.length - 1 ? "border-b border-[var(--color-border)]" : ""}`}
              >
                <code className="text-sm text-[var(--color-text)]">{origin}</code>
<Button color="secondary" variant="soft" size="sm" pill={false}>
                   Remove
                </Button>
              </div>
            ))}
          </div>
          <Button color="secondary" variant="soft" size="sm" pill={false}>
            Add origin
          </Button>
        </div>

        <SectionHeading size="xs">Webhooks</SectionHeading>

        <div className="mb-8 space-y-4">
          <div>
            <Field label="Webhook URL" description="Events will be sent to this endpoint via HTTP POST">
              <Input defaultValue="https://api.lunacorp.com/webhooks/persona" disabled />
            </Field>
          </div>
          <div>
            <Field label="Signing secret" description="Used to verify webhook payload authenticity">
              <Input defaultValue="whsec_••••••••••••••••" disabled />
            </Field>
          </div>
        </div>

        <div className="mt-10">
          <SectionHeading size="xs">Danger zone</SectionHeading>
          <div className="rounded-xl border border-[var(--color-danger-outline-border)] p-4">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-[var(--color-text)]">Delete project</p>
                <p className="mt-0.5 text-sm text-[var(--color-text-secondary)]">
                  Permanently delete this project and all associated inquiries, verifications, and reports.
                </p>
              </div>
              <Button color="danger" variant="soft" size="sm" pill={false}>
                Delete project
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
