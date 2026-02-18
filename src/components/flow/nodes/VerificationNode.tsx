"use client";

import { CreditCard, Storage, FileDocument, CameraPhoto, ShieldCheck, Phone, Email, Health, Mobile } from "@plexui/ui/components/Icon";
import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";
import type { VerificationType } from "@/lib/types";

interface FlowNodeData extends Record<string, unknown> {
  nodeType: string;
  label: string;
  verificationType?: VerificationType;
  required?: boolean;
  maxRetries?: number;
}

const verificationIcons: Record<VerificationType, { label: string; Icon: React.ComponentType<{ className?: string }> }> = {
  government_id: { label: "Government ID", Icon: CreditCard },
  selfie: { label: "Selfie", Icon: CameraPhoto },
  database: { label: "Database", Icon: Storage },
  document: { label: "Document", Icon: FileDocument },
  aamva: { label: "AAMVA", Icon: ShieldCheck },
  database_phone_carrier: { label: "Phone Carrier DB", Icon: Mobile },
  database_ssn: { label: "SSN Database", Icon: Storage },
  email_address: { label: "Email Address", Icon: Email },
  phone_number: { label: "Phone Number", Icon: Phone },
  health_insurance_card: { label: "Health Insurance", Icon: Health },
  vehicle_insurance: { label: "Vehicle Insurance", Icon: ShieldCheck },
};

type VerificationFlowNode = Node<FlowNodeData, "verification">;

export function VerificationNode({ data }: NodeProps<VerificationFlowNode>) {
  const verificationType = data.verificationType ?? "government_id";
  const config = verificationIcons[verificationType];

  return (
    <div className="flex h-11 w-[200px] items-center gap-2.5 rounded-xl border border-[var(--color-border-secondary-soft-alt)] bg-[var(--color-background-secondary-soft)] px-3.5">
      <Handle type="target" position={Position.Top} id="target" />
      <config.Icon className="h-4 w-4 shrink-0 text-[var(--color-text-secondary-soft)]" />
      <span className="truncate text-sm font-medium text-[var(--color-text-secondary-soft)]">{config.label}</span>
      <Handle type="source" position={Position.Left} id="left" style={{ top: "80%" }} />
      <Handle type="source" position={Position.Right} id="right" style={{ top: "80%" }} />
      <Handle type="source" position={Position.Bottom} id="default" />
    </div>
  );
}
