"use client";

import { useSidebar } from "@plexui/ui/components/Sidebar";

/**
 * Adds the data-mobile-menu attribute to SidebarProvider for PlexUI CSS animations.
 * Must be a direct child of SidebarProvider to access useSidebar context.
 */
export function MobileLayoutWrapper({ children }: { children: React.ReactNode }) {
  const { openMobile } = useSidebar();

  return (
    <div
      data-mobile-menu={openMobile ? "visible" : "hidden"}
      className="flex h-full flex-1 flex-col overflow-hidden"
    >
      {children}
    </div>
  );
}
