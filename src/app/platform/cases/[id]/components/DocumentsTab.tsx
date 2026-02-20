"use client";

import { useState } from "react";
import Image from "next/image";
import { InlineEmpty, DocumentViewer } from "@/components/shared";
import { COUNTRY_LABEL_MAP } from "@/lib/constants/countries";
import { DOCUMENT_SECTION_TITLES, ID_CLASS_LABELS } from "@/lib/constants/document-labels";
import { formatDateTime } from "@/lib/utils/format";
import type { Verification, VerificationType, DocumentViewerItem } from "@/lib/types";

const DOCUMENT_TYPES: VerificationType[] = ["government_id", "document", "health_insurance_card", "vehicle_insurance"];

function groupDocuments(verifications: Verification[]): Map<string, Verification[]> {
  const groups = new Map<string, Verification[]>();
  for (const v of verifications) {
    if (!DOCUMENT_TYPES.includes(v.type) || !v.photos?.length) continue;
    const section = DOCUMENT_SECTION_TITLES[v.type] ?? v.type;
    const list = groups.get(section) ?? [];
    list.push(v);
    groups.set(section, list);
  }
  return groups;
}

const TH = "px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-[0.5px] text-[var(--color-text-tertiary)]";

export function DocumentsTab({ verifications }: { verifications: Verification[] }) {
  const groups = groupDocuments(verifications);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (groups.size === 0) {
    return <InlineEmpty>No documents linked to this case.</InlineEmpty>;
  }

  const allVerifications = Array.from(groups.values()).flat();
  const viewerItems: DocumentViewerItem[] = allVerifications.flatMap((v) =>
    (v.photos ?? []).map((photo) => ({
      photo,
      extractedData: v.extractedData,
      verificationType: DOCUMENT_SECTION_TITLES[v.type] ?? v.type,
    }))
  );

  let globalIndex = 0;

  return (
    <>
      <div className="space-y-6">
        {Array.from(groups.entries()).map(([section, entries]) => (
          <div key={section}>
            <h3 className="heading-sm mb-3">{section}</h3>
            <div className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
              <table className="-mb-px w-full">
                <thead>
                  <tr className="border-b border-[var(--color-border)]">
                    <th className={TH} />
                    <th className={TH}>Country</th>
                    <th className={TH}>ID class</th>
                    <th className={TH}>Date processed</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((v) => {
                    const viewerIdx = globalIndex;
                    globalIndex += v.photos?.length ?? 0;

                    return (
                      <tr
                        key={v.id}
                        className="cursor-pointer border-b border-[var(--color-border)] transition-colors last:border-b-0 hover:bg-[var(--color-surface-secondary)]"
                        onClick={() => setLightboxIndex(viewerIdx)}
                      >
                        <td className="w-[72px] px-4 py-3">
                          <Image
                            src={v.photos![0].url}
                            alt={v.countryCode ?? "ID"}
                            width={48}
                            height={36}
                            className="h-9 w-12 shrink-0 rounded border border-[var(--color-border)] object-cover"
                          />
                        </td>
                        <td className="px-4 py-3 text-sm text-[var(--color-text)]">
                          {v.countryCode ? (COUNTRY_LABEL_MAP[v.countryCode] ?? v.countryCode) : "—"}
                        </td>
                        <td className="px-4 py-3 text-sm text-[var(--color-text)]">
                          {v.idClass ? (ID_CLASS_LABELS[v.idClass] ?? v.idClass) : "—"}
                        </td>
                        <td className="px-4 py-3 text-sm text-[var(--color-text-secondary)]">
                          {v.completedAt ? `${formatDateTime(v.completedAt)} UTC` : "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>

      {lightboxIndex !== null && (
        <DocumentViewer
          items={viewerItems}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  );
}
