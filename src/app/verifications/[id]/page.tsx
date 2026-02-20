"use client";

import { Suspense, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Alert } from "@plexui/ui/components/Alert";
import { Button } from "@plexui/ui/components/Button";
import { DotsHorizontal, Plus, Search } from "@plexui/ui/components/Icon";
import { Menu } from "@plexui/ui/components/Menu";
import { Input } from "@plexui/ui/components/Input";
import { Select } from "@plexui/ui/components/Select";
import { TopBar, TOPBAR_CONTROL_SIZE, TOPBAR_ACTION_PILL } from "@/components/layout/TopBar";
import { StatusBadge } from "@/components/shared/StatusBadge";
import {
  NotFoundPage,
  InfoRow,
  DocumentViewer,
  KeyValueTable,
  TagEditModal,
  CardHeader,
  DetailPageSidebar,
} from "@/components/shared";
import { mockVerifications, mockInquiries } from "@/lib/data";
import { formatDateTime, formatDuration, toTitleCase } from "@/lib/utils/format";
import { getAllKnownTags } from "@/lib/utils/tags";
import { VERIFICATION_TYPE_LABELS } from "@/lib/constants/verification-type-labels";
import {
  CHECK_TYPE_OPTIONS,
  CHECK_REQUIREMENT_OPTIONS,
} from "@/lib/constants/filter-options";
import type { DocumentViewerItem } from "@/lib/types";
import { CheckRow, CHECK_TABLE_HEADERS } from "@/components/shared/CheckRow";

const TYPE_OPTIONS = CHECK_TYPE_OPTIONS;
const REQUIREMENT_OPTIONS = CHECK_REQUIREMENT_OPTIONS;

export default function VerificationDetailPage() {
  return (
    <Suspense fallback={null}>
      <VerificationDetailContent />
    </Suspense>
  );
}

function VerificationDetailContent() {
  const params = useParams();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [checksSearch, setChecksSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string[]>([]);
  const [reqFilter, setReqFilter] = useState<string[]>([]);

  const verification = mockVerifications.find((v) => v.id === params.id);

  const [tags, setTags] = useState<string[]>([]);
  const [tagModalOpen, setTagModalOpen] = useState(false);
  const allKnownTags = getAllKnownTags();

  if (!verification) {
    return (
      <NotFoundPage
        section="Verifications"
        backHref="/verifications"
        entity="Verification"
      />
    );
  }

  const inquiry = mockInquiries.find((i) => i.id === verification.inquiryId);
  const typeLabel =
    VERIFICATION_TYPE_LABELS[verification.type] ?? verification.type;
  const duration =
    verification.createdAt && verification.completedAt
      ? Math.round(
          (new Date(verification.completedAt).getTime() -
            new Date(verification.createdAt).getTime()) /
            1000,
        )
      : null;

  const lowerSearch = checksSearch.toLowerCase();
  const filteredChecks = verification.checks.filter((c) => {
    if (checksSearch && !c.name.toLowerCase().includes(lowerSearch)) return false;
    if (typeFilter.length > 0 && !typeFilter.includes(c.category)) return false;
    if (reqFilter.length > 0) {
      const isRequired = c.required;
      if (reqFilter.includes("required") && !reqFilter.includes("optional") && !isRequired) return false;
      if (reqFilter.includes("optional") && !reqFilter.includes("required") && isRequired) return false;
    }
    return true;
  });

  const lightboxItems: DocumentViewerItem[] = (
    verification.photos ?? []
  ).map((photo) => ({
    photo,
    extractedData: verification.extractedData,
    verificationType: typeLabel,
  }));

  return (
    <div className="flex h-full flex-col">
      <TopBar
        title="Verification"
        backHref="/verifications"
        actions={
          <div className="flex items-center gap-2">
          <Menu>
            <Menu.Trigger>
              <Button color="secondary" variant="soft" size={TOPBAR_CONTROL_SIZE} pill={TOPBAR_ACTION_PILL}>
                <DotsHorizontal />
              </Button>
            </Menu.Trigger>
            <Menu.Content align="end" minWidth="auto">
              <Menu.Item onSelect={() => {}}>Mark as passed</Menu.Item>
              <Menu.Item onSelect={() => {}}>Mark as failed</Menu.Item>
              <Menu.Item onSelect={() => {}}>Requires retry</Menu.Item>
              <Menu.Separator />
              <Menu.Item onSelect={() => {}}>Archive</Menu.Item>
              <Menu.Separator />
              <Menu.Item onSelect={() => {}} className="text-[var(--color-text-danger-ghost)]">Delete</Menu.Item>
            </Menu.Content>
          </Menu>
          </div>
        }
      />

      <div className="flex flex-1 flex-col overflow-auto md:flex-row md:overflow-hidden">
        {/* Main content */}
        <div className="flex shrink-0 flex-col md:min-w-0 md:flex-1 md:overflow-auto">
          <div className="flex-1 overflow-auto px-4 py-6 md:px-6">
            {verification.status === "requires_retry" && (
              <div className="mb-4">
                <Alert
                  color="warning"
                  variant="soft"
                  title="Retry required"
                  description="This verification could not be completed and requires the user to retry. A new verification attempt will be created when the user restarts the flow."
                />
              </div>
            )}

            <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
              <CardHeader
                title={`${typeLabel} verification`}
                badge={<StatusBadge status={verification.status} />}
                startedAt={verification.createdAt}
                endedAt={verification.completedAt}
                duration={duration}
              />

              {/* Photos */}
              {verification.photos && verification.photos.length > 0 && (
                <div className="border-b border-[var(--color-border)] px-4 py-4">
                  <div className="flex flex-wrap gap-6">
                     {verification.photos.map((photo, i) => (
                       <div key={photo.label + i} className="flex flex-col">
                         <button
                           type="button"
                           aria-label={`View ${photo.label}`}
                           className="group flex cursor-pointer flex-col gap-1.5 outline-none"
                           onClick={() => setLightboxIndex(i)}
                         >
                          <Image
                             src={photo.url}
                             alt={photo.label}
                             width={160}
                             height={160}
                             className="h-[160px] w-auto rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] object-contain transition-opacity group-hover:opacity-90"
                           />
                          <span className="w-full truncate text-left text-xs text-[var(--color-text-tertiary)]">
                            {photo.label}
                          </span>
                        </button>
                        <div className="mt-2 space-y-0.5">
                          <p className="text-xs text-[var(--color-text-tertiary)]">
                            Capture method ({photo.label.toLowerCase()})
                          </p>
                          <p className="text-xs text-[var(--color-text)]">
                            {photo.captureMethod === "auto" ? "Live (autocapture)" : "Manual"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <KeyValueTable
                bare
                rows={[
                  ...(verification.extractedData
                    ? Object.entries(verification.extractedData).map(
                        ([key, val]) => ({
                          label: key,
                          value:
                            (key === "Full name" || key === "Address") &&
                            typeof val === "string"
                              ? toTitleCase(val)
                              : val,
                        }),
                      )
                    : []),
                  { label: "Sourced from", value: "User" },
                ]}
              />
            </div>

            {/* Checks – separate block */}
            <div className="mt-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
              <div className="px-4 py-3">
                <span className="heading-xs text-[var(--color-text)]">
                  Checks
                </span>

                {/* Toolbar */}
                <div className="mt-3 flex min-w-0 flex-wrap items-center gap-2">
                  <div className="w-56">
                    <Input
                      placeholder="Search checks..."
                      value={checksSearch}
                      onChange={(e) => setChecksSearch(e.target.value)}
                      onClear={checksSearch ? () => setChecksSearch("") : undefined}
                      startAdornment={<Search style={{ width: 16, height: 16 }} />}
                      size="sm"
                      pill
                    />
                  </div>
                  <div className="w-52">
                    <Select
                      multiple
                      clearable
                      block
                      pill
                      listMinWidth={220}
                      options={TYPE_OPTIONS}
                      value={typeFilter}
                      onChange={(opts) => setTypeFilter(opts.map((o) => o.value))}
                      placeholder="Type"
                      variant="outline"
                      size="sm"
                    />
                  </div>
                  <div className="w-44">
                    <Select
                      multiple
                      clearable
                      block
                      pill
                      listMinWidth={180}
                      options={REQUIREMENT_OPTIONS}
                      value={reqFilter}
                      onChange={(opts) => setReqFilter(opts.map((o) => o.value))}
                      placeholder="Requirement"
                      variant="outline"
                      size="sm"
                    />
                  </div>
                </div>
              </div>

              <div className="min-h-[200px]">
              {filteredChecks.length > 0 ? (
                <table className="w-full">
                  <thead>
                    <tr className="border-y border-[var(--color-border)]">
                      {CHECK_TABLE_HEADERS["status-first"].map((h) => (
                        <th
                          key={h.label}
                          className={`${h.width ?? ""} px-4 py-2 text-xs font-semibold uppercase tracking-[0.5px] text-[var(--color-text-tertiary)] ${
                            h.align === "center" ? "text-center" : "text-left"
                          }`}
                        >
                          {h.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredChecks.map((check, i) => (
                      <CheckRow key={i} check={check} variant="status-first" />
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="px-4 py-6 text-center text-sm text-[var(--color-text-tertiary)]">
                  {checksSearch || typeFilter.length > 0 || reqFilter.length > 0
                    ? "No checks matching current filters"
                    : "No checks"}
                </div>
              )}
              </div>
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <DetailPageSidebar
          infoRows={
            <>
              <InfoRow label="Verification ID" copyValue={verification.id} mono>
                {verification.id}
              </InfoRow>
              <InfoRow label="Type">{typeLabel}</InfoRow>
              <InfoRow label="Status">
                <StatusBadge status={verification.status} />
              </InfoRow>
              {inquiry && (
                <InfoRow
                  label="Account ID"
                  copyValue={inquiry.accountId}
                  mono
                >
                  <Link
                    href={`/accounts/${inquiry.accountId}`}
                    className="text-[var(--color-primary-solid-bg)] hover:underline"
                  >
                    {inquiry.accountId}
                  </Link>
                </InfoRow>
              )}
              <InfoRow
                label="Inquiry ID"
                copyValue={verification.inquiryId}
                mono
              >
                <Link
                  href={`/inquiries/${verification.inquiryId}`}
                  className="text-[var(--color-primary-solid-bg)] hover:underline"
                >
                  {verification.inquiryId}
                </Link>
              </InfoRow>
              {inquiry && (
                <InfoRow label="Template">
                  <span className="text-[var(--color-primary-solid-bg)]">
                    {inquiry.templateName}
                  </span>
                </InfoRow>
              )}
              <InfoRow label="Created At">
                {formatDateTime(verification.createdAt)} UTC
              </InfoRow>
              <InfoRow label="Completed At">
                {verification.completedAt ? (
                  `${formatDateTime(verification.completedAt)} UTC`
                ) : (
                  <span className="text-[var(--color-text-tertiary)]">
                    &mdash;
                  </span>
                )}
              </InfoRow>
              {duration !== null && (
                <InfoRow label="Duration">{formatDuration(duration)}</InfoRow>
              )}
            </>
          }
          tags={tags}
          onEditTags={() => setTagModalOpen(true)}
          tagAddLabel={<><Plus /><span>Add tag</span></>}
        />
      </div>

      {lightboxIndex !== null && lightboxItems.length > 0 && (
        <DocumentViewer
          items={lightboxItems}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}

      <TagEditModal
        open={tagModalOpen}
        onOpenChange={setTagModalOpen}
        tags={tags}
        onSave={setTags}
        allTags={allKnownTags}
      />
    </div>
  );
}
