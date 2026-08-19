# Migration decisions

Recorded during Milestone 0 ("Preserve and assess"). These are settled decisions that later milestones reference. If a decision changes, update this file and note the change in `docs/documentation.md`.

## Product / data

| Decision | Value | Notes |
| --- | --- | --- |
| User model | Multi-user | Keep per-account signup/login; scope solutions and favorites to the signed-in user. |
| Existing Supabase data | Discard | Start with a fresh local database. No data to export or import. |
| User mapping | N/A | No existing users/solutions to re-map. New accounts only. |

## Runtime / infrastructure

| Decision | Value | Notes |
| --- | --- | --- |
| Local PostgreSQL | Docker Compose | Developer to install Docker Desktop (not yet installed). |
| Production deploy | Vercel Hobby + Neon Postgres (free tier) | Vercel Hobby for the Next.js app; Neon free for Postgres. Fallback: self-hosted VPS. |
| Backend-as-a-service | Not allowed | Supabase, Firebase, Clerk, or similar must not be reintroduced for auth or data. Managed Postgres hosting (Neon) is a database host only and is acceptable. |

## Architecture / code

| Decision | Value | Notes |
| --- | --- | --- |
| Data access | Server Components for reads + Server Actions for mutations | Route handlers reserved for rare non-form postbacks; then `revalidatePath()`. |
| Validation | Zod | Single shared schema per input used by both client and server (added in Milestone 3). |
| Session handling | Secure HTTP-only, SameSite cookies; hashed session token in DB; session rotation on login; expire sessions | See authentication requirements. |
| Theming | Centralize into a provider using the existing `dark` class | Preserves current behavior; avoids flash of wrong theme and duplicated logic. |
| Markdown / syntax highlighting | `react-markdown` server-safe; highlighter (`react-syntax-highlighter`) isolated in a `'use client'` component | See note in `architecture.md` Section E. |
| Testing | To be decided | Milestone 4 requires authorization checks; a test runner decision is still pending. |

## Repository

| Decision | Value |
| --- | --- |
| Migration branch | `devdocs-v2` |
| Documentation approach | `docs/documentation.md` is a running, detailed log updated each completed milestone. |

## Environment facts (recorded at Milestone 0)

- Node.js: `v24.18.1`
- npm: `12.0.2`
- Git: `2.55.0.windows.3`
- Docker Desktop: not installed (to be installed by developer)
- Local `.env`: not present; `src/lib/supabase.js` throws if `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` are missing, so the current Vite app is not runnable in this checkout until a replacement is in place.
- Working tree at Milestone 0: branch `docs/` untracked; app source unchanged.