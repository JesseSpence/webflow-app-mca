import { SeoGroupIndex } from "@/components/seo/SeoGroupIndex";
import { listPublishedPagesByGroup } from "@/lib/content/service";

export default async function SectorsIndexPage() {
  const pages = await listPublishedPagesByGroup("sectors");
  return <SeoGroupIndex title="Sectors" description="Browse MCA sector-specific pages." pages={pages} />;
}
