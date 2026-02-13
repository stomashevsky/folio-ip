"use client";

import { usePathname } from "next/navigation";
import { AppSidebar } from "./AppSidebar";
import { SettingsSidebar } from "./SettingsSidebar";
import {
  dashboardNavItems,
  analyticsNavItems,
  templatesNavItems,
} from "@/lib/constants/nav-config";

export function SidebarSwitch() {
  const pathname = usePathname();

  if (pathname?.startsWith("/settings")) {
    return <SettingsSidebar />;
  }

  if (pathname?.startsWith("/analytics")) {
    return <AppSidebar items={analyticsNavItems} />;
  }

  if (pathname?.startsWith("/templates")) {
    return <AppSidebar items={templatesNavItems} />;
  }

  return <AppSidebar items={dashboardNavItems} />;
}
