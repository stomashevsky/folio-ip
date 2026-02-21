"use client";

import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import type { Node as FlowNode, Edge as FlowEdge } from "@xyflow/react";

import { parseFlowYaml, validateFlow } from "@/lib/utils/flow-parser";
import { flowToElements } from "@/lib/utils/flow-to-nodes";
import { parseWorkflowYaml, validateWorkflowFlow } from "@/lib/utils/workflow-parser";
import { workflowFlowToElements } from "@/lib/utils/workflow-to-nodes";
import { getLayoutedElements } from "@/lib/utils/flow-layout";
import { FlowVisualizer } from "./FlowVisualizer";
import { YamlEditor, type YamlEditorHandle } from "./YamlEditor";
import { FlowChat } from "./FlowChat";
// import { ElkSettingsPanel } from "./ElkSettingsPanel";
// import type { ElkLayoutOverrides } from "@/lib/utils/flow-layout";
import { ExclamationMarkCircle } from "@plexui/ui/components/Icon";
import {
  FLOW_EDITOR_FIT_VIEW_DURATION_MS,
  FLOW_EDITOR_FIT_VIEW_PADDING,
  FLOW_EDITOR_MAIN_MIN_WIDTH,
  FLOW_EDITOR_RESIZER_HIT_AREA_WIDTH_PX,
  FLOW_EDITOR_RESIZER_HOVER_LINE_WIDTH_PX,
  FLOW_EDITOR_SIDEBAR_DEFAULT_WIDTH,
  FLOW_EDITOR_SIDEBAR_MAX_WIDTH,
  FLOW_EDITOR_SIDEBAR_MIN_WIDTH,
  FLOW_EDITOR_SIDEBAR_RESIZE_STEP,
  FLOW_EDITOR_SIDEBAR_WIDTH_STORAGE_KEY,
} from "@/lib/constants";

export type FlowEditorPanel = "chat" | "code" | "settings";
export type FlowEditorMode = "inquiry" | "workflow";

interface FlowEditorProps {
  initialYaml: string;
  onChange?: (yaml: string) => void;
  readOnly?: boolean;
  settingsPanel?: React.ReactNode;
  panel: FlowEditorPanel;
  onPanelChange: (panel: FlowEditorPanel) => void;
  onCodeHistoryChange?: (state: { canUndo: boolean; canRedo: boolean }) => void;
  onCodeHistoryActionsReady?: (actions: { undo: () => void; redo: () => void } | null) => void;
  mode?: FlowEditorMode;
}

export function FlowEditor({
  initialYaml,
  onChange,
  readOnly = false,
  settingsPanel,
  panel,
  onPanelChange,
  onCodeHistoryChange,
  onCodeHistoryActionsReady,
  mode = "inquiry",
}: FlowEditorProps) {
  const [yamlValue, setYamlValue] = useState(initialYaml);
  const leftPanel = panel;
  const setLeftPanel = onPanelChange;
  const onChangeRef = useRef(onChange);
  const yamlValueRef = useRef(yamlValue);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragStartXRef = useRef(0);
  const dragStartWidthRef = useRef(FLOW_EDITOR_SIDEBAR_DEFAULT_WIDTH);
  const didResizeDuringDragRef = useRef(false);
  const yamlEditorRef = useRef<YamlEditorHandle | null>(null);
  const [isResizingSidebar, setIsResizingSidebar] = useState(false);
  const [hasManualViewportInteraction, setHasManualViewportInteraction] = useState(false);
  const [fitViewRequestId, setFitViewRequestId] = useState(0);
  const [sidebarWidth, setSidebarWidth] = useState(FLOW_EDITOR_SIDEBAR_DEFAULT_WIDTH);
  const [isSidebarWidthHydrated, setIsSidebarWidthHydrated] = useState(false);
  const [editorHistoryState, setEditorHistoryState] = useState({ canUndo: false, canRedo: false });
  const [externalHistoryState, setExternalHistoryState] = useState({ canUndo: false, canRedo: false });
  const externalHistoryRef = useRef<{ past: string[]; future: string[] }>({ past: [], future: [] });
  const fitAfterAiApplyPendingRef = useRef(false);
  // ELK settings panel state — hidden but kept for future tuning
  // const [elkOverrides, setElkOverrides] = useState<ElkLayoutOverrides>({});
  // const [elkPortConstraint, setElkPortConstraint] = useState("FIXED_SIDE");
  // const [elkSourceLeftSide, setElkSourceLeftSide] = useState("EAST");
  // const [elkSourceRightSide, setElkSourceRightSide] = useState("EAST");
  // const [elkUseElkLabelPos, setElkUseElkLabelPos] = useState(true);
  useEffect(() => { onChangeRef.current = onChange; });
  useEffect(() => { yamlValueRef.current = yamlValue; }, [yamlValue]);

  const emitCombinedHistoryState = useCallback(() => {
    const hasExternalUndo = externalHistoryRef.current.past.length > 0;
    const hasExternalRedo = externalHistoryRef.current.future.length > 0;
    onCodeHistoryChange?.({
      canUndo: editorHistoryState.canUndo || hasExternalUndo,
      canRedo: editorHistoryState.canRedo || hasExternalRedo,
    });
  }, [editorHistoryState.canRedo, editorHistoryState.canUndo, onCodeHistoryChange]);

  const syncExternalHistoryState = useCallback(() => {
    const next = {
      canUndo: externalHistoryRef.current.past.length > 0,
      canRedo: externalHistoryRef.current.future.length > 0,
    };
    setExternalHistoryState(next);
    onCodeHistoryChange?.({
      canUndo: editorHistoryState.canUndo || next.canUndo,
      canRedo: editorHistoryState.canRedo || next.canRedo,
    });
  }, [editorHistoryState.canRedo, editorHistoryState.canUndo, onCodeHistoryChange]);

  const applyYamlValue = useCallback((nextYaml: string) => {
    setYamlValue(nextYaml);
    onChangeRef.current?.(nextYaml);
  }, []);

  const handleExternalUndo = useCallback(() => {
    const previousYaml = externalHistoryRef.current.past.pop();
    if (!previousYaml) return false;
    externalHistoryRef.current.future.push(yamlValueRef.current);
    fitAfterAiApplyPendingRef.current = true;
    applyYamlValue(previousYaml);
    syncExternalHistoryState();
    return true;
  }, [applyYamlValue, syncExternalHistoryState]);

  const handleExternalRedo = useCallback(() => {
    const nextYaml = externalHistoryRef.current.future.pop();
    if (!nextYaml) return false;
    externalHistoryRef.current.past.push(yamlValueRef.current);
    fitAfterAiApplyPendingRef.current = true;
    applyYamlValue(nextYaml);
    syncExternalHistoryState();
    return true;
  }, [applyYamlValue, syncExternalHistoryState]);

  const handleUndo = useCallback(() => {
    if (yamlEditorRef.current && editorHistoryState.canUndo) {
      yamlEditorRef.current.undo();
      return;
    }
    handleExternalUndo();
  }, [editorHistoryState.canUndo, handleExternalUndo]);

  const handleRedo = useCallback(() => {
    if (yamlEditorRef.current && editorHistoryState.canRedo) {
      yamlEditorRef.current.redo();
      return;
    }
    handleExternalRedo();
  }, [editorHistoryState.canRedo, handleExternalRedo]);

  useEffect(() => {
    if (!onCodeHistoryActionsReady) return;
    onCodeHistoryActionsReady({
      undo: handleUndo,
      redo: handleRedo,
    });
    return () => onCodeHistoryActionsReady(null);
  }, [handleRedo, handleUndo, onCodeHistoryActionsReady]);

  useEffect(() => {
    emitCombinedHistoryState();
  }, [editorHistoryState, externalHistoryState, emitCombinedHistoryState]);

  const clampSidebarWidth = useCallback((width: number) => {
    const containerWidth = containerRef.current?.clientWidth;
    const maxByContainer = containerWidth
      ? Math.max(FLOW_EDITOR_SIDEBAR_MIN_WIDTH, containerWidth - FLOW_EDITOR_MAIN_MIN_WIDTH)
      : FLOW_EDITOR_SIDEBAR_MAX_WIDTH;
    const max = Math.min(FLOW_EDITOR_SIDEBAR_MAX_WIDTH, maxByContainer);
    const clamped = Math.min(Math.max(width, FLOW_EDITOR_SIDEBAR_MIN_WIDTH), max);
    return Math.round(clamped);
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
      if (mode === "workflow") {
        const flow = parseWorkflowYaml(yamlValue);
        const errors = validateWorkflowFlow(flow);
        const { nodes, edges } = workflowFlowToElements(flow);
        return { nodes, edges, errors };
      }
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
  }, [mode, yamlValue]);

  const [layouted, setLayouted] = useState<{ nodes: FlowNode[]; edges: FlowEdge[] }>({
    nodes: [],
    edges: [],
  });

  useEffect(() => {
    if (rawParsed.nodes.length === 0) {
      queueMicrotask(() => {
        setLayouted({ nodes: [], edges: [] });
        fitAfterAiApplyPendingRef.current = false;
      });
      return;
    }
    let cancelled = false;
    getLayoutedElements(rawParsed.nodes, rawParsed.edges).then((result) => {
      if (!cancelled) {
        setLayouted(result);
        if (fitAfterAiApplyPendingRef.current) {
          fitAfterAiApplyPendingRef.current = false;
          setFitViewRequestId((current) => current + 1);
        }
      }
    });
    return () => {
      cancelled = true;
    };
  }, [rawParsed]);

  const handleYamlChange = useCallback((newYaml: string) => {
    applyYamlValue(newYaml);
  }, [applyYamlValue]);

  const handleAiApply = useCallback(
    (newYaml: string) => {
      if (newYaml === yamlValueRef.current) {
        return { ok: true } as const;
      }
      try {
        const parsed = parseFlowYaml(newYaml);
        const errors = validateFlow(parsed);
        if (errors.length > 0) {
          return { ok: false, error: `Cannot apply AI YAML: ${errors[0]}` } as const;
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Invalid YAML";
        return { ok: false, error: `Cannot apply AI YAML: ${message}` } as const;
      }
      externalHistoryRef.current.past.push(yamlValueRef.current);
      externalHistoryRef.current.future = [];
      syncExternalHistoryState();
      fitAfterAiApplyPendingRef.current = true;
      applyYamlValue(newYaml);
      return { ok: true } as const;
    },
    [applyYamlValue, syncExternalHistoryState],
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

  const handleCodeHistoryChange = useCallback((state: { canUndo: boolean; canRedo: boolean }) => {
    setEditorHistoryState(state);
  }, []);

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div ref={containerRef} className="flex min-h-0 flex-1">
        <div className="flex shrink-0 flex-col" style={{ width: `${sidebarWidth}px` }}>
          {leftPanel === "code" && (
            <>
              <div className="min-h-0 flex-1">
                <YamlEditor
                  ref={yamlEditorRef}
                  value={yamlValue}
                  onChange={handleYamlChange}
                  readOnly={readOnly}
                  scrollToStepId={scrollTarget}
                  onHistoryStateChange={handleCodeHistoryChange}
                />
              </div>
              {rawParsed.errors.length > 0 && (
                <div className="shrink-0 border-t border-[var(--color-border)] bg-[var(--color-background-danger-soft)]">
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

          <div className={leftPanel === "chat" ? "flex h-full flex-col" : "hidden"}>
            <FlowChat currentYaml={yamlValue} onApplyYaml={handleAiApply} />
          </div>

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
          className="group relative z-10 shrink-0 cursor-col-resize touch-none bg-transparent outline-none"
          style={{
            width: FLOW_EDITOR_RESIZER_HIT_AREA_WIDTH_PX,
            marginLeft: -(FLOW_EDITOR_RESIZER_HIT_AREA_WIDTH_PX / 2),
            marginRight: -(FLOW_EDITOR_RESIZER_HIT_AREA_WIDTH_PX / 2),
          }}
        >
          <span
            className={`pointer-events-none absolute inset-y-0 left-1/2 -translate-x-1/2 ${isResizingSidebar ? "bg-[var(--color-nav-hover-bg)]" : "bg-transparent group-hover:bg-[var(--color-nav-hover-bg)] group-focus-visible:bg-[var(--color-nav-hover-bg)]"}`}
            style={{ width: FLOW_EDITOR_RESIZER_HOVER_LINE_WIDTH_PX }}
          />
          <span
            className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-[var(--color-border)]"
          />
        </div>

        <div className="relative min-w-0 flex-1">
          {/* ELK settings panel — hidden but kept for future tuning
          <ElkSettingsPanel
            overrides={elkOverrides}
            portConstraint={elkPortConstraint}
            sourceLeftSide={elkSourceLeftSide}
            sourceRightSide={elkSourceRightSide}
            useElkLabelPositions={elkUseElkLabelPos}
            onOverridesChange={setElkOverrides}
            onPortConstraintChange={setElkPortConstraint}
            onSourceLeftSideChange={setElkSourceLeftSide}
            onSourceRightSideChange={setElkSourceRightSide}
            onUseElkLabelPositionsChange={setElkUseElkLabelPos}
          />
          */}
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
