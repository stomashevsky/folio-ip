"use client";

import { PlayCircle } from "@plexui/ui/components/Icon";
import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";

interface WfTriggerData extends Record<string, unknown> {
  label: string;
  event: string;
}

type WfTriggerFlowNode = Node<WfTriggerData, "wf_trigger">;

export function WfTriggerNode({ data }: NodeProps<WfTriggerFlowNode>) {
  return (
    <div className="flex h-11 w-[250px] items-center gap-2.5 rounded-xl border border-transparent bg-[var(--color-background-secondary-soft)] px-3.5">
      <PlayCircle className="h-4 w-4 shrink-0 text-[var(--color-text-secondary-soft)]" />
      <span className="min-w-0 flex-1 truncate text-sm font-medium text-[var(--color-text-secondary-soft)]">{data.label}</span>
      <Handle type="source" position={Position.Bottom} id="default" />
    </div>
  );
}
