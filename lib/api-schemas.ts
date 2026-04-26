import { z } from "zod";

export const publishModeSchema = z.enum(["page", "section_only", "faq_only", "hold"]);
export const pageStatusSchema = z.enum(["draft", "published", "archived"]);

export const upsertPageSchema = z.object({
  slug: z.string().min(1),
  full_path: z.string().min(1),
  page_template: z.string().min(1),
  page_group: z.string().min(1),
  title: z.string().min(1),
  meta_title: z.string().min(1),
  meta_description: z.string().min(1),
  h1: z.string().min(1),
  intro_html: z.string().nullable().optional(),
  body_html: z.string().nullable().optional(),
  canonical_url: z.string().url().nullable().optional(),
  status: pageStatusSchema,
  indexable: z.boolean(),
  publish_mode: publishModeSchema,
});

export const upsertSectionSchema = z.object({
  target_page_slug: z.string().min(1),
  section_key: z.string().min(1),
  section_label: z.string().nullable().optional(),
  heading: z.string().nullable().optional(),
  content_html: z.string().min(1),
  keyword_theme: z.string().nullable().optional(),
  sort_order: z.number().int().nonnegative().default(0),
});

export const upsertFaqSchema = z.object({
  target_page_slug: z.string().min(1),
  question: z.string().min(1),
  answer_html: z.string().min(1),
  schema_enabled: z.boolean().default(true),
  keyword: z.string().min(1).optional(),
});

export const publishPageSchema = z.object({
  slug: z.string().min(1),
});

export const revalidateSchema = z.object({
  full_path: z.string().min(1),
});

export const upsertKeywordSchema = z.object({
  keyword: z.string().min(1),
  mapped_page_slug: z.string().min(1).nullable().optional(),
  live_decision: z.enum(["live", "no_live", "review"]).default("review"),
  usage_type: z.enum(["page", "section_only", "faq_only", "hold"]),
  notes: z.string().nullable().optional(),
  source_cluster: z.string().nullable().optional(),
});
