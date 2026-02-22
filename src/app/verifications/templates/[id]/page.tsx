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
import { NotFoundPage, SectionHeading, ConfirmLeaveModal, CopyButton, Modal } from "@/components/shared";
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
  CheckCategory,
  CheckConfigType,
  CheckSubConfig,
  ComparisonAttribute,
  ComparisonMethod,
  ExtractedProperty,
  MatchCondition,
  MatchLevel,
  NormalizationMethodType,
  NormalizationStep,
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
import { Switch } from "@plexui/ui/components/Switch";
import { ArrowDownSm, ArrowUpSm, CheckMd, DotsHorizontal, InfoCircle, Plus, Search, SettingsCog, Sort, Trash } from "@plexui/ui/components/Icon";

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

const CHECK_STATUS_FILTER_OPTIONS = [
  { value: "enabled", label: "Enabled" },
  { value: "disabled", label: "Disabled" },
  { value: "required", label: "Required" },
  { value: "non_required", label: "Non-required" },
  { value: "configurable", label: "Configurable" },
  { value: "non_configurable", label: "Non-configurable" },
];
const CHECK_TYPE_FILTER_OPTIONS = [
  { value: "fraud", label: "Fraud" },
  { value: "user_action_required", label: "User behavior" },
  { value: "biometric", label: "Biometric" },
];
const ATTRIBUTE_OPTIONS: { value: ComparisonAttribute; label: string }[] = [
  { value: "name_first", label: "First Name" },
  { value: "name_last", label: "Last Name" },
  { value: "name_middle", label: "Middle Name" },
  { value: "name_full", label: "Full Name" },
  { value: "birthdate", label: "Birthdate" },
  { value: "address_street", label: "Street" },
  { value: "address_city", label: "City" },
  { value: "address_subdivision", label: "Subdivision" },
  { value: "address_postal_code", label: "Postal Code" },
  { value: "identification_number", label: "Identification Number" },
  { value: "social_security_number", label: "Social Security Number" },
];

const MATCH_LEVEL_OPTIONS: { value: MatchLevel; label: string }[] = [
  { value: "full", label: "Exact" },
  { value: "partial", label: "Partial" },
  { value: "none", label: "None" },
];

const NORMALIZATION_OPTIONS: { value: NormalizationMethodType; label: string }[] = [
  { value: "fold_characters", label: "fold_characters" },
  { value: "remove_special_characters", label: "remove_special_characters" },
  { value: "remove_prefixes", label: "remove_prefixes" },
  { value: "remove_suffixes", label: "remove_suffixes" },
  { value: "abbreviate_street_suffix", label: "abbreviate_street_suffix" },
  { value: "abbreviate_street_unit", label: "abbreviate_street_unit" },
  { value: "abbreviate_subdivision", label: "abbreviate_subdivision" },
  { value: "canonicalize_email_address", label: "canonicalize_email_address" },
  { value: "expand_city_abbreviation", label: "expand_city_abbreviation" },
  { value: "expand_city_suffix", label: "expand_city_suffix" },
  { value: "expand_street_suffix", label: "expand_street_suffix" },
  { value: "expand_street_unit", label: "expand_street_unit" },
  { value: "expand_subdivision", label: "expand_subdivision" },
];

const COMPARISON_METHOD_OPTIONS: { value: ComparisonMethod; label: string }[] = [
  { value: "string_similarity", label: "string_similarity" },
  { value: "string_difference", label: "string_difference" },
  { value: "string_missing", label: "string_missing" },
  { value: "nickname", label: "nickname" },
  { value: "substring", label: "substring" },
  { value: "tokenization", label: "tokenization" },
  { value: "date_similarity", label: "date_similarity" },
  { value: "date_difference_day", label: "date_difference_day" },
  { value: "date_difference_month", label: "date_difference_month" },
  { value: "date_difference_year", label: "date_difference_year" },
  { value: "person_full_name", label: "person_full_name" },
  { value: "doing_business_as", label: "doing_business_as" },
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
            <div className="flex items-center gap-2.5">
              <div onClick={(e) => e.stopPropagation()}>
                <Switch
                  checked={check.enabled}
                  onCheckedChange={(v) => onUpdateCheck(formIndex, { ...check, enabled: v })}
                />
              </div>
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
        meta: { align: "right" },
        enableSorting: true,
        cell: ({ row }) => (
          <div className="flex flex-wrap justify-end gap-1">
            {row.original.requiresBiometric && (
              <Tooltip content="Biometric processing is required to use this feature. We recommend consulting with your legal team and compliance advisors to ensure that your business meets the proper requirements to process this biometric data." side="top" sideOffset={4}>
                <Badge pill color="info" variant="soft" size="sm">
                  <span className="flex items-center gap-1">Biometric <InfoCircle style={{ width: 12, height: 12 }} /></span>
                </Badge>
              </Tooltip>
            )}
            {row.original.check.categories.map((cat) => (
              <Badge pill key={cat} color={(CHECK_CATEGORY_COLORS[cat] ?? "secondary") as "info" | "secondary" | "danger" | "discovery" | "warning"} variant="soft" size="sm">{CHECK_CATEGORY_LABELS[cat] ?? cat}</Badge>
            ))}
          </div>
        ),
      },
      {
        id: "required",
        accessorFn: (row) => row.check.required,
        header: () => (
          <Tooltip content="If a required check fails, the associated Verification Check will fail." side="top" sideOffset={4}>
            <span className="cursor-help border-b border-dashed border-[var(--color-text-tertiary)]">Required</span>
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
                    options={CHECK_TYPE_FILTER_OPTIONS}
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
                    style={cell.column.getSize() !== 150 ? { minWidth: cell.column.getSize(), width: cell.column.getSize() } : undefined}
                    className={`h-[50px] py-2.5 pr-2 align-middle${(cell.column.columnDef.meta as { tdClassName?: string })?.tdClassName ? ` ${(cell.column.columnDef.meta as { tdClassName?: string }).tdClassName}` : ""}`}
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
      <Modal open={!!settingsRow} maxWidth="max-w-lg" onOpenChange={(open) => { if (!open) setSettingsCheckName(null); }}>
        {settingsRow && (
          <div className="p-6">
            <h2 className="heading-lg">{settingsRow.check.name}</h2>
            <div className="mt-4">
              <CheckConfigPanel
                configType={settingsRow.configType!}
                subConfig={draftSubConfig}
                onUpdate={(patch) => setDraftSubConfig((prev) => ({ ...prev, ...patch }))}
              />
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <Button color="secondary" variant="soft" pill onClick={() => setSettingsCheckName(null)}>
                Cancel
              </Button>
              <Button color="primary" pill onClick={() => {
                onUpdateCheck(settingsRow.formIndex, {
                  ...settingsRow.check,
                  subConfig: draftSubConfig,
                });
                setSettingsCheckName(null);
              }}>
                Save
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Match Requirements — direct modal for comparison checks */}
      {(() => {
        const mqRow = matchReqCheckName ? data.find((r) => r.check.name === matchReqCheckName) : null;
        if (!mqRow) return null;
        return (
          <MatchRequirementsEditor
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

/* ─── Config Label ─── */

function ConfigLabel({ children, description }: { children: React.ReactNode; description?: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-sm font-medium text-[var(--color-text)]">{children}</span>
      {description && (
        <Tooltip content={description} side="top" sideOffset={4}>
          <InfoCircle className="size-3.5 shrink-0 cursor-help text-[var(--color-text-tertiary)]" />
        </Tooltip>
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
        <div className="flex items-center gap-4">
          <div className="flex flex-col gap-1.5">
            <ConfigLabel>Minimum age</ConfigLabel>
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
          </div>
          <div className="flex flex-col gap-1.5">
            <ConfigLabel>Maximum age</ConfigLabel>
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
          </div>
        </div>
      );

    case "expiration":
      return (
        <div className="flex flex-col gap-1.5">
          <ConfigLabel description="Number of days past expiration to still accept">Grace period</ConfigLabel>
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
        </div>
      );

    case "barcode":
      return (
        <div className="flex items-center gap-2">
          <Switch
            checked={subConfig?.requireSuccessfulExtraction ?? false}
            onCheckedChange={(v) => onUpdate({ requireSuccessfulExtraction: v })}
          />
          <ConfigLabel description="Fail the check if barcode data cannot be extracted">Require successful extraction</ConfigLabel>
        </div>
      );

    case "country":
      return (
        <div className="flex items-center gap-2">
          <Switch
            checked={subConfig?.mapToSovereignCountry ?? false}
            onCheckedChange={(v) => onUpdate({ mapToSovereignCountry: v })}
          />
          <ConfigLabel description="Map territories and dependencies to their sovereign country">Map to sovereign country</ConfigLabel>
        </div>
      );

    case "repeat":
      return (
        <div className="flex flex-col gap-1.5">
          <ConfigLabel description="Scope for detecting repeated submissions">Detection scope</ConfigLabel>
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
        </div>
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

function getMatchSummaryText(req: AttributeMatchRequirement): string {
  const { comparison } = req;
  if (comparison.type === "simple") {
    const levelMap: Record<MatchLevel, string> = { full: "Exact", partial: "Partial", none: "None" };
    return levelMap[comparison.matchLevel] ?? comparison.matchLevel;
  }
  const { conditions } = comparison;
  if (conditions.length === 0) return "No conditions";
  if (conditions.length === 1) {
    const c = conditions[0];
    if (c.method === "date_similarity" && c.threshold != null) return `matching ${c.threshold} date components`;
    if (c.method === "string_similarity" && c.threshold != null) return `${c.threshold}% similar`;
    if (c.threshold != null) return `${c.method} \u2265 ${c.threshold}`;
    return c.method;
  }
  const parts = conditions.map((c) => {
    if (c.method === "string_similarity" && c.threshold != null) return `${c.threshold}% similar`;
    if (c.method === "nickname" && c.threshold != null) return "nickname match";
    if (c.method === "date_similarity" && c.threshold != null) return `matching ${c.threshold} date components`;
    if (c.threshold != null) return `${c.method} \u2265 ${c.threshold}`;
    return c.method;
  });
  return parts.join(" or ");
}

function MatchRequirementsEditor({
  requirements,
  onChange,
  defaultOpen = false,
  onClose,
}: {
  requirements: AttributeMatchRequirement[];
  onChange: (reqs: AttributeMatchRequirement[]) => void;
  defaultOpen?: boolean;
  onClose?: () => void;
}) {
  const [modalOpen, setModalOpen] = useState(defaultOpen);
  const [draft, setDraft] = useState<AttributeMatchRequirement[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  /* Sync draft when modal opens (prevOpen pattern — same as BulkConfigModal) */
  const [prevOpen, setPrevOpen] = useState(false);
  if (modalOpen && !prevOpen) {
    setDraft(structuredClone(requirements));
    setSelectedIndex(requirements.length > 0 ? 0 : null);
  }
  if (modalOpen !== prevOpen) setPrevOpen(modalOpen);

  const selectedReq = selectedIndex != null && selectedIndex < draft.length ? draft[selectedIndex] : null;

  const usedAttributes = useMemo(
    () => new Set(draft.map((r) => r.attribute)),
    [draft],
  );

  const availableAttributes = useMemo(
    () => ATTRIBUTE_OPTIONS.filter((a) => !usedAttributes.has(a.value)),
    [usedAttributes],
  );

  /* ── Draft CRUD ── */

  function addRule() {
    const next = availableAttributes[0];
    if (!next) return;
    const newDraft: AttributeMatchRequirement[] = [
      ...draft,
      { attribute: next.value, normalization: [], comparison: { type: "simple", matchLevel: "partial" } },
    ];
    setDraft(newDraft);
    setSelectedIndex(newDraft.length - 1);
  }

  function removeRule(index: number) {
    const newDraft = draft.filter((_, i) => i !== index);
    setDraft(newDraft);
    if (selectedIndex === index) {
      setSelectedIndex(newDraft.length > 0 ? Math.min(index, newDraft.length - 1) : null);
    } else if (selectedIndex != null && selectedIndex > index) {
      setSelectedIndex(selectedIndex - 1);
    }
  }

  function updateRule(index: number, patch: Partial<AttributeMatchRequirement>) {
    setDraft(draft.map((r, i) => (i === index ? { ...r, ...patch } : r)));
  }

  /* ── Normalization helpers ── */

  function addNormalizationStep() {
    if (selectedIndex == null) return;
    const req = draft[selectedIndex];
    const usedMethods = new Set((req.normalization ?? []).map((n) => n.method));
    const available = NORMALIZATION_OPTIONS.filter((o) => !usedMethods.has(o.value));
    if (available.length === 0) return;
    const steps: NormalizationStep[] = [...(req.normalization ?? [])];
    steps.push({ step: steps.length === 0 ? "apply" : "then", method: available[0].value });
    updateRule(selectedIndex, { normalization: steps });
  }

  function removeNormalizationStep(stepIndex: number) {
    if (selectedIndex == null) return;
    const req = draft[selectedIndex];
    const steps = (req.normalization ?? []).filter((_, i) => i !== stepIndex);
    const fixed: NormalizationStep[] = steps.map((s, i) => ({ ...s, step: i === 0 ? "apply" : "then" }));
    updateRule(selectedIndex, { normalization: fixed });
  }

  function updateNormalizationMethod(stepIndex: number, method: NormalizationMethodType) {
    if (selectedIndex == null) return;
    const req = draft[selectedIndex];
    const steps = (req.normalization ?? []).map((s, i) => (i === stepIndex ? { ...s, method } : s));
    updateRule(selectedIndex, { normalization: steps });
  }

  /* ── Comparison helpers ── */

  function handleComparisonTypeChange(type: "simple" | "complex") {
    if (selectedIndex == null) return;
    if (type === "simple") {
      updateRule(selectedIndex, { comparison: { type: "simple", matchLevel: "partial" } });
    } else {
      updateRule(selectedIndex, { comparison: { type: "complex", conditions: [{ method: "string_similarity", matchLevel: "full", threshold: 100 }] } });
    }
  }

  function addCondition() {
    if (selectedIndex == null) return;
    const req = draft[selectedIndex];
    if (req.comparison.type !== "complex") return;
    const conditions: MatchCondition[] = [...req.comparison.conditions, { method: "string_similarity", matchLevel: "full", threshold: 100 }];
    updateRule(selectedIndex, { comparison: { type: "complex", conditions } });
  }

  function removeCondition(condIndex: number) {
    if (selectedIndex == null) return;
    const req = draft[selectedIndex];
    if (req.comparison.type !== "complex") return;
    const conditions = req.comparison.conditions.filter((_, i) => i !== condIndex);
    if (conditions.length === 0) {
      updateRule(selectedIndex, { comparison: { type: "simple", matchLevel: "partial" } });
      return;
    }
    updateRule(selectedIndex, { comparison: { type: "complex", conditions } });
  }

  function updateCondition(condIndex: number, patch: Partial<MatchCondition>) {
    if (selectedIndex == null) return;
    const req = draft[selectedIndex];
    if (req.comparison.type !== "complex") return;
    const conditions = req.comparison.conditions.map((c, i) => (i === condIndex ? { ...c, ...patch } : c));
    updateRule(selectedIndex, { comparison: { type: "complex", conditions } });
  }

  function handleSave() {
    onChange(draft);
    setModalOpen(false);
    onClose?.();
  }

  function handleCancel() {
    setModalOpen(false);
    onClose?.();
  }

  return (
    <>
      {!defaultOpen && (
        <Button
          color="secondary"
          variant={requirements.length > 0 ? "soft" : "outline"}
          size="sm"
          pill
          onClick={() => setModalOpen(true)}
        >
          {requirements.length === 0 ? (
            <><Plus /> Add match logic</>
          ) : (
            <>Edit match logic ({requirements.length})</>
          )}
        </Button>
      )}

      <Modal open={modalOpen} onOpenChange={(open) => { setModalOpen(open); if (!open) onClose?.(); }} maxWidth="max-w-2xl">
        <div className="p-6">
          <h2 className="heading-lg">Match requirements</h2>
          <div className="mt-4">
            <div className="flex gap-4" style={{ minHeight: 340 }}>
            {/* Left column — requirement list */}
            <div className="flex w-52 shrink-0 flex-col gap-1">
              {draft.map((rule, index) => {
                const attrLabel = ATTRIBUTE_OPTIONS.find((a) => a.value === rule.attribute)?.label ?? rule.attribute;
                const summaryText = getMatchSummaryText(rule);
                const isSelected = selectedIndex === index;

                return (
                  <div
                    key={`${rule.attribute}-${index}`}
                    className={`group flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 transition-colors ${
                      isSelected
                        ? "border-[var(--color-primary-solid-bg)] bg-[var(--color-primary-surface-bg)]"
                        : "border-transparent hover:bg-[var(--color-surface-secondary)]"
                    }`}
                    onClick={() => setSelectedIndex(index)}
                  >
                    <div className="flex min-w-0 flex-1 flex-col">
                      <span className="text-sm font-medium text-[var(--color-text)] truncate">{attrLabel}</span>
                      <span className="text-xs text-[var(--color-text-secondary)] truncate">{summaryText}</span>
                    </div>
                    <Button
                      color="secondary"
                      variant="ghost"
                      size="3xs"
                      uniform
                      className={isSelected ? "" : "opacity-0 group-hover:opacity-100"}
                      onClick={(e: React.MouseEvent) => {
                        e.stopPropagation();
                        removeRule(index);
                      }}
                    >
                      <Trash />
                    </Button>
                  </div>
                );
              })}

              {availableAttributes.length > 0 && (
                <button
                  type="button"
                  onClick={addRule}
                  className="mt-1 flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-surface-secondary)]"
                >
                  <Plus className="h-3.5 w-3.5" /> Add requirement
                </button>
              )}
            </div>

            {/* Right column — edit selected */}
            <div className="flex flex-1 flex-col gap-4 border-l border-[var(--color-border)] pl-4">
              {selectedReq && selectedIndex != null ? (
                <>
                  {/* Attribute */}
                  <div className="flex flex-col gap-1.5">
                    <span className="text-xs font-medium text-[var(--color-text-secondary)]">Attribute</span>
                    <Select
                      options={[
                        ...ATTRIBUTE_OPTIONS.filter((a) => a.value === selectedReq.attribute),
                        ...availableAttributes,
                      ]}
                      value={selectedReq.attribute}
                      onChange={(o) => { if (o) updateRule(selectedIndex, { attribute: o.value as ComparisonAttribute }); }}
                      size="sm"
                      pill={false}
                      block
                    />
                  </div>

                  {/* Normalization */}
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-[var(--color-text-secondary)]">Normalization</span>
                      <Button color="secondary" variant="ghost" size="3xs" uniform onClick={addNormalizationStep}>
                        <Plus />
                      </Button>
                    </div>
                    {(selectedReq.normalization ?? []).length === 0 ? (
                      <p className="text-xs text-[var(--color-text-tertiary)]">No normalization steps</p>
                    ) : (
                      <div className="flex flex-col gap-1.5">
                        {(selectedReq.normalization ?? []).map((step, i) => (
                          <div key={i} className="flex items-center gap-1.5">
                            <span className="w-10 shrink-0 text-xs text-[var(--color-text-secondary)]">
                              {step.step === "apply" ? "Apply" : "Then"}
                            </span>
                            <div className="min-w-0 flex-1">
                              <Select
                                options={NORMALIZATION_OPTIONS}
                                value={step.method}
                                onChange={(o) => { if (o) updateNormalizationMethod(i, o.value as NormalizationMethodType); }}
                                size="sm"
                                pill={false}
                                block
                              />
                            </div>
                            <Button
                              color="secondary"
                              variant="ghost"
                              size="3xs"
                              uniform
                              onClick={() => removeNormalizationStep(i)}
                            >
                              <Trash />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Comparison */}
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-medium text-[var(--color-text-secondary)]">Comparison</span>
                    <SegmentedControl
                      aria-label="Comparison type"
                      value={selectedReq.comparison.type}
                      onChange={(v) => handleComparisonTypeChange(v as "simple" | "complex")}
                      size="xs"
                    >
                      <SegmentedControl.Tab value="simple">Simple</SegmentedControl.Tab>
                      <SegmentedControl.Tab value="complex">Complex</SegmentedControl.Tab>
                    </SegmentedControl>

                    {selectedReq.comparison.type === "simple" ? (
                      <div className="flex flex-col gap-1.5">
                        <span className="text-xs text-[var(--color-text-secondary)]">Match Level</span>
                        <Select
                          options={MATCH_LEVEL_OPTIONS}
                          value={selectedReq.comparison.matchLevel}
                          onChange={(o) => { if (o) updateRule(selectedIndex, { comparison: { type: "simple", matchLevel: o.value as MatchLevel } }); }}
                          size="sm"
                          pill={false}
                          block
                        />
                      </div>
                    ) : (() => {
                      const cmp = selectedReq.comparison;
                      if (cmp.type !== "complex") return null;
                      return (
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-[var(--color-text-secondary)]">Logic</span>
                            <Button color="secondary" variant="ghost" size="3xs" uniform onClick={addCondition}>
                              <Plus />
                            </Button>
                          </div>
                          <div className="flex flex-col gap-2">
                            {cmp.conditions.map((cond, i) => (
                              <div key={i} className="flex flex-wrap items-center gap-1.5">
                                <span className="shrink-0 text-xs text-[var(--color-text-secondary)]">
                                  {i === 0 ? "Where" : "Or"}
                                </span>
                                <div className="w-36">
                                  <Select
                                    options={COMPARISON_METHOD_OPTIONS}
                                    value={cond.method}
                                    onChange={(o) => { if (o) updateCondition(i, { method: o.value as ComparisonMethod }); }}
                                    size="sm"
                                    pill={false}
                                    block
                                    listMinWidth={200}
                                  />
                                </div>
                                <span className="shrink-0 text-xs text-[var(--color-text-secondary)]">threshold</span>
                                <div className="w-16">
                                  <Input
                                    size="sm"
                                    type="number"
                                    value={cond.threshold != null ? String(cond.threshold) : ""}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                      const val = e.target.value === "" ? undefined : Number(e.target.value);
                                      updateCondition(i, { threshold: val });
                                    }}
                                  />
                                </div>
                                {cmp.conditions.length > 1 && (
                                  <Button
                                    color="secondary"
                                    variant="ghost"
                                    size="3xs"
                                    uniform
                                    onClick={() => removeCondition(i)}
                                  >
                                    <Trash />
                                  </Button>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </>
              ) : (
                <div className="flex flex-1 items-center justify-center">
                  <p className="text-sm text-[var(--color-text-tertiary)]">
                    {draft.length === 0 ? "Add a requirement to get started" : "Select a requirement to edit"}
                  </p>
                </div>
              )}
            </div>
          </div>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <Button color="secondary" variant="soft" pill onClick={handleCancel}>
              Cancel
            </Button>
            <Button color="primary" pill onClick={handleSave}>
              Save
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
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
      <div className="flex flex-col gap-1.5">
        <ConfigLabel description="These default required attributes will be used for every country and ID type. You can override this default on a per-country and per-ID basis in Countries and ID Types.">Default required attributes</ConfigLabel>
        <div className="flex flex-wrap items-center gap-2">
          <div className="w-52">
            <Select
              options={EXTRACTED_PROPERTY_OPTIONS}
              value={requiredAttributes}
              onChange={(opts) => {
                const next = opts.map((o) => o.value as ExtractedProperty);
                onUpdate({ requiredAttributes: next.length > 0 ? next : undefined });
              }}
              multiple
              clearable
              placeholder="Add"
              size="sm"
              block
              listMinWidth={200}
              TriggerView={() => <span className="truncate">{requiredAttributes.length === 0 ? 'No required attributes' : `${requiredAttributes.length} selected`}</span>}
            />
          </div>
          {requiredAttributes.map((attr) => {
            const label = EXTRACTED_PROPERTY_OPTIONS.find((o) => o.value === attr)?.label ?? attr;
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
      </div>

      <div className="flex items-center gap-2">
        <Switch
          checked={passWhenMissing}
          onCheckedChange={(v) => onUpdate({ passWhenPropertyMissing: v })}
        />
        <ConfigLabel>Pass when required property does not appear on the ID</ConfigLabel>
      </div>
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
      <div className="p-6">
        <h2 className="heading-lg">Bulk configure</h2>
        <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
          Apply settings to {selectedCodes.length} selected countries.
        </p>
        <div className="mt-4">

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
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <Button color="secondary" variant="soft" pill onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button color="primary" pill onClick={handleApply}>
            Apply to {selectedCodes.length} countries
          </Button>
        </div>
      </div>
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
