import type { Metadata } from "next";

import { env } from "@/lib/env";
import { getPublishedPageByPath } from "@/lib/content/service";

export async function buildPageMetadata(fullPath: string): Promise<Metadata> {
  const page = await getPublishedPageByPath(fullPath);
  if (!page) {
    return {
      title: "Page Not Found | MCA Loan UK",
      description: "The requested page is not available.",
      robots: { index: false, follow: false },
    };
  }

  const canonical = page.canonical_url ?? new URL(page.full_path, env.NEXT_PUBLIC_SITE_URL).toString();

  return {
    title: page.meta_title,
    description: page.meta_description,
    alternates: { canonical },
    robots: page.indexable ? { index: true, follow: true } : { index: false, follow: true },
  };
}
