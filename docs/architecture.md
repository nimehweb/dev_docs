# Target architecture

## Goal

Turn DevDocs into one Next.js application that owns its authentication and database access. Supabase must not be required at runtime.

## Target stack

| Area | Choice |
| --- | --- |
| Web application | Next.js App Router with TypeScript |
| UI | React, Tailwind CSS, Lucide, React Hook Form, Markdown rendering |
| Database | PostgreSQL, run locally during development |
| Database access | Drizzle ORM and committed SQL migrations |
| Validation | Zod (one shared schema per input, used by client and server) |
| Authentication | Email/password accounts, application-managed sessions, secure HTTP-only cookies |
| Local database runtime | Docker Compose PostgreSQL service |
| Production deploy | Vercel Hobby (Next.js app) + managed Postgres (Neon, free tier) |

## Boundaries

```text
Browser
  └─ Next.js pages and client UI components
       └─ Server actions / route handlers
            ├─ Authentication and authorization checks
            └─ Drizzle ORM
                 └─ PostgreSQL
```

Database credentials, password hashing, and authorization checks must stay on the server. The browser must never connect to PostgreSQL directly.

## Route map

| Current URL | Target Next.js location | Access |
| --- | --- | --- |
| `/login` | `app/(auth)/login/page.tsx` | Public |
| `/signup` | `app/(auth)/signup/page.tsx` | Public |
| `/dashboard` | `app/(app)/dashboard/page.tsx` | Signed in |
| `/solution` | `app/(app)/solution/page.tsx` | Signed in |
| `/solution/add-new` | `app/(app)/solution/new/page.tsx` | Signed in |
| `/solution/:id` | `app/(app)/solution/[id]/page.tsx` | Signed in |
| `/solution/:id/edit` | `app/(app)/solution/[id]/edit/page.tsx` | Signed in |
| `/favorites` | `app/(app)/favorites/page.tsx` | Signed in |
| `/tags` | `app/(app)/tags/page.tsx` | Signed in |
| `/profile` | `app/(app)/profile/page.tsx` | Signed in |

Route URLs are kept exactly as the legacy app (`/solution` is singular) so existing links and behavior are preserved. The shared solution form components live in `app/(app)/solution/_components/`.

Route redirects must be enforced on the server for signed-in areas; hiding links in the client is not authorization.

## Component guidance

- Prefer Server Components for pages that read data.
- Add `'use client'` only to components that need browser state, effects, event handlers, or `localStorage`.
- Keep the sidebar and shared signed-in layout in `app/(app)/layout.tsx`.
- Keep mutations in server actions or route handlers, then revalidate the affected route.
- Zustand may remain for short-lived client UI state such as a mobile sidebar. It must not be the source of truth for persisted records.

## Decision record

Settled decisions for this migration are recorded in `docs/decisions.md`. Production deploy, user model, data handling, and the Zod dependency are pinned there.

## Routing and data access pattern

- **Reads:** Server Components query Drizzle directly for each signed-in page.
- **Mutations:** Server Actions receive the form, validate, authorize, mutate, then call `revalidatePath()`. Route handlers are reserved for rare non-form postbacks (e.g. a future API) and must use the same auth and validation helpers.
- **Authorization:** the current user id comes only from the server session; every read and mutation is scoped by it. Never trust a user id from a form or URL.
- **New code layout** (lives alongside legacy code until Milestone 5):
  - `src/db/schema.ts`, `src/db/index.ts`, `src/db/migrations/` — Drizzle schema, client, and committed SQL migrations.
  - `src/auth/session.ts`, `src/auth/password.ts`, `src/auth/validation.ts` — session, hashing, input schemas.
  - `src/actions/auth.ts`, `src/actions/solutions.ts`, `src/actions/favorites.ts` — server actions.
  - `app/(app)/layout.tsx` and the pages listed in the route map.

## Authentication details

- Passwords hashed with Argon2id via `password.ts`; never store plaintext.
- Sessions: issue a new token and store only its hash in `sessions.token_hash`; secure, HTTP-only, SameSite cookie; set `expires_at`; **rotate the token on every login** and delete the session row on logout.
- Next.js 15 `cookies()` is **async** — session helpers must `await cookies()`; every signed-in layout/page that reads the session must handle this.
- **Login throttling:** rate-limit before Argon2id verification (per email + IP) to avoid slow-hash denial of service.
- Return safe, generic auth errors; never reveal whether an email exists through a message.

## Validation and types

- **Zod** is the single source of truth for input validation: one shared schema per input (signup, login, solution), used by client forms (via `zodResolver`) and server actions (`safeParse`).
- Derive TypeScript types from the **Drizzle schema** (`schema.ts`); do not hand-write duplicate types in components.

## Theming

- Preserve the current `dark`/`light` class behavior but centralize theme state in a single provider (or `next-themes`) instead of duplicating `localStorage` logic in several components. This prevents a flash of the wrong theme and removes scattered theme code.

## Deploy considerations

- **App:** Vercel Hobby; deploy from the `devdocs-v2` repo. The SPA rewrite in `vercel.json` is removed in Milestone 5.
- **Database:** managed Postgres (Neon free tier) is acceptable — it is a database host only, not a backend-as-a-service. All auth, hashing, sessions, and authorization stay in our own Next.js server code.
- DB credentials/URLs must never reach browser code.
- Fallback if free-tier limits or cold starts are unacceptable: self-hosted VPS (Next.js standalone + Postgres behind a reverse proxy).

## Open questions (to be decided)

- **Markdown / syntax highlighting isolation:** `react-markdown` is server-safe, but `react-syntax-highlighter` is client-only. Plan to isolate the highlighter in a `'use client'` component so the rest stays server-rendered. Confirm exact split during Milestone 4.
- **Testing approach:** no test runner exists yet. Milestone 4 requires authorization checks for cross-user access, so a test runner decision (recommended: Vitest) is needed before then.

## No-Supabase end state

The following current pieces are temporary legacy code and will be removed only after a verified migration:
- `src/lib/supabase.js`
- `src/hooks/useAuth.js`
- `supabase/`
- `@supabase/supabase-js` and `VITE_SUPABASE_*` variables
- Vite configuration, SPA rewrite configuration, and React Router usage
