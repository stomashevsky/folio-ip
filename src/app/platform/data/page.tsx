"use client";

import { TopBar } from "@/components/layout/TopBar";
import { EmptyMessage } from "@plexui/ui/components/EmptyMessage";
import { FileCode } from "@plexui/ui/components/Icon";

export default function DataPage() {
  return (
    <div className="flex h-full flex-col">
      <TopBar title="Data" />
      <div className="flex flex-1 items-center justify-center p-8">
        <EmptyMessage>
          <EmptyMessage.Icon>
            <FileCode />
          </EmptyMessage.Icon>
          <EmptyMessage.Title>Coming soon</EmptyMessage.Title>
          <EmptyMessage.Description>
            Browse and manage raw identity data and events.
          </EmptyMessage.Description>
        </EmptyMessage>
      </div>
    </div>
  );
}
