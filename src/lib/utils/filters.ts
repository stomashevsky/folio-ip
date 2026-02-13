import type { Inquiry, Verification, Report, Account } from "@/lib/types";
import { DateTime } from "luxon";

export interface InquiryFilterValues {
  statuses: string[];
  templates: string[];
  tags: string[];
  dateFrom: DateTime | null;
  dateTo: DateTime | null;
  completedFrom: DateTime | null;
  completedTo: DateTime | null;
}

export function applyInquiryFilters(
  data: Inquiry[],
  filters: InquiryFilterValues
): Inquiry[] {
  const { statuses, templates, tags, dateFrom, dateTo, completedFrom, completedTo } = filters;

  const hasAny =
    statuses.length > 0 ||
    templates.length > 0 ||
    tags.length > 0 ||
    !!dateFrom ||
    !!completedFrom;

  if (!hasAny) return data;

  return data.filter((item) => {
    if (statuses.length && !statuses.includes(item.status)) return false;
    if (templates.length && !templates.includes(item.templateName)) return false;
    if (tags.length && !tags.some((t) => item.tags.includes(t))) return false;
    if (dateFrom && dateTo) {
      const created = DateTime.fromISO(item.createdAt);
      if (created < dateFrom || created > dateTo) return false;
    }
    if (completedFrom && completedTo) {
      if (!item.completedAt) return false;
      const completed = DateTime.fromISO(item.completedAt);
      if (completed < completedFrom || completed > completedTo) return false;
    }
    return true;
  });
}

// ─── Verification filters ───

export interface VerificationFilterValues {
  statuses: string[];
  types: string[];
  dateFrom: DateTime | null;
  dateTo: DateTime | null;
  completedFrom: DateTime | null;
  completedTo: DateTime | null;
}

export function applyVerificationFilters(
  data: Verification[],
  filters: VerificationFilterValues
): Verification[] {
  const { statuses, types, dateFrom, dateTo, completedFrom, completedTo } = filters;

  const hasAny =
    statuses.length > 0 ||
    types.length > 0 ||
    !!dateFrom ||
    !!completedFrom;

  if (!hasAny) return data;

  return data.filter((item) => {
    if (statuses.length && !statuses.includes(item.status)) return false;
    if (types.length && !types.includes(item.type)) return false;
    if (dateFrom && dateTo) {
      const created = DateTime.fromISO(item.createdAt);
      if (created < dateFrom || created > dateTo) return false;
    }
    if (completedFrom && completedTo) {
      if (!item.completedAt) return false;
      const completed = DateTime.fromISO(item.completedAt);
      if (completed < completedFrom || completed > completedTo) return false;
    }
    return true;
  });
}

// ─── Report filters ───

export interface ReportFilterValues {
  statuses: string[];
  types: string[];
  createdBy: string[];
  dateFrom: DateTime | null;
  dateTo: DateTime | null;
  completedFrom: DateTime | null;
  completedTo: DateTime | null;
}

export function applyReportFilters(
  data: Report[],
  filters: ReportFilterValues
): Report[] {
  const { statuses, types, createdBy, dateFrom, dateTo, completedFrom, completedTo } = filters;

  const hasAny =
    statuses.length > 0 ||
    types.length > 0 ||
    createdBy.length > 0 ||
    !!dateFrom ||
    !!completedFrom;

  if (!hasAny) return data;

  return data.filter((item) => {
    if (statuses.length && !statuses.includes(item.status)) return false;
    if (types.length && !types.includes(item.type)) return false;
    if (createdBy.length && !createdBy.includes(item.createdBy)) return false;
    if (dateFrom && dateTo) {
      const created = DateTime.fromISO(item.createdAt);
      if (created < dateFrom || created > dateTo) return false;
    }
    if (completedFrom && completedTo) {
      if (!item.completedAt) return false;
      const completed = DateTime.fromISO(item.completedAt);
      if (completed < completedFrom || completed > completedTo) return false;
    }
    return true;
  });
}

// ─── Account filters ───

export interface AccountFilterValues {
  statuses: string[];
  dateFrom: DateTime | null;
  dateTo: DateTime | null;
  updatedFrom: DateTime | null;
  updatedTo: DateTime | null;
}

export function applyAccountFilters(
  data: Account[],
  filters: AccountFilterValues
): Account[] {
  const { statuses, dateFrom, dateTo, updatedFrom, updatedTo } = filters;

  const hasAny =
    statuses.length > 0 ||
    !!dateFrom ||
    !!updatedFrom;

  if (!hasAny) return data;

  return data.filter((item) => {
    if (statuses.length && !statuses.includes(item.status)) return false;
    if (dateFrom && dateTo) {
      const created = DateTime.fromISO(item.createdAt);
      if (created < dateFrom || created > dateTo) return false;
    }
    if (updatedFrom && updatedTo) {
      const updated = DateTime.fromISO(item.updatedAt);
      if (updated < updatedFrom || updated > updatedTo) return false;
    }
    return true;
  });
}
