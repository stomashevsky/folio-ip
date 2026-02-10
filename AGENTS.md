# Agents Configuration — Folio App

## Project Context

Building a KYC Analytics Dashboard (Folio) using Next.js 16 + PlexUI + Tailwind CSS 4.
Dev server runs on port 3100.

## UI Kit Reference

The PlexUI component library is at `/Users/sergey/github/plexui-docs/packages/ui/src/components/`.
Documentation site: `/Users/sergey/github/plexui-docs/content/docs/`.
PlexUI AGENTS.md: `/Users/sergey/github/plexui-docs/AGENTS.md` — read this for full component inventory, patterns, and development guide.

### PlexUI Integration (CRITICAL)

**CSS imports in globals.css — import ONLY token files, NOT the full bundle:**
```css
@import "../../node_modules/@plexui/ui/dist/es/styles/variables-primitive.css";
@import "../../node_modules/@plexui/ui/dist/es/styles/variables-semantic.css";
@import "../../node_modules/@plexui/ui/dist/es/styles/variables-components.css";
```
Do NOT use `@import "@plexui/ui/css"` — it conflicts with Tailwind's theme setup.

**Component imports — use deep path imports:**
```tsx
import { Button } from "@plexui/ui/components/Button";
import { Badge } from "@plexui/ui/components/Badge";
import { Sidebar, SidebarProvider, SidebarInset } from "@plexui/ui/components/Sidebar";
import { Select } from "@plexui/ui/components/Select";
import { Input } from "@plexui/ui/components/Input";
import { Skeleton } from "@plexui/ui/components/Skeleton";
import { PlexUIProvider } from "@plexui/ui/components/PlexUIProvider";
```

**Button requires `color` prop** (it's mandatory):
```tsx
<Button color="primary" variant="solid">Primary</Button>
<Button color="secondary" variant="ghost">Ghost</Button>
<Button color="danger" variant="outline">Delete</Button>
```

**Theme syncing:**
- next-themes uses `attribute="class"` → adds `light`/`dark` class to `<html>`
- PlexUI tokens use `:where([data-theme])` selectors + CSS `light-dark()` function
- `ThemeSync` component bridges the gap by setting `data-theme` attribute from next-themes

**Component patterns in PlexUI:**
- All components have `"use client"` directive
- Use `data-*` attributes for variant switching (not className concatenation)
- CSS Modules (`.module.css`) for scoped styles
- `forwardRef` on most components
- Radix UI primitives for accessibility

### Available PlexUI Components (36)
Alert, Avatar, AvatarGroup, Badge, Button, ButtonLink, Checkbox, CodeBlock, CopyTooltip, DatePicker, DateRangePicker, EmptyMessage, FieldError, FloatingLabelInput, Icon, Image, Indicators, Input, Markdown, Menu, PlexUIProvider, Popover, ProgressSteps, RadioGroup, SegmentedControl, Select, SelectControl, ShimmerText, Sidebar, Skeleton, Slider, Switch, TagInput, TextLink, Textarea, Tooltip, Transition, UIProvider.

**No Table component in PlexUI** — use TanStack Table v8 with custom styling.

### PlexUI Design Tokens
- 9-step size scale: 3xs (22px) through 3xl (48px), default md (32px)
- 8 semantic colors: primary, secondary, danger, success, warning, caution, discovery, info
- Each with variants: soft, solid, outline, ghost, surface
- Light/dark via CSS `light-dark()` function + `data-theme` attribute
- 4-level elevation system
- Radius scale: 2xs (2px) → full (9999px)

### Using PlexUI Design Tokens in Custom Components
```tsx
// Use CSS custom properties for PlexUI tokens
<div className="text-[var(--color-text)] bg-[var(--color-surface)]">
  <span className="text-[var(--color-text-secondary)]">Label</span>
  <div className="border border-[var(--color-border)]">Card</div>
</div>

// Semantic color tokens
"text-[var(--color-success-solid-bg)]"  // green
"text-[var(--color-danger-solid-bg)]"   // red
"bg-[var(--color-primary-soft-bg)]"     // primary soft background
"text-[var(--color-caution-soft-text)]" // warning text
```

## Domain Knowledge

### Persona Data Model
Read `reference/persona/data-model.md` for full entity reference.
Core entities: Inquiry (inq_), Verification (ver_), Report (rep_), Account (act_), Transaction (txn_).

### Dashboard Sections
Read `reference/persona/dashboard-sections.md` for navigation structure and view patterns.

### UI Patterns
Read `reference/design/ui-patterns.md` for layout patterns, component patterns, colors, typography.

### Technical Architecture
Read `reference/tech/architecture.md` for project structure, tech stack decisions, API contract.

### Implementation Plan
Read `reference/tech/implementation-plan.md` for phased implementation plan.

### OpenAI Design Reference
Read `reference/openai-design-reference.md` for OpenAI design system reference.

## Coding Conventions

### File Naming
- Components: PascalCase (e.g., `MetricCard.tsx`, `DataTable.tsx`)
- Hooks: camelCase with `use` prefix (e.g., `useInquiries.ts`)
- Types: PascalCase in `types/` folder (e.g., `inquiry.ts`)
- Utils: camelCase (e.g., `formatDate.ts`)

### Component Pattern
```tsx
"use client"; // only if needed (state, effects, event handlers)

import { Badge } from "@plexui/ui/components/Badge";

interface MetricCardProps {
  label: string;
  value: string | number;
  trend?: { value: number; direction: "up" | "down" };
}

export function MetricCard({ label, value, trend }: MetricCardProps) {
  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
      <p className="text-xs font-medium text-[var(--color-text-secondary)]">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-[var(--color-text)]">{value}</p>
    </div>
  );
}
```

### TypeScript Types
All API entities must have TypeScript interfaces in `src/lib/types/`.

### Styling
- Use Tailwind CSS utility classes
- Use PlexUI design tokens via CSS custom properties: `var(--color-*)`
- No inline styles except for dynamic values
- Responsive: mobile-first approach

## Key Decisions

1. **Server Components by default** — Use Client Components only when needed for interactivity
2. **PlexUI for all standard UI** — Buttons, badges, inputs, sidebar, etc.
3. **Custom components for domain-specific** — MetricCard, DataTable, ChartCard
4. **TanStack Table for data tables** — Headless, with custom PlexUI-style rendering
5. **Recharts for charts** — Wrapped in custom ChartCard components
6. **Mock data first** — Build UI with JSON fixtures, swap for API later
7. **Feature-based organization** — Components grouped by feature (inquiry/, verification/, etc.)
8. **Providers hierarchy** — ThemeProvider → ThemeSync → PlexUIProvider → QueryProvider
