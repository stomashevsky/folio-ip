"use client";

import type { ComponentType, SVGAttributes } from "react";
import { CheckCircle, XCircle, Warning } from "@plexui/ui/components/Icon";
import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";

interface FlowNodeData extends Record<string, unknown> {
  nodeType: string;
  label: string;
  terminalStatus?: string;
}

interface TerminalEntry {
  Icon: ComponentType<SVGAttributes<SVGSVGElement>>;
  bg: string;
  border: string;
  text: string;
}

const terminalConfig: Record<string, TerminalEntry> = {
  approved: {
    Icon: CheckCircle,
    bg: "var(--color-background-success-soft)",
    border: "var(--color-border-success-surface)",
    text: "var(--color-text-success-soft)",
  },
  declined: {
    Icon: XCircle,
    bg: "var(--color-background-danger-soft)",
    border: "var(--color-border-danger-surface)",
    text: "var(--color-text-danger-soft)",
  },
  needs_review: {
    Icon: Warning,
    bg: "var(--color-background-caution-soft)",
    border: "var(--color-border-caution-surface)",
    text: "var(--color-text-caution-soft)",
  },
};

const fallback: TerminalEntry = terminalConfig.approved;

type TerminalFlowNode = Node<FlowNodeData, "terminal">;

export function TerminalNode({ data }: NodeProps<TerminalFlowNode>) {
  const config = (data.terminalStatus && terminalConfig[data.terminalStatus]) || fallback;

  return (
    <div
      className="flex h-11 w-[250px] items-center gap-2.5 rounded-xl border px-3.5"
      style={{ background: config.bg, borderColor: config.border }}
    >
      <Handle type="target" position={Position.Top} id="target" />
      <config.Icon className="h-4 w-4 shrink-0" style={{ color: config.text }} />
      <span className="text-sm font-medium" style={{ color: config.text }}>{data.label}</span>
    </div>
  );
}
