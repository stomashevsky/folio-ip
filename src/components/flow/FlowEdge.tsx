"use client";

import {
  BaseEdge,
  EdgeLabelRenderer,
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
  const elkPath = data?.elkPath as string | undefined;
  const elkLabelX = data?.elkLabelX as number | undefined;
  const elkLabelY = data?.elkLabelY as number | undefined;

  let path: string;
  let labelX: number;
  let labelY: number;

  if (elkPath) {
    path = elkPath;
    labelX = elkLabelX ?? (sourceX + targetX) / 2;
    labelY = elkLabelY ?? (sourceY + targetY) / 2;
  } else {
    [path, labelX, labelY] = getSmoothStepPath({
      sourceX,
      sourceY,
      targetX,
      targetY,
      sourcePosition,
      targetPosition,
      borderRadius: 8,
      offset: 20,
    });
  }

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
