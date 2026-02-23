"use client";

import { useCallback, useMemo, useState } from "react";
import { Button } from "@plexui/ui/components/Button";
import { Menu } from "@plexui/ui/components/Menu";
import { SegmentedControl } from "@plexui/ui/components/SegmentedControl";
import { ChevronDownSm } from "@plexui/ui/components/Icon";
import { SettingsModal } from "@/components/shared";
import type { AttributeMatchRequirement } from "@/lib/types";
import { CHECK_PRESETS } from "./check-presets";
import { JsonEditor } from "./JsonEditor";
import { CheckChat } from "./CheckChat";

interface CheckCodeEditorProps {
  requirements: AttributeMatchRequirement[];
  onChange: (reqs: AttributeMatchRequirement[]) => void;
  defaultOpen?: boolean;
  onClose?: () => void;
}

type EditorPanel = "code" | "ai";

function formatRequirements(requirements: AttributeMatchRequirement[]): string {
  return JSON.stringify(requirements, null, 2);
}

function parseRequirementsJson(raw: string): { ok: true; value: AttributeMatchRequirement[] } | { ok: false; error: string } {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid JSON";
    return { ok: false, error: `Invalid JSON: ${message}` };
  }

  if (!Array.isArray(parsed)) {
    return { ok: false, error: "Match requirements must be a JSON array." };
  }

  for (let i = 0; i < parsed.length; i += 1) {
    const item = parsed[i];
    if (!item || typeof item !== "object") {
      return { ok: false, error: `Item ${i + 1} must be an object.` };
    }
    const record = item as Record<string, unknown>;
    if (!("attribute" in record)) {
      return { ok: false, error: `Item ${i + 1} is missing \"attribute\".` };
    }
    if (!("normalization" in record) || !Array.isArray(record.normalization)) {
      return { ok: false, error: `Item ${i + 1} is missing \"normalization\" array.` };
    }
    if (!("comparison" in record) || !record.comparison || typeof record.comparison !== "object") {
      return { ok: false, error: `Item ${i + 1} is missing \"comparison\" object.` };
    }
  }

  return { ok: true, value: parsed as AttributeMatchRequirement[] };
}

export function CheckCodeEditor({ requirements, onChange, defaultOpen = false, onClose }: CheckCodeEditorProps) {
  const [open, setOpen] = useState(defaultOpen);
  const [panel, setPanel] = useState<EditorPanel>("code");
  const [draftJson, setDraftJson] = useState(() => formatRequirements(requirements));
  const [error, setError] = useState<string | null>(null);
  const requirementsCount = requirements.length;
  const triggerLabel = requirementsCount > 0 ? `Edit match logic (${requirementsCount})` : "Add match logic";
  const openEditor = useCallback(() => {
    setDraftJson(formatRequirements(requirements));
    setError(null);
    setPanel("code");
    setOpen(true);
  }, [requirements]);
  const closeEditor = useCallback(() => {
    setOpen(false);
    setError(null);
    onClose?.();
  }, [onClose]);

  const handleSave = useCallback(() => {
    const parsed = parseRequirementsJson(draftJson);
    if (!parsed.ok) {
      setError(parsed.error);
      return;
    }
    onChange(parsed.value);
    setOpen(false);
    setError(null);
  }, [draftJson, onChange]);

  const handlePresetSelect = useCallback((presetRequirements: AttributeMatchRequirement[]) => {
    setDraftJson(formatRequirements(presetRequirements));
    setError(null);
    setPanel("code");
  }, []);

  const handleApplyJson = useCallback((nextJson: string): { ok: true } | { ok: false; error: string } => {
    const parsed = parseRequirementsJson(nextJson);
    if (!parsed.ok) return { ok: false, error: parsed.error };
    setDraftJson(formatRequirements(parsed.value));
    setPanel("code");
    setError(null);
    return { ok: true };
  }, []);

  const footer = useMemo(() => (
    <>
      <Button color="primary" variant="soft" size="md" pill={false} onClick={closeEditor}>
        Cancel
      </Button>
      <Button color="primary" size="md" pill={false} onClick={handleSave}>
        Save
      </Button>
    </>
  ), [closeEditor, handleSave]);

  return (
    <>
      {!defaultOpen && (
        <Button color="secondary" variant="outline" size="sm" pill={false} onClick={openEditor}>
          {triggerLabel}
        </Button>
      )}

      <SettingsModal
        open={open}
        onOpenChange={(v) => { setOpen(v); if (!v) onClose?.(); }}
        title="Match requirements"
        description="Edit comparison logic as JSON or ask AI to generate updates."
        maxWidth="max-w-4xl"
        footer={footer}
      >
        <div className="flex items-center justify-between gap-2">
          <SegmentedControl aria-label="Editor panel" value={panel} onChange={(value) => setPanel(value as EditorPanel)} size="xs" pill={false}>
            <SegmentedControl.Tab value="code">Code</SegmentedControl.Tab>
            <SegmentedControl.Tab value="ai">AI</SegmentedControl.Tab>
          </SegmentedControl>

          <Menu>
            <Menu.Trigger asChild>
              <Button color="secondary" variant="outline" size="sm" pill={false}>
                Presets
                <ChevronDownSm />
              </Button>
            </Menu.Trigger>
            <Menu.Content align="end" minWidth={280}>
              {CHECK_PRESETS.map((preset) => (
                <Menu.Item key={preset.label} onSelect={() => handlePresetSelect(preset.requirements)}>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm text-[var(--color-text)]">{preset.label}</span>
                    <span className="text-xs text-[var(--color-text-secondary)]">{preset.description}</span>
                  </div>
                </Menu.Item>
              ))}
            </Menu.Content>
          </Menu>
        </div>

        <div className="mt-3 h-[480px] overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]">
          {panel === "code" ? (
            <JsonEditor value={draftJson} onChange={setDraftJson} />
          ) : (
            <CheckChat currentJson={draftJson} onApplyJson={handleApplyJson} />
          )}
        </div>

        {error && (
          <div className="mt-3 rounded-md bg-[var(--color-background-danger-soft)] px-3 py-2 text-sm text-[var(--color-text-danger-ghost)]">
            {error}
          </div>
        )}
      </SettingsModal>
    </>
  );
}
