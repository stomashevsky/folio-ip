# Persona Dashboard Sections — Reference

## Navigation Structure

### IDENTITY Section
1. **Inquiries** — All Inquiries, Analytics, Signals, Templates, Themes, Domain Manager
2. **Verifications** — All Verifications, Analytics, Templates
3. **Reports** — All Reports, Templates, Analytics
4. **Accounts** — All Accounts, Types
5. **Transactions** — All Transactions, Analytics, Types

### PLATFORM Section
- Cases, Workflows, Graph, Data, Utilities, Integrations

### DEVELOPERS Section
- API, Webhooks, Events

### ADMIN Section
- Team, Organization, Documentation

---

## Key Dashboard Views (for our simplified version)

### 1. Inquiries List
**URL:** `/dashboard/inquiries`
**Columns:** Name, Inquiry ID, Reference ID, Created at (UTC), Status
**Features:** Search, Date filter, Default/Gallery view, Export, + Create Inquiry
**Status badges:** Approved (green), Declined (red), Needs Review (yellow), Pending (gray)

### 2. Inquiry Detail
**Tabs:** Overview, Verifications, Sessions, Signals, Reports, List matches
**Overview sections:**
- Summary: List Matches, Time to Finish, Verification Attempts
- Collected: Government ID + Selfie photos
- Attributes: Name, Birthdate, ID number, Address, Country, Dates
- Location: Map + coordinates
- Signals table
- Behavioral risk signals

**Info sidebar:**
- Inquiry ID, Reference ID, Account ID
- Created At, Template, Status
- Tags, Cases

### 3. Inquiry Analytics
**URL:** `/dashboard/inquiry-analytics`
**Tabs:** Overview, Funnel, Saved Queries
**Metrics:** Inquiries created, Started rate, Interacted rate, Finished rate, Success rate, Rejected rate, Time to finish (median)
**Charts:** Created (Daily), Funnel visualization
**Filters:** Dates, Country codes, Platform integrations, Device groups, Tags

### 4. Verifications List
**Columns:** Type, Verification ID, Created at (UTC), Status
**Status badges:** Passed (green), Failed (red)

### 5. Reports List
**Columns:** Primary Input, Status, Report ID, Created at (UTC)
**Status badges:** No Matches (green), Match (red)

### 6. Accounts List
**Columns:** Name, Account ID, Reference ID, Status, Type, Last updated at

### 7. Account Detail
**Profile:** Photo, Name, Address, Birthdate, Age
**Linked data:** Inquiries, Reports, Verifications, Documents

---

## UI Patterns

### Tables
- Search bar at top
- Date filter (Date created dropdown + calendar)
- Column headers with sort (click to toggle)
- Status badges: colored labels (green=passed/approved, red=failed/declined, yellow=review)
- Pagination: Items per page dropdown + Showing X-Y of Z + page nav
- Default view / Gallery view toggle

### Detail Pages
- Left: main content area with tabs
- Right: Info sidebar (fixed)
- Top: breadcrumb + action buttons (Review, More, Copilot)
- Event timeline on right side

### Charts/Analytics
- Line charts for time series (daily/weekly)
- Funnel visualization for conversion
- Metric cards with large numbers
- Filter bar for segmentation

### Sandbox Indicator
- Orange badge "Sandbox / Simulated Data" in top-left
- Yellow "Simulated Data" badges next to data sections
