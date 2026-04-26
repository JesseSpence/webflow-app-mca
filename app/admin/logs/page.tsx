import { listPublishLogs } from "@/lib/admin/queries";
import { StatusBadge } from "@/components/admin/StatusBadge";

export default async function LogsPage() {
  const logs = await listPublishLogs(100);

  return (
    <div className="p-8 space-y-6 max-w-5xl">
      <h1 className="text-2xl font-semibold text-gray-900">Publish logs</h1>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Time</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Action</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Page</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Payload preview</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {logs.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-400">
                  No logs yet.
                </td>
              </tr>
            )}
            {logs.map((log: Record<string, unknown>) => (
              <tr key={log.id as string} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">
                  {new Date(log.created_at as string).toLocaleString("en-GB")}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge value={log.action_type as string} />
                </td>
                <td className="px-4 py-3 text-gray-700 text-xs">
                  {(log.pages as { slug?: string; title?: string } | null)?.slug ?? "—"}
                </td>
                <td className="px-4 py-3 text-gray-400 text-xs font-mono">
                  {JSON.stringify(log.payload_json).slice(0, 120)}…
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
