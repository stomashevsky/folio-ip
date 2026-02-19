import { TopBar } from "@/components/layout/TopBar";
import { getStatusColor } from "@/lib/utils/format";
import type { TemplateStatus } from "@/lib/types";
import { Badge } from "@plexui/ui/components/Badge";
import { Button } from "@plexui/ui/components/Button";
import { DotsHorizontal } from "@plexui/ui/components/Icon";
import { Menu } from "@plexui/ui/components/Menu";

/* ─── Types ─── */

interface TemplateDetailTopBarProps {
  /** Display title (shown in TopBar). */
  title: string;
  /** Whether this is a new (unsaved) template. */
  isNew: boolean;
  /** Current template status. */
  status: TemplateStatus;
  /** Back-navigation href. */
  backHref: string;
  /** Whether "Publish" action is available. */
  canPublish: boolean;
  /** Whether "Archive" action is available. */
  canArchive: boolean;
  /** Called when user selects "Publish". */
  onPublish: () => void;
  /** Called when user selects "Archive". */
  onArchive: () => void;
  /** Called when user selects "Delete". */
  onDelete: () => void;
  /** Called when user clicks "Save". */
  onSave: () => void;
}

/* ─── Component ─── */

export function TemplateDetailTopBar({
  title,
  isNew,
  status,
  backHref,
  canPublish,
  canArchive,
  onPublish,
  onArchive,
  onDelete,
  onSave,
}: TemplateDetailTopBarProps) {
  return (
    <TopBar
      title={
        <span className="flex items-center gap-2">
          {title}
          {!isNew && (
            <Badge
              color={
                getStatusColor(status) as "warning" | "success" | "secondary"
              }
              size="sm"
            >
              {status}
            </Badge>
          )}
        </span>
      }
      backHref={backHref}
      actions={
        <div className="flex items-center gap-2">
          {!isNew && (
            <Menu>
              <Menu.Trigger>
                <Button
                  color="secondary"
                  variant="soft"
                  size="sm"
                  pill={false}
                >
                  <DotsHorizontal />
                </Button>
              </Menu.Trigger>
              <Menu.Content minWidth="auto">
                {canPublish && (
                  <Menu.Item onSelect={onPublish}>Publish</Menu.Item>
                )}
                {canArchive && (
                  <Menu.Item onSelect={onArchive}>Archive</Menu.Item>
                )}
                <Menu.Separator />
                <Menu.Item
                  onSelect={onDelete}
                  className="text-[var(--color-text-danger-ghost)]"
                >
                  Delete
                </Menu.Item>
              </Menu.Content>
            </Menu>
          )}
          <Button color="primary" size="sm" pill={false} onClick={onSave}>
            Save
          </Button>
        </div>
      }
    />
  );
}
