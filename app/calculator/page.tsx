import { SeoPathPage } from "@/components/seo/SeoPathPage";
import { buildPageMetadata } from "@/lib/content/metadata";

export async function generateMetadata() {
  return buildPageMetadata("/calculator");
}

export default async function CalculatorPage() {
  return <SeoPathPage fullPath="/calculator" />;
}
