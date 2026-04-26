import { SeoPathPage } from "@/components/seo/SeoPathPage";
import { buildPageMetadata } from "@/lib/content/metadata";

export async function generateMetadata({ params }: { params: Promise<{ sector: string }> }) {
  const { sector } = await params;
  return buildPageMetadata(`/sectors/${sector}`);
}

export default async function SectorDetailPage({ params }: { params: Promise<{ sector: string }> }) {
  const { sector } = await params;
  return <SeoPathPage fullPath={`/sectors/${sector}`} />;
}
