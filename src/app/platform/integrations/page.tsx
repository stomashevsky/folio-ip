"use client";

import { TopBar } from "@/components/layout/TopBar";
import { EmptyMessage } from "@plexui/ui/components/EmptyMessage";
import { ConnectApps } from "@plexui/ui/components/Icon";

export default function IntegrationsPage() {
  return (
    <div className="flex h-full flex-col">
      <TopBar title="Integrations" />
      <div className="flex flex-1 items-center justify-center p-8">
        <EmptyMessage>
          <EmptyMessage.Icon>
            <ConnectApps />
          </EmptyMessage.Icon>
          <EmptyMessage.Title>Coming soon</EmptyMessage.Title>
          <EmptyMessage.Description>
            Connect third-party services and data providers.
          </EmptyMessage.Description>
        </EmptyMessage>
      </div>
    </div>
  );
}
