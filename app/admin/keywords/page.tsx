import { listKeywordVariants } from "@/lib/admin/queries";
import { adminUpsertKeyword } from "@/lib/admin/actions";
import { StatusBadge } from "@/components/admin/StatusBadge";

export default async function KeywordsPage() {
  const keywords = await listKeywordVariants();

  return (
    <div className="p-8 space-y-6 max-w-6xl">
      <h1 className="text-2xl font-semibold text-gray-900">Keywords</h1>

      {/* Add keyword form */}
      <details className="bg-white border border-gray-200 rounded-lg">
        <summary className="px-5 py-4 cursor-pointer text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg">
          + Add / update keyword
        </summary>
        <form action={adminUpsertKeyword} className="px-5 py-4 border-t border-gray-100 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Keyword *</label>
              <input
                name="keyword"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Mapped page slug</label>
              <input
                name="mapped_page_slug"
                placeholder="e.g. restaurant"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Usage type</label>
              <select
                name="usage_type"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="page">page</option>
                <option value="section_only">section_only</option>
                <option value="faq_only">faq_only</option>
                <option value="hold">hold</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Live decision</label>
              <select
                name="live_decision"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="review">review</option>
                <option value="live">live</option>
                <option value="no_live">no_live</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Source cluster</label>
              <input
                name="source_cluster"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Notes</label>
              <input
                name="notes"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 transition-colors"
          >
            Save keyword
          </button>
        </form>
      </details>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Keyword</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Mapped page</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Usage</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Decision</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Cluster</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {keywords.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                  No keywords yet.
                </td>
              </tr>
            )}
            {keywords.map((kw: Record<string, unknown>) => (
              <tr key={kw.id as string} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-900 font-medium">{kw.keyword as string}</td>
                <td className="px-4 py-3 text-gray-500 text-xs">
                  {(kw.pages as { slug?: string } | null)?.slug ?? "—"}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge value={kw.usage_type as string} />
                </td>
                <td className="px-4 py-3 text-gray-500 text-xs">{kw.live_decision as string}</td>
                <td className="px-4 py-3 text-gray-500 text-xs">{(kw.source_cluster as string) ?? "—"}</td>
                <td className="px-4 py-3 text-gray-400 text-xs">{(kw.notes as string) ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
