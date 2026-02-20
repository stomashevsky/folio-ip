"use client";

import { Clock } from "@plexui/ui/components/Icon";
import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";

interface WfWaitData extends Record<string, unknown> {
  label: string;
  waitFor: string;
  events?: string[];
}

type WfWaitFlowNode = Node<WfWaitData, "wf_wait">;

export function WfWaitNode({ data }: NodeProps<WfWaitFlowNode>) {
  return (
    <div className="flex h-11 w-[250px] items-center gap-2.5 rounded-xl border border-[var(--color-border-caution-surface)] bg-[var(--color-background-caution-soft)] px-3.5">
      <Handle type="target" position={Position.Top} id="target" />
      <Clock className="h-4 w-4 shrink-0 text-[var(--color-text-caution-soft)]" />
      <span className="min-w-0 flex-1 truncate text-sm font-medium text-[var(--color-text-caution-soft)]">{data.label}</span>
      <Handle type="source" position={Position.Bottom} id="default" />
    </div>
  );
}
