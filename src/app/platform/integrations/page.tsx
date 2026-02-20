"use client";

import { useState, useMemo } from "react";
import { TopBar, TOPBAR_CONTROL_SIZE, TOPBAR_TOOLBAR_PILL, TOPBAR_ACTION_PILL } from "@/components/layout/TopBar";
import { TABLE_PAGE_WRAPPER, TABLE_PAGE_CONTENT } from "@/lib/constants/page-layout";
import { TableSearch, InlineEmpty } from "@/components/shared";
import { Badge } from "@plexui/ui/components/Badge";
import { Button } from "@plexui/ui/components/Button";
import { Select } from "@plexui/ui/components/Select";
import { Plus } from "@plexui/ui/components/Icon";

interface Integration {
  id: string;
  name: string;
  description: string;
  provider: string;
  category: "identity" | "payments" | "communications" | "analytics" | "storage";
  status: "connected" | "disconnected" | "error";
  connectedAt?: string;
}

const mockIntegrations: Integration[] = [
  {
    id: "int_001",
    name: "Stripe",
    description: "Payment processing and billing",
    provider: "stripe",
    category: "payments",
    status: "connected",
    connectedAt: "2025-02-10T08:00:00Z",
  },
  {
    id: "int_002",
    name: "Twilio",
    description: "SMS and voice communications",
    provider: "twilio",
    category: "communications",
    status: "connected",
    connectedAt: "2025-02-08T14:30:00Z",
  },
  {
    id: "int_003",
    name: "SendGrid",
    description: "Email delivery and management",
    provider: "sendgrid",
    category: "communications",
    status: "connected",
    connectedAt: "2025-02-05T10:15:00Z",
  },
  {
    id: "int_004",
    name: "AWS S3",
    description: "Cloud storage and file management",
    provider: "aws",
    category: "storage",
    status: "connected",
    connectedAt: "2025-02-01T09:00:00Z",
  },
  {
    id: "int_005",
    name: "Google Analytics",
    description: "Website analytics and tracking",
    provider: "google",
    category: "analytics",
    status: "disconnected",
  },
  {
    id: "int_006",
    name: "Plaid",
    description: "Financial data aggregation",
    provider: "plaid",
    category: "identity",
    status: "error",
  },
  {
    id: "int_007",
    name: "Onfido",
    description: "Identity verification and KYC",
    provider: "onfido",
    category: "identity",
    status: "connected",
    connectedAt: "2025-01-28T11:45:00Z",
  },
  {
    id: "int_008",
    name: "Slack",
    description: "Team communication and notifications",
    provider: "slack",
    category: "communications",
    status: "disconnected",
  },
];

const CATEGORY_OPTIONS = [
  { value: "identity", label: "Identity" },
  { value: "payments", label: "Payments" },
  { value: "communications", label: "Communications" },
  { value: "analytics", label: "Analytics" },
  { value: "storage", label: "Storage" },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "connected":
      return "success";
    case "error":
      return "danger";
    default:
      return "warning";
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case "connected":
      return "Connected";
    case "disconnected":
      return "Disconnected";
    case "error":
      return "Error";
    default:
      return status;
  }
};

const STATUS_OPTIONS = [
  { value: "connected", label: "Connected" },
  { value: "disconnected", label: "Disconnected" },
  { value: "error", label: "Error" },
];

export default function IntegrationsPage() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string[]>([]);

  const hasActiveFilters = categoryFilter.length > 0 || statusFilter.length > 0;

  const filteredData = useMemo(() => {
    return mockIntegrations.filter((integration) => {
      if (categoryFilter.length > 0 && !categoryFilter.includes(integration.category)) {
        return false;
      }
      if (statusFilter.length > 0 && !statusFilter.includes(integration.status)) {
        return false;
      }
      if (search) {
        const searchLower = search.toLowerCase();
        return (
          integration.name.toLowerCase().includes(searchLower) ||
          integration.description.toLowerCase().includes(searchLower)
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
        title="Integrations"
        actions={
          <Button color="primary" size={TOPBAR_CONTROL_SIZE} pill={TOPBAR_ACTION_PILL}>
            <Plus className="h-4 w-4" />
            Add Integration
          </Button>
        }
        toolbar={
          <>
            <TableSearch
              value={search}
              onChange={setSearch}
              placeholder="Search integrations..."
            />
             <div className="w-44">
               <Select
                 multiple
                 clearable
                 block
                 pill={TOPBAR_TOOLBAR_PILL}
                 listMinWidth={200}
                 options={CATEGORY_OPTIONS}
                 value={categoryFilter}
                 onChange={(opts) => setCategoryFilter(opts.map((o) => o.value))}
                 placeholder="Category"
                 variant="outline"
                 size={TOPBAR_CONTROL_SIZE}
               />
             </div>
             <div className="w-40">
               <Select
                 multiple
                 clearable
                 block
                 pill={TOPBAR_TOOLBAR_PILL}
                 listMinWidth={180}
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

      <div className={TABLE_PAGE_CONTENT}>
        {filteredData.length === 0 ? (
          <InlineEmpty>{`No integrations match your filters.`}</InlineEmpty>
        ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredData.map((integration) => (
            <div
              key={integration.id}
              className="rounded-lg border border-[var(--color-border)] p-4"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="heading-xs">{integration.name}</span>
                <Badge
                  color={getStatusColor(integration.status)}
                  variant="soft"
                  size="sm"
                >
                  {getStatusLabel(integration.status)}
                </Badge>
              </div>
              <p className="mb-3 text-sm text-[var(--color-text-secondary)]">
                {integration.description}
              </p>
              <div className="flex items-center justify-between">
                <Badge variant="soft" size="sm">
                  {integration.category}
                </Badge>
                <Button
                  size="sm"
                  variant="outline"
                  color="secondary"
                >
                  {integration.status === "connected" ? "Configure" : "Connect"}
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
