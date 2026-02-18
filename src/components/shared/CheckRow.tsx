import { Badge } from "@plexui/ui/components/Badge";
import { Tooltip } from "@plexui/ui/components/Tooltip";
import { CheckCircle, InfoCircle } from "@plexui/ui/components/Icon";
import { checkDescriptions } from "@/lib/data/check-descriptions";
import { CHECK_CATEGORY_LABELS, CHECK_CATEGORY_DESCRIPTIONS } from "@/lib/constants/check-category-labels";
import type { Check } from "@/lib/types";

type CheckRowVariant = "name-first" | "status-first";

interface CheckRowProps {
  check: Check;
  /** Column layout variant.
   *  - `"name-first"` (default): Name → Category → Required → Status
   *  - `"status-first"`: Status → Name → Category → Required
   */
  variant?: CheckRowVariant;
}

/* ─── Shared cells ─── */

function NameCell({ check }: { check: Check }) {
  const desc = checkDescriptions[check.name];
  return (
    <td className="px-4 py-2.5 text-sm text-[var(--color-text)]">
      <span className="inline-flex items-center gap-1.5">
        {check.name}
        {desc && (
          <Tooltip content={desc} side="top" maxWidth={260}>
            <span className="inline-flex shrink-0 cursor-help items-center text-[var(--color-text-tertiary)]">
              <InfoCircle style={{ width: 14, height: 14 }} />
            </span>
          </Tooltip>
        )}
      </span>
    </td>
  );
}

function CategoryCell({ check }: { check: Check }) {
  return (
    <td className="w-[190px] px-4 py-2.5 text-sm text-[var(--color-text-secondary)]">
      <Tooltip content={CHECK_CATEGORY_DESCRIPTIONS[check.category]} side="top" maxWidth={280}>
        <span className="cursor-help border-b border-dashed border-[var(--color-border)]">
          {CHECK_CATEGORY_LABELS[check.category]}
        </span>
      </Tooltip>
    </td>
  );
}

function StatusCell({ check }: { check: Check }) {
  return (
    <td className="w-[100px] px-4 py-2.5">
      {check.status === "passed" ? (
        <Badge color="success" size="sm">Passed</Badge>
      ) : check.status === "failed" ? (
        <Badge color="danger" size="sm">Failed</Badge>
      ) : (
        <Badge color="secondary" size="sm">N/A</Badge>
      )}
    </td>
  );
}

/* ─── Variant-specific required cells ─── */

function RequiredCellText({ check }: { check: Check }) {
  return (
    <td className="w-[80px] px-4 py-2.5 text-center text-sm text-[var(--color-text-tertiary)]">
      {check.required && "✓"}
    </td>
  );
}

function RequiredCellIcon({ check }: { check: Check }) {
  return (
    <td className="w-[80px] px-4 py-2.5 text-center">
      {check.required && (
        <CheckCircle className="mx-auto h-4 w-4 text-[var(--color-text-tertiary)]" />
      )}
    </td>
  );
}

/* ─── Table header helpers ─── */

export const CHECK_TABLE_HEADERS: Record<CheckRowVariant, { label: string; align?: "center" | "left"; width?: string }[]> = {
  "name-first": [
    { label: "Check name", width: "w-2/5" },
    { label: "Type", width: "w-[190px]" },
    { label: "Required", width: "w-[80px]", align: "center" },
    { label: "Status", width: "w-[100px]" },
  ],
  "status-first": [
    { label: "Status", width: "w-[100px]" },
    { label: "Check name", width: "w-2/5" },
    { label: "Type", width: "w-[190px]" },
    { label: "Required", width: "w-[80px]", align: "center" },
  ],
};

/* ─── Component ─── */

export function CheckRow({ check, variant = "name-first" }: CheckRowProps) {
  return (
    <tr className="border-b border-[var(--color-border)] last:border-b-0">
      {variant === "name-first" ? (
        <>
          <NameCell check={check} />
          <CategoryCell check={check} />
          <RequiredCellText check={check} />
          <StatusCell check={check} />
        </>
      ) : (
        <>
          <StatusCell check={check} />
          <NameCell check={check} />
          <CategoryCell check={check} />
          <RequiredCellIcon check={check} />
        </>
      )}
    </tr>
  );
}
