# Folio

KYC / Identity Verification analytics dashboard built with Next.js 16, PlexUI, and Tailwind CSS 4.

## Tech Stack

- **Framework** — [Next.js 16](https://nextjs.org/) (App Router)
- **UI** — [@plexui/ui](https://plexui.com/docs)
- **Styling** — [Tailwind CSS 4](https://tailwindcss.com/)
- **Tables** — [TanStack Table v8](https://tanstack.com/table)
- **Charts** — [Recharts](https://recharts.org/)
- **State** — [Zustand](https://zustand.docs.pmnd.rs/)
- **Dates** — [Luxon](https://moment.github.io/luxon/)
- **Tests** — [Vitest](https://vitest.dev/) + Testing Library

## Getting Started

```bash
npm install
npm run dev
```

App runs at [http://localhost:3100](http://localhost:3100).

## AI Chat (Inquiry Template Editor)

Set your Groq key in `.env.local`:

```bash
GROQ_API_KEY=your_key_here
# optional: override model
# GROQ_MODEL=llama-3.1-8b-instant
```

Or configure it in UI at `/settings/api-keys` via **Create new key** modal.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (port 3100) |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | TypeScript type check |
| `npm run test` | Run tests |
| `npm run test:watch` | Run tests in watch mode |

## Project Structure

```
src/
├── app/                # Next.js App Router pages
│   ├── accounts/       # Accounts management
│   ├── analytics/      # Analytics dashboard
│   ├── inquiries/      # KYC inquiries
│   ├── reports/        # Reports
│   ├── settings/       # App settings
│   ├── templates/      # Inquiry templates
│   └── verifications/  # Identity verifications
├── components/         # React components
│   └── shared/         # Reusable shared components
└── lib/                # Utilities, hooks, constants
```
