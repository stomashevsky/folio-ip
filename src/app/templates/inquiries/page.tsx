import { TopBar } from "@/components/layout/TopBar";
import { EmptyMessage } from "@plexui/ui/components/EmptyMessage";
import { LayoutTemplate } from "lucide-react";

export default function InquiryTemplatesPage() {
  return (
    <div className="flex min-h-full flex-col">
      <TopBar
        title="Inquiry Templates"
        description="Manage and configure inquiry verification flows"
      />
      <div className="flex flex-1 items-center justify-center py-12">
        <EmptyMessage>
          <EmptyMessage.Icon color="secondary"><LayoutTemplate /></EmptyMessage.Icon>
          <EmptyMessage.Title>No templates yet</EmptyMessage.Title>
          <EmptyMessage.Description>
            Inquiry templates define verification steps and requirements. This
            feature is coming soon.
          </EmptyMessage.Description>
        </EmptyMessage>
      </div>
    </div>
  );
}
