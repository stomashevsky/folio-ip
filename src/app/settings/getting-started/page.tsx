"use client";

import { TopBar } from "@/components/layout/TopBar";
import { Button } from "@plexui/ui/components/Button";
import { CheckCircle } from "@plexui/ui/components/Icon";

interface SetupStep {
  title: string;
  description: string;
  completed: boolean;
  href: string;
}

const steps: SetupStep[] = [
  {
    title: "Create your first inquiry template",
    description: "Set up a KYC verification flow",
    completed: true,
    href: "/inquiries/templates",
  },
  {
    title: "Configure verification checks",
    description: "Choose which checks to run",
    completed: true,
    href: "/verifications/templates",
  },
  {
    title: "Set up webhooks",
    description: "Receive real-time event notifications",
    completed: false,
    href: "/settings/webhooks",
  },
  {
    title: "Add team members",
    description: "Invite your team to collaborate",
    completed: false,
    href: "/settings/team",
  },
  {
    title: "Integrate the API",
    description: "Connect your application",
    completed: false,
    href: "/developers/api-keys",
  },
  {
    title: "Go live",
    description: "Switch from sandbox to production",
    completed: false,
    href: "/settings/project",
  },
];

export default function GettingStartedPage() {
  return (
    <div className="flex h-full flex-col overflow-auto">
      <TopBar title="Getting Started" />
      <div className="mx-auto w-full max-w-2xl px-4 py-8 md:px-6">
        <div className="space-y-3">
          {steps.map((step, index) => (
            <div
              key={index}
              className="rounded-lg border border-[var(--color-border)] p-4 hover:bg-[var(--color-surface)] transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="mt-1 flex-shrink-0">
                  {step.completed ? (
                    <CheckCircle
                      style={{
                        width: 24,
                        height: 24,
                        color: "var(--color-success-solid-bg)",
                      }}
                    />
                  ) : (
                    <div
                      className="rounded-full border-2 border-[var(--color-text-tertiary)]"
                      style={{
                        width: 24,
                        height: 24,
                      }}
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="heading-xs text-[var(--color-text)] mb-1">
                    {step.title}
                  </h3>
                  <p className="text-sm text-[var(--color-text-secondary)] mb-3">
                    {step.description}
                  </p>
                  <Button
                    color="primary"
                    variant="ghost"
                    size="sm"
                    pill={false}
                    onClick={() => {
                      window.location.href = step.href;
                    }}
                  >
                    {step.completed ? "Review" : "Get started"}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
