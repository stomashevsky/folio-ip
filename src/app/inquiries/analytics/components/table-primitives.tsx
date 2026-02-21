import { ArrowUpSm, ArrowDownSm, Sort } from "@plexui/ui/components/Icon";

export type SortDir = "asc" | "desc";

const SORT_ICON_SIZE = { width: 16, height: 16 } as const;

const TH_BASE =
  "group cursor-pointer select-none px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.5px] text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)]";

export function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
  if (!active)
    return <Sort style={SORT_ICON_SIZE} className="opacity-40" />;
  return dir === "asc" ? (
    <ArrowUpSm style={SORT_ICON_SIZE} />
  ) : (
    <ArrowDownSm style={SORT_ICON_SIZE} />
  );
}

export function SortableTh({
  children,
  onClick,
  align = "left",
  sortIcon,
}: {
  children: React.ReactNode;
  onClick: () => void;
  align?: "left" | "right";
  sortIcon: React.ReactNode;
}) {
  return (
    <th
      className={`${TH_BASE} ${align === "right" ? "text-right" : "text-left"}`}
      onClick={onClick}
    >
      <span className="inline-flex items-center gap-1">
        {children}
        <span className="ml-0.5">{sortIcon}</span>
      </span>
    </th>
  );
}

export function TrendIndicator({
  value,
  invert = false,
}: {
  value: number;
  invert?: boolean;
}) {
  if (value === 0)
    return <span className="text-2xs text-[var(--color-text-tertiary)]">0%</span>;
  const isGood = invert ? value < 0 : value > 0;
  const color = isGood ? "var(--color-text-success-soft)" : "var(--color-text-danger-soft)";
  const sign = value > 0 ? "+" : "";
  return (
    <span className="text-2xs font-semibold" style={{ color }}>
      {sign}{value.toFixed(1)}%
    </span>
  );
}
