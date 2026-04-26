import { SeoPathPage } from "@/components/seo/SeoPathPage";
import { buildPageMetadata } from "@/lib/content/metadata";

export async function generateMetadata({ params }: { params: Promise<{ type: string }> }) {
  const { type } = await params;
  return buildPageMetadata(`/types/${type}`);
}

export default async function TypeDetailPage({ params }: { params: Promise<{ type: string }> }) {
  const { type } = await params;
  return <SeoPathPage fullPath={`/types/${type}`} />;
}
