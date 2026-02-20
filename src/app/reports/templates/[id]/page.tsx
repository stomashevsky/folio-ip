"use client";

import { Suspense, useRef, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";

import { TopBar, TOPBAR_CONTROL_SIZE, TOPBAR_ACTION_PILL } from "@/components/layout/TopBar";
import { NotFoundPage, SectionHeading, ConfirmLeaveModal } from "@/components/shared";
import { useTemplateForm } from "@/lib/hooks/useTemplateForm";
import { REPORT_TYPE_LABELS } from "@/lib/constants/report-type-labels";
import { REPORT_TEMPLATE_PRESETS } from "@/lib/constants/template-presets";
import { useUnsavedChanges } from "@/lib/hooks/useUnsavedChanges";
import { useTemplateStore } from "@/lib/stores/template-store";
import { getStatusColor } from "@/lib/utils/format";
import type { ReportTemplate, ReportType, TemplateStatus } from "@/lib/types";

import { Badge } from "@plexui/ui/components/Badge";
import { Button } from "@plexui/ui/components/Button";
import { Checkbox } from "@plexui/ui/components/Checkbox";
import { Field } from "@plexui/ui/components/Field";
import { Input } from "@plexui/ui/components/Input";
import { Menu } from "@plexui/ui/components/Menu";
import { Select } from "@plexui/ui/components/Select";
import { Slider } from "@plexui/ui/components/Slider";
import { Switch } from "@plexui/ui/components/Switch";
import { DotsHorizontal } from "@plexui/ui/components/Icon";

const REPORT_TYPE_OPTIONS = Object.entries(REPORT_TYPE_LABELS).map(([value, label]) => ({ value, label }));

const SCREENING_SOURCES: Record<ReportType, string[]> = {
  watchlist: ["OFAC SDN", "UN Consolidated", "EU Sanctions", "UK HMT", "FBI Most Wanted", "Interpol Red Notices"],
  pep: ["World PEP Database", "National PEP Lists", "State-owned Enterprises", "Government Officials DB"],
  adverse_media: ["Global Media Archive", "Financial Crime News", "Regulatory Actions DB", "Court Records"],
};

interface ReportForm {
  name: string;
  type: ReportType;
  status: TemplateStatus;
  screeningSources: string[];
  settings: {
    matchThreshold: number;
    continuousMonitoring: boolean;
    monitoringFrequencyDays: number;
    enableFuzzyMatch: boolean;
  };
}

const DEFAULT_FORM: ReportForm = {
  name: "",
  type: "watchlist",
  status: "draft",
  screeningSources: [...SCREENING_SOURCES.watchlist],
  settings: { matchThreshold: 80, continuousMonitoring: false, monitoringFrequencyDays: 30, enableFuzzyMatch: true },
};

function buildFormFromPreset(presetParam: string): ReportForm {
  const preset = REPORT_TEMPLATE_PRESETS.find((p) => p.id === presetParam);
  if (!preset) return DEFAULT_FORM;
  return {
    name: preset.defaults.name,
    type: preset.defaults.type,
    status: "draft",
    screeningSources: preset.defaults.screeningSources,
    settings: { ...preset.defaults.settings },
  };
}

function toForm(t: ReportTemplate): ReportForm {
  return {
    name: t.name,
    type: t.type,
    status: t.status,
    screeningSources: t.screeningSources,
    settings: {
      matchThreshold: t.settings.matchThreshold,
      continuousMonitoring: t.settings.continuousMonitoring,
      monitoringFrequencyDays: t.settings.monitoringFrequencyDays,
      enableFuzzyMatch: t.settings.enableFuzzyMatch,
    },
  };
}

export default function ReportTemplateDetailPage() {
  return (
    <Suspense fallback={null}>
      <ReportTemplateDetailContent />
    </Suspense>
  );
}

function ReportTemplateDetailContent() {
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { reportTemplates } = useTemplateStore();

  const { form, setForm, patch, isNew, existing } = useTemplateForm({
    id,
    getExisting: reportTemplates.getById,
    presetParam: searchParams.get("preset"),
    toForm,
    buildFromPreset: buildFormFromPreset,
    defaultForm: DEFAULT_FORM,
  });
  const [initialForm, setInitialForm] = useState(form);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("idle");
  const saveTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
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
    return <NotFoundPage section="Report Templates" backHref="/reports/templates" entity="Report template" />;
  }
  function patchSettings(p: Partial<ReportForm["settings"]>) {
    setForm((prev) => ({ ...prev, settings: { ...prev.settings, ...p } }));
  }
  function changeType(type: ReportType) {
    patch({ type, screeningSources: [...SCREENING_SOURCES[type]] });
  }

  function toggleSource(source: string, checked: boolean) {
    setForm((prev) => ({
      ...prev,
      screeningSources: checked
        ? [...prev.screeningSources, source]
        : prev.screeningSources.filter((s) => s !== source),
    }));
  }

  function save(formOverride?: ReportForm) {
    const f = formOverride ?? form;
    if (formOverride) setForm(f);
    setSaveState("saving");
    clearTimeout(saveTimerRef.current);
    const payload: Omit<ReportTemplate, "id" | "createdAt" | "updatedAt"> = {
      ...f,
      name: f.name.trim() || "Untitled report template",
      settings: {
        ...f.settings,
        monitoringFrequencyDays: f.settings.continuousMonitoring ? f.settings.monitoringFrequencyDays : 30,
      },
    };
    if (isNew) {
      const created = reportTemplates.create(payload);
      router.replace(`/reports/templates/${created.id}`);
    } else {
      reportTemplates.update(id, payload);
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
    reportTemplates.delete(id);
    router.push("/reports/templates");
  }

  const sourceOptions = SCREENING_SOURCES[form.type];
  const title = isNew ? "New report template" : (existing?.name ?? "Report template");
  const canPublish = form.status === "draft";
  const canUnpublish = form.status === "active";
  const backHref = "/reports/templates";

  return (
    <div className="flex h-full flex-col overflow-auto">
      <TopBar
        title={<span className="flex items-center gap-2">{title}{!isNew && <Badge color={getStatusColor(form.status) as "warning" | "success" | "secondary"} size="sm" pill>{form.status.charAt(0).toUpperCase() + form.status.slice(1)}</Badge>}</span>}
        backHref={backHref}
        backLabel="Report Templates"
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
                    <Menu.Item onSelect={() => save({ ...form, status: "active" })}>Publish</Menu.Item>
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
          <Field label="Name" description="A descriptive name for this report template">
            <Input value={form.name} onChange={(e) => patch({ name: e.target.value })} placeholder="e.g. Global Watchlist Screen" />
          </Field>
        </div>
        <div className="mb-8">
          <Field label="Type" description="The category of screening this report performs">
            <div className="w-64">
              <Select
                options={REPORT_TYPE_OPTIONS}
                value={form.type}
                onChange={(o) => { if (o) changeType(o.value as ReportType); }}
                pill={false}
                block
              />
            </div>
          </Field>
        </div>

        <SectionHeading size="xs">Screening sources</SectionHeading>
        <div className="mb-8 divide-y divide-[var(--color-border)] rounded-lg border border-[var(--color-border)]">
          {sourceOptions.map((source) => (
            <div key={source} className="px-4 py-3">
              <Checkbox
                label={source}
                checked={form.screeningSources.includes(source)}
                onCheckedChange={(checked) => toggleSource(source, checked)}
              />
            </div>
          ))}
        </div>

        <SectionHeading size="xs">Settings</SectionHeading>
        <div className="divide-y divide-[var(--color-border)] rounded-lg border border-[var(--color-border)]">
          <div className="flex items-center justify-between px-4 py-4">
            <div className="mr-4">
              <p className="text-sm font-medium text-[var(--color-text)]">Match threshold</p>
              <p className="text-sm text-[var(--color-text-secondary)]">Minimum confidence score (0–100): {form.settings.matchThreshold}</p>
            </div>
            <div className="w-48 shrink-0">
              <Slider
                min={0}
                max={100}
                step={1}
                value={form.settings.matchThreshold}
                onChange={(v) => patchSettings({ matchThreshold: v })}
              />
            </div>
          </div>
          <div className="flex items-center justify-between px-4 py-4">
            <div className="mr-4">
              <p className="text-sm font-medium text-[var(--color-text)]">Continuous monitoring</p>
              <p className="text-sm text-[var(--color-text-secondary)]">Automatically re-screen on a recurring schedule</p>
            </div>
            <Switch checked={form.settings.continuousMonitoring} onCheckedChange={(c) => patchSettings({ continuousMonitoring: c })} />
          </div>
          {form.settings.continuousMonitoring && (
            <div className="flex items-center justify-between px-4 py-4">
              <div className="mr-4">
                <p className="text-sm font-medium text-[var(--color-text)]">Monitoring frequency</p>
                <p className="text-sm text-[var(--color-text-secondary)]">Days between re-screens</p>
              </div>
              <div className="w-20 shrink-0">
                <Input
                  type="number"
                  value={String(form.settings.monitoringFrequencyDays)}
                  onChange={(e) => patchSettings({ monitoringFrequencyDays: Number(e.target.value) || 1 })}
                />
              </div>
            </div>
          )}
          <div className="flex items-center justify-between px-4 py-4">
            <div className="mr-4">
              <p className="text-sm font-medium text-[var(--color-text)]">Fuzzy matching</p>
              <p className="text-sm text-[var(--color-text-secondary)]">Allow approximate name matching for broader coverage</p>
            </div>
            <Switch checked={form.settings.enableFuzzyMatch} onCheckedChange={(c) => patchSettings({ enableFuzzyMatch: c })} />
          </div>
        </div>
      </div>

      <ConfirmLeaveModal open={showLeaveConfirm} onConfirm={confirmLeave} onCancel={cancelLeave} />
    </div>
  );
}
