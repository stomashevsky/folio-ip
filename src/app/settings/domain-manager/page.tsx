"use client";

import { useState } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { SectionHeading, CopyButton } from "@/components/shared";
import { Button } from "@plexui/ui/components/Button";
import { Badge } from "@plexui/ui/components/Badge";
import { Input } from "@plexui/ui/components/Input";
import { Field } from "@plexui/ui/components/Field";

interface Domain {
  id: string;
  domain: string;
  status: "verified" | "pending";
  ssl: "active" | "inactive";
  addedAt: string;
}

const mockDomains: Domain[] = [
  {
    id: "dom_001",
    domain: "verify.acmecorp.com",
    status: "verified",
    ssl: "active",
    addedAt: "2026-01-15",
  },
  {
    id: "dom_002",
    domain: "kyc.acmecorp.com",
    status: "pending",
    ssl: "inactive",
    addedAt: "2026-02-10",
  },
];

export default function DomainManagerPage() {
  const [newDomain, setNewDomain] = useState("");
  const [domains, setDomains] = useState(mockDomains);

  const handleAddDomain = () => {
    if (newDomain.trim()) {
      setDomains((prev) => [
        ...prev,
        {
          id: `dom_${Date.now()}`,
          domain: newDomain.trim(),
          status: "pending" as const,
          ssl: "inactive" as const,
          addedAt: new Date().toISOString().split("T")[0],
        },
      ]);
      setNewDomain("");
    }
  };

  const handleRemoveDomain = (id: string) => {
    setDomains((prev) => prev.filter((d) => d.id !== id));
  };

  return (
    <div className="flex h-full flex-col overflow-auto">
      <TopBar title="Domain Manager" />
      <div className="mx-auto w-full max-w-2xl px-4 py-8 md:px-6">
        {/* Custom Domains */}
        <SectionHeading size="xs">Custom Domains</SectionHeading>
        <div className="rounded-lg border border-[var(--color-border)] overflow-hidden mb-6">
          <table className="-mb-px w-full">
            <thead>
              <tr className="border-b border-[var(--color-border)]">
                <th className="px-4 py-3 text-left text-sm font-medium text-[var(--color-text)]">
                  Domain
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[var(--color-text)]">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[var(--color-text)]">
                  SSL
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[var(--color-text)]">
                  Added
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-[var(--color-text)]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {domains.map((domain) => (
                <tr
                  key={domain.id}
                  className="border-b border-[var(--color-border)]"
                >
                  <td className="px-4 py-3 text-sm font-medium text-[var(--color-text)]">
                    {domain.domain}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <Badge pill color={
                      domain.status === "verified" ? "success" : "secondary"
                    }
                    variant="soft"
                    size="sm">{domain.status.charAt(0).toUpperCase() +
                      domain.status.slice(1)}</Badge>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <Badge pill color={domain.ssl === "active" ? "success" : "secondary"}
                    variant="soft"
                    size="sm">{domain.ssl.charAt(0).toUpperCase() +
                      domain.ssl.slice(1)}</Badge>
                  </td>
                  <td className="px-4 py-3 text-sm text-[var(--color-text-secondary)]">
                    {domain.addedAt}
                  </td>
                  <td className="px-4 py-3 text-right text-sm">
                    <Button
                      color="danger"
                      variant="soft"
                      size="sm"
                      pill={false}
                      onClick={() => handleRemoveDomain(domain.id)}
                    >
                      Remove
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add Domain */}
        <SectionHeading size="xs">Add Domain</SectionHeading>
        <div className="mb-6">
          <Field
            label="Domain"
            description="Enter your custom domain for KYC flows"
          >
            <div className="flex gap-2">
              <Input
                placeholder="e.g. verify.yourcompany.com"
                value={newDomain}
                onChange={(e) => setNewDomain(e.target.value)}
                className="flex-1"
              />
              <Button
                color="primary"
                size="md"
                pill={false}
                onClick={handleAddDomain}
              >
                Add Domain
              </Button>
            </div>
          </Field>
        </div>

        {/* DNS Configuration */}
        <SectionHeading size="xs">DNS Configuration</SectionHeading>
        <p className="text-sm text-[var(--color-text-secondary)] mb-3">
          Add the following CNAME record to your DNS provider:
        </p>
        <div className="rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] p-4">
          <div className="flex items-center justify-between">
            <div className="font-mono text-sm text-[var(--color-text-secondary)]">
              <p>Type: CNAME</p>
              <p>Name: verify</p>
              <p>Value: custom.folio-app.com</p>
            </div>
            <CopyButton value="CNAME verify custom.folio-app.com" />
          </div>
        </div>
      </div>
    </div>
  );
}
