"use client";

import { Suspense } from "react";
import { ReportRatesChart } from "@/components/charts/ReportRatesChart";
import { AnalyticsPageLayout } from "@/components/shared/AnalyticsPageLayout";
import {
  deriveReportHighlights,
  generateReportTimeSeries,
  generateReportRateTimeSeries,
} from "@/lib/data";
import { aggregateReportRates } from "@/lib/utils/analytics";

export default function ReportsAnalyticsPage() {
  return (
    <Suspense fallback={null}>
      <ReportsAnalyticsContent />
    </Suspense>
  );
}

function ReportsAnalyticsContent() {
  return (
    <AnalyticsPageLayout
      title="Report Analytics"
      deriveHighlights={deriveReportHighlights}
      generateVolumeSeries={generateReportTimeSeries}
      volumeLabel="Reports"
      volumeTitle="Report Volume"
      volumeDescription="Number of screening reports run"
      ratesTitle="Ready & Match Rates"
      ratesDescription="Percentage trends over time"
      renderRatesChart={(_volumeData, interval, days) => {
        const ratesData = aggregateReportRates(generateReportRateTimeSeries(days), interval);
        return <ReportRatesChart data={ratesData} />;
      }}
    />
  );
}
