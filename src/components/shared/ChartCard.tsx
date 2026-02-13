interface ChartCardProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function ChartCard({
  title,
  description,
  actions,
  children,
  className = "",
}: ChartCardProps) {
  return (
    <div
      className={`rounded-xl border border-[var(--color-border)] p-4 ${className}`}
    >
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h3 className="heading-sm text-[var(--color-text)]">
            {title}
          </h3>
          {description && (
            <p className="mt-0.5 text-sm text-[var(--color-text-tertiary)]">
              {description}
            </p>
          )}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
      {children}
    </div>
  );
}
