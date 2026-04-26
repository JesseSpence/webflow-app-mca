import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";

import { badRequest, ok, serverError, unauthorized } from "@/lib/api";
import { revalidateSchema } from "@/lib/api-schemas";
import { hasValidBearerToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  if (!hasValidBearerToken(request)) return unauthorized();

  try {
    const body = await request.json();
    const parsed = revalidateSchema.safeParse(body);
    if (!parsed.success) {
      return badRequest(parsed.error.message);
    }

    revalidatePath(parsed.data.full_path);
    return ok({ revalidated: true, path: parsed.data.full_path }, 200);
  } catch (error) {
    return serverError(error instanceof Error ? error.message : "Failed to revalidate route");
  }
}
