"use client";

import { TopBar } from "@/components/layout/TopBar";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { ChartCard, NotFoundPage, SummaryCard, DetailInfoList } from "@/components/shared";
import { mockVerifications } from "@/lib/data";
import { formatDateTime, toTitleCase } from "@/lib/utils/format";
import { VERIFICATION_TYPE_LABELS } from "@/lib/constants/verification-type-labels";
import { useParams } from "next/navigation";
import {
  CheckCircle,
  ExclamationMarkCircle,
} from "@plexui/ui/components/Icon";
import type { Check } from "@/lib/types";

function CheckRow({ check }: { check: Check }) {
  return (
    <div className="flex items-center justify-between rounded-md px-3 py-2 hover:bg-[var(--color-surface-secondary)]">
      <div className="flex items-center gap-2">
        {check.status === "passed" ? (
          <CheckCircle className="h-4 w-4 text-[var(--color-success-soft-text)]" />
        ) : check.status === "failed" ? (
          <ExclamationMarkCircle className="h-4 w-4 text-[var(--color-danger-soft-text)]" />
        ) : (
          <div className="h-4 w-4 rounded-full bg-[var(--color-surface-secondary)]" />
        )}
        <span className="text-sm text-[var(--color-text)]">{check.name}</span>
        {check.required && (
          <span className="text-[10px] uppercase tracking-wider text-[var(--color-text-tertiary)]">
            Required
          </span>
        )}
      </div>
      <span className="text-xs capitalize text-[var(--color-text-secondary)]">
        {check.category.replace("_", " ")}
      </span>
    </div>
  );
}

export default function VerificationDetailPage() {
  const params = useParams();

  const verification = mockVerifications.find((v) => v.id === params.id);

  if (!verification) {
    return <NotFoundPage section="Verifications" backHref="/verifications" entity="Verification" />;
  }

  const requiredChecks = verification.checks.filter((c) => c.required);
  const optionalChecks = verification.checks.filter((c) => !c.required);
  const passedCount = verification.checks.filter(
    (c) => c.status === "passed"
  ).length;
  const failedCount = verification.checks.filter(
    (c) => c.status === "failed"
  ).length;

  return (
    <div className="flex-1">
      <TopBar
        title="Verifications"
        backHref="/verifications"
      />
      <div className="px-4 pb-6 pt-6 md:px-6">
        {/* Summary */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryCard label="Status">
            <StatusBadge status={verification.status} />
          </SummaryCard>
          <SummaryCard label="Created At">
            <p className="text-sm font-medium text-[var(--color-text)]">
              {formatDateTime(verification.createdAt)}
            </p>
          </SummaryCard>
          <SummaryCard label="Checks Passed">
            <p className="heading-sm text-[var(--color-success-soft-text)]">
              {passedCount}{" "}
              <span className="text-sm font-normal text-[var(--color-text-tertiary)]">
                / {verification.checks.length}
              </span>
            </p>
          </SummaryCard>
          <SummaryCard label="Checks Failed">
            <p className={`heading-sm ${failedCount > 0 ? "text-[var(--color-danger-soft-text)]" : "text-[var(--color-text)]"}`}>
              {failedCount}
            </p>
          </SummaryCard>
        </div>

        {/* Details */}
        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <ChartCard title="Verification Details">
            <DetailInfoList
              items={[
                ["Verification ID", verification.id],
                ["Inquiry ID", verification.inquiryId],
                ["Type", VERIFICATION_TYPE_LABELS[verification.type] ?? verification.type],
                ["Created At", formatDateTime(verification.createdAt)],
                [
                  "Completed At",
                  verification.completedAt
                    ? formatDateTime(verification.completedAt)
                    : "—",
                ],
              ]}
            />
          </ChartCard>

          {verification.extractedData &&
            Object.keys(verification.extractedData).length > 0 && (
              <ChartCard title="Extracted Data">
                <DetailInfoList
                  items={Object.entries(verification.extractedData).map(
                    ([key, value]) => [
                      key.replace(/_/g, " "),
                      (key === "Full name" || key === "Address") && typeof value === "string"
                        ? toTitleCase(value)
                        : value,
                    ]
                  )}
                  mono={false}
                />
              </ChartCard>
            )}
        </div>

        {/* Checks */}
        <div className="mt-6 space-y-4">
          {requiredChecks.length > 0 && (
            <ChartCard
              title="Required Checks"
              description={`${requiredChecks.filter((c) => c.status === "passed").length} of ${requiredChecks.length} passed`}
            >
              <div className="space-y-1">
                {requiredChecks.map((check, i) => (
                  <CheckRow key={i} check={check} />
                ))}
              </div>
            </ChartCard>
          )}

          {optionalChecks.length > 0 && (
            <ChartCard
              title="Optional Checks"
              description={`${optionalChecks.filter((c) => c.status === "passed").length} of ${optionalChecks.length} passed`}
            >
              <div className="space-y-1">
                {optionalChecks.map((check, i) => (
                  <CheckRow key={i} check={check} />
                ))}
              </div>
            </ChartCard>
          )}
        </div>
      </div>
    </div>
  );
}
