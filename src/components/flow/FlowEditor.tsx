"use client";

import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import type { Node as FlowNode, Edge as FlowEdge } from "@xyflow/react";

import { parseFlowYaml, validateFlow } from "@/lib/utils/flow-parser";
import { flowToElements } from "@/lib/utils/flow-to-nodes";
import { getLayoutedElements } from "@/lib/utils/flow-layout";
import { FlowVisualizer } from "./FlowVisualizer";
import { YamlEditor } from "./YamlEditor";
import { FlowChat } from "./FlowChat";
import { ExclamationMarkCircle } from "@plexui/ui/components/Icon";
import {
  FLOW_EDITOR_FIT_VIEW_DURATION_MS,
  FLOW_EDITOR_FIT_VIEW_PADDING,
  FLOW_EDITOR_MAIN_MIN_WIDTH,
  FLOW_EDITOR_SIDEBAR_DEFAULT_WIDTH,
  FLOW_EDITOR_SIDEBAR_MAX_WIDTH,
  FLOW_EDITOR_SIDEBAR_MIN_WIDTH,
  FLOW_EDITOR_SIDEBAR_RESIZE_STEP,
  FLOW_EDITOR_SIDEBAR_WIDTH_STORAGE_KEY,
} from "@/lib/constants";

export type FlowEditorPanel = "chat" | "code" | "settings";

interface FlowEditorProps {
  initialYaml: string;
  onChange?: (yaml: string) => void;
  readOnly?: boolean;
  settingsPanel?: React.ReactNode;
  panel: FlowEditorPanel;
  onPanelChange: (panel: FlowEditorPanel) => void;
}

export function FlowEditor({ initialYaml, onChange, readOnly = false, settingsPanel, panel, onPanelChange }: FlowEditorProps) {
  const [yamlValue, setYamlValue] = useState(initialYaml);
  const leftPanel = panel;
  const setLeftPanel = onPanelChange;
  const onChangeRef = useRef(onChange);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragStartXRef = useRef(0);
  const dragStartWidthRef = useRef(FLOW_EDITOR_SIDEBAR_DEFAULT_WIDTH);
  const didResizeDuringDragRef = useRef(false);
  const [isResizingSidebar, setIsResizingSidebar] = useState(false);
  const [hasManualViewportInteraction, setHasManualViewportInteraction] = useState(false);
  const [fitViewRequestId, setFitViewRequestId] = useState(0);
  const [sidebarWidth, setSidebarWidth] = useState(FLOW_EDITOR_SIDEBAR_DEFAULT_WIDTH);
  const [isSidebarWidthHydrated, setIsSidebarWidthHydrated] = useState(false);
  useEffect(() => { onChangeRef.current = onChange; });

  const clampSidebarWidth = useCallback((width: number) => {
    const containerWidth = containerRef.current?.clientWidth;
    const maxByContainer = containerWidth
      ? Math.max(FLOW_EDITOR_SIDEBAR_MIN_WIDTH, containerWidth - FLOW_EDITOR_MAIN_MIN_WIDTH)
      : FLOW_EDITOR_SIDEBAR_MAX_WIDTH;
    const max = Math.min(FLOW_EDITOR_SIDEBAR_MAX_WIDTH, maxByContainer);
    return Math.min(Math.max(width, FLOW_EDITOR_SIDEBAR_MIN_WIDTH), max);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const storedWidth = Number(window.localStorage.getItem(FLOW_EDITOR_SIDEBAR_WIDTH_STORAGE_KEY));
    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled) return;
      if (Number.isFinite(storedWidth)) {
        setSidebarWidth((current) => {
          const next = clampSidebarWidth(storedWidth);
          return next === current ? current : next;
        });
      }
      setIsSidebarWidthHydrated(true);
    });
    return () => {
      cancelled = true;
    };
  }, [clampSidebarWidth]);

  useEffect(() => {
    if (typeof window === "undefined" || !isSidebarWidthHydrated) return;
    window.localStorage.setItem(FLOW_EDITOR_SIDEBAR_WIDTH_STORAGE_KEY, String(sidebarWidth));
  }, [isSidebarWidthHydrated, sidebarWidth]);

  useEffect(() => {
    const onResize = () => setSidebarWidth((current) => clampSidebarWidth(current));
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [clampSidebarWidth]);

  useEffect(() => {
    if (!isResizingSidebar) return;

    const handlePointerMove = (event: PointerEvent) => {
      const delta = event.clientX - dragStartXRef.current;
      if (delta !== 0) didResizeDuringDragRef.current = true;
      setSidebarWidth(clampSidebarWidth(dragStartWidthRef.current + delta));
    };
    const handlePointerUp = () => {
      setIsResizingSidebar(false);
      if (didResizeDuringDragRef.current && !hasManualViewportInteraction) {
        setFitViewRequestId((current) => current + 1);
      }
      didResizeDuringDragRef.current = false;
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    document.body.style.userSelect = "none";
    document.body.style.cursor = "col-resize";

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
    };
  }, [clampSidebarWidth, hasManualViewportInteraction, isResizingSidebar]);

  const rawParsed = useMemo(() => {
    try {
      const flow = parseFlowYaml(yamlValue);
      const errors = validateFlow(flow);
      const { nodes, edges } = flowToElements(flow);
      return { nodes, edges, errors };
    } catch (err) {
      return {
        nodes: [] as FlowNode[],
        edges: [] as FlowEdge[],
        errors: [err instanceof Error ? err.message : "Failed to parse YAML"],
      };
    }
  }, [yamlValue]);

  const [layouted, setLayouted] = useState<{ nodes: FlowNode[]; edges: FlowEdge[] }>({
    nodes: [],
    edges: [],
  });

  useEffect(() => {
    if (rawParsed.nodes.length === 0) {
      queueMicrotask(() => setLayouted({ nodes: [], edges: [] }));
      return;
    }
    let cancelled = false;
    getLayoutedElements(rawParsed.nodes, rawParsed.edges).then((result) => {
      if (!cancelled) setLayouted(result);
    });
    return () => {
      cancelled = true;
    };
  }, [rawParsed]);

  const handleYamlChange = useCallback((newYaml: string) => {
    setYamlValue(newYaml);
    onChangeRef.current?.(newYaml);
  }, []);

  const handleAiApply = useCallback(
    (newYaml: string) => {
      setYamlValue(newYaml);
      onChangeRef.current?.(newYaml);
    },
    [],
  );

  const scrollCountRef = useRef(0);
  const [scrollTarget, setScrollTarget] = useState<string | null>(null);

  const handleNodeClick = useCallback((nodeId: string) => {
    setLeftPanel("code");
    scrollCountRef.current += 1;
    setScrollTarget(`${nodeId}|${scrollCountRef.current}`);
  }, [setLeftPanel]);

  const handleResizeStart = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    dragStartXRef.current = event.clientX;
    dragStartWidthRef.current = sidebarWidth;
    didResizeDuringDragRef.current = false;
    setIsResizingSidebar(true);
    event.preventDefault();
  }, [sidebarWidth]);

  const handleResizeKeyDown = useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
    let nextWidthDelta = 0;
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      nextWidthDelta = -FLOW_EDITOR_SIDEBAR_RESIZE_STEP;
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      nextWidthDelta = FLOW_EDITOR_SIDEBAR_RESIZE_STEP;
    }
    if (nextWidthDelta === 0) return;
    setSidebarWidth((current) => clampSidebarWidth(current + nextWidthDelta));
    if (!hasManualViewportInteraction) {
      setFitViewRequestId((current) => current + 1);
    }
  }, [clampSidebarWidth, hasManualViewportInteraction]);

  const handleResizeDoubleClick = useCallback(() => {
    setFitViewRequestId((current) => current + 1);
  }, []);

  const handleManualViewportInteraction = useCallback(() => {
    setHasManualViewportInteraction(true);
  }, []);

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div ref={containerRef} className="flex min-h-0 flex-1">
        <div className="flex shrink-0 flex-col" style={{ width: `${sidebarWidth}px` }}>
          {leftPanel === "code" && (
            <>
              <div className="min-h-0 flex-1">
                <YamlEditor value={yamlValue} onChange={handleYamlChange} readOnly={readOnly} scrollToStepId={scrollTarget} />
              </div>
              {rawParsed.errors.length > 0 && (
                <div className="shrink-0 border-t border-[var(--color-border)] bg-[var(--color-danger-soft-bg)]">
                  <div className="flex items-start gap-2 px-3 py-2">
                    <ExclamationMarkCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--color-text-danger-ghost)]" />
                    <div className="text-xs text-[var(--color-text-danger-ghost)]">
                      {rawParsed.errors.map((err, i) => (
                        <div key={i}>{err}</div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {leftPanel === "chat" && <FlowChat currentYaml={yamlValue} onApplyYaml={handleAiApply} />}

          {leftPanel === "settings" && settingsPanel && (
            <div className="flex-1 overflow-auto">{settingsPanel}</div>
          )}
        </div>

        <div
          role="separator"
          tabIndex={0}
          aria-label="Resize editor sidebar"
          aria-orientation="vertical"
          onPointerDown={handleResizeStart}
          onDoubleClick={handleResizeDoubleClick}
          onKeyDown={handleResizeKeyDown}
          className="group relative w-2 shrink-0 cursor-col-resize touch-none bg-transparent outline-none hover:bg-[var(--color-nav-hover-bg)] focus-visible:bg-[var(--color-nav-hover-bg)]"
        >
          <span
            className={`absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-[var(--color-border)] ${isResizingSidebar ? "bg-[var(--color-text-tertiary)]" : "group-hover:bg-[var(--color-text-tertiary)]"}`}
          />
        </div>

        <div className="relative min-w-0 flex-1">
          {layouted.nodes.length > 0 ? (
            <FlowVisualizer
              nodes={layouted.nodes}
              edges={layouted.edges}
              onNodeClick={handleNodeClick}
              fitViewRequestId={fitViewRequestId}
              fitViewPadding={FLOW_EDITOR_FIT_VIEW_PADDING}
              fitViewDurationMs={FLOW_EDITOR_FIT_VIEW_DURATION_MS}
              onManualViewportInteraction={handleManualViewportInteraction}
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <p className="text-sm text-[var(--color-text-secondary)]">No valid flow to display</p>
                <p className="mt-1 text-xs text-[var(--color-text-tertiary)]">Write YAML in the editor to see the flow visualization</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
