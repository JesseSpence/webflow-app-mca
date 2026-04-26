import { NextRequest } from "next/server";

import { badRequest, ok, serverError, unauthorized } from "@/lib/api";
import { upsertKeywordSchema } from "@/lib/api-schemas";
import { hasValidBearerToken } from "@/lib/auth";
import { upsertKeywordVariant } from "@/lib/content/mutations";
import { writePublishLog } from "@/lib/content/service";

export async function POST(request: NextRequest) {
  if (!hasValidBearerToken(request)) return unauthorized();

  try {
    const body = await request.json();
    const parsed = upsertKeywordSchema.safeParse(body);
    if (!parsed.success) {
      return badRequest(parsed.error.message);
    }

    const keywordVariant = await upsertKeywordVariant(parsed.data);
    await writePublishLog(keywordVariant.mapped_page_id ?? null, "keywords.upsert", parsed.data);
    return ok({ keyword_variant: keywordVariant }, 200);
  } catch (error) {
    return serverError(error instanceof Error ? error.message : "Failed to upsert keyword");
  }
}
