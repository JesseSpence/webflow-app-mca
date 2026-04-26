import { SeoGroupIndex } from "@/components/seo/SeoGroupIndex";
import { listPublishedPagesByGroup } from "@/lib/content/service";

export default async function UseCasesIndexPage() {
  const pages = await listPublishedPagesByGroup("use-cases");
  return <SeoGroupIndex title="Use Cases" description="How businesses use MCA funding in practice." pages={pages} />;
}
