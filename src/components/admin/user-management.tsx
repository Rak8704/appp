
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string | null;
  bio: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [active, setActive] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams({
        page: String(pagination.page),
        limit: String(pagination.limit),
      });

      if (search) params.set("search", search);
      if (role) params.set("role", role);
      if (active) params.set("active", active);

      const response = await fetch(
        `/api/admin/users?${params.toString()}`,
        { cache: "no-store", credentials: "same-origin" }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "ইউজার লোড করা যায়নি");
      }

      setUsers(result.data);
      setPagination(result.pagination);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "একটি সমস্যা হয়েছে"
      );
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, search, role, active]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPagination((previous) => ({ ...previous, page: 1 }));
    setSearch(searchInput.trim());
  }

  async function toggleStatus(user: User) {
    const nextStatus = !user.isActive;

    if (!window.confirm(
      `${user.name}-কে ${nextStatus ? "Active" : "Inactive"} করতে চাও?`
    )) return;

    try {
      const response = await fetch(
        `/api/admin/users/${user.id}/status`,
        {
          method: "PATCH",
          credentials: "same-origin",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isActive: nextStatus }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Status পরিবর্তন হয়নি");
      }

      await loadUsers();
    } catch (err) {
      alert(err instanceof Error ? err.message : "একটি সমস্যা হয়েছে");
    }
  }

  async function deleteUser(user: User) {
    if (!window.confirm(
      `তুমি কি নিশ্চিত ${user.name}-কে Delete করতে চাও? এই কাজ ফিরিয়ে নেওয়া যাবে না।`
    )) return;

    try {
      const response = await fetch(
        `/api/admin/users/${user.id}/delete`,
        {
          method: "DELETE",
          credentials: "same-origin",
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "User Delete করা যায়নি");
      }

      await loadUsers();
    } catch (err) {
      alert(err instanceof Error ? err.message : "একটি সমস্যা হয়েছে");
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          User Management
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          সকল ব্যবহারকারী, Admin, Editor ও Reporter পরিচালনা করো।
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border bg-white p-5">
          <p className="text-sm text-slate-500">মোট User</p>
          <p className="mt-2 text-2xl font-bold">{pagination.total}</p>
        </div>
        <div className="rounded-xl border bg-white p-5">
          <p className="text-sm text-slate-500">এই পেজে Active</p>
          <p className="mt-2 text-2xl font-bold text-green-600">
            {users.filter((user) => user.isActive).length}
          </p>
        </div>
        <div className="rounded-xl border bg-white p-5">
          <p className="text-sm text-slate-500">এই পেজে Inactive</p>
          <p className="mt-2 text-2xl font-bold text-red-600">
            {users.filter((user) => !user.isActive).length}
          </p>
        </div>
      </div>

      <div className="rounded-xl border bg-white p-4">
        <form
          onSubmit={handleSearch}
          className="flex flex-col gap-3 lg:flex-row"
        >
          <input
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="নাম অথবা Email দিয়ে খুঁজুন..."
            className="min-w-0 flex-1 rounded-lg border px-4 py-2.5 outline-none focus:border-blue-500"
          />

          <select
            value={role}
            onChange={(event) => {
              setRole(event.target.value);
              setPagination((previous) => ({ ...previous, page: 1 }));
            }}
            className="rounded-lg border px-4 py-2.5"
          >
            <option value="">সব Role</option>
            <option value="SUPER_ADMIN">Super Admin</option>
            <option value="ADMIN">Admin</option>
            <option value="EDITOR">Editor</option>
            <option value="REPORTER">Reporter</option>
            <option value="READER">Reader</option>
          </select>

          <select
            value={active}
            onChange={(event) => {
              setActive(event.target.value);
              setPagination((previous) => ({ ...previous, page: 1 }));
            }}
            className="rounded-lg border px-4 py-2.5"
          >
            <option value="">সব Status</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>

          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700"
          >
            Search
          </button>
        </form>
      </div>

      <div className="overflow-hidden rounded-xl border bg-white">
        {loading ? (
          <p className="p-10 text-center text-slate-500">
            User লোড হচ্ছে...
          </p>
        ) : error ? (
          <p className="p-10 text-center text-red-600">{error}</p>
        ) : users.length === 0 ? (
          <p className="p-10 text-center text-slate-500">
            কোনো User পাওয়া যায়নি।
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-5 py-4">User</th>
                  <th className="px-5 py-4">Role</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Joined</th>
                  <th className="px-5 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt=""
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-slate-900">
                            {user.name}
                          </p>
                          <p className="text-xs text-slate-500">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                        user.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}>
                        {user.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-500">
                      {new Date(user.createdAt).toLocaleDateString("bn-BD")}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-2">
                        <Link
                          href={`/admin/users/${user.id}`}
                          className="rounded-md bg-blue-50 px-3 py-2 text-xs font-medium text-blue-700"
                        >
                          Details
                        </Link>
                        {user.role !== "SUPER_ADMIN" && (
                          <>
                            <button
                              onClick={() => toggleStatus(user)}
                              className="rounded-md bg-amber-50 px-3 py-2 text-xs font-medium text-amber-700"
                            >
                              {user.isActive ? "Deactivate" : "Activate"}
                            </button>
                            <button
                              onClick={() => deleteUser(user)}
                              className="rounded-md bg-red-50 px-3 py-2 text-xs font-medium text-red-700"
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex flex-col gap-3 border-t p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">
            মোট {pagination.total} জন | Page {pagination.page} of {Math.max(1, pagination.totalPages)}
          </p>
          <div className="flex gap-2">
            <button
              disabled={pagination.page <= 1 || loading}
              onClick={() =>
                setPagination((previous) => ({
                  ...previous,
                  page: previous.page - 1,
                }))
              }
              className="rounded-lg border px-4 py-2 disabled:opacity-40"
            >
              Previous
            </button>
            <button
              disabled={
                pagination.page >= pagination.totalPages || loading
              }
              onClick={() =>
                setPagination((previous) => ({
                  ...previous,
                  page: previous.page + 1,
                }))
              }
              className="rounded-lg border px-4 py-2 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
