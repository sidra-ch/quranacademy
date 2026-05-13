# Backend + Database + Vercel Runbook

## 1) Supabase Postgres Setup

1. Create a new Supabase project.
2. Copy Postgres connection string and set it as `DATABASE_URL`.
3. Keep `sslmode=require` in the connection string.

## 2) Prisma Setup

Run locally:

```bash
npm run prisma:generate
npm run prisma:migrate
```

If `prisma:generate` fails with DNS/network errors, retry once network stabilizes.

## 3) Resend Setup

1. Create API key in Resend.
2. Add `RESEND_API_KEY` to local and Vercel env.
3. Add `RESEND_TO_EMAIL` as your inbox email.
4. Configure sender domain later for production (instead of `onboarding@resend.dev`).

## 4) Vercel Env Variables

Set these in Vercel Project Settings > Environment Variables:

- `DATABASE_URL`
- `RESEND_API_KEY`
- `RESEND_TO_EMAIL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_GA_ID` (optional)
- `NEXT_PUBLIC_FB_PIXEL_ID` (optional)

## 5) Post-Deploy Checks

1. Submit contact form from production.
2. Verify inquiry row created in database.
3. Verify admin email received.
4. Verify parent confirmation email received.
5. Verify WhatsApp button opens prefilled message.
6. Verify Lighthouse and mobile rendering.
