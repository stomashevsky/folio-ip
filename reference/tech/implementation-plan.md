# Implementation Plan — Folio Dashboard (Persona Feature Parity)

> **Goal**: Fully replicate Persona dashboard functionality at https://app.withpersona.com/dashboard
> **Approach**: Follow existing Folio patterns. Improve where possible (AI assistant + Code editor instead of manual flow builder, better nav organization, etc.)
> **Reference**: `reference/persona/` — full Persona docs, data model, help articles, API reference
> **Method**: Use Dev Browser extension to study live Persona dashboard when implementing each phase

---

## Current State Summary

**Done (✅):**
- Project setup (Next.js 16, PlexUI, Tailwind 4, TanStack Table, Recharts)
- Navigation structure — 4 global sections (Identity, Platform, Developers, Settings) with full sidebar
- 70+ pages created with consistent patterns
- Shared components: DataTable, MetricCard, ChartCard, StatusBadge, Modal, etc.
- TopBar standardization: TOPBAR_CONTROL_SIZE, TOPBAR_TOOLBAR_PILL, TOPBAR_ACTION_PILL
- Page layout standardization: TABLE_PAGE_WRAPPER, TABLE_PAGE_CONTENT
- All list pages: search, multi-select filters, DateRangePicker, ColumnSettings, pagination
- Analytics pages: 4 sections (Inquiries, Verifications, Reports, Transactions) with charts
- Template editors: AI assistant + Code editor (Inquiry Templates, Workflows)
- Graph Explorer page
- Settings pages: 17 pages (profile, team, org, security, billing, etc.)
- Developer pages: API keys, webhooks, events, logs, analytics, rate limits

**⚠️ Many pages are stubs or thin implementations from the first session. See audit below.**

---

## Page Quality Audit (68 pages total)

### 🔴 REDIRECT / STUB (need real implementation)

| Route | Lines | Issue |
|-------|-------|-------|
| `/developers/api-keys` | 1 | Redirect to `/settings/api-keys` — needs its own developer-focused page |
| `/developers/webhooks` | 1 | Redirect to `/settings/webhooks` — needs its own developer-focused page |
| `/verifications/analytics` | 38 | Generic AnalyticsPageLayout wrapper — no custom verification-specific charts |
| `/reports/analytics` | 38 | Generic AnalyticsPageLayout wrapper — no custom report-specific charts |
| `/transactions/analytics` | 38 | Generic AnalyticsPageLayout wrapper — no custom transaction-specific charts |
| `/platform/cases/analytics` | 38 | Generic AnalyticsPageLayout wrapper — no custom case-specific charts |

### 🟡 BASIC (works but thin — need significant enrichment)

| Route | Lines | Issue |
|-------|-------|-------|
| `/inquiries/themes` | 252 | Mock card grid, no edit/create/preview functionality |
| `/accounts/types` | 246 | Mock card grid, no CRUD — need type editor with field configuration |
| `/transactions/types` | 269 | Mock card grid, no CRUD — need type editor with field configuration |
| `/platform/utilities` | 245 | Card grid with no-op "Launch" buttons — needs real tool execution |
| `/platform/graph` | 170 | ReactFlow visualization works but: no query interface, no drill-down, no filtering, no export |
| `/platform/graph/configuration` | 264 | Mock settings, not functional |
| `/platform/graph/templates` | 230 | Mock template list, no editor |
| `/platform/data` | 237 | Activity log only — no actual data management hub |
| `/platform/data/exports` | 353 | Table of mock exports — no export creation wizard |
| `/platform/data/imports` | 356 | Table of mock imports — no import upload flow |
| `/platform/cases` | 262 | List page OK but: no detail page at all, no bulk actions, no saved views |
| `/platform/cases/queues` | 252 | Mock list — no queue detail, no assignment rules |
| `/platform/cases/assignment-policies` | 258 | Mock list — no policy editor |
| `/platform/cases/actions` | 265 | Mock list — no action configuration |
| `/platform/cases/templates` | 264 | Mock list — no template editor |
| `/platform/integrations` | 261 | Card grid with mock data — no detail page, no OAuth flow, no logs |
| `/platform/workflows/runs` | 177 | Mock list — no run detail page, no execution trace |
| `/transactions/[id]` | 162 | Only 2 tabs (Overview, Activity) — thin compared to other detail pages |
| `/settings/getting-started` | 110 | Basic checklist — needs progress tracking, more steps, Persona-like onboarding guide |
| `/settings/security` | 126 | Forms present but no Save button, no real IP allowlist editor |

### ✅ RICH (fully functional — may still need Persona-specific enrichment)

| Route | Lines | Status |
|-------|-------|--------|
| `/` (Dashboard) | 238 | ✅ Metrics, charts, date picker, recent inquiries |
| `/inquiries` | 311 | ✅ DataTable, 5 filters, column visibility, search, export |
| `/inquiries/[id]` | 219 | ✅ 6 tabs, sidebar, tags, events, actions — needs List Matches depth |
| `/inquiries/analytics` | 260 | ✅ 2 tabs, 6 chart types, funnel Sankey |
| `/inquiries/signals` | 342 | ✅ DataTable, category/severity filters |
| `/inquiries/templates` | 189 | ✅ List with status filter, template picker |
| `/inquiries/templates/[id]` | 283 | ✅ FlowEditor, settings, publish/unpublish, save state |
| `/verifications` | 250 | ✅ DataTable, status/type filters, date ranges |
| `/verifications/[id]` | 374 | ✅ Photos, extracted data, checks table, sidebar |
| `/verifications/templates` | 212 | ✅ List with filters, template picker |
| `/verifications/templates/[id]` | 369 | ✅ Template editor, checks, country selector |
| `/reports` | 331 | ✅ DataTable, 4 filters, date ranges, export |
| `/reports/[id]` | 206 | ✅ 3 tabs, matches, monitoring, sidebar |
| `/reports/templates` | 207 | ✅ List with filters, template picker |
| `/reports/templates/[id]` | 296 | ✅ Template editor, screening sources, settings |
| `/accounts` | 270 | ✅ DataTable, filters, date ranges, export |
| `/accounts/[id]` | 227 | ✅ 5 tabs, sidebar, tags, events |
| `/transactions` | 302 | ✅ DataTable, 3 filters, column visibility |
| `/platform/workflows` | 276 | ✅ 2 tabs, DataTable, filters, template picker |
| `/platform/workflows/[id]` | 332 | ✅ FlowEditor, trigger config, publish, simulate |
| `/platform/utilities/tags` | 259 | ✅ Tag CRUD with rename/delete/create modals |
| `/platform/utilities/lists` | 249 | ✅ List management with filters |
| `/developers/api-analytics` | 239 | ✅ Metrics, charts, endpoint/status tables |
| `/developers/api-logs` | 389 | ✅ DataTable, method/status filters, column visibility |
| `/developers/api-rate-limits` | 273 | ✅ DataTable, search, usage percentages |
| `/developers/events` | 350 | ✅ DataTable, resource/actor filters |
| `/developers/webhook-events` | 396 | ✅ DataTable, status/event filters, delivery tracking |
| `/settings` (Profile) | 231 | ✅ Full form, notifications, security, danger zone |
| `/settings/api-keys` | 347 | ✅ CRUD, create modal, localStorage persistence |
| `/settings/webhooks` | 389 | ✅ CRUD, event checkboxes, status toggle |
| `/settings/organization` | 189 | ✅ Real form, plan/usage display, branding |
| `/settings/project` | 174 | ✅ Automation toggles, allowed origins, webhook config |
| `/settings/billing` | 185 | ✅ Usage display, payment method, billing history |
| `/settings/domain-manager` | 145 | ✅ Domain table, add domain, DNS config |
| `/settings/smtp-test` | 189 | ✅ Config form, test email, results table |
| `/settings/notifications` | 176 | ✅ Toggle groups, save state, change detection |
| `/settings/team` | 406 | ✅ Member list, invite modal, role assignment |
| `/settings/team/roles` | 257 | ✅ Role list with filters |
| `/settings/team/teams` | 212 | ✅ Teams with ColumnSettings |
| `/settings/team/sessions` | 316 | ✅ Session list, revoke actions |
| `/settings/team/audit-logs` | 398 | ✅ DataTable, date/action/actor filters |
| `/settings/tags` | 368 | ✅ Tag CRUD with modals |

**Remaining work is organized into phases below.**

---

## Phase 1: Detail Page Enrichment 🔴 HIGH PRIORITY

Detail pages are the core of the product — where reviewers spend most of their time. Currently they exist but need enrichment to match Persona's depth.

### 1.1 Inquiry Detail (`/inquiries/[id]`)

**Current state**: 5 tabs (Overview, Verifications, Sessions, Signals, Reports) + sidebar with InfoRows + tags + events

**Missing / needs improvement:**
- [ ] **List Matches tab** — show sanction/watchlist matches from linked reports. Table with: match name, list name, match status, score, actions (dismiss/confirm)
- [ ] **Overview > Summary section** — add "List Matches" count card alongside existing Time to Finish and Verification Attempts
- [ ] **Overview > Collected Photos** — ensure Gov ID (front+back) and Selfie photos are shown with DocumentViewer lightbox, zoom, rotate
- [ ] **Overview > Attributes table** — full extracted data: Name, Birthdate, ID number, Address, Country, Issue/Expiry dates. Use KeyValueTable
- [ ] **Overview > Location** — map placeholder + coordinates display (IP geolocation, declared address, delta)
- [ ] **Overview > Behavioral Risk** — risk signal cards with threat levels (Low/Medium/High badges)
- [ ] **Sessions tab** — enrich with: browser/OS, IP address, geolocation, device fingerprint, network threat level, proxy detection
- [ ] **Signals tab** — categorize into: Featured, Network, Behavioral, Device. Show signal name + value + risk level
- [ ] **Reports tab** — show linked reports with status, type, match count. Click → report detail
- [ ] **Sidebar** — ensure: Inquiry ID (copyable), Reference ID, Account ID (clickable link), Created At, Template (link), Status badge, Tags (editable), Cases (links), Notes
- [ ] **Actions** — Approve, Decline, Mark as Needs Review, Archive, Delete. Currently in menu — verify all work
- [ ] **Review button** — prominent CTA in TopBar for quick approve/decline flow

### 1.2 Verification Detail (`/verifications/[id]`)

**Current state**: Photos with lightbox, extracted data table, checks table with search + filters, sidebar with IDs/links/timestamps

**Missing / needs improvement:**
- [ ] **Checks table enrichment** — show check name, status (passed/failed), requirement (required/not required), reason on failure. 35+ Gov ID checks, 12+ Selfie checks per data-model.md
- [ ] **Photos section** — front + back of document, selfie. Ensure DocumentViewer with zoom/rotate works
- [ ] **Extracted Data** — full OCR data: first name, last name, DOB, document number, address, expiry, issue date, issuing country, MRZ data
- [ ] **Comparison view** — side-by-side: extracted vs declared attributes (if available)
- [ ] **Sidebar** — Verification ID, Type badge, Status badge, Inquiry ID (link), Account ID (link), Created At, Duration, Template (link)

### 1.3 Report Detail (`/reports/[id]`)

**Current state**: Basic detail page exists

**Missing / needs improvement:**
- [ ] **Match results section** — list of matches found: name, DOB, lists matched, match score, entity type (PEP/Sanction/etc.)
- [ ] **Match detail expandable** — click match → show full entity info, source list, match attributes
- [ ] **Match actions** — dismiss match (with reason), confirm match
- [ ] **Screening summary** — input fields used for search, report type, date run
- [ ] **Continuous monitoring badge** — show if monitoring is active/paused
- [ ] **Sidebar** — Report ID, Type badge, Status badge, Created by (Workflow/Manual), Inquiry ID, Account ID, Template, Created At
- [ ] **Actions** — Re-run report, Pause/Resume monitoring

### 1.4 Account Detail (`/accounts/[id]`)

**Current state**: Basic detail page with tabs exists

**Missing / needs improvement:**
- [ ] **Profile card** — photo (from selfie), full name, address, birthdate, age. Prominent header section
- [ ] **Linked Inquiries tab** — table of all inquiries for this account with status, template, date
- [ ] **Linked Verifications tab** — table of all verifications with type, status, date
- [ ] **Linked Reports tab** — table of reports with type, status, match count
- [ ] **Documents tab** — collected documents (ID photos, selfies) with lightbox
- [ ] **List Matches tab** — aggregated matches across all reports
- [ ] **Activity/Events tab** — chronological activity timeline
- [ ] **Sidebar** — Account ID, Reference ID, Status, Type, Created At, Last Updated, Tags
- [ ] **Actions** — Update status, Archive, Merge accounts

### 1.5 Transaction Detail (`/transactions/[id]`)

**Current state**: Basic detail page exists

**Missing / needs improvement:**
- [ ] **Transaction summary** — type, status, amount (if applicable), custom fields per transaction type
- [ ] **Linked Account** — account card with link
- [ ] **Review section** — approve/decline with notes
- [ ] **Labels/tags** — transaction categorization
- [ ] **Sidebar** — Transaction ID, Type, Status, Account ID, Created At, Reviewed At
- [ ] **Actions** — Approve, Decline, Redact

### 1.6 Case Detail (NEW — `/platform/cases/[id]`)

**Current state**: No detail page exists — only list page

**Needs full implementation:**
- [ ] **Module-based layout** — Cases in Persona have configurable modules. Implement the most common:
  - Info module (case summary, status, assignee, queue, SLA)
  - Comments module (threaded comments with mentions, preset comments)
  - Inquiry module (linked inquiry with summary)
  - Verification module (linked verifications)
  - Report module (linked reports, list matches)
  - Data Display module (custom fields)
  - Event Timeline module
  - Attachments module (file upload placeholder)
  - Tags module
  - Account module
  - Related Cases module
  - Location module (map placeholder)
  - Device module
- [ ] **Sidebar** — Case ID, Status, Priority, Assignee, Queue, SLA deadline, Created At, Template
- [ ] **Actions** — Resolve, Escalate, Reassign, Change status, Add comment
- [ ] **Assignment** — assign to user or queue

---

## Phase 2: Cases System Enrichment 🔴 HIGH PRIORITY

Cases are the operational hub — where review teams work. Currently all case sub-pages are thin mock lists.

### 2.1 Case Detail (NEW — `/platform/cases/[id]`) ⭐ MOST IMPORTANT
See Phase 1.6 above for full module spec.

### 2.2 Case List Enrichment (`/platform/cases` — currently 262 lines, BASIC)
- [ ] **Saved views** — "Select a view" dropdown + "Save view" button (Persona has this)
- [ ] **Bulk actions** — checkbox column + "Set Status (N)" / "Assign (N)" buttons in TopBar
- [ ] **Additional columns** — Queue, Account Name, Account Reference ID, Assignee, Tags (match Persona's columns)

### 2.3 Case Templates (`/platform/cases/templates` — currently 264 lines, BASIC mock list)
- [ ] **Rebuild from mock list to real template manager**
- [ ] **Template detail/editor page** (`/platform/cases/templates/[id]`) — configure modules, order, settings
- [ ] Use AI assistant + Code pattern (like Inquiry Templates) for template editing

### 2.4 Case Queues (`/platform/cases/queues` — currently 252 lines, BASIC mock list)
- [ ] **Rebuild with real queue management**
- [ ] **Queue detail page** — cases in queue, assignment rules, priority settings
- [ ] **Queue analytics** — avg time in queue, throughput, SLA compliance

### 2.5 Case Assignment Policies (`/platform/cases/assignment-policies` — currently 258 lines, BASIC mock list)
- [ ] **Rebuild with real policy editor** — define rules for auto-assignment (round-robin, load-balanced, skill-based)

### 2.6 Case Actions (`/platform/cases/actions` — currently 265 lines, BASIC mock list)
- [ ] **Rebuild with real action configuration** — define what happens when cases reach certain states

### 2.7 Case Analytics (`/platform/cases/analytics` — currently 38 lines, STUB)
- [ ] **Replace generic AnalyticsPageLayout with custom case analytics**
- [ ] **Metrics**: Open cases, Avg resolution time, SLA compliance rate, Cases by status/queue
- [ ] **Charts**: Volume over time, Resolution time trend, SLA breakdown, Queue distribution

---

## Phase 3: Workflow System Enrichment 🟡 MEDIUM PRIORITY

### 3.1 Workflow Editor (`/platform/workflows/[id]`)

**Current state**: AI assistant + Code editor + Settings panel. Working.

**Missing / needs improvement:**
- [ ] **Read-only flow chart** — visual representation of workflow steps (like Inquiry Template flowchart). Show step types, connections, branching
- [ ] **Step type reference** — in the AI chat/code context, provide reference for all 40+ step types:
  - Inquiry steps: Create, Approve, Decline, Mark for Review
  - Case steps: Create, Assign, Set Status, Add Comment, Set SLA
  - Report steps: Run Report, Run Verification
  - Data steps: Get List Match, Tag Object, Update Object, Fetch Persona Object
  - Control flow: Wait, Parallel, Loop, Conditional, Calculate, Evaluate Code
  - Integration: Slack, Hubspot, Salesforce, Zendesk, HTTPS Request
  - Communication: Send Email, Send SMS
- [ ] **Simulate button** — currently shows toast "not yet available". Implement simulation with sample data
- [ ] **Version history** — show previous versions, diff between versions, rollback

### 3.2 Workflow List Enrichment (`/platform/workflows`)
- [ ] **Modules tab** — Persona has "Workflows" and "Modules" tabs. Add Modules tab showing reusable workflow modules
- [ ] **Filters** — match Persona: Search, Filter By (Triggers), Event Name, Status (Active/Inactive), Sort By

### 3.3 Workflow Runs (`/platform/workflows/runs`)
- [ ] **Run detail page** (`/platform/workflows/runs/[id]`) — execution trace: which steps ran, inputs/outputs, timing, errors
- [ ] **Run status**: running, completed, failed, timed out
- [ ] **Re-run action**

### 3.4 Workflow Templates (NEW)
- [ ] **Pre-built workflow templates** — common patterns:
  - KYC auto-approve (verify → report → approve/decline)
  - Continuous monitoring (scheduled report → case on match)
  - Re-verification (expired inquiry → send link → new verification)
  - Escalation (failed verification → create case → assign)

---

## Phase 4: Graph System Enrichment 🟡 MEDIUM PRIORITY

### 4.1 Graph Explorer (`/platform/graph`)

**Current state**: Page exists with basic layout

**Missing / needs improvement:**
- [ ] **Interactive graph visualization** — network diagram showing entity relationships. Nodes = accounts/inquiries/verifications. Edges = relationships (same device, same IP, same document, etc.)
- [ ] **Query interface** — text input for Graph Query Language, run button, results display
- [ ] **Entity hover/click** — show entity details in popup
- [ ] **Fraud ring detection** — highlight clusters of connected entities
- [ ] **Filters** — filter by relationship type, entity type, date range, risk level

### 4.2 Graph Templates (`/platform/graph/templates`)
- [ ] **Query templates** — pre-built queries for common patterns
- [ ] **Template editor** — AI assistant + Code pattern

### 4.3 Graph Configuration (`/platform/graph/configuration`)
- [ ] **Relationship settings** — which attributes to index for graph connections
- [ ] **Alerting rules** — trigger workflows when graph patterns detected

---

## Phase 5: Lists & Utilities Enrichment 🟡 MEDIUM PRIORITY

### 5.1 Lists (`/platform/utilities/lists`)
- [ ] **List detail page** (`/platform/utilities/lists/[id]`) — show items, add/remove, bulk import
- [ ] **List types** — support all 9: Country, Name, Email, Phone, IP, Geolocation, Gov ID Number, Browser Fingerprint, Strings
- [ ] **List creation modal** — select type, name, description
- [ ] **Bulk import** — CSV upload
- [ ] **Usage tracking** — which workflows/reports reference this list

### 5.2 Tags (`/platform/utilities/tags`)
- [ ] **Tag usage stats** — count per entity type
- [ ] **Bulk operations** — merge tags, bulk delete

### 5.3 Integrations (`/platform/integrations`)
- [ ] **Integration detail page** — configuration, connection status, logs
- [ ] **OAuth flow** — connect/disconnect with status
- [ ] **Integration logs** — recent events sent/received

---

## Phase 6: Cross-cutting Features (from Persona UI) 🟡 MEDIUM PRIORITY

Features observed on Persona dashboard that apply across all pages:

### 6.1 Saved Views
- [ ] **"Select a view" dropdown** on all list pages — save current filter/sort/column configuration
- [ ] **"Save view" button** — persist as named view
- [ ] **Default view** — pre-configured view per entity type
- [ ] Store in Zustand or localStorage

### 6.2 Gallery View
- [ ] **View toggle** on Inquiries list — switch between table and card/gallery layout
- [ ] Gallery shows: collected photos, name, status badge, date

### 6.3 Bulk Actions
- [ ] **Checkbox column** on Cases, Inquiries — select multiple rows
- [ ] **Bulk action buttons** in TopBar — Set Status (N), Assign (N), Tag (N), Export (N)
- [ ] **Select all** checkbox in header

### 6.4 Copilot / AI Assistant
- [ ] **Copilot button** in TopBar on all pages — contextual AI help
- [ ] On detail pages: summarize entity, suggest next action, explain risk signals
- [ ] On list pages: natural language search ("show me all declined inquiries from last week")

### 6.5 Solutions Page
- [ ] **`/solutions` page** — browse pre-built KYC solution templates (KYC+AML, KYB, Age Verification, etc.)
- [ ] Solution = pre-configured Inquiry Template + Workflow + Report combination

---

## Phase 7: Data & Export Features 🟡 MEDIUM PRIORITY

### 7.1 Data Exports (`/platform/data/exports`)
- [ ] **Export creation wizard** — select entity type, date range, columns, format (CSV/JSON)
- [ ] **Export types**: Inquiry Overview, Verification Volume, Verification Checks, Match Comparison
- [ ] **Export status** — pending, processing, completed, download link
- [ ] **Scheduled exports** — recurring

### 7.2 Data Imports (`/platform/data/imports`)
- [ ] **Import wizard** — upload CSV, map columns, preview, confirm
- [ ] **Import types** — accounts, list items, tags
- [ ] **Import status** — progress, success/error count, error log

---

## Phase 8: Analytics Enrichment 🟢 LOW PRIORITY

### 8.1 Inquiry Analytics
- [ ] **Saved Queries tab** — save filter combinations
- [ ] **Additional metrics**: Interacted rate, Country breakdown, Platform/Device breakdown
- [ ] **Filters**: Country codes, Platform integrations, Device groups, Tags
- [ ] **Export chart data**

### 8.2 Verification Analytics
- [ ] **Check-level analytics** — pass/fail rates per check type
- [ ] **Capture method analytics** — photo vs NFC
- [ ] **Country breakdown**

### 8.3 Case Analytics
- [ ] **SLA compliance**, **Agent performance**, **Queue analytics**

### 8.4 API Analytics
- [ ] **Request volume**, **Error rate**, **Latency percentiles**, **Top endpoints**

---

## Phase 9: Settings Completion 🟢 LOW PRIORITY

### 9.1 Settings Forms
- [ ] **Your Profile** — avatar upload, name/email, timezone/language, notifications, 2FA, password
- [ ] **Organization** — org name, logo, subdomain
- [ ] **Project Settings** — project name, environment (sandbox/production)
- [ ] **Security** — IP allowlist, session timeout, password policy, SSO
- [ ] **Billing** — plan display, usage, payment method, invoices
- [ ] **Domain Manager** — custom domain, SSL status
- [ ] **SMTP** — custom email sender, test send
- [ ] **Notifications** — per-event notification preferences
- [ ] **Getting Started** — onboarding checklist with progress

### 9.2 Team Management
- [ ] **User invite flow** — email invite, role, team assignment
- [ ] **Role editor** (`/settings/team/roles/[id]`) — permission matrix
- [ ] **Team editor** (`/settings/team/teams/[id]`) — members, permissions
- [ ] **Audit log detail** — expandable entries

---

## Phase 10: Developer Experience 🟢 LOW PRIORITY

- [ ] **API key detail** — permissions, usage stats, rotate
- [ ] **Webhook detail** — endpoint, events, secret, delivery logs, test
- [ ] **Event detail** — full payload viewer (JSON syntax highlighting), replay
- [ ] **Event filtering** — by type, entity, date range

---

## Phase 11: Polish & Cross-cutting 🟢 LOW PRIORITY

- [ ] **PDF export** — generate PDF for inquiry/verification/report detail pages
- [ ] **Keyboard shortcuts** — navigation (g+i → inquiries), actions (a → approve)
- [ ] **Command palette** — Cmd+K for quick navigation
- [ ] **Toast notifications** — for async actions
- [ ] **Sandbox indicator** — "Sandbox / Simulated Data" badge (like Persona)
- [ ] **Responsive mobile** — all pages work on mobile/tablet
- [ ] **Loading states** — Skeleton placeholders everywhere
- [ ] **Error states** — error boundaries with retry

---

## Folio Improvements Over Persona

| Area | Persona | Folio |
|------|---------|-------|
| **Flow/Workflow editing** | Manual drag-and-drop flow builder | AI assistant + Code editor + Read-only flowchart |
| **Navigation** | Flat sidebar per section | Grouped sidebar with clear categories (Dashboard, Analytics, Templates, Configuration) |
| **Template management** | Separate pages per template type | Unified template pattern with AI editor across all entity types |
| **Analytics** | Basic charts with limited filters | Rich analytics with interval selector, funnel Sankey, trend comparisons |
| **UI consistency** | Mixed patterns across pages | Strict shared constants (TopBar sizes, page layouts, status colors) |
| **Dark mode** | No dark mode | Full dark mode via PlexUI theming |

---

## Working Method

When implementing each phase:
1. **Use Dev Browser extension** to connect to Chrome and study the live Persona page being replicated
2. **Take screenshots** of Persona's implementation for reference
3. **Read reference docs** in `reference/persona/help/` for feature details
4. **Follow existing Folio patterns** (AGENTS.md rules, shared components, constants)
5. **Improve where possible** — better UX, AI-powered features, consistent design

---

## Priority Order

1. **Phase 1** — Detail Pages (80% of user time)
2. **Phase 2** — Cases System (operational hub)
3. **Phase 3** — Workflows (automation)
4. **Phase 4** — Graph (fraud investigation)
5. **Phase 5** — Lists & Utilities
6. **Phase 6** — Cross-cutting (saved views, bulk actions, gallery, copilot)
7. **Phase 7** — Data & Exports
8. **Phase 8** — Analytics enrichment
9. **Phase 9** — Settings completion
10. **Phase 10** — Developer experience
11. **Phase 11** — Polish

---

## Reference Files

| Resource | Path |
|----------|------|
| Persona data model | `reference/persona/data-model.md` |
| Persona navigation | `reference/persona/dashboard-sections.md` |
| Persona help docs | `reference/persona/help/` |
| Persona API docs | `reference/persona/docs/` |
| Persona API reference | `reference/persona/docs/api-reference/` |
| Folio nav config | `src/lib/constants/nav-config.ts` |
| Folio shared components | `src/components/shared/` |
| Folio chart components | `src/components/charts/` |
| Folio constants | `src/lib/constants/` |
| Folio AGENTS.md rules | `AGENTS.md` |
