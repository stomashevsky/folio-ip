"use client";

import { Flag } from "@plexui/ui/components/Icon";
import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";

interface WfOutputData extends Record<string, unknown> {
  label: string;
}

type WfOutputFlowNode = Node<WfOutputData, "wf_output">;

export function WfOutputNode({ data }: NodeProps<WfOutputFlowNode>) {
  return (
    <div className="flex h-11 w-[220px] items-center gap-2.5 rounded-xl border border-[var(--color-border-primary-surface)] bg-[var(--color-background-primary-soft)] px-3.5">
      <Handle type="target" position={Position.Top} id="target" />
      <Flag className="h-4 w-4 shrink-0 text-[var(--color-text-primary-soft)]" />
      <span className="text-sm font-medium text-[var(--color-text-primary-soft)]">{data.label}</span>
    </div>
  );
}
