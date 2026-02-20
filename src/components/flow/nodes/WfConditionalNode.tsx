"use client";

import { Branch } from "@plexui/ui/components/Icon";
import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";

interface WfConditionalData extends Record<string, unknown> {
  label: string;
  routeCount: number;
}

type WfConditionalFlowNode = Node<WfConditionalData, "wf_conditional">;

export function WfConditionalNode({ data }: NodeProps<WfConditionalFlowNode>) {
  return (
    <div className="flex h-11 w-[220px] items-center gap-2.5 rounded-xl border border-[var(--color-border-discovery-surface)] bg-[var(--color-background-discovery-soft)] px-3.5">
      <Handle type="target" position={Position.Top} id="target" />
      <Branch className="h-4 w-4 shrink-0 text-[var(--color-text-discovery-soft)]" />
      <div className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium text-[var(--color-text-discovery-soft)]">{data.label}</span>
        <span className="block truncate text-2xs text-[var(--color-text-discovery-soft)] opacity-70">Conditional</span>
      </div>
      <Handle type="source" position={Position.Left} id="left" style={{ top: "80%" }} />
      <Handle type="source" position={Position.Right} id="right" style={{ top: "80%" }} />
      <Handle type="source" position={Position.Bottom} id="default" />
    </div>
  );
}
