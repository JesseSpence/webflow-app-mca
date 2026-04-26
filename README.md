# MCA Loan Content App (Phase 1)

This project is a Next.js App Router application that renders SEO pages from Supabase and accepts workflow publishing payloads through authenticated API routes.

## Quick start

1. Copy `.env.example` to `.env.local`.
2. Fill in Supabase and API token values.
3. Apply DB migration in `supabase/migrations/0001_phase1_content_schema.sql`.
4. Optionally run seed script in `supabase/seed/phase1_seed.sql`.
5. Start dev server:

```bash
npm run dev
```

## API contracts for workflow handoff

All write endpoints require:

`Authorization: Bearer <INTERNAL_API_BEARER_TOKEN>`

### Upsert page

`POST /api/pages/upsert`

```json
{
  "slug": "same-day",
  "full_path": "/types/same-day",
  "page_template": "type",
  "page_group": "types",
  "title": "Same Day Merchant Cash Advance | MCA Loan UK",
  "meta_title": "Same Day Merchant Cash Advance | MCA Loan UK",
  "meta_description": "Learn how same day merchant cash advance funding works.",
  "h1": "Same Day Merchant Cash Advance",
  "intro_html": "<p>...</p>",
  "body_html": "<section>...</section>",
  "canonical_url": "https://mcaloan.co.uk/types/same-day",
  "status": "published",
  "indexable": true,
  "publish_mode": "page"
}
```

### Upsert section

`POST /api/pages/section`

```json
{
  "target_page_slug": "restaurant",
  "section_key": "cashflow_gaps",
  "heading": "Common Restaurant Cashflow Gaps",
  "content_html": "<p>...</p>",
  "keyword_theme": "restaurant cash flow",
  "sort_order": 2
}
```

### Add FAQ

`POST /api/pages/faq`

```json
{
  "target_page_slug": "restaurant",
  "question": "Can restaurants get an MCA with bad credit?",
  "answer_html": "<p>...</p>",
  "schema_enabled": true,
  "keyword": "restaurant MCA bad credit"
}
```

### Publish page

`POST /api/pages/publish`

```json
{
  "slug": "restaurant"
}
```

### Revalidate route

`POST /api/revalidate`

```json
{
  "full_path": "/sectors/restaurant"
}
```

### Get page data

`GET /api/pages/[slug]`

### Keyword decision ingest

`POST /api/keywords/upsert`

```json
{
  "keyword": "merchant cash advance for restaurants",
  "mapped_page_slug": "restaurant",
  "live_decision": "live",
  "usage_type": "section_only",
  "notes": "Merge into sector page",
  "source_cluster": "sector_restaurant"
}
```
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
