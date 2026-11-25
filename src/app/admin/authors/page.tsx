
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

type Author = {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string | null;
  bio: string | null;
  isActive: boolean;
  createdAt: string;
  _count?: {
    articles: number;
  };
};

type Pagination = {
  page: number;
  total: number;
  totalPages: number;
};

export default function AuthorsPage() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("ALL");
  const [status, setStatus] = useState("ALL");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    total: 0,
    totalPages: 1,
  });
  const [updatingId, setUpdatingId] = useState("");

  const loadAuthors = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: "20",
      });

      if (search.trim()) params.set("search", search.trim());
      if (role !== "ALL") params.set("role", role);
      if (status !== "ALL") params.set("status", status);

      const response = await fetch(
        `/api/admin/users?${params.toString()}`,
        { credentials: "include", cache: "no-store" }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Author তালিকা লোড করা যায়নি");
      }

      const data = result.data ?? result.users ?? [];

      setAuthors(
        data.filter((user: Author) =>
          ["REPORTER", "EDITOR", "ADMIN", "SUPER_ADMIN"].includes(user.role)
        )
      );

      setPagination(
        result.pagination ?? {
          page,
          total: data.length,
          totalPages: 1,
        }
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "সমস্যা হয়েছে"
      );
    } finally {
      setLoading(false);
    }
  }, [page, search, role, status]);

  useEffect(() => {
    loadAuthors();
  }, [loadAuthors]);

  async function toggleStatus(author: Author) {
    const confirmed = window.confirm(
      `${author.name}-কে ${author.isActive ? "Inactive" : "Active"} করতে চান?`
    );

    if (!confirmed) return;

    setUpdatingId(author.id);

    try {
      const response = await fetch(
        `/api/admin/users/${author.id}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ isActive: !author.isActive }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Status পরিবর্তন করা যায়নি");
      }

      await loadAuthors();
    } catch (err) {
      alert(err instanceof Error ? err.message : "সমস্যা হয়েছে");
    } finally {
      setUpdatingId("");
    }
  }

  const roleLabel: Record<string, string> = {
    SUPER_ADMIN: "Super Admin",
    ADMIN: "Admin",
    EDITOR: "Editor",
    REPORTER: "Reporter",
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Author / Reporter Management
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              সংবাদ লেখক ও রিপোর্টারদের পরিচালনা করুন।
            </p>
          </div>

          <Link
            href="/admin/users"
            className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            User Management
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border bg-white p-5">
            <p className="text-sm text-slate-500">মোট Author</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">
              {pagination.total}
            </p>
          </div>

          <div className="rounded-xl border bg-white p-5">
            <p className="text-sm text-slate-500">বর্তমান পেজে Active</p>
            <p className="mt-2 text-3xl font-bold text-green-600">
              {authors.filter((a) => a.isActive).length}
            </p>
          </div>

          <div className="rounded-xl border bg-white p-5">
            <p className="text-sm text-slate-500">বর্তমান পেজে Inactive</p>
            <p className="mt-2 text-3xl font-bold text-red-600">
              {authors.filter((a) => !a.isActive).length}
            </p>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-5">
          <div className="grid gap-3 md:grid-cols-4">
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="নাম বা ইমেইল দিয়ে খুঁজুন..."
              className="rounded-lg border px-4 py-3 text-sm outline-none focus:border-blue-500"
            />

            <select
              value={role}
              onChange={(e) => {
                setRole(e.target.value);
                setPage(1);
              }}
              className="rounded-lg border bg-white px-4 py-3 text-sm"
            >
              <option value="ALL">সব Role</option>
              <option value="REPORTER">Reporter</option>
              <option value="EDITOR">Editor</option>
              <option value="ADMIN">Admin</option>
              <option value="SUPER_ADMIN">Super Admin</option>
            </select>

            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              className="rounded-lg border bg-white px-4 py-3 text-sm"
            >
              <option value="ALL">সব Status</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>

            <button
              onClick={() => {
                setSearch("");
                setRole("ALL");
                setStatus("ALL");
                setPage(1);
              }}
              className="rounded-lg border px-4 py-3 text-sm font-medium hover:bg-slate-50"
            >
              Reset Filter
            </button>
          </div>
        </div>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="overflow-hidden rounded-xl border bg-white">
          <div className="flex items-center justify-between border-b p-5">
            <h2 className="font-semibold text-slate-900">
              Author List
            </h2>
            <button
              onClick={loadAuthors}
              className="rounded-lg border px-3 py-2 text-sm hover:bg-slate-50"
            >
              Refresh
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="p-4">Author</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Articles</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Joined</th>
                  <th className="p-4">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="p-10 text-center text-slate-500">
                      Loading authors...
                    </td>
                  </tr>
                ) : authors.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-10 text-center text-slate-500">
                      কোনো Author পাওয়া যায়নি।
                    </td>
                  </tr>
                ) : (
                  authors.map((author) => (
                    <tr key={author.id} className="hover:bg-slate-50">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {author.avatar ? (
                            <img
                              src={author.avatar}
                              alt={author.name}
                              className="h-10 w-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
                              {author.name.charAt(0).toUpperCase()}
                            </div>
                          )}

                          <div>
                            <p className="font-semibold text-slate-900">
                              {author.name}
                            </p>
                            <p className="text-xs text-slate-500">
                              {author.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        {roleLabel[author.role] ?? author.role}
                      </td>

                      <td className="p-4">
                        {author._count?.articles ?? "—"}
                      </td>

                      <td className="p-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            author.isActive
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {author.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>

                      <td className="p-4 text-slate-500">
                        {new Date(author.createdAt).toLocaleDateString("en-GB")}
                      </td>

                      <td className="p-4">
                        <div className="flex flex-wrap gap-2">
                          <Link
                            href={`/admin/users/${author.id}`}
                            className="rounded-md border px-3 py-1.5 text-xs font-medium hover:bg-slate-50"
                          >
                            View
                          </Link>

                          <button
                            disabled={updatingId === author.id}
                            onClick={() => toggleStatus(author)}
                            className="rounded-md border px-3 py-1.5 text-xs font-medium hover:bg-slate-50 disabled:opacity-50"
                          >
                            {updatingId === author.id
                              ? "Updating..."
                              : author.isActive
                                ? "Deactivate"
                                : "Activate"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t p-4">
            <p className="text-sm text-slate-500">
              মোট {pagination.total} জন
            </p>

            <div className="flex gap-2">
              <button
                disabled={page <= 1 || loading}
                onClick={() => setPage((p) => p - 1)}
                className="rounded-lg border px-4 py-2 text-sm disabled:opacity-40"
              >
                Previous
              </button>

              <span className="px-3 py-2 text-sm">
                {page} / {Math.max(pagination.totalPages, 1)}
              </span>

              <button
                disabled={page >= pagination.totalPages || loading}
                onClick={() => setPage((p) => p + 1)}
                className="rounded-lg border px-4 py-2 text-sm disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
