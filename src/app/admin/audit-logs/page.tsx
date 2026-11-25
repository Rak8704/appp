"use client";

import { useCallback, useEffect, useState } from "react";

type AuditUser = {
  id: string;
  name: string;
  email: string;
  role: string;
};

type AuditLog = {
  id: string;
  userId: string | null;
  action: string;
  entity: string | null;
  entityId: string | null;
  details: unknown;
  ipAddress: string | null;
  createdAt: string;
  user: AuditUser | null;
};

type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 30,
    total: 0,
    totalPages: 1,
  });
  const [action, setAction] = useState("");
  const [entity, setEntity] = useState("");
  const [userId, setUserId] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<AuditLog | null>(null);

  const loadLogs = useCallback(async (page = 1) => {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: "30",
      });

      if (action.trim()) params.set("action", action.trim());
      if (entity.trim()) params.set("entity", entity.trim());
      if (userId.trim()) params.set("userId", userId.trim());
      if (from) params.set("from", from);
      if (to) params.set("to", to);

      const response = await fetch(`/api/admin/audit-logs?${params}`, {
        cache: "no-store",
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Audit Logs লোড করা যায়নি");
      }

      setLogs(result.data || []);
      setPagination(result.pagination || {
        page,
        limit: 30,
        total: 0,
        totalPages: 1,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Audit Logs লোড করতে সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  }, [action, entity, userId, from, to]);

  useEffect(() => {
    loadLogs(1);
  }, [loadLogs]);

  function clearFilters() {
    setAction("");
    setEntity("");
    setUserId("");
    setFrom("");
    setTo("");
  }

  function formatDetails(details: unknown) {
    if (details === null || details === undefined) return "কোনো Details নেই";
    if (typeof details === "string") return details;
    try {
      return JSON.stringify(details, null, 2);
    } catch {
      return String(details);
    }
  }

  return (
    <main className="space-y-6 p-4 md:p-7">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Audit Logs</h1>
          <p className="mt-1 text-sm text-gray-500">Admin Panel-এর কার্যক্রম ও পরিবর্তনের ইতিহাস দেখুন</p>
        </div>
        <button onClick={() => loadLogs(pagination.page)} className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50">
          ↻ Refresh Logs
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border bg-white p-5">
          <p className="text-sm text-gray-500">মোট Activity</p>
          <p className="mt-2 text-3xl font-bold">{pagination.total}</p>
        </div>
        <div className="rounded-xl border bg-white p-5">
          <p className="text-sm text-gray-500">বর্তমান পেজ</p>
          <p className="mt-2 text-3xl font-bold">{pagination.page} / {pagination.totalPages || 1}</p>
        </div>
        <div className="rounded-xl border bg-white p-5">
          <p className="text-sm text-gray-500">এই পেজে Activity</p>
          <p className="mt-2 text-3xl font-bold">{logs.length}</p>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <section className="rounded-xl border bg-white p-5">
        <div className="mb-4">
          <h2 className="font-semibold">Filter Activities</h2>
          <p className="mt-1 text-sm text-gray-500">Action, Entity, User এবং Date অনুযায়ী খুঁজুন</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-600">Action</label>
            <input value={action} onChange={(e) => setAction(e.target.value)} placeholder="যেমন CREATE, UPDATE, DELETE" className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-600">Entity</label>
            <input value={entity} onChange={(e) => setEntity(e.target.value)} placeholder="যেমন Article, User, Settings" className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-600">User ID</label>
            <input value={userId} onChange={(e) => setUserId(e.target.value)} placeholder="Admin User ID" className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-600">From Date</label>
            <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-600">To Date</label>
            <input type="date" value={to} onChange={(e) => setTo(e.target.value)} min={from || undefined} className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-blue-500" />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap justify-end gap-2">
          <button onClick={clearFilters} className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50">Clear Filters</button>
          <button onClick={() => loadLogs(1)} disabled={loading} className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50">
            {loading ? "Searching..." : "Apply Filters"}
          </button>
        </div>
      </section>

      <section className="overflow-hidden rounded-xl border bg-white">
        <div className="border-b p-4">
          <h2 className="font-semibold">Activity History</h2>
          <p className="mt-1 text-sm text-gray-500">সর্বশেষ কার্যক্রম আগে দেখানো হচ্ছে</p>
        </div>

        {loading ? (
          <div className="p-12 text-center text-gray-500">Loading audit logs...</div>
        ) : logs.length === 0 ? (
          <div className="p-12 text-center text-gray-500">কোনো Audit Log পাওয়া যায়নি।</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-5 py-3">Admin</th>
                  <th className="px-5 py-3">Action</th>
                  <th className="px-5 py-3">Entity</th>
                  <th className="px-5 py-3">IP Address</th>
                  <th className="px-5 py-3">Date & Time</th>
                  <th className="px-5 py-3 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-5 py-4">
                      <p className="font-medium text-gray-900">{log.user?.name || "Unknown User"}</p>
                      <p className="text-xs text-gray-500">{log.user?.email || log.userId || "System"}</p>
                      {log.user?.role && <p className="mt-1 text-xs text-gray-400">{log.user.role}</p>}
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">{log.action}</span>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-medium">{log.entity || "—"}</p>
                      <p className="max-w-[160px] truncate text-xs text-gray-400">{log.entityId || ""}</p>
                    </td>
                    <td className="px-5 py-4 text-gray-500">{log.ipAddress || "—"}</td>
                    <td className="whitespace-nowrap px-5 py-4 text-gray-500">{new Date(log.createdAt).toLocaleString("bn-BD")}</td>
                    <td className="px-5 py-4 text-right">
                      <button onClick={() => setSelected(log)} className="rounded-lg border px-3 py-2 text-xs font-semibold hover:bg-gray-100">View Details</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex flex-col justify-between gap-3 border-t p-4 text-sm sm:flex-row sm:items-center">
          <span className="text-gray-500">মোট {pagination.total} টি Activity</span>
          <div className="flex items-center gap-2">
            <button disabled={pagination.page <= 1 || loading} onClick={() => loadLogs(pagination.page - 1)} className="rounded-lg border px-3 py-2 disabled:opacity-40">Previous</button>
            <span className="px-2 text-gray-600">{pagination.page} / {pagination.totalPages || 1}</span>
            <button disabled={pagination.page >= pagination.totalPages || loading} onClick={() => loadLogs(pagination.page + 1)} className="rounded-lg border px-3 py-2 disabled:opacity-40">Next</button>
          </div>
        </div>
      </section>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold">Activity Details</h2>
                <p className="mt-1 text-xs text-gray-500">Audit ID: {selected.id}</p>
              </div>
              <button onClick={() => setSelected(null)} className="rounded-lg px-3 py-1 text-xl hover:bg-gray-100">×</button>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg bg-gray-50 p-3">
                <p className="text-xs text-gray-500">Admin</p>
                <p className="mt-1 font-semibold">{selected.user?.name || "Unknown User"}</p>
                <p className="text-xs text-gray-500">{selected.user?.email || selected.userId || "System"}</p>
              </div>
              <div className="rounded-lg bg-gray-50 p-3">
                <p className="text-xs text-gray-500">Action</p>
                <p className="mt-1 font-semibold">{selected.action}</p>
              </div>
              <div className="rounded-lg bg-gray-50 p-3">
                <p className="text-xs text-gray-500">Entity</p>
                <p className="mt-1 font-semibold">{selected.entity || "—"}</p>
                <p className="break-all text-xs text-gray-500">{selected.entityId || ""}</p>
              </div>
              <div className="rounded-lg bg-gray-50 p-3">
                <p className="text-xs text-gray-500">IP Address</p>
                <p className="mt-1 font-semibold">{selected.ipAddress || "—"}</p>
              </div>
              <div className="rounded-lg bg-gray-50 p-3 sm:col-span-2">
                <p className="text-xs text-gray-500">Date & Time</p>
                <p className="mt-1 font-semibold">{new Date(selected.createdAt).toLocaleString("bn-BD")}</p>
              </div>
            </div>

            <div className="mt-5">
              <p className="mb-2 text-sm font-semibold">Details Data</p>
              <pre className="max-h-72 overflow-auto whitespace-pre-wrap break-words rounded-lg bg-gray-950 p-4 text-xs text-green-300">{formatDetails(selected.details)}</pre>
            </div>

            <div className="mt-5 flex justify-end">
              <button onClick={() => setSelected(null)} className="rounded-lg bg-gray-900 px-5 py-2 text-sm font-semibold text-white">Close</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}