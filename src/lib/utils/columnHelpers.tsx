import type { CellContext } from "@tanstack/react-table";
import { Tooltip } from "@plexui/ui/components/Tooltip";
import { formatDateTime } from "./format";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { CopyButton } from "@/components/shared/CopyButton";

/** Renders a monospace ID cell with copy-on-hover */
export function idCell<T>(accessor: (row: T) => string) {
  function IdCell({ row }: CellContext<T, unknown>) {
    const value = accessor(row.original);
    return (
      <span className="inline-flex items-center gap-1 font-mono text-[var(--color-text-secondary)]">
        {value}
        <CopyButton value={value} className="opacity-0 transition-opacity group-hover/row:opacity-100" />
      </span>
    );
  }
  IdCell.displayName = "IdCell";
  return IdCell;
}

/** Renders a formatted datetime cell */
export function dateTimeCell<T>(
  accessor: (row: T) => string | null | undefined,
) {
  function DateTimeCell({ row }: CellContext<T, unknown>) {
    const val = accessor(row.original);
    return (
      <span className="text-[var(--color-text-secondary)]">
        {val ? formatDateTime(val) : "—"}
      </span>
    );
  }
  DateTimeCell.displayName = "DateTimeCell";
  return DateTimeCell;
}

export function tooltipHeader(label: string, description: string) {
  function TooltipHeader() {
    return (
      <Tooltip content={description} side="bottom" maxWidth={260}>
        <span className="cursor-help border-b border-dashed border-current">
          {label}
        </span>
      </Tooltip>
    );
  }
  TooltipHeader.displayName = "TooltipHeader";
  return TooltipHeader;
}


export function statusCell<T>(accessor: (row: T) => string) {
  function StatusCell({ row }: CellContext<T, unknown>) {
    return <StatusBadge status={accessor(row.original)} />;
  }
  StatusCell.displayName = "StatusCell";
  return StatusCell;
}
