import { SeoPathPage } from "@/components/seo/SeoPathPage";
import { buildPageMetadata } from "@/lib/content/metadata";

export async function generateMetadata() {
  return buildPageMetadata("/merchant-cash-advance");
}

export default async function MerchantCashAdvancePage() {
  return <SeoPathPage fullPath="/merchant-cash-advance" />;
}
