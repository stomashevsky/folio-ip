"use client";

import { TopBar } from "@/components/layout/TopBar";
import { Button } from "@plexui/ui/components/Button";
import { EmptyMessage } from "@plexui/ui/components/EmptyMessage";
import { Search } from "@plexui/ui/components/Icon";
import { useRouter } from "next/navigation";

interface NotFoundPageProps {
  /** Section name shown in TopBar (e.g. "Inquiries") */
  section: string;
  /** Back link href (e.g. "/inquiries") */
  backHref: string;
  /** Entity label for the title (e.g. "Inquiry") */
  entity: string;
}

export function NotFoundPage({ section, backHref, entity }: NotFoundPageProps) {
  const router = useRouter();

  return (
    <div className="flex min-h-full flex-col">
      <TopBar title={entity} backHref={backHref} backLabel={section} />
      <div className="flex flex-1 items-center justify-center py-12">
        <EmptyMessage>
          <EmptyMessage.Icon><Search /></EmptyMessage.Icon>
          <EmptyMessage.Title>{entity} not found</EmptyMessage.Title>
          <EmptyMessage.Description>
            The {entity.toLowerCase()} you&apos;re looking for doesn&apos;t exist.
          </EmptyMessage.Description>
          <EmptyMessage.ActionRow>
            <Button color="primary" pill={false} onClick={() => router.push(backHref)}>
              Back to {section}
            </Button>
          </EmptyMessage.ActionRow>
        </EmptyMessage>
      </div>
    </div>
  );
}
