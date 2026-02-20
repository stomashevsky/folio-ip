"use client";

import { useState } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { SectionHeading } from "@/components/shared";
import { Field } from "@plexui/ui/components/Field";
import { Switch } from "@plexui/ui/components/Switch";
import { Input } from "@plexui/ui/components/Input";
import { Textarea } from "@plexui/ui/components/Textarea";

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

  return (
    <div className="flex h-full flex-col overflow-auto">
      <TopBar title="Security" />
      <div className="mx-auto w-full max-w-2xl px-4 py-8 md:px-6">
        {/* Authentication */}
        <SectionHeading size="xs">Authentication</SectionHeading>

        <div className="mb-6">
          <Field label="Require two-factor authentication">
            <Switch
              checked={twoFactorRequired}
              onCheckedChange={setTwoFactorRequired}
            />
          </Field>
        </div>

        <div className="mb-8">
          <Field label="Allow SSO login">
            <Switch checked={ssoEnabled} onCheckedChange={setSsoEnabled} />
          </Field>
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
          <Field label="Force logout on browser close">
            <Switch
              checked={forceLogoutOnClose}
              onCheckedChange={setForceLogoutOnClose}
            />
          </Field>
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
          <Field label="Require uppercase letters">
            <Switch
              checked={requireUppercase}
              onCheckedChange={setRequireUppercase}
            />
          </Field>
        </div>

        <div className="mb-6">
          <Field label="Require numbers">
            <Switch
              checked={requireNumbers}
              onCheckedChange={setRequireNumbers}
            />
          </Field>
        </div>

        <div className="mb-6">
          <Field label="Require special characters">
            <Switch
              checked={requireSpecialChars}
              onCheckedChange={setRequireSpecialChars}
            />
          </Field>
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
      </div>
    </div>
  );
}
