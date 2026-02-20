"use client";

import { Badge } from "@plexui/ui/components/Badge";
import { Menu } from "@plexui/ui/components/Menu";
import { useEnvironment } from "@/lib/stores/environment-store";

export function SandboxBadge() {
  const { environment, setEnvironment } = useEnvironment();

  return (
    <Menu>
      <Menu.Trigger asChild>
        <button type="button" className="cursor-pointer">
          <Badge
            color={environment === "sandbox" ? "warning" : "success"}
            variant="soft"
            size="sm"
            pill
          >
            {environment === "sandbox" ? "Sandbox" : "Production"}
          </Badge>
        </button>
      </Menu.Trigger>
      <Menu.Content align="start" sideOffset={8} minWidth={160}>
        <Menu.Item onSelect={() => setEnvironment("sandbox")}>
          <span className="flex items-center gap-2">
            <Badge color="warning" variant="soft" size="sm" pill>
              Sandbox
            </Badge>
            {environment === "sandbox" && (
              <span className="text-xs text-[var(--color-text-tertiary)]">Active</span>
            )}
          </span>
        </Menu.Item>
        <Menu.Item onSelect={() => setEnvironment("production")}>
          <span className="flex items-center gap-2">
            <Badge color="success" variant="soft" size="sm" pill>
              Production
            </Badge>
            {environment === "production" && (
              <span className="text-xs text-[var(--color-text-tertiary)]">Active</span>
            )}
          </span>
        </Menu.Item>
      </Menu.Content>
    </Menu>
  );
}
