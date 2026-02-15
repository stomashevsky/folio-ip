"use client";

import { useRef, useState } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { SectionHeading } from "@/components/shared";
import { Switch } from "@plexui/ui/components/Switch";
import { Button } from "@plexui/ui/components/Button";

interface NotificationSetting {
  id: string;
  label: string;
  description: string;
  defaultEnabled: boolean;
}

const emailNotifications: NotificationSetting[] = [
  {
    id: "inquiry_completed",
    label: "Inquiry completed",
    description: "Receive an email when an inquiry finishes processing",
    defaultEnabled: true,
  },
  {
    id: "inquiry_failed",
    label: "Inquiry failed",
    description: "Receive an email when an inquiry fails or is declined",
    defaultEnabled: true,
  },
  {
    id: "daily_summary",
    label: "Daily summary",
    description: "Receive a daily digest of verification activity",
    defaultEnabled: false,
  },
  {
    id: "weekly_report",
    label: "Weekly report",
    description:
      "Receive a weekly analytics report for your organization",
    defaultEnabled: true,
  },
];

const alertNotifications: NotificationSetting[] = [
  {
    id: "high_risk",
    label: "High-risk matches",
    description: "Get alerted when a verification triggers a high-risk signal",
    defaultEnabled: true,
  },
  {
    id: "api_errors",
    label: "API errors",
    description: "Get alerted when API error rates exceed threshold",
    defaultEnabled: false,
  },
  {
    id: "usage_limit",
    label: "Usage limit warnings",
    description:
      "Get alerted when approaching monthly verification limits",
    defaultEnabled: true,
  },
];

const allSettings = [...emailNotifications, ...alertNotifications];

function buildInitialState() {
  return Object.fromEntries(allSettings.map((s) => [s.id, s.defaultEnabled]));
}

function NotificationGroup({
  title,
  settings,
  enabled,
  onToggle,
}: {
  title: string;
  settings: NotificationSetting[];
  enabled: Record<string, boolean>;
  onToggle: (id: string, checked: boolean) => void;
}) {
  return (
    <div className="mb-8">
      <SectionHeading size="xs">{title}</SectionHeading>
      <div className="divide-y divide-[var(--color-border)] rounded-lg border border-[var(--color-border)]">
        {settings.map((setting) => (
          <div
            key={setting.id}
            className="flex items-center justify-between px-4 py-4"
          >
            <div className="mr-4">
              <p className="text-sm font-medium text-[var(--color-text)]">
                {setting.label}
              </p>
              <p className="text-sm text-[var(--color-text-secondary)]">
                {setting.description}
              </p>
            </div>
            <Switch
              checked={enabled[setting.id]}
              onCheckedChange={(checked) => onToggle(setting.id, checked)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function NotificationsPage() {
  const [enabled, setEnabled] = useState<Record<string, boolean>>(
    buildInitialState,
  );
  const [savedSnapshot, setSavedSnapshot] = useState<Record<string, boolean>>(
    buildInitialState,
  );
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">(
    "idle",
  );
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const hasChanges = allSettings.some(
    (s) => enabled[s.id] !== savedSnapshot[s.id],
  );

  const handleToggle = (id: string, checked: boolean) => {
    setEnabled((prev) => ({ ...prev, [id]: checked }));
  };

  const handleSave = () => {
    if (!hasChanges) return;
    setSaveState("saving");
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setSavedSnapshot({ ...enabled });
      setSaveState("saved");
      timerRef.current = setTimeout(() => setSaveState("idle"), 1500);
    }, 600);
  };

  return (
    <div className="flex h-full flex-col overflow-auto">
      <TopBar title="Notifications" />
      <div className="mx-auto w-full max-w-2xl px-4 py-8 md:px-6">
        <p className="mb-6 text-sm text-[var(--color-text-secondary)]">
          Choose which notifications you want to receive and how you want to be
          notified.
        </p>

        <NotificationGroup
          title="Email notifications"
          settings={emailNotifications}
          enabled={enabled}
          onToggle={handleToggle}
        />
        <NotificationGroup
          title="Alerts"
          settings={alertNotifications}
          enabled={enabled}
          onToggle={handleToggle}
        />

        <Button
          color="primary"
          pill={false}
          onClick={handleSave}
          loading={saveState === "saving"}
          disabled={!hasChanges || saveState !== "idle"}
        >
          {saveState === "saved" ? "Saved!" : "Save"}
        </Button>
      </div>
    </div>
  );
}
