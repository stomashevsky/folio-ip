"use client";

import { usePathname } from "next/navigation";
import { AppSidebar } from "./AppSidebar";
import { SettingsSidebar } from "./SettingsSidebar";

export function SidebarSwitch() {
  const pathname = usePathname();
  const isSettings = pathname?.startsWith("/settings");

  return isSettings ? <SettingsSidebar /> : <AppSidebar />;
}
