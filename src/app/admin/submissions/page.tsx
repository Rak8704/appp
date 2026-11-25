
"use client";

import { useCallback, useEffect, useState } from "react";

type Submission = {
  id: string;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  title?: string | null;
  subject?: string | null;
  content?: string | null;
  message?: string | null;
  description?: string | null;
  status: string;
  adminNote?: string | null;
  createdAt: string;
  [key: string]: unknown;
};

type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

const STATUSES = [
  { value: "", label: "সব Status" },
  { value: "PENDING", label: "Pending" },
  { value: "REVIEWING", label: "Reviewing" },
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" },
];

function statusStyle(status: string) {
  switch (status) {
    case "APPROVED":
      return "bg-green-100 text-green-700";
    case "REJECTED":
      return "bg-red-100 text-red-700";
    case "REVIEWING":
      return "bg-blue-100 text-blue-700";
    default:
      return "bg-amber-100 text-amber-700";
  }
}

function formatDate(value: string) {
  return new Date(value).toLocaleString("bn-BD", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function SubmissionsPage() {
  const [items, setItems] = useState<Submission[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 1,
  });

  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [selected, setSelected] = useState<Submission | null>(null);
  const [adminNote, setAdminNote] = useState("");
  const [newStatus, setNewStatus] = useState("");

  const loadSubmissions = useCallback(async (page = 1) => {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: "20",
      });

      if (status) params.set("status", status);

      const response = await fetch(
        `/api/admin/submissions?${params.toString()}`,
        {
          method: "GET",
          cache: "no-store",
          credentials: "same-origin",
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Submissions লোড করা যায়নি");
      }

      setItems(Array.isArray(result.data) ? result.data : []);
      setPagination(
        result.pagination || {
          page,
          limit: 20,
          total: 0,
          totalPages: 1,
        }
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "একটি সমস্যা হয়েছে"
      );
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    loadSubmissions(1);
  }, [loadSubmissions]);

  function openDetails(item: Submission) {
    setSelected(item);
    setAdminNote(item.adminNote || "");
    setNewStatus(item.status || "PENDING");
    setSuccess("");
    setError("");
  }

  async function updateSubmission() {
    if (!selected) return;

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/admin/submissions", {
        method: "PATCH",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: selected.id,
          status: newStatus,
          adminNote,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Submission Update করা যায়নি");
      }

      setSuccess(result.message || "Submission সফলভাবে Update হয়েছে");
      setSelected(null);
      await loadSubmissions(pagination.page);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "একটি সমস্যা হয়েছে"
      );
    } finally {
      setSaving(false);
    }
  }

  const getTitle = (item: Submission) =>
    item.title || item.subject || "শিরোনাম দেওয়া হয়নি";

  const getMessage = (item: Submission) =>
    item.content || item.message || item.description || "";

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            News Submissions
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            পাঠকদের পাঠানো সংবাদ যাচাই এবং পরিচালনা করুন।
          </p>
        </div>

        <button
          onClick={() => loadSubmissions(pagination.page)}
          disabled={loading}
          className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
        >
          {loading ? "লোড হচ্ছে..." : "Refresh"}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">মোট Submissions</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">
            {pagination.total}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">বর্তমান Page</p>
          <p className="mt-2 text-3xl font-bold text-blue-600">
            {pagination.page} / {pagination.totalPages || 1}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">এই Page-এ দেখানো হচ্ছে</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">
            {items.length}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-semibold text-slate-900">
            Submission List
          </h2>
          <p className="text-xs text-slate-500">
            Status অনুযায়ী Submission Filter করুন।
          </p>
        </div>

        <select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 sm:w-52"
        >
          {STATUSES.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
          {success}
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-5 py-4">Submission</th>
                <th className="px-5 py-4">প্রেরক</th>
                <th className="px-5 py-4">তারিখ</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-slate-500">
                    Submission লোড হচ্ছে...
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center">
                    <p className="font-medium text-slate-700">
                      কোনো Submission পাওয়া যায়নি
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      অন্য Status নির্বাচন করে দেখুন।
                    </p>
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="max-w-sm px-5 py-4">
                      <p className="font-semibold text-slate-900">
                        {getTitle(item)}
                      </p>
                      <p className="mt-1 line-clamp-2 text-xs text-slate-500">
                        {getMessage(item) || "বিস্তারিত তথ্য নেই"}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <p className="font-medium text-slate-800">
                        {item.name || "অজানা"}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {item.email || item.phone || "যোগাযোগের তথ্য নেই"}
                      </p>
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-slate-500">
                      {formatDate(item.createdAt)}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyle(
                          item.status
                        )}`}
                      >
                        {item.status}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => openDetails(item)}
                        className="rounded-lg border border-blue-200 px-3 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-50"
                      >
                        View / Manage
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-3 border-t border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-500">
            মোট {pagination.total} টি Submission
          </p>

          <div className="flex items-center gap-2">
            <button
              disabled={pagination.page <= 1 || loading}
              onClick={() => loadSubmissions(pagination.page - 1)}
              className="rounded-lg border px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>

            <span className="px-2 text-sm text-slate-600">
              {pagination.page} / {pagination.totalPages || 1}
            </span>

            <button
              disabled={
                pagination.page >= pagination.totalPages || loading
              }
              onClick={() => loadSubmissions(pagination.page + 1)}
              className="rounded-lg border px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b px-6 py-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Submission Details
                </h2>
                <p className="text-xs text-slate-500">
                  Submission ID: {selected.id}
                </p>
              </div>

              <button
                onClick={() => setSelected(null)}
                className="rounded-lg px-3 py-2 text-xl text-slate-500 hover:bg-slate-100"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className="space-y-5 p-6">
              <div>
                <p className="text-xs font-semibold uppercase text-slate-400">
                  Title
                </p>
                <p className="mt-1 font-semibold text-slate-900">
                  {getTitle(selected)}
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold uppercase text-slate-400">
                    প্রেরকের নাম
                  </p>
                  <p className="mt-1 text-sm text-slate-800">
                    {selected.name || "তথ্য নেই"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase text-slate-400">
                    Email
                  </p>
                  <p className="mt-1 break-all text-sm text-slate-800">
                    {selected.email || "তথ্য নেই"}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase text-slate-400">
                  Submission Content
                </p>
                <div className="mt-2 whitespace-pre-wrap rounded-lg bg-slate-50 p-4 text-sm leading-7 text-slate-700">
                  {getMessage(selected) || "কোনো Content পাওয়া যায়নি"}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Submission Status
                </label>
                <select
                  value={newStatus}
                  onChange={(event) => setNewStatus(event.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-3 text-sm outline-none focus:border-blue-500"
                >
                  {STATUSES.filter((item) => item.value).map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Admin Note
                </label>
                <textarea
                  value={adminNote}
                  onChange={(event) => setAdminNote(event.target.value)}
                  maxLength={5000}
                  rows={4}
                  placeholder="এই Submission সম্পর্কে Admin Note লিখুন..."
                  className="w-full rounded-lg border border-slate-200 px-3 py-3 text-sm outline-none focus:border-blue-500"
                />
                <p className="mt-1 text-right text-xs text-slate-400">
                  {adminNote.length}/5000
                </p>
              </div>

              {error && (
                <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <div className="flex flex-col-reverse gap-2 border-t pt-4 sm:flex-row sm:justify-end">
                <button
                  onClick={() => setSelected(null)}
                  className="rounded-lg border px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  onClick={updateSubmission}
                  disabled={saving}
                  className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
