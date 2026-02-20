import { ChevronRightLg, ChevronRightSm } from "@plexui/ui/components/Icon";
import Link from "next/link";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface TopBarProps {
  title: React.ReactNode;
  description?: string;
  actions?: React.ReactNode;
  toolbar?: React.ReactNode;
  tabs?: React.ReactNode;
  breadcrumb?: BreadcrumbItem[];
  backHref?: string;
  backLabel?: string;
  onBackClick?: () => void;
  noBorder?: boolean;
}

function deriveLabel(href: string): string {
  const last = href.split("/").filter(Boolean).pop() ?? "";
  return last.charAt(0).toUpperCase() + last.slice(1);
}

export function TopBar({ title, description, actions, toolbar, tabs, breadcrumb, backHref, backLabel, onBackClick, noBorder }: TopBarProps) {
  const hasToolbar = !!toolbar;
  const hasTabs = !!tabs;
  const hasBreadcrumb = !!breadcrumb && breadcrumb.length > 0;
  const hasBack = !!backHref && !hasBreadcrumb;

  return (
    <div
      className={`sticky top-0 z-10 shrink-0 bg-[var(--color-surface)] px-4 md:px-6 ${
        noBorder ? "" : "border-b border-[var(--color-border)]"
      } ${
        hasTabs && !hasToolbar ? "pb-0 pt-3" : noBorder ? "pb-0 pt-3" : "py-3"
      }`}
    >
      {/* Breadcrumb row */}
      {hasBreadcrumb && (
        <div className="flex items-center gap-1 pb-1 pt-0.5">
          {breadcrumb.map((item, i) => (
            <span key={i} className="flex items-center gap-1">
              {i > 0 && (
                <ChevronRightSm className="h-3 w-3 text-[var(--color-text-tertiary)]" />
              )}
              {item.href ? (
                <Link href={item.href} className="text-xs text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)]">
                  {item.label}
                </Link>
              ) : (
                <span className="text-xs text-[var(--color-text-tertiary)]">{item.label}</span>
              )}
            </span>
          ))}
        </div>
      )}

      {/* Row 1: title + actions — min-h-9 keeps height stable with or without action buttons */}
      <div className="flex min-h-9 items-center justify-between">
        <div>
          {hasBack ? (
            <h1 className="m-0">
              <div className="heading-md flex flex-wrap items-center gap-x-2 gap-y-1 text-[var(--color-text)]">
                <span className="flex shrink-0 items-center gap-2">
                  {onBackClick ? (
                    <button type="button" onClick={onBackClick} className="cursor-pointer text-[var(--color-text-secondary)] hover:text-[var(--color-text)]">
                      {backLabel || deriveLabel(backHref)}
                    </button>
                  ) : (
                    <Link href={backHref} className="text-[var(--color-text-secondary)] hover:text-[var(--color-text)]">
                      {backLabel || deriveLabel(backHref)}
                    </Link>
                  )}
                  <ChevronRightLg className="shrink-0 text-[var(--color-text-tertiary)]" />
                </span>
                <span>{title}</span>
              </div>
            </h1>
          ) : (
            <h1 className="heading-md text-[var(--color-text)]">
              {title}
            </h1>
          )}
          {description && (
            <p className="mt-0.5 text-xs text-[var(--color-text-tertiary)]">
              {description}
            </p>
          )}
        </div>
        {actions && (
          <div className="flex shrink-0 items-center gap-2">{actions}</div>
        )}
      </div>

      {/* Row 2: tabs — tight spacing, tab underline replaces header border */}
      {hasTabs && <div className="mt-1 translate-y-px">{tabs}</div>}

      {/* Row 2: toolbar (filters / segmented controls) */}
      {hasToolbar && (
        <div className="mt-2 flex min-w-0 flex-wrap items-center gap-2">
          {toolbar}
        </div>
      )}
    </div>
  );
}
