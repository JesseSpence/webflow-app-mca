import Link from "next/link";
import { listAllPages } from "@/lib/admin/queries";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { adminPublishPage, adminArchivePage } from "@/lib/admin/actions";

export default async function AdminPagesIndex() {
  const pages = await listAllPages();

  return (
    <div className="p-8 space-y-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Pages</h1>
        <Link
          href="/admin/pages/new"
          className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 transition-colors"
        >
          + New page
        </Link>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Title / slug</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Template</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Status</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Mode</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Updated</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {pages.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                  No pages yet.{" "}
                  <Link href="/admin/pages/new" className="text-indigo-600 hover:underline">
                    Create one →
                  </Link>
                </td>
              </tr>
            )}
            {pages.map((page) => (
              <tr key={page.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="font-medium text-gray-900">{page.title}</div>
                  <div className="text-gray-400 text-xs mt-0.5">{page.full_path}</div>
                </td>
                <td className="px-4 py-3">
                  <span className="text-gray-600">{page.page_template}</span>
                </td>
                <td className="px-4 py-3">
                  <StatusBadge value={page.status} />
                  {!page.indexable && (
                    <span className="ml-1 text-xs text-gray-400">noindex</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge value={page.publish_mode} />
                </td>
                <td className="px-4 py-3 text-gray-400 text-xs">
                  {new Date(page.updated_at).toLocaleDateString("en-GB")}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/pages/${page.slug}`}
                      className="text-indigo-600 hover:underline text-xs"
                    >
                      Edit
                    </Link>
                    {page.status === "draft" && (
                      <form action={adminPublishPage.bind(null, page.slug)}>
                        <button type="submit" className="text-green-600 hover:underline text-xs">
                          Publish
                        </button>
                      </form>
                    )}
                    {page.status === "published" && (
                      <form action={adminArchivePage.bind(null, page.slug)}>
                        <button type="submit" className="text-gray-500 hover:underline text-xs">
                          Archive
                        </button>
                      </form>
                    )}
                    <a
                      href={page.full_path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:underline text-xs"
                    >
                      View ↗
                    </a>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
