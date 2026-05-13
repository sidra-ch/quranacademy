# Hafiz Kamran Hameed Quran Academy

Premium cinematic Islamic education website built with Next.js 15, TypeScript, Tailwind CSS, Framer Motion, GSAP, Prisma, Supabase-ready setup, and Resend email integration.

## Tech Stack

- Next.js 15 App Router + TypeScript
- Tailwind CSS v4
- Framer Motion + GSAP ScrollTrigger
- React Hook Form + Zod
- Prisma ORM (PostgreSQL)
- Supabase client
- Resend email API

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create env file:

```bash
copy .env.example .env
```

3. Fill required environment variables in `.env`:

- `DATABASE_URL` (Supabase Postgres connection string)
- `RESEND_API_KEY`
- `RESEND_TO_EMAIL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_GA_ID` (optional)
- `NEXT_PUBLIC_FB_PIXEL_ID` (optional)

4. Generate Prisma client:

```bash
npm run prisma:generate
```

5. Run migrations (after database is configured):

```bash
npm run prisma:migrate
```

6. If needed, open Prisma Studio:

```bash
npm run prisma:studio
```

7. Start development server:

```bash
npm run dev
```

## Backend Flow

1. Contact form validates data with Zod.
2. Server Action stores inquiry via Prisma into PostgreSQL.
3. Admin notification email is sent through Resend.
4. Parent confirmation email is sent to `parentEmail`.

## Deployment (Vercel)

1. Push repo to GitHub.
2. Import project in Vercel.
3. Add environment variables from `.env.example`.
4. Set build command: `npm run build`.
5. Add post-deploy cron/monitoring if needed for uptime checks.
6. Deploy.

## Core Features Implemented

- Cinematic hero with premium Islamic aesthetic
- Sticky glass navbar with mobile fullscreen drawer
- Animated sections (courses, counters, testimonials, pricing, FAQ)
- WhatsApp conversion system (floating CTA, popup, sticky mobile CTA, prefilled message)
- Contact form with validation + Server Action submission
- Prisma inquiry storage model
- Resend email notification support
- Dark/light mode toggle
- SEO metadata + JSON-LD + robots + sitemap
