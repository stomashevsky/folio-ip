import { DateTime } from "luxon";

export type DateRange = [DateTime, DateTime];
export type DateRangeShortcut = {
  label: string;
  getDateRange: () => DateRange;
};

/** Shortcuts for the dashboard DateRangePicker. */
export const DASHBOARD_DATE_SHORTCUTS: DateRangeShortcut[] = [
  {
    label: "Last 7 days",
    getDateRange: () => {
      const today = DateTime.local().endOf("day");
      return [today.minus({ days: 6 }).startOf("day"), today];
    },
  },
  {
    label: "Last 30 days",
    getDateRange: () => {
      const today = DateTime.local().endOf("day");
      return [today.minus({ days: 29 }).startOf("day"), today];
    },
  },
  {
    label: "Last 3 months",
    getDateRange: () => {
      const today = DateTime.local().endOf("day");
      return [today.minus({ months: 3 }).plus({ days: 1 }).startOf("day"), today];
    },
  },
  {
    label: "All time",
    getDateRange: () => {
      const today = DateTime.local().endOf("day");
      return [DateTime.fromISO("2024-01-01"), today];
    },
  },
];

/** Shortcuts for list-page DateRangePickers (inquiries, etc.). */
export const LIST_PAGE_DATE_SHORTCUTS: DateRangeShortcut[] = [
  {
    label: "Today",
    getDateRange: (): DateRange => {
      const today = DateTime.local();
      return [today.startOf("day"), today.endOf("day")];
    },
  },
  {
    label: "Last 7 days",
    getDateRange: (): DateRange => [
      DateTime.local().minus({ days: 6 }).startOf("day"),
      DateTime.local().endOf("day"),
    ],
  },
  {
    label: "Last 30 days",
    getDateRange: (): DateRange => [
      DateTime.local().minus({ days: 29 }).startOf("day"),
      DateTime.local().endOf("day"),
    ],
  },
  {
    label: "Last 90 days",
    getDateRange: (): DateRange => [
      DateTime.local().minus({ days: 89 }).startOf("day"),
      DateTime.local().endOf("day"),
    ],
  },
];
