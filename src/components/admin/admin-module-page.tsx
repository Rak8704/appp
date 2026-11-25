
"use client";

import { useCallback, useEffect, useState } from "react";

type AdminModulePageProps = {
  title: string;
  description: string;
  api?: string;
};

type RecordItem = Record<string, unknown>;

type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export default function AdminModulePage({
  title,
  description,
  api,
}: AdminModulePageProps) {
  const [items, setItems] = useState<RecordItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 1,
  });

  const loadData = useCallback(async () => {
    if (!api) return;

    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: "20",
      });

      if (search.trim()) {
        params.set("search", search.trim());
      }

      const response = await fetch(
        `${api}?${params.toString()}`,
        {
          credentials: "include",
          cache: "no-store",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || result.error || "ডেটা লোড করা যায়নি"
        );
      }

      let records: RecordItem[] = [];

      if (Array.isArray(result.data)) {
        records = result.data;
      } else if (Array.isArray(result.items)) {
        records = result.items;
      } else if (Array.isArray(result.users)) {
        records = result.users;
      } else if (Array.isArray(result.comments)) {
        records = result.comments;
      } else if (Array.isArray(result.media)) {
        records = result.media;
      } else if (Array.isArray(result.ads)) {
        records = result.ads;
      } else if (Array.isArray(result.epapers)) {
        records = result.epapers;
      } else if (Array.isArray(result.galleries)) {
        records = result.galleries;
      } else if (Array.isArray(result.videos)) {
        records = result.videos;
      } else if (Array.isArray(result.messages)) {
        records = result.messages;
      } else if (Array.isArray(result.submissions)) {
        records = result.submissions;
      }

      setItems(records);

      setPagination({
        page: result.pagination?.page ?? page,
        limit: result.pagination?.limit ?? 20,
        total: result.pagination?.total ?? records.length,
        totalPages: Math.max(
          result.pagination?.totalPages ?? 1,
          1
        ),
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "ডেটা লোড করতে সমস্যা হয়েছে"
      );
    } finally {
      setLoading(false);
    }
  }, [api, page, search]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  function formatValue(value: unknown): string {
    if (value === null || value === undefined || value === "") {
      return "—";
    }

    if (typeof value === "boolean") {
      return value ? "Yes" : "No";
    }

    if (value instanceof Date) {
      return value.toLocaleDateString();
    }

    if (typeof value === "object") {
      return JSON.stringify(value);
    }

    return String(value);
  }

  const preferredColumns = [
    "title",
    "name",
    "email",
    "status",
    "role",
    "isActive",
    "isPublished",
    "createdAt",
  ];

  const availableColumns =
    items.length > 0
      ? [
          ...preferredColumns.filter((key) =>
            Object.prototype.hasOwnProperty.call(items[0], key)
          ),
          ...Object.keys(items[0]).filter(
            (key) => !preferredColumns.includes(key)
          ),
        ].filter(
          (key) =>
            ![
              "password",
              "unsubscribeToken",
              "content",
              "description",
            ].includes(key)
        ).slice(0, 6)
      : [];

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-blue-600">
          দৈনিক দিনলিপি / Admin
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
          {title}
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          {description}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">মোট রেকর্ড</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">
            {pagination.total}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">বর্তমান পেজে রেকর্ড</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">
            {items.length}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">বর্তমান পেজ</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">
            {pagination.page} / {pagination.totalPages}
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder={`${title} Search...`}
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500"
          />

          <button
            onClick={loadData}
            disabled={!api || loading}
            className="rounded-lg border border-slate-300 px-5 py-3 text-sm font-semibold hover:bg-slate-50 disabled:opacity-50"
          >
            {loading ? "Loading..." : "Refresh"}
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 p-5">
          <div>
            <h2 className="font-semibold text-slate-900">
              {title} Records
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              API: {api || "Not configured"}
            </p>
          </div>

          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
            {api ? "API Connected" : "API Not Configured"}
          </span>
        </div>

        {!api ? (
          <div className="p-10 text-center">
            <h3 className="font-semibold text-slate-800">
              API Endpoint নির্ধারণ করা হয়নি
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              এই মডিউলের API endpoint যুক্ত করলে এখানে ডেটা দেখাবে।
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  {availableColumns.map((column) => (
                    <th key={column} className="whitespace-nowrap p-4">
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td
                      colSpan={Math.max(availableColumns.length, 1)}
                      className="p-10 text-center text-slate-500"
                    >
                      ডেটা লোড হচ্ছে...
                    </td>
                  </tr>
                ) : items.length === 0 ? (
                  <tr>
                    <td
                      colSpan={Math.max(availableColumns.length, 1)}
                      className="p-10 text-center text-slate-500"
                    >
                      কোনো রেকর্ড পাওয়া যায়নি।
                    </td>
                  </tr>
                ) : (
                  items.map((item, index) => (
                    <tr
                      key={String(item.id ?? index)}
                      className="hover:bg-slate-50"
                    >
                      {availableColumns.map((column) => (
                        <td
                          key={column}
                          className="max-w-xs whitespace-nowrap p-4 text-slate-700"
                        >
                          <span className="block max-w-xs truncate">
                            {formatValue(item[column])}
                          </span>
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {api && (
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 p-4">
            <p className="text-sm text-slate-500">
              মোট {pagination.total} টি রেকর্ড
            </p>

            <div className="flex items-center gap-3">
              <button
                disabled={page <= 1 || loading}
                onClick={() => setPage((current) => current - 1)}
                className="rounded-lg border px-4 py-2 text-sm disabled:opacity-40"
              >
                Previous
              </button>

              <span className="text-sm text-slate-600">
                {page} / {pagination.totalPages}
              </span>

              <button
                disabled={page >= pagination.totalPages || loading}
                onClick={() => setPage((current) => current + 1)}
                className="rounded-lg border px-4 py-2 text-sm disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
