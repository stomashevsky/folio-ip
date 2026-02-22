"use client";

import { Badge } from "@plexui/ui/components/Badge";
import { Button } from "@plexui/ui/components/Button";
import { SectionHeading, InlineEmpty } from "@/components/shared";

export function LabelsTab({
  tags,
  onEditTags,
}: {
  tags: string[];
  onEditTags: () => void;
}) {
  return (
    <div className="space-y-4">
      <SectionHeading
        action={
          <Button
            color="secondary"
            variant="ghost"
            size="sm"
            pill={false}
            onClick={onEditTags}
          >
            {tags.length > 0 ? "Edit" : "Add labels"}
          </Button>
        }
      >
        Labels
      </SectionHeading>

      {tags.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge pill key={tag} color="secondary" size="sm">{tag}</Badge>
          ))}
        </div>
      ) : (
        <InlineEmpty>No labels assigned.</InlineEmpty>
      )}
    </div>
  );
}
