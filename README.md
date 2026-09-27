# LeadMemory

A lightweight CRM for tracking clients, deals, and follow-ups — built to mirror real production CRM work (client management, pipeline tracking, role-based access, and AI-assisted follow-ups).

## Tech Stack

- **Next.js 15** (App Router) + **TypeScript**
- **Prisma** + **PostgreSQL**
- **NextAuth.js** (credentials-based auth, JWT sessions, role-based access)
- **Tailwind CSS**
- **Recharts** (pipeline analytics)
- **OpenAI API** (AI-generated follow-up suggestions)

## Features

- **Client management** — create, view, and track clients with contact details
- **Deal pipeline** — track deals per client through stages (Lead → Contacted → Negotiating → Won/Lost)
- **Role-based access** — Admins see all clients; Sales Reps only see their own
- **Dashboard analytics** — active pipeline value, deals won this month, deals-by-stage chart
- **Notes** — a running log per client
- **AI follow-up suggestions** — generates a short, context-aware follow-up message based on a client's recent deals and notes, using the OpenAI API

## Getting Started Locally

### 1. Install dependencies

```bash
npm install
```

### 2. Set up your database

You'll need a PostgreSQL database. The easiest free options are:
- [Supabase](https://supabase.com) (free tier includes a Postgres database)
- [Neon](https://neon.tech) (free tier, serverless Postgres)
- Or a local Postgres install if you prefer

Copy the example env file and fill in your own values:

```bash
cp .env.example .env
```
Then edit `.env`:
- `DATABASE_URL` — your Postgres connection string from Supabase/Neon
- `NEXTAUTH_SECRET` — generate one with `openssl rand -base64 32`
- `NEXTAUTH_URL` — `http://localhost:3000` for local dev
- `OPENAI_API_KEY` — your own OpenAI API key (only needed for the AI follow-up feature; the rest of the app works without it)

### 3. Run migrations and seed the database

```bash
npx prisma migrate dev --name init
npm run db:seed
```

This creates the schema and adds two demo accounts with sample clients/deals:
- `admin@leadmemory.dev` (Admin role — sees everything)
- `rep@leadmemory.dev` (Sales Rep role — sees only their own clients)
- Password for both: `password123`

### 4. Run the dev server

```bash
npm run dev
```

Visit `http://localhost:3000` — you'll be redirected to `/login`.

## Deploying

The intended deployment path is **Vercel** (for the app) + **Supabase or Neon** (for the database):

1. Push this repo to GitHub
2. Import it into Vercel
3. Add the same environment variables from `.env` into Vercel's project settings
4. Vercel will build and deploy automatically on push

Remember to run `npx prisma migrate deploy` against your production database once, either via a build step or manually, before the app can read/write data.

## Project Structure

```
src/
  app/
    api/           - API routes (clients, deals, auth, AI suggestions)
    clients/       - Clients list + client detail pages
    dashboard/     - Dashboard with pipeline analytics
    login/         - Login page
  components/      - Shared UI components
  lib/             - Prisma client + NextAuth config
  types/           - TypeScript type augmentation for NextAuth
prisma/
  schema.prisma    - Database schema
  seed.ts          - Seed script with demo data
```

## Notes on Scope

This is a portfolio project demonstrating full-stack CRM functionality: relational data modelling, authentication with role-based access control, CRUD operations, dashboard analytics, and a third-party AI API integration. It intentionally keeps scope focused rather than attempting every feature a production CRM might have (e.g. no email sending, no billing, no multi-tenancy).
