import { EmptyMessage } from "@plexui/ui/components/EmptyMessage";
import { Search } from "@plexui/ui/components/Icon";

interface InlineEmptyProps {
  /** Description text (e.g. "No verifications for this account.") */
  children: string;
  /** PlexUI icon to display (default: Search) */
  icon?: React.ReactNode;
}

export function InlineEmpty({ children, icon }: InlineEmptyProps) {
  return (
    <EmptyMessage fill="none">
      <EmptyMessage.Icon size="sm">{icon ?? <Search />}</EmptyMessage.Icon>
      <EmptyMessage.Description>{children}</EmptyMessage.Description>
    </EmptyMessage>
  );
}
