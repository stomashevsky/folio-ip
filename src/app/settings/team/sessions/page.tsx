"use client";

import { TopBar } from "@/components/layout/TopBar";
import { EmptyMessage } from "@plexui/ui/components/EmptyMessage";
import { Search } from "@plexui/ui/components/Icon";

export default function TeamSessionsPage() {
  return (
    <div className="flex h-full flex-col">
      <TopBar title="Sessions" />
      <div className="flex flex-1 items-center justify-center p-8">
        <EmptyMessage>
          <EmptyMessage.Icon>
            <Search />
          </EmptyMessage.Icon>
          <EmptyMessage.Title>Coming soon</EmptyMessage.Title>
          <EmptyMessage.Description>
            View and manage active user sessions.
          </EmptyMessage.Description>
        </EmptyMessage>
      </div>
    </div>
  );
}
