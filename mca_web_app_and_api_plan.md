# MCA Loan Web App and API Planning

## 1. Goal

Build a code-based SEO content app that sits alongside the MCA Loan homepage and replaces the need for Webflow CMS. The system should:

- host indexable SEO pages
- support reusable content templates
- accept content pushes from workflows
- allow selective publishing by keyword cluster
- keep thin or overlapping content out of the index
- scale into guides, comparisons, FAQs, tools, and sector pages

---

## 2. Recommended Stack

### Frontend and server
- Next.js
- App Router
- TypeScript
- Tailwind CSS

### Data and storage
- Supabase Postgres

### Validation and API safety
- Zod
- bearer token auth for internal publishing endpoints

### Hosting
- Webflow Cloud for the app
- Webflow for the homepage and marketing shell

### Workflow input
- n8n or other automation workflows push JSON payloads into the API

---

## 3. High-Level Architecture

### User-facing structure
- Webflow homepage at `/`
- Next.js app handles SEO content routes such as:
  - `/merchant-cash-advance`
  - `/types/[type]`
  - `/sectors/[sector]`
  - `/compare/[slug]`
  - `/guides/[slug]`
  - `/faqs/[slug]`
  - `/use-cases/[slug]`
  - `/calculator`
  - `/eligibility`

### Content flow
workflow -> API -> database -> page render -> revalidation

### Publishing model
The workflow does not just create pages. It can:
- create a live page
- update a live page
- append a section to an existing page
- add FAQ entries to an existing page
- mark content as hold or noindex

---

## 4. Route Plan

### Core routes
- `/merchant-cash-advance`
- `/calculator`
- `/eligibility`
- `/compare`
- `/guides`
- `/faqs`
- `/use-cases`

### Dynamic SEO routes
- `/types/[type]`
- `/sectors/[sector]`
- `/compare/[slug]`
- `/guides/[slug]`
- `/faqs/[slug]`
- `/use-cases/[slug]`

### Optional expansion routes
Only if performance and uniqueness justify them:
- `/bad-credit/[sector]`
- `/same-day/[sector]`
- `/top-up/[sector]`
- `/renewal/[sector]`
- `/unsecured/[sector]`

### Avoid mass-launching weak combinations
Do not launch every type-sector page automatically.
Many rows previously marked `no` should instead become page variants, sections, FAQs, or internal-link targets rather than standalone URLs.

---

## 5. Rendering Strategy

### Use static or revalidated output for SEO pages
Best for:
- `/merchant-cash-advance`
- `/types/*`
- `/sectors/*`
- `/compare/*`
- `/guides/*`
- `/use-cases/*`

### Use SSR only where needed
Best for:
- highly dynamic eligibility tools
- user-specific calculations
- search or filter interfaces where content changes per request

### Client-side only for enhancements
Fine for:
- calculators
- accordions
- interactive comparison toggles
- filters
- dashboards

Important rule:
All indexable content must be present in the initial HTML.

---

## 6. Content Templates

### Template 1: Type page
Example: `/types/same-day`

Sections:
- hero
- definition
- who it suits
- how repayment works
- typical funding speed
- eligibility
- pros and cons
- sectors this type suits
- FAQs
- related pages

### Template 2: Sector page
Example: `/sectors/restaurant`

Sections:
- hero
- why this sector uses MCA
- common cashflow gaps
- example use cases
- repayment fit
- eligibility considerations
- sector FAQs
- related types
- related guides

### Template 3: Guide page
Example: `/guides/how-does-a-merchant-cash-advance-work`

Sections:
- intro
- plain-English explanation
- step-by-step process
- costs and repayment
- pros and cons
- alternatives
- FAQs
- CTA

### Template 4: Comparison page
Example: `/compare/merchant-cash-advance-vs-business-loan`

Sections:
- intro
- quick summary
- table comparison
- best for scenarios
- pros and cons of each
- FAQs
- CTA

### Template 5: Use case page
Example: `/use-cases/payroll`

Sections:
- hero
- when this use case appears
- why MCA may fit
- risks and considerations
- alternatives
- FAQs
- CTA

### Template 6: FAQ page
Example: `/faqs/can-i-get-an-mca-with-bad-credit`

Sections:
- short answer
- expanded answer
- what affects approval
- related guides
- CTA

---

## 7. Database Schema

### pages
- id
- slug
- full_path
- page_group
- page_template
- title
- meta_title
- meta_description
- h1
- intro_html
- body_html
- canonical_url
- status
- indexable
- publish_mode
- parent_page_id
- created_at
- updated_at
- published_at

### page_sections
- id
- page_id
- section_key
- section_label
- heading
- content_html
- sort_order
- keyword_theme
- created_at
- updated_at

### keyword_variants
- id
- keyword
- mapped_page_id
- live_decision
- usage_type
- notes
- source_cluster
- created_at

### faq_items
- id
- page_id
- question
- answer_html
- sort_order
- schema_enabled
- keyword_variant_id

### comparisons
- id
- page_id
- left_entity
- right_entity
- summary_html
- comparison_table_json

### internal_links
- id
- source_page_id
- target_page_id
- anchor_text
- placement_hint

### taxonomies
- id
- taxonomy_type
- slug
- name
- description

### publish_logs
- id
- page_id
- action_type
- payload_json
- source_system
- created_at

---

## 8. Core Publish Logic

### publish_mode values
- `page`
- `section_only`
- `faq_only`
- `hold`

### status values
- `draft`
- `published`
- `archived`

### indexable values
- `true`
- `false`

### Suggested logic
- If `publish_mode = page`, create or update full page and revalidate route
- If `publish_mode = section_only`, update mapped parent page sections and revalidate parent
- If `publish_mode = faq_only`, append FAQ entries and refresh schema on parent page
- If `publish_mode = hold`, store keyword but do not surface publicly

---

## 9. API Plan

### Endpoint 1: upsert page
`POST /api/pages/upsert`

Purpose:
- create or update a full page

Payload:
- slug
- full_path
- page_template
- page_group
- title
- meta_title
- meta_description
- h1
- intro_html
- body_html
- canonical_url
- status
- indexable
- publish_mode

### Endpoint 2: upsert section
`POST /api/pages/section`

Purpose:
- add or update a section on an existing page

Payload:
- target_page_slug
- section_key
- heading
- content_html
- keyword_theme
- sort_order

### Endpoint 3: add faq
`POST /api/pages/faq`

Purpose:
- add FAQ item to a page

Payload:
- target_page_slug
- question
- answer_html
- schema_enabled
- keyword

### Endpoint 4: publish page
`POST /api/pages/publish`

Purpose:
- move page from draft to published

Payload:
- slug

### Endpoint 5: revalidate route
`POST /api/revalidate`

Purpose:
- refresh static page output after update

Payload:
- full_path

### Endpoint 6: get page data
`GET /api/pages/[slug]`

Purpose:
- internal fetch or admin preview

### Endpoint 7: keyword decision ingest
`POST /api/keywords/upsert`

Purpose:
- store keyword plans even before content exists

Payload:
- keyword
- mapped_page_slug
- live_decision
- usage_type
- notes

---

## 10. API Security

### Minimum setup
- bearer token in request header
- IP restriction if possible
- Zod validation for every payload
- logging for all writes

### Recommended later
- HMAC signature for workflow calls
- role-based auth for internal admin UI
- rate limiting

---

## 11. Workflow-to-API Rules

### Example workflow actions
1. Research keyword cluster
2. Decide target route or parent page
3. Generate content payload
4. Send to correct endpoint
5. Trigger revalidation
6. Log publish result

### Rules engine examples
- If keyword is a primary type page, send to `/api/pages/upsert`
- If keyword is marked no-live but useful, send section content to `/api/pages/section`
- If keyword is a question, send to `/api/pages/faq`
- If keyword overlaps too heavily, map to parent and set `section_only`

---

## 12. SEO System Requirements

Every indexable page should store:
- title tag
- meta description
- canonical
- H1
- body HTML
- FAQ schema if relevant
- breadcrumb schema if relevant
- internal links
- related page links

### Naming rules
- URLs stay clean and keyword-first
- title tags use `Primary Keyword | MCA Loan UK`
- H1 stays natural and does not need the brand phrase every time
- body copy can include `MCA loan` as a secondary variant where natural

---

## 13. Initial Build Phases

### Phase 1: foundation
- set up Next.js app
- connect database
- build page templates
- create basic API endpoints
- render a handful of live test pages

### Phase 2: publishing system
- add page upsert flow
- add section and FAQ upsert flows
- add route revalidation
- add sitemap generation
- add robots and metadata handling

### Phase 3: editorial controls
- add simple internal admin table view
- add preview mode
- add publish logs
- add keyword decision dashboard

### Phase 4: scale content
- import roadmap into database
- mark rows as page, section_only, faq_only, or hold
- launch strongest core pages
- expand only after testing quality and performance

---

## 14. Content Planning Principles for the Next Phase

### Keep live as standalone pages
- main type pages
- main sector pages
- guides
- comparisons
- use cases
- calculator
- eligibility

### Use selectively for type-sector pages
Start with:
- bad credit
- same day
- top-up
- renewal
- unsecured

### Fold into parent pages instead of creating URLs
Often better as sections or FAQs:
- fast funding by sector
- card terminal loan by sector where weak
- small advance by sector
- large advance by sector
- short term by sector
- high turnover by sector
- online sales by sector

---

## 15. Immediate Build Checklist

### App setup
- initialise Next.js app
- set up App Router
- configure Tailwind
- configure environment variables
- connect Supabase

### Database
- create `pages`
- create `page_sections`
- create `faq_items`
- create `keyword_variants`
- create `internal_links`
- create `publish_logs`

### API
- build `/api/pages/upsert`
- build `/api/pages/section`
- build `/api/pages/faq`
- build `/api/pages/publish`
- build `/api/revalidate`

### Frontend
- build type page template
- build sector page template
- build guide template
- build comparison template
- build FAQ template
- build use-case template

### SEO
- metadata generation
- canonical output
- sitemap
- robots
- schema output
- breadcrumbs

### Workflow integration
- define JSON contracts
- test manual POST into endpoints
- connect n8n
- add logs and failure alerts

---

## 16. Next Planning Deliverable

The next step should be a full content matrix that converts the roadmap into:
- live pages
- merged keyword variants
- parent-page assignments
- internal links
- content brief type
- publishing priority
- canonical decisions

That matrix should drive both content creation and workflow automation.

