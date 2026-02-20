"use client";

import { TopBar } from "@/components/layout/TopBar";
import { Button } from "@plexui/ui/components/Button";

interface Tool {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
}

const mockTools: Tool[] = [
  {
    id: "tool_001",
    name: "ID Validator",
    description: "Validate and verify identity document formats",
    category: "Validation",
    icon: "🆔",
  },
  {
    id: "tool_002",
    name: "Address Parser",
    description: "Parse and standardize address information",
    category: "Parsing",
    icon: "📍",
  },
  {
    id: "tool_003",
    name: "Phone Normalizer",
    description: "Normalize and validate phone numbers",
    category: "Formatting",
    icon: "📱",
  },
  {
    id: "tool_004",
    name: "Email Verifier",
    description: "Verify email addresses and domains",
    category: "Validation",
    icon: "✉️",
  },
  {
    id: "tool_005",
    name: "Risk Score Calculator",
    description: "Calculate risk scores based on data patterns",
    category: "Analysis",
    icon: "📊",
  },
  {
    id: "tool_006",
    name: "Data Sanitizer",
    description: "Clean and sanitize sensitive data",
    category: "Security",
    icon: "🔒",
  },
];

export default function UtilitiesPage() {
  return (
    <div className="flex h-full flex-col overflow-hidden">
      <TopBar title="Utilities" />

      <div className="flex-1 overflow-auto px-4 py-6 md:px-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {mockTools.map((tool) => (
            <div
              key={tool.id}
              className="rounded-lg border border-[var(--color-border)] p-5 hover:border-[var(--color-text-secondary)] transition-colors"
            >
              <span className="text-2xl mb-2 block">{tool.icon}</span>
              <p className="heading-xs mb-1">{tool.name}</p>
              <p className="text-sm text-[var(--color-text-secondary)] mb-3">
                {tool.description}
              </p>
              <Button
                color="secondary"
                size="md"
                pill={false}
                onClick={() => {}}
              >
                Launch
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
