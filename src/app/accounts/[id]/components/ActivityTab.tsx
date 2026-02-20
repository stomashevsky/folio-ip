"use client";

import { Badge } from "@plexui/ui/components/Badge";
import { InlineEmpty } from "@/components/shared";
import type { TimelineEvent } from "@/lib/types";
import { formatDateTime } from "@/lib/utils/format";

const LEVEL_COLORS: Record<string, "secondary" | "warning" | "success" | "danger"> = {
  info: "secondary",
  warning: "warning",
  success: "success",
  error: "danger",
};

export function ActivityTab({ events }: { events: TimelineEvent[] }) {
  if (events.length === 0) {
    return <InlineEmpty>No activity recorded.</InlineEmpty>;
  }

  return (
    <div className="space-y-0">
      {events.map((event, i) => (
        <div key={event.id} className="relative flex gap-4 pb-6 last:pb-0">
          {i < events.length - 1 && (
            <div className="absolute left-[7px] top-4 h-full w-px bg-[var(--color-border)]" />
          )}
          <div className="relative z-10 mt-1.5 h-[15px] w-[15px] shrink-0 rounded-full border-2 border-[var(--color-border)] bg-[var(--color-surface)]" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-[var(--color-text)]">
                {event.description}
              </p>
              <Badge color={LEVEL_COLORS[event.level] ?? "secondary"} size="sm">
                {event.level}
              </Badge>
            </div>
            {event.actor && (
              <p className="mt-0.5 text-sm text-[var(--color-text-secondary)]">
                by {event.actor}
              </p>
            )}
            <p className="mt-1 text-xs text-[var(--color-text-tertiary)]">
              {formatDateTime(event.timestamp)} UTC
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
