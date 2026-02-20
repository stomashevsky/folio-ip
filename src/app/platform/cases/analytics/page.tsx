"use client";

import { Suspense } from "react";
import { CaseRatesChart } from "@/components/charts/CaseRatesChart";
import { AnalyticsPageLayout } from "@/components/shared/AnalyticsPageLayout";
import {
  deriveCaseHighlights,
  generateCaseTimeSeries,
  generateCaseRateTimeSeries,
} from "@/lib/data";
import { aggregateCaseRates } from "@/lib/utils/analytics";

export default function CaseAnalyticsPage() {
  return (
    <Suspense fallback={null}>
      <CaseAnalyticsContent />
    </Suspense>
  );
}

function CaseAnalyticsContent() {
  return (
    <AnalyticsPageLayout
      title="Case Analytics"
      deriveHighlights={deriveCaseHighlights}
      generateVolumeSeries={generateCaseTimeSeries}
      volumeLabel="Cases"
      volumeTitle="Case Volume"
      volumeDescription="Number of cases created"
      ratesTitle="Resolution & SLA Rates"
      ratesDescription="Percentage trends over time"
      renderRatesChart={(_volumeData, interval, days) => {
        const ratesData = aggregateCaseRates(generateCaseRateTimeSeries(days), interval);
        return <CaseRatesChart data={ratesData} />;
      }}
    />
  );
}
