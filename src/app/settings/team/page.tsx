"use client";

import { TopBar } from "@/components/layout/TopBar";
import { SettingsTable } from "@/components/shared";
import { getRoleBadgeColor } from "@/lib/utils/format";
import { Button } from "@plexui/ui/components/Button";
import { Badge } from "@plexui/ui/components/Badge";
import { Avatar } from "@plexui/ui/components/Avatar";
import { Plus } from "@plexui/ui/components/Icon";
import { MOCK_USER } from "@/lib/constants/mock-user";

const mockTeamMembers = [
  {
    name: MOCK_USER.name,
    email: MOCK_USER.email,
    role: "Owner",
    joined: "Jan 15, 2026",
    avatarColor: MOCK_USER.avatarColor,
  },
  {
    name: "Maria Gonzalez",
    email: "maria.gonzalez@lunacorp.com",
    role: "Admin",
    joined: "Jan 20, 2026",
    avatarColor: "danger" as const,
  },
  {
    name: "John Williams",
    email: "john.williams@lunacorp.com",
    role: "Member",
    joined: "Feb 01, 2026",
    avatarColor: "info" as const,
  },
  {
    name: "Sophie Dupont",
    email: "sophie.dupont@lunacorp.com",
    role: "Member",
    joined: "Feb 05, 2026",
    avatarColor: "success" as const,
  },
];

type TeamMember = (typeof mockTeamMembers)[number];

export default function TeamPage() {
  return (
    <div className="flex h-full flex-col overflow-auto">
      <TopBar
        title="Team"
        actions={
          <Button color="primary" pill={false} size="md">
            <Plus />
            Invite member
          </Button>
        }
      />
      <div className="px-4 py-8 md:px-6">
        <p className="mb-6 text-sm text-[var(--color-text-secondary)]">
          Manage who has access to this organization and their permissions.
        </p>

        <SettingsTable<TeamMember>
          data={mockTeamMembers}
          keyExtractor={(m) => m.email}
          columns={[
            {
              header: "Member",
              render: (member) => (
                <div className="flex items-center gap-3">
                  <Avatar
                    name={member.name}
                    size={32}
                    color={member.avatarColor}
                    variant="solid"
                  />
                  <div>
                    <p className="text-sm font-medium text-[var(--color-text)]">
                      {member.name}
                    </p>
                    <p className="text-xs text-[var(--color-text-secondary)]">
                      {member.email}
                    </p>
                  </div>
                </div>
              ),
            },
            {
              header: "Role",
              render: (member) => (
                <Badge color={getRoleBadgeColor(member.role) as "discovery" | "info" | "secondary"}>
                  {member.role}
                </Badge>
              ),
            },
            {
              header: "Joined",
              render: (member) => (
                <span className="text-sm text-[var(--color-text-secondary)]">
                  {member.joined}
                </span>
              ),
            },
          ]}
          renderMobileCard={(member) => (
            <>
              <div className="flex items-center gap-3">
                <Avatar
                  name={member.name}
                  size={32}
                  color={member.avatarColor}
                  variant="solid"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-[var(--color-text)]">
                      {member.name}
                    </span>
                    <Badge color={getRoleBadgeColor(member.role) as "discovery" | "info" | "secondary"}>
                      {member.role}
                    </Badge>
                  </div>
                  <p className="truncate text-xs text-[var(--color-text-secondary)]">
                    {member.email}
                  </p>
                </div>
              </div>
              <p className="mt-2 text-xs text-[var(--color-text-tertiary)]">
                Joined {member.joined}
              </p>
            </>
          )}
        />
      </div>
    </div>
  );
}
