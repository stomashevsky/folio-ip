"use client";

import { Handle, Position } from "@xyflow/react";

export function BranchNode() {
  return (
    <div className="relative h-6 w-6">
      <Handle type="target" position={Position.Top} />
      <div className="absolute inset-0.5 rotate-45 rounded-sm border border-[var(--color-border)] bg-[var(--color-surface)]" />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
