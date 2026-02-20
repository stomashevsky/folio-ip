"use client";

import { useState } from "react";
import Link from "next/link";
import { TopBar } from "@/components/layout/TopBar";
import { Button } from "@plexui/ui/components/Button";
import { CheckCircle } from "@plexui/ui/components/Icon";

interface SetupStep {
  title: string;
  description: string;
  href: string;
}

const steps: SetupStep[] = [
  {
    title: "Create your first inquiry template",
    description: "Set up a KYC verification flow to collect identity documents",
    href: "/inquiries/templates",
  },
  {
    title: "Configure verification checks",
    description: "Choose which checks to run on submitted documents",
    href: "/verifications/templates",
  },
  {
    title: "Set up webhooks",
    description: "Receive real-time event notifications in your application",
    href: "/settings/webhooks",
  },
  {
    title: "Add team members",
    description: "Invite your team to collaborate on reviews",
    href: "/settings/team",
  },
  {
    title: "Integrate the API",
    description: "Connect your application using API keys",
    href: "/settings/api-keys",
  },
  {
    title: "Set up continuous monitoring",
    description: "Configure automated screening and watchlist monitoring",
    href: "/reports/templates",
  },
  {
    title: "Create your first workflow",
    description: "Automate your KYC process with workflow rules",
    href: "/platform/workflows",
  },
  {
    title: "Go live",
    description: "Switch from sandbox to production environment",
    href: "/settings/project",
  },
];

export default function GettingStartedPage() {
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(
    new Set([0, 1])
  );

  const toggleStep = (index: number) => {
    setCompletedSteps((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  return (
    <div className="flex h-full flex-col overflow-auto">
      <TopBar title="Getting Started" />
      <div className="mx-auto w-full max-w-2xl px-4 py-8 md:px-6">
        {/* Progress */}
        <div className="mb-8">
          <div className="mb-2 flex items-center justify-between">
            <span className="heading-xs text-[var(--color-text)]">
              Setup Progress
            </span>
            <span className="text-sm text-[var(--color-text-secondary)]">
              {completedSteps.size} of {steps.length} completed
            </span>
          </div>
          <div className="h-2 rounded-full bg-[var(--color-border)]">
            <div
              className="h-2 rounded-full bg-[var(--color-primary-solid-bg)] transition-all duration-300"
              style={{
                width: `${(completedSteps.size / steps.length) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-3">
          {steps.map((step, index) => (
            <div
              key={index}
              className="rounded-lg border border-[var(--color-border)] p-4 transition-colors hover:bg-[var(--color-surface)]"
            >
              <div className="flex items-start gap-4">
                <button
                  type="button"
                  onClick={() => toggleStep(index)}
                  className="mt-1 flex-shrink-0 cursor-pointer"
                >
                  {completedSteps.has(index) ? (
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
                      style={{ width: 24, height: 24 }}
                    />
                  )}
                </button>
                <div className="min-w-0 flex-1">
                  <h3 className="heading-xs mb-1 text-[var(--color-text)]">
                    {step.title}
                  </h3>
                  <p className="text-sm text-[var(--color-text-secondary)] mb-3">
                    {step.description}
                  </p>
                  <Link href={step.href}>
                    <Button
                      color="primary"
                      variant="soft"
                      size="sm"
                      pill={false}
                    >
                      {completedSteps.has(index) ? "Review" : "Get started"}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
