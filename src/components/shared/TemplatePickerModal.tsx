"use client";

import { useState } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "./Modal";
import { Button } from "@plexui/ui/components/Button";

interface TemplatePresetOption {
  id: string;
  name: string;
  description: string;
  icon?: React.ReactNode;
}

interface TemplatePickerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  presets: TemplatePresetOption[];
  onSelect: (presetId: string) => void;
  /** When provided, enables two-panel layout with preview on the right */
  renderPreview?: (presetId: string) => React.ReactNode;
  /** "list" (default) = vertical list, "grid" = 2-column card grid */
  layout?: "list" | "grid";
}

export function TemplatePickerModal({
  open,
  onOpenChange,
  title,
  presets,
  onSelect,
  renderPreview,
  layout = "list",
}: TemplatePickerModalProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [prevOpen, setPrevOpen] = useState(open);

  if (open && !prevOpen) {
    setSelectedId(renderPreview ? presets[0]?.id ?? null : null);
  }
  if (open !== prevOpen) {
    setPrevOpen(open);
  }

  function handleSelect(id: string) {
    onSelect(id);
    onOpenChange(false);
  }

  const hasPreview = !!renderPreview;
  const isGrid = layout === "grid" && !hasPreview;

  const modalWidth = hasPreview ? "max-w-3xl" : "max-w-lg";

  if (isGrid) {
    return (
      <Modal open={open} onOpenChange={onOpenChange} maxWidth={modalWidth}>
        <ModalHeader onClose={() => onOpenChange(false)}>
          <h2 className="heading-md">{title}</h2>
        </ModalHeader>

        <div className="px-5 pb-5">
          <div className="grid grid-cols-2 gap-1.5 max-h-[32rem] overflow-y-auto">
            {presets.map((preset) => (
              <button
                key={preset.id}
                type="button"
                aria-label={`Select ${preset.name} template`}
                onClick={() => handleSelect(preset.id)}
                className="flex h-full cursor-pointer flex-col items-start rounded-[10px] border border-[var(--color-border)] px-3 py-2.5 text-left transition-colors hover:bg-[var(--color-nav-hover-bg)] focus-visible:outline-2 focus-visible:outline-[var(--color-background-primary-solid)]"
              >
                {preset.icon && (
                  <span className="mb-1.5 flex h-6 w-6 items-center justify-center text-[var(--color-text-secondary)]" aria-hidden>
                    {preset.icon}
                  </span>
                )}
                <p className="text-sm font-medium text-[var(--color-text)]">
                  {preset.name}
                </p>
                <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                  {preset.description}
                </p>
              </button>
            ))}
          </div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange} maxWidth={modalWidth}>
      <ModalHeader>
        <h2 className="heading-md">{title}</h2>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">
          Choose a template to get started with pre-configured defaults.
        </p>
      </ModalHeader>

      <ModalBody>
        <div className={hasPreview ? "flex gap-4" : ""}>
          <div className={`flex flex-col gap-2 max-h-80 overflow-y-auto ${hasPreview ? "w-56 shrink-0" : ""}`}>
            {presets.map((preset) => {
              const isActive = hasPreview && selectedId === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  aria-label={`Select ${preset.name} template`}
                  onClick={() => hasPreview ? setSelectedId(preset.id) : handleSelect(preset.id)}
                  onDoubleClick={() => hasPreview && handleSelect(preset.id)}
                  className={`cursor-pointer rounded-lg border px-4 py-3 text-left transition-colors focus-visible:outline-2 focus-visible:outline-[var(--color-background-primary-solid)] ${
                    isActive
                      ? "border-[var(--color-background-primary-solid)] bg-[var(--color-background-primary-soft)]"
                      : "border-[var(--color-border)] hover:bg-[var(--color-nav-hover-bg)]"
                  }`}
                >
                  <p className="heading-xs text-[var(--color-text)]">
                    {preset.name}
                  </p>
                  {!hasPreview && (
                    <p className="text-sm text-[var(--color-text-secondary)] mt-0.5">
                      {preset.description}
                    </p>
                  )}
                </button>
              );
            })}
          </div>

          {hasPreview && selectedId && (
            <div className="flex-1 min-w-0 overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-secondary)]">
              <div className="max-h-80 overflow-y-auto p-4">
                {renderPreview(selectedId)}
              </div>
            </div>
          )}
        </div>
      </ModalBody>

      <ModalFooter>
        <Button
          color="secondary"
          variant="outline"
          size="sm"
          pill={false}
          onClick={() => onOpenChange(false)}
        >
          Cancel
        </Button>
        {hasPreview && selectedId && (
          <Button
            color="primary"
            size="sm"
            pill={false}
            onClick={() => handleSelect(selectedId)}
          >
            Use template
          </Button>
        )}
      </ModalFooter>
    </Modal>
  );
}
