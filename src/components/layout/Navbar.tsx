"use client";

import { Avatar } from "@plexui/ui/components/Avatar";
import { Button } from "@plexui/ui/components/Button";
import { Menu } from "@plexui/ui/components/Menu";
import { Sun, Moon, SystemMode } from "@plexui/ui/components/Icon";
import { Tabs } from "@plexui/ui/components/Tabs";
import { SidebarMobileMenuButton } from "@plexui/ui/components/Sidebar";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { globalSections, getActiveGlobalSection } from "@/lib/constants/nav-config";
import { MOCK_USER } from "@/lib/constants/mock-user";


function ThemeSwitcher() {
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

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <header className="flex h-[var(--navbar-height)] shrink-0 items-center justify-between bg-[var(--color-surface-tertiary)] px-2 md:grid md:grid-cols-[1fr_auto_1fr] md:px-4">
      {/* Left: Org button */}
      <div className="flex items-center">
        <Link
          href="/"
          className="flex h-8 items-center gap-2 rounded-lg py-0 pl-1.5 pr-2.5 text-sm font-medium text-[var(--color-text)]"
        >
          <Avatar name={MOCK_USER.organization} size={25} color="primary" variant="solid" />
          <span>{MOCK_USER.organization}</span>
        </Link>
      </div>

      {/* Center: Global section tabs (desktop) */}
      <nav className="hidden items-center gap-1 md:flex">
        {globalSections.map((section) => {
          const isActive = getActiveGlobalSection(pathname).id === section.id;
          return (
            <Link
              key={section.id}
              href={section.href}
              className={`relative flex h-8 items-center rounded-lg px-3 text-sm transition-colors ${
                isActive
                  ? "bg-[var(--color-nav-active-bg)] font-medium text-[var(--color-text)]"
                  : "text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
              }`}
            >
              {section.label}
            </Link>
          );
        })}
      </nav>

      {/* Right: Copilot + Avatar (desktop) | Menu button (mobile) */}
      <div className="flex items-center justify-end gap-1">
         <div className="hidden md:flex md:items-center md:gap-1">
           <Menu>
             <Menu.Trigger asChild>
               <Button color="secondary" variant="ghost" size="sm" uniform pill={false} aria-label="User menu">
                 <Avatar name={MOCK_USER.name} size={28} color={MOCK_USER.avatarColor} variant="solid" />
               </Button>
             </Menu.Trigger>
            <Menu.Content align="end" sideOffset={8} minWidth={220}>
              <div className="px-3 py-2">
                <p className="text-sm font-medium text-[var(--color-text)]">{MOCK_USER.name}</p>
                <p className="text-xs text-[var(--color-text-secondary)]">{MOCK_USER.email}</p>
              </div>
              <div className="px-3 pb-2">
                <ThemeSwitcher />
              </div>
              <Menu.Separator />
              <Menu.Item onSelect={() => router.push("/settings")}>Your profile</Menu.Item>
              <Menu.Separator />
              <Menu.Item onSelect={() => {}}>Log out</Menu.Item>
            </Menu.Content>
          </Menu>
        </div>

        {/* Mobile: hamburger / X button */}
        <div className="md:hidden">
          <SidebarMobileMenuButton />
        </div>
      </div>
    </header>
  );
}
