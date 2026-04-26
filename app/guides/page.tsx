import { SeoGroupIndex } from "@/components/seo/SeoGroupIndex";
import { listPublishedPagesByGroup } from "@/lib/content/service";

export default async function GuidesIndexPage() {
  const pages = await listPublishedPagesByGroup("guides");
  return <SeoGroupIndex title="MCA Guides" description="Guides and education for merchant cash advances." pages={pages} />;
}
