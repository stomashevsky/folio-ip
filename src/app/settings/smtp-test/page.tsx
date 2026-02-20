"use client";

import { useState, useRef } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { SectionHeading } from "@/components/shared";
import { Button } from "@plexui/ui/components/Button";
import { Badge } from "@plexui/ui/components/Badge";
import { Input } from "@plexui/ui/components/Input";
import { Field } from "@plexui/ui/components/Field";

interface TestResult {
  id: string;
  recipient: string;
  status: "success" | "failed";
  sentAt: string;
  responseTime: string;
}

const mockTestResults: TestResult[] = [
  {
    id: "test_001",
    recipient: "admin@example.com",
    status: "success",
    sentAt: "2026-02-20 14:32:00",
    responseTime: "245ms",
  },
  {
    id: "test_002",
    recipient: "dev@example.com",
    status: "success",
    sentAt: "2026-02-20 13:15:00",
    responseTime: "198ms",
  },
  {
    id: "test_003",
    recipient: "test@example.com",
    status: "failed",
    sentAt: "2026-02-20 12:00:00",
    responseTime: "5000ms",
  },
];

export default function SmtpTestPage() {
  const [host, setHost] = useState("smtp.example.com");
  const [port, setPort] = useState("587");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [testEmail, setTestEmail] = useState("");
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

  const handleSendTest = () => {
    if (testEmail.trim()) {
      setTestEmail("");
    }
  };

  return (
    <div className="flex h-full flex-col overflow-auto">
      <TopBar title="SMTP Test" />
      <div className="mx-auto w-full max-w-2xl px-4 py-8 md:px-6">
        {/* SMTP Configuration */}
        <SectionHeading size="xs">SMTP Configuration</SectionHeading>
        <div className="mb-6">
          <Field label="Host" description="SMTP server hostname">
            <Input
              value={host}
              onChange={(e) => setHost(e.target.value)}
              placeholder="smtp.example.com"
            />
          </Field>
        </div>

        <div className="mb-6">
          <Field label="Port" description="SMTP server port">
            <Input
              type="number"
              value={port}
              onChange={(e) => setPort(e.target.value)}
              placeholder="587"
            />
          </Field>
        </div>

        <div className="mb-6">
          <Field label="Username" description="SMTP authentication username">
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="your-email@example.com"
            />
          </Field>
        </div>

        <div className="mb-6">
          <Field label="Password" description="SMTP authentication password">
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </Field>
        </div>

        <div className="mb-8">
          <Field label="Encryption" description="Connection encryption method">
            <Input value="TLS" disabled />
          </Field>
        </div>

        <div className="mb-10">
          <Button
            color="primary"
            pill={false}
            onClick={handleSave}
            loading={saveState === "saving"}
            disabled={saveState !== "idle"}
          >
            {saveState === "saved" ? "Saved!" : "Save Configuration"}
          </Button>
        </div>

        {/* Send Test Email */}
        <SectionHeading size="xs">Send Test Email</SectionHeading>
        <div className="mb-6">
          <Field
            label="Recipient Email"
            description="Email address to send test message to"
          >
            <div className="flex gap-2">
              <Input
                placeholder="test@example.com"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                className="flex-1"
              />
              <Button
                color="primary"
                size="md"
                pill={false}
                onClick={handleSendTest}
              >
                Send Test
              </Button>
            </div>
          </Field>
        </div>

        {/* Recent Tests */}
        <SectionHeading size="xs">Recent Tests</SectionHeading>
        <div className="rounded-lg border border-[var(--color-border)] overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
                <th className="px-4 py-3 text-left text-sm font-medium text-[var(--color-text)]">
                  Recipient
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[var(--color-text)]">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[var(--color-text)]">
                  Sent At
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[var(--color-text)]">
                  Response Time
                </th>
              </tr>
            </thead>
            <tbody>
              {mockTestResults.map((result) => (
                <tr
                  key={result.id}
                  className="border-b border-[var(--color-border)] last:border-b-0"
                >
                  <td className="px-4 py-3 text-sm text-[var(--color-text)]">
                    {result.recipient}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <Badge
                      color={result.status === "success" ? "success" : "danger"}
                      variant="soft"
                      size="sm"
                    >
                      {result.status.charAt(0).toUpperCase() +
                        result.status.slice(1)}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-sm text-[var(--color-text-secondary)]">
                    {result.sentAt}
                  </td>
                  <td className="px-4 py-3 text-sm text-[var(--color-text-secondary)]">
                    {result.responseTime}
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
