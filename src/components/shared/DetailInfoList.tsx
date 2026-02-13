interface DetailInfoListProps {
  items: Array<[string, React.ReactNode]>;
  /** Use monospace font for values (default: true) */
  mono?: boolean;
}

export function DetailInfoList({ items, mono = true }: DetailInfoListProps) {
  return (
    <div className="space-y-3">
      {items.map(([label, value]) => (
        <div key={label} className="flex items-start justify-between">
          <span className="text-sm text-[var(--color-text-tertiary)]">
            {label}
          </span>
          <span
            className={`max-w-[60%] text-right text-sm font-medium text-[var(--color-text)]${mono ? " font-mono" : ""}`}
          >
            {value}
          </span>
        </div>
      ))}
    </div>
  );
}
