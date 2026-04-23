# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Nuxt Dashboard — Analytics dashboard with KPI cards, Chart.js DAU line chart, traffic pie chart, and events table using Nuxt 3 server routes.

Built with Nuxt 3, Vue 3, TypeScript, and Chart.js.

## Commands

```bash
npm install              # Install dependencies
npm run dev              # Start dev server (http://localhost:3000)
npm run build            # Production build
npm run preview          # Preview production build
npm run typecheck        # Type check via nuxi typecheck
npm run lint             # ESLint
npm run format           # Prettier

# Testing
npm run test             # Run unit tests (vitest)
npm run test:watch       # Unit tests in watch mode
npm run test:coverage    # Unit tests with v8 coverage report
npm run test:e2e         # Playwright E2E (requires dev server on :3000)
npm run test:e2e:ui      # Playwright interactive UI mode
```

## Architecture

- `pages/` — File-based routing (`.vue` files)
- `components/` — Auto-imported Vue components (`DashSidebar`, `DashTopbar`, `KpiCard`)
- `composables/` — Vue composables (auto-imported); `useDashboard` wraps `useLazyFetch`
- `server/api/` — Nitro server routes; `dashboard.get.ts` exports all shared TypeScript interfaces
- `layouts/` — Page layouts
- `public/` — Static assets
- `tests/unit/` — Vitest unit tests (`@nuxt/test-utils` + `happy-dom`)
- `tests/e2e/` — Playwright E2E tests (baseURL `http://localhost:3000`)

## Environment Variables

Copy `.env.example` to `.env.local` and fill in values before running locally.

| Variable | Description |
|---|---|
| `NUXT_API_SECRET` | Server-only API secret |
| `NUXT_PUBLIC_API_BASE` | Public base URL for API calls (default `/api`) |

## Testing Conventions

- Unit tests live in `tests/unit/*.spec.ts` and use `mountSuspended` from `@nuxt/test-utils/runtime`
- E2E tests live in `tests/e2e/*.spec.ts` and target `http://localhost:3000`
- Vitest config: `vitest.config.ts` (environment: `nuxt`, DOM: `happy-dom`)
- Playwright config: `playwright.config.ts`
- Coverage threshold: 80% lines/functions on `components/`, `composables/`, `server/`

## Rules

- Use Composition API (`<script setup>`) — no Options API
- TypeScript strict mode
- Auto-imports for components, composables, and utils
- Use `useFetch` / `useLazyFetch` / `useAsyncData` for data fetching
- All shared TypeScript interfaces are exported from `server/api/dashboard.get.ts`
- ARIA labels required on all interactive elements
- Error + loading states required on every data-fetching page/component
