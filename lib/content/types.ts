export type PublishMode = "page" | "section_only" | "faq_only" | "hold";
export type PageStatus = "draft" | "published" | "archived";

export type PageGroup =
  | "types"
  | "sectors"
  | "compare"
  | "guides"
  | "faqs"
  | "use-cases"
  | "core";

export interface PageRecord {
  id: string;
  slug: string;
  full_path: string;
  page_group: string;
  page_template: string;
  title: string;
  meta_title: string;
  meta_description: string;
  h1: string;
  intro_html: string | null;
  body_html: string | null;
  canonical_url: string | null;
  status: PageStatus;
  indexable: boolean;
  publish_mode: PublishMode;
  parent_page_id: string | null;
  created_at: string;
  updated_at: string;
  published_at: string | null;
}

export interface PageSectionRecord {
  id: string;
  page_id: string;
  section_key: string;
  section_label: string | null;
  heading: string | null;
  content_html: string;
  sort_order: number;
  keyword_theme: string | null;
  created_at: string;
  updated_at: string;
}

export interface FaqItemRecord {
  id: string;
  page_id: string;
  question: string;
  answer_html: string;
  sort_order: number;
  schema_enabled: boolean;
  keyword_variant_id: string | null;
}
