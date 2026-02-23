"use client";

import { useRef, useState } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { SectionHeading, ToggleSetting } from "@/components/shared";
import { Input } from "@plexui/ui/components/Input";
import { Button } from "@plexui/ui/components/Button";
import { Avatar } from "@plexui/ui/components/Avatar";
import { Badge } from "@plexui/ui/components/Badge";
import { Field } from "@plexui/ui/components/Field";
import { Select } from "@plexui/ui/components/Select";
import { MOCK_USER } from "@/lib/constants/mock-user";

const TIMEZONE_OPTIONS = [
  { value: "UTC", label: "(UTC+00:00) Coordinated Universal Time" },
  { value: "America/New_York", label: "(UTC-05:00) Eastern Time" },
  { value: "America/Chicago", label: "(UTC-06:00) Central Time" },
  { value: "America/Denver", label: "(UTC-07:00) Mountain Time" },
  { value: "America/Los_Angeles", label: "(UTC-08:00) Pacific Time" },
  { value: "Europe/London", label: "(UTC+00:00) London" },
  { value: "Europe/Berlin", label: "(UTC+01:00) Berlin" },
  { value: "Asia/Tokyo", label: "(UTC+09:00) Tokyo" },
  { value: "Asia/Singapore", label: "(UTC+08:00) Singapore" },
];

const LANGUAGE_OPTIONS = [
  { value: "en", label: "English" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
  { value: "ja", label: "Japanese" },
  { value: "pt", label: "Portuguese" },
];

export default function YourProfilePage() {
  const [name, setName] = useState(MOCK_USER.name);
  const [timezone, setTimezone] = useState("UTC");
  const [language, setLanguage] = useState("en");
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifyInquiry, setNotifyInquiry] = useState(true);
  const [notifyReport, setNotifyReport] = useState(false);
  const [notifyWeekly, setNotifyWeekly] = useState(true);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("idle");
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const hasChanges = name.trim() !== "" && name !== MOCK_USER.name;

  const handleSave = () => {
    if (!hasChanges) return;
    setSaveState("saving");
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setSaveState("saved");
      timerRef.current = setTimeout(() => setSaveState("idle"), 1500);
    }, 600);
  };

  return (
    <div className="flex h-full flex-col overflow-auto">
      <TopBar title="Your profile" />
      <div className="mx-auto w-full max-w-2xl px-4 py-8 md:px-6">
        <div className="mb-8 flex items-center gap-4">
          <Avatar name={name || MOCK_USER.name} size={64} color={MOCK_USER.avatarColor} variant="solid" />
          <div>
            <p className="heading-xs text-[var(--color-text)]">{name || MOCK_USER.name}</p>
            <p className="text-sm text-[var(--color-text-secondary)]">{MOCK_USER.email}</p>
          </div>
        </div>

        <SectionHeading size="xs">Personal information</SectionHeading>

        <div className="mb-6">
          <Field label="Name" description="The name associated with this account">
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </Field>
        </div>

        <div className="mb-6">
          <Field label="Email address" description="The email address associated with this account">
            <Input defaultValue={MOCK_USER.email} disabled />
          </Field>
        </div>

        <div className="mb-6">
          <Field label="Timezone" description="Timezone used for displaying dates and times">
            <Select
              options={TIMEZONE_OPTIONS}
              value={timezone}
              onChange={(opt) => setTimezone(opt.value)}
              block
              pill={false}
              variant="outline"
            />
          </Field>
        </div>

        <div className="mb-6">
          <Field label="Language" description="Preferred language for the dashboard">
            <Select
              options={LANGUAGE_OPTIONS}
              value={language}
              onChange={(opt) => setLanguage(opt.value)}
              block
              pill={false}
              variant="outline"
            />
          </Field>
        </div>

        <div className="mb-8">
          <Field label="Default organization" description="The organization used by default when making API requests">
            <Input defaultValue={MOCK_USER.organization} disabled />
          </Field>
        </div>

        <Button
          color="primary"
          pill={false}
          onClick={handleSave}
          loading={saveState === "saving"}
          disabled={!hasChanges || saveState !== "idle"}
        >
          {saveState === "saved" ? "Saved!" : "Save"}
        </Button>

        <div className="mt-10">
          <SectionHeading size="xs">Notifications</SectionHeading>
          <div className="space-y-6">
            <ToggleSetting title="Email notifications" description="Receive email alerts for important account events" checked={notifyEmail} onCheckedChange={setNotifyEmail} />
            <ToggleSetting title="Inquiry status updates" description="Get notified when inquiries change status" checked={notifyInquiry} onCheckedChange={setNotifyInquiry} />
            <ToggleSetting title="Report matches" description="Get notified when a report returns new matches" checked={notifyReport} onCheckedChange={setNotifyReport} />
            <ToggleSetting title="Weekly summary" description="Receive a weekly digest of activity across your organization" checked={notifyWeekly} onCheckedChange={setNotifyWeekly} />
          </div>
        </div>

        <div className="mt-10">
          <SectionHeading size="xs">Security</SectionHeading>
          <div className="space-y-4 rounded-xl border border-[var(--color-border)] p-4">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-[var(--color-text)]">Two-factor authentication</p>
                <p className="mt-0.5 text-sm text-[var(--color-text-secondary)]">
                  Add an extra layer of security to your account
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                {twoFactorEnabled ? (
                  <Badge pill color="success" size="sm">Enabled</Badge>
                ) : (
                  <Badge pill color="secondary" size="sm">Disabled</Badge>
                )}
                <Button
                  color={twoFactorEnabled ? "secondary" : "primary"}
                  variant={twoFactorEnabled ? "soft" : "solid"}
                  size="sm"
                  pill={false}
                  onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                >
                  {twoFactorEnabled ? "Disable" : "Enable"}
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-[var(--color-text)]">Active sessions</p>
                <p className="mt-0.5 text-sm text-[var(--color-text-secondary)]">
                  Manage devices where you are currently logged in
                </p>
              </div>
              <Badge pill color="info" size="sm">1 active</Badge>
            </div>

            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-[var(--color-text)]">Password</p>
                <p className="mt-0.5 text-sm text-[var(--color-text-secondary)]">
                  Last changed 30 days ago
                </p>
              </div>
              <Button color="secondary" variant="soft" size="sm" pill={false}>
                Change password
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-10">
          <SectionHeading size="xs">Danger zone</SectionHeading>
          <div className="rounded-xl border border-[var(--color-danger-outline-border)] p-4">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-[var(--color-text)]">Delete account</p>
                <p className="mt-0.5 text-sm text-[var(--color-text-secondary)]">
                  Permanently remove your account and all associated data. This action cannot be undone.
                </p>
              </div>
              <Button color="danger" variant="soft" size="sm" pill={false}>
                Delete account
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
