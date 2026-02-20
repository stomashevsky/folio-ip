"use client";

import { Grid } from "@plexui/ui/components/Icon";
import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";

interface WfParallelData extends Record<string, unknown> {
  label: string;
  branchCount: number;
}

type WfParallelFlowNode = Node<WfParallelData, "wf_parallel">;

export function WfParallelNode({ data }: NodeProps<WfParallelFlowNode>) {
  return (
    <div className="flex h-11 w-[220px] items-center gap-2.5 rounded-xl border border-[var(--color-border-secondary-soft-alt)] bg-[var(--color-background-secondary-soft)] px-3.5">
      <Handle type="target" position={Position.Top} id="target" />
      <Grid className="h-4 w-4 shrink-0 text-[var(--color-text-secondary-soft)]" />
      <div className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium text-[var(--color-text-secondary-soft)]">{data.label}</span>
        <span className="block truncate text-2xs text-[var(--color-text-secondary-soft)] opacity-70">Parallel</span>
      </div>
      <Handle type="source" position={Position.Left} id="left" style={{ top: "80%" }} />
      <Handle type="source" position={Position.Right} id="right" style={{ top: "80%" }} />
      <Handle type="source" position={Position.Bottom} id="default" />
    </div>
  );
}
