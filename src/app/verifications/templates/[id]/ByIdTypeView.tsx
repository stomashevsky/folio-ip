import { useState, useMemo } from "react";

import {
  ALL_ID_DOC_TYPES,

  EXTRACTED_ATTRIBUTE_OPTIONS,
  ID_DOC_TYPE_LABELS,
  ID_TYPE_HAS_BACK,
  ID_TYPE_HAS_BARCODE,
  ID_TYPE_HAS_PASSPORT_SIGNATURE,
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
  COUNTRIES_TD,
  TABLE_TH,
} from "@/lib/constants/page-layout";
import { BREAKPOINT_XL } from "@/lib/constants/breakpoints";

import { Button } from "@plexui/ui/components/Button";
import { Checkbox } from "@plexui/ui/components/Checkbox";
import { Input } from "@plexui/ui/components/Input";
import { Select } from "@plexui/ui/components/Select";
import { ChevronLeftMd } from "@plexui/ui/components/Icon";
import { useIsMobile } from "@/lib/hooks";

type SettingsTab =
  | "required_sides"
  | "required_attributes"
  | "expiration"
  | "accepted_alternatives"
  | "age_range";

const SETTINGS_CATEGORIES: { value: SettingsTab; label: string }[] = [
  { value: "required_sides", label: "Required Sides" },
  { value: "required_attributes", label: "Attributes" },
  { value: "expiration", label: "Expiration" },
  { value: "accepted_alternatives", label: "Alternatives" },
  { value: "age_range", label: "Age Range" },
];

/** Pre-filtered country list entry — parent decides what's visible via toolbar filters. */
export interface VisibleCountry {
  value: string;
  label: string;
}

export interface ByIdTypeViewProps {
  /** Enabled country codes (checked in the "By Country" view). */
  selected: string[];
  /** Pre-filtered country list from the parent toolbar (may include disabled countries). */
  visibleCountries: VisibleCountry[];
  countrySettings: Record<string, CountrySettings>;
  onUpdateCountrySettings: (code: string, cs: CountrySettings) => void;
}

export function ByIdTypeView({
  selected,
  visibleCountries,
  countrySettings,
  onUpdateCountrySettings,
}: ByIdTypeViewProps) {
  const isMobile = useIsMobile(BREAKPOINT_XL);
  const [selectedType, setSelectedType] = useState<IdDocType | null>(null);
  const [activeTab, setActiveTab] = useState<SettingsTab>("required_sides");
  const [mobileShowTable, setMobileShowTable] = useState(false);

  const selectedSet = useMemo(() => new Set(selected), [selected]);


  // Collect all ID types available across VISIBLE countries (respects parent filters), with country counts
  const { availableTypes, countryCountByType } = useMemo(() => {
    const counts: Partial<Record<IdDocType, number>> = {};
    for (const c of visibleCountries) {
      for (const type of getCountryIdTypes(c.value)) {
        counts[type] = (counts[type] ?? 0) + 1;
      }
    }
    const types = ALL_ID_DOC_TYPES.filter((t) => (counts[t] ?? 0) > 0);
    return { availableTypes: types, countryCountByType: counts };
  }, [visibleCountries]);


  // Auto-select first type if none selected or selected type is no longer available
  const effectiveType = useMemo(() => {
    if (selectedType && availableTypes.includes(selectedType)) return selectedType;
    return availableTypes[0] ?? null;
  }, [selectedType, availableTypes]);

  // Countries that have the selected ID type AND are in the visible set (for tabs 1-4)
  const countriesForType = useMemo(() => {
    if (!effectiveType) return [];
    return visibleCountries.filter((c) =>
      getCountryIdTypes(c.value).includes(effectiveType),
    );
  }, [effectiveType, visibleCountries]);

  // All visible countries (for Age Range tab — age range is per-country, not per-ID-type)
  const allVisibleCountries = visibleCountries;

  // Countries to display based on active tab
  const displayCountries = useMemo(() => {
    return activeTab === "age_range" ? allVisibleCountries : countriesForType;
  }, [activeTab, allVisibleCountries, countriesForType]);

  const activeCategoryLabel =
    SETTINGS_CATEGORIES.find((category) => category.value === activeTab)?.label ?? "Settings";

  // ── Update helpers ──

  function updateCountryIdTypeConfig(
    countryCode: string,
    idType: IdDocType,
    patch: Partial<IdTypeConfig>,
  ) {
    const current = countrySettings[countryCode] ?? {};
    const existing = current.idTypeConfig?.[idType] ?? {};
    const merged: IdTypeConfig = { ...existing, ...patch };
    onUpdateCountrySettings(countryCode, {
      ...current,
      idTypeConfig: {
        ...(current.idTypeConfig ?? {}),
        [idType]: merged,
      },
    });
  }

  function updateCountryAgeRange(countryCode: string, field: "min" | "max", value: string) {
    const current = countrySettings[countryCode] ?? {};
    const ageRange = { ...current.ageRange, [field]: value === "" ? undefined : Number(value) };
    if (ageRange.min === undefined && ageRange.max === undefined) {
      onUpdateCountrySettings(countryCode, { ...current, ageRange: undefined });
    } else {
      onUpdateCountrySettings(countryCode, { ...current, ageRange });
    }
  }


  // ── Mobile navigation ──
  const mobileLevel: 1 | 2 | 3 = !selectedType ? 1 : !mobileShowTable ? 2 : 3;

  // ── Render ──

  return (
    <div className="flex h-full min-h-0 w-full">
      {/* ── Left Column: ID Type List ── */}
      {(!isMobile || mobileLevel === 1) && (
        <div
          className={`flex min-h-0 w-[280px] shrink-0 flex-col ${!isMobile ? "border-r border-[var(--color-border)]" : "w-full"}`}
        >
          <div className={COLUMN_HEADER}>
            <span className={COLUMN_HEADER_LABEL}>ID Types</span>
            <span className={COLUMN_HEADER_VALUE}>{availableTypes.length} types</span>
          </div>


          {/* List */}
          <div className="flex-1 overflow-y-auto p-1.5">
            {availableTypes.map((type) => {
              const count = countryCountByType[type] ?? 0;
              return (
                <div
                  key={type}
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    setSelectedType(type);
                    setActiveTab("required_sides");
                    if (isMobile) setMobileShowTable(false);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSelectedType(type);
                      setActiveTab("required_sides");
                      if (isMobile) setMobileShowTable(false);
                    }
                  }}
                  className={`flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 outline-none transition-colors ${
                    effectiveType === type
                      ? "bg-[var(--gray-100)]"
                      : "hover:bg-[var(--color-surface-secondary)]"
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-[var(--color-text)]">
                      {ID_DOC_TYPE_LABELS[type]}
                    </div>
                    <div className="text-xs text-[var(--color-text-tertiary)]">
                      {count} {count === 1 ? "country" : "countries"}
                    </div>
                  </div>
                </div>
              );
            })}
            {availableTypes.length === 0 && (
              <div className="p-6 text-center text-sm text-[var(--color-text-tertiary)]">
                No ID types match your search.
              </div>
            )}
          </div>
        </div>
      )}

      {(!isMobile || mobileLevel === 2) && (
        <div
          className={`flex min-h-0 w-[220px] shrink-0 flex-col ${!isMobile ? "border-r border-[var(--color-border)]" : "w-full"}`}
        >
          {isMobile && mobileLevel === 2 && (
            <div className="px-4 pt-4 pb-2">
              <Button
                color="secondary"
                variant="soft"
                size="sm"
                pill
                onClick={() => {
                  setSelectedType(null);
                  setMobileShowTable(false);
                }}
              >
                <ChevronLeftMd className="size-4" />
                ID Types
              </Button>
            </div>
          )}
          <div className={COLUMN_HEADER}>
            <span className={COLUMN_HEADER_LABEL}>
              {effectiveType ? ID_DOC_TYPE_LABELS[effectiveType] : "Settings"}
            </span>
            <span className={COLUMN_HEADER_VALUE}>{countriesForType.length} countries</span>
          </div>
          <div className="flex-1 overflow-y-auto p-1.5">
            {SETTINGS_CATEGORIES.map((category) => (
              <div
                key={category.value}
                role="button"
                tabIndex={0}
                onClick={() => {
                  setActiveTab(category.value);
                  if (isMobile) setMobileShowTable(true);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setActiveTab(category.value);
                    if (isMobile) setMobileShowTable(true);
                  }
                }}
                className={`cursor-pointer rounded-lg px-3 py-2 outline-none transition-colors ${
                  activeTab === category.value
                    ? "bg-[var(--gray-100)]"
                    : "hover:bg-[var(--color-surface-secondary)]"
                }`}
              >
                <span className="text-sm font-medium text-[var(--color-text)]">{category.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {(!isMobile || mobileLevel === 3) && (
        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          {isMobile && mobileLevel === 3 && (
            <div className="px-4 pt-4 pb-2">
              <Button
                color="secondary"
                variant="soft"
                size="sm"
                pill
                onClick={() => setMobileShowTable(false)}
              >
                <ChevronLeftMd className="size-4" />
                {effectiveType ? ID_DOC_TYPE_LABELS[effectiveType] : "Settings"}
              </Button>
            </div>
          )}
          {effectiveType ? (
            <>
              <div className={COLUMN_HEADER}>
                <span className={COLUMN_HEADER_LABEL}>{activeCategoryLabel}</span>
              </div>
              <div className="flex-1 overflow-auto">
                {activeTab === "required_sides" && (
                  <RequiredSidesTable
                    countries={displayCountries}
                    idType={effectiveType}
                    countrySettings={countrySettings}
                    enabledSet={selectedSet}
                    onUpdate={updateCountryIdTypeConfig}
                  />
                )}
                {activeTab === "required_attributes" && (
                  <RequiredAttributesTable
                    countries={displayCountries}
                    idType={effectiveType}
                    countrySettings={countrySettings}
                    enabledSet={selectedSet}
                    onUpdate={updateCountryIdTypeConfig}
                  />
                )}
                {activeTab === "expiration" && (
                  <ExpirationTable
                    countries={displayCountries}
                    idType={effectiveType}
                    countrySettings={countrySettings}
                    enabledSet={selectedSet}
                    onUpdate={updateCountryIdTypeConfig}
                  />
                )}
                {activeTab === "accepted_alternatives" && (
                  <AlternativesTable
                    countries={displayCountries}
                    idType={effectiveType}
                    countrySettings={countrySettings}
                    enabledSet={selectedSet}
                    onUpdate={updateCountryIdTypeConfig}
                  />
                )}
                {activeTab === "age_range" && (
                  <AgeRangeTable
                    countries={displayCountries}
                    countrySettings={countrySettings}
                    enabledSet={selectedSet}
                    onUpdate={updateCountryAgeRange}
                  />
                )}
              </div>
            </>
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-[var(--color-text-tertiary)]">
              {visibleCountries.length === 0
                ? "No countries match current filters."
                : "Select an ID type to configure."}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   Sub-tables for each settings tab
   ═══════════════════════════════════════════════════════ */

interface CountryOption {
  value: string;
  label: string;
}

interface TabTableProps {
  countries: CountryOption[];
  idType: IdDocType;
  countrySettings: Record<string, CountrySettings>;
  enabledSet: Set<string>;
  onUpdate: (code: string, idType: IdDocType, patch: Partial<IdTypeConfig>) => void;
}

// ── Required Sides ──

function RequiredSidesTable({ countries, idType, countrySettings, onUpdate }: TabTableProps) {
  const hasBack = ID_TYPE_HAS_BACK.has(idType);
  const hasBarcode = ID_TYPE_HAS_BARCODE.has(idType);
  const hasSignature = ID_TYPE_HAS_PASSPORT_SIGNATURE.has(idType);

  if (countries.length === 0) {
    return (
      <div className="p-6 text-center text-sm text-[var(--color-text-tertiary)]">
        No countries match your search.
      </div>
    );
  }

  return (
    <table className="-mb-px w-full">
      <thead>
        <tr className="border-b border-[var(--color-border)]">
          <th className={`${TABLE_TH} pl-4`}>Country</th>
          <th className={`${TABLE_TH} w-[88px] text-center`}>Front</th>
          {hasBack && <th className={`${TABLE_TH} w-[88px] text-center`}>Back</th>}
          {hasBarcode && <th className={`${TABLE_TH} w-[88px] text-center`}>Barcode</th>}
          {hasSignature && <th className={`${TABLE_TH} w-[100px] text-center`}>Signature</th>}
        </tr>
      </thead>
      <tbody>
        {countries.map((c) => {
          const cfg = countrySettings[c.value]?.idTypeConfig?.[idType] ?? {};
          return (
            <tr key={c.value} className="border-b border-[var(--color-border)]">
              <td className={`${COUNTRIES_TD} pl-4 text-sm text-[var(--color-text)]`}>
                {c.label}
              </td>
              <td className={`${COUNTRIES_TD} text-center`}>
                <Checkbox
                  checked={cfg.requireFront ?? true}
                  onCheckedChange={(checked) =>
                    onUpdate(c.value, idType, { requireFront: checked })
                  }
                />
              </td>
              {hasBack && (
                <td className={`${COUNTRIES_TD} text-center`}>
                  <Checkbox
                    checked={cfg.requireBack ?? false}
                    onCheckedChange={(checked) =>
                      onUpdate(c.value, idType, { requireBack: checked })
                    }
                  />
                </td>
              )}
              {hasBarcode && (
                <td className={`${COUNTRIES_TD} text-center`}>
                  <Checkbox
                    checked={cfg.requireBarcode ?? false}
                    onCheckedChange={(checked) =>
                      onUpdate(c.value, idType, { requireBarcode: checked })
                    }
                  />
                </td>
              )}
              {hasSignature && (
                <td className={`${COUNTRIES_TD} text-center`}>
                  <Checkbox
                    checked={cfg.requirePassportSignature ?? false}
                    onCheckedChange={(checked) =>
                      onUpdate(c.value, idType, { requirePassportSignature: checked })
                    }
                  />
                </td>
              )}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

// ── Required Attributes ──

function RequiredAttributesTable({ countries, idType, countrySettings, onUpdate }: TabTableProps) {
  if (countries.length === 0) {
    return (
      <div className="p-6 text-center text-sm text-[var(--color-text-tertiary)]">
        No countries match your search.
      </div>
    );
  }

  return (
    <table className="-mb-px w-full">
      <thead>
        <tr className="border-b border-[var(--color-border)]">
          <th className={`${TABLE_TH} w-[200px] pl-4`}>Country</th>
          <th className={TABLE_TH}>Required Attributes</th>
        </tr>
      </thead>
      <tbody>
        {countries.map((c) => {
          const cfg = countrySettings[c.value]?.idTypeConfig?.[idType] ?? {};
          return (
            <tr key={c.value} className="border-b border-[var(--color-border)]">
              <td className={`${COUNTRIES_TD} pl-4 text-sm text-[var(--color-text)]`}>
                {c.label}
              </td>
              <td className={`${COUNTRIES_TD} pr-4`}>
                <div className="max-w-xs">
                  <Select
                    options={EXTRACTED_ATTRIBUTE_OPTIONS}
                    value={cfg.requiredAttributes ?? []}
                    onChange={(opts) => {
                      const next = opts.map((o) => o.value);
                      onUpdate(c.value, idType, {
                        requiredAttributes: next.length > 0 ? next : undefined,
                      });
                    }}
                    multiple
                    clearable
                    placeholder="No required attributes"
                    size={MODAL_CONTROL_SIZE}
                    variant="outline"
                    block
                    listMinWidth={260}
                  />
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

// ── Expiration ──

function ExpirationTable({ countries, idType, countrySettings, onUpdate }: TabTableProps) {
  if (countries.length === 0) {
    return (
      <div className="p-6 text-center text-sm text-[var(--color-text-tertiary)]">
        No countries match your search.
      </div>
    );
  }

  return (
    <table className="-mb-px w-full">
      <thead>
        <tr className="border-b border-[var(--color-border)]">
          <th className={`${TABLE_TH} w-[200px] pl-4`}>Country</th>
          <th className={TABLE_TH}>Expiration</th>
        </tr>
      </thead>
      <tbody>
        {countries.map((c) => {
          const cfg = countrySettings[c.value]?.idTypeConfig?.[idType] ?? {};
          return (
            <tr key={c.value} className="border-b border-[var(--color-border)]">
              <td className={`${COUNTRIES_TD} pl-4 text-sm text-[var(--color-text)]`}>
                {c.label}
              </td>
              <td className={COUNTRIES_TD}>
                <div className="flex items-center gap-2">
                  <div className={MODAL_NUMBER_INPUT_WIDTH}>
                    <Input
                      size={MODAL_CONTROL_SIZE}
                      type="number"
                      placeholder="0"
                      value={cfg.expirationDays != null ? String(cfg.expirationDays) : ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        onUpdate(c.value, idType, {
                          expirationDays: value === "" ? undefined : Number(value),
                        });
                      }}
                    />
                  </div>
                  <span className="text-sm text-[var(--color-text-secondary)]">days</span>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

// ── Accepted Alternatives ──

function AlternativesTable({ countries, idType, countrySettings, onUpdate }: TabTableProps) {
  if (countries.length === 0) {
    return (
      <div className="p-6 text-center text-sm text-[var(--color-text-tertiary)]">
        No countries match your search.
      </div>
    );
  }

  return (
    <table className="-mb-px w-full">
      <thead>
        <tr className="border-b border-[var(--color-border)]">
          <th className={`${TABLE_TH} w-[200px] pl-4`}>Country</th>
          <th className={TABLE_TH}>Accepted Alternatives</th>
        </tr>
      </thead>
      <tbody>
        {countries.map((c) => {
          const cfg = countrySettings[c.value]?.idTypeConfig?.[idType] ?? {};
          const countryTypes = getCountryIdTypes(c.value);
          const otherTypes = countryTypes
            .filter((t) => t !== idType)
            .map((t) => ({ value: t, label: ID_DOC_TYPE_LABELS[t] }));
          return (
            <tr key={c.value} className="border-b border-[var(--color-border)]">
              <td className={`${COUNTRIES_TD} pl-4 text-sm text-[var(--color-text)]`}>
                {c.label}
              </td>
              <td className={`${COUNTRIES_TD} pr-4`}>
                <div className="max-w-xs">
                  <Select
                    options={otherTypes}
                    value={cfg.acceptedAlternatives ?? []}
                    onChange={(opts) => {
                      const next = opts.map((o) => o.value as IdDocType);
                      onUpdate(c.value, idType, {
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
                  />
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

// ── Age Range ──

interface AgeRangeTableProps {
  countries: CountryOption[];
  countrySettings: Record<string, CountrySettings>;
  enabledSet: Set<string>;
  onUpdate: (code: string, field: "min" | "max", value: string) => void;
}

function AgeRangeTable({ countries, countrySettings, onUpdate }: AgeRangeTableProps) {
  if (countries.length === 0) {
    return (
      <div className="p-6 text-center text-sm text-[var(--color-text-tertiary)]">
        No countries match your search.
      </div>
    );
  }

  return (
    <table className="-mb-px w-full">
      <thead>
        <tr className="border-b border-[var(--color-border)]">
          <th className={`${TABLE_TH} pl-4`}>Country</th>
          <th className={`${TABLE_TH} w-[120px]`}>Min Age</th>
          <th className={`${TABLE_TH} w-[120px]`}>Max Age</th>
        </tr>
      </thead>
      <tbody>
        {countries.map((c) => {
          const ageRange = countrySettings[c.value]?.ageRange;
          return (
            <tr key={c.value} className="border-b border-[var(--color-border)]">
              <td className={`${COUNTRIES_TD} pl-4 text-sm text-[var(--color-text)]`}>
                {c.label}
              </td>
              <td className={COUNTRIES_TD}>
                <div className={MODAL_NUMBER_INPUT_WIDTH}>
                  <Input
                    size={MODAL_CONTROL_SIZE}
                    type="number"
                    placeholder="—"
                    value={ageRange?.min != null ? String(ageRange.min) : ""}
                    onChange={(e) => onUpdate(c.value, "min", e.target.value)}
                  />
                </div>
              </td>
              <td className={COUNTRIES_TD}>
                <div className={MODAL_NUMBER_INPUT_WIDTH}>
                  <Input
                    size={MODAL_CONTROL_SIZE}
                    type="number"
                    placeholder="—"
                    value={ageRange?.max != null ? String(ageRange.max) : ""}
                    onChange={(e) => onUpdate(c.value, "max", e.target.value)}
                  />
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
