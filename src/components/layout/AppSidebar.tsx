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
import type { NavGroup } from "@/lib/constants/nav-config";

function isItemActive(pathname: string, href: string, allHrefs: string[]): boolean {
  if (href === "/") return pathname === "/";
  const isMatch = pathname === href || pathname.startsWith(href + "/");
  if (!isMatch) return false;
  return !allHrefs.some(
    (other) => other !== href && other.startsWith(href + "/") &&
      (pathname === other || pathname.startsWith(other + "/")),
  );
}

interface AppSidebarProps {
  groups: NavGroup[];
}

export function AppSidebar({ groups }: AppSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const allHrefs = groups.flatMap((g) => g.items.map((i) => i.href));

  return (
    <Sidebar>
      <SidebarContent>
        {groups.map((group) => (
          <SidebarGroup key={group.label || "top"}>
            {group.label && (
              <SidebarGroupLabel size="lg">{group.label}</SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      isActive={isItemActive(pathname, item.href, allHrefs)}
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
