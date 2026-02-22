"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { TopBar, TOPBAR_CONTROL_SIZE, TOPBAR_ACTION_PILL } from "@/components/layout/TopBar";
import { NotFoundPage, SectionHeading } from "@/components/shared";
import { Badge } from "@plexui/ui/components/Badge";
import { Button } from "@plexui/ui/components/Button";
import { Input } from "@plexui/ui/components/Input";
import { Textarea } from "@plexui/ui/components/Textarea";
import { Field } from "@plexui/ui/components/Field";
import { Checkbox } from "@plexui/ui/components/Checkbox";
import { Avatar } from "@plexui/ui/components/Avatar";

interface Role {
  id: string;
  name: string;
  description: string;
  membersCount: number;
  permissions: string[];
  members: { name: string; email: string }[];
  isSystem: boolean;
  createdAt: string;
  updatedAt: string;
}

const PERMISSION_GROUPS: Record<string, { label: string; permissions: { key: string; label: string; description: string }[] }> = {
  identity: {
    label: "Identity",
    permissions: [
      { key: "view_inquiries", label: "View inquiries", description: "View all inquiries and their details" },
      { key: "manage_inquiries", label: "Manage inquiries", description: "Create, approve, and decline inquiries" },
      { key: "view_verifications", label: "View verifications", description: "View verification results" },
      { key: "manage_verifications", label: "Manage verifications", description: "Retry and manage verifications" },
      { key: "view_reports", label: "View reports", description: "View generated reports" },
      { key: "export_data", label: "Export data", description: "Export inquiry and verification data" },
    ],
  },
  accounts: {
    label: "Accounts",
    permissions: [
      { key: "view_accounts", label: "View accounts", description: "View all accounts" },
      { key: "manage_accounts", label: "Manage accounts", description: "Create, update, and archive accounts" },
      { key: "manage_account_tags", label: "Manage tags", description: "Add and remove tags from accounts" },
    ],
  },
  platform: {
    label: "Platform",
    permissions: [
      { key: "view_cases", label: "View cases", description: "View all cases and queues" },
      { key: "manage_cases", label: "Manage cases", description: "Create, assign, and resolve cases" },
      { key: "manage_workflows", label: "Manage workflows", description: "Create and edit workflows" },
      { key: "view_graph", label: "View graph", description: "Access the graph explorer" },
      { key: "manage_lists", label: "Manage lists", description: "Create and edit lists" },
    ],
  },
  developers: {
    label: "Developers",
    permissions: [
      { key: "manage_api_keys", label: "Manage API keys", description: "Create and revoke API keys" },
      { key: "view_api_logs", label: "View API logs", description: "View API request logs" },
      { key: "manage_webhooks", label: "Manage webhooks", description: "Create and configure webhooks" },
      { key: "manage_integrations", label: "Manage integrations", description: "Configure integrations" },
    ],
  },
  settings: {
    label: "Settings",
    permissions: [
      { key: "manage_users", label: "Manage team", description: "Invite, remove, and assign roles to team members" },
      { key: "manage_roles", label: "Manage roles", description: "Create and edit roles and permissions" },
      { key: "manage_settings", label: "Manage settings", description: "Change organization and project settings" },
      { key: "manage_billing", label: "Manage billing", description: "View and update billing information" },
    ],
  },
};

const MOCK_ROLES: Role[] = [
  {
    id: "role_owner",
    name: "Owner",
    description: "Full access to all features and settings",
    membersCount: 1,
    permissions: Object.values(PERMISSION_GROUPS).flatMap((g) => g.permissions.map((p) => p.key)),
    members: [{ name: "Alice Martinez", email: "alice@lunacorp.com" }],
    isSystem: true,
    createdAt: "2025-01-15T10:30:00Z",
    updatedAt: "2025-02-10T14:20:00Z",
  },
  {
    id: "role_admin",
    name: "Admin",
    description: "Administrative access with limited billing controls",
    membersCount: 3,
    permissions: [
      "view_inquiries", "manage_inquiries", "view_verifications", "manage_verifications", "view_reports", "export_data",
      "view_accounts", "manage_accounts", "manage_account_tags",
      "view_cases", "manage_cases", "manage_workflows", "view_graph", "manage_lists",
      "manage_api_keys", "view_api_logs", "manage_webhooks", "manage_integrations",
      "manage_users", "manage_roles", "manage_settings",
    ],
    members: [
      { name: "John Smith", email: "john@lunacorp.com" },
      { name: "Sarah Johnson", email: "sarah@lunacorp.com" },
      { name: "Mike Chen", email: "mike@lunacorp.com" },
    ],
    isSystem: true,
    createdAt: "2025-01-15T10:30:00Z",
    updatedAt: "2025-02-08T09:15:00Z",
  },
  {
    id: "role_analyst",
    name: "Analyst",
    description: "Can view reports and manage inquiries",
    membersCount: 5,
    permissions: ["view_inquiries", "manage_inquiries", "view_verifications", "view_reports", "export_data", "view_accounts", "view_cases"],
    members: [
      { name: "Lisa Wong", email: "lisa@lunacorp.com" },
      { name: "Emma Davis", email: "emma@lunacorp.com" },
      { name: "Robert Brown", email: "robert@lunacorp.com" },
      { name: "David Garcia", email: "david@lunacorp.com" },
      { name: "Patricia Lee", email: "patricia@lunacorp.com" },
    ],
    isSystem: false,
    createdAt: "2025-01-20T11:45:00Z",
    updatedAt: "2025-02-05T16:30:00Z",
  },
  {
    id: "role_reviewer",
    name: "Reviewer",
    description: "Can review and approve inquiries",
    membersCount: 4,
    permissions: ["view_inquiries", "manage_inquiries", "view_verifications", "view_reports", "view_accounts", "view_cases", "manage_cases"],
    members: [
      { name: "James Wilson", email: "james@lunacorp.com" },
      { name: "Karen Taylor", email: "karen@lunacorp.com" },
      { name: "Tom Anderson", email: "tom@lunacorp.com" },
      { name: "Nancy White", email: "nancy@lunacorp.com" },
    ],
    isSystem: false,
    createdAt: "2025-01-25T13:20:00Z",
    updatedAt: "2025-02-12T11:00:00Z",
  },
  {
    id: "role_viewer",
    name: "Viewer",
    description: "Read-only access to reports and data",
    membersCount: 8,
    permissions: ["view_inquiries", "view_verifications", "view_reports", "view_accounts", "view_cases", "view_graph"],
    members: [
      { name: "Chris Martin", email: "chris@lunacorp.com" },
      { name: "Amy Clark", email: "amy@lunacorp.com" },
      { name: "Brian Hall", email: "brian@lunacorp.com" },
      { name: "Diana King", email: "diana@lunacorp.com" },
      { name: "Frank Lopez", email: "frank@lunacorp.com" },
      { name: "Grace Hill", email: "grace@lunacorp.com" },
      { name: "Henry Scott", email: "henry@lunacorp.com" },
      { name: "Irene Adams", email: "irene@lunacorp.com" },
    ],
    isSystem: false,
    createdAt: "2025-02-01T08:00:00Z",
    updatedAt: "2025-02-10T10:30:00Z",
  },
  {
    id: "role_developer",
    name: "Developer",
    description: "API access and integration management",
    membersCount: 2,
    permissions: ["manage_api_keys", "view_api_logs", "manage_webhooks", "manage_integrations", "view_reports"],
    members: [
      { name: "Kevin Wright", email: "kevin@lunacorp.com" },
      { name: "Laura Green", email: "laura@lunacorp.com" },
    ],
    isSystem: false,
    createdAt: "2025-02-03T14:15:00Z",
    updatedAt: "2025-02-11T15:45:00Z",
  },
];

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export default function RoleDetailPage() {
  const params = useParams();
  const role = MOCK_ROLES.find((r) => r.id === params.id);
  const [permissions, setPermissions] = useState<Set<string>>(
    new Set(role?.permissions ?? [])
  );

  if (!role) {
    return (
      <NotFoundPage
        section="Roles"
        backHref="/settings/team/roles"
        entity="Role"
      />
    );
  }

  function togglePermission(key: string) {
    setPermissions((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  function toggleGroup(groupKey: string) {
    const group = PERMISSION_GROUPS[groupKey];
    const allSelected = group.permissions.every((p) => permissions.has(p.key));
    setPermissions((prev) => {
      const next = new Set(prev);
      for (const p of group.permissions) {
        if (allSelected) next.delete(p.key);
        else next.add(p.key);
      }
      return next;
    });
  }

  const allPermissionCount = Object.values(PERMISSION_GROUPS).reduce(
    (acc, g) => acc + g.permissions.length,
    0
  );

  return (
    <div className="flex h-full flex-col overflow-auto">
      <TopBar
        title={role.name}
        backHref="/settings/team/roles"
        actions={
          <div className="flex items-center gap-2">
            {role.isSystem && (
              <Badge pill color="secondary" variant="soft" size="sm">
                System
              </Badge>
            )}
            <Button
              color="primary"
              size={TOPBAR_CONTROL_SIZE}
              pill={TOPBAR_ACTION_PILL}
            >
              Save Changes
            </Button>
          </div>
        }
      />

      <div className="mx-auto w-full max-w-2xl px-4 py-8 md:px-6">
        <SectionHeading size="xs">Details</SectionHeading>
        <div className="mt-4 space-y-4">
          <Field label="Name">
            <Input
              defaultValue={role.name}
              size="sm"
              disabled={role.isSystem}
            />
          </Field>
          <Field label="Description">
            <Textarea
              defaultValue={role.description}
              rows={2}
              disabled={role.isSystem}
            />
          </Field>
        </div>

        <div className="mt-10">
          <SectionHeading size="xs">Permissions</SectionHeading>
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
            <span className="font-medium">
              {permissions.size} of {allPermissionCount}
            </span>{" "}
            permissions enabled
          </p>

          <div className="mt-4 space-y-6">
            {Object.entries(PERMISSION_GROUPS).map(([groupKey, group]) => {
              const allSelected = group.permissions.every((p) =>
                permissions.has(p.key)
              );

              return (
                <div
                  key={groupKey}
                  className="rounded-lg border border-[var(--color-border)] p-4"
                >
                  <Checkbox
                    checked={allSelected}
                    onCheckedChange={() => toggleGroup(groupKey)}
                    label={
                      <span className="heading-xs">{group.label}</span>
                    }
                  />
                  <div className="ml-6 mt-3 space-y-2">
                    {group.permissions.map((perm) => (
                      <div key={perm.key} className="flex items-start gap-2">
                        <Checkbox
                          checked={permissions.has(perm.key)}
                          onCheckedChange={() => togglePermission(perm.key)}
                          label={
                            <div>
                              <span className="text-sm font-medium">
                                {perm.label}
                              </span>
                              <p className="text-xs text-[var(--color-text-tertiary)]">
                                {perm.description}
                              </p>
                            </div>
                          }
                        />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-10">
          <SectionHeading size="xs">
            Members ({role.members.length})
          </SectionHeading>
          <div className="mt-4 space-y-2">
            {role.members.map((member) => (
              <div
                key={member.email}
                className="flex items-center gap-3 rounded-lg border border-[var(--color-border)] px-3 py-2.5"
              >
                <Avatar
                  name={member.name}
                  size={28}
                  color="primary"
                  variant="soft"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-[var(--color-text)] truncate">
                    {member.name}
                  </p>
                  <p className="text-xs text-[var(--color-text-tertiary)] truncate">
                    {member.email}
                  </p>
                </div>
              </div>
            ))}
            <Button
              color="secondary"
              variant="outline"
              size="sm"
              pill={false}
            >
              Add member
            </Button>
          </div>
        </div>

        <div className="mt-10 border-t border-[var(--color-border)] pt-6">
          <div className="flex items-center justify-between text-sm text-[var(--color-text-tertiary)]">
            <span>Created {formatDateTime(role.createdAt)}</span>
            <span>Last updated {formatDateTime(role.updatedAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
