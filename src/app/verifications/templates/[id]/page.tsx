"use client";

import { Fragment, Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import { NotFoundPage, SectionHeading, ConfirmLeaveModal, CopyButton, Modal, ModalHeader, ModalBody, ModalFooter } from "@/components/shared";
import { useTemplateForm } from "@/lib/hooks/useTemplateForm";

import { checkDescriptions } from "@/lib/data/check-descriptions";

import {
  ALL_ID_DOC_TYPES,
  COUNTRY_OPTIONS,
  COUNTRY_REGIONS,
  ID_DOC_TYPE_COLORS,
  ID_DOC_TYPE_LABELS,
  ID_DOC_TYPE_SHORT,
  REGION_OPTIONS,
  countryFlag,
  getCountryIdTypes,
} from "@/lib/constants/countries";
import type { CountrySettings, IdDocType, IdTypeConfig, Region, RequiredSides } from "@/lib/constants/countries";
import { VERIFICATION_TYPE_OPTIONS } from "@/lib/constants/filter-options";
import { TABLE_TH, TABLE_TH_BASE, TABLE_TH_SORTABLE, TABLE_SORT_ICON_SIZE, COUNTRIES_TD } from "@/lib/constants/page-layout";
import { VERIFICATION_TEMPLATE_PRESETS } from "@/lib/constants/template-presets";
import { AVAILABLE_CHECKS } from "@/lib/constants/verification-checks";
import { useUnsavedChanges } from "@/lib/hooks/useUnsavedChanges";
import { useTemplateStore } from "@/lib/stores/template-store";
import { getStatusColor } from "@/lib/utils/format";
import type {
  AttributeMatchRequirement,
  CheckConfigType,
  CheckSubConfig,
  ComparisonAttribute,
  ExtractedProperty,
  MatchLevel,
  NormalizationMethodType,
  TemplateStatus,
  VerificationCheckConfig,
  VerificationTemplate,
  VerificationType,
} from "@/lib/types";

import { Badge } from "@plexui/ui/components/Badge";
import { Button } from "@plexui/ui/components/Button";
import { Checkbox } from "@plexui/ui/components/Checkbox";
import { Field } from "@plexui/ui/components/Field";
import { Input } from "@plexui/ui/components/Input";
import { Menu } from "@plexui/ui/components/Menu";
import { SegmentedControl } from "@plexui/ui/components/SegmentedControl";
import { Select } from "@plexui/ui/components/Select";
import { SelectControl } from "@plexui/ui/components/SelectControl";
import { Tabs } from "@plexui/ui/components/Tabs";
import { Popover } from "@plexui/ui/components/Popover";
import { Tooltip } from "@plexui/ui/components/Tooltip";
import { TagInput, type Tag } from "@plexui/ui/components/TagInput";
import { Switch } from "@plexui/ui/components/Switch";
import { ArrowDownSm, ArrowUpSm, CheckMd, ChevronDownMd, DotsHorizontal, InfoCircle, Plus, Search, Sort, Trash } from "@plexui/ui/components/Icon";

/* ─── Constants ─── */

const CAPTURE_METHOD_OPTIONS = [
  { value: "auto", label: "Auto" },
  { value: "manual", label: "Manual" },
  { value: "both", label: "Both" },
];

const CAPTURE_METHOD_TYPES = new Set<VerificationType>(["government_id", "selfie", "document"]);

const CHECK_CATEGORY_LABELS: Record<string, string> = {
  fraud: "Fraud",
  user_action_required: "User behavior",
};

const CHECK_CATEGORY_COLORS: Record<string, string> = {
  fraud: "danger",
  user_action_required: "caution",
};

const CHECK_REQUIREMENT_OPTIONS = [
  { value: "required", label: "Required" },
  { value: "optional", label: "Optional" },
];
const CHECK_STATUS_OPTIONS = [
  { value: "enabled", label: "Enabled" },
  { value: "disabled", label: "Disabled" },
];
const ATTRIBUTE_OPTIONS: { value: ComparisonAttribute; label: string }[] = [
  { value: "name_first", label: "First name" },
  { value: "name_last", label: "Last name" },
  { value: "name_middle", label: "Middle name" },
  { value: "birthdate", label: "Date of birth" },
  { value: "address_street", label: "Street address" },
  { value: "address_city", label: "City" },
  { value: "address_subdivision", label: "State / Province" },
  { value: "address_postal_code", label: "Postal code" },
  { value: "identification_number", label: "ID number" },
];

const MATCH_LEVEL_OPTIONS: { value: MatchLevel; label: string }[] = [
  { value: "full", label: "Full match" },
  { value: "partial", label: "Partial match" },
  { value: "none", label: "No match required" },
];

const NORMALIZATION_OPTIONS: { value: NormalizationMethodType; label: string }[] = [
  { value: "remove_prefixes", label: "Remove prefixes" },
  { value: "remove_suffixes", label: "Remove suffixes" },
  { value: "remove_special_characters", label: "Remove special characters" },
  { value: "fold_characters", label: "Fold characters" },
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
            <SegmentedControl
              aria-label="Template sections"
              value={activeTab}
              onChange={(v) => setActiveTab(v as TemplateTab)}
              size={TOPBAR_CONTROL_SIZE}
              pill={TOPBAR_TOOLBAR_PILL}
            >
              <SegmentedControl.Tab value="Checks">Checks</SegmentedControl.Tab>
              <SegmentedControl.Tab value="Allowed Countries">Countries</SegmentedControl.Tab>
              <SegmentedControl.Tab value="Settings">Settings</SegmentedControl.Tab>
            </SegmentedControl>
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

      <div className="flex-1 overflow-auto px-4 md:px-6">
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

const EXTRACTED_PROPERTY_OPTIONS: { value: ExtractedProperty; label: string }[] = [
  { value: "name_first", label: "First name" },
  { value: "name_last", label: "Last name" },
  { value: "name_middle", label: "Middle name" },
  { value: "birthdate", label: "Date of birth" },
  { value: "address_street", label: "Street address" },
  { value: "address_city", label: "City" },
  { value: "address_subdivision", label: "State / Province" },
  { value: "address_postal_code", label: "Postal code" },
  { value: "identification_number", label: "ID number" },
  { value: "document_number", label: "Document number" },
  { value: "issuing_country", label: "Issuing country" },
  { value: "expiration_date", label: "Expiration date" },
  { value: "issue_date", label: "Issue date" },
  { value: "nationality", label: "Nationality" },
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
  const [reqFilter, setReqFilter] = useState("");
  const [enabledFilter, setEnabledFilter] = useState("");
  const [openConfigs, setOpenConfigs] = useState<Set<string>>(new Set());
  const [sorting, setSorting] = useState<SortingState>([{ id: "name", desc: false }]);

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
        if (reqFilter) {
          if (reqFilter === "required" && !check.required) return null;
          if (reqFilter === "optional" && check.required) return null;
        }
        if (enabledFilter) {
          if (enabledFilter === "enabled" && !check.enabled) return null;
          if (enabledFilter === "disabled" && check.enabled) return null;
        }
        const availCheck = AVAILABLE_CHECKS[type]?.find((a) => a.name === check.name);
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
  }, [checks, search, reqFilter, enabledFilter, type]);

  const toggleConfig = useCallback((name: string) => {
    setOpenConfigs((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  }, []);

  const columns = useMemo<ColumnDef<CheckRow, unknown>[]>(
    () => [
      {
        id: "name",
        accessorFn: (row) => row.check.name,
        header: "Checks",
        enableSorting: true,
        cell: ({ row, table: t }) => {
          const { check, description, hasConfig } = row.original;
          const oc = (t.options.meta as { openConfigs: Set<string> }).openConfigs;
          const isOpen = hasConfig && oc.has(check.name);
          return (
            <div className="flex items-center gap-1.5">
              {hasConfig ? (
                <ChevronDownMd
                  className={`size-4 shrink-0 text-[var(--color-text-secondary)] transition-transform duration-200${isOpen ? "" : " -rotate-90"}`}
                />
              ) : (
                <span className="w-4 shrink-0" />
              )}
              <span className="text-sm font-medium text-[var(--color-text)]">{check.name}</span>
              {description && (
                <Tooltip content={description} side="top" sideOffset={4}>
                  <InfoCircle className="size-3.5 shrink-0 cursor-help text-[var(--color-text-tertiary)]" />
                </Tooltip>
              )}
              {check.lifecycle === "beta" && (
                <Badge pill color="discovery" variant="soft" size="sm">Beta</Badge>
              )}
              {check.lifecycle === "sunset" && (
                <Badge pill color="warning" variant="soft" size="sm">Sunset</Badge>
              )}
            </div>
          );
        },
      },
      {
        id: "category",
        accessorFn: (row) => row.check.categories[0] ?? "",
        header: "Type",
        size: 200,
        enableSorting: true,
        cell: ({ row }) => (
          <div className="flex flex-wrap gap-1">
            {row.original.check.categories.map((cat) => (
              <Badge pill key={cat} color={(CHECK_CATEGORY_COLORS[cat] ?? "secondary") as "info" | "secondary" | "danger" | "discovery" | "warning"} variant="soft" size="sm">{CHECK_CATEGORY_LABELS[cat] ?? cat}</Badge>
            ))}
            {row.original.requiresBiometric && (
              <Tooltip content="Biometric processing is required to use this feature. We recommend consulting with your legal team and compliance advisors to ensure that your business meets the proper requirements to process this biometric data." side="top" sideOffset={4}>
                <Badge pill color="info" variant="soft" size="sm">
                  <span className="flex items-center gap-1">Biometric <InfoCircle style={{ width: 12, height: 12 }} /></span>
                </Badge>
              </Tooltip>
            )}
          </div>
        ),
      },
      {
        id: "required",
        accessorFn: (row) => row.check.required,
        header: "Requirement",
        size: 120,
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
        id: "enabled",
        accessorFn: (row) => row.check.enabled,
        header: "Status",
        size: 120,
        meta: { align: "right" },
        enableSorting: true,
        sortDescFirst: true,
        cell: ({ row }) => {
          const { check, formIndex } = row.original;
          return (
            <div className="flex justify-end" onClick={(e) => e.stopPropagation()}>
              <Menu>
                <Menu.Trigger>
                  <SelectControl variant="ghost" selected size="xs" block={false} className={check.enabled ? undefined : "text-[var(--color-text-tertiary)]"}>
                    {check.enabled ? "Enabled" : "Disabled"}
                  </SelectControl>
                </Menu.Trigger>
                <Menu.Content minWidth={120}>
                  <Menu.Item onSelect={() => onUpdateCheck(formIndex, { ...check, enabled: true })}>
                    <span className="flex items-center gap-2">
                      {check.enabled ? <CheckMd className="size-3.5" /> : <span className="w-3.5" />}
                      Enabled
                    </span>
                  </Menu.Item>
                  <Menu.Item onSelect={() => onUpdateCheck(formIndex, { ...check, enabled: false })}>
                    <span className="flex items-center gap-2">
                      {!check.enabled ? <CheckMd className="size-3.5" /> : <span className="w-3.5" />}
                      Disabled
                    </span>
                  </Menu.Item>
                </Menu.Content>
              </Menu>
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
    meta: { openConfigs },
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
                <div className="w-48">
                  <Select
                    options={CHECK_REQUIREMENT_OPTIONS}
                    value={reqFilter}
                    onChange={(opt) => setReqFilter(opt?.value ?? "")}
                    clearable
                    placeholder="Requirement"
                    size="sm"
                    pill
                    variant="outline"
                    block
                  />
                </div>
                <div className="w-44">
                  <Select
                    options={CHECK_STATUS_OPTIONS}
                    value={enabledFilter}
                    onChange={(opt) => setEnabledFilter(opt?.value ?? "")}
                    clearable
                    placeholder="Status"
                    size="sm"
                    pill
                    variant="outline"
                    block
                  />
                </div>
                {(reqFilter || enabledFilter) && (
                  <Button color="secondary" variant="soft" size="sm" pill onClick={() => { setReqFilter(""); setEnabledFilter(""); }}>
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
                  className={TABLE_TH}
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
                        <span className="ml-1">
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
            table.getRowModel().rows.map((row) => {
              const { check, formIndex, hasConfig, configType } = row.original;
              const isConfigOpen = openConfigs.has(check.name);
              return (
                <Fragment key={row.id}>
                  <tr className={`border-b border-[var(--color-border)]${hasConfig && isConfigOpen ? " border-b-transparent" : ""}${hasConfig ? " cursor-pointer" : ""}`} onClick={hasConfig ? () => toggleConfig(check.name) : undefined}>
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        style={cell.column.getSize() !== 150 ? { minWidth: cell.column.getSize(), width: cell.column.getSize() } : undefined}
                        className="h-[50px] py-2.5 pr-2 align-middle"
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                  {hasConfig && isConfigOpen && configType && (
                    <tr className="border-b border-[var(--color-border)]">
                      <td colSpan={4} className="py-3 pl-[22px]">
                        <CheckConfigPanel
                          configType={configType}
                          subConfig={check.subConfig}
                          onUpdate={(patch) => {
                            onUpdateCheck(formIndex, {
                              ...check,
                              subConfig: { ...check.subConfig, ...patch },
                            });
                          }}
                        />
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })
          )}
        </tbody>
      </table>
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
        <div className="flex items-center gap-4">
          <Field label="Minimum age" size="sm">
            <div className="w-20">
              <Input
                size="sm"
                type="number"
                placeholder=""
                value={subConfig?.ageRange?.min != null ? String(subConfig.ageRange.min) : ""}
                onChange={(e) => {
                  const val = e.target.value === "" ? undefined : Number(e.target.value);
                  onUpdate({ ageRange: { ...subConfig?.ageRange, min: val } });
                }}
              />
            </div>
          </Field>
          <Field label="Maximum age" size="sm">
            <div className="w-20">
              <Input
                size="sm"
                type="number"
                placeholder=""
                value={subConfig?.ageRange?.max != null ? String(subConfig.ageRange.max) : ""}
                onChange={(e) => {
                  const val = e.target.value === "" ? undefined : Number(e.target.value);
                  onUpdate({ ageRange: { ...subConfig?.ageRange, max: val } });
                }}
              />
            </div>
          </Field>
        </div>
      );

    case "expiration":
      return (
        <Field label="Grace period" description="Number of days past expiration to still accept" size="sm">
          <div className="w-24">
            <Input
              size="sm"
              type="number"
              placeholder="0"
              value={subConfig?.gracePeriodDays != null ? String(subConfig.gracePeriodDays) : ""}
              onChange={(e) => {
                const val = e.target.value === "" ? undefined : Number(e.target.value);
                onUpdate({ gracePeriodDays: val });
              }}
            />
          </div>
        </Field>
      );

    case "barcode":
      return (
        <Field label="Require successful extraction" description="Fail the check if barcode data cannot be extracted" size="sm">
          <Switch
            checked={subConfig?.requireSuccessfulExtraction ?? false}
            onCheckedChange={(v) => onUpdate({ requireSuccessfulExtraction: v })}
          />
        </Field>
      );

    case "country":
      return (
        <Field label="Map to sovereign country" description="Map territories and dependencies to their sovereign country" size="sm">
          <Switch
            checked={subConfig?.mapToSovereignCountry ?? false}
            onCheckedChange={(v) => onUpdate({ mapToSovereignCountry: v })}
          />
        </Field>
      );

    case "repeat":
      return (
        <Field label="Detection scope" description="Scope for detecting repeated submissions" size="sm">
          <div className="w-44">
            <Select
              options={CHECK_SCOPE_OPTIONS}
              value={subConfig?.scope ?? "same_account"}
              onChange={(o) => { if (o) onUpdate({ scope: o.value as "same_account" | "all_accounts" }); }}
              size="sm"
              pill={false}
              block
            />
          </div>
        </Field>
      );

    case "id_type":
      return (
        <p className="text-sm text-[var(--color-text-secondary)]">
          Configure accepted ID types in the Countries tab.
        </p>
      );

    case "comparison":
      return (
        <MatchRequirementsEditor
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

/* ─── Match Requirements Editor ─── */

function MatchRequirementsEditor({
  requirements,
  onChange,
}: {
  requirements: AttributeMatchRequirement[];
  onChange: (reqs: AttributeMatchRequirement[]) => void;
}) {
  const usedAttributes = useMemo(
    () => new Set(requirements.map((r) => r.attribute)),
    [requirements],
  );

  const availableAttributes = useMemo(
    () => ATTRIBUTE_OPTIONS.filter((a) => !usedAttributes.has(a.value)),
    [usedAttributes],
  );

  function addRule() {
    const next = availableAttributes[0];
    if (!next) return;
    onChange([
      ...requirements,
      { attribute: next.value, normalization: [], comparison: { type: "simple", matchLevel: "partial" } },
    ]);
  }

  function removeRule(index: number) {
    onChange(requirements.filter((_, i) => i !== index));
  }

  function updateRule(index: number, patch: Partial<AttributeMatchRequirement>) {
    onChange(requirements.map((r, i) => (i === index ? { ...r, ...patch } : r)));
  }

  function updateNormalization(index: number, methods: NormalizationMethodType[]) {
    const steps = methods.map((method, i) => ({
      step: (i === 0 ? "apply" : "then") as "apply" | "then",
      method,
    }));
    updateRule(index, { normalization: steps });
  }

  function updateMatchLevel(index: number, matchLevel: MatchLevel) {
    updateRule(index, { comparison: { type: "simple", matchLevel } });
  }

  return (
    <div className="flex flex-col gap-3">
      {requirements.length === 0 ? (
        <>
          <p className="text-sm text-[var(--color-text-secondary)]">
            No rules configured — default matching will be used.
          </p>
          {availableAttributes.length > 0 && (
            <div>
              <Button color="secondary" variant="soft" size="xs" pill={false} onClick={addRule}>
                <Plus /> Add rule
              </Button>
            </div>
          )}
        </>
      ) : (
        <>
          {requirements.map((rule, index) => {
            const connector = index === 0 ? "If" : "And";

            return (
              <div key={rule.attribute} className="flex flex-col gap-3 rounded-lg border border-[var(--color-border)] p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-[var(--color-text)]">{connector}</span>
                  <Button
                    color="secondary"
                    variant="ghost"
                    size="3xs"
                    pill={false}
                    onClick={() => removeRule(index)}
                  >
                    <Trash />
                  </Button>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <Field label="Attribute" size="sm">
                      <Select
                        options={[
                          ...ATTRIBUTE_OPTIONS.filter((a) => a.value === rule.attribute),
                          ...availableAttributes,
                        ]}
                        value={rule.attribute}
                        onChange={(o) => { if (o) updateRule(index, { attribute: o.value as ComparisonAttribute }); }}
                        size="sm"
                        pill={false}
                        block
                        listMinWidth={180}
                      />
                    </Field>
                  </div>
                  <div className="flex-1">
                    <Field label="Match level" size="sm">
                      <Select
                        options={MATCH_LEVEL_OPTIONS}
                        value={rule.comparison.type === "simple" ? rule.comparison.matchLevel : "partial"}
                        onChange={(o) => { if (o) updateMatchLevel(index, o.value as MatchLevel); }}
                        size="sm"
                        pill={false}
                        block
                        listMinWidth={160}
                      />
                    </Field>
                  </div>
                  <div className="flex-1">
                    <Field label="Normalization" size="sm">
                      <Select
                        options={NORMALIZATION_OPTIONS}
                        value={(rule.normalization ?? []).map((n) => n.method)}
                        onChange={(opts) => updateNormalization(index, opts.map((o) => o.value as NormalizationMethodType))}
                        multiple
                        clearable
                        placeholder="None"
                        size="sm"
                        pill={false}
                        block
                        listMinWidth={260}
                      />
                    </Field>
                  </div>
                </div>
              </div>
            );
          })}
          {availableAttributes.length > 0 && (
            <div>
              <Button color="secondary" variant="soft" size="xs" pill={false} onClick={addRule}>
                <Plus /> Add rule
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

/* ─── Extracted Properties Panel ─── */

const ATTRIBUTE_LABEL_TO_VALUE = new Map(
  EXTRACTED_PROPERTY_OPTIONS.map((o) => [o.label.toLowerCase(), o.value]),
);

function ExtractedPropertiesPanel({
  requiredAttributes,
  passWhenMissing,
  onUpdate,
}: {
  requiredAttributes: ExtractedProperty[];
  passWhenMissing: boolean;
  onUpdate: (patch: Partial<CheckSubConfig>) => void;
}) {
  const tags = useMemo<Tag[]>(
    () =>
      requiredAttributes.map((attr) => ({
        value: EXTRACTED_PROPERTY_OPTIONS.find((o) => o.value === attr)?.label ?? attr,
        valid: true,
      })),
    [requiredAttributes],
  );

  const handleTagsChange = useCallback(
    (newTags: Tag[]) => {
      const attrs = newTags
        .map((t) => ATTRIBUTE_LABEL_TO_VALUE.get(t.value.toLowerCase()))
        .filter((v): v is ExtractedProperty => v !== undefined);
      onUpdate({ requiredAttributes: attrs.length > 0 ? attrs : undefined });
    },
    [onUpdate],
  );

  const validateTag = useCallback(
    (value: string) => ATTRIBUTE_LABEL_TO_VALUE.has(value.toLowerCase()),
    [],
  );

  return (
    <div className="flex flex-col gap-4">
      <Field label="Default required attributes" description="These default required attributes will be used for every country and ID type. You can override this default on a per-country and per-ID basis in Countries and ID Types." size="sm">
        <TagInput
          value={tags}
          onChange={handleTagsChange}
          placeholder="Type attribute name…"
          validator={validateTag}
        />
      </Field>

      <Field label="Pass when required property does not appear on the ID" size="sm">
        <Switch
          checked={passWhenMissing}
          onCheckedChange={(v) => onUpdate({ passWhenPropertyMissing: v })}
        />
      </Field>
    </div>
  );
}

/* ─── Countries Tab ─── */

const STATUS_FILTER_OPTIONS = [
  { value: "enabled", label: "Enabled" },
  { value: "disabled", label: "Disabled" },
];

function CountriesTab({
  selected,
  countrySettings,
  onToggle,
  onToggleBatch,
  onUpdateCountrySettings,
}: {
  selected: string[];
  countrySettings: Record<string, CountrySettings>;
  onToggle: (code: string) => void;
  onToggleBatch: (codes: string[], enabled: boolean) => void;
  onUpdateCountrySettings: (code: string, cs: CountrySettings) => void;
}) {
  const [search, setSearch] = useState("");
  const [statusFilters, setStatusFilters] = useState<string[]>([]);
  const [regionFilters, setRegionFilters] = useState<string[]>([]);
  const [idTypeFilters, setIdTypeFilters] = useState<string[]>([]);
  const [bulkConfigOpen, setBulkConfigOpen] = useState(false);

  // Suppress checkbox entry animation on mount
  const [suppressAnim, setSuppressAnim] = useState(true);
  useEffect(() => {
    const id = requestAnimationFrame(() => setSuppressAnim(false));
    return () => cancelAnimationFrame(id);
  }, []);

  const selectedSet = useMemo(() => new Set(selected), [selected]);

  const filtered = useMemo(() => {
    let countries = COUNTRY_OPTIONS;

    if (search.trim()) {
      const q = search.toLowerCase();
      countries = countries.filter(
        (c) => c.label.toLowerCase().includes(q) || c.value.toLowerCase().includes(q),
      );
    }

    if (statusFilters.length > 0) {
      countries = countries.filter((c) => {
        const isEnabled = selectedSet.has(c.value);
        return statusFilters.includes("enabled") ? isEnabled : !isEnabled;
      });
    }

    if (regionFilters.length > 0) {
      countries = countries.filter((c) => regionFilters.includes(COUNTRY_REGIONS[c.value]));
    }

    if (idTypeFilters.length > 0) {
      countries = countries.filter((c) => {
        const types = getCountryIdTypes(c.value);
        return idTypeFilters.some((t) => types.includes(t as IdDocType));
      });
    }

    return countries;
  }, [search, statusFilters, regionFilters, idTypeFilters, selectedSet]);

  const allFilteredSelected = filtered.length > 0 && filtered.every((c) => selectedSet.has(c.value));
  const someFilteredSelected = filtered.some((c) => selectedSet.has(c.value));

  function handleSelectAll() {
    const codes = filtered.map((c) => c.value);
    onToggleBatch(codes, !allFilteredSelected);
  }

  const hasActiveFilters = statusFilters.length > 0 || regionFilters.length > 0 || idTypeFilters.length > 0 || search.trim() !== "";

  return (
    <div data-suppress-anim={suppressAnim || undefined}>
      <table className="-mb-px w-full" data-datatable>
        <thead className="sticky top-0 z-10 bg-[var(--color-surface)]">
          <tr>
            <th colSpan={6} className="pt-6 pb-3 text-left font-normal">
              <div className="flex flex-wrap items-center gap-2">
                <div className="w-56">
                  <Input
                    size="sm"
                    pill
                    placeholder="Search countries..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onClear={search ? () => setSearch("") : undefined}
                    startAdornment={<Search style={{ width: 16, height: 16 }} />}
                  />
                </div>
                <div className="w-36">
                  <Select
                    options={STATUS_FILTER_OPTIONS}
                    value={statusFilters}
                    onChange={(opts) => setStatusFilters(opts.map((o) => o.value))}
                    multiple
                    clearable
                    placeholder="All countries"
                    size="sm"
                    pill
                    variant="outline"
                    block
                    listMinWidth={160}
                  />
                </div>
                <div className="w-40">
                  <Select
                    options={REGION_OPTIONS}
                    value={regionFilters}
                    onChange={(opts) => setRegionFilters(opts.map((o) => o.value))}
                    multiple
                    clearable
                    placeholder="All regions"
                    size="sm"
                    pill
                    variant="outline"
                    block
                    listMinWidth={180}
                  />
                </div>
                <div className="w-40">
                  <Select
                    options={ALL_ID_DOC_TYPES.map((t) => ({ value: t, label: ID_DOC_TYPE_LABELS[t] }))}
                    value={idTypeFilters}
                    onChange={(opts) => setIdTypeFilters(opts.map((o) => o.value))}
                    multiple
                    clearable
                    placeholder="All ID types"
                    size="sm"
                    pill
                    variant="outline"
                    block
                    listMinWidth={260}
                  />
                </div>
                {hasActiveFilters && (
                  <Button
                    color="secondary"
                    variant="soft"
                    size="sm"
                    pill
                    onClick={() => {
                      setSearch("");
                      setStatusFilters([]);
                      setRegionFilters([]);
                      setIdTypeFilters([]);
                    }}
                  >
                    Clear filters
                  </Button>
                )}
                {selected.length >= 2 && (
                  <Button
                    color="secondary"
                    variant="outline"
                    size="sm"
                    pill
                    onClick={() => setBulkConfigOpen(true)}
                  >
                    Bulk configure ({selected.length})
                  </Button>
                )}
                <p className="ml-auto text-sm text-[var(--color-text-tertiary)]">
                  {selected.length} of {COUNTRY_OPTIONS.length} enabled
                </p>
              </div>
            </th>
          </tr>
          <tr style={{ boxShadow: "inset 0 -1px 0 var(--color-border)" }}>
            <th className={`w-10 ${TABLE_TH}`}>
              <Checkbox
                checked={allFilteredSelected ? true : someFilteredSelected ? "indeterminate" : false}
                onCheckedChange={handleSelectAll}
              />
            </th>
            <th className={`w-52 ${TABLE_TH}`}>
              Country
            </th>
            <th className={TABLE_TH}>
              Accepted ID Types
            </th>
            <th className={`w-24 ${TABLE_TH}`}>
              Min Age
            </th>
            <th className={`w-24 ${TABLE_TH}`}>
              Max Age
            </th>
            <th className={`w-36 text-right ${TABLE_TH_BASE}`}>
              Region
            </th>
          </tr>
        </thead>
        <tbody>
              {filtered.map((country) => {
                const isEnabled = selectedSet.has(country.value);
                const availableTypes = getCountryIdTypes(country.value);
                const cs = countrySettings[country.value];
                const activeTypes = cs?.allowedIdTypes ?? availableTypes;

                return (
                  <CountryRow
                    key={country.value}
                    code={country.value}
                    name={country.label}
                    enabled={isEnabled}
                    availableTypes={availableTypes}
                    activeTypes={activeTypes}
                    cs={cs}
                    region={COUNTRY_REGIONS[country.value]}
                    onToggle={() => onToggle(country.value)}
                    onUpdateSettings={(next) => onUpdateCountrySettings(country.value, next)}
                  />
                );
              })}
              {filtered.length === 0 && (
                <tr className="border-b border-[var(--color-border)]">
                  <td colSpan={6} className="py-8 text-center text-sm text-[var(--color-text-tertiary)]">
                    No countries match your filters.
                  </td>
                </tr>
              )}
        </tbody>
      </table>

      <BulkConfigModal
        open={bulkConfigOpen}
        onOpenChange={setBulkConfigOpen}
        selectedCodes={selected}
        countrySettings={countrySettings}
        onApply={(patch) => {
          for (const code of selected) {
            const existing = countrySettings[code] ?? {};
            const merged: CountrySettings = { ...existing };
            if (patch.allowedIdTypes !== undefined) {
              merged.allowedIdTypes = patch.allowedIdTypes;
            }
            if (patch.ageRange !== undefined) {
              if (patch.ageRange.min === undefined && patch.ageRange.max === undefined) {
                delete merged.ageRange;
              } else {
                merged.ageRange = patch.ageRange;
              }
            }
            if (patch.idTypeConfig !== undefined) {
              merged.idTypeConfig = { ...existing.idTypeConfig, ...patch.idTypeConfig };
            }
            onUpdateCountrySettings(code, merged);
          }
        }}
      />
    </div>
  );
}

/* ─── Bulk Config Modal ─── */

const REQUIRED_SIDES_OPTIONS = [
  { value: "front_only", label: "Front only" },
  { value: "front_and_back", label: "Front and back" },
];

interface BulkConfigPatch {
  allowedIdTypes?: IdDocType[];
  ageRange?: { min?: number; max?: number };
  idTypeConfig?: Partial<Record<IdDocType, IdTypeConfig>>;
}

function BulkConfigModal({
  open,
  onOpenChange,
  selectedCodes,
  countrySettings,
  onApply,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  selectedCodes: string[];
  countrySettings: Record<string, CountrySettings>;
  onApply: (patch: BulkConfigPatch) => void;
}) {
  const [activeTab, setActiveTab] = useState("id_types");
  const [idTypes, setIdTypes] = useState<Set<IdDocType>>(new Set(["pp", "dl", "id"]));
  const [ageMin, setAgeMin] = useState("");
  const [ageMax, setAgeMax] = useState("");
  const [requiredSides, setRequiredSides] = useState<Partial<Record<IdDocType, RequiredSides>>>({});
  const [requireExpiry, setRequireExpiry] = useState<Set<IdDocType>>(new Set());

  const [prevOpen, setPrevOpen] = useState(open);
  if (open && !prevOpen) {
    const allTypes = new Set<IdDocType>();
    for (const code of selectedCodes) {
      const cs = countrySettings[code];
      const types = cs?.allowedIdTypes ?? getCountryIdTypes(code);
      for (const t of types) allTypes.add(t);
    }
    setIdTypes(allTypes.size > 0 ? allTypes : new Set(["pp", "dl", "id"]));
    setAgeMin("");
    setAgeMax("");
    setRequiredSides({});
    setRequireExpiry(new Set());
    setActiveTab("id_types");
  }
  if (open !== prevOpen) setPrevOpen(open);

  function toggleIdType(type: IdDocType) {
    setIdTypes((prev) => {
      const next = new Set(prev);
      if (next.has(type)) next.delete(type);
      else next.add(type);
      return next;
    });
  }

  function handleApply() {
    const patch: BulkConfigPatch = {};

    if (activeTab === "id_types" || true) {
      patch.allowedIdTypes = Array.from(idTypes);
    }

    if (ageMin || ageMax) {
      patch.ageRange = {
        min: ageMin ? Number(ageMin) : undefined,
        max: ageMax ? Number(ageMax) : undefined,
      };
    }

    if (Object.keys(requiredSides).length > 0 || requireExpiry.size > 0) {
      const config: Partial<Record<IdDocType, IdTypeConfig>> = {};
      for (const type of idTypes) {
        const entry: IdTypeConfig = {};
        if (requiredSides[type]) entry.requiredSides = requiredSides[type];
        if (requireExpiry.has(type)) entry.requireExpiry = true;
        if (Object.keys(entry).length > 0) config[type] = entry;
      }
      if (Object.keys(config).length > 0) patch.idTypeConfig = config;
    }

    onApply(patch);
    onOpenChange(false);
  }

  const allDocTypes = useMemo(() => {
    const types = new Set<IdDocType>();
    for (const code of selectedCodes) {
      for (const t of getCountryIdTypes(code)) types.add(t);
    }
    return types.size > 0
      ? ALL_ID_DOC_TYPES.filter((t) => types.has(t))
      : [...ALL_ID_DOC_TYPES];
  }, [selectedCodes]);

  return (
    <Modal open={open} onOpenChange={onOpenChange} maxWidth="max-w-lg">
      <ModalHeader>
        <h2 className="heading-md">Bulk configure</h2>
        <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
          Apply settings to {selectedCodes.length} selected countries.
        </p>
      </ModalHeader>

      <ModalBody>
        <Tabs
          aria-label="Bulk configuration sections"
          value={activeTab}
          onChange={setActiveTab}
          variant="underline"
          size="sm"
        >
          <Tabs.Tab value="id_types">ID Types</Tabs.Tab>
          <Tabs.Tab value="requirements">Requirements</Tabs.Tab>
          <Tabs.Tab value="age_range">Age Range</Tabs.Tab>
        </Tabs>

        {activeTab === "id_types" && (
          <div className="flex flex-col gap-2">
            <p className="text-sm text-[var(--color-text-secondary)]">
              Select which document types to accept across all selected countries.
            </p>
            <div className="flex flex-col gap-1.5">
              {allDocTypes.map((type) => (
                <Checkbox
                  key={type}
                  label={ID_DOC_TYPE_LABELS[type]}
                  checked={idTypes.has(type)}
                  onCheckedChange={() => toggleIdType(type)}
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === "requirements" && (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-[var(--color-text-secondary)]">
              Configure requirements for each document type.
            </p>
            {allDocTypes
              .filter((t) => idTypes.has(t))
              .map((type) => (
                <div key={type} className="rounded-lg border border-[var(--color-border)] p-3">
                  <p className="mb-2 text-sm font-medium text-[var(--color-text)]">
                    {ID_DOC_TYPE_LABELS[type]}
                  </p>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[var(--color-text-secondary)]">Required sides</span>
                      <div className="w-44">
                        <Select
                          options={REQUIRED_SIDES_OPTIONS}
                          value={requiredSides[type] ?? "front_only"}
                          onChange={(o) => {
                            if (o) setRequiredSides((prev) => ({ ...prev, [type]: o.value as RequiredSides }));
                          }}
                          size="sm"
                          pill={false}
                          block
                        />
                      </div>
                    </div>
                    <Checkbox
                      label="Require expiration date"
                      checked={requireExpiry.has(type)}
                      onCheckedChange={() => {
                        setRequireExpiry((prev) => {
                          const next = new Set(prev);
                          if (next.has(type)) next.delete(type);
                          else next.add(type);
                          return next;
                        });
                      }}
                    />
                  </div>
                </div>
              ))}
            {allDocTypes.filter((t) => idTypes.has(t)).length === 0 && (
              <p className="py-4 text-center text-sm text-[var(--color-text-tertiary)]">
                Enable at least one ID type to configure requirements.
              </p>
            )}
          </div>
        )}

        {activeTab === "age_range" && (
          <div className="flex flex-col gap-3">
            <p className="text-sm text-[var(--color-text-secondary)]">
              Set an age range restriction for all selected countries.
            </p>
            <div className="flex items-center gap-3">
              <div className="w-24">
                <Input
                  size="sm"
                  type="number"
                  placeholder="Min age"
                  value={ageMin}
                  onChange={(e) => setAgeMin(e.target.value)}
                />
              </div>
              <span className="text-sm text-[var(--color-text-tertiary)]">to</span>
              <div className="w-24">
                <Input
                  size="sm"
                  type="number"
                  placeholder="Max age"
                  value={ageMax}
                  onChange={(e) => setAgeMax(e.target.value)}
                />
              </div>
            </div>
          </div>
        )}
      </ModalBody>

      <ModalFooter>
        <Button color="secondary" variant="outline" size="sm" pill={false} onClick={() => onOpenChange(false)}>
          Cancel
        </Button>
        <Button color="primary" size="sm" pill={false} onClick={handleApply}>
          Apply to {selectedCodes.length} countries
        </Button>
      </ModalFooter>
    </Modal>
  );
}

/* ─── Country Row ─── */

/* ─── ID Type Badges with Popover ─── */

function IdTypeBadges({
  availableTypes,
  activeTypes,
  onChange,
}: {
  availableTypes: IdDocType[];
  activeTypes: IdDocType[];
  onChange: (types: IdDocType[]) => void;
}) {
  const allSelected = activeTypes.length === 0 || activeTypes.length === availableTypes.length;
  const displayTypes = allSelected ? availableTypes : activeTypes;

  function toggleType(t: IdDocType) {
    const current = allSelected ? [...availableTypes] : [...activeTypes];
    const idx = current.indexOf(t);
    if (idx >= 0) {
      current.splice(idx, 1);
    } else {
      current.push(t);
    }
    // If all selected again, clear to mean "all"
    if (current.length === availableTypes.length) {
      onChange([]);
    } else {
      onChange(current);
    }
  }

  function selectAll() {
    onChange([]);
  }

  function clearAll() {
    onChange([availableTypes[0]]);
  }

  return (
    <Popover>
      <Popover.Trigger>
        <button type="button" className="flex max-w-72 cursor-pointer flex-wrap gap-1">
          {displayTypes.map((t) => (
            <Badge pill key={t}
            color={ID_DOC_TYPE_COLORS[t] as "info" | "discovery" | "warning" | "success" | "caution" | "secondary" | "danger"}
            variant="soft"
            size="sm">{ID_DOC_TYPE_SHORT[t]}</Badge>
          ))}
        </button>
      </Popover.Trigger>
      <Popover.Content side="bottom" align="start" sideOffset={4} className="w-64">
        <div className="flex flex-col gap-2 p-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-[var(--color-text-tertiary)]">Accepted ID types</p>
            <div className="flex gap-2">
              <button type="button" className="text-xs text-[var(--color-primary-solid-bg)] hover:underline" onClick={selectAll}>
                All
              </button>
              <button type="button" className="text-xs text-[var(--color-text-tertiary)] hover:underline" onClick={clearAll}>
                Clear
              </button>
            </div>
          </div>
          <div className="flex max-h-64 flex-col gap-0.5 overflow-auto">
            {availableTypes.map((t) => {
              const isActive = allSelected || activeTypes.includes(t);
              return (
                <Checkbox
                  key={t}
                  label={ID_DOC_TYPE_LABELS[t]}
                  checked={isActive}
                  onCheckedChange={() => toggleType(t)}
                />
              );
            })}
          </div>
        </div>
      </Popover.Content>
    </Popover>
  );
}

function CountryRow({
  code,
  name,
  enabled,
  availableTypes,
  activeTypes,
  cs,
  region,
  onToggle,
  onUpdateSettings,
}: {
  code: string;
  name: string;
  enabled: boolean;
  availableTypes: IdDocType[];
  activeTypes: IdDocType[];
  cs: CountrySettings | undefined;
  region: Region | undefined;
  onToggle: () => void;
  onUpdateSettings: (next: CountrySettings) => void;
}) {
  function setAgeMin(val: string) {
    const num = val === "" ? undefined : Number(val);
    const range = { ...cs?.ageRange, min: num };
    if (range.min === undefined && range.max === undefined) {
      onUpdateSettings({ ...cs, ageRange: undefined });
    } else {
      onUpdateSettings({ ...cs, ageRange: range });
    }
  }

  function setAgeMax(val: string) {
    const num = val === "" ? undefined : Number(val);
    const range = { ...cs?.ageRange, max: num };
    if (range.min === undefined && range.max === undefined) {
      onUpdateSettings({ ...cs, ageRange: undefined });
    } else {
      onUpdateSettings({ ...cs, ageRange: range });
    }
  }

  return (
    <tr
      className={`border-b border-[var(--color-border)] transition-colors ${enabled ? "bg-[var(--color-success-surface-bg)]" : ""}`}
    >
      <td className={`w-10 ${COUNTRIES_TD}`}>
        <Checkbox checked={enabled} onCheckedChange={onToggle} />
      </td>
      <td className={`w-52 ${COUNTRIES_TD}`}>
        <span className="flex items-center gap-2">
          <span className="text-base leading-none">{countryFlag(code)}</span>
          <span className="truncate text-md text-[var(--color-text)]">{name}</span>
          <span className="shrink-0 text-xs text-[var(--color-text-tertiary)]">{code}</span>
        </span>
      </td>
      <td className={COUNTRIES_TD}>
        <IdTypeBadges
          availableTypes={availableTypes}
          activeTypes={activeTypes}
          onChange={(types) => onUpdateSettings({ ...cs, allowedIdTypes: types })}
        />
      </td>
      <td className={`w-24 ${COUNTRIES_TD}`}>
        <Input
          size="sm"
          type="number"
          placeholder=""
          value={cs?.ageRange?.min != null ? String(cs.ageRange.min) : ""}
          onChange={(e) => setAgeMin(e.target.value)}
        />
      </td>
      <td className={`w-24 ${COUNTRIES_TD}`}>
        <Input
          size="sm"
          type="number"
          placeholder=""
          value={cs?.ageRange?.max != null ? String(cs.ageRange.max) : ""}
          onChange={(e) => setAgeMax(e.target.value)}
        />
      </td>
      <td className={`w-36 text-right ${COUNTRIES_TD}`}>
        <span className="text-sm text-[var(--color-text-secondary)]">{region ?? "—"}</span>
      </td>
    </tr>
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
