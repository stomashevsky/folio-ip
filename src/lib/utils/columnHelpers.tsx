import type { CellContext } from "@tanstack/react-table";
import { formatDateTime } from "./format";
import { StatusBadge } from "@/components/shared/StatusBadge";

/** Renders a monospace ID cell */
export function idCell<T>(accessor: (row: T) => string) {
  return ({ row }: CellContext<T, unknown>) => (
    <span className="font-mono text-[var(--color-text-secondary)]">
      {accessor(row.original)}
    </span>
  );
}

/** Renders a formatted datetime cell */
export function dateTimeCell<T>(
  accessor: (row: T) => string | null | undefined,
) {
  return ({ row }: CellContext<T, unknown>) => {
    const val = accessor(row.original);
    return (
      <span className="text-[var(--color-text-secondary)]">
        {val ? formatDateTime(val) : "—"}
      </span>
    );
  };
}

/** Renders a StatusBadge cell */
export function statusCell<T>(accessor: (row: T) => string) {
  return ({ row }: CellContext<T, unknown>) => (
    <StatusBadge status={accessor(row.original)} />
  );
}
