"use client";

import { useState } from "react";
import Image from "next/image";
import { Search } from "@plexui/ui/components/Icon";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { CardHeader } from "@/components/shared/CardHeader";
import { KeyValueTable } from "@/components/shared/KeyValueTable";
import { CheckRow, CHECK_TABLE_HEADERS } from "@/components/shared/CheckRow";
import { toTitleCase } from "@/lib/utils/format";
import type { Verification } from "@/lib/types";

interface VerificationCardProps {
  verification: Verification;
  onOpenLightbox: (verificationId: string, photoIndex: number) => void;
  checkVariant?: "name-first" | "status-first";
}

export function VerificationCard({
  verification: v,
  onOpenLightbox,
  checkVariant = "name-first",
}: VerificationCardProps) {
  const [checksSearch, setChecksSearch] = useState("");

  const typeLabel =
    v.type === "government_id"
      ? "Government ID verification"
      : v.type === "selfie"
        ? "Selfie verification"
        : `${v.type.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())} verification`;

  const filteredChecks = checksSearch
    ? v.checks.filter((c) =>
        c.name.toLowerCase().includes(checksSearch.toLowerCase())
      )
    : v.checks;

  const duration =
    v.createdAt && v.completedAt
      ? Math.round(
          (new Date(v.completedAt).getTime() -
            new Date(v.createdAt).getTime()) /
            1000
        )
      : null;

  const headers = CHECK_TABLE_HEADERS[checkVariant];

  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
      <CardHeader
        title={typeLabel}
        badge={<StatusBadge status={v.status} />}
        startedAt={v.createdAt}
        endedAt={v.completedAt}
        duration={duration}
      />

      {v.photos && v.photos.length > 0 && (
        <div className="border-b border-[var(--color-border)] px-4 py-4">
          <div className="flex flex-wrap gap-4">
             {v.photos.map((photo, i) => (
               <button
                 type="button"
                 key={photo.label + i}
                 aria-label={`View ${photo.label}`}
                 className="group flex cursor-pointer flex-col gap-1.5 outline-none"
                 onClick={() => onOpenLightbox(v.id, i)}
               >
                <Image
                  src={photo.url}
                  alt={photo.label}
                  width={160}
                  height={160}
                  className="h-[160px] w-auto rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] object-contain transition-opacity group-hover:opacity-90"
                />
                <span className="w-full truncate text-center text-xs text-[var(--color-text-tertiary)]">
                  {photo.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {v.extractedData && Object.keys(v.extractedData).length > 0 && (
        <KeyValueTable
          bare
          rows={Object.entries(v.extractedData).map(([key, val]) => ({
            label: key,
            value:
              (key === "Full name" || key === "Address") && typeof val === "string"
                ? toTitleCase(val)
                : val,
          }))}
        />
      )}

      <div>
        <div className="flex items-center gap-2 border-y border-[var(--color-border)] bg-[var(--color-surface-secondary)] px-4 py-2">
          <span className="heading-xs text-[var(--color-text)]">Checks</span>
          <div className="relative ml-auto">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--color-text-tertiary)]" />
            <input
              type="text"
              placeholder="Search..."
              value={checksSearch}
              onChange={(e) => setChecksSearch(e.target.value)}
              className="h-8 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] pl-8 pr-3 text-xs text-[var(--color-text)] placeholder:text-[var(--color-text-tertiary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary-solid-bg)]"
            />
          </div>
        </div>
        {filteredChecks.length > 0 ? (
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--color-border)]">
                {headers.map((h) => (
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
                <CheckRow key={i} check={check} variant={checkVariant} />
              ))}
            </tbody>
          </table>
        ) : checksSearch ? (
          <div className="px-4 py-6 text-center text-sm text-[var(--color-text-tertiary)]">
            No checks matching &ldquo;{checksSearch}&rdquo;
          </div>
        ) : null}
      </div>
    </div>
  );
}
