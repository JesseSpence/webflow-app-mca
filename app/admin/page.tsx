import Link from "next/link";
import { getDashboardStats } from "@/lib/admin/queries";
import { StatusBadge } from "@/components/admin/StatusBadge";

export default async function AdminDashboard() {
  const stats = await getDashboardStats();

  return (
    <div className="p-8 space-y-8 max-w-5xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <Link
          href="/admin/pages/new"
          className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 transition-colors"
        >
          + New page
        </Link>
      </div>

      {/* Status summary */}
      <div className="grid grid-cols-3 gap-4">
        {(["published", "draft", "archived"] as const).map((s) => (
          <div key={s} className="bg-white rounded-lg border border-gray-200 p-5">
            <p className="text-sm text-gray-500 capitalize">{s}</p>
            <p className="text-3xl font-semibold text-gray-900 mt-1">{stats.byStatus[s]}</p>
          </div>
        ))}
      </div>

      {/* By group */}
      {Object.keys(stats.byGroup).length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <h2 className="text-sm font-medium text-gray-700 mb-3">Pages by group</h2>
          <div className="flex flex-wrap gap-3">
            {Object.entries(stats.byGroup).map(([group, count]) => (
              <div key={group} className="flex items-center gap-2 text-sm">
                <span className="text-gray-500">{group}</span>
                <span className="font-semibold text-gray-900">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent activity */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-medium text-gray-700">Recent activity</h2>
        </div>
        {stats.recentLogs.length === 0 ? (
          <p className="px-5 py-8 text-sm text-gray-400">No activity yet.</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {stats.recentLogs.map((log: Record<string, unknown>, i: number) => (
              <li key={i} className="px-5 py-3 flex items-center justify-between text-sm">
                <div className="flex items-center gap-3">
                  <StatusBadge value={log.action_type as string} />
                  <span className="text-gray-700">
                    {(log.pages as { slug?: string } | null)?.slug ?? "—"}
                  </span>
                </div>
                <span className="text-gray-400 text-xs">
                  {new Date(log.created_at as string).toLocaleString("en-GB")}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Quick links */}
      <div className="flex gap-4 text-sm">
        <Link href="/admin/pages" className="text-indigo-600 hover:underline">All pages →</Link>
        <Link href="/admin/keywords" className="text-indigo-600 hover:underline">Keywords →</Link>
        <Link href="/admin/logs" className="text-indigo-600 hover:underline">Publish logs →</Link>
      </div>
    </div>
  );
}
