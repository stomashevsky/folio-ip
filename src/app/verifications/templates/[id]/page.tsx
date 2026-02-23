"use client";

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";

import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";

import { TopBar, TOPBAR_CONTROL_SIZE, TOPBAR_ACTION_PILL, TOPBAR_TOOLBAR_PILL } from "@/components/layout/TopBar";
import { NotFoundPage, SectionHeading, ConfirmLeaveModal, CopyButton, SettingsModal, ToggleSetting } from "@/components/shared";
import { useTemplateForm } from "@/lib/hooks/useTemplateForm";

import { checkDescriptions } from "@/lib/data/check-descriptions";
import { CHECK_CATEGORY_LABELS, CHECK_CATEGORY_COLORS, CHECK_CATEGORY_DESCRIPTIONS, CHECK_LIFECYCLE_HINTS } from "@/lib/constants/check-category-labels";

import { EXTRACTED_ATTRIBUTE_OPTIONS, type CountrySettings } from "@/lib/constants/countries";
import { VERIFICATION_TYPE_OPTIONS, CHECK_TYPE_OPTIONS } from "@/lib/constants/filter-options";
import { TABLE_TH, TABLE_TH_SORTABLE, TABLE_SORT_ICON_SIZE, MODAL_CONTROL_SIZE } from "@/lib/constants/page-layout";
import { VERIFICATION_TEMPLATE_PRESETS } from "@/lib/constants/template-presets";
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
import { Tabs } from "@plexui/ui/components/Tabs";
import { Select } from "@plexui/ui/components/Select";
import { SelectControl } from "@plexui/ui/components/SelectControl";

import { Tooltip } from "@plexui/ui/components/Tooltip";
import { Switch } from "@plexui/ui/components/Switch";
import { ArrowDownSm, ArrowUpSm, CheckMd, DotsHorizontal, Search, SettingsCog, Sort } from "@plexui/ui/components/Icon";

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

      <div className={`flex-1 ${activeTab === "Allowed Countries" ? "overflow-hidden" : "overflow-auto px-4 md:px-6"}`}>
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



/** Row data shape used by TanStack Table in ChecksTab */
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
  const [settingsCheckName, setSettingsCheckName] = useState<string | null>(null);
  const [matchReqCheckName, setMatchReqCheckName] = useState<string | null>(null);
  const [sorting, setSorting] = useState<SortingState>([{ id: "name", desc: false }]);
  const [draftSubConfig, setDraftSubConfig] = useState<CheckSubConfig | undefined>(undefined);

  // Suppress checkbox entry animation on initial mount — @starting-style in PlexUI
  // Checkbox CSS causes all pre-checked checkboxes to animate in simultaneously.
  const [suppressAnim, setSuppressAnim] = useState(true);
  useEffect(() => {
    const id = requestAnimationFrame(() => setSuppressAnim(false));
    return () => cancelAnimationFrame(id);
  }, []);

  const enabledCount = checks.filter((c) => c.enabled).length;
  const requiredCount = checks.filter((c) => c.required).length;

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

  // Find the current check data for the settings modal
  const settingsRow = settingsCheckName ? data.find((r) => r.check.name === settingsCheckName) : null;

  // Sync draft config when settings modal opens
  const [prevSettingsOpen, setPrevSettingsOpen] = useState(false);
  const isSettingsOpen = !!settingsCheckName;
  if (isSettingsOpen && !prevSettingsOpen && settingsRow) {
    setDraftSubConfig(settingsRow.check.subConfig ? structuredClone(settingsRow.check.subConfig) : undefined);
  }
  if (isSettingsOpen !== prevSettingsOpen) setPrevSettingsOpen(isSettingsOpen);

  const columns = useMemo<ColumnDef<CheckRow, unknown>[]>(
    () => [
      {
        id: "name",
        accessorFn: (row) => row.check.name,
        header: "Checks",
        enableSorting: true,
        cell: ({ row }) => {
          const { check, description, formIndex } = row.original;
          return (
            <div className="flex items-start gap-2.5">
              <div className="mt-[3.5px]" onClick={(e) => e.stopPropagation()}>
                <Switch
                  checked={check.enabled}
                  onCheckedChange={(v) => onUpdateCheck(formIndex, { ...check, enabled: v })}
                />
              </div>
              <div className="flex flex-col">
                <div className="flex min-h-[26px] items-center gap-2">
                  <span className="text-sm font-medium text-[var(--color-text)]">{check.name}</span>
                  {check.lifecycle === "beta" && (
                    <Tooltip content={CHECK_LIFECYCLE_HINTS.beta} side="top" sideOffset={4}>
                      <Badge pill color="discovery" variant="soft" size="sm">
                        Beta
                      </Badge>
                    </Tooltip>
                  )}
                  {check.lifecycle === "sunset" && (
                    <Tooltip content={CHECK_LIFECYCLE_HINTS.sunset} side="top" sideOffset={4}>
                      <Badge pill color="warning" variant="soft" size="sm">
                        Sunset
                      </Badge>
                    </Tooltip>
                  )}
                </div>
                {description && (
                  <span className="text-xs text-[var(--color-text-tertiary)]">{description}</span>
                )}
              </div>
            </div>
          );
        },
      },
      {
        id: "category",
        accessorFn: (row) => row.check.categories[0] ?? "",
        header: "Type",
        size: 260,
        meta: { align: "right" },
        enableSorting: true,
        cell: ({ row }) => (
          <div className="flex min-h-[26px] flex-wrap items-center justify-end gap-1">
            {row.original.requiresBiometric && (
              <Tooltip content="Biometric processing is required to use this feature. We recommend consulting with your legal team and compliance advisors to ensure that your business meets the proper requirements to process this biometric data." side="top" sideOffset={4}>
                <Badge pill color="info" variant="soft" size="sm">
                  Biometric
                </Badge>
              </Tooltip>
            )}
            {row.original.check.categories.map((cat) => {
              const catDescription = CHECK_CATEGORY_DESCRIPTIONS[cat] ?? "";
              return (
                <Tooltip key={cat} content={catDescription} side="top" sideOffset={4}>
                  <Badge pill color={(CHECK_CATEGORY_COLORS[cat] ?? "secondary") as "info" | "secondary" | "danger" | "discovery" | "warning" | "caution"} variant="soft" size="sm">
                    {CHECK_CATEGORY_LABELS[cat] ?? cat}
                  </Badge>
                </Tooltip>
              );
            })}
          </div>
        ),
      },
      {
        id: "required",
        accessorFn: (row) => row.check.required,
        header: () => (
          <Tooltip content="If a required check fails, the associated Verification Check will fail." side="top" sideOffset={4}>
            <span className="cursor-help border-b border-dashed border-[var(--color-text-tertiary)]">Requirement</span>
          </Tooltip>
        ),
        size: 140,
        meta: { align: "right" },
        enableSorting: true,
        sortDescFirst: true,
        cell: ({ row }) => {
          const { check, formIndex } = row.original;
          return (
            <div className="flex justify-end" onClick={(e) => e.stopPropagation()}>
              <Menu>
                <Menu.Trigger>
                  <SelectControl variant="ghost" selected size="xs" block={false} className={check.required ? undefined : "text-[var(--color-text-tertiary)]"}>
                    {check.required ? "Required" : "Optional"}
                  </SelectControl>
                </Menu.Trigger>
                <Menu.Content minWidth={120}>
                  <Menu.Item onSelect={() => onUpdateCheck(formIndex, { ...check, required: true })}>
                    <span className="flex items-center gap-2">
                      {check.required ? <CheckMd className="size-3.5" /> : <span className="w-3.5" />}
                      Required
                    </span>
                  </Menu.Item>
                  <Menu.Item onSelect={() => onUpdateCheck(formIndex, { ...check, required: false })}>
                    <span className="flex items-center gap-2">
                      {!check.required ? <CheckMd className="size-3.5" /> : <span className="w-3.5" />}
                      Optional
                    </span>
                  </Menu.Item>
                </Menu.Content>
              </Menu>
            </div>
          );
        },
      },
      {
        id: "settings",
        header: "Config",
        accessorFn: (row) => row.hasConfig,
        size: 100,
        meta: { align: "right" },
        enableSorting: true,
        cell: ({ row }) => {
          const { check, hasConfig, configType } = row.original;
          if (!hasConfig) return null;
          return (
            <div className="flex justify-end" onClick={(e) => e.stopPropagation()}>
              <Button
                color="secondary"
                variant="ghost"
                size="xs"
                onClick={() => {
                  if (configType === "comparison") {
                    setMatchReqCheckName(check.name);
                  } else {
                    setSettingsCheckName(check.name);
                  }
                }}
              >
                <SettingsCog />
              </Button>
            </div>
          );
        },
      },
    ],
    [onUpdateCheck],
  );

  // eslint-disable-next-line react-hooks/incompatible-library -- TanStack Table API is intentionally non-memoizable
  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    meta: {},
    onSortingChange: setSorting,
    getRowId: (row) => row.check.name,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div data-suppress-anim={suppressAnim || undefined}>
      <table className="-mb-px w-full" data-datatable>
        <thead className="sticky top-0 z-10 bg-[var(--color-surface)]">
          <tr>
            <th colSpan={4} className="pt-6 pb-3 text-left font-normal">
              <div className="flex flex-wrap items-center gap-2">
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
                {(statusFilter.length > 0 || typeFilter.length > 0) && (
                  <Button color="secondary" variant="soft" size="sm" pill onClick={() => { setStatusFilter([]); setTypeFilter([]); }}>
                    Clear filters
                  </Button>
                )}
                <p className="ml-auto text-sm text-[var(--color-text-tertiary)]">
                  {enabledCount} of {checks.length} enabled · {requiredCount} required
                </p>
              </div>
            </th>
          </tr>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} style={{ boxShadow: "inset 0 -1px 0 var(--color-border)" }}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  style={header.getSize() !== 150 ? { minWidth: header.getSize(), width: header.getSize() } : undefined}
                  className={`${TABLE_TH}${(header.column.columnDef.meta as { thClassName?: string })?.thClassName ? ` ${(header.column.columnDef.meta as { thClassName?: string }).thClassName}` : ""}`}
                >
                  {header.isPlaceholder ? null : (
                    <div
                      className={`flex items-center gap-1${(header.column.columnDef.meta as { align?: string })?.align === "right" ? " justify-end" : ""} ${
                        header.column.getCanSort()
                          ? TABLE_TH_SORTABLE
                          : ""
                      }`}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getCanSort() && (
                        <span>
                          {header.column.getIsSorted() === "asc" ? (
                            <ArrowUpSm style={{ width: TABLE_SORT_ICON_SIZE, height: TABLE_SORT_ICON_SIZE }} />
                          ) : header.column.getIsSorted() === "desc" ? (
                            <ArrowDownSm style={{ width: TABLE_SORT_ICON_SIZE, height: TABLE_SORT_ICON_SIZE }} />
                          ) : (
                            <Sort style={{ width: TABLE_SORT_ICON_SIZE, height: TABLE_SORT_ICON_SIZE }} className="opacity-40" />
                          )}
                        </span>
                      )}
                    </div>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.length === 0 ? (
            <tr>
              <td colSpan={4} className="py-12 text-center text-sm text-[var(--color-text-tertiary)]">
                No checks match your filters.
              </td>
            </tr>
          ) : (
            table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-b border-[var(--color-border)]">
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    style={{ verticalAlign: 'top', ...(cell.column.getSize() !== 150 ? { minWidth: cell.column.getSize(), width: cell.column.getSize() } : undefined) }}
                    className={`py-2.5 pr-2${(cell.column.columnDef.meta as { tdClassName?: string })?.tdClassName ? ` ${(cell.column.columnDef.meta as { tdClassName?: string }).tdClassName}` : ""}`}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Check Settings Modal */}
      {settingsRow && (
        <SettingsModal
          open={!!settingsRow}
          onOpenChange={(open) => { if (!open) setSettingsCheckName(null); }}
          title={settingsRow.check.name}
          footer={
            <>
              <Button color="primary" variant="soft" onClick={() => setSettingsCheckName(null)}>
                Cancel
              </Button>
              <Button color="primary" onClick={() => {
                onUpdateCheck(settingsRow.formIndex, {
                  ...settingsRow.check,
                  subConfig: draftSubConfig,
                });
                setSettingsCheckName(null);
              }}>
                Save
              </Button>
            </>
          }
        >
          <CheckConfigPanel
            configType={settingsRow.configType!}
            subConfig={draftSubConfig}
            onUpdate={(patch) => setDraftSubConfig((prev) => ({ ...prev, ...patch }))}
          />
        </SettingsModal>
      )}

      {/* Match Requirements — direct modal for comparison checks */}
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
          <div className="flex gap-4">
            <div className="flex-1">
              <Field label="Min">
                <Input
                  type="number"
                  placeholder=""
                  value={subConfig?.ageRange?.min != null ? String(subConfig.ageRange.min) : ""}
                  onChange={(e) => {
                    const val = e.target.value === "" ? undefined : Number(e.target.value);
                    onUpdate({ ageRange: { ...subConfig?.ageRange, min: val } });
                  }}
                />
              </Field>
            </div>
            <div className="flex-1">
              <Field label="Max">
                <Input
                  type="number"
                  placeholder=""
                  value={subConfig?.ageRange?.max != null ? String(subConfig.ageRange.max) : ""}
                  onChange={(e) => {
                    const val = e.target.value === "" ? undefined : Number(e.target.value);
                    onUpdate({ ageRange: { ...subConfig?.ageRange, max: val } });
                  }}
                />
              </Field>
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
        <div className="flex flex-wrap items-center gap-2">
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
