import type { TimelineEvent } from "@/lib/types";
import { Badge } from "@plexui/ui/components/Badge";
import { Button } from "@plexui/ui/components/Button";
import { EventTimeline } from "./EventTimeline";
import { InlineEmpty } from "./InlineEmpty";
import { SectionHeading } from "./SectionHeading";
import type { ReactNode } from "react";

/* ─── Types ─── */

interface DetailPageSidebarProps {
  /** InfoRow elements rendered inside the "Info" section. */
  infoRows: ReactNode;
  /** Current tags for this entity. */
  tags: string[];
  /** Callback to open the TagEditModal. */
  onEditTags: () => void;
  /** Label shown on the add-tag button when no tags exist. Defaults to `"Add"`. */
  tagAddLabel?: ReactNode;
  /** Message shown when there are no tags. If omitted, nothing is rendered. */
  tagEmptyMessage?: string;
  /** Timeline events. When provided, renders EventTimeline in a bottom section. */
  events?: TimelineEvent[];
}

/* ─── Component ─── */

export function DetailPageSidebar({
  infoRows,
  tags,
  onEditTags,
  tagAddLabel = "Add",
  tagEmptyMessage,
  events,
}: DetailPageSidebarProps) {
  return (
    <div className="w-full border-t border-[var(--color-border)] bg-[var(--color-surface)] md:w-[440px] md:min-w-[280px] md:shrink md:overflow-auto md:border-l md:border-t-0">
      {/* Info */}
      <div className="px-5 py-5">
        <h3 className="heading-sm text-[var(--color-text)]">Info</h3>
        <div className="mt-3 space-y-1">{infoRows}</div>
      </div>

      {/* Tags */}
      <div className="border-t border-[var(--color-border)] px-5 py-4">
        <SectionHeading
          action={
            <Button
              color="secondary"
              variant="ghost"
              size="sm"
              pill={false}
              onClick={onEditTags}
            >
              {tags.length > 0 ? "Edit" : tagAddLabel}
            </Button>
          }
        >
          Tags
        </SectionHeading>
        {tags.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge pill key={tag} color="secondary" size="sm">{tag}</Badge>
            ))}
          </div>
        ) : tagEmptyMessage ? (
          <InlineEmpty>{tagEmptyMessage}</InlineEmpty>
        ) : null}
      </div>

      {/* Event Timeline */}
      {events !== undefined && (
        <div className="border-t border-[var(--color-border)] px-5 py-4">
          {events.length > 0 ? (
            <EventTimeline events={events} />
          ) : (
            <div>
              <h3 className="heading-sm text-[var(--color-text)]">
                Event timeline (UTC)
              </h3>
              <InlineEmpty>No events recorded.</InlineEmpty>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
