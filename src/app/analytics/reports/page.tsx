import { TopBar } from "@/components/layout/TopBar";
import { EmptyMessage } from "@plexui/ui/components/EmptyMessage";
import { Search } from "@plexui/ui/components/Icon";

export default function ReportsAnalyticsPage() {
  return (
    <div className="flex min-h-full flex-col">
      <TopBar
        title="Report Analytics"
        description="AML screening trends and match rates"
      />
      <div className="flex flex-1 items-center justify-center py-12">
        <EmptyMessage>
          <EmptyMessage.Icon color="secondary"><Search /></EmptyMessage.Icon>
          <EmptyMessage.Title>Coming soon</EmptyMessage.Title>
          <EmptyMessage.Description>
            Report analytics and insights will appear here.
          </EmptyMessage.Description>
        </EmptyMessage>
      </div>
    </div>
  );
}
