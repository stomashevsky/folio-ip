"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { TopBar } from "@/components/layout/TopBar";
import { NotFoundPage, SectionHeading } from "@/components/shared";
import { VERIFICATION_TYPE_OPTIONS } from "@/lib/constants/filter-options";
import { useTemplateStore } from "@/lib/stores/template-store";
import { getStatusColor } from "@/lib/utils/format";
import type {
  InquiryTemplate,
  InquiryTemplateStep,
  TemplateStatus,
  VerificationType,
} from "@/lib/types";

import { Badge } from "@plexui/ui/components/Badge";
import { Button } from "@plexui/ui/components/Button";
import { Field } from "@plexui/ui/components/Field";
import { Input } from "@plexui/ui/components/Input";
import { Select } from "@plexui/ui/components/Select";
import { Switch } from "@plexui/ui/components/Switch";
import { Textarea } from "@plexui/ui/components/Textarea";
import { Plus, Trash } from "@plexui/ui/components/Icon";

/* ------------------------------------------------------------------ */
/*  Form helpers                                                      */
/* ------------------------------------------------------------------ */

interface InquiryForm {
  name: string;
  description: string;
  status: TemplateStatus;
  lastPublishedAt?: string;
  steps: InquiryTemplateStep[];
  settings: {
    autoApprove: boolean;
    expiresInDays: number;
    maxRetries: number;
    redirectUrl: string;
  };
}

const DEFAULT_FORM: InquiryForm = {
  name: "",
  description: "",
  status: "draft",
  steps: [{ verificationType: "government_id", required: true }],
  settings: { autoApprove: false, expiresInDays: 30, maxRetries: 3, redirectUrl: "" },
};

function toForm(t: InquiryTemplate): InquiryForm {
  return {
    name: t.name,
    description: t.description ?? "",
    status: t.status,
    lastPublishedAt: t.lastPublishedAt,
    steps: t.steps.length > 0 ? t.steps : DEFAULT_FORM.steps,
    settings: {
      autoApprove: t.settings.autoApprove,
      expiresInDays: t.settings.expiresInDays,
      maxRetries: t.settings.maxRetries,
      redirectUrl: t.settings.redirectUrl ?? "",
    },
  };
}

/* ------------------------------------------------------------------ */
/*  Page                                                              */
/* ------------------------------------------------------------------ */

export default function InquiryTemplateDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { inquiryTemplates } = useTemplateStore();

  const isNew = id === "new";
  const existing = isNew ? undefined : inquiryTemplates.getById(id);

  const [form, setForm] = useState<InquiryForm>(() => (existing ? toForm(existing) : DEFAULT_FORM));
  const [prevId, setPrevId] = useState(id);
  if (prevId !== id) {
    setPrevId(id);
    setForm(existing ? toForm(existing) : DEFAULT_FORM);
  }

  if (!isNew && !existing) {
    return <NotFoundPage section="Inquiry Templates" backHref="/templates/inquiries" entity="Inquiry template" />;
  }

  /* helpers */
  function patch(p: Partial<InquiryForm>) {
    setForm((prev) => ({ ...prev, ...p }));
  }
  function patchSettings(p: Partial<InquiryForm["settings"]>) {
    setForm((prev) => ({ ...prev, settings: { ...prev.settings, ...p } }));
  }
  function setStatus(s: TemplateStatus) {
    patch({ status: s, lastPublishedAt: s === "active" ? new Date().toISOString() : form.lastPublishedAt });
  }

  /* steps */
  function addStep() {
    setForm((prev) => ({ ...prev, steps: [...prev.steps, { verificationType: "document", required: false }] }));
  }
  function updateStep(i: number, next: InquiryTemplateStep) {
    setForm((prev) => ({ ...prev, steps: prev.steps.map((s, idx) => (idx === i ? next : s)) }));
  }
  function removeStep(i: number) {
    if (form.steps.length <= 1) return;
    setForm((prev) => ({ ...prev, steps: prev.steps.filter((_, idx) => idx !== i) }));
  }

  /* save */
  function save() {
    const payload: Omit<InquiryTemplate, "id" | "createdAt" | "updatedAt"> = {
      ...form,
      description: form.description.trim() || undefined,
      settings: { ...form.settings, redirectUrl: form.settings.redirectUrl.trim() || undefined },
    };
    if (isNew) inquiryTemplates.create(payload);
    else inquiryTemplates.update(id, payload);
    router.push("/templates/inquiries");
  }

  const title = isNew ? "New inquiry template" : (existing?.name ?? "Inquiry template");
  const canPublish = form.status === "draft";
  const canArchive = form.status === "draft" || form.status === "active";

  return (
    <div className="flex h-full flex-col overflow-auto">
      <TopBar
        title={title}
        backHref="/templates/inquiries"
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
        {/* General */}
        <SectionHeading size="xs">General</SectionHeading>
        <div className="mb-6">
          <Field label="Name" description="A descriptive name for this inquiry template">
            <Input value={form.name} onChange={(e) => patch({ name: e.target.value })} placeholder="e.g. KYC + AML Standard" />
          </Field>
        </div>
        <div className="mb-8">
          <Field label="Description" description="Optional internal description visible to your team">
            <Textarea value={form.description} onChange={(e) => patch({ description: e.target.value })} rows={3} />
          </Field>
        </div>

        {/* Steps */}
        <SectionHeading size="xs" action={
          <Button color="secondary" variant="outline" size="sm" pill={false} onClick={addStep}><Plus /> Add step</Button>
        }>
          Steps
        </SectionHeading>
        <div className="mb-8 divide-y divide-[var(--color-border)] rounded-lg border border-[var(--color-border)]">
          {form.steps.map((step, i) => (
            <div key={i} className="flex items-center gap-4 px-4 py-3">
              <span className="w-14 shrink-0 text-xs text-[var(--color-text-tertiary)]">Step {i + 1}</span>
              <div className="min-w-0 flex-1">
                <Select
                  options={VERIFICATION_TYPE_OPTIONS}
                  value={step.verificationType}
                  onChange={(o) => { if (o) updateStep(i, { ...step, verificationType: o.value as VerificationType }); }}
                  pill={false}
                  block
                />
              </div>
              <Switch label="Required" checked={step.required} onCheckedChange={(c) => updateStep(i, { ...step, required: c })} />
              <Button color="secondary" variant="ghost" size="sm" uniform onClick={() => removeStep(i)} disabled={form.steps.length <= 1}>
                <Trash />
              </Button>
            </div>
          ))}
        </div>

        {/* Settings */}
        <SectionHeading size="xs">Settings</SectionHeading>
        <div className="mb-6 divide-y divide-[var(--color-border)] rounded-lg border border-[var(--color-border)]">
          <div className="flex items-center justify-between px-4 py-4">
            <div className="mr-4">
              <p className="text-sm font-medium text-[var(--color-text)]">Auto-approve</p>
              <p className="text-sm text-[var(--color-text-secondary)]">Automatically approve inquiries that pass all verification steps</p>
            </div>
            <Switch checked={form.settings.autoApprove} onCheckedChange={(c) => patchSettings({ autoApprove: c })} />
          </div>
          <div className="flex items-center justify-between px-4 py-4">
            <div className="mr-4">
              <p className="text-sm font-medium text-[var(--color-text)]">Expiration</p>
              <p className="text-sm text-[var(--color-text-secondary)]">Days before an incomplete inquiry expires</p>
            </div>
            <div className="w-20 shrink-0">
              <Input type="number" value={String(form.settings.expiresInDays)} onChange={(e) => patchSettings({ expiresInDays: Number(e.target.value) || 0 })} />
            </div>
          </div>
          <div className="flex items-center justify-between px-4 py-4">
            <div className="mr-4">
              <p className="text-sm font-medium text-[var(--color-text)]">Max retries</p>
              <p className="text-sm text-[var(--color-text-secondary)]">Retry attempts allowed per verification step</p>
            </div>
            <div className="w-20 shrink-0">
              <Input type="number" value={String(form.settings.maxRetries)} onChange={(e) => patchSettings({ maxRetries: Number(e.target.value) || 0 })} />
            </div>
          </div>
        </div>
        <div className="mb-8">
          <Field label="Redirect URL" description="Where to redirect the user after completing the inquiry flow">
            <Input value={form.settings.redirectUrl} onChange={(e) => patchSettings({ redirectUrl: e.target.value })} placeholder="https://your-app.com/complete" />
          </Field>
        </div>
      </div>
    </div>
  );
}
