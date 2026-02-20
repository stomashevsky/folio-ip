"use client";

import { TopBar } from "@/components/layout/TopBar";
import { EmptyMessage } from "@plexui/ui/components/EmptyMessage";
import { Search } from "@plexui/ui/components/Icon";

export default function GettingStartedPage() {
  return (
    <div className="flex h-full flex-col">
      <TopBar title="Getting Started" />
      <div className="flex flex-1 items-center justify-center p-8">
        <EmptyMessage>
          <EmptyMessage.Icon>
            <Search />
          </EmptyMessage.Icon>
          <EmptyMessage.Title>Coming soon</EmptyMessage.Title>
          <EmptyMessage.Description>
            Quick start guide and documentation.
          </EmptyMessage.Description>
        </EmptyMessage>
      </div>
    </div>
  );
}
