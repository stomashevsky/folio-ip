"use client";

import { CheckCircle } from "@plexui/ui/components/Icon";
import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";

interface WfOutputData extends Record<string, unknown> {
  label: string;
}

type WfOutputFlowNode = Node<WfOutputData, "wf_output">;

export function WfOutputNode({ data }: NodeProps<WfOutputFlowNode>) {
  return (
    <div className="flex h-11 w-[250px] items-center gap-2.5 rounded-xl border border-transparent bg-[var(--color-background-secondary-soft)] px-3.5">
      <Handle type="target" position={Position.Top} id="target" />
      <CheckCircle className="h-4 w-4 shrink-0 text-[var(--color-text-secondary-soft)]" />
      <span className="text-sm font-medium text-[var(--color-text-secondary-soft)]">{data.label}</span>
    </div>
  );
}
