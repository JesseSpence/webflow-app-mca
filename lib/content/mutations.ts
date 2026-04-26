import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { PublishMode } from "@/lib/content/types";

interface UpsertPageInput {
  slug: string;
  full_path: string;
  page_template: string;
  page_group: string;
  title: string;
  meta_title: string;
  meta_description: string;
  h1: string;
  intro_html?: string | null;
  body_html?: string | null;
  canonical_url?: string | null;
  status: "draft" | "published" | "archived";
  indexable: boolean;
  publish_mode: PublishMode;
}

export async function upsertPage(input: UpsertPageInput) {
  const supabase = createSupabaseServerClient();
  const payload = {
    ...input,
    updated_at: new Date().toISOString(),
    published_at: input.status === "published" ? new Date().toISOString() : null,
  };

  const { data, error } = await supabase
    .from("pages")
    .upsert(payload, { onConflict: "slug" })
    .select("*")
    .single();

  if (error) throw error;
  return data;
}

export async function upsertSectionByPageSlug(input: {
  target_page_slug: string;
  section_key: string;
  section_label?: string | null;
  heading?: string | null;
  content_html: string;
  keyword_theme?: string | null;
  sort_order: number;
}) {
  const supabase = createSupabaseServerClient();
  const { data: page, error: pageError } = await supabase
    .from("pages")
    .select("id")
    .eq("slug", input.target_page_slug)
    .maybeSingle<{ id: string }>();

  if (pageError) throw pageError;
  if (!page) return null;

  const payload = {
    page_id: page.id,
    section_key: input.section_key,
    section_label: input.section_label ?? null,
    heading: input.heading ?? null,
    content_html: input.content_html,
    keyword_theme: input.keyword_theme ?? null,
    sort_order: input.sort_order,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("page_sections")
    .upsert(payload, { onConflict: "page_id,section_key" })
    .select("*")
    .single();

  if (error) throw error;
  return { pageId: page.id, section: data };
}

export async function insertFaqByPageSlug(input: {
  target_page_slug: string;
  question: string;
  answer_html: string;
  schema_enabled: boolean;
}) {
  const supabase = createSupabaseServerClient();
  const { data: page, error: pageError } = await supabase
    .from("pages")
    .select("id")
    .eq("slug", input.target_page_slug)
    .maybeSingle<{ id: string }>();

  if (pageError) throw pageError;
  if (!page) return null;

  const { data: maxSort } = await supabase
    .from("faq_items")
    .select("sort_order")
    .eq("page_id", page.id)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle<{ sort_order: number }>();

  const { data, error } = await supabase
    .from("faq_items")
    .insert({
      page_id: page.id,
      question: input.question,
      answer_html: input.answer_html,
      schema_enabled: input.schema_enabled,
      sort_order: (maxSort?.sort_order ?? -1) + 1,
    })
    .select("*")
    .single();

  if (error) throw error;
  return { pageId: page.id, faq: data };
}

export async function publishPageBySlug(slug: string) {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("pages")
    .update({
      status: "published",
      published_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("slug", slug)
    .select("*")
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function upsertKeywordVariant(input: {
  keyword: string;
  mapped_page_slug?: string | null;
  live_decision: string;
  usage_type: PublishMode;
  notes?: string | null;
  source_cluster?: string | null;
}) {
  const supabase = createSupabaseServerClient();
  let mappedPageId: string | null = null;

  if (input.mapped_page_slug) {
    const { data: page } = await supabase
      .from("pages")
      .select("id")
      .eq("slug", input.mapped_page_slug)
      .maybeSingle<{ id: string }>();
    mappedPageId = page?.id ?? null;
  }

  const { data, error } = await supabase
    .from("keyword_variants")
    .upsert(
      {
        keyword: input.keyword,
        mapped_page_id: mappedPageId,
        live_decision: input.live_decision,
        usage_type: input.usage_type,
        notes: input.notes ?? null,
        source_cluster: input.source_cluster ?? null,
      },
      { onConflict: "keyword" },
    )
    .select("*")
    .single();

  if (error) throw error;
  return data;
}
