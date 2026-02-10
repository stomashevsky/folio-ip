interface TopBarProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export function TopBar({ title, description, actions }: TopBarProps) {
  return (
    <div className="flex items-center justify-between px-6 pb-2 pt-6">
      <div>
        <h1 className="text-lg font-semibold text-[var(--color-text)]">
          {title}
        </h1>
        {description && (
          <p className="mt-0.5 text-sm text-[var(--color-text-tertiary)]">
            {description}
          </p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
