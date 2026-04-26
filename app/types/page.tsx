import { SeoGroupIndex } from "@/components/seo/SeoGroupIndex";
import { listPublishedPagesByGroup } from "@/lib/content/service";

export default async function TypesIndexPage() {
  const pages = await listPublishedPagesByGroup("types");
  return <SeoGroupIndex title="MCA Types" description="Browse merchant cash advance type pages." pages={pages} />;
}
