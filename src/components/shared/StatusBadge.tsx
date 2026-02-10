import { Badge } from "@plexui/ui/components/Badge";
import { getStatusColor } from "@/lib/utils/format";
import type { ComponentProps } from "react";

type BadgeColor = ComponentProps<typeof Badge>["color"];

interface StatusBadgeProps {
  status: string;
  label?: string;
}

export function StatusBadge({ status, label }: StatusBadgeProps) {
  const color = getStatusColor(status) as BadgeColor;
  const displayLabel = label ?? status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <Badge color={color} variant="soft">
      {displayLabel}
    </Badge>
  );
}
