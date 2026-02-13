import { StatusBadge } from "./StatusBadge";

interface EntityCardProps {
  title: string;
  subtitle: string;
  status: string;
  onClick: () => void;
  titleClassName?: string;
}

export function EntityCard({
  title,
  subtitle,
  status,
  onClick,
  titleClassName,
}: EntityCardProps) {
  return (
    <div
      className="flex cursor-pointer items-center justify-between rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4 transition-colors hover:bg-[var(--color-surface-secondary)]"
      onClick={onClick}
    >
      <div>
        <p className={`text-sm font-medium text-[var(--color-text)]${titleClassName ? ` ${titleClassName}` : ""}`}>
          {title}
        </p>
        <p className="font-mono text-xs text-[var(--color-text-tertiary)]">
          {subtitle}
        </p>
      </div>
      <StatusBadge status={status} />
    </div>
  );
}
