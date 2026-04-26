import { SeoPathPage } from "@/components/seo/SeoPathPage";
import { buildPageMetadata } from "@/lib/content/metadata";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return buildPageMetadata(`/guides/${slug}`);
}

export default async function GuideDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <SeoPathPage fullPath={`/guides/${slug}`} />;
}
