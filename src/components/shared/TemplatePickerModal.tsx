"use client";

import { Modal, ModalHeader, ModalBody, ModalFooter } from "./Modal";
import { Button } from "@plexui/ui/components/Button";

interface TemplatePresetOption {
  id: string;
  name: string;
  description: string;
}

interface TemplatePickerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  presets: TemplatePresetOption[];
  onSelect: (presetId: string) => void;
}

export function TemplatePickerModal({
  open,
  onOpenChange,
  title,
  presets,
  onSelect,
}: TemplatePickerModalProps) {
  function handleSelect(id: string) {
    onSelect(id);
    onOpenChange(false);
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange} maxWidth="max-w-lg">
      <ModalHeader>
        <h2 className="heading-md">{title}</h2>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">
          Choose a template to get started with pre-configured defaults.
        </p>
      </ModalHeader>

      <ModalBody>
        <div className="flex flex-col gap-2 max-h-80 overflow-y-auto">
          {presets.map((preset) => (
            <button
              key={preset.id}
              type="button"
              aria-label={`Select ${preset.name} template`}
              onClick={() => handleSelect(preset.id)}
              className="cursor-pointer rounded-lg border border-[var(--color-border)] px-4 py-3 text-left transition-colors hover:bg-[var(--color-nav-hover-bg)] focus-visible:outline-2 focus-visible:outline-[var(--color-background-primary-solid)]"
            >
              <p className="heading-xs text-[var(--color-text)]">
                {preset.name}
              </p>
              <p className="text-sm text-[var(--color-text-secondary)] mt-0.5">
                {preset.description}
              </p>
            </button>
          ))}
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
      </ModalFooter>
    </Modal>
  );
}
