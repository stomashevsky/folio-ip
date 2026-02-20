"use client";

import { TopBar } from "@/components/layout/TopBar";
import { EmptyMessage } from "@plexui/ui/components/EmptyMessage";
import { Search } from "@plexui/ui/components/Icon";

export default function CaseTemplatesPage() {
  return (
    <div className="flex h-full flex-col">
      <TopBar title="Case Templates" />
      <div className="flex flex-1 items-center justify-center p-8">
        <EmptyMessage>
          <EmptyMessage.Icon>
            <Search />
          </EmptyMessage.Icon>
          <EmptyMessage.Title>Coming soon</EmptyMessage.Title>
          <EmptyMessage.Description>
            Configure case template workflows.
          </EmptyMessage.Description>
        </EmptyMessage>
      </div>
    </div>
  );
}
