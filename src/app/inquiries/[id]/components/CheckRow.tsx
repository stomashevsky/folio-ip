import { Badge } from "@plexui/ui/components/Badge";
import { Tooltip } from "@plexui/ui/components/Tooltip";
import { InfoCircle } from "@plexui/ui/components/Icon";
import { checkDescriptions } from "@/lib/data/check-descriptions";
import type { Check } from "@/lib/types";

export function CheckRow({ check }: { check: Check }) {
  const desc = checkDescriptions[check.name];
  return (
    <tr className="border-b border-[var(--color-border)] last:border-b-0">
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
      <td className="px-4 py-2.5 text-sm capitalize text-[var(--color-text-secondary)]">
        {check.category.replace(/_/g, " ")}
      </td>
      <td className="px-4 py-2.5 text-center text-sm text-[var(--color-text-tertiary)]">
        {check.required && "✓"}
      </td>
      <td className="px-4 py-2.5">
        {check.status === "passed" ? (
          <Badge color="success" size="sm">Passed</Badge>
        ) : check.status === "failed" ? (
          <Badge color="danger" size="sm">Failed</Badge>
        ) : (
          <Badge color="secondary" size="sm">N/A</Badge>
        )}
      </td>
    </tr>
  );
}
