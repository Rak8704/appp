
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

type DashboardData = {
  totalUsers?: number;
  totalArticles?: number;
  publishedArticles?: number;
  pendingComments?: number;
  totalViews?: number;
  totalCategories?: number;
  recentArticles?: Array<{
    id: string;
    title: string;
    slug?: string;
    status?: string;
    createdAt?: string;
    author?: { name?: string };
    category?: { name?: string };
  }>;
  recentUsers?: Array<{
    id: string;
    name: string;
    email: string;
    role?: string;
    createdAt?: string;
  }>;
  [key: string]: unknown;
};

const statCards = [
  {
    title: "মোট ব্যবহারকারী",
    key: "totalUsers",
    icon: "👥",
    color: "bg-blue-50 text-blue-700",
  },
  {
    title: "মোট সংবাদ",
    key: "totalArticles",
    icon: "📰",
    color: "bg-purple-50 text-purple-700",
  },
  {
    title: "প্রকাশিত সংবাদ",
    key: "publishedArticles",
    icon: "✅",
    color: "bg-emerald-50 text-emerald-700",
  },
  {
    title: "অপেক্ষমাণ মন্তব্য",
    key: "pendingComments",
    icon: "💬",
    color: "bg-amber-50 text-amber-700",
  },
  {
    title: "মোট ভিউ",
    key: "totalViews",
    icon: "👁️",
    color: "bg-pink-50 text-pink-700",
  },
  {
    title: "মোট ক্যাটাগরি",
    key: "totalCategories",
    icon: "📂",
    color: "bg-cyan-50 text-cyan-700",
  },
] as const;

function formatNumber(value: unknown) {
  if (typeof value !== "number") return "—";
  return new Intl.NumberFormat("en-US").format(value);
}

function formatDate(value?: string) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("bn-BD", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getStatus(status?: string) {
  switch (status?.toUpperCase()) {
    case "PUBLISHED":
      return "bg-emerald-50 text-emerald-700";
    case "DRAFT":
      return "bg-slate-100 text-slate-600";
    case "PENDING":
      return "bg-amber-50 text-amber-700";
    case "REJECTED":
      return "bg-red-50 text-red-700";
    default:
      return "bg-slate-100 text-slate-600";
  }
}

export default function DashboardContent() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/admin/dashboard", {
  method: "GET",
  credentials: "include",
  cache: "no-store",
  headers: {
    "Content-Type": "application/json",
  },
});

      const result = await response.json();

      if (!response.ok || result.success === false) {
        throw new Error(result.message || "Dashboard data load করা যায়নি");
      }

      const dashboard = result.data ?? result;

      setData(dashboard as DashboardData);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "একটি অজানা সমস্যা হয়েছে"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  const recentArticles = Array.isArray(data?.recentArticles)
    ? data.recentArticles
    : [];

  const recentUsers = Array.isArray(data?.recentUsers)
    ? data.recentUsers
    : [];

  return (
    <div className="space-y-7">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-blue-600">
            দৈনিক দিনলিপি / Overview
          </p>

          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Dashboard
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            আপনার নিউজ পোর্টালের সামগ্রিক কার্যক্রম এক জায়গায় দেখুন।
          </p>
        </div>

        <button
          onClick={() => void loadDashboard()}
          disabled={loading}
          className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:opacity-50"
        >
          {loading ? "Loading..." : "↻ Refresh Data"}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
          <button
            onClick={() => void loadDashboard()}
            className="ml-3 font-semibold underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* Statistics */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-800">
            Overview Statistics
          </h2>
          <span className="text-xs text-slate-400">
            Live dashboard data
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {statCards.map((card) => {
            const value = data?.[card.key];

            return (
              <div
                key={card.key}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      {card.title}
                    </p>

                    <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
                      {loading ? "..." : formatNumber(value)}
                    </p>
                  </div>

                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl text-2xl ${card.color}`}
                  >
                    {card.icon}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Quick Actions */}
      <section>
        <h2 className="mb-4 text-lg font-bold text-slate-800">
          Quick Actions
        </h2>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            {
              title: "নতুন সংবাদ",
              href: "/admin/articles",
              icon: "✍️",
            },
            {
              title: "নতুন ক্যাটাগরি",
              href: "/admin/categories",
              icon: "📂",
            },
            {
              title: "ব্যবহারকারী",
              href: "/admin/users",
              icon: "👥",
            },
            {
              title: "বিজ্ঞাপন",
              href: "/admin/ads",
              icon: "📢",
            },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 transition hover:border-blue-300 hover:bg-blue-50"
            >
              <span className="text-2xl">{item.icon}</span>
              <span className="text-sm font-semibold text-slate-700">
                {item.title}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent Articles */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 p-5">
          <div>
            <h2 className="font-bold text-slate-900">
              সাম্প্রতিক সংবাদ
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Recently created articles
            </p>
          </div>

          <Link
            href="/admin/articles"
            className="text-sm font-semibold text-blue-600 hover:underline"
          >
            সব দেখুন →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px] text-left text-sm">
            <thead className="bg-slate-50 text-xs text-slate-500">
              <tr>
                <th className="px-5 py-4 font-semibold">সংবাদের শিরোনাম</th>
                <th className="px-5 py-4 font-semibold">লেখক</th>
                <th className="px-5 py-4 font-semibold">স্ট্যাটাস</th>
                <th className="px-5 py-4 font-semibold">তারিখ</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-400">
                    Loading articles...
                  </td>
                </tr>
              ) : recentArticles.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-400">
                    এখনো কোনো সাম্প্রতিক সংবাদ পাওয়া যায়নি।
                  </td>
                </tr>
              ) : (
                recentArticles.map((article) => (
                  <tr key={article.id} className="hover:bg-slate-50">
                    <td className="max-w-sm px-5 py-4 font-medium text-slate-800">
                      {article.title}
                    </td>
                    <td className="px-5 py-4 text-slate-500">
                      {article.author?.name || "—"}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatus(article.status)}`}
                      >
                        {article.status || "Unknown"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-500">
                      {formatDate(article.createdAt)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Recent Users */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 p-5">
          <div>
            <h2 className="font-bold text-slate-900">
              সাম্প্রতিক ব্যবহারকারী
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Recently registered users
            </p>
          </div>

          <Link
            href="/admin/users"
            className="text-sm font-semibold text-blue-600 hover:underline"
          >
            সব দেখুন →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-left text-sm">
            <thead className="bg-slate-50 text-xs text-slate-500">
              <tr>
                <th className="px-5 py-4 font-semibold">নাম</th>
                <th className="px-5 py-4 font-semibold">ইমেইল</th>
                <th className="px-5 py-4 font-semibold">Role</th>
                <th className="px-5 py-4 font-semibold">যোগদানের তারিখ</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-400">
                    Loading users...
                  </td>
                </tr>
              ) : recentUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-400">
                    কোনো ব্যবহারকারী পাওয়া যায়নি।
                  </td>
                </tr>
              ) : (
                recentUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50">
                    <td className="px-5 py-4 font-semibold text-slate-800">
                      {user.name}
                    </td>
                    <td className="px-5 py-4 text-slate-500">
                      {user.email}
                    </td>
                    <td className="px-5 py-4">
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                        {user.role || "READER"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-500">
                      {formatDate(user.createdAt)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
