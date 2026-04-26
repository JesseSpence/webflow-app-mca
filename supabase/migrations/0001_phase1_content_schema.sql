create extension if not exists "pgcrypto";

create table if not exists pages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  full_path text not null unique,
  page_group text not null,
  page_template text not null,
  title text not null,
  meta_title text not null,
  meta_description text not null,
  h1 text not null,
  intro_html text,
  body_html text,
  canonical_url text,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  indexable boolean not null default true,
  publish_mode text not null default 'page' check (publish_mode in ('page', 'section_only', 'faq_only', 'hold')),
  parent_page_id uuid references pages(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz
);

create table if not exists page_sections (
  id uuid primary key default gen_random_uuid(),
  page_id uuid not null references pages(id) on delete cascade,
  section_key text not null,
  section_label text,
  heading text,
  content_html text not null,
  sort_order integer not null default 0,
  keyword_theme text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (page_id, section_key)
);

create table if not exists keyword_variants (
  id uuid primary key default gen_random_uuid(),
  keyword text not null unique,
  mapped_page_id uuid references pages(id) on delete set null,
  live_decision text not null default 'review',
  usage_type text not null check (usage_type in ('page', 'section_only', 'faq_only', 'hold')),
  notes text,
  source_cluster text,
  created_at timestamptz not null default now()
);

create table if not exists faq_items (
  id uuid primary key default gen_random_uuid(),
  page_id uuid not null references pages(id) on delete cascade,
  question text not null,
  answer_html text not null,
  sort_order integer not null default 0,
  schema_enabled boolean not null default true,
  keyword_variant_id uuid references keyword_variants(id) on delete set null
);

create table if not exists comparisons (
  id uuid primary key default gen_random_uuid(),
  page_id uuid not null references pages(id) on delete cascade,
  left_entity text not null,
  right_entity text not null,
  summary_html text,
  comparison_table_json jsonb
);

create table if not exists internal_links (
  id uuid primary key default gen_random_uuid(),
  source_page_id uuid not null references pages(id) on delete cascade,
  target_page_id uuid not null references pages(id) on delete cascade,
  anchor_text text not null,
  placement_hint text
);

create table if not exists taxonomies (
  id uuid primary key default gen_random_uuid(),
  taxonomy_type text not null,
  slug text not null,
  name text not null,
  description text
);

create table if not exists publish_logs (
  id uuid primary key default gen_random_uuid(),
  page_id uuid references pages(id) on delete set null,
  action_type text not null,
  payload_json jsonb,
  source_system text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_pages_status_group on pages(status, page_group);
create index if not exists idx_pages_updated_at on pages(updated_at desc);
create index if not exists idx_sections_page_id on page_sections(page_id);
create index if not exists idx_faq_page_id on faq_items(page_id);
create index if not exists idx_keyword_mapped_page_id on keyword_variants(mapped_page_id);
create index if not exists idx_internal_links_source on internal_links(source_page_id);
create index if not exists idx_internal_links_target on internal_links(target_page_id);
create index if not exists idx_publish_logs_page_id on publish_logs(page_id);
