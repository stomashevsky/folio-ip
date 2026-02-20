"use client";

import { Badge } from "@plexui/ui/components/Badge";
import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";
import type { VerificationType } from "@/lib/types";

interface FlowNodeData extends Record<string, unknown> {
  nodeType: string;
  label: string;
  verificationType?: VerificationType;
  required?: boolean;
  maxRetries?: number;
}

const verificationLabels: Record<VerificationType, { label: string }> = {
  government_id: { label: "Government ID" },
  selfie: { label: "Selfie" },
  database: { label: "Database" },
  document: { label: "Document" },
  aamva: { label: "AAMVA" },
  database_phone_carrier: { label: "Phone Carrier DB" },
  database_ssn: { label: "SSN Database" },
  email_address: { label: "Email Address" },
  phone_number: { label: "Phone Number" },
  health_insurance_card: { label: "Health Insurance" },
  vehicle_insurance: { label: "Vehicle Insurance" },
};

type VerificationFlowNode = Node<FlowNodeData, "verification">;

export function VerificationNode({ data }: NodeProps<VerificationFlowNode>) {
  const verificationType = data.verificationType ?? "government_id";
  const config = verificationLabels[verificationType];
  const showRetryBadge = typeof data.maxRetries === "number" && Number.isFinite(data.maxRetries);

  return (
    <div className="flex h-11 w-[250px] items-center gap-2.5 rounded-xl border border-[var(--color-border-secondary-soft-alt)] bg-[var(--color-background-secondary-soft)] px-3.5">
      <Handle type="target" position={Position.Top} id="target" />
      <span className="min-w-0 flex-1 truncate text-sm font-medium text-[var(--color-text-secondary-soft)]">{config.label}</span>
      {showRetryBadge && (
        <Badge color="secondary" variant="outline" size="sm" pill={true}>
          {data.maxRetries}
        </Badge>
      )}
      <Handle type="source" position={Position.Left} id="left" style={{ top: "80%" }} />
      <Handle type="source" position={Position.Right} id="right" style={{ top: "80%" }} />
      <Handle type="source" position={Position.Bottom} id="default" />
    </div>
  );
}
