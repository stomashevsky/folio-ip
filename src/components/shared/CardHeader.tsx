import { formatDateTime } from "@/lib/utils/format";

interface CardHeaderProps {
  title: string;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  startedAt?: string;
  endedAt?: string;
  duration?: number | null;
}

export function CardHeader({
  title,
  icon,
  badge,
  startedAt,
  endedAt,
  duration,
}: CardHeaderProps) {
  const subtitle = startedAt
    ? [
        formatDateTime(startedAt),
        endedAt ? `– ${formatDateTime(endedAt)}` : null,
        duration != null ? `· ${duration}s` : null,
      ]
        .filter(Boolean)
        .join(" ")
    : null;

  return (
    <div className="border-b border-[var(--color-border)] bg-[var(--color-surface-secondary)] px-4 py-3">
      <div className="flex items-center justify-between">
        <span className="heading-xs inline-flex items-center gap-2 text-[var(--color-text)]">
          {icon && (
            <span className="text-[var(--color-text-tertiary)]">{icon}</span>
          )}
          {title}
        </span>
        {badge}
      </div>
      {subtitle && (
        <p className="mt-0.5 text-xs text-[var(--color-text-tertiary)]">
          {subtitle}
        </p>
      )}
    </div>
  );
}
