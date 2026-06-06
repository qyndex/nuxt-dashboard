# Nuxt Dashboard
Analytics dashboard with KPI cards, Chart.js DAU line chart, traffic pie chart, and events table using Nuxt 3 server routes.

## Stack

- **Framework:** Nuxt
- **Language:** TypeScript
- **Database:** Supabase (Postgres + Auth + Storage)
- **Auth:** Supabase Auth
- **Styling:** Vanilla CSS / framework defaults

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env  # then edit and fill in the keys below

# 3. Apply database migrations
npx supabase db reset --local

# 4. Start the dev server
npm run dev

# Run tests
npm run test
```

## Environment variables

| Variable | Required | Description |
|---|---|---|
| `SUPABASE_URL` | no | Supabase project URL (server-side). |
| `SUPABASE_KEY` | yes | Supabase anon key (alias used by some Nuxt templates). |
| `SUPABASE_SERVICE_KEY` | yes | Supabase service-role key (server-only — never expose). |
| `NUXT_PUBLIC_API_BASE` | no | (no description — see .env.example) |
| `NODE_ENV` | no | Node environment (`development` / `production`). |

## Project structure (top 2 levels)

```
components/
  DashSidebar.vue
  DashTopbar.vue
  KpiCard.vue
  NotificationsPanel.vue
composables/
  useAuth.ts
  useDashboard.ts
  useNotifications.ts
  useTasks.ts
middleware/
  auth.ts
pages/
  auth/
  index.vue
  tasks.vue
server/
  api/
  utils/
supabase/
  migrations/
  seed.sql
tests/
  e2e/
  unit/
types/
  database.ts
CLAUDE.md
CONTRIBUTING.md
Dockerfile
LICENSE
README.md
app.vue
docker-compose.yml
eslint.config.mjs
nuxt.config.ts
package.json
playwright.config.ts
tsconfig.json
vitest.config.ts
```

## Routes / pages

- `/auth/login`
- `/auth/signup`
- `/`
- `/tasks`
- `/api/dashboard.get`
- `/api/metrics.get`
- `/api/notifications/[id].patch`
- `/api/notifications/index.get`
- `/api/notifications/read-all.post`
- `/api/tasks/[id].delete`
- `/api/tasks/[id].put`
- `/api/tasks/index.get`
- `/api/tasks/index.post`

## Database schema

Tables defined in migrations:

- `profiles`
- `metrics`
- `tasks`
- `notifications`

## Tests

- Unit / integration: `npm run test`
- End-to-end (Playwright): `npm run test:e2e`

## Deploy

This template ships a `Dockerfile` and `docker-compose.yml`. For local end-to-end runs use `docker compose up --build`; for image-based deploys build with `docker build -t <name> .` and ship to your registry.

## Customising for your build

When you ask Qyngent to build on top of this template, mention:

- **Brand & product name** — replace any placeholder copy in this template.
- **Color scheme & typography** — drives Tailwind tokens / theme files.
- **Features beyond the baseline** — this template already ships:
  - Supabase Auth
  - 4 database table(s) (profiles, metrics, tasks, notifications)
  - 13 route(s) / screen(s)
- **Integrations** — list any third-party APIs you want wired in.
- **Deployment target** — Qyngent defaults to its hosted platform; tell us if you need a specific cloud.

Built with [Qyngent](https://qyngent.com) — autonomous app generation that uses this template as a starting point.
