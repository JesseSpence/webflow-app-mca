import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { FaqItemRecord, PageRecord, PageSectionRecord } from "@/lib/content/types";

export async function getPublishedPageByPath(fullPath: string) {
  try {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from("pages")
      .select("*")
      .eq("full_path", fullPath)
      .eq("status", "published")
      .maybeSingle<PageRecord>();

    if (error) throw error;
    return data;
  } catch {
    return null;
  }
}

export async function getPageBySlug(slug: string) {
  try {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase.from("pages").select("*").eq("slug", slug).maybeSingle<PageRecord>();
    if (error) throw error;
    return data;
  } catch {
    return null;
  }
}

export async function getPageSections(pageId: string) {
  try {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from("page_sections")
      .select("*")
      .eq("page_id", pageId)
      .order("sort_order", { ascending: true })
      .returns<PageSectionRecord[]>();

    if (error) throw error;
    return data ?? [];
  } catch {
    return [];
  }
}

export async function getPageFaqItems(pageId: string) {
  try {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from("faq_items")
      .select("*")
      .eq("page_id", pageId)
      .order("sort_order", { ascending: true })
      .returns<FaqItemRecord[]>();

    if (error) throw error;
    return data ?? [];
  } catch {
    return [];
  }
}

export async function listPublishedPagesByGroup(pageGroup: string) {
  try {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from("pages")
      .select("*")
      .eq("status", "published")
      .eq("page_group", pageGroup)
      .eq("indexable", true)
      .order("updated_at", { ascending: false })
      .returns<PageRecord[]>();

    if (error) throw error;
    return data ?? [];
  } catch {
    return [];
  }
}

export async function listAllPublishedIndexablePages() {
  try {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from("pages")
      .select("full_path,updated_at")
      .eq("status", "published")
      .eq("indexable", true);

    if (error) throw error;
    return data ?? [];
  } catch {
    return [];
  }
}

export async function writePublishLog(pageId: string | null, actionType: string, payload: unknown) {
  const supabase = createSupabaseServerClient();
  await supabase.from("publish_logs").insert({
    page_id: pageId,
    action_type: actionType,
    payload_json: payload,
    source_system: "internal_api",
  });
}
