"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { TopBar } from "@/components/layout/TopBar";
import { NotFoundPage, SectionHeading } from "@/components/shared";
import { VERIFICATION_TYPE_OPTIONS } from "@/lib/constants/filter-options";
import { useTemplateStore } from "@/lib/stores/template-store";
import { getStatusColor } from "@/lib/utils/format";
import type {
  CheckCategory,
  TemplateStatus,
  VerificationCheckConfig,
  VerificationTemplate,
  VerificationType,
} from "@/lib/types";

import { Badge } from "@plexui/ui/components/Badge";
import { Button } from "@plexui/ui/components/Button";
import { Field } from "@plexui/ui/components/Field";
import { Input } from "@plexui/ui/components/Input";
import { Select } from "@plexui/ui/components/Select";
import { Switch } from "@plexui/ui/components/Switch";
import { Plus, Trash } from "@plexui/ui/components/Icon";

const CAPTURE_METHOD_OPTIONS = [
  { value: "auto", label: "Auto" },
  { value: "manual", label: "Manual" },
  { value: "both", label: "Both" },
];

const CHECK_CATEGORY_OPTIONS: { value: CheckCategory; label: string }[] = [
  { value: "fraud", label: "Fraud" },
  { value: "validity", label: "Validity" },
  { value: "biometrics", label: "Biometrics" },
  { value: "user_action_required", label: "User action" },
];

interface VerificationForm {
  name: string;
  type: VerificationType;
  status: TemplateStatus;
  lastPublishedAt?: string;
  checks: VerificationCheckConfig[];
  settings: {
    allowedCountries: string[];
    maxRetries: number;
    captureMethod: "auto" | "manual" | "both";
  };
}

const DEFAULT_FORM: VerificationForm = {
  name: "",
  type: "government_id",
  status: "draft",
  checks: [{ name: "Document Authenticity", category: "fraud", required: true, enabled: true }],
  settings: { allowedCountries: ["US"], maxRetries: 2, captureMethod: "auto" },
};

function toForm(t: VerificationTemplate): VerificationForm {
  return {
    name: t.name,
    type: t.type,
    status: t.status,
    lastPublishedAt: t.lastPublishedAt,
    checks: t.checks.length > 0 ? t.checks : DEFAULT_FORM.checks,
    settings: {
      allowedCountries: t.settings.allowedCountries,
      maxRetries: t.settings.maxRetries,
      captureMethod: t.settings.captureMethod,
    },
  };
}

export default function VerificationTemplateDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { verificationTemplates } = useTemplateStore();

  const isNew = id === "new";
  const existing = isNew ? undefined : verificationTemplates.getById(id);

  const [form, setForm] = useState<VerificationForm>(() => (existing ? toForm(existing) : DEFAULT_FORM));
  const [prevId, setPrevId] = useState(id);
  if (prevId !== id) {
    setPrevId(id);
    setForm(existing ? toForm(existing) : DEFAULT_FORM);
  }

  if (!isNew && !existing) {
    return <NotFoundPage section="Verification Templates" backHref="/templates/verifications" entity="Verification template" />;
  }

  function patch(p: Partial<VerificationForm>) {
    setForm((prev) => ({ ...prev, ...p }));
  }
  function patchSettings(p: Partial<VerificationForm["settings"]>) {
    setForm((prev) => ({ ...prev, settings: { ...prev.settings, ...p } }));
  }
  function setStatus(s: TemplateStatus) {
    patch({ status: s, lastPublishedAt: s === "active" ? new Date().toISOString() : form.lastPublishedAt });
  }

  function addCheck() {
    setForm((prev) => ({
      ...prev,
      checks: [...prev.checks, { name: "New Check", category: "validity" as CheckCategory, required: false, enabled: true }],
    }));
  }
  function updateCheck(i: number, next: VerificationCheckConfig) {
    setForm((prev) => ({ ...prev, checks: prev.checks.map((c, idx) => (idx === i ? next : c)) }));
  }
  function removeCheck(i: number) {
    if (form.checks.length <= 1) return;
    setForm((prev) => ({ ...prev, checks: prev.checks.filter((_, idx) => idx !== i) }));
  }

  function save() {
    const payload: Omit<VerificationTemplate, "id" | "createdAt" | "updatedAt"> = {
      ...form,
      name: form.name.trim() || "Untitled verification template",
      checks: form.checks.map((c) => ({ ...c, name: c.name.trim() || "Unnamed check" })),
      settings: {
        ...form.settings,
        allowedCountries: form.settings.allowedCountries.map((c) => c.trim().toUpperCase()).filter(Boolean),
      },
    };
    if (isNew) verificationTemplates.create(payload);
    else verificationTemplates.update(id, payload);
    router.push("/templates/verifications");
  }

  const title = isNew ? "New verification template" : (existing?.name ?? "Verification template");
  const canPublish = form.status === "draft";
  const canArchive = form.status === "draft" || form.status === "active";

  return (
    <div className="flex h-full flex-col overflow-auto">
      <TopBar
        title={title}
        backHref="/templates/verifications"
        actions={
          <div className="flex items-center gap-2">
            {!isNew && (
              <Badge color={getStatusColor(form.status) as "warning" | "success" | "secondary"} size="sm">
                {form.status}
              </Badge>
            )}
            {canPublish && (
              <Button color="secondary" variant="outline" size="sm" pill={false} onClick={() => setStatus("active")}>Publish</Button>
            )}
            {canArchive && (
              <Button color="secondary" variant="outline" size="sm" pill={false} onClick={() => setStatus("archived")}>Archive</Button>
            )}
            <Button color="primary" size="sm" pill={false} onClick={save}>Save</Button>
          </div>
        }
      />

      <div className="mx-auto w-full max-w-2xl px-4 py-8 md:px-6">
        <SectionHeading size="xs">General</SectionHeading>
        <div className="mb-6">
          <Field label="Name" description="A descriptive name for this verification template">
            <Input value={form.name} onChange={(e) => patch({ name: e.target.value })} placeholder="e.g. Government ID Verification" />
          </Field>
        </div>
        <div className="mb-8">
          <Field label="Type" description="The type of verification this template performs">
            <div className="w-48">
              <Select
                options={VERIFICATION_TYPE_OPTIONS}
                value={form.type}
                onChange={(o) => { if (o) patch({ type: o.value as VerificationType }); }}
                pill={false}
                block
              />
            </div>
          </Field>
        </div>

        <SectionHeading size="xs" action={
          <Button color="secondary" variant="outline" size="sm" pill={false} onClick={addCheck}><Plus /> Add check</Button>
        }>
          Checks
        </SectionHeading>
        <div className="mb-8 divide-y divide-[var(--color-border)] rounded-lg border border-[var(--color-border)]">
          {form.checks.map((check, i) => (
            <div key={i} className="px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="min-w-0 flex-1">
                  <Input
                    value={check.name}
                    onChange={(e) => updateCheck(i, { ...check, name: e.target.value })}
                    placeholder="Check name"
                  />
                </div>
                <div className="w-36 shrink-0">
                  <Select
                    options={CHECK_CATEGORY_OPTIONS}
                    value={check.category}
                    onChange={(o) => { if (o) updateCheck(i, { ...check, category: o.value as CheckCategory }); }}
                    pill={false}
                    block
                  />
                </div>
                <Button color="secondary" variant="ghost" size="sm" uniform onClick={() => removeCheck(i)} disabled={form.checks.length <= 1}>
                  <Trash />
                </Button>
              </div>
              <div className="mt-2 flex items-center gap-6">
                <Switch label="Required" checked={check.required} onCheckedChange={(c) => updateCheck(i, { ...check, required: c })} />
                <Switch label="Enabled" checked={check.enabled} onCheckedChange={(c) => updateCheck(i, { ...check, enabled: c })} />
              </div>
            </div>
          ))}
        </div>

        <SectionHeading size="xs">Settings</SectionHeading>
        <div className="divide-y divide-[var(--color-border)] rounded-lg border border-[var(--color-border)]">
          <div className="flex items-center justify-between px-4 py-4">
            <div className="mr-4">
              <p className="text-sm font-medium text-[var(--color-text)]">Allowed countries</p>
              <p className="text-sm text-[var(--color-text-secondary)]">Comma-separated ISO codes (e.g. US, CA, GB)</p>
            </div>
            <div className="w-48 shrink-0">
              <Input
                value={form.settings.allowedCountries.join(", ")}
                onChange={(e) => patchSettings({ allowedCountries: e.target.value.split(",") })}
              />
            </div>
          </div>
          <div className="flex items-center justify-between px-4 py-4">
            <div className="mr-4">
              <p className="text-sm font-medium text-[var(--color-text)]">Max retries</p>
              <p className="text-sm text-[var(--color-text-secondary)]">Retry attempts allowed for this verification</p>
            </div>
            <div className="w-20 shrink-0">
              <Input type="number" value={String(form.settings.maxRetries)} onChange={(e) => patchSettings({ maxRetries: Number(e.target.value) || 0 })} />
            </div>
          </div>
          <div className="flex items-center justify-between px-4 py-4">
            <div className="mr-4">
              <p className="text-sm font-medium text-[var(--color-text)]">Capture method</p>
              <p className="text-sm text-[var(--color-text-secondary)]">How verification data is captured</p>
            </div>
            <div className="w-32 shrink-0">
              <Select
                options={CAPTURE_METHOD_OPTIONS}
                value={form.settings.captureMethod}
                onChange={(o) => { if (o) patchSettings({ captureMethod: o.value as "auto" | "manual" | "both" }); }}
                pill={false}
                block
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
