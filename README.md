# DevDocs — Personal Developer Documentation Hub

DevDocs is a personal knowledge base for developers to capture problems and their solutions, organize them with tags, save favorites, and revisit them quickly. It features authentication, a dashboard, rich solution details with code snippets and Markdown rendering, and a responsive UI with light/dark themes.

The app is built with React + Vite, Tailwind CSS, Zustand for state management, and Supabase for authentication and data storage. It is configured for deployment on Vercel.

## Overview

- **Authentication:** Email/password via Supabase (`authAPI` in `src/lib/supabase.js`).
- **CRUD for Solutions:** Create, read, update, delete solutions with fields like title, description, status, difficulty, tags, problem description, solution steps, and code snippets.
- **Tagging & Search:** Filter by tag, status, difficulty, and search across key text fields.
- **Favorites:** Star/unstar solutions; view a favorites page.
- **Dashboard & Profile:** Metrics, recent solutions, popular tags, and theme preferences.
- **Markdown & Code:** Rich content via `react-markdown`, `remark-gfm`, and Prism syntax highlighting.
- **Theming:** Persistent light/dark mode stored in `localStorage`.

## Tech Stack

- **Frontend:** React 19, Vite 7, React Router 7
- **Styling:** Tailwind CSS 4, `@tailwindcss/typography`
- **State:** Zustand
- **Auth/DB:** Supabase (`@supabase/supabase-js`)
- **Markdown & Syntax:** `react-markdown`, `remark-gfm`, `react-syntax-highlighter`
- **UI Icons:** `lucide-react`
- **Linting:** ESLint 9 with React hooks config

## Project Structure

```
dev_docs/
  src/
    components/
      AppHeader.jsx
      AppSidebarHeader.jsx
      AppSidebarNav.jsx
      MainContent.jsx
      ProtectedRoute.jsx
      ui/
        MarkdownRenderer.jsx
        LoadingSpinner.jsx
        LoadingSkeleton.jsx
        add-new-solution ui/
          Basic_info.jsx
          Problems&Solutions.jsx
          AddTags.jsx
          CodeSnippets.jsx
    hooks/
      useAuth.js
    lib/
      supabase.js
    pages/
      Login.jsx
      Signup.jsx
      UserPage.jsx
      Dashboard.jsx
      SolutionsList.jsx
      SolutionDetails.jsx
      add-new-solution.jsx
      editSolution.jsx
      Favorites.jsx
      Profile.jsx
      Tags.jsx
    store/
      solutionsStore.js
    App.jsx
    main.jsx
    index.css
  supabase/
    migrations/
      20250924151754_maroon_dust.sql
  index.html
  vite.config.js
  tailwind.config.js
  vercel.json
  package.json
```

## Routing

Defined in `src/App.jsx` and sidebar in `src/components/AppSidebarNav.jsx`:

- `/login` — `Login`
- `/signup` — `Signup`
- `/*` (protected) — `UserPage` container with:
  - `/dashboard` — `Dashboard`
  - `/solution` — `SolutionsList`
  - `/solution/add-new` — `add-new-solution`
  - `/solution/:id` — `SolutionDetails`
  - `/solution/:id/edit` — `editSolution`
  - `/favorites` — `Favorites`
  - `/tags` — `Tags`
  - `/profile` — `Profile`

`ProtectedRoute` ensures only authenticated users can access app pages under `/*`.

## Data Model (Supabase)

The schema is defined in `supabase/migrations/20250924151754_maroon_dust.sql`:

- `solutions`
  - `id` (uuid, PK)
  - `user_id` (uuid, FK to `auth.users`)
  - `title` (text)
  - `description` (text)
  - `problem_description` (text)
  - `solution_steps` (text)
  - `status` (text: `open` | `resolved`)
  - `difficulty` (text: `easy` | `medium` | `hard`)
  - `tags` (text[])
  - `code_snippets` (jsonb)
  - `created_at`, `updated_at` (timestamptz)

- `user_favorites`
  - `id` (uuid, PK)
  - `user_id` (uuid, FK to `auth.users`)
  - `solution_id` (uuid, FK to `solutions`)
  - `created_at` (timestamptz)
  - Unique `(user_id, solution_id)`

Row Level Security (RLS) is enabled with policies restricting access to each user’s own data.

## Environment Variables

Create a `.env` file in the project root with your Supabase credentials:

```bash
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

If these are missing, the app will throw an error at startup in `src/lib/supabase.js`.

## Local Development

Install dependencies and start the dev server:

```bash
npm install
npm run dev
```

Other scripts from `package.json`:

- `npm run build` — production build via Vite
- `npm run preview` — preview the production build
- `npm run lint` — run ESLint

Open the app at the URL printed by Vite (typically http://localhost:5173).

## Supabase Setup & Migrations

1. Create a Supabase project and obtain the project URL and anon key.
2. Set the `.env` variables as above.
3. Ensure the `solutions` and `user_favorites` tables exist. The SQL migration at `supabase/migrations/20250924151754_maroon_dust.sql` can be applied through the Supabase SQL editor.
4. Authentication must be enabled in Supabase (Email/Password) with RLS policies from the migration.

## Deployment

- The repository includes `vercel.json` to rewrite all routes to `/` for SPA support.
- Recommended host: Vercel. Set the environment variables in your Vercel project settings.
- Build command: `npm run build`
- Output: Vite static build (Vercel will auto-detect)

## Notable Implementation Details

- `src/lib/supabase.js` centralizes auth and database helpers (`authAPI`, `solutionsAPI`).
- `src/store/solutionsStore.js` handles app state and calls Supabase APIs, including optimistic updates where appropriate.
- `src/pages/*` implement core UX flows: onboarding (`Login`, `Signup`), browsing and filtering (`SolutionsList`, `Tags`), insight (`Dashboard`, `Profile`), and curation (`Favorites`).
- `src/components/ui/MarkdownRenderer.jsx` renders Markdown with GFM; `SolutionDetails.jsx` highlights code snippets using Prism.
- The theme is toggled in `AppHeader.jsx` and persisted in `localStorage`. `index.html` includes a script to prevent theme flash.

## License


