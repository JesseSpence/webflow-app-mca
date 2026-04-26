import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";

import { badRequest, notFound, ok, serverError, unauthorized } from "@/lib/api";
import { publishPageSchema } from "@/lib/api-schemas";
import { hasValidBearerToken } from "@/lib/auth";
import { publishPageBySlug } from "@/lib/content/mutations";
import { writePublishLog } from "@/lib/content/service";

export async function POST(request: NextRequest) {
  if (!hasValidBearerToken(request)) return unauthorized();

  try {
    const body = await request.json();
    const parsed = publishPageSchema.safeParse(body);
    if (!parsed.success) {
      return badRequest(parsed.error.message);
    }

    const page = await publishPageBySlug(parsed.data.slug);
    if (!page) return notFound("Page not found");

    if (page.full_path) {
      revalidatePath(page.full_path);
    }

    await writePublishLog(page.id, "pages.publish", parsed.data);
    return ok({ page }, 200);
  } catch (error) {
    return serverError(error instanceof Error ? error.message : "Failed to publish page");
  }
}
