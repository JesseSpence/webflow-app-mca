insert into pages (
  slug, full_path, page_group, page_template, title, meta_title, meta_description, h1,
  intro_html, body_html, canonical_url, status, indexable, publish_mode, published_at
)
values
(
  'same-day',
  '/types/same-day',
  'types',
  'type',
  'Same Day Merchant Cash Advance | MCA Loan UK',
  'Same Day Merchant Cash Advance | MCA Loan UK',
  'Understand same day merchant cash advance funding, eligibility, and repayment.',
  'Same Day Merchant Cash Advance',
  '<p>Same day MCA can provide fast access to funds when timing matters.</p>',
  null,
  'https://mcaloan.co.uk/types/same-day',
  'published',
  true,
  'page',
  now()
),
(
  'restaurant',
  '/sectors/restaurant',
  'sectors',
  'sector',
  'Merchant Cash Advance for Restaurants | MCA Loan UK',
  'Merchant Cash Advance for Restaurants | MCA Loan UK',
  'See how MCA funding supports restaurant cashflow and growth plans.',
  'Merchant Cash Advance for Restaurants',
  '<p>Restaurant cashflow can fluctuate. MCA allows repayment to flex with sales.</p>',
  null,
  'https://mcaloan.co.uk/sectors/restaurant',
  'published',
  true,
  'page',
  now()
),
(
  'how-does-a-merchant-cash-advance-work',
  '/guides/how-does-a-merchant-cash-advance-work',
  'guides',
  'guide',
  'How Does a Merchant Cash Advance Work? | MCA Loan UK',
  'How Does a Merchant Cash Advance Work? | MCA Loan UK',
  'A plain-English guide to MCA process, costs, and repayment structure.',
  'How Does a Merchant Cash Advance Work?',
  '<p>This guide explains the MCA flow from application to repayment.</p>',
  null,
  'https://mcaloan.co.uk/guides/how-does-a-merchant-cash-advance-work',
  'published',
  true,
  'page',
  now()
),
(
  'merchant-cash-advance-vs-business-loan',
  '/compare/merchant-cash-advance-vs-business-loan',
  'compare',
  'comparison',
  'Merchant Cash Advance vs Business Loan | MCA Loan UK',
  'Merchant Cash Advance vs Business Loan | MCA Loan UK',
  'Compare MCA and business loans across speed, flexibility, and qualification.',
  'Merchant Cash Advance vs Business Loan',
  '<p>Both options can support growth, but differ in structure and underwriting.</p>',
  null,
  'https://mcaloan.co.uk/compare/merchant-cash-advance-vs-business-loan',
  'published',
  true,
  'page',
  now()
),
(
  'payroll',
  '/use-cases/payroll',
  'use-cases',
  'use-case',
  'Using MCA for Payroll | MCA Loan UK',
  'Using MCA for Payroll | MCA Loan UK',
  'Learn when MCA can be used to bridge payroll cashflow pressure.',
  'Using MCA for Payroll',
  '<p>MCA can support short-term payroll pressure during uneven trading periods.</p>',
  null,
  'https://mcaloan.co.uk/use-cases/payroll',
  'published',
  true,
  'page',
  now()
)
on conflict (slug) do nothing;

insert into page_sections (page_id, section_key, heading, content_html, sort_order)
select id, 'definition', 'What Is Same Day MCA?', '<p>It is a merchant cash advance designed for rapid access to capital.</p>', 1
from pages where slug = 'same-day'
on conflict (page_id, section_key) do nothing;

insert into page_sections (page_id, section_key, heading, content_html, sort_order)
select id, 'cashflow_gaps', 'Common Restaurant Cashflow Gaps', '<p>Seasonality, supplier terms, and peak-staffing periods are common pressure points.</p>', 1
from pages where slug = 'restaurant'
on conflict (page_id, section_key) do nothing;

insert into faq_items (page_id, question, answer_html, sort_order, schema_enabled)
select id, 'Can I get an MCA with bad credit?', '<p>Possibly. Lenders often focus on turnover and card sales performance.</p>', 0, true
from pages where slug = 'same-day'
and not exists (
  select 1 from faq_items f where f.page_id = pages.id and f.question = 'Can I get an MCA with bad credit?'
);
