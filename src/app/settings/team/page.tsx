"use client";

import { useState } from "react";
import { TopBar } from "@/components/layout/TopBar";
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  SettingsTable,
} from "@/components/shared";
import { getRoleBadgeColor } from "@/lib/utils/format";
import { Button } from "@plexui/ui/components/Button";
import { Badge } from "@plexui/ui/components/Badge";
import { Avatar } from "@plexui/ui/components/Avatar";
import { Input } from "@plexui/ui/components/Input";
import { Field } from "@plexui/ui/components/Field";
import { Select } from "@plexui/ui/components/Select";
import { Menu } from "@plexui/ui/components/Menu";
import { DotsHorizontal, Plus } from "@plexui/ui/components/Icon";
import { MOCK_USER } from "@/lib/constants/mock-user";

const AVATAR_COLORS = [
  "danger",
  "info",
  "success",
  "discovery",
  "primary",
  "secondary",
] as const;

const ROLE_OPTIONS = [
  { value: "Admin", label: "Admin" },
  { value: "Member", label: "Member" },
];

type AvatarColor = (typeof AVATAR_COLORS)[number];

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  joined: string;
  avatarColor: AvatarColor;
}

function randomId() {
  return `tmem_${Math.random().toString(36).slice(2, 14)}`;
}

function randomAvatarColor() {
  return AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
}

const initialMembers: TeamMember[] = [
  {
    id: randomId(),
    name: MOCK_USER.name,
    email: MOCK_USER.email,
    role: "Owner",
    joined: "Jan 15, 2026",
    avatarColor: MOCK_USER.avatarColor,
  },
  {
    id: randomId(),
    name: "Maria Gonzalez",
    email: "maria.gonzalez@lunacorp.com",
    role: "Admin",
    joined: "Jan 20, 2026",
    avatarColor: "danger",
  },
  {
    id: randomId(),
    name: "John Williams",
    email: "john.williams@lunacorp.com",
    role: "Member",
    joined: "Feb 01, 2026",
    avatarColor: "info",
  },
  {
    id: randomId(),
    name: "Sophie Dupont",
    email: "sophie.dupont@lunacorp.com",
    role: "Member",
    joined: "Feb 05, 2026",
    avatarColor: "success",
  },
];

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>(initialMembers);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("Member");
  const [removing, setRemoving] = useState<TeamMember | null>(null);

  const resetInviteForm = () => {
    setInviteName("");
    setInviteEmail("");
    setInviteRole("Member");
  };

  const handleInvite = () => {
    if (!inviteName.trim() || !inviteEmail.trim()) return;
    const member: TeamMember = {
      id: randomId(),
      name: inviteName.trim(),
      email: inviteEmail.trim(),
      role: inviteRole,
      joined: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }),
      avatarColor: randomAvatarColor(),
    };
    setMembers((prev) => [...prev, member]);
    resetInviteForm();
    setInviteOpen(false);
  };

  const handleChangeRole = (id: string, newRole: string) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, role: newRole } : m)),
    );
  };

  const handleRemove = () => {
    if (!removing) return;
    setMembers((prev) => prev.filter((m) => m.id !== removing.id));
    setRemoving(null);
  };

  return (
    <div className="flex h-full flex-col overflow-auto">
      <TopBar
        title="Team"
        actions={
          <Button
            color="primary"
            pill={false}
            size="md"
            onClick={() => setInviteOpen(true)}
          >
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
          data={members}
          keyExtractor={(m) => m.id}
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
                <Badge
                  color={
                    getRoleBadgeColor(member.role) as
                      | "discovery"
                      | "info"
                      | "secondary"
                  }
                >
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
            {
              header: "",
              align: "right" as const,
              render: (member) =>
                member.role === "Owner" ? null : (
                  <Menu>
                    <Menu.Trigger>
                      <Button
                        color="secondary"
                        variant="ghost"
                        size="sm"
                        pill={false}
                      >
                        <DotsHorizontal />
                      </Button>
                    </Menu.Trigger>
                    <Menu.Content align="end" minWidth="auto">
                      <Menu.Item
                        onSelect={() =>
                          handleChangeRole(
                            member.id,
                            member.role === "Admin" ? "Member" : "Admin",
                          )
                        }
                      >
                        Change to{" "}
                        {member.role === "Admin" ? "Member" : "Admin"}
                      </Menu.Item>
                      <Menu.Separator />
                      <Menu.Item
                        onSelect={() => setRemoving(member)}
                        className="text-[var(--color-text-danger-ghost)]"
                      >
                        Remove member
                      </Menu.Item>
                    </Menu.Content>
                  </Menu>
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
                    <div className="flex items-center gap-2">
                      <Badge
                        color={
                          getRoleBadgeColor(member.role) as
                            | "discovery"
                            | "info"
                            | "secondary"
                        }
                      >
                        {member.role}
                      </Badge>
                      {member.role !== "Owner" && (
                        <Menu>
                          <Menu.Trigger>
                            <Button
                              color="secondary"
                              variant="ghost"
                              size="sm"
                              pill={false}
                            >
                              <DotsHorizontal />
                            </Button>
                          </Menu.Trigger>
                          <Menu.Content align="end" minWidth="auto">
                            <Menu.Item
                              onSelect={() =>
                                handleChangeRole(
                                  member.id,
                                  member.role === "Admin" ? "Member" : "Admin",
                                )
                              }
                            >
                              Change to{" "}
                              {member.role === "Admin" ? "Member" : "Admin"}
                            </Menu.Item>
                            <Menu.Separator />
                            <Menu.Item
                              onSelect={() => setRemoving(member)}
                              className="text-[var(--color-text-danger-ghost)]"
                            >
                              Remove member
                            </Menu.Item>
                          </Menu.Content>
                        </Menu>
                      )}
                    </div>
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

      <Modal
        open={inviteOpen}
        onOpenChange={(open) => {
          if (!open) {
            setInviteOpen(false);
            resetInviteForm();
          }
        }}
      >
        <ModalHeader>
          <h2 className="heading-sm text-[var(--color-text)]">
            Invite member
          </h2>
        </ModalHeader>
        <ModalBody>
          <Field label="Name" size="xl">
            <Input
              value={inviteName}
              onChange={(e) => setInviteName(e.target.value)}
              size="xl"
              autoFocus
              placeholder="Full name"
            />
          </Field>
          <Field label="Email" size="xl">
            <Input
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              size="xl"
              placeholder="email@example.com"
            />
          </Field>
          <Field label="Role" size="xl">
            <Select
              options={ROLE_OPTIONS}
              value={inviteRole}
              onChange={(o) => {
                if (o) setInviteRole(o.value);
              }}
              pill={false}
              block
            />
          </Field>
        </ModalBody>
        <ModalFooter>
          <Button
            color="secondary"
            variant="soft"
            size="md"
            pill={false}
            onClick={() => {
              setInviteOpen(false);
              resetInviteForm();
            }}
          >
            Cancel
          </Button>
          <Button
            color="primary"
            size="md"
            pill={false}
            onClick={handleInvite}
            disabled={!inviteName.trim() || !inviteEmail.trim()}
          >
            Invite
          </Button>
        </ModalFooter>
      </Modal>

      <Modal
        open={removing !== null}
        onOpenChange={(open) => {
          if (!open) setRemoving(null);
        }}
      >
        <ModalHeader>
          <h2 className="heading-sm text-[var(--color-text)]">
            Remove member
          </h2>
        </ModalHeader>
        <ModalBody>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Are you sure you want to remove{" "}
            <span className="font-medium text-[var(--color-text)]">
              {removing?.name}
            </span>{" "}
            from the team? They will lose access to all organization resources.
          </p>
        </ModalBody>
        <ModalFooter>
          <Button
            color="secondary"
            variant="soft"
            size="md"
            pill={false}
            onClick={() => setRemoving(null)}
          >
            Cancel
          </Button>
          <Button
            color="danger"
            size="md"
            pill={false}
            onClick={handleRemove}
          >
            Remove
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
