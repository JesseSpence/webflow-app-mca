import { SeoPathPage } from "@/components/seo/SeoPathPage";
import { buildPageMetadata } from "@/lib/content/metadata";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return buildPageMetadata(`/use-cases/${slug}`);
}

export default async function UseCaseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <SeoPathPage fullPath={`/use-cases/${slug}`} />;
}
