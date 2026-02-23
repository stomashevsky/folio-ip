"use client";

import { useMemo, useState } from "react";

import { Modal, ModalBody, ModalFooter, ModalHeader } from "@/components/shared/Modal";
import {
  ALL_ID_DOC_TYPES,
  COUNTRY_LABEL_MAP,
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
  MODAL_ROW_SELECT_WIDTH,
} from "@/lib/constants/page-layout";

import { Button } from "@plexui/ui/components/Button";
import { Checkbox } from "@plexui/ui/components/Checkbox";
import { Input } from "@plexui/ui/components/Input";
import { Select } from "@plexui/ui/components/Select";
import { Tabs } from "@plexui/ui/components/Tabs";


export interface BulkConfigPatch {
  allowedIdTypes?: IdDocType[];
  ageRange?: { min?: number; max?: number };
  idTypeConfig?: Partial<Record<IdDocType, IdTypeConfig>>;
}

export interface BulkConfigureModalProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  selectedCodes: string[];
  countrySettings: Record<string, CountrySettings>;
  onApply: (patch: BulkConfigPatch) => void;
}

type BulkTab =
  | "required_sides"
  | "required_attributes"
  | "expiration"
  | "accepted_alternatives"
  | "age_range";

function copyConfigMap(
  input: Partial<Record<IdDocType, IdTypeConfig>>,
): Partial<Record<IdDocType, IdTypeConfig>> {
  const next: Partial<Record<IdDocType, IdTypeConfig>> = {};
  for (const key in input) {
    const type = key as IdDocType;
    next[type] = { ...(input[type] ?? {}) };
  }
  return next;
}

export function BulkConfigureModal({
  open,
  onOpenChange,
  selectedCodes,
  countrySettings,
  onApply,
}: BulkConfigureModalProps) {
  const [activeTab, setActiveTab] = useState<BulkTab>("required_sides");
  const [allowedTypeSet, setAllowedTypeSet] = useState<Set<IdDocType>>(new Set());
  const [configByType, setConfigByType] = useState<Partial<Record<IdDocType, IdTypeConfig>>>({});
  const [ageMin, setAgeMin] = useState("");
  const [ageMax, setAgeMax] = useState("");
  const [search, setSearch] = useState("");

  const allDocTypes = useMemo(() => {
    const collected = new Set<IdDocType>();
    for (const code of selectedCodes) {
      for (const type of getCountryIdTypes(code)) {
        collected.add(type);
      }
    }
    return ALL_ID_DOC_TYPES.filter((type) => collected.has(type));
  }, [selectedCodes]);

  const countryCountsByType = useMemo(() => {
    const counts: Partial<Record<IdDocType, number>> = {};
    for (const code of selectedCodes) {
      const countryTypes = getCountryIdTypes(code);
      for (const type of countryTypes) {
        counts[type] = (counts[type] ?? 0) + 1;
      }
    }
    return counts;
  }, [selectedCodes]);

  const selectedLabel = selectedCodes.length === 1 ? "country" : "countries";
  const filteredCodes = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return selectedCodes;
    return selectedCodes.filter((code) => {
      const name = COUNTRY_LABEL_MAP[code] ?? code;
      return name.toLowerCase().includes(q) || code.toLowerCase().includes(q);
    });
  }, [search, selectedCodes]);

  const [prevOpen, setPrevOpen] = useState(open);
  if (open && !prevOpen) {
    const activeTypes = new Set<IdDocType>();
    const mergedConfig: Partial<Record<IdDocType, IdTypeConfig>> = {};
    for (const code of selectedCodes) {
      const settings = countrySettings[code];
      const types = settings?.allowedIdTypes?.length
        ? settings.allowedIdTypes
        : getCountryIdTypes(code);
      for (const type of types) {
        activeTypes.add(type);
      }

      if (settings?.idTypeConfig) {
        for (const key in settings.idTypeConfig) {
          const type = key as IdDocType;
          const existing = mergedConfig[type] ?? {};
          const next = settings.idTypeConfig[type] ?? {};
          mergedConfig[type] = { ...existing, ...next };
        }
      }
    }

    setAllowedTypeSet(activeTypes.size > 0 ? activeTypes : new Set(allDocTypes));
    setConfigByType(copyConfigMap(mergedConfig));
    setAgeMin("");
    setAgeMax("");
    setSearch("");
    setActiveTab("required_sides");
  }
  if (open !== prevOpen) setPrevOpen(open);

  function updateTypeConfig(type: IdDocType, patch: Partial<IdTypeConfig>) {
    setConfigByType((prev) => {
      const existing = prev[type] ?? {};
      const merged: IdTypeConfig = { ...existing, ...patch };
      return { ...prev, [type]: merged };
    });
  }

  function handleApply() {
    const patch: BulkConfigPatch = {};
    patch.allowedIdTypes = allowedTypeSet.size === allDocTypes.length ? [] : Array.from(allowedTypeSet);

    if (ageMin || ageMax) {
      patch.ageRange = {
        min: ageMin ? Number(ageMin) : undefined,
        max: ageMax ? Number(ageMax) : undefined,
      };
    }

    const nextConfig: Partial<Record<IdDocType, IdTypeConfig>> = {};
    for (const type of allDocTypes) {
      const entry = configByType[type];
      if (!entry) continue;
      const hasAny =
        entry.requireFront !== undefined ||
        entry.requireBack !== undefined ||
        entry.requireBarcode !== undefined ||
        entry.requirePassportSignature !== undefined ||
        entry.requiredAttributes !== undefined ||
        entry.expirationDays !== undefined ||
        entry.acceptedAlternatives !== undefined;
      if (!hasAny) continue;
      nextConfig[type] = { ...entry };
    }
    if (Object.keys(nextConfig).length > 0) {
      patch.idTypeConfig = nextConfig;
    }

    onApply(patch);
    onOpenChange(false);
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange} maxWidth="max-w-5xl">
      <ModalHeader onClose={() => onOpenChange(false)}>
        <div className="min-w-0">
          <h2 className="heading-md text-[var(--color-text)]">Configure IDs</h2>
          <p className="text-sm text-[var(--color-text-tertiary)]">
            Apply settings to {selectedCodes.length} selected {selectedLabel}
          </p>
        </div>
      </ModalHeader>

      <ModalBody>
        <Tabs
          aria-label="Bulk configure sections"
          value={activeTab}
          onChange={(value) => setActiveTab(value as BulkTab)}
          variant="underline"
          flush
          size={MODAL_CONTROL_SIZE}
        >
          <Tabs.Tab value="required_sides">Required Sides</Tabs.Tab>
          <Tabs.Tab value="required_attributes">Required Attributes</Tabs.Tab>
          <Tabs.Tab value="expiration">Expiration</Tabs.Tab>
          <Tabs.Tab value="accepted_alternatives">Accepted Alternatives</Tabs.Tab>
          <Tabs.Tab value="age_range">Age Range</Tabs.Tab>
        </Tabs>

        <div className="max-h-[500px] overflow-auto rounded-lg border border-[var(--color-border)]">
          {(activeTab === "required_sides" || activeTab === "age_range") && (
            <div className="border-b border-[var(--color-border)] px-4 py-3">
              <Input
                size={MODAL_CONTROL_SIZE}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search countries"
              />
            </div>
          )}

          {activeTab === "required_sides" && (
            <div className="divide-y divide-[var(--color-border)]">
              {allDocTypes.map((type) => (
                <div key={type} className="flex items-center justify-between gap-4 px-4 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="heading-xs text-[var(--color-text)]">{ID_DOC_TYPE_LABELS[type]}</p>
                    <p className="text-xs text-[var(--color-text-tertiary)]">
                      {(countryCountsByType[type] ?? 0).toString()} countries
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <Checkbox
                      label="Front"
                      checked={configByType[type]?.requireFront ?? true}
                      onCheckedChange={(checked) => updateTypeConfig(type, { requireFront: checked })}
                    />
                    {ID_TYPE_HAS_BACK.has(type) && (
                      <Checkbox
                        label="Back"
                        checked={configByType[type]?.requireBack ?? false}
                        onCheckedChange={(checked) => updateTypeConfig(type, { requireBack: checked })}
                      />
                    )}
                    {ID_TYPE_HAS_BARCODE.has(type) && (
                      <Checkbox
                        label="Barcode"
                        checked={configByType[type]?.requireBarcode ?? false}
                        onCheckedChange={(checked) => updateTypeConfig(type, { requireBarcode: checked })}
                      />
                    )}
                    {ID_TYPE_HAS_PASSPORT_SIGNATURE.has(type) && (
                      <Checkbox
                        label="Signature"
                        checked={configByType[type]?.requirePassportSignature ?? false}
                        onCheckedChange={(checked) =>
                          updateTypeConfig(type, { requirePassportSignature: checked })
                        }
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "required_attributes" && (
            <div className="divide-y divide-[var(--color-border)]">
              {allDocTypes.map((type) => (
                <div key={type} className="flex items-center justify-between gap-4 px-4 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="heading-xs text-[var(--color-text)]">{ID_DOC_TYPE_LABELS[type]}</p>
                    <p className="text-xs text-[var(--color-text-tertiary)]">
                      {(countryCountsByType[type] ?? 0).toString()} countries
                    </p>
                  </div>
                  <div className={MODAL_ROW_SELECT_WIDTH + " shrink-0"}>
                    <Select
                      options={EXTRACTED_ATTRIBUTE_OPTIONS}
                      value={configByType[type]?.requiredAttributes ?? []}
                      onChange={(opts) => {
                        const next = opts.map((option) => option.value);
                        updateTypeConfig(type, {
                          requiredAttributes: next.length > 0 ? next : undefined,
                        });
                      }}
                      multiple
                      clearable
                      size={MODAL_CONTROL_SIZE}
                      variant="outline"
                      block
                      listMinWidth={260}
                      placeholder="No required attributes"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "expiration" && (
            <div className="divide-y divide-[var(--color-border)]">
              {allDocTypes.map((type) => (
                <div key={type} className="flex items-center justify-between gap-4 px-4 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="heading-xs text-[var(--color-text)]">{ID_DOC_TYPE_LABELS[type]}</p>
                    <p className="text-xs text-[var(--color-text-tertiary)]">
                      {(countryCountsByType[type] ?? 0).toString()} countries
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <div className={MODAL_NUMBER_INPUT_WIDTH}>
                      <Input
                        size={MODAL_CONTROL_SIZE}
                        type="number"
                        min={0}
                        value={
                          configByType[type]?.expirationDays != null
                            ? String(configByType[type]?.expirationDays)
                            : ""
                        }
                        onChange={(e) => {
                          const value = e.target.value;
                          updateTypeConfig(type, {
                            expirationDays: value === "" ? undefined : Number(value),
                          });
                        }}
                        placeholder="0"
                      />
                    </div>
                    <span className="text-sm text-[var(--color-text-secondary)]">days</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "accepted_alternatives" && (
            <div className="divide-y divide-[var(--color-border)]">
              {allDocTypes.map((type) => (
                <div key={type} className="flex items-center justify-between gap-4 px-4 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="heading-xs text-[var(--color-text)]">{ID_DOC_TYPE_LABELS[type]}</p>
                    <p className="text-xs text-[var(--color-text-tertiary)]">
                      {(countryCountsByType[type] ?? 0).toString()} countries
                    </p>
                  </div>
                  <div className={MODAL_ROW_SELECT_WIDTH + " shrink-0"}>
                    <Select
                      options={allDocTypes
                        .filter((docType) => docType !== type)
                        .map((docType) => ({ value: docType, label: ID_DOC_TYPE_LABELS[docType] }))}
                      value={configByType[type]?.acceptedAlternatives ?? []}
                      onChange={(opts) => {
                        const next = opts.map((option) => option.value as IdDocType);
                        updateTypeConfig(type, {
                          acceptedAlternatives: next.length > 0 ? next : undefined,
                        });
                      }}
                      multiple
                      clearable
                      size={MODAL_CONTROL_SIZE}
                      variant="outline"
                      block
                      listMinWidth={260}
                      placeholder="No alternatives"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "age_range" && (
            <div className="px-4 py-4">
              <div className="mb-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2">
                <p className="text-sm text-[var(--color-text-secondary)]">
                  {filteredCodes.length.toString()} of {selectedCodes.length.toString()} countries match the current filter.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className={MODAL_NUMBER_INPUT_WIDTH}>
                  <Input
                    size={MODAL_CONTROL_SIZE}
                    type="number"
                    min={0}
                    placeholder="Min"
                    value={ageMin}
                    onChange={(e) => setAgeMin(e.target.value)}
                  />
                </div>
                <span className="text-sm text-[var(--color-text-tertiary)]">to</span>
                <div className={MODAL_NUMBER_INPUT_WIDTH}>
                  <Input
                    size={MODAL_CONTROL_SIZE}
                    type="number"
                    min={0}
                    placeholder="Max"
                    value={ageMax}
                    onChange={(e) => setAgeMax(e.target.value)}
                  />
                </div>
                <span className="text-sm text-[var(--color-text-tertiary)]">years</span>
              </div>
            </div>
          )}
        </div>
      </ModalBody>

      <ModalFooter>
        <Button color="primary" variant="soft" onClick={() => onOpenChange(false)}>
          Cancel
        </Button>
        <Button color="primary" onClick={handleApply}>
          Apply to {selectedCodes.length} {selectedLabel}
        </Button>
      </ModalFooter>
    </Modal>
  );
}
