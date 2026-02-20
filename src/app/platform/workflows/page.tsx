"use client";

import { TopBar } from "@/components/layout/TopBar";
import { EmptyMessage } from "@plexui/ui/components/EmptyMessage";
import { SettingsCog } from "@plexui/ui/components/Icon";

export default function WorkflowsPage() {
  return (
    <div className="flex h-full flex-col">
      <TopBar title="Workflows" />
      <div className="flex flex-1 items-center justify-center p-8">
        <EmptyMessage>
          <EmptyMessage.Icon>
            <SettingsCog />
          </EmptyMessage.Icon>
          <EmptyMessage.Title>Coming soon</EmptyMessage.Title>
          <EmptyMessage.Description>
            Automate identity verification flows with visual workflows.
          </EmptyMessage.Description>
        </EmptyMessage>
      </div>
    </div>
  );
}
