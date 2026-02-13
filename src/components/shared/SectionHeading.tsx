import { Badge } from "@plexui/ui/components/Badge";

interface SectionHeadingProps {
  children: React.ReactNode;
  badge?: number;
  action?: React.ReactNode;
  /** "sm" = heading-sm (18px, default), "xs" = heading-xs (16px, settings pages) */
  size?: "sm" | "xs";
}

const sizeConfig = {
  sm: { heading: "heading-sm", margin: "mb-3" },
  xs: { heading: "heading-xs", margin: "mb-4" },
} as const;

export function SectionHeading({ children, badge, action, size = "sm" }: SectionHeadingProps) {
  const { heading: headingClass, margin } = sizeConfig[size];

  const heading = (
    <h2 className={`${headingClass} flex items-center gap-2 text-[var(--color-text)]`}>
      {children}
      {badge != null && badge > 0 && (
        <Badge color="secondary" size="sm">
          {badge}
        </Badge>
      )}
    </h2>
  );

  if (action) {
    return (
      <div className={`${margin} flex items-center justify-between`}>
        {heading}
        {action}
      </div>
    );
  }

  return <div className={margin}>{heading}</div>;
}
