"use client";

import { TopBar } from "@/components/layout/TopBar";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { NotFoundPage, InlineEmpty, EventTimeline, DocumentViewer } from "@/components/shared";
import {
  mockInquiries,
  mockVerifications,
  mockReports,
  getEventsForInquiry,
  getSessionsForInquiry,
  getSignalsForInquiry,
} from "@/lib/data";
import {
  formatDateTime,
  formatDuration,
  truncateId,
} from "@/lib/utils/format";
import { useParams } from "next/navigation";
import { useState } from "react";
import { Avatar } from "@plexui/ui/components/Avatar";
import { Badge } from "@plexui/ui/components/Badge";
import { Button } from "@plexui/ui/components/Button";
import { CopyTooltip, Tooltip } from "@plexui/ui/components/Tooltip";
import {
  CheckCircle,
  Copy,
  Globe,
  Desktop,
  MapPin,
  Tag,
  Search,
} from "@plexui/ui/components/Icon";
import type { Check, DocumentViewerItem, InquirySignal, SignalCategory } from "@/lib/types";

const tabs = [
  "Overview",
  "Verifications",
  "Sessions",
  "Signals",
  "Reports",
] as const;
type Tab = (typeof tabs)[number];

// ─── Check Row ───

function CheckRow({ check }: { check: Check }) {
  return (
    <div className="flex items-center gap-3 border-b border-[var(--color-border)] px-3 py-2.5 last:border-b-0">
      <div className="shrink-0">
        {check.status === "passed" ? (
          <Badge color="success" size="sm">Passed</Badge>
        ) : check.status === "failed" ? (
          <Badge color="danger" size="sm">Failed</Badge>
        ) : (
          <Badge color="secondary" size="sm">N/A</Badge>
        )}
      </div>
      <span className="flex-1 text-sm text-[var(--color-text)]">{check.name}</span>
      <span className="text-xs capitalize text-[var(--color-text-tertiary)]">
        {check.category.replace("_", " ")}
      </span>
      {check.required && (
        <CheckCircle className="h-3.5 w-3.5 shrink-0 text-[var(--color-text-tertiary)]" />
      )}
    </div>
  );
}

// ─── Map Embed (blocks scroll-zoom until clicked) ───

function MapEmbed({ latitude, longitude }: { latitude: number; longitude: number }) {
  const [interactive, setInteractive] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${longitude - 0.05},${latitude - 0.05},${longitude + 0.05},${latitude + 0.05}&layer=mapnik&marker=${latitude},${longitude}`;

  return (
    <div
      className="relative"
      onMouseLeave={() => setInteractive(false)}
    >
      <iframe
        key={resetKey}
        title="Session location"
        width="100%"
        height="300"
        className="border-0"
        loading="lazy"
        suppressHydrationWarning
        src={src}
      />
      {!interactive && (
        <div
          className="absolute inset-0 cursor-pointer"
          onClick={() => setInteractive(true)}
        />
      )}
      {interactive && (
        <Button
          color="secondary"
          variant="ghost"
          size="sm"
          uniform
          className="absolute right-2 top-2 bg-white/90 shadow-sm backdrop-blur-sm hover:bg-white"
          onClick={() => { setResetKey((k) => k + 1); setInteractive(false); }}
        >
          <MapPin className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}

// ─── Info Row ───

function InfoRow({
  label,
  children,
  copyValue,
}: {
  label: string;
  children: React.ReactNode;
  copyValue?: string;
}) {
  return (
    <div className="py-2">
      <div className="text-xs text-[var(--color-text-tertiary)]">{label}</div>
      <div className="mt-0.5 flex items-center gap-1.5 text-sm text-[var(--color-text)]">
        <span className="min-w-0 break-all">{children}</span>
        {copyValue && (
          <CopyTooltip copyValue={copyValue}>
            <Tooltip.TriggerDecorator>
              <button className="shrink-0 text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)]">
                <Copy className="h-3.5 w-3.5" />
              </button>
            </Tooltip.TriggerDecorator>
          </CopyTooltip>
        )}
      </div>
    </div>
  );
}

// ─── Signal Table ───

function SignalTable({
  title,
  signals,
  count,
}: {
  title: string;
  signals: InquirySignal[];
  count?: number;
}) {
  if (signals.length === 0) return null;
  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="flex items-center justify-between border-b border-[var(--color-border)] px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="heading-xs text-[var(--color-text)]">{title}</span>
          {typeof count === "number" && count > 0 && (
            <span className="text-xs text-[var(--color-text-tertiary)]">
              {count} signal{count !== 1 ? "s" : ""} selected
            </span>
          )}
        </div>
      </div>
      <table className="w-full table-fixed">
        <colgroup>
          <col className="w-2/5" />
          <col />
          <col className="w-[15%]" />
        </colgroup>
        <thead>
          <tr className="border-b border-[var(--color-border)]">
            <th className="px-4 py-2 text-left text-xs font-medium text-[var(--color-text-tertiary)]">
              Signal name
            </th>
            <th className="px-4 py-2 text-left text-xs font-medium text-[var(--color-text-tertiary)]">
              Value
            </th>
            <th className="px-4 py-2 text-left text-xs font-medium text-[var(--color-text-tertiary)]">
              Type
            </th>
          </tr>
        </thead>
        <tbody>
          {signals.map((s) => (
            <tr
              key={s.name + s.category}
              className={`border-b border-[var(--color-border)] last:border-b-0 ${
                s.flagged ? "bg-[var(--color-warning-soft-bg)]" : ""
              }`}
            >
              <td className="px-4 py-2.5 text-sm text-[var(--color-text)]">
                {s.name}
              </td>
              <td className="px-4 py-2.5 text-sm text-[var(--color-text)]">
                {s.value}
                {s.flagged && (
                  <span className="ml-1.5 inline-block h-3.5 w-3.5 rounded-full bg-[var(--color-danger-solid-bg)] text-center text-[10px] leading-[14px] text-white">
                    !
                  </span>
                )}
              </td>
              <td className="px-4 py-2.5 text-xs text-[var(--color-text-tertiary)]">
                {s.type}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Detail Row ───

function DetailRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-4">
      <span className="w-2/5 shrink-0 text-sm text-[var(--color-text-tertiary)]">
        {label}
      </span>
      <span className="text-sm text-[var(--color-text)]">{children}</span>
    </div>
  );
}

// ─── Main Page ───

export default function InquiryDetailPage() {
  const params = useParams();
  const [activeTab, setActiveTab] = useState<Tab>("Overview");
  const [checksSearch, setChecksSearch] = useState("");

  const inquiry = mockInquiries.find((i) => i.id === params.id);
  const verifications = mockVerifications.filter(
    (v) => v.inquiryId === inquiry?.id
  );
  const reports = mockReports.filter((r) => r.inquiryId === inquiry?.id);

  if (!inquiry) {
    return (
      <NotFoundPage
        section="Inquiries"
        backHref="/inquiries"
        entity="Inquiry"
      />
    );
  }

  const events = getEventsForInquiry(inquiry.id);
  const sessions = getSessionsForInquiry(inquiry.id);
  const signals = getSignalsForInquiry(inquiry.id);

  const tabCounts: Record<string, number | undefined> = {
    Verifications: verifications.length || undefined,
    Sessions: sessions.length || undefined,
    Reports: reports.length || undefined,
  };

  const featuredSignals = signals.filter((s) => s.category === "featured");
  const flaggedCount = featuredSignals.filter((s) => s.flagged).length;

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <TopBar
        title="Inquiry details"
        backHref="/inquiries"
        actions={
          <div className="flex items-center gap-2">
            <Button color="primary" size="sm" pill={false}>
              Review
            </Button>
            <Button color="secondary" variant="outline" size="sm" pill={false}>
              More
            </Button>
          </div>
        }
      />

      {/* Content + Sidebar */}
      <div className="flex flex-1 overflow-hidden">
        {/* Main content */}
        <div className="flex flex-1 flex-col overflow-auto">
          {/* Tabs */}
          <div className="shrink-0 px-6 pt-4">
            <div className="flex gap-1 border-b border-[var(--color-border)]">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2.5 text-sm font-medium transition-colors ${
                    activeTab === tab
                      ? "border-b-2 border-[var(--color-primary-solid-bg)] text-[var(--color-text)]"
                      : "text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)]"
                  }`}
                >
                  {tab}
                  {tabCounts[tab] != null && (
                    <span className="ml-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--color-surface-secondary)] px-1.5 text-xs text-[var(--color-text-tertiary)]">
                      {tabCounts[tab]}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Tab content */}
          <div className="flex-1 overflow-auto px-6 py-6">
            {activeTab === "Overview" && (
              <OverviewTab
                inquiry={inquiry}
                verifications={verifications}
                sessions={sessions}
                signals={featuredSignals}
                flaggedCount={flaggedCount}
              />
            )}
            {activeTab === "Verifications" && (
              <VerificationsTab
                verifications={verifications}
                checksSearch={checksSearch}
                onChecksSearchChange={setChecksSearch}
              />
            )}
            {activeTab === "Sessions" && <SessionsTab sessions={sessions} />}
            {activeTab === "Signals" && <SignalsTab signals={signals} />}
            {activeTab === "Reports" && <ReportsTab reports={reports} />}
          </div>
        </div>

        {/* Right sidebar */}
        <div className="w-96 shrink-0 overflow-auto border-l border-[var(--color-border)] bg-[var(--color-surface)]">
          <div className="px-5 py-5">
            {/* Info section */}
            <h3 className="heading-sm text-[var(--color-text)]">Info</h3>
            <div className="mt-3 space-y-1">
              <InfoRow label="Inquiry ID" copyValue={inquiry.id}>
                {inquiry.id}
              </InfoRow>
              <InfoRow label="Reference ID" copyValue={inquiry.referenceId}>
                {inquiry.referenceId ?? (
                  <span className="text-[var(--color-text-tertiary)]">No reference ID</span>
                )}
              </InfoRow>
              <InfoRow label="Account ID" copyValue={inquiry.accountId}>
                <span className="text-sm text-[var(--color-primary-solid-bg)]">
                  {inquiry.accountId}
                </span>
              </InfoRow>
              <InfoRow label="Created At">
                {formatDateTime(inquiry.createdAt)} UTC by{" "}
                {inquiry.accountName}
              </InfoRow>
              <InfoRow label="Template">
                <span className="text-sm text-[var(--color-primary-solid-bg)]">
                  {inquiry.templateName}
                </span>
              </InfoRow>
              <InfoRow label="Status">
                <div className="flex items-center gap-2">
                  <StatusBadge status={inquiry.status} />
                </div>
              </InfoRow>
              <InfoRow label="Notes">
                <span className="text-[var(--color-text-tertiary)]">—</span>
              </InfoRow>
            </div>
          </div>

          {/* Tags */}
          <div className="border-t border-[var(--color-border)] px-5 py-4">
            <h3 className="heading-sm text-[var(--color-text)]">Tags</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {inquiry.tags.length > 0 ? (
                inquiry.tags.map((tag) => (
                  <Badge key={tag} color="secondary" size="sm">
                    {tag}
                  </Badge>
                ))
              ) : (
                <button className="flex items-center gap-1 text-sm text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)]">
                  <Tag className="h-3.5 w-3.5" />
                  Add tag
                </button>
              )}
            </div>
          </div>

          {/* Cases */}
          <div className="border-t border-[var(--color-border)] px-5 py-4">
            <div className="flex items-center gap-2">
              <h3 className="heading-sm text-[var(--color-text)]">Cases</h3>
              <span className="text-xs text-[var(--color-text-tertiary)]">0</span>
            </div>
            <p className="mt-2 text-xs text-[var(--color-text-tertiary)]">
              There are no cases associated with this inquiry.
            </p>
          </div>

          {/* Event Timeline */}
          <div className="border-t border-[var(--color-border)] px-5 py-4">
            {events.length > 0 ? (
              <EventTimeline events={events} />
            ) : (
              <div>
                <h3 className="heading-sm text-[var(--color-text)]">
                  Event timeline (UTC)
                </h3>
                <p className="mt-3 text-xs text-[var(--color-text-tertiary)]">
                  No events recorded.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Tab Components ───

function OverviewTab({
  inquiry,
  verifications,
  sessions,
  signals,
  flaggedCount,
}: {
  inquiry: (typeof mockInquiries)[0];
  verifications: typeof mockVerifications;
  sessions: ReturnType<typeof getSessionsForInquiry>;
  signals: InquirySignal[];
  flaggedCount: number;
}) {
  // Collect photos from verifications with extraction data
  const govIdVer = verifications.find((v) => v.type === "government_id");
  const selfieVer = verifications.find((v) => v.type === "selfie");
  const viewerItems: DocumentViewerItem[] = [
    ...(govIdVer?.photos ?? []).map((photo) => ({
      photo,
      extractedData: govIdVer?.extractedData,
      verificationType: "Government ID",
    })),
    ...(selfieVer?.photos ?? []).map((photo) => ({
      photo,
      extractedData: undefined,
      verificationType: "Selfie",
    })),
  ];
  const hasPhotos = viewerItems.length > 0;

  // Lightbox state
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Get first session for location
  const session = sessions[0];

  // Build verification type label for Collected header
  const verTypeLabels: string[] = [];
  if (govIdVer) verTypeLabels.push("Government ID");
  if (selfieVer) verTypeLabels.push("Selfie");

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div>
        <h2 className="heading-sm mb-3 text-[var(--color-text)]">Summary</h2>
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
          <table className="w-full table-fixed">
            <tbody>
              <tr className="border-b border-[var(--color-border)]">
                <td className="w-2/5 px-4 py-2.5 text-sm text-[var(--color-text-tertiary)]">
                  Time to Finish
                </td>
                <td className="px-4 py-2.5 text-sm text-[var(--color-text)]">
                  {inquiry.timeToFinish
                    ? formatDuration(inquiry.timeToFinish)
                    : "—"}
                </td>
              </tr>
              <tr className="border-b border-[var(--color-border)]">
                <td className="w-2/5 px-4 py-2.5 text-sm text-[var(--color-text-tertiary)]">
                  Government ID Attempts
                </td>
                <td className="px-4 py-2.5 text-sm text-[var(--color-text)]">
                  {inquiry.verificationAttempts.governmentId}
                </td>
              </tr>
              <tr>
                <td className="w-2/5 px-4 py-2.5 text-sm text-[var(--color-text-tertiary)]">
                  Selfie Attempts
                </td>
                <td className="px-4 py-2.5 text-sm text-[var(--color-text)]">
                  {inquiry.verificationAttempts.selfie}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Collected photos */}
      {hasPhotos && (
        <div>
          <h2 className="heading-sm mb-1 text-[var(--color-text)]">Collected</h2>
          {verTypeLabels.length > 0 && (
            <p className="mb-3 text-sm text-[var(--color-text-tertiary)]">
              {verTypeLabels.join(" + ")}
            </p>
          )}
          <div className="flex flex-wrap gap-4">
            {viewerItems.map((item, i) => (
              <button
                key={item.photo.label + i}
                className="group flex min-w-[100px] cursor-pointer flex-col gap-1.5"
                onClick={() => setLightboxIndex(i)}
              >
                <img
                  src={item.photo.url}
                  alt={item.photo.label}
                  className="h-[160px] w-auto rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] object-contain transition-opacity group-hover:opacity-90"
                />
                <span className="w-full truncate text-center text-xs text-[var(--color-text-tertiary)]">
                  {item.photo.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Document viewer */}
      {lightboxIndex !== null && (
        <DocumentViewer
          items={viewerItems}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}

      {/* Attributes */}
      <div>
        <h2 className="heading-sm mb-3 text-[var(--color-text)]">Attributes</h2>
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
          {verifications.length > 0 && verifications[0].extractedData ? (
            <table className="w-full table-fixed">
              <tbody>
                {Object.entries(verifications[0].extractedData).map(
                  ([key, val]) => (
                    <tr
                      key={key}
                      className="border-b border-[var(--color-border)] last:border-b-0"
                    >
                      <td className="w-2/5 px-4 py-2.5 text-sm text-[var(--color-text-tertiary)]">
                        {key}
                      </td>
                      <td className="px-4 py-2.5 text-sm text-[var(--color-text)]">
                        {val}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          ) : (
            <div className="p-4">
              <p className="text-sm text-[var(--color-text-tertiary)]">
                No attributes collected.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Location */}
      {session && (
        <div>
          <h2 className="heading-sm mb-3 text-[var(--color-text)]">Location</h2>
          <div className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
            <MapEmbed
              latitude={session.latitude}
              longitude={session.longitude}
            />
            <div className="flex items-center gap-4 border-t border-[var(--color-border)] px-4 py-3">
              <div className="flex items-center gap-2 text-sm text-[var(--color-text)]">
                <Globe className="h-4 w-4 shrink-0 text-[var(--color-text-tertiary)]" />
                {session.location}, {session.country}
              </div>
              <span className="text-sm text-[var(--color-text-tertiary)]">
                {session.latitude.toFixed(4)}° N, {Math.abs(session.longitude).toFixed(4)}° {session.longitude >= 0 ? "E" : "W"}
              </span>
              <span className="text-sm text-[var(--color-text-tertiary)]">
                {session.deviceType}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Signals preview */}
      {signals.length > 0 && (
        <div>
          <h2 className="heading-sm mb-3 text-[var(--color-text)]">Signals</h2>
          <SignalTable
            title="Featured"
            signals={signals}
            count={flaggedCount}
          />
        </div>
      )}
    </div>
  );
}

function VerificationsTab({
  verifications,
  checksSearch,
  onChecksSearchChange,
}: {
  verifications: typeof mockVerifications;
  checksSearch: string;
  onChecksSearchChange: (v: string) => void;
}) {
  if (verifications.length === 0) {
    return (
      <InlineEmpty>No verifications linked to this inquiry.</InlineEmpty>
    );
  }

  return (
    <div className="space-y-6">
      {verifications.map((v) => {
        const typeLabel =
          v.type === "government_id"
            ? "Government ID verification"
            : v.type === "selfie"
              ? "Selfie verification"
              : `${v.type.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())} verification`;

        const filteredChecks = v.checks.filter((c) =>
          c.name.toLowerCase().includes(checksSearch.toLowerCase())
        );

        const duration =
          v.createdAt && v.completedAt
            ? Math.round(
                (new Date(v.completedAt).getTime() -
                  new Date(v.createdAt).getTime()) /
                  1000
              )
            : null;

        return (
          <div
            key={v.id}
            className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[var(--color-border)] px-4 py-3">
              <div className="flex items-center gap-3">
                <span className="heading-xs text-[var(--color-text)]">
                  {typeLabel}
                </span>
                <StatusBadge status={v.status} />
              </div>
            </div>

            {/* Extracted data */}
            {v.extractedData && Object.keys(v.extractedData).length > 0 && (
              <div className="border-b border-[var(--color-border)]">
                <table className="w-full table-fixed">
                  <tbody>
                    {Object.entries(v.extractedData).map(([key, val]) => (
                      <tr
                        key={key}
                        className="border-b border-[var(--color-border)] last:border-b-0"
                      >
                        <td className="w-2/5 px-4 py-2.5 text-sm text-[var(--color-text-tertiary)]">
                          {key}
                        </td>
                        <td className="px-4 py-2.5 text-sm text-[var(--color-text)]">
                          {val}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Checks */}
            <div className="p-4">
              <div className="mb-3 flex items-center gap-2">
                <h3 className="heading-xs text-[var(--color-text)]">Checks</h3>
                <div className="relative ml-auto">
                  <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--color-text-tertiary)]" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={checksSearch}
                    onChange={(e) => onChecksSearchChange(e.target.value)}
                    className="h-8 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] pl-8 pr-3 text-xs text-[var(--color-text)] placeholder:text-[var(--color-text-quaternary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary-solid-bg)]"
                  />
                </div>
              </div>

              {/* Checks header */}
              <div className="flex items-center gap-3 border-b border-[var(--color-border)] px-3 py-2">
                <span className="shrink-0 text-xs font-medium text-[var(--color-text-tertiary)]">
                  Status
                </span>
                <span className="flex-1 text-xs font-medium text-[var(--color-text-tertiary)]">
                  Check name
                </span>
                <span className="text-xs font-medium text-[var(--color-text-tertiary)]">
                  Type
                </span>
                <span className="w-4 shrink-0 text-xs font-medium text-[var(--color-text-tertiary)]">
                  Req
                </span>
              </div>

              {filteredChecks.map((check, i) => (
                <CheckRow key={i} check={check} />
              ))}
            </div>

            {/* Footer */}
            {v.completedAt && (
              <div className="border-t border-[var(--color-border)] px-4 py-2.5 text-xs text-[var(--color-text-tertiary)]">
                {v.type === "government_id" ? "Government ID" : v.type === "selfie" ? "Selfie" : v.type}
                {" · "}
                {formatDateTime(v.createdAt)} – {formatDateTime(v.completedAt)}
                {duration != null && ` · ${duration}s`}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function SessionsTab({
  sessions,
}: {
  sessions: ReturnType<typeof getSessionsForInquiry>;
}) {
  if (sessions.length === 0) {
    return <InlineEmpty>No sessions recorded for this inquiry.</InlineEmpty>;
  }

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="border-b border-[var(--color-border)] px-4 py-3">
          <h2 className="heading-sm text-[var(--color-text)]">Summary</h2>
        </div>
        <table className="w-full table-fixed">
          <tbody>
            {sessions.map((s) => (
              <tr
                key={s.id}
                className="border-b border-[var(--color-border)] last:border-b-0"
              >
                <td className="w-2/5 px-4 py-3 text-sm text-[var(--color-text)]">
                  <div className="flex items-center gap-2">
                    <Desktop className="h-4 w-4 shrink-0 text-[var(--color-text-tertiary)]" />
                    {s.deviceType}
                  </div>
                  <span className="ml-6 font-mono text-xs text-[var(--color-text-tertiary)]">
                    {truncateId(s.deviceId)}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-[var(--color-text)]">
                  Created at {formatDateTime(s.createdAt)}
                  <br />
                  Started at {formatDateTime(s.startedAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Session details */}
      {sessions.map((s) => (
        <div
          key={s.id}
          className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]"
        >
          <div className="border-b border-[var(--color-border)] px-4 py-3">
            <h2 className="heading-sm text-[var(--color-text)]">
              Session 1 – Created at {formatDateTime(s.createdAt)}
            </h2>
          </div>
          <div className="p-4">
            <div className="space-y-3">
              <DetailRow label="Lat/Lng">
                {s.latitude.toFixed(4)}° N {Math.abs(s.longitude).toFixed(4)}°{" "}
                {s.longitude >= 0 ? "E" : "W"}
              </DetailRow>
              <DetailRow label="Created at">
                {formatDateTime(s.createdAt)}
              </DetailRow>
              <DetailRow label="Started at">
                {formatDateTime(s.startedAt)}
              </DetailRow>
              <DetailRow label="Expired at">
                {s.expiredAt ? formatDateTime(s.expiredAt) : "—"}
              </DetailRow>
            </div>

            <div className="mt-6">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-[var(--color-text-tertiary)]" />
                <h3 className="heading-xs text-[var(--color-text)]">
                  Network details
                </h3>
              </div>
              <div className="mt-3 space-y-3">
                <DetailRow label="IP address">{s.ipAddress}</DetailRow>
                <DetailRow label="Network threat level">
                  {s.networkThreatLevel}
                </DetailRow>
                <DetailRow label="Location">
                  {s.location}, {s.country}
                </DetailRow>
                <DetailRow label="Device">{s.deviceType}</DetailRow>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function SignalsTab({ signals }: { signals: InquirySignal[] }) {
  if (signals.length === 0) {
    return (
      <InlineEmpty>
        No signals recorded for this inquiry.
      </InlineEmpty>
    );
  }

  const byCategory = (cat: SignalCategory) =>
    signals.filter((s) => s.category === cat);

  const featured = byCategory("featured");
  const network = byCategory("network");
  const behavioral = byCategory("behavioral");
  const device = byCategory("device");

  const flaggedCount = (arr: InquirySignal[]) =>
    arr.filter((s) => s.flagged).length;

  return (
    <div className="space-y-6">
      <SignalTable
        title="Featured"
        signals={featured}
        count={flaggedCount(featured)}
      />
      <SignalTable title="Network" signals={network} />
      <SignalTable
        title="Behavioral"
        signals={behavioral}
        count={flaggedCount(behavioral)}
      />
      <SignalTable title="Device" signals={device} />
      <SignalTable
        title="All Signals"
        signals={signals}
        count={flaggedCount(signals)}
      />
    </div>
  );
}

function ReportsTab({ reports }: { reports: typeof mockReports }) {
  if (reports.length === 0) {
    return (
      <InlineEmpty>No reports linked to this inquiry.</InlineEmpty>
    );
  }

  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[var(--color-border)]">
            <th className="px-4 py-2.5 text-left text-xs font-medium text-[var(--color-text-tertiary)]">
              Primary Input
            </th>
            <th className="px-4 py-2.5 text-left text-xs font-medium text-[var(--color-text-tertiary)]">
              Status
            </th>
            <th className="px-4 py-2.5 text-left text-xs font-medium text-[var(--color-text-tertiary)]">
              Report ID
            </th>
            <th className="px-4 py-2.5 text-left text-xs font-medium text-[var(--color-text-tertiary)]">
              Last updated at (UTC)
            </th>
          </tr>
        </thead>
        <tbody>
          {reports.map((r) => (
            <tr
              key={r.id}
              className="border-b border-[var(--color-border)] last:border-b-0 hover:bg-[var(--color-surface-secondary)]"
            >
              <td className="px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-[var(--color-text)]">
                    {r.primaryInput}
                  </p>
                  <p className="text-xs text-[var(--color-text-tertiary)]">
                    {r.type === "pep"
                      ? "Politically Exposed Person Report"
                      : r.type === "watchlist"
                        ? "Watchlist Report"
                        : "Adverse Media Report"}
                  </p>
                </div>
              </td>
              <td className="px-4 py-3">
                <StatusBadge
                  status={r.status}
                  label={r.status === "no_matches" ? "No Matches" : undefined}
                />
              </td>
              <td className="px-4 py-3 font-mono text-xs text-[var(--color-text-tertiary)]">
                {truncateId(r.id)}
              </td>
              <td className="px-4 py-3 text-sm text-[var(--color-text)]">
                {r.completedAt ? formatDateTime(r.completedAt) : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


