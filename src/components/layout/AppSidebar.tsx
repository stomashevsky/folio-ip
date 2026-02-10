"use client";

import { useState } from "react";
import {
  Sidebar,
  SidebarCard,
  SidebarCardContent,
  SidebarCardTitleLink,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuButtonIcon,
  SidebarMenuButtonLabel,
  SidebarMenuChevron,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarTrigger,
} from "@plexui/ui/components/Sidebar";
import {
  LayoutDashboard,
  FileSearch,
  ShieldCheck,
  FileText,
  Users,
  BarChart3,
  ArrowLeftRight,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

type NavChild = {
  title: string;
  href: string;
};

type NavItem = {
  title: string;
  icon: React.ComponentType;
  href?: string;
  children?: NavChild[];
};

const navItems: NavItem[] = [
  {
    title: "Overview",
    icon: LayoutDashboard,
    href: "/",
  },
  {
    title: "Inquiries",
    icon: FileSearch,
    children: [
      { title: "All Inquiries", href: "/inquiries" },
      { title: "Analytics", href: "/inquiries/analytics" },
      { title: "Templates", href: "/inquiries/templates" },
    ],
  },
  {
    title: "Verifications",
    icon: ShieldCheck,
    children: [
      { title: "All Verifications", href: "/verifications" },
      { title: "Templates", href: "/verifications/templates" },
    ],
  },
  {
    title: "Reports",
    icon: FileText,
    children: [
      { title: "All Reports", href: "/reports" },
      { title: "Templates", href: "/reports/templates" },
    ],
  },
  {
    title: "Accounts",
    icon: Users,
    children: [
      { title: "All Accounts", href: "/accounts" },
      { title: "Types", href: "/accounts/types" },
    ],
  },
  {
    title: "Transactions",
    icon: ArrowLeftRight,
    children: [
      { title: "All Transactions", href: "/transactions" },
      { title: "Analytics", href: "/transactions/analytics" },
      { title: "Types", href: "/transactions/types" },
    ],
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  // All sections expanded by default
  const [expanded, setExpanded] = useState<string[]>(
    navItems.filter((i) => i.children).map((i) => i.title),
  );

  const toggle = (title: string) =>
    setExpanded((prev) =>
      prev.includes(title)
        ? prev.filter((t) => t !== title)
        : [...prev, title],
    );

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  };

  const isSectionActive = (item: NavItem) => {
    if (item.href) return isActive(item.href);
    return item.children?.some((c) => isActive(c.href)) ?? false;
  };

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel size="sm">Identity</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                if (!item.children) {
                  // Simple item (Overview)
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        isActive={isActive(item.href!)}
                        tooltip={item.title}
                        onClick={() => router.push(item.href!)}
                      >
                        <SidebarMenuButtonIcon>
                          <item.icon />
                        </SidebarMenuButtonIcon>
                        <SidebarMenuButtonLabel>
                          {item.title}
                        </SidebarMenuButtonLabel>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                }

                // Collapsible item with children
                const isOpen = expanded.includes(item.title);
                return (
                  <SidebarMenuItem key={item.title} expanded={isOpen}>
                    <SidebarMenuButton
                      tooltip={item.title}
                      isActive={!isOpen && isSectionActive(item)}
                      onClick={() => toggle(item.title)}
                    >
                      <SidebarMenuButtonIcon>
                        <item.icon />
                      </SidebarMenuButtonIcon>
                      <SidebarMenuButtonLabel>
                        {item.title}
                      </SidebarMenuButtonLabel>
                      <SidebarMenuChevron />
                    </SidebarMenuButton>
                    <SidebarMenuSub open={isOpen} hasIcons>
                      {item.children.map((child) => (
                        <SidebarMenuSubItem key={child.href}>
                          <SidebarMenuSubButton
                            indent={1}
                            isActive={isActive(child.href)}
                            onClick={() => router.push(child.href)}
                          >
                            {child.title}
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
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
        <SidebarTrigger />
      </SidebarFooter>
    </Sidebar>
  );
}
