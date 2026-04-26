# MCA Workflow Planning Spec

## 1. Purpose

This document defines what the content workflows need to do so they can create content that fits the MCA Loan web app templates and publish correctly through the API.

The workflows should not think in terms of writing one long page. They should think in terms of:

- deciding what a keyword becomes
- selecting the correct template
- generating structured content blocks
- publishing those blocks into the right page or parent page

---

## 2. Workflow Goal

Each workflow should turn a keyword or roadmap row into a structured publishing action.

That means every workflow run should answer these questions:

1. Is this a standalone page, a section on an existing page, an FAQ item, or hold only?
2. Which template does it belong to?
3. Which route or parent page should receive the content?
4. What exact content fields are required for that template?
5. Which API endpoint should receive the payload?

---

## 3. Core Publishing Decisions

Every keyword or topic should be classified into one of these values:

- `page`
- `section_only`
- `faq_only`
- `hold`

### Meaning of each value

#### `page`
Create or update a full standalone page.

Examples:
- `/types/same-day`
- `/sectors/restaurant`
- `/compare/merchant-cash-advance-vs-business-loan`

#### `section_only`
Do not create a new page. Add content to an existing parent page.

Examples:
- a fast-funding section added to `/sectors/restaurant`
- a card-terminal-loan section added to `/types/card-terminal-loan`

#### `faq_only`
Do not create a page. Add a question and answer to an existing page.

Examples:
- “Can restaurants get an MCA with bad credit?” added to `/sectors/restaurant`
- “Do I need a card machine?” added to `/types/card-terminal-loan`

#### `hold`
Store the keyword and decision but do not publish content yet.

Examples:
- very thin keyword variations
- overlapping query variants
- low-priority ideas reserved for later testing

---

## 4. Workflow Stack

The workflow system should be split into clear stages.

### Stage A: routing and planning
Takes a keyword or roadmap row and decides:
- publish mode
- page template
- target slug
- target path
- parent page if needed
- primary keyword
- secondary keywords
- search intent

### Stage B: metadata generation
Creates:
- title
- meta title
- meta description
- H1
- canonical URL
- page label or breadcrumb label if needed

### Stage C: section generation
Creates template-specific content blocks in HTML.

### Stage D: FAQ generation
Creates question and answer pairs tied to the target page.

### Stage E: internal linking generation
Suggests or assigns:
- related pages
- target pages to link to
- anchor text themes

### Stage F: publishing
Sends the structured data to the correct API endpoint and triggers revalidation.

---

## 5. Workflow Inputs

Each workflow run should begin with a normalized brief.

### Minimum brief format

```json
{
  "primary_keyword": "merchant cash advance for restaurants",
  "secondary_keywords": [
    "restaurant cash advance",
    "MCA loan for restaurants",
    "merchant cash advance restaurant funding"
  ],
  "publish_mode": "page",
  "page_template": "sector",
  "page_group": "sectors",
  "slug": "restaurant",
  "full_path": "/sectors/restaurant",
  "parent_page_slug": null,
  "search_intent": "commercial",
  "brand_suffix": "MCA Loan UK"
}
```

---

## 6. Workflow Outputs

The workflows should return structured JSON, not plain unstructured copy.

### Full page output example

```json
{
  "title": "Merchant Cash Advance for Restaurants | MCA Loan UK",
  "meta_title": "Merchant Cash Advance for Restaurants | MCA Loan UK",
  "meta_description": "Learn how merchant cash advances work for restaurants, including repayments, eligibility, funding speed, and common use cases.",
  "h1": "Merchant Cash Advance for Restaurants",
  "intro_html": "<p>...</p>",
  "sections": [
    {
      "section_key": "sector_need",
      "heading": "Why Restaurants Use Merchant Cash Advances",
      "content_html": "<p>...</p>"
    },
    {
      "section_key": "cashflow_gaps",
      "heading": "Common Restaurant Cashflow Gaps",
      "content_html": "<p>...</p>"
    }
  ],
  "faqs": [
    {
      "question": "Can a restaurant get a merchant cash advance with bad credit?",
      "answer_html": "<p>...</p>",
      "schema_enabled": true
    }
  ]
}
```

---

## 7. Template-Specific Workflow Requirements

## 7.1 Type Page Template

Example route:
- `/types/same-day`

### Required content fields
- title
- meta_title
- meta_description
- h1
- intro_html
- hero section
- definition section
- suitability section
- repayment section
- speed section
- eligibility section
- pros and cons section
- use cases section
- sector fit section
- FAQs
- related links

### Suggested section keys
- `hero`
- `definition`
- `suitability`
- `repayment`
- `speed`
- `eligibility`
- `pros_cons`
- `use_cases`
- `sector_fit`
- `related_links`

---

## 7.2 Sector Page Template

Example route:
- `/sectors/restaurant`

### Required content fields
- title
- meta_title
- meta_description
- h1
- intro_html
- hero section
- sector need section
- cashflow gaps section
- use cases section
- repayment fit section
- eligibility section
- related type links
- FAQs
- related guides

### Suggested section keys
- `hero`
- `sector_need`
- `cashflow_gaps`
- `use_cases`
- `repayment_fit`
- `eligibility`
- `related_types`
- `related_links`

---

## 7.3 Guide Page Template

Example route:
- `/guides/how-does-a-merchant-cash-advance-work`

### Required content fields
- title
- meta_title
- meta_description
- h1
- intro_html
- summary section
- process steps section
- costs section
- repayment section
- pros and cons section
- alternatives section
- FAQs
- CTA section

### Suggested section keys
- `hero`
- `summary`
- `process_steps`
- `costs`
- `repayment`
- `pros_cons`
- `alternatives`
- `faqs`
- `cta`

---

## 7.4 Comparison Page Template

Example route:
- `/compare/merchant-cash-advance-vs-business-loan`

### Required content fields
- title
- meta_title
- meta_description
- h1
- intro_html
- quick verdict section
- comparison table data
- when MCA is better section
- when the alternative is better section
- cost comparison section
- speed comparison section
- eligibility comparison section
- FAQs
- CTA section

### Suggested section keys
- `hero`
- `quick_verdict`
- `comparison_table`
- `when_mca_wins`
- `when_other_wins`
- `cost_comparison`
- `speed_comparison`
- `eligibility_comparison`
- `faqs`
- `cta`

---

## 7.5 FAQ Page Template

Example route:
- `/faqs/can-i-get-an-mca-with-bad-credit`

### Required content fields
- title
- meta_title
- meta_description
- h1
- intro_html
- short answer section
- expanded answer section
- approval factors section
- related links
- CTA section

### Suggested section keys
- `hero`
- `short_answer`
- `expanded_answer`
- `approval_factors`
- `related_links`
- `cta`

---

## 7.6 Use Case Page Template

Example route:
- `/use-cases/payroll`

### Required content fields
- title
- meta_title
- meta_description
- h1
- intro_html
- why businesses use it section
- when it makes sense section
- risks and limits section
- alternatives section
- FAQs
- CTA section

### Suggested section keys
- `hero`
- `why_this_use_case`
- `when_it_makes_sense`
- `risks_limits`
- `alternatives`
- `faqs`
- `cta`

---

## 8. Workflow Types

## 8.1 Keyword Router Workflow

### Purpose
Determine what the keyword should become.

### Input
- keyword
- roadmap decision
- page group
- keyword cluster

### Output
- publish_mode
- page_template
- target_slug
- target_path
- parent_page_slug
- primary_keyword
- secondary_keywords
- search_intent

### Example
Keyword:
- `fast funding merchant cash advance for restaurants`

Possible output:

```json
{
  "publish_mode": "section_only",
  "page_template": "sector",
  "target_path": "/sectors/restaurant",
  "parent_page_slug": "restaurant",
  "keyword_theme": "fast funding"
}
```

---

## 8.2 Metadata Generator Workflow

### Purpose
Create page-level SEO metadata.

### Input
- normalized brief

### Output
- title
- meta_title
- meta_description
- h1
- canonical_url
- breadcrumb labels if needed

### Naming rules
- title tag format: `Primary Keyword | MCA Loan UK`
- H1 should be natural and keyword-led
- meta description should be concise and intent-matched

---

## 8.3 Section Generator Workflow

### Purpose
Generate HTML sections for the selected template.

### Input
- normalized brief
- page_template
- required section keys

### Output
A JSON array of sections.

### Example

```json
{
  "sections": [
    {
      "section_key": "definition",
      "heading": "What Is a Merchant Cash Advance for Restaurants?",
      "content_html": "<p>...</p>"
    },
    {
      "section_key": "cashflow_gaps",
      "heading": "Common Restaurant Cashflow Gaps",
      "content_html": "<p>...</p>"
    }
  ]
}
```

---

## 8.4 FAQ Generator Workflow

### Purpose
Create FAQ items for the page or parent page.

### Input
- normalized brief
- page_template
- keyword variants

### Output
An array of question and answer objects.

### Example

```json
{
  "faqs": [
    {
      "question": "Can a restaurant get a merchant cash advance with bad credit?",
      "answer_html": "<p>...</p>",
      "schema_enabled": true
    }
  ]
}
```

---

## 8.5 Internal Linking Workflow

### Purpose
Recommend internal links and anchor themes.

### Input
- target page
- template type
- page group
- sector and type relationships

### Output
- related page slugs
- anchor text suggestions
- placement hints

---

## 8.6 Publisher Workflow

### Purpose
Push structured content into the API.

### Logic

#### If `publish_mode = page`
- call `/api/pages/upsert`
- call `/api/pages/section` for each section
- call `/api/pages/faq` for each FAQ
- call `/api/revalidate`

#### If `publish_mode = section_only`
- call `/api/pages/section`
- optionally call `/api/pages/faq`
- call `/api/revalidate` on the parent page

#### If `publish_mode = faq_only`
- call `/api/pages/faq`
- call `/api/revalidate` on the parent page

#### If `publish_mode = hold`
- store the keyword decision only
- do not publish to a live route

---

## 9. API Payload Contracts

## 9.1 Full Page Upsert

Endpoint:
- `POST /api/pages/upsert`

Example payload:

```json
{
  "slug": "same-day",
  "full_path": "/types/same-day",
  "page_template": "type",
  "page_group": "types",
  "title": "Same Day Merchant Cash Advance | MCA Loan UK",
  "meta_title": "Same Day Merchant Cash Advance | MCA Loan UK",
  "meta_description": "Learn how same day merchant cash advance funding works, who it suits, how repayments work, and what lenders may require.",
  "h1": "Same Day Merchant Cash Advance",
  "intro_html": "<p>...</p>",
  "body_html": "<section>...</section>",
  "canonical_url": "https://mcaloan.co.uk/types/same-day",
  "status": "published",
  "indexable": true,
  "publish_mode": "page"
}
```

---

## 9.2 Section Upsert

Endpoint:
- `POST /api/pages/section`

Example payload:

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

---

## 9.3 FAQ Upsert

Endpoint:
- `POST /api/pages/faq`

Example payload:

```json
{
  "target_page_slug": "restaurant",
  "question": "Can restaurants get a merchant cash advance with bad credit?",
  "answer_html": "<p>...</p>",
  "schema_enabled": true,
  "keyword": "restaurant MCA bad credit"
}
```

---

## 9.4 Publish Route

Endpoint:
- `POST /api/pages/publish`

Example payload:

```json
{
  "slug": "restaurant"
}
```

---

## 9.5 Revalidate Route

Endpoint:
- `POST /api/revalidate`

Example payload:

```json
{
  "full_path": "/sectors/restaurant"
}
```

---

## 10. Workflow Rules by Content Type

## 10.1 Full standalone pages
Use when:
- query has distinct search intent
- page can be unique enough
- page belongs clearly in types, sectors, guides, comparisons, FAQs, or use cases

Expected output:
- full metadata
- intro
- all required sections
- FAQs
- related links

---

## 10.2 Section-only keywords
Use when:
- keyword is a variant of a stronger page
- query overlaps heavily with an existing target page
- content would be thin as its own page

Expected output:
- one or more sections
- optional supporting FAQs
- internal link suggestions

---

## 10.3 FAQ-only keywords
Use when:
- the keyword is an isolated question
- the answer is too short for a strong standalone page
- it supports a stronger parent page

Expected output:
- question
- answer HTML
- schema enabled flag

---

## 10.4 Hold-only keywords
Use when:
- keyword is too weak
- keyword overlaps too much
- page would be thin or near-duplicate
- topic needs later testing or review

Expected output:
- stored record only
- no live publishing action

---

## 11. Example Workflow Scenario

Keyword:
- `card terminal loan for restaurants`

### Routing decision
This is likely not a standalone page at launch.

Decision:

```json
{
  "publish_mode": "section_only",
  "page_template": "sector",
  "parent_page_slug": "restaurant",
  "target_path": "/sectors/restaurant",
  "keyword_theme": "card terminal loan"
}
```

### Content generation output
- section: `Card Terminal Loan Options for Restaurants`
- 2 supporting FAQs
- related link to `/types/card-terminal-loan`

### Publish actions
- `POST /api/pages/section`
- `POST /api/pages/faq`
- `POST /api/revalidate`

---

## 12. Minimum Workflow Set for Launch

Start with these five workflows.

### Workflow 1: keyword router
Determines page, section_only, faq_only, or hold.

### Workflow 2: metadata generator
Creates title, meta title, meta description, H1, and canonical.

### Workflow 3: section generator
Builds the HTML sections for the selected template.

### Workflow 4: FAQ generator
Creates FAQ items tied to the page.

### Workflow 5: publisher
Pushes the structured data into the app API and triggers revalidation.

---

## 13. Prompting Rules for Content Generation

All prompts should be template-specific.

### Good prompt style
- generate the `cashflow_gaps` section for a sector page about merchant cash advance for restaurants in HTML
- generate 5 FAQs for the same-day merchant cash advance type page in UK English
- generate a meta title under 60 characters for the keyword merchant cash advance top-up

### Bad prompt style
- write a page about merchant cash advance for restaurants

The workflows should always request structured outputs, not long freeform content.

---

## 14. SEO Requirements for Every Indexable Page

Every indexable page should end up with:
- title tag
- meta description
- H1
- intro paragraph
- unique body content
- related internal links
- FAQ schema where relevant
- canonical URL

Important rule:
All important SEO content must be rendered in the initial HTML response, not injected later only on the client.

---

## 15. Quality Control Rules

Before publishing, the workflow system should check:
- page is assigned to the correct template
- content fields are present
- title and H1 match the target keyword intent
- body content is not too thin
- FAQ content is not duplicating another page too closely
- canonical is correct
- route exists in the sitemap structure
- internal links are assigned

---

## 16. Recommended Next Step

The next document should be the full content matrix.

That matrix should map every planned keyword or roadmap row to:
- exact URL
- template type
- publish mode
- parent page
- internal links
- content priority
- whether it is live, merged, FAQ-only, or hold

That matrix will become the main input for the workflows.

