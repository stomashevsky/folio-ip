"use client";

import { TopBar } from "@/components/layout/TopBar";
import { EmptyMessage } from "@plexui/ui/components/EmptyMessage";
import { Search } from "@plexui/ui/components/Icon";

export default function TeamRolesPage() {
  return (
    <div className="flex h-full flex-col">
      <TopBar title="Roles" />
      <div className="flex flex-1 items-center justify-center p-8">
        <EmptyMessage>
          <EmptyMessage.Icon>
            <Search />
          </EmptyMessage.Icon>
          <EmptyMessage.Title>Coming soon</EmptyMessage.Title>
          <EmptyMessage.Description>
            Define and manage team member roles.
          </EmptyMessage.Description>
        </EmptyMessage>
      </div>
    </div>
  );
}
