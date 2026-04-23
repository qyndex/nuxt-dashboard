# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Nuxt Dashboard -- Analytics dashboard with KPI cards, task management, and notifications backed by Supabase (PostgreSQL + Auth + RLS).

Built with Nuxt 3, Vue 3, TypeScript, and Supabase.

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

# Database
npm run db:migrate       # Apply Supabase migrations
npm run db:seed          # Seed database
npm run db:reset         # Reset + re-seed database
```

## Architecture

- `pages/` -- File-based routing (`.vue` files)
  - `pages/auth/` -- Login and signup pages
  - `pages/index.vue` -- Dashboard overview (protected, requires auth)
  - `pages/tasks.vue` -- Task management with CRUD (protected)
- `components/` -- Auto-imported Vue components
  - `DashSidebar` -- Navigation sidebar with sign-out
  - `DashTopbar` -- Top bar with notifications bell + panel
  - `KpiCard` -- Metric display card
  - `NotificationsPanel` -- Dropdown notification list with mark-as-read
- `composables/` -- Vue composables (auto-imported)
  - `useAuth` -- Supabase Auth (login, signup, logout, session, authFetch)
  - `useDashboard` -- Metrics fetching via authenticated API
  - `useTasks` -- Task CRUD with filtering
  - `useNotifications` -- Notification list with mark-as-read
- `server/api/` -- Nitro server routes
  - `metrics.get.ts` -- Dashboard KPIs + historical data
  - `tasks/index.get.ts` -- List tasks (filterable by status/priority)
  - `tasks/index.post.ts` -- Create task
  - `tasks/[id].put.ts` -- Update task
  - `tasks/[id].delete.ts` -- Delete task
  - `notifications/index.get.ts` -- List user notifications
  - `notifications/[id].patch.ts` -- Mark notification as read
  - `notifications/read-all.post.ts` -- Mark all notifications as read
  - `dashboard.get.ts` -- Legacy endpoint (backward compat)
- `server/utils/supabase.ts` -- Supabase client helpers (server/user/auth)
- `middleware/auth.ts` -- Route guard for protected pages
- `types/database.ts` -- Shared TypeScript types matching DB schema
- `supabase/migrations/` -- Database schema (profiles, metrics, tasks, notifications + RLS)
- `supabase/seed.sql` -- Seed data (3 users, 12mo metrics, 8 tasks, 5 notifications)
- `tests/unit/` -- Vitest unit tests
- `tests/e2e/` -- Playwright E2E tests

## Database

- **Supabase PostgreSQL** with Row Level Security (RLS)
- Tables: `profiles`, `metrics`, `tasks`, `notifications`
- Metrics readable by authenticated users; tasks readable by all authenticated, writable by assignee/admin
- Notifications scoped to owning user
- Triggers: auto-create profile on signup, auto-update `updated_at` on tasks

## Auth

- Supabase Auth (email/password)
- Client-side: `useAuth()` composable manages session state
- Server-side: `requireAuth(event)` extracts user from Authorization header
- Protected routes use `definePageMeta({ middleware: 'auth' })`
- Auth pages (`/auth/login`, `/auth/signup`) render without the dashboard shell

## API Response Envelopes

- Metrics endpoint returns `{ kpis: [...], revenueHistory: [...], userHistory: [...] }`
- Task list returns `{ tasks: [...], total }`
- Notification list returns `{ notifications: [...], unread_count }`
- Mutations return the created/updated object directly

## Environment Variables

Copy `.env.example` to `.env.local` and fill in values before running locally.

| Variable | Description |
|---|---|
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_KEY` | Supabase anon (public) key |
| `SUPABASE_SERVICE_KEY` | Supabase service role key (server-only) |
| `NUXT_PUBLIC_API_BASE` | Public base URL for API calls (default `/api`) |

## Testing Conventions

- Unit tests live in `tests/unit/*.spec.ts` and use `mountSuspended` from `@nuxt/test-utils/runtime`
- E2E tests live in `tests/e2e/*.spec.ts` and target `http://localhost:3000`
- Vitest config: `vitest.config.ts` (environment: `nuxt`, DOM: `happy-dom`)
- Playwright config: `playwright.config.ts`
- Coverage threshold: 80% lines/functions on `components/`, `composables/`, `server/`
- Mock `useAuth` and `useNotifications` in component tests with `vi.stubGlobal`

## Rules

- Use Composition API (`<script setup>`) -- no Options API
- TypeScript strict mode -- no `any` types
- Auto-imports for components, composables, and utils
- Use `authFetch` from `useAuth()` for authenticated API calls
- Server routes use `defineEventHandler` with proper error handling via `createError`
- All authenticated API calls pass `Authorization: Bearer <token>` header
- Database types in `types/database.ts` must match migration schema
- ARIA labels required on all interactive elements
- Error + loading states required on every data-fetching page/component
- All shared TypeScript interfaces live in `types/database.ts`
