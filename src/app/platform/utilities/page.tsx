"use client";

import { TopBar } from "@/components/layout/TopBar";
import { EmptyMessage } from "@plexui/ui/components/EmptyMessage";
import { Tools } from "@plexui/ui/components/Icon";

export default function UtilitiesPage() {
  return (
    <div className="flex h-full flex-col">
      <TopBar title="Utilities" />
      <div className="flex flex-1 items-center justify-center p-8">
        <EmptyMessage>
          <EmptyMessage.Icon>
            <Tools />
          </EmptyMessage.Icon>
          <EmptyMessage.Title>Coming soon</EmptyMessage.Title>
          <EmptyMessage.Description>
            Helper tools for testing and debugging verification flows.
          </EmptyMessage.Description>
        </EmptyMessage>
      </div>
    </div>
  );
}
