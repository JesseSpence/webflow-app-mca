import { notFound } from "next/navigation";

import { SeoPageRenderer } from "@/components/seo/SeoPageRenderer";
import { getRenderablePageData } from "@/lib/content/page-data";

export async function SeoPathPage({ fullPath }: { fullPath: string }) {
  const payload = await getRenderablePageData(fullPath);
  if (!payload) notFound();

  return <SeoPageRenderer page={payload.page} sections={payload.sections} faqs={payload.faqs} />;
}
