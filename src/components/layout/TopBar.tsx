import { Button, ButtonLink } from "@plexui/ui/components/Button";
import { ChevronLeftLg, ChevronRightSm } from "@plexui/ui/components/Icon";
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
  onBackClick?: () => void;
  noBorder?: boolean;
}

export function TopBar({ title, description, actions, toolbar, tabs, breadcrumb, backHref, onBackClick, noBorder }: TopBarProps) {
  const hasToolbar = !!toolbar;
  const hasTabs = !!tabs;
  const hasBreadcrumb = !!breadcrumb && breadcrumb.length > 0;

  return (
    <div
      className={`sticky top-0 z-10 shrink-0 bg-[var(--color-surface)] px-4 md:px-6 ${
        noBorder ? "" : "border-b border-[var(--color-border)]"
      } ${
        hasTabs ? "pb-0 pt-3" : noBorder ? "pb-0 pt-3" : "py-3"
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
        <div className="flex items-center gap-1">
          {backHref && !hasBreadcrumb && (
            onBackClick ? (
              <Button
                color="secondary"
                variant="ghost"
                size="md"
                pill={false}
                data-uniform=""
                className="-ml-1.5"
                onClick={onBackClick}
              >
                <ChevronLeftLg />
              </Button>
            ) : (
              <ButtonLink
                href={backHref}
                color="secondary"
                variant="ghost"
                size="md"
                pill={false}
                data-uniform=""
                className="-ml-1.5"
              >
                <ChevronLeftLg />
              </ButtonLink>
            )
          )}
          <div>
            <h1 className="heading-md text-[var(--color-text)]">
              {title}
            </h1>
            {description && (
              <p className="mt-0.5 text-xs text-[var(--color-text-tertiary)]">
                {description}
              </p>
            )}
          </div>
        </div>
        {actions && (
          <div className="flex shrink-0 items-center gap-2">{actions}</div>
        )}
      </div>

      {/* Row 2: tabs — tight spacing, tab underline replaces header border */}
      {hasTabs && <div className="mt-1 translate-y-px">{tabs}</div>}

      {/* Row 2: toolbar (filters / segmented controls) */}
      {hasToolbar && (
        <div className="mt-3 flex min-w-0 flex-wrap items-center gap-2">
          {toolbar}
        </div>
      )}
    </div>
  );
}
