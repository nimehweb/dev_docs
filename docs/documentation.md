# Implementation log

This file is a running, detailed log of what was done in each milestone, why, the files touched, the commands run, and any remaining risks. It is meant to make the migration easier to understand and debug.

Rules for this log:
- Append a new section at each completed milestone.
- One entry per milestone. Keep the "why" and "how to verify" alongside the "what".
- If a decision or scope changes, note it here.

---

## Milestone 0 — Preserve and assess (`complete`)

### Goal
Create a safe baseline and record settled decisions so later milestones can proceed and be debugged against a written record. No source code was to be changed.

### Decisions recorded (see `docs/decisions.md` for full detail)
- **Multi-user** app: per-account signup/login; solutions and favorites scoped to the signed-in user.
- **Discard** existing Supabase data: start with a fresh local database; no export/import.
- **Local Postgres via Docker Compose**; developer will install Docker Desktop.
- **Production deploy**: Vercel Hobby + Neon Postgres (free tier), with self-hosted VPS as fallback.
- **Architecture scope**: adopt sections A (routing/data), B (auth hardening), C (Zod), D (theming), F (deploy). Sections E (markdown client component) and G (tests) kept as "to be decided" notes.
- **New dependency approved:** Zod (shared client/server validation, added in Milestone 3).
- **Branch:** `devdocs-v2`.

### Files
| File | Status | Reason |
| --- | --- | --- |
| `docs/decisions.md` | added | Records decisions + environment facts for traceability. |
| `docs/documentation.md` | added | This log itself. |
| `docs/migration-plan.md` | updated | Milestone 0 ticked and marked `complete`; baseline set. |
| `docs/architecture.md` | updated | Added the approved guidance sections and "to be decided" notes. |

### Environment notes
- Node `v24.18.1`, npm `12.0.2`, git `2.55.0.windows.3`; Docker Desktop not yet installed.
- The current Vite app is **not runnable** without local Supabase env vars (absent); this is expected and resolved in later milestones.
- Windows real-time antivirus intermittently blocked Git local ref writes during branch creation; developer created `devdocs-v2` manually. Not a repo issue.

### Commands run
- `git checkout -b devdocs-v2` (run by developer) — branch created.
- `git branch --show-current` → `devdocs-v2` (verified).
- `git status --short` → `?? docs/` (only docs untracked; app source untouched).

### Verification
- On branch `devdocs-v2`.
- Only `docs/` differs from `main`; no `src/`, `supabase/`, config, or package changes.
- Docs render and are internally consistent.

### Remaining risks
- Docker Desktop must be installed before Milestone 2 (local database).
- Production database choice (Neon) still assumed free-tier-friendly and not yet exercised.

### Next step
- Milestone 1 — Next.js shell (migrate framework and routing while preserving the UI).

---

## Milestone 1 — Next.js shell (`complete`)

### Goal
Stand up the Next.js App Router + TypeScript alongside the untouched Vite app, and make every existing screen render in Next using placeholder data only. No Supabase/Vite code was removed.

### Files
| File | Status | Reason |
| --- | --- | --- |
| `package.json` / `package-lock.json` | changed | Added `next@16.3.0`, `typescript@5`, `@types/node`, `@tailwindcss/postcss`, `@types/react-syntax-highlighter`; added `dev:next`/`build:next`/`start:next` scripts; approved native install scripts (esbuild, tailwind oxide). |
| `next.config.ts` | added | Minimal Next config; TypeScript checks enabled. |
| `tsconfig.json` | added | Strict TS for `src/app`; Next set `jsx: react-jsx`. |
| `postcss.config.mjs` | added | Tailwind 4 via `@tailwindcss/postcss`. |
| `src/app/globals.css` | added | Mirrors legacy `src/index.css` (same dark variant) + typography plugin. |
| `src/app/layout.tsx` | added | Root layout (imports globals). |
| `src/app/page.tsx` | added | Redirects `/` → `/login`. |
| `src/app/(auth)/layout.tsx` | added | Public auth layout. |
| `src/app/(auth)/login/page.tsx`, `(auth)/signup/page.tsx` | added | Login/Signup UI preserved; forms are shells (submit stubbed until Milestone 3). |
| `src/app/(app)/layout.tsx` | added | Signed-in chrome (header, sidebar, mobile drawer, central theme toggle, stub logout). |
| `src/app/(app)/dashboard/page.tsx` | added | Dashboard UI, empty placeholder data. |
| `src/app/(app)/solution/page.tsx` + `SolutionsListContent.tsx` | added | Solutions list UI + filters, empty placeholder data. |
| `src/app/(app)/tags/page.tsx` | added | Tags UI, empty placeholder data. |
| `src/app/(app)/favorites/page.tsx` | added | Favorites UI, empty placeholder data. |
| `src/app/(app)/profile/page.tsx` | added | Profile UI (theme toggle synced to shared `theme` key), empty placeholder data. |
| `src/app/(app)/solution/new/page.tsx` | added | Add Solution form shell. |
| `src/app/(app)/solution/[id]/page.tsx` | added | Solution detail UI with a hardcoded sample solution so the screen renders. |
| `src/app/(app)/solution/[id]/edit/page.tsx` | added | Edit Solution form shell (placeholder values). |
| `src/app/(app)/solution/_components/*` | added | Shared form sub-components (BasicInfo, ProblemsAndSolutions, AddTags, CodeSnippets) + MarkdownRenderer + CodeSnippet (isolates `react-syntax-highlighter` in a client component). |
| `src/pages/` → `src/legacy/` | renamed | Next 16 auto-detects a folder named `pages` as the Pages Router; renamed to keep Vite working and stop Next from compiling legacy routes. Imports in `src/App.jsx` and `src/components/MainContent.jsx` updated (11 lines). |
| `.gitignore` | changed | Added `.next/`. |

### Decisions during work
- Legacy `src/pages` renamed to `src/legacy` (allowed under rule 1 — nothing deleted, imports updated, both apps still build).
- Route URLs kept identical to legacy (`/solution` singular) — recorded in `docs/architecture.md`.
- Theme state centralized in the app layout; Profile's toggle reads/writes the same `theme` key.

### Commands run
- `npm run build:next` → exit 0 (all routes: `/`, `/login`, `/signup`, `/dashboard`, `/solution`, `/solution/new`, `/solution/[id]`, `/solution/[id]/edit`, `/tags`, `/favorites`, `/profile`).
- `npm run build` (Vite) → exit 0, output unchanged (CSS asset byte-identical).
- Smoke test: `next start` + request to `/solution/abc` → HTTP 200, SSR content present (markdown + code highlighting render without errors).

### Remaining risks
- Forms and mutations are stubbed/no-op (auth + Postgres come in Milestones 2–4).
- Signed-in routes are not yet protected server-side (Milestone 3).
- No tests exist yet (test decision pending).
- Docker Desktop still required for Milestone 2.

### Next step
- Milestone 2 — local database (Docker Compose PostgreSQL, Drizzle schema, migrations).

---

## Milestone 2 — Database (`complete`)

### Goal
Have a working PostgreSQL database and the Drizzle schema/migration so Milestones 3–4 can use it.

### Decision: Neon for dev (+ prod)
The onboarding plan originally used Docker Compose + a local PostgreSQL container. Given laptop space constraints (Docker Desktop needs ~3–10 GB via its WSL2 VM) and that Neon is already the chosen production database, **Neon serverless Postgres now serves as the local dev database too** — zero disk/install and one kind of connection for dev and prod. `docker-compose.yml` was removed.

### Files
| File | Status | Reason |
| --- | --- | --- |
| `docker-compose.yml` | deleted | Replaced by the Neon approach. |
| `.env` | changed | `DATABASE_URL` now points at the Neon connection string (git-ignored). |
| `.env.example` | changed | Committed template: how to get the Neon URL. |
| `drizzle.config.ts` | added | `drizzle-kit` config: schema `src/db/schema.ts`, output `src/db/migrations`, postgres dialect. |
| `src/db/schema.ts` | added | Drizzle tables `users`, `sessions`, `solutions`, `favorites` matching `docs/schema.md` exactly (composite PK + indexes, cascading FKs, `status`/`difficulty` check constraints, unique `email` and `token_hash`). |
| `src/db/index.ts` | added | Drizzle client (postgres-js driver), reads `DATABASE_URL`. |
| `src/db/migrations/0000_natural_ozymandias.sql` | added | Generated initial migration, reviewed line-by-line against `docs/schema.md`. |
| `package.json` | changed | Added `drizzle-orm`, `drizzle-kit` (dev), `postgres` (driver), and `db:generate`/`db:migrate` scripts. |

### Commands run
- `npm run build` (Vite) → exit 0; `npm run build:next` → exit 0; `npx tsc --noEmit` → exit 0.
- `npx drizzle-kit generate` → exit 0; produced `0000_natural_ozymandias.sql`.
- `npx drizzle-kit migrate` (via Drizzle migrator API) → applied to Neon.

### Decisions during work
- Used `postgres` (postgres.js) as the Drizzle driver locally; production (Neon) will use a serverless driver in Milestone 5.
- npm's `allowScripts` holds one esbuild version at a time; Vite's `esbuild@0.25.9` is approved and the Vite build was re-verified after installing drizzle-kit's esbuild.
- The Neon database already contained the legacy schema (`users`/`solutions`/`user_favorites`/`_prisma_migrations`, from the old app). Per the "discard legacy data" decision these were dropped before applying the fresh schema. The stray `drizzle` journal left by the first (failed) migrate run was dropped too.
- `drizzle-kit migrate` reported exit 1 with no message when the target tables already existed; running it via the Drizzle migrator API surfaced the real error (`relation "solutions" already exists`).

### Environment notes
- The laptop's configured DNS resolver intermittently fails (even `neon.tech` → "DNS server failure"); retries succeed. Not blocking, but worth fixing if connections get flaky.

### Result
Applied `0000_natural_ozymandias.sql` to Neon. Verified: `favorites`, `sessions`, `solutions`, `users` (all UUID PKs, timestamptz defaults), check constraints `solutions_status_check`/`solutions_difficulty_check`, indexes (`users_email_unique`, `sessions_token_hash_unique`, `sessions_user_id_idx`, `sessions_expires_at_idx`, `solutions_user_id_created_at_idx`, `favorites_user_id_idx`, `favorites_solution_id_idx`), composite PK `favorites_user_id_solution_id_pk`, and journal row in `drizzle.__drizzle_migrations`.

### Next step
- Milestone 3 — authentication (signup, login, logout, session helpers, server-side route protection, validation, secure cookies, password hashing, expiry, basic throttling).