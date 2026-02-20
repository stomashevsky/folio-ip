"use client";

import { TopBar } from "@/components/layout/TopBar";
import { EmptyMessage } from "@plexui/ui/components/EmptyMessage";
import { Search } from "@plexui/ui/components/Icon";

export default function WebhookEventsPage() {
  return (
    <div className="flex h-full flex-col">
      <TopBar title="Webhook Events" />
      <div className="flex flex-1 items-center justify-center p-8">
        <EmptyMessage>
          <EmptyMessage.Icon>
            <Search />
          </EmptyMessage.Icon>
          <EmptyMessage.Title>Coming soon</EmptyMessage.Title>
          <EmptyMessage.Description>
            Monitor webhook delivery events and status.
          </EmptyMessage.Description>
        </EmptyMessage>
      </div>
    </div>
  );
}
