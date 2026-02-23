"use client";

import { useEffect, useMemo, useState } from "react";

import { CountrySettingsModal } from "./CountrySettingsModal";
import { BulkConfigureModal } from "./BulkConfigureModal";

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
  type CountrySettings,
  type IdDocType,
} from "@/lib/constants/countries";
import { COUNTRIES_TD, TABLE_TH, TABLE_TH_BASE } from "@/lib/constants/page-layout";

import { Badge } from "@plexui/ui/components/Badge";
import { Button } from "@plexui/ui/components/Button";
import { Checkbox } from "@plexui/ui/components/Checkbox";
import { Input } from "@plexui/ui/components/Input";
import { Select } from "@plexui/ui/components/Select";
import { Search, SettingsCog } from "@plexui/ui/components/Icon";

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
  return selectedTypes;
}

function IdTypeBadgesDisplay({
  availableTypes,
  activeTypes,
}: {
  availableTypes: IdDocType[];
  activeTypes: IdDocType[];
}) {
  const activeSet = useMemo(() => new Set(activeTypes), [activeTypes]);

  return (
    <div className="flex max-w-80 flex-wrap gap-1">
      {availableTypes.map((type) => (
        <Badge
          pill
          key={type}
          color={
            activeSet.has(type)
              ? (ID_DOC_TYPE_COLORS[type] as
                  | "secondary"
                  | "info"
                  | "discovery"
                  | "warning"
                  | "success"
                  | "caution"
                  | "danger")
              : "secondary"
          }
          variant={activeSet.has(type) ? "soft" : "outline"}
          size="sm"
          className={activeSet.has(type) ? undefined : "opacity-40"}
        >
          {ID_DOC_TYPE_SHORT[type]}
        </Badge>
      ))}
    </div>
  );
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
  const [settingsCountryCode, setSettingsCountryCode] = useState<string | null>(null);

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

  const settingsCountry =
    settingsCountryCode != null
      ? COUNTRY_OPTIONS.find((country) => country.value === settingsCountryCode)
      : undefined;

  return (
    <div data-suppress-anim={suppressAnim || undefined}>
      <table className="-mb-px w-full" data-datatable>
        <thead className="sticky top-0 z-10 bg-[var(--color-surface)]">
          <tr>
            <th colSpan={5} className="pt-6 pb-3 text-left font-normal">
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
                    onChange={(opts) => setStatusFilters(opts.map((option) => option.value))}
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
                    onChange={(opts) => setRegionFilters(opts.map((option) => option.value))}
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
                    options={ID_DOC_TYPE_FILTER_OPTIONS}
                    value={idTypeFilters}
                    onChange={(opts) => setIdTypeFilters(opts.map((option) => option.value))}
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
                    aria-pressed={bulkConfigOpen}
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
            <th className={`w-52 ${TABLE_TH}`}>Country</th>
            <th className={TABLE_TH}>Accepted ID Types</th>
            <th className={`w-36 text-right ${TABLE_TH_BASE}`}>Region</th>
            <th className={`w-14 text-right ${TABLE_TH_BASE}`}>Settings</th>
          </tr>
        </thead>

        <tbody>
          {filtered.map((country) => {
            const isEnabled = selectedSet.has(country.value);
            const availableTypes = getCountryIdTypes(country.value);
            const settings = countrySettings[country.value];
            const activeTypes = getActiveTypes(settings, availableTypes);

            return (
              <tr
                key={country.value}
                className={`border-b border-[var(--color-border)] transition-colors ${
                  isEnabled ? "bg-[var(--color-success-surface-bg)]" : ""
                }`}
              >
                <td className={`w-10 ${COUNTRIES_TD}`}>
                  <Checkbox checked={isEnabled} onCheckedChange={() => onToggle(country.value)} />
                </td>
                <td className={`w-52 ${COUNTRIES_TD}`}>
                  <span className="flex items-center gap-2">
                    <span className="text-base leading-none">{countryFlag(country.value)}</span>
                    <span className="truncate text-md text-[var(--color-text)]">{country.label}</span>
                    <span className="shrink-0 text-xs text-[var(--color-text-tertiary)]">
                      {country.value}
                    </span>
                  </span>
                </td>
                <td className={COUNTRIES_TD}>
                  <IdTypeBadgesDisplay availableTypes={availableTypes} activeTypes={activeTypes} />
                </td>
                <td className={`w-36 text-right ${COUNTRIES_TD}`}>
                  <span className="text-sm text-[var(--color-text-secondary)]">
                    {COUNTRY_REGIONS[country.value] ?? "-"}
                  </span>
                </td>
                <td className={`w-14 text-right ${COUNTRIES_TD}`}>
                  <Button
                    color="secondary"
                    variant="ghost"
                    size="xs"
                    onClick={() => setSettingsCountryCode(country.value)}
                  >
                    <SettingsCog />
                  </Button>
                </td>
              </tr>
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

      <CountrySettingsModal
        open={settingsCountry != null}
        onOpenChange={(open) => {
          if (!open) setSettingsCountryCode(null);
        }}
        countryCode={settingsCountry?.value ?? ""}
        countryName={settingsCountry?.label ?? ""}
        availableTypes={settingsCountry ? getCountryIdTypes(settingsCountry.value) : []}
        countrySettings={settingsCountry ? countrySettings[settingsCountry.value] : undefined}
        onSave={(settings) => {
          if (!settingsCountry) return;
          onUpdateCountrySettings(settingsCountry.value, settings);
        }}
      />
    </div>
  );
}
