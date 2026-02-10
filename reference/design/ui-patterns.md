# UI Patterns & Design Reference

## Source: OpenAI Platform + Persona Dashboard

---

## Layout Patterns

### Dashboard Shell
```
┌─────────────────────────────────────────────┐
│ [Logo] [Sidebar Navigation]  │  [Content]   │
│                               │              │
│ SECTION 1                     │  PageHeader  │
│  • Item 1                     │  ──────────  │
│  • Item 2                     │              │
│  • Item 3                     │  MetricCards │
│                               │  ┌──┐┌──┐┌──┐│
│ SECTION 2                     │  └──┘└──┘└──┘│
│  • Item 4                     │              │
│  • Item 5                     │  DataTable   │
│                               │  ┌──────────┐│
│ ─────────────────             │  │          ││
│ [User] [Settings]             │  │          ││
│                               │  └──────────┘│
└─────────────────────────────────────────────┘
```

### Sidebar Navigation (OpenAI-style)
- Collapsible sidebar (icon-only or full)
- Section headers: uppercase, small, muted
- Active item: background highlight + left border accent
- Icons: Lucide, 16-20px
- Bottom: user avatar + settings

### Detail Page Layout
```
┌──────────────────────────────────────────────┐
│ ← Back   Entity ID                  [Actions]│
├──────────────────────────────────────────────┤
│ [Tab1] [Tab2] [Tab3] [Tab4]                  │
├──────────────────────┬───────────────────────┤
│                      │ Info Sidebar          │
│  Main Content        │ ─────────────         │
│                      │ Status: ✅ Approved   │
│  Section 1           │ Created: date         │
│  ──────────          │ Template: link        │
│                      │                       │
│  Section 2           │ Tags                  │
│  ──────────          │ ─────                 │
│                      │ + Add tag             │
│                      │                       │
│                      │ Related               │
│                      │ ─────                 │
└──────────────────────┴───────────────────────┘
```

---

## Component Patterns

### Metric Cards
```
┌────────────────────┐
│ Total Inquiries    │  ← label (muted, small)
│ 1,247              │  ← value (large, bold)
│ ↑ 12.5% vs last   │  ← trend (green/red + arrow)
└────────────────────┘
```
- 4 cards in a row on desktop, 2 on tablet, 1 on mobile
- Optional sparkline chart
- Border-radius: 8-12px
- Subtle border or elevation

### Status Badges
| Status | Color | Variant |
|--------|-------|---------|
| Approved / Passed | Green | `success` |
| Declined / Failed | Red | `danger` |
| Needs Review | Yellow/Amber | `warning` |
| Pending | Gray | `secondary` |
| No Matches | Green | `success` |
| Match | Red | `danger` |
| Created | Blue | `info` |

Use PlexUI Badge component with semantic color variants.

### Data Tables
- Header row: sticky, uppercase labels, sortable columns (arrow indicator)
- Row hover: subtle background change
- Cell types: text, badge, link, date, avatar
- Search bar: above table, full width
- Filters: below search, horizontal chips or dropdowns
- Pagination: bottom, "Showing X-Y of Z" + page navigation
- Empty state: centered message + illustration

### Charts (Recharts)

**Line Chart (Time Series)**
- X axis: dates (daily/weekly)
- Y axis: count
- Tooltip on hover
- Grid lines: horizontal only, subtle
- Colors: primary blue for main line, gray for comparison

**Funnel Chart**
- Horizontal bars, decreasing width
- Labels: step name + count + percentage
- Colors: gradient from blue to lighter blue

**Donut/Pie Chart**
- Status distribution
- Center: total count
- Legend: right side

**Bar Chart**
- Horizontal: for category comparison (document types, countries)
- Vertical: for volume over time

---

## Color Palette (derived from OpenAI + PlexUI)

### Base
- Background: `#ffffff` (light) / `#0d0d0d` (dark)
- Surface: `#f7f7f8` (light) / `#171717` (dark)
- Surface elevated: `#ffffff` (light) / `#212121` (dark)
- Border: `#e5e5e5` (light) / `#2e2e2e` (dark)

### Semantic
- Primary: `#0066ff` (blue)
- Success: `#22c55e` (green)
- Danger: `#ef4444` (red)
- Warning: `#f59e0b` (amber)
- Info: `#3b82f6` (blue)
- Muted: `#6b7280` (gray)

### Text
- Primary: `#171717` (light) / `#e5e5e5` (dark)
- Secondary: `#6b7280` (light) / `#9ca3af` (dark)
- Muted: `#9ca3af` (light) / `#6b7280` (dark)

---

## Typography

| Element | Size | Weight | Font |
|---------|------|--------|------|
| Page title | 24px | 600 | System / Inter |
| Section title | 18px | 600 | System / Inter |
| Card title | 14px | 500 | System / Inter |
| Body | 14px | 400 | System / Inter |
| Small / Label | 12px | 400 | System / Inter |
| Metric value | 28-36px | 700 | System / Inter |
| Badge | 12px | 500 | System / Inter |
| Mono (IDs) | 13px | 400 | Mono |

---

## Responsive Breakpoints

| Breakpoint | Width | Layout |
|------------|-------|--------|
| Mobile | < 640px | Sidebar hidden, stacked cards |
| Tablet | 640-1024px | Sidebar collapsed (icons), 2-col cards |
| Desktop | > 1024px | Full sidebar, 3-4 col cards |

---

## Dark Mode

Use PlexUI's `light-dark()` CSS function and semantic tokens.
All colors should use CSS custom properties, never hardcoded.
Default: follow system preference, with manual toggle.
