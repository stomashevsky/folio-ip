export type NavItem = {
  title: string;
  href: string;
};

export type NavGroup = {
  label: string;
  items: NavItem[];
};

// ---------------------------------------------------------------------------
// Global section IDs
// ---------------------------------------------------------------------------

export type GlobalSectionId =
  | "identity"
  | "platform"
  | "settings";

export type GlobalSection = {
  id: GlobalSectionId;
  label: string;
  /** Default href when clicking the section tab. */
  href: string;
  /** Sidebar groups shown when this section is active. */
  sidebarGroups: NavGroup[];
  /** Route prefixes that belong to this section (for active-state detection). */
  prefixes: string[];
};

// ---------------------------------------------------------------------------
// Identity section
// Home, Inquiries, Verifications, Reports, Accounts, Transactions
// ---------------------------------------------------------------------------

const identitySidebarGroups: NavGroup[] = [
  {
    label: "Dashboard",
    items: [
      { title: "Overview", href: "/" },
      { title: "Inquiries", href: "/inquiries" },
      { title: "Verifications", href: "/verifications" },
      { title: "Reports", href: "/reports" },
      { title: "Accounts", href: "/accounts" },
      { title: "Transactions", href: "/transactions" },
    ],
  },
  {
    label: "Analytics",
    items: [
      { title: "Inquiries", href: "/inquiries/analytics" },
      { title: "Verifications", href: "/verifications/analytics" },
      { title: "Reports", href: "/reports/analytics" },
      { title: "Transactions", href: "/transactions/analytics" },
    ],
  },
  {
    label: "Templates",
    items: [
      { title: "Inquiries", href: "/inquiries/templates" },
      { title: "Verifications", href: "/verifications/templates" },
      { title: "Reports", href: "/reports/templates" },
    ],
  },
  {
    label: "Configuration",
    items: [
      { title: "Signals", href: "/inquiries/signals" },
      { title: "Themes", href: "/inquiries/themes" },
      { title: "Account Types", href: "/accounts/types" },
      { title: "Transaction Types", href: "/transactions/types" },
    ],
  },
];

// ---------------------------------------------------------------------------
// Platform section
// Cases, Workflows, Graph, Data, Utilities, Integrations
// ---------------------------------------------------------------------------

const platformSidebarGroups: NavGroup[] = [
  {
    label: "Cases",
    items: [
      { title: "All Cases", href: "/platform/cases" },
      { title: "Queues", href: "/platform/cases/queues" },
      { title: "Analytics", href: "/platform/cases/analytics" },
      { title: "Templates", href: "/platform/cases/templates" },
      { title: "Assignment Policies", href: "/platform/cases/assignment-policies" },
      { title: "Actions", href: "/platform/cases/actions" },
    ],
  },
  {
    label: "Workflows",
    items: [
      { title: "All Workflows", href: "/platform/workflows" },
      { title: "Workflow Runs", href: "/platform/workflows/runs" },
    ],
  },
  {
    label: "Graph",
    items: [
      { title: "Explorer", href: "/platform/graph" },
      { title: "Templates", href: "/platform/graph/templates" },
      { title: "Configuration", href: "/platform/graph/configuration" },
    ],
  },
  {
    label: "Data",
    items: [
      { title: "Exports", href: "/platform/data/exports" },
      { title: "Imports", href: "/platform/data/imports" },
    ],
  },
  {
    label: "Utilities",
    items: [
      { title: "Tags", href: "/platform/utilities/tags" },
      { title: "Lists", href: "/platform/utilities/lists" },
    ],
  },
  {
    label: "Integrations",
    items: [{ title: "Marketplace", href: "/platform/integrations" }],
  },
];

// ---------------------------------------------------------------------------
// Settings section (merged with Developers)
// ---------------------------------------------------------------------------

const settingsSidebarGroups: NavGroup[] = [
  {
    label: "Team",
    items: [
      { title: "Users", href: "/settings/team" },
      { title: "Roles", href: "/settings/team/roles" },
      { title: "Teams", href: "/settings/team/teams" },
      { title: "Sessions", href: "/settings/team/sessions" },
      { title: "Audit Logs", href: "/settings/team/audit-logs" },
    ],
  },
  {
    label: "Organization",
    items: [
      { title: "Information", href: "/settings/organization" },
      { title: "Security", href: "/settings/security" },
      { title: "Billing", href: "/settings/billing" },
      { title: "Domain Manager", href: "/settings/domain-manager" },
      { title: "SMTP Test", href: "/settings/smtp-test" },
    ],
  },
  {
    label: "API",
    items: [
      { title: "API Keys", href: "/settings/api-keys" },
      { title: "API Logs", href: "/settings/api-logs" },
      { title: "Analytics", href: "/settings/api-analytics" },
      { title: "Rate Limits", href: "/settings/api-rate-limits" },
    ],
  },
  {
    label: "Webhooks & Events",
    items: [
      { title: "Webhooks", href: "/settings/webhooks" },
      { title: "Webhook Events", href: "/settings/webhook-events" },
      { title: "Events", href: "/settings/events" },
    ],
  },
  {
    label: "Profile & Project",
    items: [
      { title: "Your Profile", href: "/settings" },
      { title: "Notifications", href: "/settings/notifications" },
      { title: "Project Settings", href: "/settings/project" },
    ],
  },
  {
    label: "Documentation",
    items: [{ title: "Getting Started", href: "/settings/getting-started" }],
  },
];

// ---------------------------------------------------------------------------
// All global sections
// ---------------------------------------------------------------------------

export const globalSections: GlobalSection[] = [
  {
    id: "identity",
    label: "Identity",
    href: "/",
    sidebarGroups: identitySidebarGroups,
    prefixes: [
      "/inquiries",
      "/verifications",
      "/reports",
      "/accounts",
      "/transactions",
    ],
  },
  {
    id: "platform",
    label: "Platform",
    href: "/platform/cases",
    sidebarGroups: platformSidebarGroups,
    prefixes: ["/platform"],
  },
  {
    id: "settings",
    label: "Settings",
    href: "/settings/team",
    sidebarGroups: settingsSidebarGroups,
    prefixes: ["/settings"],
  },
];

// ---------------------------------------------------------------------------
// Backward-compatible exports (used by existing components during migration)
// ---------------------------------------------------------------------------

/** @deprecated Use `globalSections` and `getActiveGlobalSection()` instead. */
export const dashboardNavItems: NavItem[] =
  identitySidebarGroups[0].items;

/** @deprecated Use `globalSections` and `getActiveGlobalSection()` instead. */
export const settingsNavGroups: NavGroup[] = settingsSidebarGroups;

/** @deprecated Use `globalSections` instead. */
export const navSections = globalSections.map((s) => ({
  label: s.label,
  href: s.href,
}));

// ---------------------------------------------------------------------------
// Active-state helpers
// ---------------------------------------------------------------------------

/**
 * Check whether a given pathname matches a navigation href.
 * Exact match for "/" (home), prefix match for everything else.
 */
export function isRouteActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

/**
 * Determine which global section is active for a given pathname.
 * Identity is the fallback (default) section.
 */
export function getActiveGlobalSection(pathname: string): GlobalSection {
  // Check non-identity sections first (they have unique prefixes)
  for (const section of globalSections) {
    if (section.id === "identity") continue;
    if (section.prefixes.some((p) => pathname.startsWith(p))) {
      return section;
    }
  }
  // Fallback to Identity
  return globalSections[0];
}

/**
 * Check whether a navbar section tab is active.
 */
export function isSectionActive(
  pathname: string,
  sectionHref: string,
): boolean {
  const section = globalSections.find((s) => s.href === sectionHref);
  if (!section) return false;
  const active = getActiveGlobalSection(pathname);
  return active.id === section.id;
}
