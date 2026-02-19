"use client";

import { Suspense } from "react";
import { VerificationRatesChart } from "@/components/charts/VerificationRatesChart";
import { AnalyticsPageLayout } from "@/components/shared/AnalyticsPageLayout";
import {
  deriveVerificationHighlights,
  generateVerificationTimeSeries,
  generateVerificationRateTimeSeries,
} from "@/lib/data";
import { aggregateVerificationRates } from "@/lib/utils/analytics";

export default function VerificationsAnalyticsPage() {
  return (
    <Suspense fallback={null}>
      <VerificationsAnalyticsContent />
    </Suspense>
  );
}

function VerificationsAnalyticsContent() {
  return (
    <AnalyticsPageLayout
      title="Verification Analytics"
      deriveHighlights={deriveVerificationHighlights}
      generateVolumeSeries={generateVerificationTimeSeries}
      volumeLabel="Verifications"
      volumeTitle="Verification Volume"
      volumeDescription="Number of verifications processed"
      ratesTitle="Pass & Processed Rates"
      ratesDescription="Percentage trends over time"
      renderRatesChart={(_volumeData, interval, days) => {
        const ratesData = aggregateVerificationRates(generateVerificationRateTimeSeries(days), interval);
        return <VerificationRatesChart data={ratesData} />;
      }}
    />
  );
}
