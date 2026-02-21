"use client";

import { Suspense, useMemo, useRef, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";

import { TopBar, TOPBAR_CONTROL_SIZE, TOPBAR_ACTION_PILL, TOPBAR_TOOLBAR_PILL } from "@/components/layout/TopBar";
import { NotFoundPage, SectionHeading, ConfirmLeaveModal, CopyButton, Modal, ModalHeader, ModalBody, ModalFooter } from "@/components/shared";
import { useTemplateForm } from "@/lib/hooks/useTemplateForm";

import {
  ALL_ID_DOC_TYPES,
  COUNTRY_OPTIONS,
  COUNTRY_REGIONS,
  ID_DOC_TYPE_LABELS,
  ID_DOC_TYPE_SHORT,
  ID_DOC_TYPE_COLORS,
  REGION_OPTIONS,
  countryFlag,
  getCountryIdTypes,
} from "@/lib/constants/countries";
import type { CountrySettings, IdDocType, IdTypeConfig, Region, RequiredSides } from "@/lib/constants/countries";
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
import { Checkbox } from "@plexui/ui/components/Checkbox";
import { Field } from "@plexui/ui/components/Field";
import { Input } from "@plexui/ui/components/Input";
import { Menu } from "@plexui/ui/components/Menu";
import { SegmentedControl } from "@plexui/ui/components/SegmentedControl";
import { Select } from "@plexui/ui/components/Select";
import { Tabs } from "@plexui/ui/components/Tabs";
import { Popover } from "@plexui/ui/components/Popover";
import { ChevronDownMd, ChevronRightSm, DotsHorizontal, Search } from "@plexui/ui/components/Icon";

/* ─── Constants ─── */

const CAPTURE_METHOD_OPTIONS = [
  { value: "auto", label: "Auto" },
  { value: "manual", label: "Manual" },
  { value: "both", label: "Both" },
];

const CAPTURE_METHOD_TYPES = new Set<VerificationType>(["government_id", "selfie", "document"]);

const CHECK_CATEGORY_LABELS: Record<string, string> = {
  fraud: "Fraud",
  validity: "Validity",
  biometrics: "Biometrics",
  user_action_required: "User action",
};

const CHECK_CATEGORY_COLORS: Record<string, string> = {
  fraud: "danger",
  validity: "secondary",
  biometrics: "info",
  user_action_required: "warning",
};

const CHECK_CATEGORY_OPTIONS = [
  { value: "all", label: "All categories" },
  { value: "fraud", label: "Fraud" },
  { value: "validity", label: "Validity" },
  { value: "biometrics", label: "Biometrics" },
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
    category: c.category,
    required: c.defaultRequired,
    enabled: true,
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
      category: a.category,
      required: existing ? existing.required : a.defaultRequired,
      enabled: true,
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
      category: a.category,
      required: existing ? existing.required : a.defaultRequired,
      enabled: true,
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

  const title = isNew ? "New verification template" : (existing?.name ?? "Verification template");
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
              <Badge color={getStatusColor(form.status) as "warning" | "success" | "secondary"} size="sm" pill>
                {form.status.charAt(0).toUpperCase() + form.status.slice(1)}
              </Badge>
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

      <div className="flex flex-1 flex-col overflow-auto">
        <div className="flex-1 overflow-auto px-4 py-6 md:px-6">
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
            <SettingsTab
              form={form}
              existing={existing}
              onPatch={patch}
              onPatchSettings={patchSettings}
              onChangeType={changeType}
            />
          )}
        </div>
      </div>

      <ConfirmLeaveModal open={showLeaveConfirm} onConfirm={confirmLeave} onCancel={cancelLeave} />
    </div>
  );
}

/* ─── Checks Tab ─── */

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
  const [category, setCategory] = useState("all");

  const filtered = useMemo(() => {
    return checks.filter((check) => {
      const matchesSearch = !search || check.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === "all" || check.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [checks, search, category]);

  const requiredCount = checks.filter((c) => c.required).length;

  return (
    <div>
      <div className="mb-4 flex items-center gap-3">
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
        <div className="w-40">
          <Select
            options={CHECK_CATEGORY_OPTIONS}
            value={category}
            onChange={(o) => { if (o) setCategory(o.value); }}
            size="sm"
            pill
            variant="outline"
            block
          />
        </div>
        <p className="ml-auto text-xs text-[var(--color-text-tertiary)]">
          {checks.length} checks · {requiredCount} required
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-[var(--color-border)]">
        <div className="overflow-hidden">
          <table className="-mb-px w-full">
            <thead>
              <tr className="border-b border-[var(--color-border)]">
                <th className="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-[var(--color-text-tertiary)]">
                  Check
                </th>
                <th className="w-28 px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-[var(--color-text-tertiary)]">
                  Category
                </th>
                <th className="w-28 px-4 py-2.5 text-center text-xs font-medium uppercase tracking-wider text-[var(--color-text-tertiary)]">
                  Configurable
                </th>
                <th className="w-24 px-4 py-2.5 text-center text-xs font-medium uppercase tracking-wider text-[var(--color-text-tertiary)]">
                  Required
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((check) => {
                const formIndex = checks.findIndex((c) => c.name === check.name);
                const availCheck = AVAILABLE_CHECKS[type]?.find((a) => a.name === check.name);
                return (
                  <tr key={check.name} className="border-b border-[var(--color-border)]">
                    <td className="px-4 py-2.5">
                      <span className="text-sm text-[var(--color-text)]">{check.name}</span>
                      {check.lifecycle === "beta" && (
                        <Badge color="discovery" variant="soft" size="sm" className="ml-2">Beta</Badge>
                      )}
                      {check.lifecycle === "sunset" && (
                        <Badge color="warning" variant="soft" size="sm" className="ml-2">Sunset</Badge>
                      )}
                    </td>
                    <td className="w-28 px-4 py-2.5">
                      <Badge
                        color={CHECK_CATEGORY_COLORS[check.category] as "danger" | "secondary" | "info" | "warning"}
                        variant="soft"
                        size="sm"
                      >
                        {CHECK_CATEGORY_LABELS[check.category] ?? check.category}
                      </Badge>
                    </td>
                    <td className="w-28 px-4 py-2.5 text-center">
                      {availCheck?.configurable && (
                        <span className="text-sm text-[var(--color-text-secondary)]">✓</span>
                      )}
                    </td>
                    <td className="w-24 px-4 py-2.5">
                      <div className="flex justify-center">
                        <Checkbox
                          checked={check.required}
                          onCheckedChange={(c) => onUpdateCheck(formIndex, { ...check, required: !!c })}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr className="border-b border-[var(--color-border)]">
                  <td colSpan={4} className="py-8 text-center text-sm text-[var(--color-text-tertiary)]">
                    No checks match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ─── Countries Tab ─── */

const STATUS_FILTER_OPTIONS = [
  { value: "all", label: "All countries" },
  { value: "enabled", label: "Enabled" },
  { value: "disabled", label: "Disabled" },
];

function FilterDropdown({
  label,
  options,
  selected,
  onToggle,
  onClear,
}: {
  label: string;
  options: { value: string; label: string }[];
  selected: Set<string>;
  onToggle: (value: string) => void;
  onClear: () => void;
}) {
  const [filterSearch, setFilterSearch] = useState("");

  const filtered = filterSearch.trim()
    ? options.filter((o) => o.label.toLowerCase().includes(filterSearch.toLowerCase()))
    : options;

  const trigger = selected.size === 0
    ? `All ${label}`
    : selected.size === options.length
      ? `All ${label}`
      : `${selected.size} ${label}`;

  return (
    <Popover>
      <Popover.Trigger>
        <button
          type="button"
          className="flex h-[30px] items-center gap-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-sm text-[var(--color-text)] transition-colors hover:bg-[var(--color-nav-hover-bg)]"
        >
          {trigger}
          <ChevronDownMd style={{ width: 14, height: 14, opacity: 0.5 }} />
        </button>
      </Popover.Trigger>
      <Popover.Content side="bottom" align="start" sideOffset={4} className="w-64">
        <div className="flex flex-col">
          <div className="border-b border-[var(--color-border)] px-3 py-2">
            <Input
              size="xs"
              placeholder="Search..."
              value={filterSearch}
              onChange={(e) => setFilterSearch(e.target.value)}
              onClear={filterSearch ? () => setFilterSearch("") : undefined}
              startAdornment={<Search style={{ width: 14, height: 14 }} />}
            />
          </div>
          <div className="max-h-64 overflow-auto py-1">
            {selected.size > 0 && (
              <button
                type="button"
                onClick={onClear}
                className="flex w-full items-center px-3 py-1.5 text-left text-sm text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-nav-hover-bg)]"
              >
                Clear selection
              </button>
            )}
            {filtered.map((opt) => (
              <label
                key={opt.value}
                className="flex cursor-pointer items-center gap-2.5 px-3 py-1.5 transition-colors hover:bg-[var(--color-nav-hover-bg)]"
              >
                <Checkbox
                  checked={selected.has(opt.value)}
                  onCheckedChange={() => onToggle(opt.value)}
                />
                <span className="text-sm text-[var(--color-text)]">{opt.label}</span>
              </label>
            ))}
            {filtered.length === 0 && (
              <p className="px-3 py-4 text-center text-xs text-[var(--color-text-tertiary)]">
                No matches
              </p>
            )}
          </div>
        </div>
      </Popover.Content>
    </Popover>
  );
}

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
  const [statusFilter, setStatusFilter] = useState("all");
  const [regionFilters, setRegionFilters] = useState<Set<Region>>(new Set());
  const [idTypeFilters, setIdTypeFilters] = useState<Set<IdDocType>>(new Set());
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [bulkConfigOpen, setBulkConfigOpen] = useState(false);

  const selectedSet = useMemo(() => new Set(selected), [selected]);

  const filtered = useMemo(() => {
    let countries = COUNTRY_OPTIONS;

    if (search.trim()) {
      const q = search.toLowerCase();
      countries = countries.filter(
        (c) => c.label.toLowerCase().includes(q) || c.value.toLowerCase().includes(q),
      );
    }

    if (statusFilter === "enabled") {
      countries = countries.filter((c) => selectedSet.has(c.value));
    } else if (statusFilter === "disabled") {
      countries = countries.filter((c) => !selectedSet.has(c.value));
    }

    if (regionFilters.size > 0) {
      countries = countries.filter((c) => regionFilters.has(COUNTRY_REGIONS[c.value]));
    }

    if (idTypeFilters.size > 0) {
      countries = countries.filter((c) => {
        const types = getCountryIdTypes(c.value);
        return Array.from(idTypeFilters).some((t) => types.includes(t));
      });
    }

    return countries;
  }, [search, statusFilter, regionFilters, idTypeFilters, selectedSet]);

  const allFilteredSelected = filtered.length > 0 && filtered.every((c) => selectedSet.has(c.value));
  const someFilteredSelected = filtered.some((c) => selectedSet.has(c.value));

  function toggleExpanded(code: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(code)) next.delete(code);
      else next.add(code);
      return next;
    });
  }

  function handleSelectAll() {
    const codes = filtered.map((c) => c.value);
    onToggleBatch(codes, !allFilteredSelected);
  }

  const hasActiveFilters = statusFilter !== "all" || regionFilters.size > 0 || idTypeFilters.size > 0 || search.trim() !== "";

  return (
    <div>
      <div className="mb-4 flex items-center gap-3">
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
            value={statusFilter}
            onChange={(o) => { if (o) setStatusFilter(o.value); }}
            size="sm"
            pill
            variant="outline"
            block
          />
        </div>
        <FilterDropdown
          label="regions"
          options={REGION_OPTIONS.map((r) => ({ value: r.value, label: r.label }))}
          selected={regionFilters as Set<string>}
          onToggle={(v) => {
            setRegionFilters((prev) => {
              const next = new Set(prev);
              if (next.has(v as Region)) next.delete(v as Region);
              else next.add(v as Region);
              return next;
            });
          }}
          onClear={() => setRegionFilters(new Set())}
        />
        <FilterDropdown
          label="ID types"
          options={ALL_ID_DOC_TYPES.map((t) => ({ value: t, label: ID_DOC_TYPE_LABELS[t] }))}
          selected={idTypeFilters as Set<string>}
          onToggle={(v) => {
            setIdTypeFilters((prev) => {
              const next = new Set(prev);
              if (next.has(v as IdDocType)) next.delete(v as IdDocType);
              else next.add(v as IdDocType);
              return next;
            });
          }}
          onClear={() => setIdTypeFilters(new Set())}
        />
        {hasActiveFilters && (
          <Button
            color="secondary"
            variant="soft"
            size="sm"
            pill
            onClick={() => {
              setSearch("");
              setStatusFilter("all");
              setRegionFilters(new Set());
              setIdTypeFilters(new Set());
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
        <p className="ml-auto text-xs text-[var(--color-text-tertiary)]">
          {selected.length} of {COUNTRY_OPTIONS.length} enabled
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-[var(--color-border)]">
        <div className="overflow-hidden">
          <table className="-mb-px w-full">
            <thead>
              <tr className="border-b border-[var(--color-border)]">
                <th className="w-10 px-3 py-2.5">
                  <Checkbox
                    checked={allFilteredSelected ? true : someFilteredSelected ? "indeterminate" : false}
                    onCheckedChange={handleSelectAll}
                  />
                </th>
                <th className="w-8 px-0 py-2.5" />
                <th className="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-[var(--color-text-tertiary)]">
                  Country
                </th>
                <th className="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-[var(--color-text-tertiary)]">
                  Accepted ID Types
                </th>
                <th className="w-28 px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-[var(--color-text-tertiary)]">
                  Region
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((country) => {
                const isEnabled = selectedSet.has(country.value);
                const isExpanded = expanded.has(country.value);
                const availableTypes = getCountryIdTypes(country.value);
                const cs = countrySettings[country.value];
                const activeTypes = cs?.allowedIdTypes ?? availableTypes;

                return (
                  <CountryRow
                    key={country.value}
                    code={country.value}
                    name={country.label}
                    enabled={isEnabled}
                    expanded={isExpanded}
                    availableTypes={availableTypes}
                    activeTypes={activeTypes}
                    cs={cs}
                    region={COUNTRY_REGIONS[country.value]}
                    onToggle={() => onToggle(country.value)}
                    onToggleExpand={() => toggleExpanded(country.value)}
                    onUpdateSettings={(next) => onUpdateCountrySettings(country.value, next)}
                  />
                );
              })}
              {filtered.length === 0 && (
                <tr className="border-b border-[var(--color-border)]">
                  <td colSpan={5} className="py-8 text-center text-sm text-[var(--color-text-tertiary)]">
                    No countries match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

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

function CountryRow({
  code,
  name,
  enabled,
  expanded,
  availableTypes,
  activeTypes,
  cs,
  region,
  onToggle,
  onToggleExpand,
  onUpdateSettings,
}: {
  code: string;
  name: string;
  enabled: boolean;
  expanded: boolean;
  availableTypes: IdDocType[];
  activeTypes: IdDocType[];
  cs: CountrySettings | undefined;
  region: Region | undefined;
  onToggle: () => void;
  onToggleExpand: () => void;
  onUpdateSettings: (next: CountrySettings) => void;
}) {
  const activeSet = useMemo(() => new Set(activeTypes), [activeTypes]);

  function toggleIdType(type: IdDocType) {
    const current = cs?.allowedIdTypes ?? [...availableTypes];
    const set = new Set(current);
    if (set.has(type)) set.delete(type);
    else set.add(type);
    onUpdateSettings({ ...cs, allowedIdTypes: Array.from(set) });
  }

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
    <>
      <tr
        className={`border-b border-[var(--color-border)] transition-colors ${enabled ? "" : "opacity-50"}`}
      >
        <td className="w-10 px-3 py-2">
          <Checkbox checked={enabled} onCheckedChange={onToggle} />
        </td>
        <td className="w-8 px-0 py-2">
          <button
            type="button"
            onClick={onToggleExpand}
            className="flex h-6 w-6 items-center justify-center rounded text-[var(--color-text-tertiary)] transition-colors hover:bg-[var(--color-nav-hover-bg)] hover:text-[var(--color-text)]"
          >
            {expanded ? (
              <ChevronDownMd style={{ width: 14, height: 14 }} />
            ) : (
              <ChevronRightSm style={{ width: 14, height: 14 }} />
            )}
          </button>
        </td>
        <td className="px-3 py-2">
          <span className="flex items-center gap-2">
            <span className="text-base leading-none">{countryFlag(code)}</span>
            <span className="text-sm text-[var(--color-text)]">{name}</span>
            <span className="text-2xs text-[var(--color-text-tertiary)]">{code}</span>
          </span>
        </td>
        <td className="px-3 py-2">
          <div className="flex flex-wrap gap-1">
            {availableTypes.map((type) => (
              <Badge
                key={type}
                color={activeSet.has(type) ? (ID_DOC_TYPE_COLORS[type] as "info" | "discovery" | "warning" | "success" | "secondary") : "secondary"}
                variant={activeSet.has(type) ? "soft" : "outline"}
                size="sm"
              >
                {ID_DOC_TYPE_SHORT[type]}
              </Badge>
            ))}
          </div>
        </td>
        <td className="w-28 px-3 py-2">
          <span className="text-xs text-[var(--color-text-tertiary)]">{region ?? "—"}</span>
        </td>
      </tr>
      {expanded && (
        <tr className="border-b border-[var(--color-border)]">
          <td colSpan={5} className="bg-[var(--color-surface-secondary)] px-6 py-4">
            <div className="flex gap-8">
              <div className="flex-1">
                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-[var(--color-text-tertiary)]">
                  Accepted ID Types
                </p>
                <div className="flex flex-col gap-1.5">
                  {availableTypes.map((type) => (
                    <Checkbox
                      key={type}
                      label={ID_DOC_TYPE_LABELS[type]}
                      checked={activeSet.has(type)}
                      onCheckedChange={() => toggleIdType(type)}
                    />
                  ))}
                </div>
              </div>
              <div className="w-56">
                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-[var(--color-text-tertiary)]">
                  Age Range
                </p>
                <div className="flex items-center gap-2">
                  <div className="w-20">
                    <Input
                      size="sm"
                      type="number"
                      placeholder="Min"
                      value={cs?.ageRange?.min != null ? String(cs.ageRange.min) : ""}
                      onChange={(e) => setAgeMin(e.target.value)}
                    />
                  </div>
                  <span className="text-xs text-[var(--color-text-tertiary)]">to</span>
                  <div className="w-20">
                    <Input
                      size="sm"
                      type="number"
                      placeholder="Max"
                      value={cs?.ageRange?.max != null ? String(cs.ageRange.max) : ""}
                      onChange={(e) => setAgeMax(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

/* ─── Settings Tab ─── */

function SettingsTab({
  form,
  existing,
  onPatch,
  onPatchSettings,
  onChangeType,
}: {
  form: VerificationForm;
  existing: VerificationTemplate | undefined;
  onPatch: (partial: Partial<VerificationForm>) => void;
  onPatchSettings: (p: Partial<VerificationForm["settings"]>) => void;
  onChangeType: (type: VerificationType) => void;
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
        <Field
          label="Type"
          description={existing ? "Type cannot be changed after creation" : "The type of verification this template performs"}
        >
          {existing ? (
            <p className="text-sm text-[var(--color-text)]">
              {VERIFICATION_TYPE_OPTIONS.find((o) => o.value === form.type)?.label ?? form.type}
            </p>
          ) : (
            <div className="w-48">
              <Select
                options={VERIFICATION_TYPE_OPTIONS}
                value={form.type}
                onChange={(o) => { if (o) onChangeType(o.value as VerificationType); }}
                pill={false}
                block
              />
            </div>
          )}
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
