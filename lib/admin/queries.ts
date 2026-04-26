import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { FaqItemRecord, PageRecord, PageSectionRecord } from "@/lib/content/types";

export async function listAllPages() {
  try {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from("pages")
      .select("*")
      .order("updated_at", { ascending: false })
      .returns<PageRecord[]>();
    if (error) throw error;
    return data ?? [];
  } catch {
    return [];
  }
}

export async function getPageWithContent(slug: string) {
  try {
    const supabase = createSupabaseServerClient();
    const { data: page, error } = await supabase
      .from("pages")
      .select("*")
      .eq("slug", slug)
      .maybeSingle<PageRecord>();
    if (error || !page) return null;

    const [{ data: sections }, { data: faqs }] = await Promise.all([
      supabase
        .from("page_sections")
        .select("*")
        .eq("page_id", page.id)
        .order("sort_order", { ascending: true })
        .returns<PageSectionRecord[]>(),
      supabase
        .from("faq_items")
        .select("*")
        .eq("page_id", page.id)
        .order("sort_order", { ascending: true })
        .returns<FaqItemRecord[]>(),
    ]);

    return { page, sections: sections ?? [], faqs: faqs ?? [] };
  } catch {
    return null;
  }
}

export async function listPublishLogs(limit = 50) {
  try {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from("publish_logs")
      .select("*, pages(slug, title)")
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) throw error;
    return data ?? [];
  } catch {
    return [];
  }
}

export async function listKeywordVariants() {
  try {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from("keyword_variants")
      .select("*, pages(slug, title)")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
  } catch {
    return [];
  }
}

export async function getDashboardStats() {
  try {
    const supabase = createSupabaseServerClient();
    const [{ data: pages }, { data: logs }, { data: keywords }] = await Promise.all([
      supabase.from("pages").select("status, page_group"),
      supabase
        .from("publish_logs")
        .select("action_type, created_at, pages(slug, title)")
        .order("created_at", { ascending: false })
        .limit(8),
      supabase.from("keyword_variants").select("usage_type"),
    ]);

    const byStatus = { draft: 0, published: 0, archived: 0 };
    const byGroup: Record<string, number> = {};
    for (const p of pages ?? []) {
      byStatus[p.status as keyof typeof byStatus] =
        (byStatus[p.status as keyof typeof byStatus] ?? 0) + 1;
      byGroup[p.page_group] = (byGroup[p.page_group] ?? 0) + 1;
    }

    return {
      byStatus,
      byGroup,
      totalPages: (pages ?? []).length,
      totalKeywords: (keywords ?? []).length,
      recentLogs: logs ?? [],
    };
  } catch {
    return {
      byStatus: { draft: 0, published: 0, archived: 0 },
      byGroup: {},
      totalPages: 0,
      totalKeywords: 0,
      recentLogs: [],
    };
  }
}

export async function deleteSection(sectionId: string) {
  const supabase = createSupabaseServerClient();
  const { error } = await supabase
    .from("page_sections")
    .delete()
    .eq("id", sectionId);
  if (error) throw error;
}

export async function deleteFaq(faqId: string) {
  const supabase = createSupabaseServerClient();
  const { error } = await supabase.from("faq_items").delete().eq("id", faqId);
  if (error) throw error;
}

export async function deletePage(slug: string) {
  const supabase = createSupabaseServerClient();
  const { error } = await supabase.from("pages").delete().eq("slug", slug);
  if (error) throw error;
}

export async function archivePage(slug: string) {
  const supabase = createSupabaseServerClient();
  const { error } = await supabase
    .from("pages")
    .update({ status: "archived", updated_at: new Date().toISOString() })
    .eq("slug", slug);
  if (error) throw error;
}
