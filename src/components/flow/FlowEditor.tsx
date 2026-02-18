"use client";

import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import type { Node as FlowNode, Edge as FlowEdge } from "@xyflow/react";

import { parseFlowYaml, validateFlow } from "@/lib/utils/flow-parser";
import { flowToElements } from "@/lib/utils/flow-to-nodes";
import { getLayoutedElements } from "@/lib/utils/flow-layout";
import { FlowVisualizer } from "./FlowVisualizer";
import { YamlEditor } from "./YamlEditor";
import { FlowChat } from "./FlowChat";
import { SegmentedControl } from "@plexui/ui/components/SegmentedControl";
import { ExclamationMarkCircle } from "@plexui/ui/components/Icon";

interface FlowEditorProps {
  initialYaml: string;
  onChange?: (yaml: string) => void;
  readOnly?: boolean;
  actions?: React.ReactNode;
  settingsPanel?: React.ReactNode;
}

type LeftPanel = "chat" | "code" | "settings";

export function FlowEditor({ initialYaml, onChange, readOnly = false, actions, settingsPanel }: FlowEditorProps) {
  const [yamlValue, setYamlValue] = useState(initialYaml);
  const [leftPanel, setLeftPanel] = useState<LeftPanel>("chat");
  const onChangeRef = useRef(onChange);
  useEffect(() => { onChangeRef.current = onChange; });

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
      setLeftPanel("code");
    },
    [],
  );

  const scrollCountRef = useRef(0);
  const [scrollTarget, setScrollTarget] = useState<string | null>(null);

  const handleNodeClick = useCallback((nodeId: string) => {
    setLeftPanel("code");
    scrollCountRef.current += 1;
    setScrollTarget(`${nodeId}|${scrollCountRef.current}`);
  }, []);

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="flex shrink-0 items-center justify-between border-b border-[var(--color-border)] px-4 py-2 md:px-6">
        <SegmentedControl
          aria-label="Editor panel"
          value={leftPanel}
          onChange={(v) => setLeftPanel(v as LeftPanel)}
          size="sm"
          pill={false}
          className="-ml-1.5"
        >
          <SegmentedControl.Tab value="chat">AI Chat</SegmentedControl.Tab>
          <SegmentedControl.Tab value="code">Code</SegmentedControl.Tab>
          {settingsPanel && <SegmentedControl.Tab value="settings">Settings</SegmentedControl.Tab>}
        </SegmentedControl>
        {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
      </div>

      <div className="flex min-h-0 flex-1">
        <div className="flex w-[420px] shrink-0 flex-col border-r border-[var(--color-border)]">
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

        <div className="relative min-w-0 flex-1">
          {layouted.nodes.length > 0 ? (
            <FlowVisualizer nodes={layouted.nodes} edges={layouted.edges} onNodeClick={handleNodeClick} />
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
