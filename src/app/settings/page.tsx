import { TopBar } from "@/components/layout/TopBar";
import { ChartCard } from "@/components/shared";
import { Shield, Globe, Key, Bell } from "lucide-react";

export default function SettingsPage() {
  return (
    <main className="flex-1">
      <TopBar title="Settings" description="Configuration and preferences" />
      <div className="px-6 pb-6 pt-6">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <ChartCard title="General" description="Basic configuration">
            <div className="space-y-4">
              {[
                {
                  icon: Globe,
                  label: "Environment",
                  value: "Sandbox",
                  description: "Using simulated data for testing",
                },
                {
                  icon: Key,
                  label: "API Key",
                  value: "sk_test_•••••••••",
                  description: "Test mode API key",
                },
                {
                  icon: Shield,
                  label: "Security",
                  value: "Standard",
                  description: "Default security configuration",
                },
                {
                  icon: Bell,
                  label: "Notifications",
                  value: "Enabled",
                  description: "Email notifications for completed inquiries",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-4 rounded-lg bg-[var(--color-surface-secondary)] p-4"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-surface)]">
                    <item.icon className="h-5 w-5 text-[var(--color-text-tertiary)]" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-[var(--color-text)]">
                        {item.label}
                      </span>
                      <span className="text-sm text-[var(--color-text-secondary)]">
                        {item.value}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-[var(--color-text-tertiary)]">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ChartCard>

          <ChartCard
            title="About"
            description="Dashboard information"
          >
            <div className="space-y-3">
              {[
                ["Application", "Folio — Identity Dashboard"],
                ["Version", "1.0.0"],
                ["Framework", "Next.js 16 (App Router)"],
                ["UI Kit", "PlexUI"],
                ["Data Source", "Mock (Sandbox)"],
              ].map(([label, value]) => (
                <div key={label} className="flex items-start justify-between">
                  <span className="text-sm text-[var(--color-text-tertiary)]">
                    {label}
                  </span>
                  <span className="text-sm font-medium text-[var(--color-text)]">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>
      </div>
    </main>
  );
}
