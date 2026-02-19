import { ReportsTable } from "@/components/shared/ReportsTable";
import type { Report } from "@/lib/types";

export function ReportsTab({ reports }: { reports: Report[] }) {
  return (
    <ReportsTable
      reports={reports}
      emptyMessage="No reports for this account."
    />
  );
}
