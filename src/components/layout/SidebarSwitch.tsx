"use client";

import { usePathname } from "next/navigation";
import { AppSidebar } from "./AppSidebar";
import { getActiveGlobalSection } from "@/lib/constants/nav-config";

export function SidebarSwitch() {
  const pathname = usePathname();
  const section = getActiveGlobalSection(pathname);

  return <AppSidebar groups={section.sidebarGroups} />;
}
