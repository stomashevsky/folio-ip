"use client";

import { useEffect, useMemo, useState } from "react";

import { BulkConfigureModal } from "./BulkConfigureModal";

import {
  ALL_ID_DOC_TYPES,
  COUNTRY_OPTIONS,
  COUNTRY_REGIONS,
  EXTRACTED_ATTRIBUTE_OPTIONS,
  ID_DOC_TYPE_COLORS,
  ID_DOC_TYPE_LABELS,
  ID_DOC_TYPE_SHORT,
  ID_TYPE_HAS_BACK,
  ID_TYPE_HAS_BARCODE,
  ID_TYPE_HAS_PASSPORT_SIGNATURE,
  REGION_OPTIONS,
  getCountryIdTypes,
  type CountrySettings,
  type IdDocType,
  type IdTypeConfig,
} from "@/lib/constants/countries";
import {
  MODAL_CONTROL_SIZE,
  MODAL_NUMBER_INPUT_WIDTH,
  COLUMN_HEADER,
  COLUMN_HEADER_LABEL,
  COLUMN_HEADER_VALUE,
} from "@/lib/constants/page-layout";

import { Badge } from "@plexui/ui/components/Badge";
import { Button } from "@plexui/ui/components/Button";
import { Checkbox } from "@plexui/ui/components/Checkbox";
import { Field } from "@plexui/ui/components/Field";
import { Input } from "@plexui/ui/components/Input";
import { Select } from "@plexui/ui/components/Select";
import { SelectControl } from "@plexui/ui/components/SelectControl";
import { Search } from "@plexui/ui/components/Icon";

type BadgeColor = "secondary" | "info" | "discovery" | "warning" | "success" | "caution" | "danger";

const STATUS_FILTER_OPTIONS = [
  { value: "enabled", label: "Enabled" },
  { value: "disabled", label: "Disabled" },
];

const ID_DOC_TYPE_FILTER_OPTIONS = ALL_ID_DOC_TYPES.map((t) => ({
  value: t,
  label: ID_DOC_TYPE_LABELS[t],
}));

export interface CountriesTabProps {
  selected: string[];
  countrySettings: Record<string, CountrySettings>;
  onToggle: (code: string) => void;
  onToggleBatch: (codes: string[], enabled: boolean) => void;
  onUpdateCountrySettings: (code: string, cs: CountrySettings) => void;
}

function getActiveTypes(cs: CountrySettings | undefined, availableTypes: IdDocType[]): IdDocType[] {
  const selectedTypes = cs?.allowedIdTypes;
  if (!selectedTypes || selectedTypes.length === 0) return availableTypes;
  return selectedTypes.filter((type) => availableTypes.includes(type));
}

function getActiveTypeSet(settings: CountrySettings | undefined, availableTypes: IdDocType[]): Set<IdDocType> {
  return new Set(getActiveTypes(settings, availableTypes));
}

function getRequiredSidesParts(type: IdDocType, config: IdTypeConfig | undefined): string[] {
  const parts: string[] = [];
  if (config?.requireFront ?? true) parts.push("F");
  if (ID_TYPE_HAS_BACK.has(type) && config?.requireBack) parts.push("B");
  if (ID_TYPE_HAS_BARCODE.has(type) && config?.requireBarcode) parts.push("BC");
  if (ID_TYPE_HAS_PASSPORT_SIGNATURE.has(type) && config?.requirePassportSignature) parts.push("SIG");
  return parts;
}

export function CountriesTab({
  selected,
  countrySettings,
  onToggle,
  onToggleBatch,
  onUpdateCountrySettings,
}: CountriesTabProps) {
  const [search, setSearch] = useState("");
  const [statusFilters, setStatusFilters] = useState<string[]>([]);
  const [regionFilters, setRegionFilters] = useState<string[]>([]);
  const [idTypeFilters, setIdTypeFilters] = useState<string[]>([]);
  const [bulkConfigOpen, setBulkConfigOpen] = useState(false);
  const [selectedCountryCode, setSelectedCountryCode] = useState<string | null>(null);
  const [selectedIdType, setSelectedIdType] = useState<IdDocType | null>(null);

  const [suppressAnim, setSuppressAnim] = useState(true);
  useEffect(() => {
    const id = requestAnimationFrame(() => setSuppressAnim(false));
    return () => cancelAnimationFrame(id);
  }, []);

  const selectedSet = useMemo(() => new Set(selected), [selected]);

  const filtered = useMemo(() => {
    let countries = COUNTRY_OPTIONS;

    if (search.trim()) {
      const query = search.toLowerCase();
      countries = countries.filter(
        (country) =>
          country.label.toLowerCase().includes(query) || country.value.toLowerCase().includes(query),
      );
    }

    if (statusFilters.length > 0) {
      countries = countries.filter((country) => {
        const isEnabled = selectedSet.has(country.value);
        return statusFilters.includes("enabled") ? isEnabled : !isEnabled;
      });
    }

    if (regionFilters.length > 0) {
      countries = countries.filter((country) => regionFilters.includes(COUNTRY_REGIONS[country.value]));
    }

    if (idTypeFilters.length > 0) {
      countries = countries.filter((country) => {
        const types = getCountryIdTypes(country.value);
        return idTypeFilters.some((idType) => types.includes(idType as IdDocType));
      });
    }

    // Sort: enabled countries first, alphabetical within each group
    countries = [...countries].sort((a, b) => {
      const aEnabled = selectedSet.has(a.value) ? 0 : 1;
      const bEnabled = selectedSet.has(b.value) ? 0 : 1;
      if (aEnabled !== bEnabled) return aEnabled - bEnabled;
      return a.label.localeCompare(b.label);
    });
    return countries;
  }, [idTypeFilters, regionFilters, search, selectedSet, statusFilters]);

  const allFilteredSelected = filtered.length > 0 && filtered.every((country) => selectedSet.has(country.value));
  const someFilteredSelected = filtered.some((country) => selectedSet.has(country.value));

  function handleSelectAll() {
    const codes = filtered.map((country) => country.value);
    onToggleBatch(codes, !allFilteredSelected);
  }

  const hasActiveFilters =
    statusFilters.length > 0 ||
    regionFilters.length > 0 ||
    idTypeFilters.length > 0 ||
    search.trim() !== "";

  // Auto-select first enabled country only on initial mount
  useEffect(() => {
    if (selectedCountryCode !== null) return;
    const firstEnabled = COUNTRY_OPTIONS.find((c) => selectedSet.has(c.value))?.value ?? null;
    setSelectedCountryCode(firstEnabled);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  // If current selection is no longer in filtered list, pick first available
  useEffect(() => {
    if (selectedCountryCode === null) return;
    const stillVisible = filtered.some((c) => c.value === selectedCountryCode);
    if (!stillVisible) {
      setSelectedCountryCode(filtered[0]?.value ?? null);
    }
  }, [filtered, selectedCountryCode]);

  // Auto-select first doc type only when selected country changes
  useEffect(() => {
    if (!selectedCountryCode) {
      setSelectedIdType(null);
      return;
    }
    const availableTypes = getCountryIdTypes(selectedCountryCode);
    const activeTypes = getActiveTypes(countrySettings[selectedCountryCode], availableTypes);
    setSelectedIdType(activeTypes[0] ?? availableTypes[0] ?? null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCountryCode]);

  const selectedCountry =
    selectedCountryCode != null
      ? COUNTRY_OPTIONS.find((country) => country.value === selectedCountryCode)
      : undefined;
  const selectedCountrySettings = selectedCountry ? countrySettings[selectedCountry.value] : undefined;
  const selectedCountryTypes = useMemo(() => selectedCountry ? getCountryIdTypes(selectedCountry.value) : [], [selectedCountry]);
  const selectedCountryActiveSet = useMemo(
    () => getActiveTypeSet(selectedCountrySettings, selectedCountryTypes),
    [selectedCountrySettings, selectedCountryTypes],
  );
  const selectedTypeConfig =
    selectedCountry && selectedIdType
      ? (countrySettings[selectedCountry.value]?.idTypeConfig?.[selectedIdType] ?? {})
      : undefined;

  function updateCountrySettings(code: string, updater: (current: CountrySettings) => CountrySettings) {
    const current = countrySettings[code] ?? {};
    onUpdateCountrySettings(code, updater(current));
  }

  function updateSelectedCountrySettings(updater: (current: CountrySettings) => CountrySettings) {
    if (!selectedCountryCode) return;
    updateCountrySettings(selectedCountryCode, updater);
  }

  function setAgeMin(value: string) {
    const min = value === "" ? undefined : Number(value);
    updateSelectedCountrySettings((current) => {
      const ageRange = { ...current.ageRange, min };
      if (ageRange.min === undefined && ageRange.max === undefined) {
        return { ...current, ageRange: undefined };
      }
      return { ...current, ageRange };
    });
  }

  function setAgeMax(value: string) {
    const max = value === "" ? undefined : Number(value);
    updateSelectedCountrySettings((current) => {
      const ageRange = { ...current.ageRange, max };
      if (ageRange.min === undefined && ageRange.max === undefined) {
        return { ...current, ageRange: undefined };
      }
      return { ...current, ageRange };
    });
  }

  function toggleSelectedCountryIdType(type: IdDocType) {
    if (!selectedCountry) return;
    const availableTypes = selectedCountryTypes;
    const active = getActiveTypes(countrySettings[selectedCountry.value], availableTypes);
    const index = active.indexOf(type);
    const next = [...active];

    if (index >= 0) {
      if (next.length <= 1) return;
      next.splice(index, 1);
    } else {
      next.push(type);
    }

    const nextAllowed = next.length === availableTypes.length ? [] : next;
    updateCountrySettings(selectedCountry.value, (current) => ({
      ...current,
      allowedIdTypes: nextAllowed,
    }));
  }

  function updateSelectedTypeConfig(patch: Partial<IdTypeConfig>) {
    if (!selectedCountry || !selectedIdType) return;
    updateCountrySettings(selectedCountry.value, (current) => {
      const existing = current.idTypeConfig?.[selectedIdType] ?? {};
      const merged: IdTypeConfig = { ...existing, ...patch };
      return {
        ...current,
        idTypeConfig: {
          ...(current.idTypeConfig ?? {}),
          [selectedIdType]: merged,
        },
      };
    });
  }

  function removeRequiredAttribute(attr: string) {
    const attrs = selectedTypeConfig?.requiredAttributes ?? [];
    const next = attrs.filter((item) => item !== attr);
    updateSelectedTypeConfig({ requiredAttributes: next.length > 0 ? next : undefined });
  }

  return (
    <div className="flex h-full min-h-0 flex-col" data-suppress-anim={suppressAnim || undefined}>
      {/* ── Shared Toolbar ── */}
      <div className="flex flex-wrap items-center gap-2 px-4 pt-6 pb-3 md:px-6">
        <div className="w-60">
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
            placeholder="Status"
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
            placeholder="Region"
            size="sm"
            pill
            variant="outline"
            block
            listMinWidth={180}
          />
        </div>
        <div className="w-40">
          <Select
            options={ID_DOC_TYPE_FILTER_OPTIONS}
            value={idTypeFilters}
            onChange={(opts) => setIdTypeFilters(opts.map((o) => o.value))}
            multiple
            clearable
            placeholder="ID types"
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
            className="ml-auto"
            onClick={() => setBulkConfigOpen(true)}
          >
            Bulk ({selected.length})
          </Button>
        )}
      </div>

      {/* ── 3-Column Layout ── */}
      <div className="mx-4 mb-4 flex min-h-0 flex-1 overflow-hidden rounded-xl border border-[var(--color-border)] md:mx-6">
        {/* Column 1: Countries */}
        <div className="flex min-h-0 min-w-0 flex-1 flex-col border-r border-[var(--color-border)]">
          <div className={`${COLUMN_HEADER} pl-4.5 pr-3`}>
            <Checkbox
              checked={allFilteredSelected ? true : someFilteredSelected ? "indeterminate" : false}
              onCheckedChange={handleSelectAll}
            />
            <span className={COLUMN_HEADER_LABEL}>Countries</span>
            <span className={COLUMN_HEADER_VALUE}>
              Enabled · {selected.length} / {COUNTRY_OPTIONS.length}
            </span>
          </div>
          <div className="flex-1 overflow-y-auto p-1.5">
            {filtered.map((country) => {
              const isEnabled = selectedSet.has(country.value);
              const isSelected = selectedCountryCode === country.value;
              const availableTypes = getCountryIdTypes(country.value);
              const activeSet = getActiveTypeSet(countrySettings[country.value], availableTypes);

              return (
                <div
                  key={country.value}
                  role="button"
                  tabIndex={0}
                  onClick={() => setSelectedCountryCode(country.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSelectedCountryCode(country.value);
                    } else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
                      e.preventDefault();
                      const idx = filtered.findIndex((c) => c.value === country.value);
                      const next = e.key === "ArrowDown" ? idx + 1 : idx - 1;
                      const target = filtered[next];
                      if (target) {
                        setSelectedCountryCode(target.value);
                        const container = e.currentTarget.parentElement;
                        const el = container?.children[next] as HTMLElement | undefined;
                        el?.focus();
                        el?.scrollIntoView({ block: "nearest" });
                      }
                    }
                  }}
                  className={`flex cursor-pointer items-start gap-2.5 rounded-lg px-3 py-2 outline-none transition-colors ${
                    isSelected
                      ? "bg-[var(--gray-100)]"
                      : "hover:bg-[var(--color-surface-secondary)]"
                  }`}
                >
                  <div
                    className="mt-px"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggle(country.value);
                      setSelectedCountryCode(country.value);
                    }}
                  >
                    <Checkbox checked={isEnabled} onCheckedChange={() => { onToggle(country.value); setSelectedCountryCode(country.value); }} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm text-[var(--color-text)]">
                      {country.label}
                      <span className="text-[var(--color-text-tertiary)]"> · {country.value}</span>
                    </div>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {availableTypes.map((type) => {
                        const isActive = activeSet.has(type);
                        return (
                          <Badge
                            key={`${country.value}-${type}`}
                            pill
                            color={
                              isActive
                                ? (ID_DOC_TYPE_COLORS[type] as BadgeColor)
                                : "secondary"
                            }
                            variant={isActive ? "soft" : "outline"}
                            size="sm"
                            className={isActive ? undefined : "opacity-40"}
                          >
                            {ID_DOC_TYPE_SHORT[type]}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}

            {filtered.length === 0 && (
              <div className="p-6 text-center text-sm text-[var(--color-text-tertiary)]">
                No countries match your filters.
              </div>
            )}
          </div>
        </div>

        {/* Column 2: Document Types */}
        <div className="flex min-h-0 min-w-0 flex-1 flex-col border-r border-[var(--color-border)]">
          <div className={COLUMN_HEADER}>
            {selectedCountry ? (
              <>
                <span className={COLUMN_HEADER_LABEL}>{selectedCountry.label}</span>
                <span className={COLUMN_HEADER_VALUE}>
                  Accepted ID Types · {selectedCountryActiveSet.size} / {selectedCountryTypes.length}
                </span>
              </>
            ) : (
              <span className={COLUMN_HEADER_LABEL}>Document Types</span>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-1.5">
            {!selectedCountry && (
              <div className="flex h-full items-center justify-center text-sm text-[var(--color-text-tertiary)]">
                Select a country to configure.
              </div>
            )}

            {selectedCountry && (
              <>
                {selectedCountryTypes.map((type) => {
                  const isActive = selectedCountryActiveSet.has(type);
                  const isDocSelected = selectedIdType === type;

                  return (
                    <div
                      key={type}
                      role="button"
                      tabIndex={0}
                      onClick={() => setSelectedIdType(type)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setSelectedIdType(type);
                        } else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
                          e.preventDefault();
                          const idx = selectedCountryTypes.indexOf(type);
                          const next = e.key === "ArrowDown" ? idx + 1 : idx - 1;
                          const target = selectedCountryTypes[next];
                          if (target) {
                            setSelectedIdType(target);
                            const container = e.currentTarget.parentElement;
                            const el = container?.children[next] as HTMLElement | undefined;
                            el?.focus();
                            el?.scrollIntoView({ block: "nearest" });
                          }
                        }
                      }}
                      className={`flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 outline-none transition-colors ${
                        isDocSelected
                          ? "bg-[var(--gray-100)]"
                          : "hover:bg-[var(--color-surface-secondary)]"
                      }`}
                    >
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSelectedCountryIdType(type);
                          setSelectedIdType(type);
                        }}
                      >
                        <Checkbox
                          checked={isActive}
                          onCheckedChange={() => {
                            toggleSelectedCountryIdType(type);
                            setSelectedIdType(type);
                          }}
                        />
                      </div>
                      <span className="flex-1 text-sm text-[var(--color-text)]">
                        {ID_DOC_TYPE_LABELS[type]}
                      </span>
                      <div className="flex shrink-0 items-center gap-1">
                        {getRequiredSidesParts(type, countrySettings[selectedCountry.value]?.idTypeConfig?.[type]).map((side) => (
                          <Badge key={side} color="secondary" variant="soft" size="sm" pill>
                            {side}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  );
                })}

                <div className="px-3 py-4">
                  <Field label="Age Range" size={MODAL_CONTROL_SIZE}>
                    <div className="flex items-center gap-2">
                      <div className={MODAL_NUMBER_INPUT_WIDTH}>
                        <Input
                          size={MODAL_CONTROL_SIZE}
                          type="number"
                          placeholder="Min"
                          value={
                            selectedCountrySettings?.ageRange?.min != null
                              ? String(selectedCountrySettings.ageRange.min)
                              : ""
                          }
                          onChange={(e) => setAgeMin(e.target.value)}
                        />
                      </div>
                      <span className="text-sm text-[var(--color-text-tertiary)]">to</span>
                      <div className={MODAL_NUMBER_INPUT_WIDTH}>
                        <Input
                          size={MODAL_CONTROL_SIZE}
                          type="number"
                          placeholder="Max"
                          value={
                            selectedCountrySettings?.ageRange?.max != null
                              ? String(selectedCountrySettings.ageRange.max)
                              : ""
                          }
                          onChange={(e) => setAgeMax(e.target.value)}
                        />
                      </div>
                    </div>
                  </Field>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Column 3: Document Settings */}
        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <div className={COLUMN_HEADER}>
            {selectedIdType ? (
              <>
                <span className={COLUMN_HEADER_LABEL}>{ID_DOC_TYPE_LABELS[selectedIdType]}</span>
                <span className={COLUMN_HEADER_VALUE}>{selectedCountry?.label}</span>
              </>
            ) : (
              <span className={COLUMN_HEADER_LABEL}>Document Settings</span>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {!selectedIdType && (
              <div className="flex h-full items-center justify-center text-sm text-[var(--color-text-tertiary)]">
                Select a document type to configure.
              </div>
            )}

            {selectedIdType && selectedTypeConfig && (
              <div className="flex flex-col gap-5">
                <Field label="Required Sides" size={MODAL_CONTROL_SIZE}>
                  <div className="flex flex-col gap-2">
                    <Checkbox
                      checked={selectedTypeConfig.requireFront ?? true}
                      label="Require front"
                      onCheckedChange={(checked) => updateSelectedTypeConfig({ requireFront: checked })}
                    />
                    {ID_TYPE_HAS_BACK.has(selectedIdType) && (
                      <Checkbox
                        checked={selectedTypeConfig.requireBack ?? false}
                        label="Require back"
                        onCheckedChange={(checked) => updateSelectedTypeConfig({ requireBack: checked })}
                      />
                    )}
                    {ID_TYPE_HAS_BARCODE.has(selectedIdType) && (
                      <Checkbox
                        checked={selectedTypeConfig.requireBarcode ?? false}
                        label="Require barcode"
                        onCheckedChange={(checked) => updateSelectedTypeConfig({ requireBarcode: checked })}
                      />
                    )}
                    {ID_TYPE_HAS_PASSPORT_SIGNATURE.has(selectedIdType) && (
                      <Checkbox
                        checked={selectedTypeConfig.requirePassportSignature ?? false}
                        label="Require passport signature"
                        onCheckedChange={(checked) =>
                          updateSelectedTypeConfig({ requirePassportSignature: checked })
                        }
                      />
                    )}
                  </div>
                </Field>

                <Field label="Expiration" size={MODAL_CONTROL_SIZE}>
                  <div className="flex items-center gap-2">
                    <div className={MODAL_NUMBER_INPUT_WIDTH}>
                      <Input
                        size={MODAL_CONTROL_SIZE}
                        type="number"
                        placeholder="0"
                        value={
                          selectedTypeConfig.expirationDays != null
                            ? String(selectedTypeConfig.expirationDays)
                            : ""
                        }
                        onChange={(e) => {
                          const value = e.target.value;
                          updateSelectedTypeConfig({
                            expirationDays: value === "" ? undefined : Number(value),
                          });
                        }}
                      />
                    </div>
                    <span className="text-sm text-[var(--color-text-secondary)]">days</span>
                  </div>
                </Field>

                <Field label="Required Attributes" size={MODAL_CONTROL_SIZE}>
                  <div className="flex flex-col gap-2">
                    <Select
                      options={EXTRACTED_ATTRIBUTE_OPTIONS}
                      value={selectedTypeConfig.requiredAttributes ?? []}
                      onChange={(opts) => {
                        const next = opts.map((o) => o.value);
                        updateSelectedTypeConfig({
                          requiredAttributes: next.length > 0 ? next : undefined,
                        });
                      }}
                      multiple
                      clearable
                      placeholder="Select attributes"
                      size={MODAL_CONTROL_SIZE}
                      variant="outline"
                      block
                      listMinWidth={220}
                      pill={false}
                    />
                    {(selectedTypeConfig.requiredAttributes ?? []).length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {(selectedTypeConfig.requiredAttributes ?? []).map((attr) => {
                          const label =
                            EXTRACTED_ATTRIBUTE_OPTIONS.find((o) => o.value === attr)?.label ?? attr;
                          return (
                            <SelectControl
                              key={attr}
                              variant="soft"
                              size="xs"
                              selected
                              pill={false}
                              dropdownIconType="none"
                              onClearClick={() => removeRequiredAttribute(attr)}
                            >
                              {label}
                            </SelectControl>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </Field>

                <Field label="Accepted Alternatives" size={MODAL_CONTROL_SIZE}>
                  <Select
                    options={selectedCountryTypes
                      .filter((type) => type !== selectedIdType)
                      .map((type) => ({ value: type, label: ID_DOC_TYPE_LABELS[type] }))}
                    value={selectedTypeConfig.acceptedAlternatives ?? []}
                    onChange={(opts) => {
                      const next = opts.map((option) => option.value as IdDocType);
                      updateSelectedTypeConfig({
                        acceptedAlternatives: next.length > 0 ? next : undefined,
                      });
                    }}
                    multiple
                    clearable
                    placeholder="None"
                    size={MODAL_CONTROL_SIZE}
                    variant="outline"
                    block
                    listMinWidth={240}
                    pill={false}
                  />
                </Field>
              </div>
            )}
          </div>
        </div>
      </div>

      <BulkConfigureModal
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
