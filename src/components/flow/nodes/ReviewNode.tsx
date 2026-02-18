"use client";

import { Eye } from "@plexui/ui/components/Icon";
import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";

interface FlowNodeData extends Record<string, unknown> {
  nodeType: string;
  label: string;
}

type ReviewFlowNode = Node<FlowNodeData, "review">;

export function ReviewNode({ data }: NodeProps<ReviewFlowNode>) {
  return (
    <div className="flex h-11 w-[200px] items-center gap-2.5 rounded-xl border border-[var(--color-border-secondary-soft-alt)] bg-[var(--color-background-secondary-soft)] px-3.5">
      <Handle type="target" position={Position.Top} id="target" />
      <Eye className="h-4 w-4 shrink-0 text-[var(--color-text-secondary-soft)]" />
      <span className="truncate text-sm font-medium text-[var(--color-text-secondary-soft)]">{data.label}</span>
      <Handle type="source" position={Position.Left} id="left" style={{ top: "80%" }} />
      <Handle type="source" position={Position.Right} id="right" style={{ top: "80%" }} />
      <Handle type="source" position={Position.Bottom} id="default" />
    </div>
  );
}
