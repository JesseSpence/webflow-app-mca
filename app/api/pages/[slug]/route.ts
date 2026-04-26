import { NextRequest } from "next/server";

import { notFound, ok, serverError, unauthorized } from "@/lib/api";
import { hasValidBearerToken } from "@/lib/auth";
import { getPageFaqItems, getPageBySlug, getPageSections } from "@/lib/content/service";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  if (!hasValidBearerToken(request)) return unauthorized();

  try {
    const { slug } = await params;
    const page = await getPageBySlug(slug);
    if (!page) return notFound("Page not found");

    const [sections, faqs] = await Promise.all([getPageSections(page.id), getPageFaqItems(page.id)]);
    return ok({ page, sections, faqs }, 200);
  } catch (error) {
    return serverError(error instanceof Error ? error.message : "Failed to fetch page");
  }
}
