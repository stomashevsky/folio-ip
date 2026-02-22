"use client";

import { useState, useMemo } from "react";
import { TopBar, TOPBAR_CONTROL_SIZE, TOPBAR_TOOLBAR_PILL } from "@/components/layout/TopBar";
import { TABLE_PAGE_WRAPPER } from "@/lib/constants/page-layout";
import { TableSearch, InlineEmpty } from "@/components/shared";
import { Button } from "@plexui/ui/components/Button";
import { Badge, type BadgeProps } from "@plexui/ui/components/Badge";
import { getStatusColor } from "@/lib/utils/format";
import { Select } from "@plexui/ui/components/Select";

interface Tool {
  id: string;
  name: string;
  description: string;
  category: "Validation" | "Parsing" | "Formatting" | "Analysis" | "Security" | "Lookup";
  status: "active" | "beta" | "deprecated";
  usageCount: number;
  lastUsed: string;
}

const mockTools: Tool[] = [
  {
    id: "tool_001",
    name: "ID Validator",
    description: "Validate and verify identity document formats across 180+ countries",
    category: "Validation",
    status: "active",
    usageCount: 12450,
    lastUsed: "2025-02-20T14:30:00Z",
  },
  {
    id: "tool_002",
    name: "Address Parser",
    description: "Parse and standardize address information into structured components",
    category: "Parsing",
    status: "active",
    usageCount: 8920,
    lastUsed: "2025-02-20T13:15:00Z",
  },
  {
    id: "tool_003",
    name: "Phone Normalizer",
    description: "Normalize and validate international phone numbers with carrier detection",
    category: "Formatting",
    status: "active",
    usageCount: 6340,
    lastUsed: "2025-02-20T12:45:00Z",
  },
  {
    id: "tool_004",
    name: "Email Verifier",
    description: "Verify email addresses, check domain validity and disposable email detection",
    category: "Validation",
    status: "active",
    usageCount: 15200,
    lastUsed: "2025-02-20T14:00:00Z",
  },
  {
    id: "tool_005",
    name: "Risk Score Calculator",
    description: "Calculate composite risk scores based on configurable data patterns and rules",
    category: "Analysis",
    status: "active",
    usageCount: 4580,
    lastUsed: "2025-02-20T11:30:00Z",
  },
  {
    id: "tool_006",
    name: "Data Sanitizer",
    description: "Clean and redact sensitive PII data for safe storage and sharing",
    category: "Security",
    status: "active",
    usageCount: 3210,
    lastUsed: "2025-02-19T16:00:00Z",
  },
  {
    id: "tool_007",
    name: "Name Matcher",
    description: "Fuzzy name matching with transliteration and cultural name variant support",
    category: "Analysis",
    status: "beta",
    usageCount: 1890,
    lastUsed: "2025-02-20T10:00:00Z",
  },
  {
    id: "tool_008",
    name: "SSN Validator",
    description: "Validate Social Security Numbers against format and issuance rules",
    category: "Validation",
    status: "active",
    usageCount: 9870,
    lastUsed: "2025-02-20T13:45:00Z",
  },
  {
    id: "tool_009",
    name: "IP Geolookup",
    description: "Resolve IP addresses to geographic location, ISP, and proxy detection",
    category: "Lookup",
    status: "active",
    usageCount: 7650,
    lastUsed: "2025-02-20T14:10:00Z",
  },
  {
    id: "tool_010",
    name: "Date Normalizer",
    description: "Parse and normalize dates from various international formats",
    category: "Formatting",
    status: "deprecated",
    usageCount: 2100,
    lastUsed: "2025-01-15T09:00:00Z",
  },
];

const CATEGORY_OPTIONS = [
  { value: "Validation", label: "Validation" },
  { value: "Parsing", label: "Parsing" },
  { value: "Formatting", label: "Formatting" },
  { value: "Analysis", label: "Analysis" },
  { value: "Security", label: "Security" },
  { value: "Lookup", label: "Lookup" },
];

const STATUS_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "beta", label: "Beta" },
  { value: "deprecated", label: "Deprecated" },
];



export default function UtilitiesPage() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string[]>([]);

  const hasActiveFilters = categoryFilter.length > 0 || statusFilter.length > 0;

  const filteredTools = useMemo(() => {
    return mockTools.filter((tool) => {
      if (categoryFilter.length > 0 && !categoryFilter.includes(tool.category)) return false;
      if (statusFilter.length > 0 && !statusFilter.includes(tool.status)) return false;
      if (search) {
        const s = search.toLowerCase();
        return (
          tool.name.toLowerCase().includes(s) ||
          tool.description.toLowerCase().includes(s) ||
          tool.category.toLowerCase().includes(s)
        );
      }
      return true;
    });
  }, [search, categoryFilter, statusFilter]);

  function clearAllFilters() {
    setCategoryFilter([]);
    setStatusFilter([]);
  }

  return (
    <div className={TABLE_PAGE_WRAPPER}>
      <TopBar
        title="Utilities"
        toolbar={
          <>
            <TableSearch value={search} onChange={setSearch} placeholder="Search utilities..." />
             <div className="w-40">
               <Select
                 multiple
                 clearable
                 block
                 pill={TOPBAR_TOOLBAR_PILL}
                 listMinWidth={180}
                 options={CATEGORY_OPTIONS}
                 value={categoryFilter}
                 onChange={(opts) => setCategoryFilter(opts.map((o) => o.value))}
                 placeholder="Category"
                 variant="outline"
                 size={TOPBAR_CONTROL_SIZE}
               />
             </div>
             <div className="w-36">
               <Select
                 multiple
                 clearable
                 block
                 pill={TOPBAR_TOOLBAR_PILL}
                 listMinWidth={160}
                 options={STATUS_OPTIONS}
                 value={statusFilter}
                 onChange={(opts) => setStatusFilter(opts.map((o) => o.value))}
                 placeholder="Status"
                 variant="outline"
                 size={TOPBAR_CONTROL_SIZE}
               />
             </div>
             {hasActiveFilters && (
               <Button color="secondary" variant="soft" size={TOPBAR_CONTROL_SIZE} pill={TOPBAR_TOOLBAR_PILL} onClick={clearAllFilters}>
                 Clear filters
               </Button>
             )}
          </>
        }
      />

      <div className="flex-1 overflow-auto px-4 py-6 md:px-6">
        {filteredTools.length === 0 ? (
          <InlineEmpty>{`No utilities match your filters.`}</InlineEmpty>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTools.map((tool) => (
              <div
                key={tool.id}
                className="flex flex-col rounded-lg border border-[var(--color-border)] p-5 transition-colors hover:border-[var(--color-text-secondary)]"
              >
                <div className="mb-3 flex items-center justify-between">
                  <Badge pill color={getStatusColor(tool.status) as BadgeProps["color"]} variant="soft" size="sm">{tool.status.charAt(0).toUpperCase() + tool.status.slice(1)}</Badge>
                  <span className="text-xs text-[var(--color-text-tertiary)]">
                    {tool.category}
                  </span>
                </div>
                <p className="heading-xs mb-1">{tool.name}</p>
                <p className="text-sm text-[var(--color-text-secondary)] mb-4 flex-1">
                  {tool.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[var(--color-text-tertiary)]">
                    {tool.usageCount.toLocaleString()} runs
                  </span>
                  <Button color="secondary" size="sm" pill onClick={() => {}}>
                    Launch
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
