
"use client";

import { useCallback, useEffect, useState } from "react";

type Permissions = {
  canViewUsers: boolean;
  canEditUsers: boolean;
  canChangeUserRoles: boolean;
  canDeleteUsers: boolean;
  canChangeUserStatus: boolean;
};

type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "EDITOR";
  avatar: string | null;
  isActive: boolean;
  createdAt: string;
  permissions: Permissions;
};

const defaultPermissions: Permissions = {
  canViewUsers: false,
  canEditUsers: false,
  canChangeUserRoles: false,
  canDeleteUsers: false,
  canChangeUserStatus: false,
};

const permissionItems: {
  key: keyof Permissions;
  title: string;
  description: string;
}[] = [
  {
    key: "canViewUsers",
    title: "View Users",
    description: "User list ও user information দেখতে পারবে",
  },
  {
    key: "canEditUsers",
    title: "Edit Users",
    description: "User-এর information পরিবর্তন করতে পারবে",
  },
  {
    key: "canChangeUserRoles",
    title: "Change User Roles",
    description: "User-এর role পরিবর্তন করতে পারবে",
  },
  {
    key: "canDeleteUsers",
    title: "Delete Users",
    description: "User account delete করতে পারবে",
  },
  {
    key: "canChangeUserStatus",
    title: "Change User Status",
    description: "User active অথবা inactive করতে পারবে",
  },
];

const inputClass =
  "w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 outline-none focus:border-red-500 dark:border-gray-700 dark:bg-[#11151e] dark:text-gray-100";

const buttonClass =
  "rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50";

export default function PermissionsPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [drafts, setDrafts] = useState<Record<string, Permissions>>({});
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState("");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/permissions", {
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Permission list load failed");
      }

      const list: AdminUser[] = result.data || [];

      setUsers(list);

      const nextDrafts: Record<string, Permissions> = {};

      list.forEach((user) => {
        nextDrafts[user.id] = {
          ...defaultPermissions,
          ...user.permissions,
        };
      });

      setDrafts(nextDrafts);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "একটি সমস্যা হয়েছে"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  function togglePermission(
    userId: string,
    key: keyof Permissions,
    checked: boolean
  ) {
    setDrafts((current) => ({
      ...current,
      [userId]: {
        ...(current[userId] || defaultPermissions),
        [key]: checked,
      },
    }));
  }

  function isChanged(user: AdminUser) {
    const draft = drafts[user.id];

    if (!draft) return false;

    return permissionItems.some(
      ({ key }) => draft[key] !== user.permissions[key]
    );
  }

  async function savePermissions(user: AdminUser) {
    const permissions = drafts[user.id];

    if (!permissions) return;

    setSavingId(user.id);
    setNotice("");
    setError("");

    try {
      const response = await fetch("/api/admin/permissions", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          ...permissions,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Permission save failed");
      }

      setUsers((current) =>
        current.map((item) =>
          item.id === user.id
            ? { ...item, permissions: { ...permissions } }
            : item
        )
      );

      setNotice(`${user.name}-এর permissions সফলভাবে save হয়েছে`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Permission save failed"
      );
    } finally {
      setSavingId("");
    }
  }

  function resetPermissions(user: AdminUser) {
    setDrafts((current) => ({
      ...current,
      [user.id]: { ...user.permissions },
    }));
  }

  function enableAll(user: AdminUser) {
    setDrafts((current) => ({
      ...current,
      [user.id]: {
        canViewUsers: true,
        canEditUsers: true,
        canChangeUserRoles: true,
        canDeleteUsers: true,
        canChangeUserStatus: true,
      },
    }));
  }

  function disableAll(user: AdminUser) {
    setDrafts((current) => ({
      ...current,
      [user.id]: { ...defaultPermissions },
    }));
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());

    const matchesRole = !roleFilter || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const adminCount = users.filter((user) => user.role === "ADMIN").length;
  const editorCount = users.filter((user) => user.role === "EDITOR").length;
  const changedCount = users.filter(isChanged).length;

  return (
    <div className="min-h-screen space-y-6 bg-gray-50 p-4 text-gray-900 dark:bg-[#11151e] dark:text-gray-100 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-medium text-red-600">
            ADMIN / PERMISSION MANAGEMENT
          </p>
          <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
            Permission Management
          </h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Admin ও Editor-দের user management permission নিয়ন্ত্রণ করুন।
          </p>
        </div>

        <button
          onClick={() => void loadUsers()}
          className={`${buttonClass} bg-red-600 text-white hover:bg-red-700`}
        >
          ↻ Refresh
        </button>
      </div>

      {/* Super Admin Notice */}
      <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950/30">
        <div className="flex gap-3">
          <span className="text-xl">🔐</span>
          <div>
            <h3 className="font-bold text-blue-800 dark:text-blue-300">
              Super Admin Control
            </h3>
            <p className="mt-1 text-sm leading-6 text-blue-700 dark:text-blue-200">
              শুধুমাত্র SUPER_ADMIN এই permission পরিবর্তন করতে পারবে।
              SUPER_ADMIN-এর সব permission স্বয়ংক্রিয়ভাবে অনুমোদিত।
            </p>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {notice && <Notice type="success" text={notice} />}
      {error && <Notice type="error" text={error} />}

      {/* Statistics */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="Total Admin & Editor" value={users.length} />
        <StatCard title="Administrators" value={adminCount} />
        <StatCard title="Editors" value={editorCount} />
      </div>

      {/* Filters */}
      <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-[#191e29] sm:p-6">
        <div className="mb-5 flex flex-col gap-3 lg:flex-row">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Name অথবা email দিয়ে খুঁজুন..."
            className={inputClass}
          />

          <select
            value={roleFilter}
            onChange={(event) => setRoleFilter(event.target.value)}
            className={`${inputClass} lg:max-w-52`}
          >
            <option value="">All Roles</option>
            <option value="ADMIN">Admin</option>
            <option value="EDITOR">Editor</option>
          </select>
        </div>

        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-bold">Admin Users & Permissions</h2>
            <p className="mt-1 text-xs text-gray-500">
              {filteredUsers.length} জন user পাওয়া গেছে
            </p>
          </div>

          <span className="rounded-full bg-amber-100 px-3 py-1.5 text-xs font-semibold text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
            {changedCount} unsaved changes
          </span>
        </div>

        {/* User list */}
        {loading ? (
          <div className="py-16 text-center text-sm text-gray-500">
            Loading permissions...
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 py-14 text-center text-sm text-gray-500 dark:border-gray-700">
            কোনো Admin অথবা Editor পাওয়া যায়নি।
          </div>
        ) : (
          <div className="space-y-5">
            {filteredUsers.map((user) => {
              const draft = drafts[user.id] || defaultPermissions;
              const changed = isChanged(user);
              const enabledCount = permissionItems.filter(
                ({ key }) => draft[key]
              ).length;

              return (
                <div
                  key={user.id}
                  className="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700"
                >
                  {/* User header */}
                  <div className="flex flex-col justify-between gap-4 bg-gray-50 p-4 dark:bg-[#151a24] sm:flex-row sm:items-center">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-red-100 text-lg font-bold text-red-700 dark:bg-red-950/50 dark:text-red-300">
                        {user.avatar ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          user.name.charAt(0).toUpperCase()
                        )}
                      </div>

                      <div className="min-w-0">
                        <h3 className="font-bold">{user.name}</h3>
                        <p className="truncate text-xs text-gray-500">
                          {user.email}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <span
                            className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                              user.role === "ADMIN"
                                ? "bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300"
                                : "bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300"
                            }`}
                          >
                            {user.role}
                          </span>

                          <span
                            className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                              user.isActive
                                ? "bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-300"
                                : "bg-gray-200 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
                            }`}
                          >
                            {user.isActive ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <span className="mr-1 text-xs text-gray-500">
                        {enabledCount}/5 enabled
                      </span>

                      <button
                        onClick={() => enableAll(user)}
                        className="rounded-lg border border-green-200 px-3 py-2 text-xs font-semibold text-green-700 hover:bg-green-50 dark:border-green-900 dark:text-green-300 dark:hover:bg-green-950/30"
                      >
                        Enable All
                      </button>

                      <button
                        onClick={() => disableAll(user)}
                        className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                      >
                        Disable All
                      </button>
                    </div>
                  </div>

                  {/* Permission controls */}
                  <div className="grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-3">
                    {permissionItems.map((item) => (
                      <label
                        key={item.key}
                        className="flex cursor-pointer items-start justify-between gap-3 rounded-xl border border-gray-100 p-3 transition hover:border-red-200 dark:border-gray-700 dark:hover:border-red-900"
                      >
                        <div>
                          <p className="text-sm font-semibold">
                            {item.title}
                          </p>
                          <p className="mt-1 text-xs leading-5 text-gray-500">
                            {item.description}
                          </p>
                        </div>

                        <input
                          type="checkbox"
                          checked={draft[item.key]}
                          onChange={(event) =>
                            togglePermission(
                              user.id,
                              item.key,
                              event.target.checked
                            )
                          }
                          className="mt-1 h-5 w-5 shrink-0 cursor-pointer accent-red-600"
                        />
                      </label>
                    ))}
                  </div>

                  {/* Save actions */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 bg-white px-4 py-3 dark:border-gray-700 dark:bg-[#191e29]">
                    <p className="text-xs text-gray-500">
                      {changed
                        ? "আপনার permission পরিবর্তনগুলো এখনো save হয়নি।"
                        : "All changes saved"}
                    </p>

                    <div className="flex gap-2">
                      {changed && (
                        <button
                          onClick={() => resetPermissions(user)}
                          disabled={savingId === user.id}
                          className={`${buttonClass} border border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800`}
                        >
                          Reset
                        </button>
                      )}

                      <button
                        onClick={() => void savePermissions(user)}
                        disabled={!changed || savingId === user.id}
                        className={`${buttonClass} ${
                          changed
                            ? "bg-red-600 text-white hover:bg-red-700"
                            : "bg-gray-100 text-gray-400 dark:bg-gray-800"
                        }`}
                      >
                        {savingId === user.id ? "Saving..." : "Save Permissions"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Permission information */}
      <section className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-[#191e29]">
        <h2 className="font-bold">Permission Information</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <InfoItem
            title="SUPER_ADMIN"
            description="সব permission স্বয়ংক্রিয়ভাবে পাবে।"
          />
          <InfoItem
            title="ADMIN"
            description="শুধু অনুমোদিত permission ব্যবহার করতে পারবে।"
          />
          <InfoItem
            title="EDITOR"
            description="শুধু অনুমোদিত permission ব্যবহার করতে পারবে।"
          />
          <InfoItem
            title="Default Permission"
            description="নতুন Admin/Editor-এর সব permission বন্ধ থাকবে।"
          />
        </div>
      </section>
    </div>
  );
}

function StatCard({
  title,
  value,
}: {
  title: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-[#191e29]">
      <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
      <p className="mt-2 text-3xl font-bold">
        {value.toLocaleString("en-US")}
      </p>
    </div>
  );
}

function Notice({
  type,
  text,
}: {
  type: "success" | "error";
  text: string;
}) {
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

function InfoItem({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl bg-gray-50 p-4 dark:bg-[#11151e]">
      <h3 className="text-sm font-bold">{title}</h3>
      <p className="mt-1 text-xs leading-5 text-gray-500 dark:text-gray-400">
        {description}
      </p>
    </div>
  );
}
