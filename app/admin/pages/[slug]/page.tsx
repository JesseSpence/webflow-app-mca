import Link from "next/link";
import { notFound } from "next/navigation";
import { getPageWithContent } from "@/lib/admin/queries";
import { PageForm } from "@/components/admin/PageForm";
import { SectionEditor } from "@/components/admin/SectionEditor";
import { FaqEditor } from "@/components/admin/FaqEditor";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { adminPublishPage } from "@/lib/admin/actions";

export default async function EditPageRoute({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getPageWithContent(slug);
  if (!data) notFound();

  const { page, sections, faqs } = data;

  return (
    <div className="p-8 max-w-3xl space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/pages" className="text-sm text-gray-500 hover:text-gray-700">
            ← Pages
          </Link>
          <h1 className="text-2xl font-semibold text-gray-900">{page.title}</h1>
          <StatusBadge value={page.status} />
        </div>
        <div className="flex gap-2">
          {page.status === "draft" && (
            <form action={adminPublishPage.bind(null, slug)}>
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors"
              >
                Publish
              </button>
            </form>
          )}
          <a
            href={page.full_path}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-50 transition-colors"
          >
            View ↗
          </a>
        </div>
      </div>

      {/* Page metadata form */}
      <PageForm page={page} />

      <hr className="border-gray-200" />

      {/* Sections */}
      <SectionEditor pageSlug={slug} sections={sections} />

      <hr className="border-gray-200" />

      {/* FAQs */}
      <FaqEditor pageSlug={slug} faqs={faqs} />
    </div>
  );
}
