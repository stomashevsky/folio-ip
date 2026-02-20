"use client";

import { Suspense, useRef, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";

import { TopBar, TOPBAR_CONTROL_SIZE, TOPBAR_ACTION_PILL } from "@/components/layout/TopBar";
import { NotFoundPage, SectionHeading, CountrySelectorModal, ConfirmLeaveModal } from "@/components/shared";
import { useTemplateForm } from "@/lib/hooks/useTemplateForm";
import { COUNTRY_LABEL_MAP } from "@/lib/constants/countries";
import { VERIFICATION_TYPE_OPTIONS } from "@/lib/constants/filter-options";
import { VERIFICATION_TEMPLATE_PRESETS } from "@/lib/constants/template-presets";
import { AVAILABLE_CHECKS } from "@/lib/constants/verification-checks";
import { useUnsavedChanges } from "@/lib/hooks/useUnsavedChanges";
import { useTemplateStore } from "@/lib/stores/template-store";
import { getStatusColor } from "@/lib/utils/format";
import type {
  TemplateStatus,
  VerificationCheckConfig,
  VerificationTemplate,
  VerificationType,
} from "@/lib/types";

import { Badge } from "@plexui/ui/components/Badge";
import { Button } from "@plexui/ui/components/Button";
import { Field } from "@plexui/ui/components/Field";
import { Input } from "@plexui/ui/components/Input";
import { Menu } from "@plexui/ui/components/Menu";
import { Select } from "@plexui/ui/components/Select";
import { Switch } from "@plexui/ui/components/Switch";
import { DotsHorizontal } from "@plexui/ui/components/Icon";

const CAPTURE_METHOD_OPTIONS = [
  { value: "auto", label: "Auto" },
  { value: "manual", label: "Manual" },
  { value: "both", label: "Both" },
];

const CHECK_CATEGORY_LABELS: Record<string, string> = {
  fraud: "Fraud",
  validity: "Validity",
  biometrics: "Biometrics",
  user_action_required: "User action",
};

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

function checksForType(type: VerificationType): VerificationCheckConfig[] {
  return AVAILABLE_CHECKS[type].map((c) => ({
    name: c.name,
    category: c.category,
    required: c.defaultRequired,
    enabled: c.defaultEnabled,
  }));
}

const DEFAULT_FORM: VerificationForm = {
  name: "",
  type: "government_id",
  status: "draft",
  checks: checksForType("government_id"),
  settings: { allowedCountries: ["US"], maxRetries: 2, captureMethod: "auto" },
};

function buildFormFromPreset(presetParam: string): VerificationForm {
  const preset = VERIFICATION_TEMPLATE_PRESETS.find((p) => p.id === presetParam);
  if (!preset) return DEFAULT_FORM;
  const available = AVAILABLE_CHECKS[preset.defaults.type];
  const presetCheckNames = new Map(preset.defaults.checks.map((c) => [c.name, c]));
  const checks: VerificationCheckConfig[] = available.map((a) => {
    const existing = presetCheckNames.get(a.name);
    return existing
      ? { name: a.name, category: a.category, required: existing.required, enabled: existing.enabled }
      : { name: a.name, category: a.category, required: a.defaultRequired, enabled: false };
  });
  return {
    name: preset.defaults.name,
    type: preset.defaults.type,
    status: "draft",
    checks,
    settings: { ...preset.defaults.settings },
  };
}

function toForm(t: VerificationTemplate): VerificationForm {
  const available = AVAILABLE_CHECKS[t.type];
  const existingByName = new Map(t.checks.map((c) => [c.name, c]));
  const checks: VerificationCheckConfig[] = available.map((a) => {
    const existing = existingByName.get(a.name);
    return existing ?? { name: a.name, category: a.category, required: a.defaultRequired, enabled: false };
  });
  return {
    name: t.name,
    type: t.type,
    status: t.status,
    lastPublishedAt: t.lastPublishedAt,
    checks,
    settings: {
      allowedCountries: t.settings.allowedCountries,
      maxRetries: t.settings.maxRetries,
      captureMethod: t.settings.captureMethod,
    },
  };
}

export default function VerificationTemplateDetailPage() {
  return (
    <Suspense fallback={null}>
      <VerificationTemplateDetailContent />
    </Suspense>
  );
}

function VerificationTemplateDetailContent() {
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { verificationTemplates } = useTemplateStore();

  const { form, setForm, patch, isNew, existing } = useTemplateForm({
    id,
    getExisting: verificationTemplates.getById,
    presetParam: searchParams.get("preset"),
    toForm,
    buildFromPreset: buildFormFromPreset,
    defaultForm: DEFAULT_FORM,
  });
  const [initialForm, setInitialForm] = useState(form);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("idle");
  const saveTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [countriesOpen, setCountriesOpen] = useState(false);
  const [prevId, setPrevId] = useState(id);
  if (prevId !== id) {
    setPrevId(id);
    const next = existing ? toForm(existing) : DEFAULT_FORM;
    setForm(next);
    setInitialForm(next);
  }

  const isDirty = isNew || JSON.stringify(form) !== JSON.stringify(initialForm);
  const { confirmNavigation, showLeaveConfirm, confirmLeave, cancelLeave } = useUnsavedChanges(isDirty);

  if (!isNew && !existing) {
    return <NotFoundPage section="Verification Templates" backHref="/verifications/templates" entity="Verification template" />;
  }
  function patchSettings(p: Partial<VerificationForm["settings"]>) {
    setForm((prev) => ({ ...prev, settings: { ...prev.settings, ...p } }));
  }
  function changeType(type: VerificationType) {
    setForm((prev) => ({ ...prev, type, checks: checksForType(type) }));
  }

  function updateCheck(i: number, next: VerificationCheckConfig) {
    setForm((prev) => ({ ...prev, checks: prev.checks.map((c, idx) => (idx === i ? next : c)) }));
  }

  function save(formOverride?: VerificationForm) {
    const f = formOverride ?? form;
    if (formOverride) setForm(f);
    setSaveState("saving");
    clearTimeout(saveTimerRef.current);
    const payload: Omit<VerificationTemplate, "id" | "createdAt" | "updatedAt"> = {
      ...f,
      name: f.name.trim() || "Untitled verification template",
      checks: f.checks.filter((c) => c.enabled),
    };
    if (isNew) {
      const created = verificationTemplates.create(payload);
      router.replace(`/verifications/templates/${created.id}`);
    } else {
      verificationTemplates.update(id, payload);
    }
    setInitialForm(f);
    saveTimerRef.current = setTimeout(() => {
      setSaveState("saved");
      saveTimerRef.current = setTimeout(() => setSaveState("idle"), 1500);
    }, 600);
  }

  function handleDelete() {
    if (!existing) return;
    setInitialForm(form);
    verificationTemplates.delete(id);
    router.push("/verifications/templates");
  }

  const title = isNew ? "New verification template" : (existing?.name ?? "Verification template");
  const canPublish = form.status === "draft";
  const canUnpublish = form.status === "active";
  const backHref = "/verifications/templates";

  return (
    <div className="flex h-full flex-col overflow-auto">
      <TopBar
        title={<span className="flex items-center gap-2">{title}{!isNew && <Badge color={getStatusColor(form.status) as "warning" | "success" | "secondary"} size="sm">{form.status}</Badge>}</span>}
        backHref={backHref}
        backLabel="Verification Templates"
        onBackClick={() => confirmNavigation(backHref)}
        actions={
          <div className="flex items-center gap-2">
            {!isNew && (
              <Menu>
                 <Menu.Trigger>
                    <Button color="secondary" variant="soft" size={TOPBAR_CONTROL_SIZE} pill={TOPBAR_ACTION_PILL} className="[--button-ring-color:transparent]">
                      <DotsHorizontal />
                    </Button>
                 </Menu.Trigger>
                <Menu.Content minWidth="auto">
                  {canPublish && (
                    <Menu.Item onSelect={() => save({ ...form, status: "active", lastPublishedAt: new Date().toISOString() })}>Publish</Menu.Item>
                  )}
                  {canUnpublish && (
                    <Menu.Item onSelect={() => save({ ...form, status: "draft" })}>Unpublish</Menu.Item>
                  )}
                  <Menu.Separator />
                  <Menu.Item onSelect={handleDelete} className="text-[var(--color-text-danger-ghost)]">Delete</Menu.Item>
                </Menu.Content>
              </Menu>
            )}
            <Button color="primary" size={TOPBAR_CONTROL_SIZE} pill={TOPBAR_ACTION_PILL} onClick={() => save()} loading={saveState === "saving"} disabled={!isDirty || saveState !== "idle"}>{saveState === "saved" ? "Saved!" : "Save"}</Button>
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
                onChange={(o) => { if (o) changeType(o.value as VerificationType); }}
                pill={false}
                block
              />
            </div>
          </Field>
        </div>

        <SectionHeading size="xs">Checks</SectionHeading>
        <div className="mb-8">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--color-border)]">
                <th className="pb-2 text-left text-2xs font-medium uppercase tracking-wider text-[var(--color-text-tertiary)]">Name</th>
                <th className="w-28 pb-2 text-left text-2xs font-medium uppercase tracking-wider text-[var(--color-text-tertiary)]">Category</th>
                <th className="w-20 pb-2 text-center text-2xs font-medium uppercase tracking-wider text-[var(--color-text-tertiary)]">Required</th>
                <th className="w-20 pb-2 text-center text-2xs font-medium uppercase tracking-wider text-[var(--color-text-tertiary)]">Enabled</th>
              </tr>
            </thead>
            <tbody>
              {form.checks.map((check, i) => (
                <tr key={check.name} className="border-b border-[var(--color-border)] last:border-b-0">
                  <td className="py-3 pr-3">
                    <p className={`text-sm ${check.enabled ? "text-[var(--color-text)]" : "text-[var(--color-text-tertiary)]"}`}>
                      {check.name}
                    </p>
                  </td>
                  <td className="py-3 pr-3">
                    <span className="text-xs text-[var(--color-text-secondary)]">
                      {CHECK_CATEGORY_LABELS[check.category] ?? check.category}
                    </span>
                  </td>
                  <td className="py-3 text-center">
                    <div className="flex justify-center">
                      <Switch
                        checked={check.required}
                        onCheckedChange={(c) => updateCheck(i, { ...check, required: c, enabled: c ? true : check.enabled })}
                        disabled={!check.enabled}
                      />
                    </div>
                  </td>
                  <td className="py-3 text-center">
                    <div className="flex justify-center">
                      <Switch
                        checked={check.enabled}
                        onCheckedChange={(c) => updateCheck(i, { ...check, enabled: c, required: c ? check.required : false })}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <SectionHeading size="xs">Settings</SectionHeading>
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm font-medium text-[var(--color-text)]">Allowed countries</p>
              <p className="text-sm text-[var(--color-text-secondary)]">Countries where this verification is available</p>
            </div>
            <Button color="secondary" variant="outline" size="sm" pill={false} onClick={() => setCountriesOpen(true)}>
              {form.settings.allowedCountries.length > 0
                ? `${form.settings.allowedCountries.length} selected`
                : "Select countries"}
            </Button>
          </div>

          {form.settings.allowedCountries.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {form.settings.allowedCountries
                .slice()
                .sort((a, b) => (COUNTRY_LABEL_MAP[a] ?? a).localeCompare(COUNTRY_LABEL_MAP[b] ?? b))
                .map((code) => (
                  <Badge key={code} color="secondary" variant="outline" size="sm" pill={false}>
                    {COUNTRY_LABEL_MAP[code] ?? code}
                  </Badge>
                ))}
            </div>
          )}

          <CountrySelectorModal
            open={countriesOpen}
            onOpenChange={setCountriesOpen}
            selected={form.settings.allowedCountries}
            onSave={(codes) => patchSettings({ allowedCountries: codes })}
          />
        </div>

        <div className="divide-y divide-[var(--color-border)] rounded-lg border border-[var(--color-border)]">
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

      <ConfirmLeaveModal open={showLeaveConfirm} onConfirm={confirmLeave} onCancel={cancelLeave} />
    </div>
  );
}
