interface TopBarProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  toolbar?: React.ReactNode;
}

export function TopBar({ title, actions, toolbar }: TopBarProps) {
  const hasToolbar = !!toolbar;

  return (
    <div className="sticky top-0 z-10 shrink-0 border-b border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-4">
      {/* Row 1: title + actions (when no toolbar) */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-[var(--color-text)]">
          {title}
        </h1>
        {!hasToolbar && actions && (
          <div className="flex items-center gap-2">{actions}</div>
        )}
      </div>

      {/* Row 2: toolbar (search left) + actions (right) */}
      {hasToolbar && (
        <div className="mt-3 flex items-center justify-between gap-3">
          <div className="flex min-w-0 flex-1 items-center gap-2">
            {toolbar}
          </div>
          {actions && (
            <div className="flex items-center gap-2">{actions}</div>
          )}
        </div>
      )}
    </div>
  );
}
