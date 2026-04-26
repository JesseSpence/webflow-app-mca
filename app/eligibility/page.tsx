import { SeoPathPage } from "@/components/seo/SeoPathPage";
import { buildPageMetadata } from "@/lib/content/metadata";

export async function generateMetadata() {
  return buildPageMetadata("/eligibility");
}

export default async function EligibilityPage() {
  return <SeoPathPage fullPath="/eligibility" />;
}
