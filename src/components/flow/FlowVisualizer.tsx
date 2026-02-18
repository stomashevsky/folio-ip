"use client";

import {
  Background,
  BackgroundVariant,
  Controls,
  ReactFlow,
  ReactFlowProvider,
  type Edge,
  type Node,
  type NodeMouseHandler,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { FlowEdge } from "./FlowEdge";
import { nodeTypes } from "./nodes";

const edgeTypes = { flowEdge: FlowEdge };

interface FlowVisualizerProps {
  nodes: Node[];
  edges: Edge[];
  onNodeClick?: (nodeId: string) => void;
}

export function FlowVisualizer({ nodes, edges, onNodeClick }: FlowVisualizerProps) {
  const handleNodeClick: NodeMouseHandler = (_event, node) => {
    onNodeClick?.(node.id);
  };

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
          onNodeClick={handleNodeClick}
        >
          <Controls position="bottom-right" showInteractive={false} />
          <Background variant={BackgroundVariant.Dots} gap={16} size={1} color="var(--color-border)" />
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  );
}
