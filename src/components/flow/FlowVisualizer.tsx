"use client";

import { useCallback, useEffect, useRef, type WheelEvent as ReactWheelEvent } from "react";
import {
  Background,
  BackgroundVariant,
  Controls,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
  type Edge,
  type Node,
  type NodeMouseHandler,
  type OnMove,
  type OnMoveStart,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { FlowEdge } from "./FlowEdge";
import { nodeTypes } from "./nodes";
import { FLOW_EDITOR_FIT_VIEW_DURATION_MS, FLOW_EDITOR_FIT_VIEW_PADDING } from "@/lib/constants";

const edgeTypes = { flowEdge: FlowEdge };

interface FlowVisualizerProps {
  nodes: Node[];
  edges: Edge[];
  onNodeClick?: (nodeId: string) => void;
  fitViewRequestId?: number;
  fitViewPadding?: number;
  fitViewDurationMs?: number;
  onManualViewportInteraction?: () => void;
}

function FitViewOnRequest({
  fitViewRequestId,
  fitViewPadding = FLOW_EDITOR_FIT_VIEW_PADDING,
  fitViewDurationMs = FLOW_EDITOR_FIT_VIEW_DURATION_MS,
}: Pick<FlowVisualizerProps, "fitViewRequestId" | "fitViewPadding" | "fitViewDurationMs">) {
  const { fitView } = useReactFlow();
  const lastRequestRef = useRef(fitViewRequestId ?? 0);

  useEffect(() => {
    const nextRequestId = fitViewRequestId ?? 0;
    if (nextRequestId === lastRequestRef.current) return;
    lastRequestRef.current = nextRequestId;
    void fitView({ padding: fitViewPadding, duration: fitViewDurationMs });
  }, [fitView, fitViewDurationMs, fitViewPadding, fitViewRequestId]);

  return null;
}

export function FlowVisualizer({
  nodes,
  edges,
  onNodeClick,
  fitViewRequestId,
  fitViewPadding,
  fitViewDurationMs,
  onManualViewportInteraction,
}: FlowVisualizerProps) {
  const handleNodeClick: NodeMouseHandler = (_event, node) => {
    onNodeClick?.(node.id);
  };

  const handleMoveStart: OnMoveStart = useCallback((event) => {
    if (!event) return;
    onManualViewportInteraction?.();
  }, [onManualViewportInteraction]);

  const handleMove: OnMove = useCallback((event) => {
    if (!event) return;
    onManualViewportInteraction?.();
  }, [onManualViewportInteraction]);

  const handlePaneScroll = useCallback((event?: ReactWheelEvent<Element>) => {
    if (!event) return;
    onManualViewportInteraction?.();
  }, [onManualViewportInteraction]);

  return (
    <div className="h-full w-full">
      <style>{`
        .react-flow__attribution { display: none !important; }
        .react-flow__handle { opacity: 0 !important; pointer-events: none !important; }
      `}</style>
      <ReactFlowProvider>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          defaultEdgeOptions={{ type: "flowEdge" }}
          nodesDraggable={false}
          nodesConnectable={false}
          nodesFocusable={false}
          edgesFocusable={false}
          panOnDrag
          zoomOnScroll
          onMoveStart={handleMoveStart}
          onMove={handleMove}
          onPaneScroll={handlePaneScroll}
          onNodeClick={handleNodeClick}
        >
          <FitViewOnRequest
            fitViewRequestId={fitViewRequestId}
            fitViewPadding={fitViewPadding}
            fitViewDurationMs={fitViewDurationMs}
          />
          <Controls position="bottom-right" showInteractive={false} />
          <Background variant={BackgroundVariant.Dots} gap={16} size={1} color="var(--color-border)" />
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  );
}
