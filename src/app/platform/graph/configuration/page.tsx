"use client";

import { useState } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { SectionHeading } from "@/components/shared";
import { Input } from "@plexui/ui/components/Input";
import { Switch } from "@plexui/ui/components/Switch";
import { Field } from "@plexui/ui/components/Field";
import { Select } from "@plexui/ui/components/Select";
import { Button } from "@plexui/ui/components/Button";
import { Badge } from "@plexui/ui/components/Badge";

const LAYOUT_OPTIONS = [
  { value: "force-directed", label: "Force-Directed" },
  { value: "hierarchical", label: "Hierarchical" },
  { value: "radial", label: "Radial" },
  { value: "circular", label: "Circular" },
];

const NODE_SIZE_OPTIONS = [
  { value: "fixed", label: "Fixed" },
  { value: "degree", label: "By Degree" },
  { value: "risk-score", label: "By Risk Score" },
  { value: "activity", label: "By Activity" },
];

const EDGE_STYLE_OPTIONS = [
  { value: "straight", label: "Straight" },
  { value: "curved", label: "Curved" },
  { value: "orthogonal", label: "Orthogonal" },
];

const COLOR_SCHEME_OPTIONS = [
  { value: "entity-type", label: "By Entity Type" },
  { value: "risk-level", label: "By Risk Level" },
  { value: "status", label: "By Status" },
  { value: "cluster", label: "By Cluster" },
];

export default function GraphConfigurationPage() {
  const [maxNodes, setMaxNodes] = useState("500");
  const [showOrphanNodes, setShowOrphanNodes] = useState(false);
  const [autoCluster, setAutoCluster] = useState(true);
  const [nodeSizeMode, setNodeSizeMode] = useState("degree");
  const [minStrength, setMinStrength] = useState("0.3");
  const [showWeakConnections, setShowWeakConnections] = useState(true);
  const [directionalEdges, setDirectionalEdges] = useState(false);
  const [edgeStyle, setEdgeStyle] = useState("curved");
  const [layoutAlgorithm, setLayoutAlgorithm] = useState("force-directed");
  const [forceIterations, setForceIterations] = useState("300");
  const [nodeSpacing, setNodeSpacing] = useState("50");
  const [colorScheme, setColorScheme] = useState("entity-type");
  const [showLabels, setShowLabels] = useState(true);
  const [enableAnimation, setEnableAnimation] = useState(true);
  const [highlightNeighbors, setHighlightNeighbors] = useState(true);

  return (
    <div className="flex h-full flex-col overflow-auto">
      <TopBar
        title="Graph Configuration"
        actions={
          <div className="flex items-center gap-2">
            <Badge color="success" variant="soft" size="sm">Saved</Badge>
            <Button color="secondary" variant="outline" size="sm" pill onClick={() => {}}>
              Reset Defaults
            </Button>
            <Button color="primary" size="sm" pill onClick={() => {}}>
              Save Changes
            </Button>
          </div>
        }
      />
      <div className="mx-auto w-full max-w-2xl px-4 py-8 md:px-6">
        <SectionHeading size="xs">Node Settings</SectionHeading>
        <div className="mb-6">
          <Field label="Max nodes displayed" description="Maximum number of nodes to render in the graph">
            <Input
              value={maxNodes}
              onChange={(e) => setMaxNodes(e.target.value)}
              type="number"
            />
          </Field>
        </div>

        <div className="mb-6">
          <Field label="Node sizing" description="How node size is determined in the visualization">
            <Select
              block
              options={NODE_SIZE_OPTIONS}
              value={nodeSizeMode}
              onChange={(opt) => setNodeSizeMode(opt.value)}
              variant="outline"
              size="md"
            />
          </Field>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium text-[var(--color-text)]">Show orphan nodes</p>
              <p className="text-xs text-[var(--color-text-tertiary)]">Display nodes with no connections</p>
            </div>
            <Switch
              checked={showOrphanNodes}
              onCheckedChange={setShowOrphanNodes}
            />
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium text-[var(--color-text)]">Auto-cluster related nodes</p>
              <p className="text-xs text-[var(--color-text-tertiary)]">Group closely connected nodes into visual clusters</p>
            </div>
            <Switch
              checked={autoCluster}
              onCheckedChange={setAutoCluster}
            />
          </div>
        </div>

        <SectionHeading size="xs">Edge Settings</SectionHeading>
        <div className="mb-6">
          <Field label="Min connection strength" description="Minimum strength threshold for displaying connections (0.0 - 1.0)">
            <Input
              value={minStrength}
              onChange={(e) => setMinStrength(e.target.value)}
              type="number"
              step="0.1"
            />
          </Field>
        </div>

        <div className="mb-6">
          <Field label="Edge style" description="Visual style for connection lines between nodes">
            <Select
              block
              options={EDGE_STYLE_OPTIONS}
              value={edgeStyle}
              onChange={(opt) => setEdgeStyle(opt.value)}
              variant="outline"
              size="md"
            />
          </Field>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium text-[var(--color-text)]">Show weak connections</p>
              <p className="text-xs text-[var(--color-text-tertiary)]">Display edges below the minimum strength as dashed lines</p>
            </div>
            <Switch
              checked={showWeakConnections}
              onCheckedChange={setShowWeakConnections}
            />
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium text-[var(--color-text)]">Directional edges</p>
              <p className="text-xs text-[var(--color-text-tertiary)]">Show arrows indicating relationship direction</p>
            </div>
            <Switch
              checked={directionalEdges}
              onCheckedChange={setDirectionalEdges}
            />
          </div>
        </div>

        <SectionHeading size="xs">Layout</SectionHeading>
        <div className="mb-6">
          <Field label="Layout algorithm" description="Algorithm used to arrange nodes in the graph visualization">
            <Select
              block
              options={LAYOUT_OPTIONS}
              value={layoutAlgorithm}
              onChange={(opt) => setLayoutAlgorithm(opt.value)}
              variant="outline"
              size="md"
            />
          </Field>
        </div>

        <div className="mb-6">
          <Field label="Force simulation iterations" description="Number of iterations for force-directed layout (higher = more stable)">
            <Input
              value={forceIterations}
              onChange={(e) => setForceIterations(e.target.value)}
              type="number"
            />
          </Field>
        </div>

        <div className="mb-8">
          <Field label="Node spacing" description="Minimum distance between nodes in pixels">
            <Input
              value={nodeSpacing}
              onChange={(e) => setNodeSpacing(e.target.value)}
              type="number"
            />
          </Field>
        </div>

        <SectionHeading size="xs">Appearance</SectionHeading>
        <div className="mb-6">
          <Field label="Color scheme" description="How nodes are colored in the visualization">
            <Select
              block
              options={COLOR_SCHEME_OPTIONS}
              value={colorScheme}
              onChange={(opt) => setColorScheme(opt.value)}
              variant="outline"
              size="md"
            />
          </Field>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium text-[var(--color-text)]">Show labels</p>
              <p className="text-xs text-[var(--color-text-tertiary)]">Display entity names on nodes</p>
            </div>
            <Switch
              checked={showLabels}
              onCheckedChange={setShowLabels}
            />
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium text-[var(--color-text)]">Enable animation</p>
              <p className="text-xs text-[var(--color-text-tertiary)]">Animate layout transitions and interactions</p>
            </div>
            <Switch
              checked={enableAnimation}
              onCheckedChange={setEnableAnimation}
            />
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium text-[var(--color-text)]">Highlight neighbors on hover</p>
              <p className="text-xs text-[var(--color-text-tertiary)]">Highlight connected nodes when hovering over a node</p>
            </div>
            <Switch
              checked={highlightNeighbors}
              onCheckedChange={setHighlightNeighbors}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
