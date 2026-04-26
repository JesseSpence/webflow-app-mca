import type { MetadataRoute } from "next";

import { env } from "@/lib/env";
import { listAllPublishedIndexablePages } from "@/lib/content/service";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = new URL(env.NEXT_PUBLIC_SITE_URL);
  const pages = await listAllPublishedIndexablePages();

  return pages.map((entry) => ({
    url: new URL(entry.full_path, baseUrl).toString(),
    lastModified: entry.updated_at,
    changeFrequency: "weekly",
    priority: entry.full_path === "/merchant-cash-advance" ? 1 : 0.7,
  }));
}
