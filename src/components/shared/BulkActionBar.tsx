"use client";

import { CloseBold } from "@plexui/ui/components/Icon";

interface BulkActionBarProps {
  selectedCount: number;
  onClearSelection: () => void;
  children: React.ReactNode;
}

export function BulkActionBar({
  selectedCount,
  onClearSelection,
  children,
}: BulkActionBarProps) {
  return (
    <div className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-full bg-[var(--color-surface-inverse)] px-4 py-2 shadow-300">
      <span className="text-sm text-[var(--color-text-inverse)]">
        {selectedCount} selected
      </span>
      <button
        type="button"
        className="rounded-full p-0.5 text-[var(--color-text-inverse)] opacity-60 transition-opacity hover:opacity-100"
        onClick={onClearSelection}
      >
        <CloseBold style={{ width: 14, height: 14 }} />
      </button>
      <div className="h-5 w-px bg-[var(--color-text-inverse)] opacity-20" />
      <div className="flex items-center gap-2">{children}</div>
    </div>
  );
}
