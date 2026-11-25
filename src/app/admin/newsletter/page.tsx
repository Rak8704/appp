
"use client";

import { useCallback, useEffect, useState } from "react";

type Subscriber = {
  id: string;
  email: string;
  status: "ACTIVE" | "UNSUBSCRIBED";
  subscribedAt: string;
  unsubscribedAt: string | null;
  updatedAt: string;
};

type ApiResponse = {
  success: boolean;
  message?: string;
  data?: Subscriber[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

const inputClass =
  "w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 outline-none transition focus:border-red-500 dark:border-gray-700 dark:bg-[#191e29] dark:text-gray-100";

const buttonClass =
  "rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50";

export default function NewsletterPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadSubscribers = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: "20",
      });

      if (search.trim()) params.set("search", search.trim());
      if (status) params.set("status", status);

      const response = await fetch(
        `/api/admin/newsletter?${params.toString()}`,
        { cache: "no-store" }
      );

      const result: ApiResponse = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Subscriber load করা যায়নি");
      }

      setSubscribers(result.data || []);
      setTotal(result.pagination?.total || 0);
      setTotalPages(Math.max(1, result.pagination?.totalPages || 1));
    } catch (err) {
      setError(err instanceof Error ? err.message : "একটি সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  }, [page, search, status]);

  useEffect(() => {
    void loadSubscribers();
  }, [loadSubscribers]);

  async function updateStatus(item: Subscriber) {
    const nextStatus =
      item.status === "ACTIVE" ? "UNSUBSCRIBED" : "ACTIVE";

    setBusyId(item.id);
    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/admin/newsletter", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: item.id, status: nextStatus }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Status update করা যায়নি");
      }

      setMessage("Subscriber status update হয়েছে");
      await loadSubscribers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setBusyId("");
    }
  }

  async function deleteSubscriber(item: Subscriber) {
    if (!window.confirm(`${item.email} subscriber-কে delete করতে চান?`)) {
      return;
    }

    setBusyId(item.id);
    setMessage("");
    setError("");

    try {
      const response = await fetch(
        `/api/admin/newsletter?id=${encodeURIComponent(item.id)}`,
        { method: "DELETE" }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Delete করা যায়নি");
      }

      setMessage("Subscriber delete হয়েছে");

      if (subscribers.length === 1 && page > 1) {
        setPage((current) => current - 1);
      } else {
        await loadSubscribers();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setBusyId("");
    }
  }

  const activeCount = subscribers.filter(
    (item) => item.status === "ACTIVE"
  ).length;

  const inactiveCount = subscribers.filter(
    (item) => item.status === "UNSUBSCRIBED"
  ).length;

  return (
    <div className="min-h-screen space-y-6 bg-gray-50 p-4 text-gray-900 dark:bg-[#11151e] dark:text-gray-100 sm:p-6 lg:p-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-medium text-red-600">ADMIN / NEWSLETTER</p>
          <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
            Newsletter Management
          </h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Newsletter subscriber পরিচালনা ও status নিয়ন্ত্রণ করুন।
          </p>
        </div>

        <button
          onClick={() => void loadSubscribers()}
          className={`${buttonClass} bg-red-600 text-white hover:bg-red-700`}
        >
          ↻ Refresh
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="মোট Subscriber" value={total} />
        <StatCard title="এই পেজে Active" value={activeCount} />
        <StatCard title="এই পেজে Unsubscribed" value={inactiveCount} />
      </div>

      {message && <Notice type="success" text={message} />}
      {error && <Notice type="error" text={error} />}

      <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-[#191e29] sm:p-6">
        <div className="mb-5 flex flex-col gap-3 lg:flex-row">
          <input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Email দিয়ে খুঁজুন..."
            className={inputClass}
          />

          <select
            value={status}
            onChange={(event) => {
              setStatus(event.target.value);
              setPage(1);
            }}
            className={`${inputClass} lg:max-w-52`}
          >
            <option value="">সব Status</option>
            <option value="ACTIVE">Active</option>
            <option value="UNSUBSCRIBED">Unsubscribed</option>
          </select>
        </div>

        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-bold">Subscriber List</h2>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            মোট {total} জন
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-xs uppercase text-gray-500 dark:border-gray-700">
                <th className="px-3 py-3">Email</th>
                <th className="px-3 py-3">Status</th>
                <th className="px-3 py-3">Subscribed</th>
                <th className="px-3 py-3">Unsubscribed</th>
                <th className="px-3 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-500">
                    Loading subscribers...
                  </td>
                </tr>
              ) : subscribers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-500">
                    কোনো subscriber পাওয়া যায়নি।
                  </td>
                </tr>
              ) : (
                subscribers.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-gray-100 last:border-0 dark:border-gray-800"
                  >
                    <td className="px-3 py-4 font-medium">{item.email}</td>
                    <td className="px-3 py-4">
                      <StatusBadge
                        active={item.status === "ACTIVE"}
                        activeText="Active"
                        inactiveText="Unsubscribed"
                      />
                    </td>
                    <td className="px-3 py-4 text-gray-500 dark:text-gray-400">
                      {formatDate(item.subscribedAt)}
                    </td>
                    <td className="px-3 py-4 text-gray-500 dark:text-gray-400">
                      {item.unsubscribedAt
                        ? formatDate(item.unsubscribedAt)
                        : "—"}
                    </td>
                    <td className="px-3 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          disabled={busyId === item.id}
                          onClick={() => void updateStatus(item)}
                          className={`${buttonClass} ${
                            item.status === "ACTIVE"
                              ? "bg-amber-50 text-amber-700 hover:bg-amber-100 dark:bg-amber-950/40 dark:text-amber-300"
                              : "bg-green-50 text-green-700 hover:bg-green-100 dark:bg-green-950/40 dark:text-green-300"
                          }`}
                        >
                          {busyId === item.id
                            ? "..."
                            : item.status === "ACTIVE"
                              ? "Unsubscribe"
                              : "Activate"}
                        </button>
                        <button
                          disabled={busyId === item.id}
                          onClick={() => void deleteSubscriber(item)}
                          className={`${buttonClass} bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-950/40 dark:text-red-300`}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          page={page}
          totalPages={totalPages}
          onChange={setPage}
        />
      </section>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-[#191e29]">
      <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
      <p className="mt-2 text-3xl font-bold">{value.toLocaleString("en-US")}</p>
    </div>
  );
}

function StatusBadge({
  active,
  activeText,
  inactiveText,
}: {
  active: boolean;
  activeText: string;
  inactiveText: string;
}) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
        active
          ? "bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-300"
          : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
      }`}
    >
      {active ? activeText : inactiveText}
    </span>
  );
}

function Notice({ type, text }: { type: "success" | "error"; text: string }) {
  return (
    <div
      className={`rounded-xl border px-4 py-3 text-sm ${
        type === "success"
          ? "border-green-200 bg-green-50 text-green-700 dark:border-green-900 dark:bg-green-950/30 dark:text-green-300"
          : "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300"
      }`}
    >
      {text}
    </div>
  );
}

function Pagination({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}) {
  return (
    <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-4 dark:border-gray-800">
      <p className="text-sm text-gray-500">
        Page {page} of {totalPages}
      </p>
      <div className="flex gap-2">
        <button
          disabled={page <= 1}
          onClick={() => onChange(page - 1)}
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm disabled:opacity-40 dark:border-gray-700"
        >
          Previous
        </button>
        <button
          disabled={page >= totalPages}
          onClick={() => onChange(page + 1)}
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm disabled:opacity-40 dark:border-gray-700"
        >
          Next
        </button>
      </div>
    </div>
  );
}

function formatDate(value: string) {
  return new Date(value).toLocaleString("en-BD", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}
