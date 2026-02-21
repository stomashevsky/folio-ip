"use client";

import { useParams } from "next/navigation";
import { TopBar, TOPBAR_CONTROL_SIZE, TOPBAR_ACTION_PILL } from "@/components/layout/TopBar";
import { NotFoundPage, SectionHeading } from "@/components/shared";
import { Badge, type BadgeProps } from "@plexui/ui/components/Badge";
import { Button } from "@plexui/ui/components/Button";
import { Input } from "@plexui/ui/components/Input";
import { Textarea } from "@plexui/ui/components/Textarea";
import { Field } from "@plexui/ui/components/Field";
import { Switch } from "@plexui/ui/components/Switch";
import { formatDateTime, getNodeTypeColor } from "@/lib/utils/format";

interface GraphTemplate {
  id: string;
  name: string;
  description: string;
  nodeTypes: string[];
  edgeTypes: string[];
  isDefault: boolean;
  createdAt: string;
}

const MOCK_TEMPLATES: GraphTemplate[] = [
  { id: "tpl_001", name: "Full Network", description: "Complete graph with all entity types and relationships", nodeTypes: ["account", "inquiry", "verification", "device"], edgeTypes: ["owns", "submitted", "verified_by", "same_device", "same_ip", "linked_to"], isDefault: true, createdAt: "2025-02-15T10:00:00Z" },
  { id: "tpl_002", name: "Account Connections", description: "Focus on account relationships and linked accounts", nodeTypes: ["account", "device"], edgeTypes: ["same_device", "same_ip", "linked_to"], isDefault: false, createdAt: "2025-02-14T14:30:00Z" },
  { id: "tpl_003", name: "Device Fingerprints", description: "Device-centric view with shared attributes", nodeTypes: ["device", "account"], edgeTypes: ["same_device", "same_ip"], isDefault: false, createdAt: "2025-02-13T09:15:00Z" },
  { id: "tpl_004", name: "Verification Chain", description: "Inquiry and verification flow visualization", nodeTypes: ["inquiry", "verification", "account"], edgeTypes: ["submitted", "verified_by", "owns"], isDefault: false, createdAt: "2025-02-12T16:45:00Z" },
  { id: "tpl_005", name: "Fraud Ring Detection", description: "Suspicious pattern detection across entities", nodeTypes: ["account", "device", "inquiry"], edgeTypes: ["same_ip", "same_device", "linked_to"], isDefault: false, createdAt: "2025-02-11T11:20:00Z" },
];



export default function GraphTemplateDetailPage() {
  const params = useParams();
  const template = MOCK_TEMPLATES.find((t) => t.id === params.id);

  if (!template) {
    return <NotFoundPage section="Graph Templates" backHref="/platform/graph/templates" entity="Template" />;
  }

  return (
    <div className="flex h-full flex-col overflow-auto">
      <TopBar
        title={template.name}
        backHref="/platform/graph/templates"
        actions={
          <div className="flex items-center gap-2">
            {template.isDefault ? (
              <Badge color="info" variant="soft" size="sm">Default</Badge>
            ) : (
              <Badge color="secondary" variant="soft" size="sm">Custom</Badge>
            )}
            <Button color="secondary" variant="outline" size={TOPBAR_CONTROL_SIZE} pill={TOPBAR_ACTION_PILL}>
              Duplicate
            </Button>
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
            <Input defaultValue={template.name} />
          </Field>
          <Field label="Description">
            <Textarea defaultValue={template.description} rows={2} />
          </Field>
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium text-[var(--color-text)]">Set as default</p>
              <p className="text-xs text-[var(--color-text-tertiary)]">Use this template when opening the Graph Explorer</p>
            </div>
            <Switch checked={template.isDefault} onCheckedChange={() => {}} />
          </div>
          <p className="text-xs text-[var(--color-text-tertiary)]">
            Created {formatDateTime(template.createdAt)}
          </p>
        </div>

        <div className="mt-10">
          <SectionHeading size="xs">Included Node Types</SectionHeading>
          <p className="mt-1 text-xs text-[var(--color-text-tertiary)]">
            Entity types that will be shown in the graph when this template is active.
          </p>
          <div className="mt-4 space-y-2">
            {["account", "inquiry", "verification", "device", "ip_address", "email"].map((nodeType) => {
              const included = template.nodeTypes.includes(nodeType);
              return (
                <div key={nodeType} className="flex items-center justify-between rounded-lg border border-[var(--color-border)] px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Badge color={getNodeTypeColor(nodeType) as BadgeProps["color"]} variant="soft" size="sm">
                      {nodeType.replace("_", " ")}
                    </Badge>
                  </div>
                  <Switch checked={included} onCheckedChange={() => {}} />
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-10">
          <SectionHeading size="xs">Included Edge Types</SectionHeading>
          <p className="mt-1 text-xs text-[var(--color-text-tertiary)]">
            Relationship types that will be displayed between nodes.
          </p>
          <div className="mt-4 space-y-2">
            {["owns", "submitted", "verified_by", "same_device", "same_ip", "same_email", "linked_to", "flagged_by", "similar_document"].map((edgeType) => {
              const included = template.edgeTypes.includes(edgeType);
              return (
                <div key={edgeType} className="flex items-center justify-between rounded-lg border border-[var(--color-border)] px-4 py-3">
                  <span className="text-sm text-[var(--color-text)]">{edgeType.replace(/_/g, " ")}</span>
                  <Switch checked={included} onCheckedChange={() => {}} />
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-10">
          <SectionHeading size="xs">Danger Zone</SectionHeading>
          <div className="mt-4 rounded-lg border border-[var(--color-border-danger-surface)] p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[var(--color-text)]">Delete template</p>
                <p className="text-xs text-[var(--color-text-tertiary)]">
                  This action cannot be undone. The template will be permanently removed.
                </p>
              </div>
              <Button color="danger" variant="outline" size="sm">
                Delete
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
