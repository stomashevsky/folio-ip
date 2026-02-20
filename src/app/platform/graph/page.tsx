"use client";

import { TopBar } from "@/components/layout/TopBar";
import { EmptyMessage } from "@plexui/ui/components/EmptyMessage";
import { Connect } from "@plexui/ui/components/Icon";

export default function GraphPage() {
  return (
    <div className="flex h-full flex-col">
      <TopBar title="Graph" />
      <div className="flex flex-1 items-center justify-center p-8">
        <EmptyMessage>
          <EmptyMessage.Icon>
            <Connect />
          </EmptyMessage.Icon>
          <EmptyMessage.Title>Coming soon</EmptyMessage.Title>
          <EmptyMessage.Description>
            Visualize relationships between accounts, inquiries, and verifications.
          </EmptyMessage.Description>
        </EmptyMessage>
      </div>
    </div>
  );
}
