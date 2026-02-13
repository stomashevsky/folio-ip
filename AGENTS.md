# Agents Configuration — Folio App

## CRITICAL RULE: No Hardcoding — Everything Shared

**Every repeated value, pattern, or UI element MUST be extracted into a shared module.** This is the #1 architectural principle of the codebase. Hardcoded one-offs cause drift and break consistency.

### What "no hardcoding" means in practice:

1. **Data constants** — status colors, filter options, nav config, date shortcuts, user data, report type labels → `src/lib/constants/`
2. **Design tokens** — colors, spacing, border-radius, navbar height → CSS vars in `globals.css`, never inline hex/rgb values
3. **Typography** — always PlexUI classes (`heading-md`, `text-sm`), never raw Tailwind (`text-xl font-semibold`)
4. **Icons** — PlexUI Icon set first (`@plexui/ui/components/Icon`), Lucide only for domain-specific icons not in PlexUI
5. **UI patterns** — if a pattern appears in 2+ places, extract to `src/components/shared/`
6. **Hooks** — shared behavior (`useScrollLock`, `useIsMobile`) → `src/lib/hooks/`
7. **Modal behavior** — use shared `<Modal>` component (handles portal, overlay, Escape, scroll lock), never reimplement

### Shared constants (`src/lib/constants/`)

| Module | Exports | Used by |
|--------|---------|---------|
| `status-colors.ts` | `STATUS_COLORS` map → CSS var tokens | StatusBadge, charts, dashboard |
| `report-type-labels.ts` | `REPORT_TYPE_LABELS` | Reports list + detail pages |
| `date-shortcuts.ts` | `DASHBOARD_DATE_SHORTCUTS`, `LIST_PAGE_DATE_SHORTCUTS` | Dashboard, list pages |
| `nav-config.ts` | `dashboardNavItems`, `settingsNavGroups`, `navSections`, `isRouteActive()`, `isSectionActive()` | AppSidebar, SettingsSidebar, Navbar, MobileSidebarContent |
| `mock-user.ts` | `MOCK_USER` (name, email, org, avatarColor) | Navbar, sidebar, settings pages |

### Shared components (`src/components/shared/`)

| Component | Purpose |
|-----------|---------|
| `NotFoundPage` | Standard 404: `<NotFoundPage section="X" backHref="/x" entity="Y" />` |
| `InlineEmpty` | Small inline empty state: `<InlineEmpty>No items.</InlineEmpty>` |
| `StatusBadge` | Maps entity status → Badge color using `STATUS_COLORS` |
| `DataTable` / `TableSearch` | TanStack Table wrapper with pagination, sorting, search |
| `MetricCard` | Dashboard metric card with trend indicator |
| `ChartCard` | Chart container with title and optional actions |
| `SectionHeading` | Section title with optional badge/action, `size="sm"\|"xs"` prop |
| `Modal` / `ModalHeader` / `ModalBody` / `ModalFooter` | Modal shell (portal, overlay, Escape, scroll lock) |
| `DocumentViewer` | Photo lightbox with zoom, rotate, keyboard nav |
| `TagEditModal` | Tag editor (uses shared `<Modal>`) |
| `CardHeader` | Card title bar with optional status/actions |
| `KeyValueTable` | Two-column key/value display |
| `DetailInfoList` | Vertical label/value list for detail pages |
| `EntityCard` | Clickable entity card with title, subtitle, status |
| `SummaryCard` | Summary stat card |
| `ActivityItem` | Activity feed item with icon |
| `CopyButton` | Copy-to-clipboard button |
| `EventTimeline` | Event timeline display |
| `SettingsTable` | Settings table with actions |
| `ColumnSettings` | Column visibility toggle panel |
| `InfoRow` | Single info row |

All exported from barrel: `src/components/shared/index.ts`

### Shared hooks (`src/lib/hooks/`)

| Hook | Purpose |
|------|---------|
| `useScrollLock(active)` | Lock body scroll (used by Modal, DocumentViewer) |
| `useIsMobile()` | Detect mobile viewport (<768px) via matchMedia |

### App-level CSS tokens (`globals.css`)

```css
:root {
  --navbar-height: 54px;
  --color-nav-active-bg: rgb(0 0 0 / 0.08);
  --color-nav-hover-bg: rgb(0 0 0 / 0.04);
}
[data-theme="dark"], html.dark {
  --color-nav-active-bg: rgb(255 255 255 / 0.08);
  --color-nav-hover-bg: rgb(255 255 255 / 0.04);
}
```

### Before adding any new code, ask:

- Is this value already in a constant module? → Import it
- Is this pattern already a shared component? → Use it
- Will this pattern be used in 2+ places? → Extract it first
- Am I using a raw color/size/font value? → Use a token or PlexUI class instead
- Am I reimplementing modal/scroll-lock/escape? → Use `<Modal>` or `useScrollLock`

---

## CRITICAL RULE: Use @plexui/ui for ALL UI

**@plexui/ui is the PRIMARY and MANDATORY UI library for this project.**

### Mandatory rules:

1. **ALWAYS use `@plexui/ui` components first.** Check if PlexUI has the component or icon before anything else.
2. **NEVER install alternative UI libraries** (shadcn/ui, Chakra, MUI, etc.).
3. **ALWAYS use PlexUI icons** (`@plexui/ui/components/Icon`) — 467+ fill-based SVGs. Only fall back to lucide-react for domain-specific icons.
4. **ALWAYS import via subpath** — `import { Button } from "@plexui/ui/components/Button"`, never barrel imports.
5. **ALWAYS use PlexUI design tokens** (CSS vars `var(--color-*)`) and typography classes (`heading-*`, `text-*`).

### Online docs: https://plexui.com/docs

---

## Project Context

Building a KYC Analytics Dashboard (Folio) using Next.js 16 + PlexUI + Tailwind CSS 4.
Dev server runs on port 3100.

---

## PlexUI Reference

### CSS Setup (globals.css — DO NOT change)
```css
@import "../../node_modules/@plexui/ui/dist/es/styles/variables-primitive.css";
@import "../../node_modules/@plexui/ui/dist/es/styles/variables-semantic.css";
@import "../../node_modules/@plexui/ui/dist/es/styles/variables-components.css";
@import "../../node_modules/@plexui/ui/dist/es/styles/tailwind-utilities.css";
```
Do NOT use `@import "@plexui/ui/css"` — it conflicts with Tailwind.

**CRITICAL:** `tailwind-utilities.css` is required for typography classes. Without it, classes render with no styles.

Use `@source "../../node_modules/@plexui/ui"` for Tailwind class scanning.

### Component Imports (always deep path)
```tsx
import { Button } from "@plexui/ui/components/Button";
import { Badge } from "@plexui/ui/components/Badge";
import { Select } from "@plexui/ui/components/Select";
import { ChevronLeftMd, Plus, Search } from "@plexui/ui/components/Icon";
import type { ControlSize } from "@plexui/ui/types";
```

### Theme System

- PlexUI: `data-theme="light|dark"` on `<html>`
- next-themes: `attribute="class"` → `light`/`dark` class
- `ThemeSync` bridges next-themes ↔ PlexUI
- Utilities from `@plexui/ui/theme`: `applyDocumentTheme()`, `getDocumentTheme()`, `useDocumentTheme()`

### Typography (ALWAYS use these, NEVER raw Tailwind)

**Headings** (weight 600):
`heading-5xl`(72px) · `heading-4xl`(60px) · `heading-3xl`(48px) · `heading-2xl`(36px) · `heading-xl`(28px) · `heading-lg`(22px) · `heading-md`(18px) · `heading-sm`(16px) · `heading-xs`(14px)

**Text** (weight 400):
`text-lg`(18px) · `text-md`(16px) · `text-sm`(14px) · `text-xs`(12px) · `text-2xs`(11px) · `text-3xs`(10px)

### Colors

**Text:** `--color-text`, `--color-text-secondary`, `--color-text-tertiary`, `--color-text-inverse`
**Surface:** `--color-surface`, `--color-border`
**8 semantic colors:** primary, secondary, danger, success, warning, caution, discovery, info
Each has 5 variants: `-soft`, `-solid`, `-outline`, `-ghost`, `-surface` (with `-bg`, `-text`, `-border` suffixes)

### Design Tokens

**Radius:** 2xs(2px) · xs(4px) · sm(6px) · md(8px) · lg(10px) · xl(12px) · 2xl(16px) · full
**Shadows:** hairline · 100 · 200 · 300 · 400 (each with `-strong` and `-stronger`)
**Breakpoints:** xs(380px) · sm(576px) · md(768px) · lg(1024px) · xl(1280px) · 2xl(1536px)

### 9-Step Size Scale (Button, Input, Select, SegmentedControl, SelectControl)

3xs(22px) · 2xs(26px) · xs(28px) · sm(30px) · **md(32px)** · lg(36px) · xl(40px) · 2xl(44px) · 3xl(48px)

### Components Quick Reference

**Full API docs: https://plexui.com/docs**

| Component | Import | Key props |
|-----------|--------|-----------|
| Button | `@plexui/ui/components/Button` | `color`(REQUIRED), `variant`, `size`, `pill`, `uniform`, `loading`, `block` |
| ButtonLink | `@plexui/ui/components/ButtonLink` | Same as Button + `href` |
| Input | `@plexui/ui/components/Input` | `size`, `variant`, `pill`, `block`, `invalid`, `StartIcon`, `EndIcon` |
| FloatingLabelInput | `@plexui/ui/components/FloatingLabelInput` | `label`, `size`, `variant` |
| Textarea | `@plexui/ui/components/Textarea` | `variant`, `resize`, `autoGrow`, `block`, `rows` |
| Select | `@plexui/ui/components/Select` | `options`, `value`, `onChange`, `multiple`, `clearable`, `pill`, `block` |
| SelectControl | `@plexui/ui/components/SelectControl` | `selected`, `variant`, `size`, `pill`, `onClearClick` |
| Badge | `@plexui/ui/components/Badge` | `color`, `variant`, `size`(sm/md/lg), `pill` |
| Alert | `@plexui/ui/components/Alert` | `color`, `variant`, `title`, `description`, `dismissible` |
| Avatar | `@plexui/ui/components/Avatar` | `name`, `imageUrl`, `size`(px), `color`, `variant` |
| AvatarGroup | `@plexui/ui/components/Avatar` | `size`(px), `stack` |
| Checkbox | `@plexui/ui/components/Checkbox` | `checked`, `onCheckedChange`, `label`, `orientation` |
| Switch | `@plexui/ui/components/Switch` | `checked`, `onCheckedChange`, `label`, `size` |
| RadioGroup | `@plexui/ui/components/RadioGroup` | `value`, `onValueChange`, `options`, `orientation` |
| Slider | `@plexui/ui/components/Slider` | `value`, `onValueChange`, `min`, `max`, `step` |
| SegmentedControl | `@plexui/ui/components/SegmentedControl` | `options`, `value`, `onChange`, `size`, `pill` |
| DatePicker | `@plexui/ui/components/DatePicker` | `value`(Luxon), `onChange`, `min`, `max` |
| DateRangePicker | `@plexui/ui/components/DateRangePicker` | `value`, `onChange`, `shortcuts`, `min`, `max` |
| Menu | `@plexui/ui/components/Menu` | Compound: `.Trigger`, `.Content`, `.Item`, `.Separator` |
| Popover | `@plexui/ui/components/Popover` | Compound: `.Trigger`, `.Content`; `showOnHover` |
| Tooltip | `@plexui/ui/components/Tooltip` | Compound: `.Trigger`, `.Content`; `side`, `sideOffset` |
| CopyTooltip | `@plexui/ui/components/CopyTooltip` | `text`, `children` |
| Sidebar | `@plexui/ui/components/Sidebar` | Full compound system — see existing layout code |
| Skeleton | `@plexui/ui/components/Skeleton` | `width`, `height`, `variant` |
| EmptyMessage | `@plexui/ui/components/EmptyMessage` | Compound: `.Icon`, `.Title`, `.Description`, `.ActionRow` |
| Field | `@plexui/ui/components/Field` | `label`, `description`, `size` |
| FieldError | `@plexui/ui/components/FieldError` | `message` |
| ProgressSteps | `@plexui/ui/components/ProgressSteps` | `steps`, `currentStep`, `orientation` |
| TagInput | `@plexui/ui/components/TagInput` | `value`, `onChange`, `placeholder`, `size` |
| TextLink | `@plexui/ui/components/TextLink` | `href`, `color`, `underline` |
| Tabs | `@plexui/ui/components/Tabs` | `value`, `onChange`, `variant`, `size`; `.Tab` sub-component |
| Icon | `@plexui/ui/components/Icon` | 467+ icons: `ArrowRight`, `Search`, `ChevronLeftMd`, etc. |
| CodeBlock | `@plexui/ui/components/CodeBlock` | `children`(string), `language` |
| Markdown | `@plexui/ui/components/Markdown` | Renders markdown with PlexUI styling |
| Image | `@plexui/ui/components/Image` | Enhanced img with loading/error states |

### PlexUI Hooks

All imported from `@plexui/ui/hooks/{hookName}`:

| Hook | Purpose |
|------|---------|
| `useBreakpoint("lg")` | Viewport breakpoint check |
| `useEscCloseStack(isOpen, onClose)` | Escape key handler stack |
| `useIsMounted()` | Client-side mount check |
| `usePrevious(value)` | Previous render value |
| `useScrollable(ref)` | `{ isScrollable, isAtStart, isAtEnd }` |
| `useStableCallback(fn)` | Stable callback identity |

---

## Domain Knowledge

### Core Entities
| Entity | ID Prefix | Key Statuses |
|--------|-----------|-------------|
| Inquiry | `inq_` | created → pending → completed → approved / declined / needs_review |
| Verification | `ver_` | initiated → submitted → passed / failed / requires_retry |
| Report | `rep_` | pending → ready (no_matches / match) |
| Account | `act_` | default → custom statuses |

**Relationships:** Account 1→N Inquiries 1→N Verifications, Reports

### Features We Do NOT Implement
- **Cases** — Persona has a Cases feature. We do NOT implement this.
- **Transactions** — Persona has a Transactions feature. We do NOT implement this. No pages, nav items, types, or references.

### Status Badge Colors
| Status | Color |
|--------|-------|
| Approved / Passed / No Matches | `success` |
| Declined / Failed / Match | `danger` |
| Needs Review / Pending | `warning` |
| Created / Default | `secondary` |

Full entity reference: `reference/persona/data-model.md`

---

## Architecture Patterns

### Page Layout
```
SidebarProvider (collapsible="none")
└── SidebarLayout
    ├── Sidebar (AppSidebar or SettingsSidebar)
    └── SidebarInset (<main> with overflow:auto)
        ├── Navbar (h-[var(--navbar-height)])
        ├── TopBar (sticky top-0 z-10, page title + actions)
        └── Content area
```

**NEVER** nest `<main>` inside SidebarInset.

### Table Page Pattern
```tsx
<div className="flex h-full flex-col overflow-hidden">
  <TopBar title="Inquiries" actions={...} toolbar={...} />
  <div className="flex min-h-0 flex-1 flex-col px-4 pt-2 md:px-6">
    <DataTable data={data} columns={columns} ... />
  </div>
</div>
```

### Settings Form Pattern
```tsx
<div className="flex h-full flex-col overflow-auto">
  <TopBar title="Project settings" />
  <div className="mx-auto w-full max-w-2xl px-4 py-8 md:px-6">
    <SectionHeading size="xs">Details</SectionHeading>
    <Field label="Name" description="...">
      <Input defaultValue="..." />
    </Field>
  </div>
</div>
```

### Detail Page Pattern (with sidebar)
```tsx
<div className="flex h-full flex-col overflow-auto">
  <TopBar title="..." backHref="/..." />
  <div className="flex flex-1">
    <div className="flex-1 px-6 py-8">{/* Tabs + content */}</div>
    <div className="w-80 shrink-0 border-l px-6 py-8">{/* Info sidebar */}</div>
  </div>
</div>
```

---

## Coding Conventions

### File Naming
- Components: PascalCase (`MetricCard.tsx`)
- Hooks: camelCase with `use` prefix (`useIsMobile.ts`)
- Constants: kebab-case (`status-colors.ts`)
- Types: PascalCase in `types/` folder

### Styling
- Tailwind CSS utility classes + PlexUI design tokens (`var(--color-*)`)
- PlexUI typography classes — never raw Tailwind text sizes
- No inline styles except for dynamic values
- Mobile-first responsive approach

### Key Decisions
1. PlexUI for all standard UI — custom only for domain-specific (DataTable, ChartCard, MetricCard)
2. TanStack Table for data tables — headless, PlexUI-styled rendering
3. Recharts for charts
4. Mock data first — JSON fixtures, swap for API later
5. Luxon for dates — PlexUI DatePicker/DateRangePicker use Luxon DateTime
6. No Table component in PlexUI — use TanStack Table v8
