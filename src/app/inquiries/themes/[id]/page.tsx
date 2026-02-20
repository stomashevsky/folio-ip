"use client";

import { useParams } from "next/navigation";
import { TopBar, TOPBAR_CONTROL_SIZE, TOPBAR_ACTION_PILL } from "@/components/layout/TopBar";
import { NotFoundPage, SectionHeading } from "@/components/shared";
import { Badge } from "@plexui/ui/components/Badge";
import { Button } from "@plexui/ui/components/Button";
import { Input } from "@plexui/ui/components/Input";
import { Textarea } from "@plexui/ui/components/Textarea";
import { Field } from "@plexui/ui/components/Field";

interface Theme {
  id: string;
  name: string;
  description: string;
  status: "active" | "draft";
  primaryColor: string;
  logoUrl: string;
  usedBy: number;
  updatedAt: string;
}

const MOCK_THEMES: Theme[] = [
  { id: "th_001", name: "Default", description: "Standard light theme", status: "active", primaryColor: "#0066CC", logoUrl: "https://example.com/logo-default.png", usedBy: 45, updatedAt: "2025-02-15T10:30:00Z" },
  { id: "th_002", name: "Corporate Blue", description: "Professional blue color scheme", status: "active", primaryColor: "#003D99", logoUrl: "https://example.com/logo-blue.png", usedBy: 28, updatedAt: "2025-02-10T14:15:00Z" },
  { id: "th_003", name: "Modern Dark", description: "Dark mode with modern aesthetics", status: "active", primaryColor: "#1A1A1A", logoUrl: "https://example.com/logo-dark.png", usedBy: 12, updatedAt: "2025-02-08T09:45:00Z" },
  { id: "th_004", name: "Minimal Light", description: "Clean and minimal light theme", status: "draft", primaryColor: "#F5F5F5", logoUrl: "https://example.com/logo-minimal.png", usedBy: 0, updatedAt: "2025-02-05T11:20:00Z" },
  { id: "th_005", name: "Custom Brand", description: "Client-specific branding", status: "active", primaryColor: "#FF6B35", logoUrl: "https://example.com/logo-custom.png", usedBy: 8, updatedAt: "2025-02-01T16:00:00Z" },
];

export default function ThemeDetailPage() {
  const params = useParams();
  const theme = MOCK_THEMES.find((t) => t.id === params.id);

  if (!theme) {
    return <NotFoundPage section="Themes" backHref="/inquiries/themes" entity="Theme" />;
  }

  return (
    <div className="flex h-full flex-col overflow-auto">
      <TopBar
        title={theme.name}
        backHref="/inquiries/themes"
        actions={
          <div className="flex items-center gap-2">
            <Badge color={theme.status === "active" ? "success" : "secondary"} variant="soft" size="sm">
              {theme.status === "active" ? "Active" : "Draft"}
            </Badge>
            <Button color="primary" size={TOPBAR_CONTROL_SIZE} pill={TOPBAR_ACTION_PILL}>
              Save Changes
            </Button>
          </div>
        }
      />

      <div className="mx-auto w-full max-w-2xl px-4 py-8 md:px-6">
        <SectionHeading size="xs">Details</SectionHeading>
        <div className="mt-4 space-y-4">
          <Field label="Theme Name">
            <Input defaultValue={theme.name} size="sm" />
          </Field>
          <Field label="Description">
            <Textarea defaultValue={theme.description} rows={2} />
          </Field>
        </div>

        <div className="mt-10">
          <SectionHeading size="xs">Branding</SectionHeading>
          <div className="mt-4 space-y-4">
            <Field label="Primary Color" description="The main brand color used in the verification flow">
              <div className="flex items-center gap-3">
                <span
                  className="inline-block h-8 w-8 rounded-lg border border-[var(--color-border)]"
                  style={{ backgroundColor: theme.primaryColor }}
                />
                <Input defaultValue={theme.primaryColor} size="sm" />
              </div>
            </Field>
            <Field label="Logo URL">
              <Input defaultValue={theme.logoUrl} size="sm" />
            </Field>
          </div>
        </div>

        <div className="mt-10">
          <SectionHeading size="xs">Usage</SectionHeading>
          <div className="mt-3">
            <p className="text-sm text-[var(--color-text-secondary)]">
              This theme is used by <span className="font-medium text-[var(--color-text)]">{theme.usedBy}</span> inquiry templates.
            </p>
          </div>
        </div>

        <div className="mt-10">
          <SectionHeading size="xs">Preview</SectionHeading>
          <div className="mt-4 overflow-hidden rounded-xl border border-[var(--color-border)]">
            <div className="px-6 py-4" style={{ backgroundColor: theme.primaryColor }}>
              <p className="text-sm font-medium text-white">Verification Flow Header</p>
            </div>
            <div className="bg-[var(--color-surface)] px-6 py-8">
              <p className="heading-xs text-[var(--color-text)]">Verify your identity</p>
              <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
                Please provide a valid government-issued ID to continue.
              </p>
              <div className="mt-4">
                <Button color="primary" size="md" pill={false}>
                  Start Verification
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
