"use client";

import { Switch } from "@plexui/ui/components/Switch";

interface ToggleSettingProps {
  /** Bold heading above the switch */
  title?: string;
  /** Description text below the heading */
  description?: string;
  /** Label text next to the switch — defaults to title when title is present */
  switchLabel?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}
export function ToggleSetting({
  title,
  description,
  switchLabel,
  checked,
  onCheckedChange,
}: ToggleSettingProps) {
  if (!title) {
    return <Switch label={switchLabel} checked={checked} onCheckedChange={onCheckedChange} />;
  }
  return (
    <div>
      <p className="text-sm font-semibold">{title}</p>
      {description && (
        <p className="mt-1 text-xs text-[var(--color-text-secondary)]">{description}</p>
      )}
      <div className="mt-2">
        <Switch label={switchLabel ?? title} checked={checked} onCheckedChange={onCheckedChange} />
      </div>
    </div>
  );
}
