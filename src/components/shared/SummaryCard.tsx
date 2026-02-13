interface SummaryCardProps {
  label: string;
  children: React.ReactNode;
}

export function SummaryCard({ label, children }: SummaryCardProps) {
  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
      <span className="text-xs font-medium uppercase tracking-wider text-[var(--color-text-tertiary)]">
        {label}
      </span>
      <div className="mt-2">{children}</div>
    </div>
  );
}
