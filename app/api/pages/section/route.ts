import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";

import { badRequest, notFound, ok, serverError, unauthorized } from "@/lib/api";
import { upsertSectionSchema } from "@/lib/api-schemas";
import { hasValidBearerToken } from "@/lib/auth";
import { upsertSectionByPageSlug } from "@/lib/content/mutations";
import { getPageBySlug, writePublishLog } from "@/lib/content/service";

export async function POST(request: NextRequest) {
  if (!hasValidBearerToken(request)) return unauthorized();

  try {
    const body = await request.json();
    const parsed = upsertSectionSchema.safeParse(body);
    if (!parsed.success) {
      return badRequest(parsed.error.message);
    }

    const result = await upsertSectionByPageSlug(parsed.data);
    if (!result) return notFound("Target page not found");

    const page = await getPageBySlug(parsed.data.target_page_slug);
    if (page?.full_path) {
      revalidatePath(page.full_path);
    }

    await writePublishLog(result.pageId, "pages.section.upsert", parsed.data);
    return ok({ section: result.section }, 200);
  } catch (error) {
    return serverError(error instanceof Error ? error.message : "Failed to upsert section");
  }
}
