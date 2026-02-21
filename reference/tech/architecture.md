# Technical Architecture — Folio App

## Project Name: Folio
KYC/Identity Verification Analytics Dashboard

---

## Technology Stack

### Core
| Layer | Technology | Rationale |
|-------|-----------|-----------|
| **Framework** | Next.js 15+ (App Router) | SSR, file-based routing, API routes, same as PlexUI docs |
| **UI Library** | @plexui/ui | 35 components, 9-size scale, Radix primitives, dark mode |
| **Styling** | Tailwind CSS 4 | Design tokens, utility-first, consistent with PlexUI |
| **Language** | TypeScript 5 | Type safety, better DX |
| **React** | React 19 | Latest concurrent features |

### Data & State
| Layer | Technology | Rationale |
|-------|-----------|-----------|
| **Data Fetching** | TanStack Query (React Query) v5 | Caching, refetching, optimistic updates, SSR support |
| **State Management** | Zustand | Lightweight, simple store for UI state |
| **API Client** | Fetch API / ofetch | Built-in, no extra deps |

### Charts & Visualization
| Layer | Technology | Rationale |
|-------|-----------|-----------|
| **Charts** | Recharts | Most popular React charts, composable, customizable |
| **Alternative** | Tremor | Pre-built dashboard components (consider if speed > customization) |

### Tables
| Layer | Technology | Rationale |
|-------|-----------|-----------|
| **Tables** | TanStack Table v8 | Headless, sorting, filtering, pagination, column management |

### Additional
| Layer | Technology | Rationale |
|-------|-----------|-----------|
| **Icons** | Lucide React | Already in PlexUI deps, 1000+ icons |
| **Dates** | Luxon / date-fns | Already in PlexUI deps (Luxon for DatePicker) |
| **Forms** | React Hook Form + Zod | Validation, performance |
| **Maps** | Mapbox GL / Leaflet | For geolocation display (optional) |

---

## Project Structure

```
folio-ip/
├── reference/           # Reference docs (this folder)
│   ├── persona/         # Persona data model, dashboard sections
│   ├── design/          # Design tokens, UI patterns
│   └── tech/            # Architecture, API specs
├── src/
│   ├── app/             # Next.js App Router pages
│   │   ├── layout.tsx   # Root layout with Sidebar
│   │   ├── page.tsx     # Dashboard home / Overview
│   │   ├── inquiries/
│   │   │   ├── page.tsx           # Inquiries list
│   │   │   └── [id]/
│   │   │       └── page.tsx       # Inquiry detail
│   │   ├── verifications/
│   │   │   ├── page.tsx           # Verifications list
│   │   │   └── [id]/page.tsx
│   │   ├── reports/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── accounts/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── analytics/
│   │   │   └── page.tsx           # Analytics overview
│   │   └── settings/
│   │       └── page.tsx
│   ├── components/
│   │   ├── layout/       # Sidebar, TopBar, PageHeader
│   │   ├── shared/       # StatusBadge, DataTable, MetricCard
│   │   ├── charts/       # LineChart, FunnelChart, PieChart
│   │   ├── inquiry/      # Inquiry-specific components
│   │   ├── verification/ # Verification-specific components
│   │   └── account/      # Account-specific components
│   ├── lib/
│   │   ├── api/          # API client, endpoints
│   │   ├── hooks/        # Custom hooks (useInquiries, etc.)
│   │   ├── stores/       # Zustand stores
│   │   ├── types/        # TypeScript types/interfaces
│   │   └── utils/        # Helpers, formatters
│   └── styles/
│       └── globals.css   # PlexUI tokens + custom tokens
├── public/
├── CLAUDE.md             # Project context for Claude
├── AGENTS.md             # Agent instructions
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.mjs
```

---

## Key Pages

### 1. Dashboard Home (`/`)
- Overview metrics cards (Total Inquiries, Success Rate, Avg Time, etc.)
- Recent inquiries table (last 10)
- Charts: Inquiries trend, Status distribution
- Quick actions

### 2. Inquiries List (`/inquiries`)
- Filterable/sortable data table
- Search, date range, status filter
- Status badges
- Pagination

### 3. Inquiry Detail (`/inquiries/[id]`)
- Tabs: Overview, Verifications, Reports, Timeline
- Photo gallery (document + selfie)
- Extracted data
- Check results
- Info sidebar

### 4. Analytics (`/analytics`)
- Funnel: Created → Started → Completed → Approved
- Time series: Daily inquiries
- Success/failure rates
- Avg completion time
- Geographic distribution
- Device breakdown

### 5. Verifications (`/verifications`)
- List with type, status, date
- Detail view with checks breakdown

### 6. Reports (`/reports`)
- Watchlist + PEP reports list
- Match/no-match status

### 7. Accounts (`/accounts`)
- User profiles
- Linked inquiries/verifications

---

## API Contract (Expected)

Server will provide data in a format we define. Suggested endpoints:

```
GET /api/inquiries               — List with pagination, filters
GET /api/inquiries/:id           — Detail with verifications, reports
GET /api/inquiries/analytics     — Aggregated metrics

GET /api/verifications           — List
GET /api/verifications/:id       — Detail with checks

GET /api/reports                 — List
GET /api/reports/:id             — Detail

GET /api/accounts                — List
GET /api/accounts/:id            — Detail with linked entities

GET /api/analytics/overview      — Dashboard metrics
GET /api/analytics/funnel        — Funnel data
GET /api/analytics/timeseries    — Chart data
```

---

## Mock Data Strategy

For development, use:
1. **JSON fixtures** — Static mock data files matching API contract
2. **MSW (Mock Service Worker)** — Intercept fetch calls, return mock data
3. **Faker.js** — Generate realistic test data at scale

---

## Performance Considerations

- Server Components for initial page loads
- Client Components for interactive parts (tables, charts, filters)
- React Query for client-side data caching
- Streaming SSR for large data sets
- Virtualized tables for 1000+ rows (TanStack Virtual)
