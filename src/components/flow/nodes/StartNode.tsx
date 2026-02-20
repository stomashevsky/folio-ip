"use client";

import { PlayCircle } from "@plexui/ui/components/Icon";
import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";

interface FlowNodeData extends Record<string, unknown> {
  nodeType: string;
  label: string;
}

type StartFlowNode = Node<FlowNodeData, "start">;

export function StartNode({}: NodeProps<StartFlowNode>) {
  return (
    <div className="flex h-11 w-[250px] items-center gap-2.5 rounded-xl border border-[var(--color-border-info-surface)] bg-[var(--color-background-info-soft)] px-3.5">
      <PlayCircle className="h-4 w-4 shrink-0 text-[var(--color-text-info-soft)]" />
      <span className="text-sm font-medium text-[var(--color-text-info-soft)]">Start</span>
      <Handle type="source" position={Position.Bottom} id="default" />
    </div>
  );
}
