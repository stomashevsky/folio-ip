"use client";

import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuButtonLabel,
  SidebarMenuItem,
  useSidebar,
} from "@plexui/ui/components/Sidebar";
import { Avatar } from "@plexui/ui/components/Avatar";
import { Menu } from "@plexui/ui/components/Menu";
import { Tabs } from "@plexui/ui/components/Tabs";
import { Sun, Moon, SystemMode } from "@plexui/ui/components/Icon";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  globalSections,
  getActiveGlobalSection,
  isRouteActive,
} from "@/lib/constants/nav-config";
import { MOCK_USER } from "@/lib/constants/mock-user";

function MobileThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <Tabs
      value={theme ?? "system"}
      onChange={setTheme}
      aria-label="Theme"
      size="xs"
      pill={false}
    >
      <Tabs.Tab value="light" icon={<Sun />} aria-label="Light" />
      <Tabs.Tab value="dark" icon={<Moon />} aria-label="Dark" />
      <Tabs.Tab
        value="system"
        icon={<SystemMode />}
        aria-label="System"
      />
    </Tabs>
  );
}

export function MobileMenuOverlay({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { openMobile, setOpenMobile, isMobile } = useSidebar();

  if (!isMobile || !openMobile) {
    return <>{children}</>;
  }

  const activeSection = getActiveGlobalSection(pathname);

  const navigate = (href: string) => {
    router.push(href);
    setOpenMobile(false);
  };

  return (
    <div className="flex h-full flex-col p-3">
      <div className="mb-3 flex flex-wrap gap-1">
        {globalSections.map((section) => (
          <button
            key={section.id}
            type="button"
            aria-label={`Switch to ${section.label}`}
            onClick={() => router.push(section.href)}
            className={`flex h-8 cursor-pointer items-center rounded-lg px-3 text-sm transition-colors ${
              activeSection.id === section.id
                ? "bg-[var(--color-nav-active-bg)] font-medium text-[var(--color-text)]"
                : "text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
            }`}
          >
            {section.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-auto">
        <SidebarContent className="!p-0 ![mask-image:none]">
          {activeSection.sidebarGroups.map((group) => (
            <SidebarGroup key={group.label || "top"}>
              {group.label && (
                <SidebarGroupLabel size="lg">{group.label}</SidebarGroupLabel>
              )}
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.items.map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        isActive={isRouteActive(pathname, item.href)}
                        onClick={() => navigate(item.href)}
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
      </div>

      <div className="shrink-0 border-t border-[var(--color-border)] pt-3">
        <Menu>
           <Menu.Trigger asChild>
             <button
               type="button"
               aria-label="User menu"
               className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-[var(--color-nav-hover-bg)]"
             >
              <Avatar name={MOCK_USER.name} size={32} color={MOCK_USER.avatarColor} variant="solid" />
              <div className="text-left">
                <p className="text-sm font-medium text-[var(--color-text)]">{MOCK_USER.name}</p>
                <p className="text-xs text-[var(--color-text-secondary)]">{MOCK_USER.email}</p>
              </div>
            </button>
          </Menu.Trigger>
          <Menu.Content side="top" align="start" sideOffset={8} minWidth={260}>
            <div className="px-3 py-2">
              <p className="text-sm font-medium text-[var(--color-text)]">{MOCK_USER.name}</p>
              <p className="text-xs text-[var(--color-text-secondary)]">{MOCK_USER.email}</p>
            </div>
            <div className="px-3 pb-2">
              <MobileThemeSwitcher />
            </div>
            <Menu.Separator />
            <Menu.Item onSelect={() => navigate("/settings")}>Your profile</Menu.Item>
            <Menu.Separator />
            <Menu.Item onSelect={() => {}}>Log out</Menu.Item>
          </Menu.Content>
        </Menu>
      </div>
    </div>
  );
}
