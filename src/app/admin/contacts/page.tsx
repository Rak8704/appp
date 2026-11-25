
"use client";

import { useCallback, useEffect, useState } from "react";

type ContactMessage = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
};

type ApiResponse = {
  success: boolean;
  message?: string;
  data?: ContactMessage[];
  unreadCount?: number;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

const inputClass =
  "w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 outline-none focus:border-red-500 dark:border-gray-700 dark:bg-[#191e29] dark:text-gray-100";

const buttonClass =
  "rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50";

export default function ContactsPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState("");
  const [search, setSearch] = useState("");
  const [readFilter, setReadFilter] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [unreadCount, setUnreadCount] = useState(0);
  const [selected, setSelected] = useState<ContactMessage | null>(null);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const loadMessages = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: "20",
      });

      if (search.trim()) params.set("search", search.trim());
      if (readFilter) params.set("read", readFilter);

      const response = await fetch(
        `/api/admin/contacts?${params.toString()}`,
        { cache: "no-store" }
      );

      const result: ApiResponse = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Messages load করা যায়নি");
      }

      setMessages(result.data || []);
      setTotal(result.pagination?.total || 0);
      setTotalPages(Math.max(1, result.pagination?.totalPages || 1));
      setUnreadCount(result.unreadCount || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "একটি সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  }, [page, search, readFilter]);

  useEffect(() => {
    void loadMessages();
  }, [loadMessages]);

  async function toggleRead(item: ContactMessage, isRead: boolean) {
    setBusyId(item.id);
    setNotice("");
    setError("");

    try {
      const response = await fetch("/api/admin/contacts", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: item.id, isRead }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Status update করা যায়নি");
      }

      setNotice(isRead ? "Message read হিসেবে mark হয়েছে" : "Message unread হয়েছে");
      if (selected?.id === item.id) {
        setSelected({ ...item, isRead });
      }
      await loadMessages();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setBusyId("");
    }
  }

  async function deleteMessage(item: ContactMessage) {
    if (!window.confirm("এই contact message delete করতে চান?")) return;

    setBusyId(item.id);
    setNotice("");
    setError("");

    try {
      const response = await fetch(
        `/api/admin/contacts?id=${encodeURIComponent(item.id)}`,
        { method: "DELETE" }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Message delete করা যায়নি");
      }

      setSelected(null);
      setNotice("Contact message delete হয়েছে");

      if (messages.length === 1 && page > 1) {
        setPage((current) => current - 1);
      } else {
        await loadMessages();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setBusyId("");
    }
  }

  async function openMessage(item: ContactMessage) {
    setSelected(item);

    if (!item.isRead) {
      await toggleRead(item, true);
    }
  }

  return (
    <div className="min-h-screen space-y-6 bg-gray-50 p-4 text-gray-900 dark:bg-[#11151e] dark:text-gray-100 sm:p-6 lg:p-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-medium text-red-600">ADMIN / CONTACTS</p>
          <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
            Contact Messages
          </h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Website visitor-দের পাঠানো message দেখুন ও পরিচালনা করুন।
          </p>
        </div>

        <button
          onClick={() => void loadMessages()}
          className={`${buttonClass} bg-red-600 text-white hover:bg-red-700`}
        >
          ↻ Refresh
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard title="মোট Messages" value={total} />
        <StatCard title="Unread Messages" value={unreadCount} />
      </div>

      {notice && <Notice type="success" text={notice} />}
      {error && <Notice type="error" text={error} />}

      <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-[#191e29] sm:p-6">
        <div className="mb-5 flex flex-col gap-3 lg:flex-row">
          <input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="নাম, email অথবা subject দিয়ে খুঁজুন..."
            className={inputClass}
          />

          <select
            value={readFilter}
            onChange={(event) => {
              setReadFilter(event.target.value);
              setPage(1);
            }}
            className={`${inputClass} lg:max-w-52`}
          >
            <option value="">সব Messages</option>
            <option value="false">Unread</option>
            <option value="true">Read</option>
          </select>
        </div>

        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-bold">Inbox</h2>
          <span className="text-sm text-gray-500">{total} টি message</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-xs uppercase text-gray-500 dark:border-gray-700">
                <th className="px-3 py-3">Sender</th>
                <th className="px-3 py-3">Subject</th>
                <th className="px-3 py-3">Date</th>
                <th className="px-3 py-3">Status</th>
                <th className="px-3 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-500">
                    Loading messages...
                  </td>
                </tr>
              ) : messages.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-500">
                    কোনো contact message পাওয়া যায়নি।
                  </td>
                </tr>
              ) : (
                messages.map((item) => (
                  <tr
                    key={item.id}
                    className={`border-b border-gray-100 last:border-0 dark:border-gray-800 ${
                      !item.isRead ? "bg-red-50/50 dark:bg-red-950/10" : ""
                    }`}
                  >
                    <td className="px-3 py-4">
                      <p className="font-semibold">{item.name}</p>
                      <p className="mt-1 text-xs text-gray-500">{item.email}</p>
                    </td>
                    <td className="max-w-xs truncate px-3 py-4">
                      {item.subject}
                    </td>
                    <td className="px-3 py-4 text-gray-500">
                      {formatDate(item.createdAt)}
                    </td>
                    <td className="px-3 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          item.isRead
                            ? "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
                            : "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-300"
                        }`}
                      >
                        {item.isRead ? "Read" : "Unread"}
                      </span>
                    </td>
                    <td className="px-3 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => void openMessage(item)}
                          className={`${buttonClass} bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-950/40 dark:text-blue-300`}
                        >
                          View
                        </button>
                        <button
                          disabled={busyId === item.id}
                          onClick={() => void deleteMessage(item)}
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

        <Pagination page={page} totalPages={totalPages} onChange={setPage} />
      </section>

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelected(null);
          }}
        >
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-gray-200 bg-white p-5 shadow-2xl dark:border-gray-700 dark:bg-[#191e29] sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase text-red-600">
                  Contact Message
                </p>
                <h2 className="mt-1 text-xl font-bold">{selected.subject}</h2>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="rounded-lg px-3 py-1 text-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className="mt-6 grid gap-4 rounded-xl bg-gray-50 p-4 text-sm dark:bg-[#11151e] sm:grid-cols-2">
              <div>
                <p className="text-gray-500">Name</p>
                <p className="mt-1 font-semibold">{selected.name}</p>
              </div>
              <div>
                <p className="text-gray-500">Email</p>
                <a
                  href={`mailto:${selected.email}`}
                  className="mt-1 block font-semibold text-red-600 hover:underline"
                >
                  {selected.email}
                </a>
              </div>
              <div>
                <p className="text-gray-500">Phone</p>
                <p className="mt-1 font-semibold">{selected.phone || "—"}</p>
              </div>
              <div>
                <p className="text-gray-500">Received</p>
                <p className="mt-1 font-semibold">
                  {formatDate(selected.createdAt)}
                </p>
              </div>
            </div>

            <div className="mt-5">
              <h3 className="mb-2 text-sm font-bold">Message</h3>
              <div className="whitespace-pre-wrap rounded-xl border border-gray-200 p-4 text-sm leading-7 text-gray-700 dark:border-gray-700 dark:text-gray-300">
                {selected.message}
              </div>
            </div>

            <div className="mt-6 flex flex-wrap justify-end gap-2">
              <button
                onClick={() => void toggleRead(selected, !selected.isRead)}
                disabled={busyId === selected.id}
                className={`${buttonClass} bg-amber-50 text-amber-700 hover:bg-amber-100 dark:bg-amber-950/40 dark:text-amber-300`}
              >
                {selected.isRead ? "Mark Unread" : "Mark Read"}
              </button>
              <a
                href={`mailto:${selected.email}?subject=${encodeURIComponent(
                  `Re: ${selected.subject}`
                )}`}
                className={`${buttonClass} bg-red-600 text-white hover:bg-red-700`}
              >
                Reply by Email
              </a>
              <button
                onClick={() => setSelected(null)}
                className={`${buttonClass} border border-gray-200 dark:border-gray-700`}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
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
