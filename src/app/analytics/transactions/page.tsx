import { TopBar } from "@/components/layout/TopBar";
import { EmptyMessage } from "@plexui/ui/components/EmptyMessage";
import { Search } from "@plexui/ui/components/Icon";

export default function TransactionsAnalyticsPage() {
  return (
    <div className="flex min-h-full flex-col">
      <TopBar
        title="Transaction Analytics"
        description="Transaction monitoring trends and patterns"
      />
      <div className="flex flex-1 items-center justify-center py-12">
        <EmptyMessage>
          <EmptyMessage.Icon color="secondary"><Search /></EmptyMessage.Icon>
          <EmptyMessage.Title>Coming soon</EmptyMessage.Title>
          <EmptyMessage.Description>
            Transaction analytics and insights will appear here.
          </EmptyMessage.Description>
        </EmptyMessage>
      </div>
    </div>
  );
}
