# OpenAI Design Reference Document

> Compiled from analysis of developers.openai.com, platform.openai.com,
> and openai.github.io/apps-sdk-ui. Based on patterns observed through
> early 2025. Designs may have evolved since.

---

## Table of Contents

1. [Color System](#1-color-system)
2. [Typography](#2-typography)
3. [Navigation Patterns](#3-navigation-patterns)
4. [Layout System](#4-layout-system)
5. [Card and Panel Patterns](#5-card-and-panel-patterns)
6. [Button Styles](#6-button-styles)
7. [Dashboard and Analytics Patterns](#7-dashboard-and-analytics-patterns)
8. [Dark / Light Theme Approach](#8-dark--light-theme-approach)
9. [Form and Input Patterns](#9-form-and-input-patterns)
10. [Apps SDK UI Components](#10-apps-sdk-ui-components)
11. [Spacing and Grid](#11-spacing-and-grid)
12. [Iconography](#12-iconography)
13. [Motion and Transitions](#13-motion-and-transitions)

---

## 1. Color System

### 1.1 Core Palette (Dark Theme - Default)

OpenAI's developer surfaces default to a **dark theme** with a sophisticated
neutral palette:

```
Background layers (darkest to lightest):
  --bg-primary:       #000000       (page-level background)
  --bg-secondary:     #0d0d0d       (main content area)
  --bg-tertiary:      #171717       (cards, panels, elevated surfaces)
  --bg-quaternary:    #1e1e1e       (hover states, subtle emphasis)
  --bg-surface:       #262626       (interactive surface highlights)

Borders:
  --border-default:   #2e2e2e       (subtle structural borders)
  --border-emphasis:  #3e3e3e       (more visible borders)
  --border-hover:     #4e4e4e       (hover state borders)

Text colors:
  --text-primary:     #ececec       (headings, primary content)
  --text-secondary:   #a1a1a1       (body text, descriptions)
  --text-tertiary:    #6e6e6e       (placeholders, disabled, metadata)
  --text-link:        #7ab7ff       (default link blue)

Accent / Brand:
  --accent-green:     #10a37f       (OpenAI brand green, CTAs)
  --accent-green-hover: #0d8a6a     (green hover state)
  --accent-blue:      #7ab7ff       (links, info indicators)
  --accent-purple:    #a78bfa       (used sparingly for highlights)

Status colors:
  --status-success:   #10a37f       (success / positive, same as brand green)
  --status-warning:   #f0b429       (warnings, caution)
  --status-error:     #ef4146       (errors, destructive actions)
  --status-info:      #7ab7ff       (informational)
```

### 1.2 Light Theme Palette

```
Background layers:
  --bg-primary:       #ffffff
  --bg-secondary:     #f7f7f8
  --bg-tertiary:      #ececf1
  --bg-quaternary:    #e5e5e5

Borders:
  --border-default:   #e5e5e5
  --border-emphasis:  #d1d1d6

Text colors:
  --text-primary:     #202123
  --text-secondary:   #6e6e80
  --text-tertiary:    #8e8ea0

Accent:
  --accent-green:     #10a37f
  --accent-green-hover: #0d8a6a
```

### 1.3 Semantic Token Structure

OpenAI uses a layered token system:

```
Primitive     ->    Semantic        ->    Component
#10a37f       ->    --color-success ->    --btn-primary-bg
#171717       ->    --color-surface ->    --card-bg
#a1a1a1       ->    --color-muted   ->    --label-color
```

---

## 2. Typography

### 2.1 Font Stack

```css
--font-sans: "Soehne", "Helvetica Neue", Helvetica, Arial, sans-serif;
--font-mono: "Soehne Mono", "Menlo", "Consolas", "Monaco", monospace;
```

"Soehne" is OpenAI's primary brand typeface (designed by Kris Sowersby /
Klim Type Foundry). Fallbacks are standard system sans-serif fonts.

### 2.2 Type Scale

```
Display / Hero:       40-56px  /  font-weight: 600  /  line-height: 1.1
Heading 1 (h1):       32-36px  /  font-weight: 600  /  line-height: 1.2
Heading 2 (h2):       24-28px  /  font-weight: 600  /  line-height: 1.3
Heading 3 (h3):       20px     /  font-weight: 600  /  line-height: 1.4
Heading 4 (h4):       16-18px  /  font-weight: 600  /  line-height: 1.4
Body large:           16px     /  font-weight: 400  /  line-height: 1.6
Body default:         14px     /  font-weight: 400  /  line-height: 1.5
Body small / Caption: 13px     /  font-weight: 400  /  line-height: 1.4
Label:                12px     /  font-weight: 500  /  line-height: 1.3
Overline / Eyebrow:   11-12px  /  font-weight: 600  /  letter-spacing: 0.05em
                                   text-transform: uppercase
Code / Mono:          13-14px  /  font-weight: 400  /  font-family: var(--font-mono)
```

### 2.3 Typography Characteristics

- **Tracking (letter-spacing)**: Tight on headings (-0.02em to -0.01em),
  normal on body text, wide on overlines (+0.05em)
- **Paragraph spacing**: Generally 1em between paragraphs
- **Max line width**: Content capped at ~680-720px for readability
- **Font rendering**: `-webkit-font-smoothing: antialiased`

---

## 3. Navigation Patterns

### 3.1 Developer Portal (developers.openai.com)

**Top Navigation Bar:**
```
+------------------------------------------------------------------+
| [OpenAI Logo]  Docs  API Reference  Guides  Cookbook   [Login]    |
+------------------------------------------------------------------+
```

- **Height**: ~56-64px
- **Background**: `#000000` or transparent over hero, becomes solid on scroll
- **Position**: `sticky` top, with backdrop-blur effect
- **Logo**: OpenAI logotype in white, left-aligned
- **Nav links**: 14px, font-weight 500, `--text-secondary` color,
  white on hover with subtle underline indicator
- **Right side**: Login / Sign Up button (ghost or outlined style)
- **Mobile**: Collapses to hamburger menu with slide-in panel

**Documentation Sidebar (Docs pages):**
```
+--------+--------------------------------------------+
| SIDEBAR| CONTENT                                    |
| 240px  |                                            |
|        |                                            |
| [Nav]  | Article content with                       |
| [Nav]  | table of contents on right                 |
| [Nav]  |                                   [TOC]    |
|  [Sub] |                                   [TOC]    |
|  [Sub] |                                   [TOC]    |
| [Nav]  |                                            |
+--------+--------------------------------------------+
```

- **Width**: 240-260px
- **Background**: Same as page or slightly different shade (#0d0d0d)
- **Section headers**: 11-12px uppercase, `--text-tertiary`, font-weight 600
- **Nav items**: 14px, `--text-secondary`, padding 6-8px vertical
- **Active item**: `--text-primary` with left border accent (2px green or white)
  or background highlight
- **Nested items**: Indented 16px, collapsible with chevron icon
- **Scrollable**: Independent scroll from main content
- **Mobile**: Hidden, accessible via hamburger toggle

**Table of Contents (right rail on doc pages):**
- Width: ~200px
- Fixed position while scrolling
- Tracks current section with highlighted active item
- Text: 13px, `--text-tertiary`, active item uses `--text-primary`

### 3.2 Platform Dashboard (platform.openai.com)

**Left Sidebar Navigation:**
```
+----------+----------------------------------------------------+
| SIDEBAR  | TOP BAR                                            |
|  56-64px |  [Breadcrumb / Page Title]      [Org Switcher] [?] |
|          +----------------------------------------------------+
| [Home]   | MAIN CONTENT                                       |
| [Play]   |                                                    |
| [Assist] |                                                    |
| [FTune]  |                                                    |
| [API]    |                                                    |
| [Usage]  |                                                    |
| [------] |                                                    |
| [Set]    |                                                    |
| [Docs]   |                                                    |
+----------+----------------------------------------------------+
```

- **Width**: 56-64px collapsed (icon-only), 240px expanded
- **Background**: `#0d0d0d` (slightly lighter than pure black)
- **Border**: Right border `1px solid var(--border-default)`
- **Nav items**: Icon + label, stacked vertically
  - Collapsed: 40x40px icon buttons centered
  - Expanded: Icon (20px) + label (14px) in a row, 40px height
- **Active item**: Background highlight `--bg-tertiary`, white text/icon
- **Hover**: Background `--bg-quaternary`
- **Sections**: Separated by thin horizontal divider
- **Bottom**: Settings, Documentation links, user avatar/org switcher
- **Tooltip**: On collapsed mode, hovering shows label tooltip

**Top Bar (within platform):**
- Height: ~48-56px
- Contains: Breadcrumb or page title, org/project switcher dropdown
- Right side: Help button, notifications, account menu
- Minimal, clean divider line at bottom

### 3.3 Navigation Interaction Patterns

- **Transitions**: Sidebar expand/collapse is 200ms ease
- **Keyboard navigation**: Full support with focus rings (2px offset, blue)
- **Active route**: Determined by URL path matching
- **Breadcrumbs**: `Home / Section / Page` with `>` separators, 13px

---

## 4. Layout System

### 4.1 Developer Portal Layout

```
Hero Section:
  - Full-width, centered content
  - Max-width content: 1200px
  - Padding: 80-120px vertical for hero areas
  - Large headline + subtitle + CTA

Content Grid:
  - 12-column grid implied (flexbox/grid-based)
  - Max content width: 1200-1280px
  - Gutter: 24-32px
  - Side padding: 24px (mobile) / 48px (desktop)

Feature Cards Grid:
  - 3-column on desktop (repeat(3, 1fr))
  - 2-column on tablet
  - 1-column on mobile
  - Gap: 24px
```

### 4.2 Platform Dashboard Layout

```
+------+-------------------------------------------+
|      | Content area                              |
| Side | Max width: varies by page                 |
| bar  | Padding: 24-32px                          |
|      |                                           |
| 56-  | Typical page structure:                   |
| 64px | [Page header: title + actions]            |
|      | [Tab navigation if applicable]            |
|      | [Content panels / data tables]            |
|      |                                           |
+------+-------------------------------------------+
```

**Page Content Patterns:**

1. **Full-width content**: Tables, usage charts take full available width
2. **Centered content**: Forms and settings pages center at ~640-800px max
3. **Two-column**: Settings with nav on left, content on right
4. **Tab layouts**: Horizontal tabs below page header, content switches

### 4.3 Responsive Breakpoints

```
--breakpoint-sm:   640px     (mobile landscape)
--breakpoint-md:   768px     (tablet)
--breakpoint-lg:   1024px    (small desktop, sidebar collapses)
--breakpoint-xl:   1280px    (standard desktop)
--breakpoint-2xl:  1536px    (wide desktop)
```

---

## 5. Card and Panel Patterns

### 5.1 Standard Card

```css
.card {
  background: var(--bg-tertiary);        /* #171717 dark / #fff light */
  border: 1px solid var(--border-default); /* #2e2e2e dark */
  border-radius: 12px;
  padding: 24px;
  transition: border-color 0.15s ease;
}
.card:hover {
  border-color: var(--border-hover);
}
```

### 5.2 Feature Card (Developer Portal)

```
+------------------------------------+
|  [Icon or illustration]            |
|                                    |
|  Card Title                        |
|  Description text that explains    |
|  the feature in 1-2 lines.        |
|                                    |
|  Learn more ->                     |
+------------------------------------+
```

- **Icon area**: 40-48px icon, often in a colored circle or with gradient
- **Title**: 18-20px, font-weight 600, `--text-primary`
- **Description**: 14px, `--text-secondary`, 2-3 lines max
- **Link**: 14px, `--accent-green` or `--text-link`, with right arrow
- **Hover**: Subtle border brighten + slight translate Y (-2px)

### 5.3 API Endpoint Card

```
+------------------------------------+
|  GET  /v1/chat/completions         |
|                                    |
|  Creates a model response for the  |
|  given chat conversation.          |
|                                    |
|  [gpt-4] [gpt-3.5-turbo]         |
+------------------------------------+
```

- **Method badge**: Colored inline label (GET=green, POST=blue, DELETE=red)
- **Endpoint path**: Monospace font, `--text-primary`
- **Model tags**: Small pills/badges, `--bg-surface` background

### 5.4 Stats/Metric Card (Dashboard)

```
+------------------------------------+
|  Total Requests          [?]       |
|  1,234,567                         |
|  +12.3% vs last period             |
|  [Sparkline chart ~~~~~~~~~~~~]    |
+------------------------------------+
```

- **Label**: 13px, `--text-secondary`, with optional info icon
- **Value**: 28-32px, font-weight 600, `--text-primary`
- **Delta**: 13px, colored (green positive, red negative)
- **Sparkline**: Thin line chart, 40-60px tall, subtle color

### 5.5 Panel / Section Container

```css
.panel {
  background: var(--bg-secondary);
  border: 1px solid var(--border-default);
  border-radius: 12px;
  overflow: hidden; /* for internal dividers */
}
.panel-header {
  padding: 16px 24px;
  border-bottom: 1px solid var(--border-default);
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.panel-body {
  padding: 24px;
}
```

### 5.6 Code Block Card

```css
.code-block {
  background: #0d0d0d;
  border: 1px solid var(--border-default);
  border-radius: 8px;
  font-family: var(--font-mono);
  font-size: 13px;
  line-height: 1.6;
  padding: 16px;
  overflow-x: auto;
}
.code-block-header {
  /* Language label + copy button */
  padding: 8px 16px;
  border-bottom: 1px solid var(--border-default);
  font-size: 12px;
  color: var(--text-tertiary);
}
```

---

## 6. Button Styles

### 6.1 Primary Button

```css
.btn-primary {
  background: var(--accent-green);       /* #10a37f */
  color: #ffffff;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  height: 36px;
  cursor: pointer;
  transition: background 0.15s ease;
}
.btn-primary:hover {
  background: var(--accent-green-hover); /* #0d8a6a */
}
.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

### 6.2 Secondary / Ghost Button

```css
.btn-secondary {
  background: transparent;
  color: var(--text-primary);
  border: 1px solid var(--border-emphasis);
  border-radius: 6px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  height: 36px;
}
.btn-secondary:hover {
  background: var(--bg-quaternary);
  border-color: var(--border-hover);
}
```

### 6.3 Danger / Destructive Button

```css
.btn-danger {
  background: transparent;
  color: var(--status-error);
  border: 1px solid var(--status-error);
  border-radius: 6px;
}
.btn-danger:hover {
  background: rgba(239, 65, 70, 0.1);
}
```

### 6.4 Icon Button

```css
.btn-icon {
  width: 36px;
  height: 36px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  background: transparent;
  color: var(--text-secondary);
  border: none;
}
.btn-icon:hover {
  background: var(--bg-quaternary);
  color: var(--text-primary);
}
```

### 6.5 Button Sizes

```
Small:   height: 28px, padding: 4px 10px, font-size: 13px
Default: height: 36px, padding: 8px 16px, font-size: 14px
Large:   height: 44px, padding: 12px 24px, font-size: 16px
```

---

## 7. Dashboard and Analytics Patterns

### 7.1 Usage Dashboard (platform.openai.com/usage)

**Layout Structure:**
```
+-------------------------------------------------------+
| Usage              [Date Range Picker] [Org Selector]  |
+-------------------------------------------------------+
| [Daily cost]  [Cumulative]  [By model]  [Activity log] |
+-------------------------------------------------------+
|                                                        |
|  Cost ($)                                              |
|  $XXX.XX                                               |
|                                                        |
|  [===========Area Chart================]               |
|  |                                     |               |
|  |    ___/\                            |               |
|  |___/     \___________                |               |
|  |__________________________|          |               |
|  Jan    Feb    Mar    Apr              |               |
|                                                        |
+-------------------------------------------------------+
|  Breakdown by Model                                    |
|  +--------------------------------------------------+ |
|  | Model         | Requests | Tokens    | Cost      | |
|  |---------------|----------|-----------|-----------|  |
|  | gpt-4         | 12,345   | 1.2M      | $45.67   | |
|  | gpt-3.5-turbo | 45,678   | 5.6M      | $12.34   | |
|  +--------------------------------------------------+ |
+-------------------------------------------------------+
```

### 7.2 Chart Styling

```
Colors for multi-series charts:
  Series 1: #10a37f  (green, primary)
  Series 2: #7ab7ff  (blue)
  Series 3: #a78bfa  (purple)
  Series 4: #f0b429  (yellow)
  Series 5: #ef4146  (red)

Chart area:
  - Background: transparent (inherits card background)
  - Grid lines: var(--border-default), dashed or dotted, 1px
  - Axis labels: 12px, var(--text-tertiary)
  - Axis lines: var(--border-default) or hidden
  - Tooltip: Dark elevated card (#262626), 13px, with colored dot indicator

Area/Line charts:
  - Line width: 2px
  - Area fill: 10-20% opacity of line color
  - Hover: Vertical crosshair line + enlarged point + tooltip
  - Smooth curves (monotone interpolation)

Bar charts:
  - Border-radius on top: 4px
  - Hover: Slightly brighter fill + tooltip
  - Stacked bars for multi-model breakdowns
```

### 7.3 Date Range Picker

```
+------------------------------------------+
| [Last 7 days  v]  [Jan 1 - Jan 7, 2025] |
+------------------------------------------+

Preset options:
  - Today
  - Last 7 days
  - Last 30 days
  - This month
  - Last month
  - Custom range (opens calendar picker)
```

- Dropdown style: `--bg-tertiary` background, `--border-default` border
- Calendar: Grid layout, 32px cells, today highlighted, range selection
  with colored band

### 7.4 Data Table Pattern

```css
.data-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}
.data-table th {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-tertiary);
  padding: 12px 16px;
  border-bottom: 1px solid var(--border-default);
  text-align: left;
}
.data-table td {
  font-size: 14px;
  color: var(--text-primary);
  padding: 12px 16px;
  border-bottom: 1px solid var(--border-default);
}
.data-table tr:hover td {
  background: var(--bg-quaternary);
}
/* Numeric cells right-aligned, monospace */
.data-table td.numeric {
  text-align: right;
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
}
```

### 7.5 Metric Presentation Conventions

- **Large numbers**: Formatted with commas (1,234,567)
- **Currency**: Dollar sign prefix, 2 decimal places ($45.67)
- **Percentages**: 1 decimal, colored (green positive, red negative)
- **Tokens**: Abbreviated when large (1.2M, 456K)
- **Dates**: "Jan 7, 2025" or "01/07/25" in tables
- **Time-series**: X-axis date labels auto-thin based on range

---

## 8. Dark / Light Theme Approach

### 8.1 Implementation Strategy

OpenAI uses a **CSS custom properties** approach with a class toggle:

```css
/* Default: Dark theme */
:root {
  --bg-primary: #000000;
  --bg-secondary: #0d0d0d;
  --bg-tertiary: #171717;
  --text-primary: #ececec;
  --text-secondary: #a1a1a1;
  /* ... etc */
}

/* Light theme override */
:root[data-theme="light"],
.light {
  --bg-primary: #ffffff;
  --bg-secondary: #f7f7f8;
  --bg-tertiary: #ececf1;
  --text-primary: #202123;
  --text-secondary: #6e6e80;
  /* ... etc */
}
```

### 8.2 Theme Toggle Behavior

- **Default**: Dark theme (especially on developer/platform surfaces)
- **Toggle location**: User menu or settings
- **System preference**: Respects `prefers-color-scheme` as initial default
- **Persistence**: Stored in localStorage and/or user account settings
- **Transition**: `transition: background-color 0.2s, color 0.2s` on body

### 8.3 Theme-Aware Assets

- **Icons**: Use `currentColor` for SVG fills so they adapt
- **Illustrations**: Separate variants for dark/light, or semi-transparent
- **Shadows**: Dark theme uses subtle lighter glows instead of drop shadows
- **Code blocks**: Both themes use dark code blocks (consistent syntax highlighting)

### 8.4 Dark Theme Shadow Strategy

```css
/* Dark theme: no traditional shadows, use borders + subtle glows */
.elevated-dark {
  border: 1px solid var(--border-default);
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.03);
}

/* Light theme: traditional shadows */
.elevated-light {
  border: 1px solid var(--border-default);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08),
              0 4px 12px rgba(0, 0, 0, 0.04);
}
```

---

## 9. Form and Input Patterns

### 9.1 Text Input

```css
.input {
  height: 36px;
  padding: 8px 12px;
  font-size: 14px;
  color: var(--text-primary);
  background: var(--bg-primary);
  border: 1px solid var(--border-default);
  border-radius: 6px;
  outline: none;
  transition: border-color 0.15s ease;
}
.input:focus {
  border-color: var(--accent-green);
  box-shadow: 0 0 0 2px rgba(16, 163, 127, 0.2);
}
.input::placeholder {
  color: var(--text-tertiary);
}
.input-error {
  border-color: var(--status-error);
}
```

### 9.2 Select / Dropdown

```css
.select {
  /* Same base as input */
  appearance: none;
  background-image: url("chevron-down.svg");
  background-position: right 12px center;
  background-repeat: no-repeat;
  padding-right: 36px;
}
```

**Dropdown menu:**
```css
.dropdown-menu {
  background: var(--bg-tertiary);
  border: 1px solid var(--border-default);
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  padding: 4px;
  min-width: 200px;
}
.dropdown-item {
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 14px;
  color: var(--text-primary);
}
.dropdown-item:hover {
  background: var(--bg-quaternary);
}
```

### 9.3 Toggle / Switch

```css
.toggle {
  width: 40px;
  height: 22px;
  border-radius: 11px;
  background: var(--bg-surface);
  position: relative;
  cursor: pointer;
  transition: background 0.2s;
}
.toggle.active {
  background: var(--accent-green);
}
.toggle-thumb {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: white;
  position: absolute;
  top: 2px;
  left: 2px;
  transition: transform 0.2s;
}
.toggle.active .toggle-thumb {
  transform: translateX(18px);
}
```

### 9.4 Form Layout

- **Label**: 14px, font-weight 500, `--text-primary`, margin-bottom 6px
- **Helper text**: 13px, `--text-tertiary`, margin-top 4px
- **Error message**: 13px, `--status-error`, margin-top 4px
- **Field spacing**: 20-24px between fields
- **Form sections**: Separated by dividers or larger spacing (40px)

---

## 10. Apps SDK UI Components

### 10.1 Overview

The OpenAI Apps SDK UI (openai.github.io/apps-sdk-ui) provides a React
component library for building applications integrated with OpenAI. It
follows the same design language as the platform but packaged as
reusable components.

### 10.2 Core Layout Components

**AppLayout**
```tsx
<AppLayout
  sidebar={<Sidebar />}
  header={<Header />}
  content={<MainContent />}
/>
```
- Provides the standard sidebar + header + content shell
- Handles responsive collapsing of sidebar
- Manages scroll containers

**Sidebar**
```tsx
<Sidebar>
  <SidebarHeader>
    <Logo />
  </SidebarHeader>
  <SidebarNav>
    <SidebarNavItem icon={<HomeIcon />} label="Home" href="/" active />
    <SidebarNavItem icon={<ChatIcon />} label="Chat" href="/chat" />
    <SidebarNavGroup label="Tools">
      <SidebarNavItem ... />
    </SidebarNavGroup>
  </SidebarNav>
  <SidebarFooter>
    <UserMenu />
  </SidebarFooter>
</Sidebar>
```

**PageHeader**
```tsx
<PageHeader
  title="Dashboard"
  description="Monitor your application usage"
  actions={<Button>Create new</Button>}
  breadcrumbs={[{ label: "Home", href: "/" }, { label: "Dashboard" }]}
/>
```

### 10.3 Data Display Components

**DataTable**
```tsx
<DataTable
  columns={[
    { key: "model", label: "Model", sortable: true },
    { key: "requests", label: "Requests", align: "right", format: "number" },
    { key: "cost", label: "Cost", align: "right", format: "currency" },
  ]}
  data={rows}
  pagination={{ pageSize: 25, total: 100 }}
  onSort={handleSort}
  emptyState={<EmptyState message="No data yet" />}
/>
```

**MetricCard**
```tsx
<MetricCard
  label="Total Requests"
  value={1234567}
  delta={{ value: 12.3, direction: "up" }}
  sparklineData={[...]}
  format="number"
/>
```

**Chart** (wrapper around charting library)
```tsx
<Chart
  type="area"
  data={chartData}
  xAxis={{ key: "date", format: "date" }}
  yAxis={{ key: "value", format: "currency" }}
  series={[
    { key: "gpt4", label: "GPT-4", color: "#10a37f" },
    { key: "gpt35", label: "GPT-3.5", color: "#7ab7ff" },
  ]}
  tooltip
  legend
/>
```

### 10.4 Interactive Components

**Button** (variants)
```tsx
<Button variant="primary">Submit</Button>       /* Green filled */
<Button variant="secondary">Cancel</Button>     /* Ghost/outlined */
<Button variant="danger">Delete</Button>         /* Red outlined */
<Button variant="ghost">More</Button>            /* No border */
<Button size="sm" />                              /* 28px height */
<Button size="md" />                              /* 36px height */
<Button size="lg" />                              /* 44px height */
<Button icon={<PlusIcon />}>Add item</Button>    /* With icon */
<Button iconOnly icon={<SettingsIcon />} />       /* Icon only */
<Button loading>Saving...</Button>                /* Loading state */
```

**Tabs**
```tsx
<Tabs defaultValue="overview">
  <TabsList>
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="analytics">Analytics</TabsTrigger>
    <TabsTrigger value="settings">Settings</TabsTrigger>
  </TabsList>
  <TabsContent value="overview">...</TabsContent>
  <TabsContent value="analytics">...</TabsContent>
  <TabsContent value="settings">...</TabsContent>
</Tabs>
```

Tab styling:
- Horizontal row below page header
- Active tab: `--text-primary` + bottom border (2px, `--accent-green` or white)
- Inactive: `--text-secondary`
- 14px font, padding 8px 16px
- No background fill on tabs (underline style)

**Dialog / Modal**
```tsx
<Dialog open={isOpen} onClose={handleClose}>
  <DialogHeader>
    <DialogTitle>Confirm action</DialogTitle>
    <DialogDescription>Are you sure?</DialogDescription>
  </DialogHeader>
  <DialogBody>
    ...
  </DialogBody>
  <DialogFooter>
    <Button variant="secondary" onClick={handleClose}>Cancel</Button>
    <Button variant="primary" onClick={handleConfirm}>Confirm</Button>
  </DialogFooter>
</Dialog>
```

Modal styling:
- Overlay: `rgba(0, 0, 0, 0.6)` with backdrop-blur
- Panel: `--bg-tertiary`, border-radius 12px, max-width 480px
- Padding: 24px
- Entry animation: fade + scale from 95% to 100%

**Toast / Notification**
```tsx
<Toast variant="success" message="API key created" />
<Toast variant="error" message="Request failed" />
```
- Position: Bottom-right or top-right
- Background: `--bg-tertiary` with left color stripe
- Auto-dismiss after 5 seconds
- Slide-in animation

### 10.5 Form Components

**Input**
```tsx
<Input
  label="API Key Name"
  placeholder="My API Key"
  helperText="Give your key a memorable name"
  error="Name is required"
  required
/>
```

**Select**
```tsx
<Select
  label="Model"
  options={[
    { value: "gpt-4", label: "GPT-4" },
    { value: "gpt-3.5-turbo", label: "GPT-3.5 Turbo" },
  ]}
  placeholder="Select a model"
/>
```

**TextArea, Checkbox, Radio, Switch** - All follow consistent styling
patterns: same border treatment, focus states, error states, and label
positioning as the Input component.

### 10.6 Feedback Components

**EmptyState**
```tsx
<EmptyState
  icon={<BoxIcon />}
  title="No results found"
  description="Try adjusting your search or filters"
  action={<Button variant="secondary">Clear filters</Button>}
/>
```

**Badge / Tag**
```tsx
<Badge variant="success">Active</Badge>
<Badge variant="warning">Rate limited</Badge>
<Badge variant="error">Failed</Badge>
<Badge variant="neutral">Draft</Badge>
```

Badge styling:
```css
.badge {
  display: inline-flex;
  padding: 2px 8px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 500;
  line-height: 1.4;
}
.badge-success {
  background: rgba(16, 163, 127, 0.15);
  color: #10a37f;
}
.badge-error {
  background: rgba(239, 65, 70, 0.15);
  color: #ef4146;
}
```

**Skeleton / Loading State**
```tsx
<Skeleton width="100%" height={20} />
<Skeleton variant="circle" size={40} />
<Skeleton variant="card" />
```

```css
.skeleton {
  background: linear-gradient(
    90deg,
    var(--bg-quaternary) 25%,
    var(--bg-surface) 50%,
    var(--bg-quaternary) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
  border-radius: 6px;
}
```

---

## 11. Spacing and Grid

### 11.1 Spacing Scale

```
--space-0:    0px
--space-1:    4px
--space-2:    8px
--space-3:    12px
--space-4:    16px
--space-5:    20px
--space-6:    24px
--space-8:    32px
--space-10:   40px
--space-12:   48px
--space-16:   64px
--space-20:   80px
--space-24:   96px
```

### 11.2 Common Spacing Applications

```
Card padding:          24px (--space-6)
Card gap (in grid):    24px (--space-6)
Section spacing:       48-64px (--space-12 to --space-16)
Input label margin:    6px (between --space-1 and --space-2)
Input field gap:       20px (--space-5)
Button padding:        8px 16px (--space-2 x --space-4)
Nav item padding:      8px 12px vertical
Page side padding:     24-32px (--space-6 to --space-8)
Page top padding:      24px (--space-6)
```

### 11.3 Grid System

```css
.grid {
  display: grid;
  gap: var(--space-6);  /* 24px */
}
.grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
.grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
.grid-cols-4 { grid-template-columns: repeat(4, 1fr); }
```

---

## 12. Iconography

### 12.1 Icon System

- **Style**: Outline (stroke-based), 1.5px stroke width
- **Size grid**: 16px, 20px, 24px (default)
- **Color**: Uses `currentColor` for automatic theme adaptation
- **Source**: Custom icon set similar in style to Lucide / Heroicons outline

### 12.2 Common Icons

```
Navigation:  Home, Chat/Message, Code, Settings, FileText, Key, CreditCard
Actions:     Plus, X/Close, Edit/Pencil, Trash, Copy, Download, Upload
Status:      CheckCircle, AlertTriangle, XCircle, Info
UI:          ChevronDown, ChevronRight, Search, Menu, ExternalLink
Data:        BarChart, TrendingUp, Activity, Database
```

### 12.3 Logo Usage

- **Logotype**: "OpenAI" text in Soehne, white on dark / black on light
- **Logomark**: The OpenAI hexagonal/flower icon, used at 20-24px in nav
- **Spacing**: Minimum clear space equal to icon height on all sides

---

## 13. Motion and Transitions

### 13.1 Timing

```css
--duration-fast:    100ms    (micro-interactions: hover, active)
--duration-normal:  200ms    (standard transitions: expand, toggle)
--duration-slow:    300ms    (larger animations: modal, page transition)
--duration-slower:  500ms    (complex sequences, chart animations)
```

### 13.2 Easing

```css
--ease-default:     cubic-bezier(0.25, 0.1, 0.25, 1.0)   (standard)
--ease-in:          cubic-bezier(0.42, 0, 1, 1)           (accelerating)
--ease-out:         cubic-bezier(0, 0, 0.58, 1)           (decelerating)
--ease-in-out:      cubic-bezier(0.42, 0, 0.58, 1)        (symmetric)
--ease-bounce:      cubic-bezier(0.34, 1.56, 0.64, 1)     (playful overshoot)
```

### 13.3 Common Animations

```css
/* Button hover */
.btn { transition: background var(--duration-fast) var(--ease-default); }

/* Card hover lift */
.card { transition: transform var(--duration-normal) var(--ease-out),
                    border-color var(--duration-fast); }
.card:hover { transform: translateY(-2px); }

/* Modal entrance */
@keyframes modal-in {
  from { opacity: 0; transform: scale(0.95); }
  to   { opacity: 1; transform: scale(1); }
}
.modal { animation: modal-in var(--duration-slow) var(--ease-out); }

/* Sidebar expand/collapse */
.sidebar { transition: width var(--duration-normal) var(--ease-in-out); }

/* Page content fade */
@keyframes fade-in {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* Skeleton shimmer */
@keyframes shimmer {
  0%   { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

/* Toast slide-in */
@keyframes toast-in {
  from { opacity: 0; transform: translateX(100%); }
  to   { opacity: 1; transform: translateX(0); }
}
```

---

## Summary of Key Design Principles

1. **Dark-first**: All developer/platform surfaces default to dark mode
   with careful contrast management using layered background values.

2. **Minimal and functional**: Very little decorative ornamentation.
   Clean borders, subtle backgrounds, and ample whitespace do the work.

3. **Green accent for CTAs**: OpenAI's #10a37f green is reserved for
   primary actions and brand moments. Most UI is neutral grayscale.

4. **Typography-driven hierarchy**: Soehne at varying weights and sizes
   carries the visual hierarchy. No reliance on heavy color differences
   for structure.

5. **Consistent elevation model**: Dark theme uses border + subtle
   background shifts instead of shadows. Light theme uses traditional
   subtle shadows.

6. **Component consistency**: Buttons, inputs, cards, and badges all
   share 6px border-radius, consistent padding, and the same transition
   timing.

7. **Data-dense dashboard design**: Metric cards with sparklines, area
   charts with tooltips, and sortable tables with monospace numerals.

8. **Collapsible sidebar**: Platform uses icon-only collapsed sidebar
   (56-64px) that expands to full labels (240px) for navigation.

9. **Responsive with breakpoints**: Three distinct layout modes: mobile
   (sidebar hidden), tablet (sidebar collapsed), desktop (sidebar open).

10. **Accessible by default**: Focus rings, ARIA labels, keyboard
    navigation, and sufficient contrast ratios throughout.
