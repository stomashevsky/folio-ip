import { TopBar } from "@/components/layout/TopBar";
import { EmptyMessage } from "@plexui/ui/components/EmptyMessage";
import { Search } from "@plexui/ui/components/Icon";

export default function VerificationsAnalyticsPage() {
  return (
    <div className="flex min-h-full flex-col">
      <TopBar
        title="Verification Analytics"
        description="Verification performance and trends"
      />
      <div className="flex flex-1 items-center justify-center py-12">
        <EmptyMessage>
          <EmptyMessage.Icon color="secondary"><Search /></EmptyMessage.Icon>
          <EmptyMessage.Title>Coming soon</EmptyMessage.Title>
          <EmptyMessage.Description>
            Verification analytics and insights will appear here.
          </EmptyMessage.Description>
        </EmptyMessage>
      </div>
    </div>
  );
}
