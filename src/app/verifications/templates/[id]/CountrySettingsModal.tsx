"use client";

import { useMemo, useState } from "react";

import { Modal, ModalHeader, ModalFooter } from "@/components/shared/Modal";
import {
  EXTRACTED_ATTRIBUTE_OPTIONS,
  ID_TYPE_HAS_BACK,
  ID_TYPE_HAS_BARCODE,
  ID_TYPE_HAS_PASSPORT_SIGNATURE,
  ID_DOC_TYPE_LABELS,
  ID_DOC_TYPE_SHORT,
  type CountrySettings,
  type IdDocType,
  type IdTypeConfig,
  countryFlag,
} from "@/lib/constants/countries";
import {
  MODAL_CONTROL_SIZE,
  MODAL_NUMBER_INPUT_WIDTH,
  MODAL_PANEL_SELECT_WIDTH,
  MODAL_SPLIT_LEFT_WIDTH,
} from "@/lib/constants/page-layout";

import { Button } from "@plexui/ui/components/Button";
import { Checkbox } from "@plexui/ui/components/Checkbox";
import { Field } from "@plexui/ui/components/Field";
import { Input } from "@plexui/ui/components/Input";
import { Select } from "@plexui/ui/components/Select";
import { SelectControl } from "@plexui/ui/components/SelectControl";

export interface CountrySettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  countryCode: string;
  countryName: string;
  availableTypes: IdDocType[];
  countrySettings: CountrySettings | undefined;
  onSave: (settings: CountrySettings) => void;
}

function getActiveTypeSet(settings: CountrySettings, availableTypes: IdDocType[]): Set<IdDocType> {
  const active = settings.allowedIdTypes;
  if (!active || active.length === 0) return new Set(availableTypes);
  return new Set(active.filter((t) => availableTypes.includes(t)));
}

export function CountrySettingsModal({
  open,
  onOpenChange,
  countryCode,
  countryName,
  availableTypes,
  countrySettings,
  onSave,
}: CountrySettingsModalProps) {
  const [draft, setDraft] = useState<CountrySettings>({});
  const [selectedIdType, setSelectedIdType] = useState<IdDocType | null>(null);
  const [prevOpen, setPrevOpen] = useState(open);

  if (open && !prevOpen) {
    const nextDraft = countrySettings ? structuredClone(countrySettings) : {};
    const activeTypes = getActiveTypeSet(nextDraft, availableTypes);
    setDraft(nextDraft);
    setSelectedIdType(availableTypes.find((type) => activeTypes.has(type)) ?? availableTypes[0] ?? null);
  }
  if (open !== prevOpen) setPrevOpen(open);

  const activeTypeSet = useMemo(
    () => getActiveTypeSet(draft, availableTypes),
    [draft, availableTypes],
  );

  const selectedConfig = selectedIdType ? (draft.idTypeConfig?.[selectedIdType] ?? {}) : undefined;

  function setAgeMin(value: string) {
    const min = value === "" ? undefined : Number(value);
    const ageRange = { ...draft.ageRange, min };
    if (ageRange.min === undefined && ageRange.max === undefined) {
      setDraft((prev) => ({ ...prev, ageRange: undefined }));
      return;
    }
    setDraft((prev) => ({ ...prev, ageRange }));
  }

  function setAgeMax(value: string) {
    const max = value === "" ? undefined : Number(value);
    const ageRange = { ...draft.ageRange, max };
    if (ageRange.min === undefined && ageRange.max === undefined) {
      setDraft((prev) => ({ ...prev, ageRange: undefined }));
      return;
    }
    setDraft((prev) => ({ ...prev, ageRange }));
  }

  function toggleIdType(type: IdDocType) {
    const current = Array.from(activeTypeSet);
    const index = current.indexOf(type);
    if (index >= 0) {
      if (current.length <= 1) return;
      current.splice(index, 1);
    } else {
      current.push(type);
    }
    const nextAllowed = current.length === availableTypes.length ? [] : current;
    setDraft((prev) => ({ ...prev, allowedIdTypes: nextAllowed }));
  }

  function selectIdType(type: IdDocType) {
    setSelectedIdType(type);
  }

  function updateSelectedConfig(patch: Partial<IdTypeConfig>) {
    if (!selectedIdType) return;
    setDraft((prev) => {
      const existing = prev.idTypeConfig?.[selectedIdType] ?? {};
      const merged: IdTypeConfig = { ...existing, ...patch };
      const nextMap: Partial<Record<IdDocType, IdTypeConfig>> = {
        ...(prev.idTypeConfig ?? {}),
        [selectedIdType]: merged,
      };
      return { ...prev, idTypeConfig: nextMap };
    });
  }

  function removeRequiredAttribute(attr: string) {
    const attrs = selectedConfig?.requiredAttributes ?? [];
    const next = attrs.filter((item) => item !== attr);
    updateSelectedConfig({ requiredAttributes: next.length > 0 ? next : undefined });
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange} maxWidth="max-w-3xl">
      <ModalHeader onClose={() => onOpenChange(false)}>
        <div className="flex items-center gap-3">
          <span className="text-lg leading-none">{countryFlag(countryCode)}</span>
          <div className="min-w-0">
            <h2 className="heading-md truncate text-[var(--color-text)]">{countryName}</h2>
            <p className="text-xs text-[var(--color-text-tertiary)]">{countryCode}</p>
          </div>
        </div>
      </ModalHeader>

      {/* Two-panel body — fixed height, no ModalBody wrapper */}
      <div className="flex h-[480px]">
        {/* ── Left panel: ID types + age range ── */}
        <div className={`${MODAL_SPLIT_LEFT_WIDTH} shrink-0 overflow-y-auto border-r border-[var(--color-border)] p-5`}>
          <div className="text-xs font-semibold uppercase tracking-[0.5px] text-[var(--color-text-tertiary)]">
            Accepted ID Types
          </div>
          <div className="mt-3 flex flex-col gap-0.5">
            {availableTypes.map((type) => (
              <div
                key={type}
                role="button"
                tabIndex={0}
                onClick={() => selectIdType(type)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    selectIdType(type);
                  }
                }}
                className={`flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 transition-colors ${
                  selectedIdType === type
                    ? "bg-[var(--color-secondary-soft-bg)]"
                    : "hover:bg-[var(--color-nav-hover-bg)]"
                }`}
              >
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleIdType(type);
                  }}
                >
                  <Checkbox
                    checked={activeTypeSet.has(type)}
                    onCheckedChange={() => toggleIdType(type)}
                  />
                </div>
                <span className="text-sm text-[var(--color-text)]">
                  {ID_DOC_TYPE_SHORT[type]} – {ID_DOC_TYPE_LABELS[type]}
                </span>
              </div>
            ))}
          </div>

          <div className="my-4 border-t border-[var(--color-border)]" />

          <Field label="Age Range">
            <div className="flex items-center gap-2">
              <div className={MODAL_NUMBER_INPUT_WIDTH}>
                <Input
                  size={MODAL_CONTROL_SIZE}
                  type="number"
                  placeholder="Min"
                  value={draft.ageRange?.min != null ? String(draft.ageRange.min) : ""}
                  onChange={(e) => setAgeMin(e.target.value)}
                />
              </div>
              <span className="text-sm text-[var(--color-text-tertiary)]">to</span>
              <div className={MODAL_NUMBER_INPUT_WIDTH}>
                <Input
                  size={MODAL_CONTROL_SIZE}
                  type="number"
                  placeholder="Max"
                  value={draft.ageRange?.max != null ? String(draft.ageRange.max) : ""}
                  onChange={(e) => setAgeMax(e.target.value)}
                />
              </div>
            </div>
          </Field>
        </div>

        {/* ── Right panel: per-ID-type config ── */}
        <div className="flex min-w-0 flex-1 flex-col overflow-y-auto p-5">
          {!selectedIdType && (
            <div className="flex flex-1 items-center justify-center text-sm text-[var(--color-text-tertiary)]">
              Select an ID type to configure requirements.
            </div>
          )}

          {selectedIdType && selectedConfig && (
            <div className="flex flex-col gap-5">
              <div className="heading-sm text-[var(--color-text)]">
                {ID_DOC_TYPE_SHORT[selectedIdType]} – {ID_DOC_TYPE_LABELS[selectedIdType]}
              </div>

              <Field label="Required Sides">
                <div className="flex flex-col gap-2">
                  <Checkbox
                    checked={selectedConfig.requireFront ?? true}
                    label="Require front"
                    onCheckedChange={(checked) => updateSelectedConfig({ requireFront: checked })}
                  />
                  {ID_TYPE_HAS_BACK.has(selectedIdType) && (
                    <Checkbox
                      checked={selectedConfig.requireBack ?? false}
                      label="Require back"
                      onCheckedChange={(checked) => updateSelectedConfig({ requireBack: checked })}
                    />
                  )}
                  {ID_TYPE_HAS_BARCODE.has(selectedIdType) && (
                    <Checkbox
                      checked={selectedConfig.requireBarcode ?? false}
                      label="Require barcode"
                      onCheckedChange={(checked) => updateSelectedConfig({ requireBarcode: checked })}
                    />
                  )}
                  {ID_TYPE_HAS_PASSPORT_SIGNATURE.has(selectedIdType) && (
                    <Checkbox
                      checked={selectedConfig.requirePassportSignature ?? false}
                      label="Require passport signature"
                      onCheckedChange={(checked) =>
                        updateSelectedConfig({ requirePassportSignature: checked })
                      }
                    />
                  )}
                </div>
              </Field>

              <Field label="Expiration">
                <div className="flex items-center gap-2">
                  <div className={MODAL_NUMBER_INPUT_WIDTH}>
                    <Input
                      size={MODAL_CONTROL_SIZE}
                      type="number"
                      placeholder="0"
                      value={
                        selectedConfig.expirationDays != null
                          ? String(selectedConfig.expirationDays)
                          : ""
                      }
                      onChange={(e) => {
                        const value = e.target.value;
                        updateSelectedConfig({
                          expirationDays: value === "" ? undefined : Number(value),
                        });
                      }}
                    />
                  </div>
                  <span className="text-sm text-[var(--color-text-secondary)]">days</span>
                </div>
              </Field>

              <Field label="Required Attributes">
                <div className="flex flex-wrap items-center gap-2">
                  <div className={MODAL_PANEL_SELECT_WIDTH}>
                    <Select
                      options={EXTRACTED_ATTRIBUTE_OPTIONS}
                      value={selectedConfig.requiredAttributes ?? []}
                      onChange={(opts) => {
                        const next = opts.map((o) => o.value);
                        updateSelectedConfig({
                          requiredAttributes: next.length > 0 ? next : undefined,
                        });
                      }}
                      multiple
                      clearable
                      placeholder="Add"
                      size={MODAL_CONTROL_SIZE}
                      variant="outline"
                      block
                      listMinWidth={220}
                      TriggerView={() => (
                        <span className="truncate text-sm text-[var(--color-text)]">
                          {(selectedConfig.requiredAttributes ?? []).length === 0
                            ? "No required attributes"
                            : `${(selectedConfig.requiredAttributes ?? []).length} selected`}
                        </span>
                      )}
                    />
                  </div>

                  {(selectedConfig.requiredAttributes ?? []).map((attr) => {
                    const label =
                      EXTRACTED_ATTRIBUTE_OPTIONS.find((option) => option.value === attr)?.label ?? attr;
                    return (
                      <SelectControl
                        key={attr}
                        variant="soft"
                        size="xs"
                        selected
                        pill
                        dropdownIconType="none"
                        onClearClick={() => removeRequiredAttribute(attr)}
                      >
                        {label}
                      </SelectControl>
                    );
                  })}
                </div>
              </Field>

              <Field label="Accepted Alternatives">
                <div className={MODAL_PANEL_SELECT_WIDTH}>
                  <Select
                    options={availableTypes
                      .filter((type) => type !== selectedIdType)
                      .map((type) => ({ value: type, label: ID_DOC_TYPE_LABELS[type] }))}
                    value={selectedConfig.acceptedAlternatives ?? []}
                    onChange={(opts) => {
                      const next = opts.map((o) => o.value as IdDocType);
                      updateSelectedConfig({
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
              </Field>
            </div>
          )}
        </div>
      </div>

      <ModalFooter>
        <Button color="primary" variant="soft" onClick={() => onOpenChange(false)}>
          Cancel
        </Button>
        <Button
          color="primary"
          onClick={() => {
            onSave(draft);
            onOpenChange(false);
          }}
        >
          Save
        </Button>
      </ModalFooter>
    </Modal>
  );
}
