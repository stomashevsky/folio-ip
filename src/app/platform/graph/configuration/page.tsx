"use client";

import { useState } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { SectionHeading } from "@/components/shared";
import { Input } from "@plexui/ui/components/Input";
import { Switch } from "@plexui/ui/components/Switch";
import { Field } from "@plexui/ui/components/Field";

export default function GraphConfigurationPage() {
  const [maxNodes, setMaxNodes] = useState("500");
  const [showOrphanNodes, setShowOrphanNodes] = useState(false);
  const [autoCluster, setAutoCluster] = useState(true);
  const [minStrength, setMinStrength] = useState("0.3");
  const [showWeakConnections, setShowWeakConnections] = useState(true);
  const [directionalEdges, setDirectionalEdges] = useState(false);
  const [forceIterations, setForceIterations] = useState("300");
  const [nodeSpacing, setNodeSpacing] = useState("50");

  return (
    <div className="flex h-full flex-col overflow-auto">
      <TopBar title="Graph Configuration" />
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
          <Switch
            checked={showOrphanNodes}
            onCheckedChange={setShowOrphanNodes}
            label="Show orphan nodes"
          />
        </div>

        <div className="mb-8">
          <Switch
            checked={autoCluster}
            onCheckedChange={setAutoCluster}
            label="Auto-cluster related nodes"
          />
        </div>

        <SectionHeading size="xs">Edge Settings</SectionHeading>
        <div className="mb-6">
          <Field label="Min connection strength" description="Minimum strength threshold for displaying connections">
            <Input
              value={minStrength}
              onChange={(e) => setMinStrength(e.target.value)}
              type="number"
              step="0.1"
            />
          </Field>
        </div>

        <div className="mb-6">
          <Switch
            checked={showWeakConnections}
            onCheckedChange={setShowWeakConnections}
            label="Show weak connections"
          />
        </div>

        <div className="mb-8">
          <Switch
            checked={directionalEdges}
            onCheckedChange={setDirectionalEdges}
            label="Directional edges"
          />
        </div>

        <SectionHeading size="xs">Layout</SectionHeading>
        <div className="mb-6">
          <Field label="Force simulation iterations" description="Number of iterations for force-directed layout">
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
      </div>
    </div>
  );
}
