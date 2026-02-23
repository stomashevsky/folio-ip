"use client";

import { useState, useRef } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { SectionHeading, ToggleSetting } from "@/components/shared";
import { Field } from "@plexui/ui/components/Field";
import { Input } from "@plexui/ui/components/Input";
import { Textarea } from "@plexui/ui/components/Textarea";
import { Button } from "@plexui/ui/components/Button";

export default function SecurityPage() {
  const [twoFactorRequired, setTwoFactorRequired] = useState(false);
  const [ssoEnabled, setSsoEnabled] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState("30");
  const [forceLogoutOnClose, setForceLogoutOnClose] = useState(false);
  const [allowedIps, setAllowedIps] = useState("");
  const [requireUppercase, setRequireUppercase] = useState(true);
  const [requireNumbers, setRequireNumbers] = useState(true);
  const [requireSpecialChars, setRequireSpecialChars] = useState(true);
  const [minLength, setMinLength] = useState("8");
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("idle");
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const handleSave = () => {
    setSaveState("saving");
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setSaveState("saved");
      timerRef.current = setTimeout(() => setSaveState("idle"), 1500);
    }, 600);
  };

  return (
    <div className="flex h-full flex-col overflow-auto">
      <TopBar title="Security" />
      <div className="mx-auto w-full max-w-2xl px-4 py-8 md:px-6">
        {/* Authentication */}
        <SectionHeading size="xs">Authentication</SectionHeading>

        <div className="mb-6">
          <ToggleSetting switchLabel="Require two-factor authentication" checked={twoFactorRequired} onCheckedChange={setTwoFactorRequired} />
        </div>

        <div className="mb-8">
          <ToggleSetting switchLabel="Allow SSO login" checked={ssoEnabled} onCheckedChange={setSsoEnabled} />
        </div>

        {/* Session Management */}
        <SectionHeading size="xs">Session Management</SectionHeading>

        <div className="mb-6">
          <Field label="Session timeout (minutes)" description="Automatically log out users after this period of inactivity">
            <Input
              type="number"
              value={sessionTimeout}
              onChange={(e) => setSessionTimeout(e.target.value)}
              min="1"
              max="1440"
            />
          </Field>
        </div>

        <div className="mb-8">
          <ToggleSetting switchLabel="Force logout on browser close" checked={forceLogoutOnClose} onCheckedChange={setForceLogoutOnClose} />
        </div>

        {/* IP Allowlist */}
        <SectionHeading size="xs">IP Allowlist</SectionHeading>

        <div className="mb-8">
          <Field label="Allowed IP addresses" description="Leave empty to allow all IPs">
            <Textarea
              value={allowedIps}
              onChange={(e) => setAllowedIps(e.target.value)}
              placeholder="One IP per line..."
              rows={4}
            />
          </Field>
        </div>

        {/* Password Policy */}
        <SectionHeading size="xs">Password Policy</SectionHeading>

        <div className="mb-6">
          <ToggleSetting switchLabel="Require uppercase letters" checked={requireUppercase} onCheckedChange={setRequireUppercase} />
        </div>

        <div className="mb-6">
          <ToggleSetting switchLabel="Require numbers" checked={requireNumbers} onCheckedChange={setRequireNumbers} />
        </div>

        <div className="mb-6">
          <ToggleSetting switchLabel="Require special characters" checked={requireSpecialChars} onCheckedChange={setRequireSpecialChars} />
        </div>

        <div className="mb-8">
          <Field label="Minimum password length" description="Minimum number of characters required">
            <Input
              type="number"
              value={minLength}
              onChange={(e) => setMinLength(e.target.value)}
              min="4"
              max="128"
            />
          </Field>
        </div>

        <Button
          color="primary"
          pill={false}
          onClick={handleSave}
          loading={saveState === "saving"}
          disabled={saveState !== "idle"}
        >
          {saveState === "saved" ? "Saved!" : "Save"}
        </Button>
      </div>
    </div>
  );
}
