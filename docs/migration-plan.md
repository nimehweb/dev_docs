# Migration plan

Status key: `not started` · `in progress` · `complete`

## 0. Preserve and assess — complete

- [x] Export or intentionally discard Supabase data (decided: discard; fresh database).
- [x] Record the Node.js version and current deploy configuration (see `docs/decisions.md`).
- [x] Confirm whether DevDocs is single-user or supports multiple accounts (decided: multi-user).
- [x] Create a migration branch (`devdocs-v2`).

**Done when:** there is a safe data decision and the existing project remains runnable.

## 1. Next.js shell — complete

- [x] Create the Next.js App Router and TypeScript configuration.
- [x] Migrate global CSS, Tailwind configuration, and static assets into the Next app (`src/app/globals.css`, PostCSS with Tailwind 4).
- [x] Migrate public pages and the signed-in layout without changing product behavior.
- [x] Replace React Router links and routes with Next.js routing.

**Notes:** the legacy `src/pages` folder was renamed to `src/legacy` so Next 16 does not treat it as the Pages Router; all screens render in Next using placeholder data only.

**Done when:** all existing screens render in Next.js using placeholder or legacy data only.

## 2. Local database — in progress

- [x] Add local PostgreSQL startup instructions and Docker Compose.
- [x] Add Drizzle configuration, the schema from `docs/schema.md`, and an initial migration.
- [ ] Apply the migration to a fresh local database.

**Notes:** `docker-compose.yml` (PostgreSQL 16) and the initial migration (`src/db/migrations/0000_natural_ozymandias.sql`) are ready and reviewed. Applying is blocked pending a running local database — Docker Desktop must be installed first.

**Done when:** a clean checkout can create the database with one documented command sequence.

## 3. Authentication — not started

- [ ] Implement signup, login, logout, and session helpers.
- [ ] Protect signed-in routes on the server.
- [ ] Add validation, secure cookies, password hashing, expiry, and basic login throttling.

**Done when:** a new local user can sign up, log in, refresh, log out, and cannot access signed-in pages afterward.

## 4. Solution features — not started

- [ ] Read solutions, dashboard metrics, tags, and favorites from PostgreSQL.
- [ ] Implement create, edit, delete, and favorite mutations.
- [ ] Add authorization tests for cross-user access.

**Done when:** every current feature works against the local database and each user sees only their own data.

## 5. Data migration and cleanup — not started

- [ ] Import any retained Supabase records and verify counts/samples.
- [ ] Remove Supabase client code, environment variables, migration folder, and package.
- [ ] Remove Vite, React Router, and static-SPA configuration.
- [ ] Update the root README with new setup and deployment steps.

**Done when:** the project runs without Supabase references and setup instructions work from a clean checkout.
