"use client";

import {
  BaseEdge,
  EdgeLabelRenderer,
  Position,
  getSmoothStepPath,
  type EdgeProps,
} from "@xyflow/react";

const LABEL_SCHEME: Record<string, { bg: string; text: string }> = {
  success: {
    bg: "var(--color-background-success-soft)",
    text: "var(--color-text-success-outline)",
  },
  danger: {
    bg: "var(--color-background-danger-soft)",
    text: "var(--color-text-danger-outline)",
  },
  caution: {
    bg: "var(--color-background-caution-soft)",
    text: "var(--color-text-caution-outline)",
  },
  primary: {
    bg: "var(--color-surface)",
    text: "var(--color-text-primary-outline)",
  },
};

export function FlowEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  label,
  style,
  markerEnd,
  markerStart,
  data,
}: EdgeProps) {
  const gap = 6;
  const gapSourceY = sourcePosition === Position.Bottom ? sourceY - gap : sourcePosition === Position.Top ? sourceY + gap : sourceY;
  const gapSourceX = sourcePosition === Position.Right ? sourceX - gap : sourcePosition === Position.Left ? sourceX + gap : sourceX;
  const gapTargetY = targetPosition === Position.Top ? targetY + gap : targetPosition === Position.Bottom ? targetY - gap : targetY;
  const gapTargetX = targetPosition === Position.Left ? targetX + gap : targetPosition === Position.Right ? targetX - gap : targetX;

  const [path, labelX, labelY] = getSmoothStepPath({
    sourceX: gapSourceX,
    sourceY: gapSourceY,
    targetX: gapTargetX,
    targetY: gapTargetY,
    sourcePosition,
    targetPosition,
    borderRadius: 8,
    offset: 20,
  });

  return (
    <>
      <BaseEdge
        id={id}
        path={path}
        style={style}
        markerEnd={markerEnd}
        markerStart={markerStart}
      />
      {label != null && (() => {
        const scheme = LABEL_SCHEME[(data?.colorScheme as string) ?? "primary"] ?? LABEL_SCHEME.primary;
        return (
          <EdgeLabelRenderer>
            <div
              className="nodrag nopan"
              style={{
                position: "absolute",
                transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
                pointerEvents: "all",
                fontSize: 11,
                fontWeight: 500,
                lineHeight: 1,
                color: scheme.text,
                background: scheme.bg,
                border: "none",
                borderRadius: 6,
                padding: "4px 8px",
                whiteSpace: "nowrap",
                zIndex: 10,
              }}
            >
              {label}
            </div>
          </EdgeLabelRenderer>
        );
      })()}
    </>
  );
}
