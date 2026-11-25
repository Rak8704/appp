
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

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

const roles = ["ADMIN", "EDITOR", "REPORTER", "READER"];

export default function UserDetails() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function loadUser() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `/api/admin/users/${params.id}`,
        {
          cache: "no-store",
          credentials: "same-origin",
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "User পাওয়া যায়নি");
      }

      setUser(result.data);
      setRole(result.data.role);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "একটি সমস্যা হয়েছে"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  async function updateRole() {
    if (!user || role === user.role) return;

    if (!window.confirm("এই User-এর Role পরিবর্তন করতে চাও?")) {
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(
        `/api/admin/users/${user.id}/role`,
        {
          method: "PATCH",
          credentials: "same-origin",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ role }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Role পরিবর্তন হয়নি");
      }

      await loadUser();
      alert("Role সফলভাবে পরিবর্তন হয়েছে");
    } catch (err) {
      alert(
        err instanceof Error ? err.message : "একটি সমস্যা হয়েছে"
      );
    } finally {
      setSaving(false);
    }
  }

  async function toggleStatus() {
    if (!user) return;

    const nextStatus = !user.isActive;

    if (
      !window.confirm(
        `এই User-কে ${nextStatus ? "Active" : "Inactive"} করতে চাও?`
      )
    ) {
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(
        `/api/admin/users/${user.id}/status`,
        {
          method: "PATCH",
          credentials: "same-origin",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            isActive: nextStatus,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Status পরিবর্তন হয়নি");
      }

      await loadUser();
      alert("Account Status পরিবর্তন হয়েছে");
    } catch (err) {
      alert(
        err instanceof Error ? err.message : "একটি সমস্যা হয়েছে"
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteUser() {
    if (!user) return;

    if (
      !window.confirm(
        `সতর্কতা! ${user.name}-এর Account স্থায়ীভাবে Delete করতে চাও?`
      )
    ) {
      return;
    }

    setSaving(true);

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
        throw new Error(result.message || "Delete করা যায়নি");
      }

      alert("User Delete করা হয়েছে");

      router.push("/admin/users");
      router.refresh();
    } catch (err) {
      alert(
        err instanceof Error ? err.message : "একটি সমস্যা হয়েছে"
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="rounded-xl border bg-white p-10 text-center">
        User Details লোড হচ্ছে...
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="space-y-4 rounded-xl border bg-white p-8">
        <p className="text-red-600">
          {error || "User পাওয়া যায়নি"}
        </p>

        <Link
          href="/admin/users"
          className="text-blue-600 hover:underline"
        >
          ← User List-এ ফিরে যাও
        </Link>
      </div>
    );
  }

  const protectedUser = user.role === "SUPER_ADMIN";

  return (
    <div className="mx-auto max-w-4xl space-y-6">

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            User Details
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            User Account Information ও Management
          </p>
        </div>

        <Link
          href="/admin/users"
          className="rounded-lg border bg-white px-4 py-2 text-sm transition hover:bg-slate-50"
        >
          ← All Users
        </Link>
      </div>

      {/* User Information */}
      <div className="rounded-xl border bg-white p-6">
        <div className="flex flex-wrap items-center gap-4">

          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="h-20 w-20 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 text-3xl font-bold text-blue-700">
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}

          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {user.name}
            </h2>

            <p className="text-sm text-slate-500">
              {user.email}
            </p>

            <div className="mt-2 flex flex-wrap gap-2">
              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                {user.role}
              </span>

              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  user.isActive
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {user.isActive ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="mt-6 grid gap-5 border-t pt-6 sm:grid-cols-2">

          <div>
            <p className="text-xs text-slate-500">
              User ID
            </p>
            <p className="mt-1 break-all text-sm font-medium">
              {user.id}
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-500">
              Email
            </p>
            <p className="mt-1 break-all text-sm font-medium">
              {user.email}
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-500">
              Account Created
            </p>
            <p className="mt-1 text-sm font-medium">
              {new Date(user.createdAt).toLocaleString("bn-BD")}
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-500">
              Last Updated
            </p>
            <p className="mt-1 text-sm font-medium">
              {new Date(user.updatedAt).toLocaleString("bn-BD")}
            </p>
          </div>

          <div className="sm:col-span-2">
            <p className="text-xs text-slate-500">
              Bio
            </p>
            <p className="mt-1 text-sm">
              {user.bio || "কোনো Bio দেওয়া হয়নি"}
            </p>
          </div>

        </div>
      </div>

      {/* Account Management */}
      <div className="rounded-xl border bg-white p-6">
        <h2 className="text-lg font-bold text-slate-900">
          Account Management
        </h2>

        {protectedUser ? (
          <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4">
            <p className="text-sm font-medium text-amber-800">
              SUPER_ADMIN Protected Account
            </p>

            <p className="mt-1 text-sm text-amber-700">
              SUPER_ADMIN Account হওয়ায় এই পেজ থেকে Role,
              Status, Email, Password অথবা Account Delete
              পরিবর্তন করা যাবে না।
            </p>
          </div>
        ) : (
          <div className="mt-5 space-y-5">

            {/* Email & Password Management */}
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">

                <div>
                  <h3 className="font-semibold text-slate-900">
                    Email & Password Management
                  </h3>

                  <p className="mt-1 text-xs text-slate-600">
                    এই User-এর Name, Email পরিবর্তন এবং Password
                    Reset করতে পারবে।
                  </p>
                </div>

                <Link
                  href={`/admin/users/${user.id}/account`}
                  className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Manage Account
                </Link>

              </div>
            </div>

            {/* Role Management */}
            <div className="border-t pt-5">
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                User Role
              </label>

              <div className="flex flex-wrap gap-2">

                <select
                  value={role}
                  onChange={(event) => setRole(event.target.value)}
                  className="min-w-48 rounded-lg border bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500"
                  disabled={saving}
                >
                  {roles.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>

                <button
                  onClick={updateRole}
                  disabled={saving || role === user.role}
                  className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {saving ? "Saving..." : "Save Role"}
                </button>

              </div>

              <p className="mt-2 text-xs text-slate-500">
                Role পরিবর্তনের জন্য প্রয়োজনীয় Permission থাকতে হবে।
              </p>
            </div>

            {/* Status & Delete */}
            <div className="flex flex-wrap gap-3 border-t pt-5">

              <button
                onClick={toggleStatus}
                disabled={saving}
                className="rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {saving
                  ? "Processing..."
                  : user.isActive
                    ? "Deactivate Account"
                    : "Activate Account"}
              </button>

              <button
                onClick={deleteUser}
                disabled={saving}
                className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Delete User
              </button>

            </div>

          </div>
        )}
      </div>

    </div>
  );
}
