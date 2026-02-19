export type NavItem = {
  title: string;
  href: string;
};

export type NavGroup = {
  label: string;
  items: NavItem[];
};

// ---------------------------------------------------------------------------
// Sidebar items per section
// ---------------------------------------------------------------------------

/** Dashboard sidebar — flat list of entity pages. */
export const dashboardNavItems: NavItem[] = [
  { title: "Overview", href: "/" },
  { title: "Inquiries", href: "/inquiries" },
  { title: "Verifications", href: "/verifications" },
  { title: "Reports", href: "/reports" },
  { title: "Accounts", href: "/accounts" },
];

/** Analytics sidebar — analytics per entity type. */
export const analyticsNavItems: NavItem[] = [
  { title: "Inquiries", href: "/analytics/inquiries" },
  { title: "Verifications", href: "/analytics/verifications" },
  { title: "Reports", href: "/analytics/reports" },
];

/** Templates sidebar — templates per entity type. */
export const templatesNavItems: NavItem[] = [
  { title: "Inquiries", href: "/templates/inquiries" },
  { title: "Verifications", href: "/templates/verifications" },
  { title: "Reports", href: "/templates/reports" },
];

/** Settings sidebar — grouped navigation. */
export const settingsNavGroups: NavGroup[] = [
  {
    label: "",
    items: [{ title: "Your profile", href: "/settings" }],
  },
  {
    label: "Organization",
    items: [
      { title: "General", href: "/settings/organization" },
      { title: "API keys", href: "/settings/api-keys" },
      { title: "Team", href: "/settings/team" },
      { title: "Webhooks", href: "/settings/webhooks" },
    ],
  },
  {
    label: "Project",
    items: [
      { title: "General", href: "/settings/project" },
      { title: "Notifications", href: "/settings/notifications" },
      { title: "Tags", href: "/settings/tags" },
    ],
  },
];

// ---------------------------------------------------------------------------
// Navbar sections
// ---------------------------------------------------------------------------

/** Top-level section tabs shown in navbar and mobile nav. */
export const navSections = [
  { label: "Dashboard", href: "/" },
  { label: "Analytics", href: "/analytics/inquiries" },
  { label: "Templates", href: "/templates/inquiries" },
  { label: "Settings", href: "/settings" },
];

// ---------------------------------------------------------------------------
// Active-state helpers
// ---------------------------------------------------------------------------

/** Paths that belong to the Dashboard section (for navbar active state). */
const dashboardPrefixes = [
  "/inquiries",
  "/verifications",
  "/reports",
  "/accounts",
];

/**
 * Check whether a given pathname matches a navigation href.
 * Exact match for "/" (home), prefix match for everything else.
 */
export function isRouteActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

/**
 * Check whether a navbar section tab is active.
 * Dashboard is active for "/" and all entity pages.
 * Analytics/Templates use their prefix. Settings uses its prefix.
 */
export function isSectionActive(
  pathname: string,
  sectionHref: string,
): boolean {
  // Dashboard: "/" and all entity prefixes
  if (sectionHref === "/") {
    return (
      pathname === "/" ||
      dashboardPrefixes.some((p) => pathname.startsWith(p))
    );
  }
  // Analytics/Templates/Settings: match section prefix
  // Extract the top-level segment, e.g. "/analytics/inquiries" → "/analytics"
  const sectionPrefix = "/" + sectionHref.split("/")[1];
  return pathname.startsWith(sectionPrefix);
}
