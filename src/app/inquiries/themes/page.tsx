"use client";

import { TopBar } from "@/components/layout/TopBar";
import { EmptyMessage } from "@plexui/ui/components/EmptyMessage";
import { Search } from "@plexui/ui/components/Icon";

export default function InquiryThemesPage() {
  return (
    <div className="flex h-full flex-col">
      <TopBar title="Themes" />
      <div className="flex flex-1 items-center justify-center p-8">
        <EmptyMessage>
          <EmptyMessage.Icon>
            <Search />
          </EmptyMessage.Icon>
          <EmptyMessage.Title>Coming soon</EmptyMessage.Title>
          <EmptyMessage.Description>
            Customize the look and feel of inquiry flows.
          </EmptyMessage.Description>
        </EmptyMessage>
      </div>
    </div>
  );
}
