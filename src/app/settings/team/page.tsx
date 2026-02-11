"use client";

import { TopBar } from "@/components/layout/TopBar";
import { Button } from "@plexui/ui/components/Button";
import { Badge } from "@plexui/ui/components/Badge";
import { Avatar } from "@plexui/ui/components/Avatar";
import { Plus } from "@plexui/ui/components/Icon";

const mockTeamMembers = [
  {
    name: "Alex Smith",
    email: "alex.smith@acmecorp.com",
    role: "Owner",
    joined: "Jan 15, 2026",
  },
  {
    name: "Maria Gonzalez",
    email: "maria.gonzalez@acmecorp.com",
    role: "Admin",
    joined: "Jan 20, 2026",
  },
  {
    name: "John Williams",
    email: "john.williams@acmecorp.com",
    role: "Member",
    joined: "Feb 01, 2026",
  },
  {
    name: "Sophie Dupont",
    email: "sophie.dupont@acmecorp.com",
    role: "Member",
    joined: "Feb 05, 2026",
  },
];

export default function TeamPage() {
  return (
    <div className="flex h-full flex-col overflow-auto">
      <TopBar
        title="Team"
        actions={
          <Button color="primary" pill={false} size="sm">
            <Plus />
            Invite member
          </Button>
        }
      />
      <div className="px-6 py-8">
        <p className="mb-6 text-sm text-[var(--color-text-secondary)]">
          Manage who has access to this organization and their permissions.
        </p>

        <div className="overflow-hidden rounded-lg border border-[var(--color-border)]">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface-secondary)]">
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[var(--color-text-tertiary)]">
                  Member
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[var(--color-text-tertiary)]">
                  Role
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[var(--color-text-tertiary)]">
                  Joined
                </th>
              </tr>
            </thead>
            <tbody>
              {mockTeamMembers.map((member) => (
                <tr
                  key={member.email}
                  className="border-b border-[var(--color-border)] last:border-b-0"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar
                        name={member.name}
                        size={32}
                        color="primary"
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
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      color={
                        member.role === "Owner"
                          ? "discovery"
                          : member.role === "Admin"
                            ? "info"
                            : "secondary"
                      }
                    >
                      {member.role}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-sm text-[var(--color-text-secondary)]">
                    {member.joined}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
