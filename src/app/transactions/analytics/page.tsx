"use client";

import { Suspense } from "react";
import { TransactionRatesChart } from "@/components/charts/TransactionRatesChart";
import { AnalyticsPageLayout } from "@/components/shared/AnalyticsPageLayout";
import {
  deriveTransactionHighlights,
  generateTransactionTimeSeries,
  generateTransactionRateTimeSeries,
} from "@/lib/data";
import { aggregateTransactionRates } from "@/lib/utils/analytics";

export default function TransactionAnalyticsPage() {
  return (
    <Suspense fallback={null}>
      <TransactionAnalyticsContent />
    </Suspense>
  );
}

function TransactionAnalyticsContent() {
  return (
    <AnalyticsPageLayout
      title="Transaction Analytics"
      deriveHighlights={deriveTransactionHighlights}
      generateVolumeSeries={generateTransactionTimeSeries}
      volumeLabel="Transactions"
      volumeTitle="Transaction Volume"
      volumeDescription="Number of transactions monitored"
      ratesTitle="Approval & Flagged Rates"
      ratesDescription="Percentage trends over time"
      renderRatesChart={(_volumeData, interval, days) => {
        const ratesData = aggregateTransactionRates(generateTransactionRateTimeSeries(days), interval);
        return <TransactionRatesChart data={ratesData} />;
      }}
    />
  );
}
