"use client";

import { useParams } from "next/navigation";
import { TopBar, TOPBAR_CONTROL_SIZE, TOPBAR_ACTION_PILL } from "@/components/layout/TopBar";
import { NotFoundPage, SectionHeading, StatusBadge } from "@/components/shared";
import { Badge, type BadgeProps } from "@plexui/ui/components/Badge";
import { getPriorityColor } from "@/lib/utils/format";
import { Button } from "@plexui/ui/components/Button";
import { Input } from "@plexui/ui/components/Input";
import { Field } from "@plexui/ui/components/Field";
import { Checkbox } from "@plexui/ui/components/Checkbox";

interface CaseTemplate {
  id: string;
  name: string;
  description: string;
  status: "active" | "draft" | "archived";
  priority: string;
  queue: string;
  stepsCount: number;
  createdAt: string;
  updatedAt: string;
}

const MOCK_TEMPLATES: CaseTemplate[] = [
  { id: "tmpl_001", name: "Fraud Investigation", description: "Standard fraud case workflow with verification steps", status: "active", priority: "high", queue: "Fraud Investigation", stepsCount: 5, createdAt: "2025-01-15T10:30:00Z", updatedAt: "2025-02-10T14:20:00Z" },
  { id: "tmpl_002", name: "Compliance Review", description: "Regulatory compliance case template", status: "active", priority: "critical", queue: "Compliance", stepsCount: 7, createdAt: "2025-01-10T09:15:00Z", updatedAt: "2025-02-05T11:45:00Z" },
  { id: "tmpl_003", name: "VIP Account Onboarding", description: "Enhanced onboarding for VIP customers", status: "active", priority: "high", queue: "VIP Accounts", stepsCount: 4, createdAt: "2025-01-20T13:00:00Z", updatedAt: "2025-02-08T16:30:00Z" },
  { id: "tmpl_004", name: "General Review", description: "Standard case review workflow", status: "draft", priority: "medium", queue: "General Review", stepsCount: 3, createdAt: "2025-02-01T08:00:00Z", updatedAt: "2025-02-15T10:00:00Z" },
  { id: "tmpl_005", name: "Escalation Handler", description: "Workflow for escalated cases", status: "active", priority: "critical", queue: "Escalations", stepsCount: 6, createdAt: "2025-01-25T12:30:00Z", updatedAt: "2025-02-12T09:20:00Z" },
];

const WORKFLOW_STEPS = [
  { title: "Identity Verification", description: "Verify the identity of the subject", required: true },
  { title: "Document Review", description: "Review submitted documents for authenticity", required: true },
  { title: "Risk Assessment", description: "Evaluate risk level based on collected data", required: true },
  { title: "Manager Approval", description: "Obtain approval from a senior reviewer", required: false },
  { title: "Final Decision", description: "Make the final determination on the case", required: true },
  { title: "Customer Notification", description: "Notify the customer of the outcome", required: false },
  { title: "Compliance Filing", description: "File required regulatory reports", required: false },
];



export default function CaseTemplateDetailPage() {
  const params = useParams();
  const template = MOCK_TEMPLATES.find((t) => t.id === params.id);

  if (!template) {
    return <NotFoundPage section="Case Templates" backHref="/platform/cases/templates" entity="Template" />;
  }

  const steps = WORKFLOW_STEPS.slice(0, template.stepsCount);

  return (
    <div className="flex h-full flex-col overflow-auto">
      <TopBar
        title={template.name}
        backHref="/platform/cases/templates"
        actions={
          <div className="flex items-center gap-2">
            <StatusBadge status={template.status} />
            <Button color="primary" size={TOPBAR_CONTROL_SIZE} pill={TOPBAR_ACTION_PILL}>
              Save Changes
            </Button>
          </div>
        }
      />

      <div className="mx-auto w-full max-w-2xl px-4 py-8 md:px-6">
        <SectionHeading size="xs">Details</SectionHeading>
        <div className="mt-4 space-y-4">
          <Field label="Name">
            <Input defaultValue={template.name} size="sm" />
          </Field>
          <Field label="Description">
            <Input defaultValue={template.description} size="sm" />
          </Field>
          <div className="flex gap-6">
            <Field label="Priority">
              <div className="py-1">
                <Badge color={getPriorityColor(template.priority) as BadgeProps["color"]} variant="soft" size="sm">
                  {template.priority.charAt(0).toUpperCase() + template.priority.slice(1)}
                </Badge>
              </div>
            </Field>
            <Field label="Queue">
              <div className="py-1">
                <span className="text-sm text-[var(--color-text)]">{template.queue}</span>
              </div>
            </Field>
          </div>
        </div>

        <div className="mt-10">
          <SectionHeading size="xs">Workflow Steps</SectionHeading>
          <div className="mt-4 space-y-3">
            {steps.map((step, index) => (
              <div
                key={index}
                className="flex items-start gap-4 rounded-lg border border-[var(--color-border)] px-4 py-3"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--color-surface-secondary)] text-xs font-medium text-[var(--color-text)]">
                  {index + 1}
                </span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-[var(--color-text)]">{step.title}</p>
                  <p className="mt-0.5 text-xs text-[var(--color-text-secondary)]">{step.description}</p>
                </div>
                <Checkbox checked={step.required} label="Required" onCheckedChange={() => {}} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
