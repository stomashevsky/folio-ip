"use client";

import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";

interface FlowNodeData extends Record<string, unknown> {
  nodeType: string;
  label: string;
}

type ReviewFlowNode = Node<FlowNodeData, "review">;

export function ReviewNode({ data }: NodeProps<ReviewFlowNode>) {
  return (
    <div className="flex h-11 w-[250px] items-center gap-2.5 rounded-xl border border-[var(--color-border-secondary-soft-alt)] bg-[var(--color-background-secondary-soft)] px-3.5">
      <Handle type="target" position={Position.Top} id="target" />
      <span className="min-w-0 flex-1 truncate text-sm font-medium text-[var(--color-text-secondary-soft)]">{data.label}</span>
      <Handle type="source" position={Position.Left} id="left" style={{ top: "80%" }} />
      <Handle type="source" position={Position.Right} id="right" style={{ top: "80%" }} />
      <Handle type="source" position={Position.Bottom} id="default" />
    </div>
  );
}
