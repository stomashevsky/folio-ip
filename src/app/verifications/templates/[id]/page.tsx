"use client";

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";

import { TopBar, TOPBAR_CONTROL_SIZE, TOPBAR_ACTION_PILL, TOPBAR_TOOLBAR_PILL } from "@/components/layout/TopBar";
import { NotFoundPage, SectionHeading, ConfirmLeaveModal, CopyButton, ToggleSetting } from "@/components/shared";
import { useTemplateForm } from "@/lib/hooks/useTemplateForm";

import { checkDescriptions } from "@/lib/data/check-descriptions";
import { CHECK_CATEGORY_LABELS, CHECK_CATEGORY_COLORS, CHECK_LIFECYCLE_HINTS, BIOMETRIC_DESCRIPTION } from "@/lib/constants/check-category-labels";

import { EXTRACTED_ATTRIBUTE_OPTIONS, type CountrySettings } from "@/lib/constants/countries";
import { VERIFICATION_TYPE_OPTIONS, CHECK_TYPE_OPTIONS } from "@/lib/constants/filter-options";
import { MODAL_CONTROL_SIZE, MODAL_NUMBER_INPUT_WIDTH, COLUMN_HEADER, COLUMN_HEADER_LABEL, COLUMN_HEADER_VALUE } from "@/lib/constants/page-layout";
import { VERIFICATION_TEMPLATE_PRESETS } from "@/lib/constants/template-presets";
import { BREAKPOINT_LG } from "@/lib/constants/breakpoints";
import { AVAILABLE_CHECKS } from "@/lib/constants/verification-checks";
import { useUnsavedChanges } from "@/lib/hooks/useUnsavedChanges";
import { useTemplateStore } from "@/lib/stores/template-store";
import { getStatusColor } from "@/lib/utils/format";
import type {
  CheckCategory,
  CheckConfigType,
  CheckSubConfig,
  ExtractedProperty,
  TemplateStatus,
  VerificationCheckConfig,
  VerificationTemplate,
  VerificationType,
} from "@/lib/types";
import { CheckCodeEditor } from "@/components/check-config/CheckCodeEditor";
import { CountriesTab } from "./CountriesTab";

import { Badge } from "@plexui/ui/components/Badge";
import { Button } from "@plexui/ui/components/Button";
import { Field } from "@plexui/ui/components/Field";
import { Input } from "@plexui/ui/components/Input";
import { Menu } from "@plexui/ui/components/Menu";
import { RadioGroup } from "@plexui/ui/components/RadioGroup";
import { Tabs } from "@plexui/ui/components/Tabs";
import { Select } from "@plexui/ui/components/Select";
import { SelectControl } from "@plexui/ui/components/SelectControl";

import { Tooltip } from "@plexui/ui/components/Tooltip";
import { Checkbox } from "@plexui/ui/components/Checkbox";
import { ChevronLeftMd, DotsHorizontal, Search, SettingsCog } from "@plexui/ui/components/Icon";
import { useIsMobile } from "@/lib/hooks";

/* ─── Constants ─── */

const CAPTURE_METHOD_OPTIONS = [
  { value: "auto", label: "Auto" },
  { value: "manual", label: "Manual" },
  { value: "both", label: "Both" },
];

const CAPTURE_METHOD_TYPES = new Set<VerificationType>(["government_id", "selfie", "document"]);


const CHECK_STATUS_FILTER_OPTIONS = [
  { value: "enabled", label: "Enabled" },
  { value: "disabled", label: "Disabled" },
  { value: "required", label: "Required" },
  { value: "non_required", label: "Non-required" },
  { value: "configurable", label: "Configurable" },
  { value: "non_configurable", label: "Non-configurable" },
];

/* ─── Tabs ─── */

type TemplateTab = "Checks" | "Allowed Countries" | "Settings";

/* ─── Form types & helpers ─── */

interface VerificationForm {
  name: string;
  type: VerificationType;
  status: TemplateStatus;
  lastPublishedAt?: string;
  checks: VerificationCheckConfig[];
  settings: {
    allowedCountries: string[];
    countrySettings: Record<string, CountrySettings>;
    maxRetries: number;
    captureMethod: "auto" | "manual" | "both";
  };
}

function checksForType(type: VerificationType): VerificationCheckConfig[] {
  return AVAILABLE_CHECKS[type].map((c) => ({
    name: c.name,
    categories: c.categories,
    required: c.defaultRequired,
    enabled: c.defaultEnabled,
    ...(c.lifecycle && { lifecycle: c.lifecycle }),
  }));
}

const DEFAULT_FORM: VerificationForm = {
  name: "",
  type: "government_id",
  status: "draft",
  checks: checksForType("government_id"),
  settings: { allowedCountries: ["US"], countrySettings: {}, maxRetries: 2, captureMethod: "auto" },
};

function buildFormFromPreset(presetParam: string): VerificationForm {
  const preset = VERIFICATION_TEMPLATE_PRESETS.find((p) => p.id === presetParam);
  if (!preset) return DEFAULT_FORM;
  const available = AVAILABLE_CHECKS[preset.defaults.type];
  const presetCheckNames = new Map(preset.defaults.checks.map((c) => [c.name, c]));
  const checks: VerificationCheckConfig[] = available.map((a) => {
    const existing = presetCheckNames.get(a.name);
    return {
      name: a.name,
      categories: a.categories,
      required: existing ? existing.required : a.defaultRequired,
      enabled: existing ? true : a.defaultEnabled,
      ...(a.lifecycle && { lifecycle: a.lifecycle }),
    };
  });
  return {
    name: preset.defaults.name,
    type: preset.defaults.type,
    status: "draft",
    checks,
    settings: { countrySettings: {}, ...preset.defaults.settings },
  };
}

function toForm(t: VerificationTemplate): VerificationForm {
  const available = AVAILABLE_CHECKS[t.type];
  const existingByName = new Map(t.checks.map((c) => [c.name, c]));
  const checks: VerificationCheckConfig[] = available.map((a) => {
    const existing = existingByName.get(a.name);
    return {
      name: a.name,
      categories: a.categories,
      required: existing ? existing.required : a.defaultRequired,
      enabled: existing ? (existing.enabled ?? true) : a.defaultEnabled,
      ...(a.lifecycle && { lifecycle: a.lifecycle }),
      ...(existing?.subConfig && { subConfig: existing.subConfig }),
    };
  });
  return {
    name: t.name,
    type: t.type,
    status: t.status,
    lastPublishedAt: t.lastPublishedAt,
    checks,
    settings: {
      allowedCountries: t.settings.allowedCountries,
      countrySettings: t.settings.countrySettings ?? {},
      maxRetries: t.settings.maxRetries,
      captureMethod: t.settings.captureMethod,
    },
  };
}

/* ─── Page ─── */

export default function VerificationTemplateDetailPage() {
  return (
    <Suspense fallback={null}>
      <VerificationTemplateDetailContent />
    </Suspense>
  );
}

/* ─── Main content ─── */

function VerificationTemplateDetailContent() {
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { verificationTemplates } = useTemplateStore();
  const [activeTab, setActiveTab] = useState<TemplateTab>("Checks");

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
  const [prevId, setPrevId] = useState(id);
  if (prevId !== id) {
    setPrevId(id);
    const next = existing ? toForm(existing) : DEFAULT_FORM;
    setForm(next);
    setInitialForm(next);
  }

  const isDirty = isNew || JSON.stringify(form) !== JSON.stringify(initialForm);
  const { confirmNavigation, showLeaveConfirm, confirmLeave, cancelLeave } = useUnsavedChanges(isDirty);
  const updateCheck = useCallback((i: number, next: VerificationCheckConfig) => {
    setForm((prev) => ({ ...prev, checks: prev.checks.map((c, idx) => (idx === i ? next : c)) }));
  }, [setForm]);

  if (!isNew && !existing) {
    return <NotFoundPage section="Verification Templates" backHref="/verifications/templates" entity="Verification template" />;
  }

  function patchSettings(p: Partial<VerificationForm["settings"]>) {
    setForm((prev) => ({ ...prev, settings: { ...prev.settings, ...p } }));
  }
  function toggleCountry(code: string) {
    const set = new Set(form.settings.allowedCountries);
    const next = { ...form.settings.countrySettings };
    if (set.has(code)) {
      set.delete(code);
      delete next[code];
    } else {
      set.add(code);
    }
    patchSettings({ allowedCountries: Array.from(set), countrySettings: next });
  }
  function toggleCountries(codes: string[], enabled: boolean) {
    const set = new Set(form.settings.allowedCountries);
    const next = { ...form.settings.countrySettings };
    for (const code of codes) {
      if (enabled) {
        set.add(code);
      } else {
        set.delete(code);
        delete next[code];
      }
    }
    patchSettings({ allowedCountries: Array.from(set), countrySettings: next });
  }
  function updateCountrySettings(code: string, cs: CountrySettings) {
    patchSettings({
      countrySettings: { ...form.settings.countrySettings, [code]: cs },
    });
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

  const title = form.name || (isNew ? "Untitled template" : "Verification template");
  const canPublish = form.status === "draft";
  const canUnpublish = form.status === "active";
  const backHref = "/verifications/templates";

  return (
    <div className="flex h-full flex-col">
      <TopBar
        title={
          <span className="flex items-center gap-2">
            {title}
            {!isNew && (
              <Badge pill color={getStatusColor(form.status) as "warning" | "success" | "secondary"} size="sm">{form.status.charAt(0).toUpperCase() + form.status.slice(1)}</Badge>
            )}
          </span>
        }
        backHref={backHref}
        backLabel="Verification Templates"
        onBackClick={() => confirmNavigation(backHref)}
        toolbar={
          <div className="flex w-full items-center justify-between">
            <Tabs
              aria-label="Template sections"
              value={activeTab}
              onChange={(v) => setActiveTab(v as TemplateTab)}
              size={TOPBAR_CONTROL_SIZE}
              pill={TOPBAR_TOOLBAR_PILL}
            >
              <Tabs.Tab value="Checks">Checks</Tabs.Tab>
              <Tabs.Tab value="Allowed Countries">Countries</Tabs.Tab>
              <Tabs.Tab value="Settings">Settings</Tabs.Tab>
            </Tabs>
            <div className="flex shrink-0 items-center gap-2">
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
              <Button
                color="primary"
                size={TOPBAR_CONTROL_SIZE}
                pill={TOPBAR_ACTION_PILL}
                onClick={() => save()}
                loading={saveState === "saving"}
                disabled={!isDirty || saveState !== "idle"}
              >
                {saveState === "saved" ? "Saved!" : "Save"}
              </Button>
            </div>
          </div>
        }
      />

      <div className={`flex-1 ${activeTab === "Settings" ? "overflow-auto px-4 md:px-6" : "overflow-hidden"}`}>
        {activeTab === "Checks" && (
          <ChecksTab checks={form.checks} type={form.type} onUpdateCheck={updateCheck} />
        )}
        {activeTab === "Allowed Countries" && (
          <CountriesTab
            selected={form.settings.allowedCountries}
            countrySettings={form.settings.countrySettings}
            onToggle={toggleCountry}
            onToggleBatch={toggleCountries}
            onUpdateCountrySettings={updateCountrySettings}
          />
        )}
        {activeTab === "Settings" && (
          <div className="py-6">
            <SettingsTab
              form={form}
              existing={existing}
              onPatch={patch}
              onPatchSettings={patchSettings}
            />
          </div>
        )}
      </div>

      <ConfirmLeaveModal open={showLeaveConfirm} onConfirm={confirmLeave} onCancel={cancelLeave} />
    </div>
  );
}

/* ─── Checks Tab ─── */

const CHECK_SCOPE_OPTIONS = [
  { value: "same_account", label: "Same account" },
  { value: "all_accounts", label: "All accounts" },
];

/** Row data shape for checks list */
interface CheckRow {
  check: VerificationCheckConfig;
  formIndex: number;
  description: string | undefined;
  requiresBiometric: boolean;
  hasConfig: boolean;
  configType: CheckConfigType | undefined;
}

function ChecksTab({
  checks,
  type,
  onUpdateCheck,
}: {
  checks: VerificationCheckConfig[];
  type: VerificationType;
  onUpdateCheck: (index: number, check: VerificationCheckConfig) => void;
}) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [typeFilter, setTypeFilter] = useState<string[]>([]);
  const [selectedCheckName, setSelectedCheckName] = useState<string | null>(null);
  const [matchReqCheckName, setMatchReqCheckName] = useState<string | null>(null);

  const isMobile = useIsMobile(BREAKPOINT_LG);

  // Suppress checkbox entry animation on initial mount — @starting-style in PlexUI
  // Checkbox CSS causes all pre-checked checkboxes to animate in simultaneously.
  const [suppressAnim, setSuppressAnim] = useState(true);
  useEffect(() => {
    const id = requestAnimationFrame(() => setSuppressAnim(false));
    return () => cancelAnimationFrame(id);
  }, []);


  const enabledCount = checks.filter((c) => c.enabled).length;
  const data = useMemo<CheckRow[]>(() => {
    return checks
      .map((check, formIndex) => {
        const matchesSearch = !search || check.name.toLowerCase().includes(search.toLowerCase());
        if (!matchesSearch) return null;
        const availCheck = AVAILABLE_CHECKS[type]?.find((a) => a.name === check.name);
        if (statusFilter.length > 0) {
          const isEnabled = check.enabled;
          const isRequired = check.required;
          const isConfigurable = availCheck?.configurable === true;
          const matches = statusFilter.every((f) => {
            if (f === "enabled") return isEnabled;
            if (f === "disabled") return !isEnabled;
            if (f === "required") return isRequired;
            if (f === "non_required") return !isRequired;
            if (f === "configurable") return isConfigurable;
            if (f === "non_configurable") return !isConfigurable;
            return true;
          });
          if (!matches) return null;
        }
        if (typeFilter.length > 0) {
          const matchesCat = typeFilter.some((t) => t === "biometric" ? availCheck?.requiresBiometric === true : check.categories.includes(t as CheckCategory));
          if (!matchesCat) return null;
        }
        const isConfigurable = availCheck?.configurable === true;
        const configType = availCheck?.configType;
        return {
          check,
          formIndex,
          description: checkDescriptions[check.name],
          requiresBiometric: availCheck?.requiresBiometric === true,
          hasConfig: isConfigurable && !!configType,
          configType: isConfigurable ? configType : undefined,
        } as CheckRow;
      })
      .filter((r): r is CheckRow => r !== null);
  }, [checks, search, statusFilter, typeFilter, type]);

  const sortedData = useMemo(() => [...data].sort((a, b) => a.check.name.localeCompare(b.check.name)), [data]);

  // Auto-select first check on initial mount (desktop only)
  useEffect(() => {
    if (isMobile) return;
    if (selectedCheckName !== null) return;
    const first = sortedData[0]?.check.name ?? null;
    setSelectedCheckName(first);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile]);

  // If selected check is no longer in filtered list, pick first available (desktop only)
  useEffect(() => {
    if (isMobile) return;
    if (selectedCheckName === null) return;
    const stillVisible = sortedData.some((r) => r.check.name === selectedCheckName);
    if (!stillVisible) {
      setSelectedCheckName(sortedData[0]?.check.name ?? null);
    }
  }, [sortedData, selectedCheckName, isMobile]);

  const selectedRow = selectedCheckName ? sortedData.find((r) => r.check.name === selectedCheckName) : null;

  const hasActiveFilters = statusFilter.length > 0 || typeFilter.length > 0;

  const mobileDetail = isMobile && selectedCheckName !== null;
  return (
    <div className="flex h-full min-h-0 flex-col" data-suppress-anim={suppressAnim || undefined}>
      {/* ── Toolbar (hidden on mobile when viewing detail) ── */}
      {!mobileDetail && (
        <div className="flex flex-wrap items-center gap-2 px-4 pt-6 pb-3 md:px-6">
          <div className="w-56">
            <Input
              size="sm"
              pill
              placeholder="Search checks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onClear={search ? () => setSearch("") : undefined}
              startAdornment={<Search style={{ width: 16, height: 16 }} />}
            />
          </div>
          <div className="w-52">
            <Select
              options={CHECK_STATUS_FILTER_OPTIONS}
              value={statusFilter}
              onChange={(opts) => setStatusFilter(opts.map((o) => o.value))}
              multiple
              clearable
              placeholder="All check statuses"
              size="sm"
              pill
              variant="outline"
              block
              listMinWidth={220}
            />
          </div>
          <div className="w-48">
            <Select
              options={CHECK_TYPE_OPTIONS}
              value={typeFilter}
              onChange={(opts) => setTypeFilter(opts.map((o) => o.value))}
              multiple
              clearable
              placeholder="All check types"
              size="sm"
              pill
              variant="outline"
              block
              listMinWidth={180}
            />
          </div>
          {hasActiveFilters && (
            <Button color="secondary" variant="soft" size="sm" pill onClick={() => { setStatusFilter([]); setTypeFilter([]); }}>
              Clear filters
            </Button>
          )}
        </div>
      )}


      {/* ── Mobile back button (above the card, OpenAI pattern) ── */}
      {mobileDetail && (
        <div className="px-4 pt-4 pb-2">
          <Button color="secondary" variant="soft" size="sm" pill onClick={() => setSelectedCheckName(null)}>
            <ChevronLeftMd className="size-4" />
            Checks
          </Button>
        </div>
      )}

      {/* ── 2-Column Layout ── */}
      <div className="mx-4 mb-4 flex min-h-0 flex-1 overflow-hidden rounded-xl border border-[var(--color-border)] md:mx-6">
        {/* Column 1: Check list — hidden on mobile when detail is shown */}
        {(!isMobile || !selectedCheckName) && (
          <div className={`flex min-h-0 min-w-0 flex-1 flex-col ${!isMobile ? 'border-r border-[var(--color-border)]' : ''}`}>
            <div className={COLUMN_HEADER}>
              <span className={COLUMN_HEADER_LABEL}>Checks</span>
              <span className={COLUMN_HEADER_VALUE}>
                Enabled · {enabledCount} / {checks.length}
              </span>
            </div>
            <div className="flex-1 overflow-y-auto p-1.5">
              {sortedData.map((row) => {
                const { check, formIndex, hasConfig } = row;
                const isSelected = !isMobile && selectedCheckName === check.name;
              return (
                  <div
                    key={check.name}
                    role="button"
                    tabIndex={0}
                    onClick={() => setSelectedCheckName(check.name)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setSelectedCheckName(check.name);
                      } else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
                        e.preventDefault();
                        const idx = sortedData.findIndex((r) => r.check.name === check.name);
                        const next = e.key === "ArrowDown" ? idx + 1 : idx - 1;
                        const target = sortedData[next];
                        if (target) {
                          setSelectedCheckName(target.check.name);
                          const container = e.currentTarget.parentElement;
                          const el = container?.children[next] as HTMLElement | undefined;
                          el?.focus();
                          el?.scrollIntoView({ block: "nearest" });
                        }
                      }
                    }}
                    className={`flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 outline-none transition-colors ${
                      isSelected
                        ? "bg-[var(--gray-100)]"
                        : "hover:bg-[var(--color-surface-secondary)]"
                    }`}
                  >
                    <div
                      className="shrink-0"
                      onClick={(e) => e.stopPropagation()}
                      onPointerDown={(e) => e.stopPropagation()}
                    >
                      <Checkbox
                        checked={check.enabled}
                        onCheckedChange={(v) => onUpdateCheck(formIndex, { ...check, enabled: v })}
                      />
                    </div>
                    <span className="min-w-0 truncate text-sm font-medium text-[var(--color-text)]">{check.name}</span>
                    <div className="ml-auto flex shrink-0 items-center gap-1.5">
                      {hasConfig && (
                        <Badge pill color="secondary" variant="soft" size="sm"><SettingsCog className="size-3" /></Badge>
                      )}
                      {check.required && (
                        <Badge pill color="info" variant="soft" size="sm">Required</Badge>
                      )}
                      {check.lifecycle === "beta" && (
                        <Tooltip content={CHECK_LIFECYCLE_HINTS.beta} side="top" sideOffset={4}>
                          <Badge pill color="discovery" variant="soft" size="sm">Beta</Badge>
                        </Tooltip>
                      )}
                      {check.lifecycle === "sunset" && (
                        <Tooltip content={CHECK_LIFECYCLE_HINTS.sunset} side="top" sideOffset={4}>
                          <Badge pill color="warning" variant="soft" size="sm">Sunset</Badge>
                        </Tooltip>
                      )}
                    </div>
                  </div>
                );
              })}
            {sortedData.length === 0 && (
                <div className="p-6 text-center text-sm text-[var(--color-text-tertiary)]">
                  No checks match your filters.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Column 2: Check details & settings — hidden on mobile when list is shown */}
        {(!isMobile || selectedCheckName) && (
          <div className="flex min-h-0 min-w-0 flex-1 flex-col">
            <div className={COLUMN_HEADER}>
              <span className={COLUMN_HEADER_LABEL}>{selectedRow ? selectedRow.check.name : "Check Settings"}</span>
              <span className={COLUMN_HEADER_VALUE}>
                {selectedRow ? (selectedRow.check.required ? "Required" : "Optional") : "\u00a0"}
              </span>
            </div>
          <div className="flex-1 overflow-y-auto p-4">
              {!selectedRow && (
                <div className="flex h-full items-center justify-center text-sm text-[var(--color-text-tertiary)]">
                  Select a check to configure.
                </div>
              )}
            {selectedRow && (
                <CheckDetailPanel
                  row={selectedRow}
                  onUpdateCheck={onUpdateCheck}
                  onOpenMatchReq={() => setMatchReqCheckName(selectedRow.check.name)}
                />
              )}
            </div>
          </div>
        )}
      </div>

      {/* Match Requirements — modal for comparison checks */}
      {(() => {
        const mqRow = matchReqCheckName ? data.find((r) => r.check.name === matchReqCheckName) : null;
        if (!mqRow) return null;
        return (
           <CheckCodeEditor
            requirements={mqRow.check.subConfig?.matchRequirements ?? []}
            onChange={(reqs) => {
              onUpdateCheck(mqRow.formIndex, {
                ...mqRow.check,
                subConfig: { ...mqRow.check.subConfig, matchRequirements: reqs.length > 0 ? reqs : undefined },
              });
            }}
            defaultOpen
            onClose={() => setMatchReqCheckName(null)}
          />
        );
      })()}
    </div>
  );
}

/* ─── Check Detail Panel (right column) ─── */

function CheckDetailPanel({
  row,
  onUpdateCheck,
  onOpenMatchReq,
}: {
  row: CheckRow;
  onUpdateCheck: (index: number, check: VerificationCheckConfig) => void;
  onOpenMatchReq: () => void;
}) {
  const { check, formIndex, description, requiresBiometric, hasConfig, configType } = row;

  function updateSubConfig(patch: Partial<CheckSubConfig>) {
    onUpdateCheck(formIndex, {
      ...check,
      subConfig: { ...check.subConfig, ...patch },
    });
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Description */}
      {description && (
        <p className="text-sm text-[var(--color-text-secondary)]">{description}</p>
      )}


      {/* Type */}
      {(check.categories.length > 0 || requiresBiometric) && (
        <Field label="Type">
          <div className="flex flex-wrap gap-1.5">
            {check.categories.map((cat) => (
              <Badge key={cat} pill color={(CHECK_CATEGORY_COLORS[cat] ?? "secondary") as "info" | "secondary" | "danger" | "discovery" | "warning" | "caution"} variant="soft" size="sm">
                {CHECK_CATEGORY_LABELS[cat] ?? cat}
              </Badge>
            ))}
            {requiresBiometric && (
              <Tooltip content={BIOMETRIC_DESCRIPTION} side="top" sideOffset={4} maxWidth={320}>
                <Badge pill color="info" variant="soft" size="sm">Biometric</Badge>
              </Tooltip>
            )}
          </div>
        </Field>
      )}
      {/* Required / Optional */}
      <Field label="Requirement" description="If a required check fails, the associated verification will fail.">
        <RadioGroup
          value={check.required ? "required" : "optional"}
          onChange={(v) => onUpdateCheck(formIndex, { ...check, required: v === "required" })}
          direction="row"
        >
          <RadioGroup.Item value="required">Required</RadioGroup.Item>
          <RadioGroup.Item value="optional">Optional</RadioGroup.Item>
        </RadioGroup>
      </Field>

      {/* Config section — only for configurable checks */}
      {hasConfig && configType && (
        <>
          <div className="border-t border-[var(--color-border)]" />
          {configType === "comparison" ? (
            <div>
              <p className="mb-2 text-sm text-[var(--color-text-secondary)]">
                Match requirements define how attributes are compared between sources.
              </p>
              <Button
                color="secondary"
                variant="outline"
                size={MODAL_CONTROL_SIZE}
                onClick={onOpenMatchReq}
              >
                Configure match requirements
              </Button>
            </div>
          ) : (
            <CheckConfigPanel
              configType={configType}
              subConfig={check.subConfig}
              onUpdate={updateSubConfig}
            />
          )}
        </>
      )}
    </div>
  );
}



/* ─── Check Config Panel ─── */

function CheckConfigPanel({
  configType,
  subConfig,
  onUpdate,
}: {
  configType: CheckConfigType;
  subConfig: CheckSubConfig | undefined;
  onUpdate: (patch: Partial<CheckSubConfig>) => void;
}) {
  switch (configType) {
    case "age_range":
      return (
        <Field label="Default age range" description="The default age restriction for verifying the ID holder's age. This default will be used for every country and ID type. You can override it on a per-country basis in Countries and ID Types.">
          <div className="flex items-center gap-2">
            <div className={MODAL_NUMBER_INPUT_WIDTH}>
              <Input
                size={MODAL_CONTROL_SIZE}
                type="number"
                placeholder="Min"
                value={subConfig?.ageRange?.min != null ? String(subConfig.ageRange.min) : ""}
                onChange={(e) => {
                  const val = e.target.value === "" ? undefined : Number(e.target.value);
                  onUpdate({ ageRange: { ...subConfig?.ageRange, min: val } });
                }}
              />
            </div>
            <span className="text-sm text-[var(--color-text-tertiary)]">to</span>
            <div className={MODAL_NUMBER_INPUT_WIDTH}>
              <Input
                size={MODAL_CONTROL_SIZE}
                type="number"
                placeholder="Max"
                value={subConfig?.ageRange?.max != null ? String(subConfig.ageRange.max) : ""}
                onChange={(e) => {
                  const val = e.target.value === "" ? undefined : Number(e.target.value);
                  onUpdate({ ageRange: { ...subConfig?.ageRange, max: val } });
                }}
              />
            </div>
          </div>
        </Field>
      );

    case "expiration":
      return (
        <Field label="Default expiration" description="The default grace period for accepting expired IDs. This default will be used for every country and ID type. You can override it on a per-country and per-ID basis in Countries and ID Types.">
          <div className="flex items-center gap-2">
            <div className="w-24">
              <Input
                type="number"
                placeholder="0"
                value={subConfig?.gracePeriodDays != null ? String(subConfig.gracePeriodDays) : ""}
                onChange={(e) => {
                  const val = e.target.value === "" ? undefined : Number(e.target.value);
                  onUpdate({ gracePeriodDays: val });
                }}
              />
            </div>
            <span className="text-sm text-[var(--color-text-secondary)]">days</span>
          </div>
        </Field>
      );

    case "barcode":
      return (
        <ToggleSetting
          title="Barcode extraction"
          description="Require that information be successfully extracted from the barcode on the ID."
          switchLabel="Require successful extraction"
          checked={subConfig?.requireSuccessfulExtraction ?? false}
          onCheckedChange={(v) => onUpdate({ requireSuccessfulExtraction: v })}
        />
      );

    case "mrz":
      return (
        <ToggleSetting
          title="MRZ validation"
          description="Require that the Machine Readable Zone (MRZ) on the ID be fully detected and contains valid, well-formed data."
          switchLabel="Require full and valid MRZ"
          checked={subConfig?.requireFullMrz ?? false}
          onCheckedChange={(v) => onUpdate({ requireFullMrz: v })}
        />
      );

    case "country":
      return (
        <ToggleSetting
          title="Sovereign country mapping"
          description="Map territory codes to their sovereign country codes (e.g., PR → US)."
          switchLabel="Map to sovereign country"
          checked={subConfig?.mapToSovereignCountry ?? false}
          onCheckedChange={(v) => onUpdate({ mapToSovereignCountry: v })}
        />
      );

    case "repeat":
      return (
        <Field label="Detection scope" description="Scope for detecting repeated submissions">
          <div className="w-52">
            <Select
              options={CHECK_SCOPE_OPTIONS}
              value={subConfig?.scope ?? "same_account"}
              onChange={(o) => { if (o) onUpdate({ scope: o.value as "same_account" | "all_accounts" }); }}
              pill={false}
              block
            />
          </div>
        </Field>
      );


    case "comparison":
      return (
         <CheckCodeEditor
          requirements={subConfig?.matchRequirements ?? []}
          onChange={(reqs) => onUpdate({ matchRequirements: reqs.length > 0 ? reqs : undefined })}
        />
      );

    case "extracted_properties":
      return (
        <ExtractedPropertiesPanel
          requiredAttributes={subConfig?.requiredAttributes ?? []}
          passWhenMissing={subConfig?.passWhenPropertyMissing ?? true}
          onUpdate={onUpdate}
        />
      );

    default:
      return null;
  }
}



/* ─── Extracted Properties Panel ─── */

function ExtractedPropertiesPanel({
  requiredAttributes,
  passWhenMissing,
  onUpdate,
}: {
  requiredAttributes: ExtractedProperty[];
  passWhenMissing: boolean;
  onUpdate: (patch: Partial<CheckSubConfig>) => void;
}) {
  const removeAttribute = useCallback(
    (attr: ExtractedProperty) => {
      const next = requiredAttributes.filter((a) => a !== attr);
      onUpdate({ requiredAttributes: next.length > 0 ? next : undefined });
    },
    [requiredAttributes, onUpdate],
  );

  return (
    <div className="flex flex-col gap-5">
      <Field label="Default Required Attributes" description="The ID details that must be successfully extracted for this check to pass. These defaults will be used for every country and ID type. You can override them on a per-country and per-ID basis in Countries and ID Types.">
        <div className="flex flex-col gap-2">
          <div className="w-52">
            <Select
              options={EXTRACTED_ATTRIBUTE_OPTIONS}
              value={requiredAttributes}
              onChange={(opts) => {
                const next = opts.map((o) => o.value as ExtractedProperty);
                onUpdate({ requiredAttributes: next.length > 0 ? next : undefined });
              }}
              multiple
              clearable
              placeholder="Add"
              size={MODAL_CONTROL_SIZE}
              block
              listMinWidth={200}
              TriggerView={() => <span className="truncate">{requiredAttributes.length === 0 ? 'No required attributes' : `${requiredAttributes.length} selected`}</span>}
            />
          </div>
          {requiredAttributes.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {requiredAttributes.map((attr) => {
                const label = EXTRACTED_ATTRIBUTE_OPTIONS.find((o) => o.value === attr)?.label ?? attr;
                return (
                  <SelectControl
                    key={attr}
                    variant="soft"
                    size="xs"
                    selected
                    pill
                    dropdownIconType="none"
                    onClearClick={() => removeAttribute(attr)}
                  >
                    {label}
                  </SelectControl>
                );
              })}
            </div>
          )}
        </div>
      </Field>

      <ToggleSetting
        switchLabel="Pass when required property does not appear on the ID"
        checked={passWhenMissing}
        onCheckedChange={(v) => onUpdate({ passWhenPropertyMissing: v })}
      />
    </div>
  );
}


/* ─── Settings Tab ─── */

function SettingsTab({
  form,
  existing,
  onPatch,
  onPatchSettings,
}: {
  form: VerificationForm;
  existing: VerificationTemplate | undefined;
  onPatch: (partial: Partial<VerificationForm>) => void;
  onPatchSettings: (p: Partial<VerificationForm["settings"]>) => void;
}) {
  return (
    <div className="mx-auto w-full max-w-xl">
      {/* General */}
      <SectionHeading size="xs">General</SectionHeading>
      <div className="mb-6">
        <Field label="Name" description="A descriptive name for this verification template">
          <Input
            value={form.name}
            onChange={(e) => onPatch({ name: e.target.value })}
            placeholder="e.g. Government ID Verification"
          />
        </Field>
      </div>
      <div className="mb-8">
        <Field label="Type" description="Type is set at creation and cannot be changed">
          <p className="text-sm text-[var(--color-text)]">
            {VERIFICATION_TYPE_OPTIONS.find((o) => o.value === form.type)?.label ?? form.type}
          </p>
        </Field>
      </div>

      {/* Identifiers (existing templates only) */}
      {existing && (
        <>
          <SectionHeading size="xs">Identifiers</SectionHeading>
          <div className="mb-8 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm text-[var(--color-text-secondary)]">Template ID</p>
              <span className="flex items-center gap-1 font-mono text-sm text-[var(--color-text)]">
                {existing.id}
                <CopyButton value={existing.id} />
              </span>
            </div>
            {existing.versionId && (
              <div className="flex items-center justify-between">
                <p className="text-sm text-[var(--color-text-secondary)]">Version ID</p>
                <span className="flex items-center gap-1 font-mono text-sm text-[var(--color-text)]">
                  {existing.versionId}
                  <CopyButton value={existing.versionId} />
                </span>
              </div>
            )}
          </div>
        </>
      )}

      {/* Verification Settings */}
      <SectionHeading size="xs">Verification Settings</SectionHeading>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="mr-4">
            <p className="text-sm font-medium text-[var(--color-text)]">Max retries</p>
            <p className="text-sm text-[var(--color-text-secondary)]">Retry attempts allowed for this verification</p>
          </div>
          <div className="w-20 shrink-0">
            <Input
              type="number"
              value={String(form.settings.maxRetries)}
              onChange={(e) => onPatchSettings({ maxRetries: Number(e.target.value) || 0 })}
            />
          </div>
        </div>
        {CAPTURE_METHOD_TYPES.has(form.type) && (
          <div className="flex items-center justify-between">
            <div className="mr-4">
              <p className="text-sm font-medium text-[var(--color-text)]">Capture method</p>
              <p className="text-sm text-[var(--color-text-secondary)]">How verification data is captured</p>
            </div>
            <div className="w-32 shrink-0">
              <Select
                options={CAPTURE_METHOD_OPTIONS}
                value={form.settings.captureMethod}
                onChange={(o) => { if (o) onPatchSettings({ captureMethod: o.value as "auto" | "manual" | "both" }); }}
                pill={false}
                block
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
