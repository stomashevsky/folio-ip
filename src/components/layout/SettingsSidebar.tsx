"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuButtonLabel,
  SidebarMenuItem,
} from "@plexui/ui/components/Sidebar";
import { usePathname, useRouter } from "next/navigation";
import { settingsNavGroups } from "@/lib/constants/nav-config";

export function SettingsSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <Sidebar>
      <SidebarContent>
        {settingsNavGroups.map((group) => (
          <SidebarGroup key={group.label || "top"}>
            {group.label && (
              <SidebarGroupLabel size="lg">{group.label}</SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      isActive={pathname === item.href}
                      onClick={() => router.push(item.href)}
                    >
                      <SidebarMenuButtonLabel>
                        {item.title}
                      </SidebarMenuButtonLabel>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
