"use client";

import type { TimelineEvent, TimelineEventLevel } from "@/lib/types";
import { DateTime } from "luxon";
import {
  CheckCircleFilled,
  XCircleFilled,
  WarningFilled,
} from "@plexui/ui/components/Icon";

interface EventTimelineProps {
  events: TimelineEvent[];
}

export function EventTimeline({ events }: EventTimelineProps) {
  // Group events by date
  const grouped = new Map<string, TimelineEvent[]>();
  for (const event of events) {
    const date = DateTime.fromISO(event.timestamp).toFormat("dd LLL yyyy");
    if (!grouped.has(date)) grouped.set(date, []);
    grouped.get(date)!.push(event);
  }

  const groupEntries = Array.from(grouped.entries());

  // Flatten to know global last event
  const allEvents = groupEntries.flatMap(([, evts]) => evts);
  const lastEventId = allEvents[allEvents.length - 1]?.id;

  return (
    <div>
      <h3 className="heading-sm text-[var(--color-text)]">
        Event timeline (UTC)
      </h3>
      <div className="mt-3">
        {groupEntries.map(([date, dayEvents]) => (
          <div key={date}>
            {/* Date header */}
            <div className="mb-3 text-sm font-medium text-[var(--color-text-tertiary)]">
              {date}
            </div>

            {/* Events in this date group */}
            {dayEvents.map((event) => (
              <TimelineRow
                key={event.id}
                event={event}
                isLast={event.id === lastEventId}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Timeline Row ───

function TimelineRow({
  event,
  isLast,
}: {
  event: TimelineEvent;
  isLast: boolean;
}) {
  const time = DateTime.fromISO(event.timestamp).toFormat("HH:mm:ss");
  const hasIcon = event.level !== "info";

  return (
    <div className="flex gap-3">
      {/* Timestamp */}
      <span className="w-16 shrink-0 pt-[3px] text-sm tabular-nums text-[var(--color-text-tertiary)]">
        {time}
      </span>

      {/* Icon column with continuous line */}
      <div className="relative flex w-5 shrink-0 justify-center">
        {/* Continuous vertical line — full height of row */}
        {!isLast && (
          <div className="absolute top-0 bottom-0 left-1/2 w-px -translate-x-1/2 bg-[var(--color-border)]" />
        )}

        {/* Icon or dot */}
        {hasIcon ? (
          /* Status icon: surface bg circle to mask line, then icon on top */
          <div className="relative z-10 mt-[2px] flex h-[18px] w-[18px] shrink-0 items-center justify-center">
            <div className="absolute inset-[-1px] rounded-full bg-[var(--color-surface)]" />
            <div className="relative">
              <StatusIcon level={event.level} />
            </div>
          </div>
        ) : (
          /* Info dot: solid gray circle on top of line */
          <div className="relative z-10 mt-[6px]">
            <div className="h-[9px] w-[9px] rounded-full bg-[var(--color-text-tertiary)]" />
          </div>
        )}
      </div>

      {/* Description */}
      <div className={isLast ? "flex-1 pb-0" : "flex-1 pb-5"}>
        <p className="pt-[3px] text-sm leading-snug text-[var(--color-text)]">
          {event.description}
        </p>
      </div>
    </div>
  );
}

// ─── Status icon per level ───

function StatusIcon({ level }: { level: TimelineEventLevel }) {
  if (level === "success") {
    return (
      <CheckCircleFilled
        className="h-[18px] w-[18px]"
        style={{ color: "var(--color-background-success-solid)" }}
      />
    );
  }
  if (level === "error") {
    return (
      <XCircleFilled
        className="h-[18px] w-[18px]"
        style={{ color: "var(--color-background-danger-solid)" }}
      />
    );
  }
  if (level === "warning") {
    return (
      <WarningFilled
        className="h-[18px] w-[18px]"
        style={{ color: "var(--color-background-warning-solid)" }}
      />
    );
  }

  // Should not reach here — info is handled inline
  return null;
}
