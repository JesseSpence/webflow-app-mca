import { SeoGroupIndex } from "@/components/seo/SeoGroupIndex";
import { listPublishedPagesByGroup } from "@/lib/content/service";

export default async function FaqIndexPage() {
  const pages = await listPublishedPagesByGroup("faqs");
  return <SeoGroupIndex title="MCA FAQs" description="Frequently asked questions about MCA funding." pages={pages} />;
}
