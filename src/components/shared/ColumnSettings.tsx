"use client";

import { useState } from "react";
import type { VisibilityState } from "@tanstack/react-table";
import { Popover } from "@plexui/ui/components/Popover";
import { Switch } from "@plexui/ui/components/Switch";
import { Input } from "@plexui/ui/components/Input";
import { Button } from "@plexui/ui/components/Button";
import { SettingsSlider, Search } from "@plexui/ui/components/Icon";
import { TOPBAR_CONTROL_SIZE, TOPBAR_ACTION_PILL } from "@/components/layout/TopBar";
import type { ControlSize } from "@plexui/ui/types";

export interface ColumnConfig {
  id: string;
  label: string;
}

interface ColumnSettingsProps {
  columns: ColumnConfig[];
  visibility: VisibilityState;
  onVisibilityChange: (visibility: VisibilityState) => void;
  size?: ControlSize;
}

function ColumnRow({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <div className="column-settings-row" onClick={onChange}>
      <span className={checked ? "text-[var(--color-text)]" : "text-[var(--color-text-secondary)]"}>
        {label}
      </span>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}

export function ColumnSettings({
  columns,
  visibility,
  onVisibilityChange,
  size = TOPBAR_CONTROL_SIZE,
}: ColumnSettingsProps) {
  const [search, setSearch] = useState("");

  const filtered = columns.filter((col) =>
    col.label.toLowerCase().includes(search.toLowerCase()),
  );

  const shown = filtered.filter((col) => visibility[col.id] !== false);
  const hidden = filtered.filter((col) => visibility[col.id] === false);

  function toggle(id: string) {
    onVisibilityChange({
      ...visibility,
      [id]: visibility[id] === false,
    });
  }

  return (
    <Popover>
      <Popover.Trigger>
        <Button
          color="secondary"
          variant="outline"
          size={size}
          pill={TOPBAR_ACTION_PILL}
        >
          <SettingsSlider />
          <span className="hidden md:inline">Columns</span>
        </Button>
      </Popover.Trigger>
      <Popover.Content align="end" width={280} minWidth={280}>
        <div className="column-settings-search">
          <Input
            placeholder="Search columns..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onClear={search ? () => setSearch("") : undefined}
            startAdornment={<Search />}
            size="sm"
          />
        </div>

        <div className="column-settings-list">
          {shown.length > 0 && (
            <div>
              <p className="column-settings-group-heading">Shown attributes</p>
              {shown.map((col) => (
                <ColumnRow key={col.id} label={col.label} checked={true} onChange={() => toggle(col.id)} />
              ))}
            </div>
          )}
          {hidden.length > 0 && (
            <div>
              <p className="column-settings-group-heading">Hidden attributes</p>
              {hidden.map((col) => (
                <ColumnRow key={col.id} label={col.label} checked={false} onChange={() => toggle(col.id)} />
              ))}
            </div>
          )}
        </div>
      </Popover.Content>
    </Popover>
  );
}
