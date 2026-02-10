# Implementation Plan — Folio Dashboard

## Phase 0: Project Setup (Day 1) ✅
- [x] Create reference documentation structure
- [x] Document Persona data model
- [x] Document UI patterns
- [x] Document technical architecture
- [x] Create CLAUDE.md and AGENTS.md
- [x] Initialize Next.js project with TypeScript
- [x] Configure Tailwind CSS 4
- [x] Add @plexui/ui as dependency (workspace link)
- [x] Configure PlexUI Provider and design tokens
- [x] Setup ESLint
- [x] Create base layout with Sidebar shell

## Phase 1: Core Layout & Navigation (Day 2) ✅
- [x] Sidebar navigation component (using PlexUI Sidebar)
  - Sections: Overview, Inquiries, Verifications, Reports, Accounts, Analytics, Settings
  - Active state, icons, collapsible
- [x] Top header bar (page title + actions + theme toggle)
- [ ] Page layout wrapper (sidebar + content area)
- [ ] Dark mode toggle
- [ ] Responsive mobile layout

## Phase 2: Shared Components (Day 3)
- [ ] MetricCard — label, value, trend, optional sparkline
- [ ] StatusBadge — semantic status colors mapped to entity statuses
- [ ] DataTable — wrapper around TanStack Table with PlexUI styling
  - Search, sort, filter, pagination
  - Column definitions
  - Row click → navigate to detail
- [ ] ChartCard — wrapper for Recharts with consistent styling
- [ ] PageHeader — title, description, action buttons
- [ ] EmptyState — for empty data views
- [ ] InfoSidebar — right panel for detail pages
- [ ] EntityLink — clickable IDs that navigate to entity detail

## Phase 3: Mock Data & Types (Day 4)
- [ ] TypeScript interfaces for all entities:
  - Inquiry, Verification, Report, Account, Transaction
  - Check, Signal, Session
  - Analytics aggregates
- [ ] JSON fixture files:
  - inquiries.json (50+ records)
  - verifications.json
  - reports.json
  - accounts.json
  - analytics-overview.json
  - analytics-timeseries.json
  - analytics-funnel.json
- [ ] API utility functions (fetch from fixtures)
- [ ] Custom hooks: useInquiries, useInquiry, useVerifications, etc.

## Phase 4: Dashboard Home (Day 5)
- [ ] Overview page (`/`)
  - 4 MetricCards: Total Inquiries, Approval Rate, Avg Time, Pending Review
  - Line chart: Inquiries trend (last 30 days)
  - Donut chart: Status distribution
  - Recent inquiries table (last 10)
  - Quick action buttons

## Phase 5: Inquiries (Day 6-7)
- [ ] Inquiries list (`/inquiries`)
  - DataTable with search, date filter, status filter
  - Columns: Name, ID, Status, Template, Created, Time to Finish
  - Status badges
  - Row click → detail page
- [ ] Inquiry detail (`/inquiries/[id]`)
  - Tabs: Overview, Verifications, Reports, Timeline
  - Overview: summary cards, collected photos, attributes table, signals
  - Verifications tab: list of checks with pass/fail
  - Reports tab: linked AML reports
  - Timeline tab: event chronology
  - Info sidebar: ID, status, dates, template, tags

## Phase 6: Verifications & Reports (Day 8)
- [ ] Verifications list (`/verifications`)
- [ ] Verification detail (`/verifications/[id]`)
  - Document/Selfie photos
  - Extracted data fields
  - Checks table with status badges
- [ ] Reports list (`/reports`)
- [ ] Report detail (`/reports/[id]`)
  - Input fields, match results, continuous monitoring status

## Phase 7: Accounts (Day 9)
- [ ] Accounts list (`/accounts`)
- [ ] Account detail (`/accounts/[id]`)
  - Profile card (photo, name, address, age)
  - Linked inquiries, verifications, reports
  - Status management

## Phase 8: Analytics (Day 10)
- [ ] Analytics overview (`/analytics`)
  - Funnel: Created → Started → Completed → Approved
  - Time series: daily volume with breakdown
  - Success/failure rate trend
  - Avg completion time trend
  - Geographic distribution (if map implemented)
  - Device/platform breakdown
  - Top failure reasons

## Phase 9: Polish & Settings (Day 11)
- [ ] Settings page (`/settings`)
  - Theme (light/dark/system)
  - Data refresh interval
  - Notification preferences (placeholder)
- [ ] Loading states with PlexUI Skeleton
- [ ] Error boundaries and error states
- [ ] Responsive testing (mobile, tablet, desktop)
- [ ] Accessibility audit
- [ ] Performance optimization (memoization, virtualization)

## Phase 10: API Integration (When server ready)
- [ ] Replace mock data with real API calls
- [ ] Configure TanStack Query for real endpoints
- [ ] Error handling for API failures
- [ ] Loading/stale data indicators
- [ ] Real-time updates (if websocket available)

---

## Dependencies to Install

```json
{
  "dependencies": {
    "@plexui/ui": "file:../plexui-docs/packages/ui",
    "@tanstack/react-query": "^5",
    "@tanstack/react-table": "^8",
    "luxon": "^3",
    "next": "^15",
    "react": "^19",
    "react-dom": "^19",
    "recharts": "^2",
    "zustand": "^5",
    "lucide-react": "^0.400"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "@types/node": "^22",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "tailwindcss": "^4",
    "typescript": "^5",
    "eslint": "^9",
    "eslint-config-next": "^15"
  }
}
```

---

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| PlexUI version compatibility | High | Link workspace, test early |
| Recharts SSR issues | Medium | Use "use client" wrapper |
| TanStack Table complexity | Medium | Start with simple config |
| Mock data ≠ real API shape | Medium | Define types first, adapt later |
| Dark mode inconsistency | Low | Use PlexUI tokens exclusively |
