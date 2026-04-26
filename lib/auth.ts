import { NextRequest } from "next/server";

import { env } from "@/lib/env";

export function hasValidBearerToken(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader) {
    return false;
  }

  const [scheme, token] = authHeader.split(" ");
  return scheme?.toLowerCase() === "bearer" && token === env.INTERNAL_API_BEARER_TOKEN;
}
