import { useState } from "react";
import { Avatar } from "@plexui/ui/components/Avatar";
import { SectionHeading, KeyValueTable, DocumentViewer, PhotoThumbnail } from "@/components/shared";
import { formatDate, formatDateTime, toTitleCase } from "@/lib/utils/format";
import type { Account, Inquiry, Verification, DocumentViewerItem } from "@/lib/types";

export function OverviewTab({
  account,
  inquiries,
  verifications,
}: {
  account: Account;
  inquiries: Inquiry[];
  verifications: Verification[];
}) {
  const selfieVer = verifications.find((v) => v.type === "selfie");
  const selfiePhotos = selfieVer?.photos ?? [];

  const viewerItems: DocumentViewerItem[] = selfiePhotos.map((photo) => ({
    photo,
    verificationType: "Selfie",
  }));

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const latestInquiry = inquiries.length > 0
    ? inquiries.reduce((latest, inq) => (inq.createdAt > latest.createdAt ? inq : latest))
    : null;

  const hasIdNumbers = account.identificationNumbers && account.identificationNumbers.length > 0;

  return (
    <>
      <div className="space-y-8">
        <div className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
          <div className="border-b border-[var(--color-border)] px-5 py-4">
            {selfiePhotos.length > 0 ? (
              <div className="flex flex-wrap gap-4">
                {selfiePhotos.map((photo, i) => (
                  <PhotoThumbnail
                    key={photo.url}
                    src={photo.url}
                    label={photo.label}
                    onClick={() => setLightboxIndex(i)}
                  />
                ))}
              </div>
            ) : (
              <Avatar name={account.name} size={160} color="primary" />
            )}
          </div>
          <div className="-mb-px">
            <KeyValueTable
              bare
              rows={[
                { label: "Name", value: toTitleCase(account.name) },
                { label: "Birthdate", value: account.birthdate ? formatDate(account.birthdate) : "—" },
                { label: "Address", value: account.address ?? "—" },
                { label: "Email", value: account.email ?? "—" },
                { label: "Phone", value: account.phone ?? "—" },
              ]}
            />
          </div>
        </div>

        {hasIdNumbers && (
          <div>
            <SectionHeading size="sm">Identification Numbers</SectionHeading>
            <KeyValueTable
              rows={account.identificationNumbers!.map((id) => ({
                label: id.label,
                value: id.value,
              }))}
            />
          </div>
        )}

        <div>
          <SectionHeading size="sm">Summary</SectionHeading>
          <KeyValueTable
            rows={[
              { label: "Total Inquiries", value: inquiries.length },
              { label: "Total Verifications", value: verifications.length },
              { label: "Latest Inquiry", value: latestInquiry ? `${formatDateTime(latestInquiry.createdAt)} UTC` : "—" },
            ]}
          />
        </div>
      </div>

      {lightboxIndex !== null && viewerItems.length > 0 && (
        <DocumentViewer
          items={viewerItems}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  );
}
