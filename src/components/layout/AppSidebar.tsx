"use client";

import {
  Sidebar,
  SidebarCard,
  SidebarCardContent,
  SidebarCardTitleLink,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuButtonLabel,
  SidebarMenuItem,
} from "@plexui/ui/components/Sidebar";
import { usePathname, useRouter } from "next/navigation";
import { type NavItem, isRouteActive } from "@/lib/constants/nav-config";

interface AppSidebarProps {
  items: NavItem[];
}

export function AppSidebar({ items }: AppSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                isActive={isRouteActive(pathname, item.href)}
                onClick={() => router.push(item.href)}
              >
                <SidebarMenuButtonLabel>
                  {item.title}
                </SidebarMenuButtonLabel>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter>
        <SidebarCard dismissible onDismiss={() => {}}>
          <SidebarCardTitleLink href="#" onClick={(e) => e.preventDefault()}>
            Sandbox Mode
          </SidebarCardTitleLink>
          <SidebarCardContent>
            You are using simulated data. Connect a live environment to see real
            results.
          </SidebarCardContent>
        </SidebarCard>
      </SidebarFooter>
    </Sidebar>
  );
}
