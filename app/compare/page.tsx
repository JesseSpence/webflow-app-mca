import { SeoGroupIndex } from "@/components/seo/SeoGroupIndex";
import { listPublishedPagesByGroup } from "@/lib/content/service";

export default async function CompareIndexPage() {
  const pages = await listPublishedPagesByGroup("compare");
  return <SeoGroupIndex title="MCA Comparisons" description="Compare MCA against other funding options." pages={pages} />;
}
