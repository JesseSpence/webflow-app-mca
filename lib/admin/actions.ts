"use server";

import { revalidatePath } from "next/cache";
import {
  upsertPage,
  upsertSectionByPageSlug,
  insertFaqByPageSlug,
  publishPageBySlug,
} from "@/lib/content/mutations";
import {
  deleteSection,
  deleteFaq,
  deletePage,
  archivePage,
} from "@/lib/admin/queries";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { writePublishLog } from "@/lib/content/service";

export async function adminUpsertPage(formData: FormData) {
  const slug = formData.get("slug") as string;
  const indexable = formData.get("indexable") === "true";

  const input = {
    slug,
    full_path: formData.get("full_path") as string,
    page_template: formData.get("page_template") as string,
    page_group: formData.get("page_group") as string,
    title: formData.get("title") as string,
    meta_title: formData.get("meta_title") as string,
    meta_description: formData.get("meta_description") as string,
    h1: formData.get("h1") as string,
    intro_html: (formData.get("intro_html") as string) || null,
    body_html: (formData.get("body_html") as string) || null,
    canonical_url: (formData.get("canonical_url") as string) || null,
    status: (formData.get("status") as "draft" | "published" | "archived") ?? "draft",
    indexable,
    publish_mode: (formData.get("publish_mode") as "page") ?? "page",
  };

  const page = await upsertPage(input);
  await writePublishLog(page.id, "admin_upsert_page", input);
  revalidatePath("/admin/pages");
  revalidatePath(input.full_path);
}

export async function adminUpsertSection(formData: FormData) {
  const target_page_slug = formData.get("target_page_slug") as string;
  const input = {
    target_page_slug,
    section_key: formData.get("section_key") as string,
    section_label: (formData.get("section_label") as string) || null,
    heading: (formData.get("heading") as string) || null,
    content_html: formData.get("content_html") as string,
    keyword_theme: (formData.get("keyword_theme") as string) || null,
    sort_order: Number(formData.get("sort_order") ?? 0),
  };

  await upsertSectionByPageSlug(input);
  revalidatePath(`/admin/pages/${target_page_slug}`);
  return { ok: true };
}

export async function adminUpsertFaq(formData: FormData) {
  const target_page_slug = formData.get("target_page_slug") as string;
  const input = {
    target_page_slug,
    question: formData.get("question") as string,
    answer_html: formData.get("answer_html") as string,
    schema_enabled: formData.get("schema_enabled") === "true",
  };

  await insertFaqByPageSlug(input);
  revalidatePath(`/admin/pages/${target_page_slug}`);
  return { ok: true };
}

export async function adminPublishPage(slug: string): Promise<void> {
  const page = await publishPageBySlug(slug);
  if (page) {
    await writePublishLog(page.id, "admin_publish", { slug });
    revalidatePath(page.full_path);
  }
  revalidatePath("/admin/pages");
}

export async function adminArchivePage(slug: string): Promise<void> {
  await archivePage(slug);
  revalidatePath("/admin/pages");
}

export async function adminDeletePage(slug: string): Promise<void> {
  await deletePage(slug);
  revalidatePath("/admin/pages");
}

export async function adminDeleteSection(sectionId: string, pageSlug: string): Promise<void> {
  await deleteSection(sectionId);
  revalidatePath(`/admin/pages/${pageSlug}`);
}

export async function adminDeleteFaq(faqId: string, pageSlug: string): Promise<void> {
  await deleteFaq(faqId);
  revalidatePath(`/admin/pages/${pageSlug}`);
}

export async function adminUpsertKeyword(formData: FormData): Promise<void> {
  const supabase = createSupabaseServerClient();
  const keyword = formData.get("keyword") as string;
  const mapped_page_slug = (formData.get("mapped_page_slug") as string) || null;

  let mappedPageId: string | null = null;
  if (mapped_page_slug) {
    const { data } = await supabase
      .from("pages")
      .select("id")
      .eq("slug", mapped_page_slug)
      .maybeSingle<{ id: string }>();
    mappedPageId = data?.id ?? null;
  }

  await supabase
    .from("keyword_variants")
    .upsert(
      {
        keyword,
        mapped_page_id: mappedPageId,
        live_decision: formData.get("live_decision") as string,
        usage_type: formData.get("usage_type") as string,
        notes: (formData.get("notes") as string) || null,
        source_cluster: (formData.get("source_cluster") as string) || null,
      },
      { onConflict: "keyword" },
    );

  revalidatePath("/admin/keywords");
}
