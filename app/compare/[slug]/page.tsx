import { SeoPathPage } from "@/components/seo/SeoPathPage";
import { buildPageMetadata } from "@/lib/content/metadata";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return buildPageMetadata(`/compare/${slug}`);
}

export default async function CompareDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <SeoPathPage fullPath={`/compare/${slug}`} />;
}
