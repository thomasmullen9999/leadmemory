# LeadMemory

LeadMemory is a Next.js application for managing claim enquiries, claimant records, and internal case work.

Members of the public can submit an enquiry through the "Start a claim" form. New enquiries are added to the internal dashboard, where staff can review claimant details, record notes, create cases, and track progress.

The project began as a lightweight CRM and was adapted into a claim-management style application.

## Features

- Public claim enquiry form
- Claimant records with contact and enquiry details
- Internal dashboard for staff
- Claim status tracking
- Case pipeline tracking
- Role-based access for Admin and Sales Rep accounts
- Client notes
- Follow-up suggestions generated with the OpenAI API
- Dashboard charts using Recharts
- PostgreSQL database managed with Prisma

## Tech stack

- Next.js 15 with the App Router
- TypeScript
- Prisma
- PostgreSQL
- NextAuth.js
- Tailwind CSS
- Recharts
- OpenAI API

## Running the project locally

### Install dependencies

```bash
npm install
```

### Set up environment variables

Create a local environment file from the example:

```bash
cp .env.example .env
```

Add values for the following variables:

```env
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000
OPENAI_API_KEY=
```

`OPENAI_API_KEY` is only needed for the follow-up suggestion feature. The rest of the application can run without it.

You can generate a value for `NEXTAUTH_SECRET` with:

```bash
openssl rand -base64 32
```

### Create the database

The project uses PostgreSQL. You can use a local PostgreSQL installation or a hosted provider such as:

- [Supabase](https://supabase.com)
- [Neon](https://neon.tech)

Once `DATABASE_URL` is set, run the database migration:

```bash
npx prisma migrate dev
```

Generate the Prisma client if it does not happen automatically:

```bash
npx prisma generate
```

### Add demo data

Run the seed script:

```bash
npm run db:seed
```

This creates example staff accounts and sample claimant data.

Demo accounts:

| Role | Email | Password |
|---|---|---|
| Admin | `admin@leadmemory.dev` | `password123` |
| Sales Rep | `rep@leadmemory.dev` | `password123` |

These credentials are for local development only.

### Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

Staff users can log in through:

```txt
/login
```

The public enquiry form is available at:

```txt
/start-a-claim
```

## Claim enquiry flow

1. A visitor opens the Start a claim page.
2. They complete contact, claim, and consent details.
3. LeadMemory creates a claimant record.
4. The enquiry is assigned to an Admin user.
5. Staff can view the enquiry in the Dashboard and Claimants pages.
6. Staff can add notes, create internal cases, and monitor progress.

Submitting an enquiry does not guarantee eligibility, acceptance, compensation, or a successful outcome.

## Staff roles

### Admin

Admins can view all claimant records, cases, notes, and dashboard information.

### Sales Rep

Sales Reps can only view claimants assigned to their own account.

## Project structure

```txt
src/
  app/
    api/
      auth/
      claim-enquiries/
      clients/
      deals/
    clients/
      [id]/
      page.tsx
    dashboard/
      page.tsx
    start-a-claim/
      page.tsx
    login/
      page.tsx
  components/
    ClaimEnquiryForm.tsx
    DealList.tsx
    FollowUpSuggestion.tsx
    NavBar.tsx
    PipelineChart.tsx
  lib/
    auth.ts
    prisma.ts
  types/
    next-auth.d.ts

prisma/
  schema.prisma
  seed.ts
```

## Deployment

LeadMemory can be deployed with Vercel and a hosted PostgreSQL database.

A typical setup is:

- Vercel for the Next.js application
- Supabase or Neon for PostgreSQL
- Environment variables configured in the Vercel project settings

Before deploying, add these environment variables to Vercel:

```env
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
OPENAI_API_KEY=
```

Run the production migration against the production database:

```bash
npx prisma migrate deploy
```

## Scope

LeadMemory is a portfolio project built to demonstrate:

- Next.js App Router development
- TypeScript
- Prisma data modelling
- PostgreSQL integration
- Authentication and role-based access
- Form validation
- Public form submissions
- Internal dashboards
- CRUD operations
- API route handling
- Third-party API integration

It is not intended to be used as a real financial claims service without further work around legal compliance, privacy documentation, consent records, data retention, security review, rate limiting, spam prevention, and formal user support processes.