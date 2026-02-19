"use client";

import { useState, useCallback } from "react";
import { ChevronDownMd, ChevronUpMd } from "@plexui/ui/components/Icon";
import { ELK_OPTION_DEFS, type ElkLayoutOverrides, type ElkOptionKey } from "@/lib/utils/flow-layout";

const PORT_CONSTRAINT_OPTIONS = ["FIXED_SIDE", "FIXED_ORDER", "FIXED_POS", "FREE"] as const;
const PORT_SIDE_OPTIONS = ["SOUTH", "WEST", "EAST", "NORTH"] as const;

/* Which keys belong to which section */
const SPACING_KEYS: ElkOptionKey[] = [
  "elk.spacing.nodeNode",
  "elk.spacing.edgeEdge",
  "elk.spacing.edgeNode",
  "elk.layered.spacing.nodeNodeBetweenLayers",
  "elk.layered.spacing.edgeNodeBetweenLayers",
  "elk.layered.spacing.edgeEdgeBetweenLayers",
];

const ALGORITHM_KEYS: ElkOptionKey[] = [
  "elk.layered.nodePlacement.strategy",
  "elk.layered.crossingMinimization.strategy",
  "elk.layered.crossingMinimization.greedySwitch.type",
  "elk.edgeRouting",
  "elk.layered.mergeEdges",
  "elk.layered.thoroughness",
];

const LABEL_SELECT_KEYS: ElkOptionKey[] = [
  "elk.edgeLabels.inline",
  "elk.edgeLabels.placement",
  "elk.layered.edgeLabels.sideSelection",
  "elk.layered.edgeLabels.centerLabelPlacementStrategy",
];

const LABEL_SPACING_KEYS: ElkOptionKey[] = [
  "elk.spacing.edgeLabel",
  "elk.spacing.labelLabel",
  "elk.spacing.labelNode",
];

interface ElkSettingsPanelProps {
  overrides: ElkLayoutOverrides;
  portConstraint: string;
  sourceLeftSide: string;
  sourceRightSide: string;
  useElkLabelPositions: boolean;
  onOverridesChange: (overrides: ElkLayoutOverrides) => void;
  onPortConstraintChange: (value: string) => void;
  onSourceLeftSideChange: (value: string) => void;
  onSourceRightSideChange: (value: string) => void;
  onUseElkLabelPositionsChange: (value: boolean) => void;
}

export function ElkSettingsPanel({
  overrides,
  portConstraint,
  sourceLeftSide,
  sourceRightSide,
  useElkLabelPositions,
  onOverridesChange,
  onPortConstraintChange,
  onSourceLeftSideChange,
  onSourceRightSideChange,
  onUseElkLabelPositionsChange,
}: ElkSettingsPanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  const getValue = useCallback(
    (key: ElkOptionKey) => {
      return overrides[key] ?? ELK_OPTION_DEFS[key].default;
    },
    [overrides],
  );

  const handleChange = useCallback(
    (key: string, value: string) => {
      const next = { ...overrides, [key]: value };
      const def = ELK_OPTION_DEFS[key as ElkOptionKey];
      if (def && value === def.default) {
        delete next[key];
      }
      onOverridesChange(next);
    },
    [overrides, onOverridesChange],
  );

  const handleReset = useCallback(() => {
    onOverridesChange({});
    onPortConstraintChange("FIXED_SIDE");
    onSourceLeftSideChange("EAST");
    onSourceRightSideChange("EAST");
    onUseElkLabelPositionsChange(true);
  }, [onOverridesChange, onPortConstraintChange, onSourceLeftSideChange, onSourceRightSideChange, onUseElkLabelPositionsChange]);

  const hasChanges =
    Object.keys(overrides).length > 0 ||
    portConstraint !== "FIXED_SIDE" ||
    sourceLeftSide !== "EAST" ||
    sourceRightSide !== "EAST" ||
    useElkLabelPositions !== true;

  return (
    <div className="absolute left-3 top-3 z-20" style={{ maxWidth: 340 }}>
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className="flex items-center gap-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-2.5 py-1.5 text-xs text-[var(--color-text-secondary)] shadow-sm transition-colors hover:bg-[var(--color-background-secondary-alt)]"
      >
        ELK Settings
        {hasChanges && (
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-background-primary-solid)]" />
        )}
        {isOpen ? (
          <ChevronUpMd className="h-3.5 w-3.5" />
        ) : (
          <ChevronDownMd className="h-3.5 w-3.5" />
        )}
      </button>

      {isOpen && (
        <div className="mt-1.5 max-h-[70vh] overflow-y-auto rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-3 shadow-lg">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-medium text-[var(--color-text)]">Layout Options</span>
            {hasChanges && (
              <button
                type="button"
                onClick={handleReset}
                className="text-xs text-[var(--color-text-tertiary)] underline hover:text-[var(--color-text-secondary)]"
              >
                Reset
              </button>
            )}
          </div>

          <div className="space-y-2.5">
            {/* Ports */}
            <Section title="Ports">
              <OptionRow label="Port constraint">
                <select
                  value={portConstraint}
                  onChange={(e) => onPortConstraintChange(e.target.value)}
                  className="elk-select"
                >
                  {PORT_CONSTRAINT_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </OptionRow>
              <OptionRow label="Fail port (left)">
                <select
                  value={sourceLeftSide}
                  onChange={(e) => onSourceLeftSideChange(e.target.value)}
                  className="elk-select"
                >
                  {PORT_SIDE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </OptionRow>
              <OptionRow label="Alt port (right)">
                <select
                  value={sourceRightSide}
                  onChange={(e) => onSourceRightSideChange(e.target.value)}
                  className="elk-select"
                >
                  {PORT_SIDE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </OptionRow>
            </Section>

            {/* Spacing */}
            <Section title="Spacing">
              {renderSliders(SPACING_KEYS, getValue, handleChange)}
            </Section>

            {/* Algorithm */}
            <Section title="Algorithm">
              {renderSelects(ALGORITHM_KEYS, getValue, handleChange)}
            </Section>

            {/* Labels */}
            <Section title="Labels" noBorder>
              <OptionRow label="Use ELK positions">
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    checked={useElkLabelPositions}
                    onChange={(e) => onUseElkLabelPositionsChange(e.target.checked)}
                    className="elk-checkbox"
                  />
                  <span className="text-xs text-[var(--color-text-secondary)]">
                    {useElkLabelPositions ? "ELK computed" : "On edge line"}
                  </span>
                </label>
              </OptionRow>
              {renderSelects(LABEL_SELECT_KEYS, getValue, handleChange)}
              {renderSliders(LABEL_SPACING_KEYS, getValue, handleChange)}
            </Section>
          </div>
        </div>
      )}

      <style>{`
        .elk-select {
          width: 100%;
          padding: 3px 6px;
          border: 1px solid var(--color-border);
          border-radius: 6px;
          background: var(--color-surface);
          color: var(--color-text);
          font-size: 11px;
          outline: none;
          cursor: pointer;
        }
        .elk-select:focus {
          border-color: var(--color-text-tertiary);
        }
        .elk-range {
          flex: 1;
          height: 4px;
          accent-color: var(--color-text);
          cursor: pointer;
        }
        .elk-checkbox {
          accent-color: var(--color-text);
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}

/* ---- helpers ---- */

function Section({
  title,
  noBorder,
  children,
}: {
  title: string;
  noBorder?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={noBorder ? "" : "border-b border-[var(--color-border)] pb-2.5"}>
      <div className="mb-1.5 text-[10px] font-medium uppercase tracking-wider text-[var(--color-text-tertiary)]">
        {title}
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function OptionRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[120px_1fr] items-center gap-2">
      <span className="truncate text-xs text-[var(--color-text-tertiary)]">{label}</span>
      {children}
    </div>
  );
}

function renderSliders(
  keys: ElkOptionKey[],
  getValue: (key: ElkOptionKey) => string,
  handleChange: (key: string, value: string) => void,
) {
  return keys.map((key) => {
    const def = ELK_OPTION_DEFS[key];
    if (!("min" in def)) return null;
    const numDef = def as { min: number; max: number; step: number; default: string; label: string };
    const numValue = Number(getValue(key));
    return (
      <OptionRow key={key} label={numDef.label}>
        <div className="flex items-center gap-2">
          <input
            type="range"
            min={numDef.min}
            max={numDef.max}
            step={numDef.step}
            value={numValue}
            onChange={(e) => handleChange(key, e.target.value)}
            className="elk-range"
          />
          <span className="w-8 text-right tabular-nums text-xs text-[var(--color-text-secondary)]">
            {numValue}
          </span>
        </div>
      </OptionRow>
    );
  });
}

function renderSelects(
  keys: ElkOptionKey[],
  getValue: (key: ElkOptionKey) => string,
  handleChange: (key: string, value: string) => void,
) {
  return keys.map((key) => {
    const def = ELK_OPTION_DEFS[key];
    if (!("options" in def)) return null;
    const selectDef = def as { label: string; options: readonly string[]; default: string };
    return (
      <OptionRow key={key} label={selectDef.label}>
        <select
          value={getValue(key)}
          onChange={(e) => handleChange(key, e.target.value)}
          className="elk-select"
        >
          {selectDef.options.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </OptionRow>
    );
  });
}
