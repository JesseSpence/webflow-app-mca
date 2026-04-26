import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";

import { badRequest, ok, serverError, unauthorized } from "@/lib/api";
import { upsertPageSchema } from "@/lib/api-schemas";
import { hasValidBearerToken } from "@/lib/auth";
import { upsertPage } from "@/lib/content/mutations";
import { writePublishLog } from "@/lib/content/service";

export async function POST(request: NextRequest) {
  if (!hasValidBearerToken(request)) return unauthorized();

  try {
    const body = await request.json();
    const parsed = upsertPageSchema.safeParse(body);
    if (!parsed.success) {
      return badRequest(parsed.error.message);
    }

    const page = await upsertPage(parsed.data);
    await writePublishLog(page.id, "pages.upsert", parsed.data);

    if (parsed.data.status === "published" && parsed.data.full_path) {
      revalidatePath(parsed.data.full_path);
    }

    return ok({ page }, 200);
  } catch (error) {
    return serverError(error instanceof Error ? error.message : "Failed to upsert page");
  }
}
