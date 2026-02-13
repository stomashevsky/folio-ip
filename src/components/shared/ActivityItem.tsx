interface ActivityItemProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}

export function ActivityItem({ icon, title, subtitle }: ActivityItemProps) {
  return (
    <div className="flex items-center gap-3 rounded-lg bg-[var(--color-surface-secondary)] p-3">
      <span className="text-[var(--color-text-tertiary)]">{icon}</span>
      <div className="flex-1">
        <p className="text-sm font-medium text-[var(--color-text)]">{title}</p>
        <p className="text-xs text-[var(--color-text-tertiary)]">{subtitle}</p>
      </div>
    </div>
  );
}
