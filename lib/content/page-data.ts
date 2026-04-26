import { getPageFaqItems, getPageSections, getPublishedPageByPath } from "@/lib/content/service";

export async function getRenderablePageData(fullPath: string) {
  const page = await getPublishedPageByPath(fullPath);
  if (!page) return null;

  const [sections, faqs] = await Promise.all([getPageSections(page.id), getPageFaqItems(page.id)]);
  return { page, sections, faqs };
}
