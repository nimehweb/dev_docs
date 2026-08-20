# DevDocs — Developer Documentation Hub

DevDocs is a developer knowledge base application to capture technical problems and solutions, organize them with tags, star favorites, and revisit them quickly.

Upgraded from React (Vite) + Supabase to **Next.js (App Router) + Neon PostgreSQL + Drizzle ORM** with custom session authentication.

---

## Key Features

- **Custom Cookie Authentication:** Secure session-based authentication using hashed tokens in PostgreSQL and HTTP-only cookies.
- **Solution Management:** Document problems, steps, status (`open` / `resolved`), difficulty levels (`easy`, `medium`, `hard`), and multi-language code snippets.
- **Tags & Search:** Filter by tag, status, difficulty, and instant keyword search across titles and solution text.
- **Favorites:** Star solutions for quick access.
- **Dashboard & Profile:** Real-time metrics, success rates, popular tags, and recent solutions.
- **Markdown & Code Highlighting:** Rich text rendering with `react-markdown`, `remark-gfm`, and syntax highlighting.
- **Dark Mode Support:** Built-in dark/light theme support.

---

## Tech Stack

- **Framework:** Next.js 16 (App Router, Server Actions, Server Components)
- **Language:** TypeScript
- **Database:** Neon Serverless PostgreSQL
- **ORM & Migrations:** Drizzle ORM & `drizzle-kit`
- **Styling:** Tailwind CSS v4, `@tailwindcss/typography`
- **Validation:** Zod
- **Auth & Security:** `bcryptjs`, HTTP-only cookies

---

## Getting Started

### 1. Environment Variables

Create a `.env` file in the project root with your Neon PostgreSQL connection string:

```bash
DATABASE_URL="postgresql://user:password@ep-sample-123456.us-east-2.aws.neon.tech/devdocs?sslmode=require"
```

### 2. Database Migrations

Apply the database schema to Neon Postgres:

```bash
npm run db:migrate
```

### 3. Run Development Server

Start the Next.js development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Available Scripts

- `npm run dev` — Start Next.js development server
- `npm run build` — Build production Next.js application
- `npm run start` — Run production server
- `npm run lint` — Run ESLint check
- `npm run db:generate` — Generate new Drizzle migration files
- `npm run db:migrate` — Apply migrations to PostgreSQL

---

## Deployment

Recommended host: **Vercel**
- Database: **Neon Postgres**
- Set `DATABASE_URL` in environment variables on Vercel.
