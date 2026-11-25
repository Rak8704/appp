
"use client";

import { useCallback, useEffect, useState } from "react";

type Article = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  status: string;
  isFeatured: boolean;
  isBreaking: boolean;
  isTrending: boolean;
  viewCount: number;
  publishedAt: string | null;
  createdAt: string;
  author: { id: string; name: string };
  category: { id: string; name: string };
};

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);

  const loadArticles = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/articles", {
        cache: "no-store",
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Articles load failed");
      }

      setArticles(
        Array.isArray(data)
          ? data
          : data.articles ?? data.data ?? []
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Load failed");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadArticles();
  }, [loadArticles]);

  async function updateStatus(id: string, newStatus: string) {
    try {
      const response = await fetch(`/api/admin/articles/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Status update failed");
      }

      await loadArticles();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Update failed");
    }
  }

  async function deleteArticle(article: Article) {
    if (!confirm(`Delete "${article.title}"?`)) return;

    try {
      const response = await fetch(`/api/admin/articles/${article.id}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Delete failed");
      }

      await loadArticles();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Delete failed");
    }
  }

  const filtered = articles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(search.toLowerCase()) ||
      article.slug.toLowerCase().includes(search.toLowerCase());

    return matchesSearch && (status === "ALL" || article.status === status);
  });

  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const rows = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Article Management</h1>
          <p className="text-sm text-gray-500">Manage all news articles</p>
        </div>
        <a
          href="/admin/articles/create"
          className="rounded-lg bg-blue-600 px-5 py-3 text-white"
        >
          + Create Article
        </a>
      </div>

      {error && <p className="rounded bg-red-50 p-3 text-red-700">{error}</p>}

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat title="Total Articles" value={articles.length} />
        <Stat title="Published" value={articles.filter(a => a.status === "PUBLISHED").length} />
        <Stat title="Drafts" value={articles.filter(a => a.status === "DRAFT").length} />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search articles..."
          className="flex-1 rounded-lg border p-3 dark:bg-gray-900"
        />
        <select
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          className="rounded-lg border p-3 dark:bg-gray-900"
        >
          <option value="ALL">All Status</option>
          <option value="DRAFT">Draft</option>
          <option value="PENDING">Pending</option>
          <option value="PUBLISHED">Published</option>
          <option value="ARCHIVED">Archived</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-xl border bg-white dark:bg-gray-900">
        {loading ? (
          <p className="p-10 text-center">Loading...</p>
        ) : (
          <table className="w-full min-w-[850px] text-left text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                {["Article", "Author", "Category", "Views", "Status", "Actions"].map(x =>
                  <th key={x} className="p-4">{x}</th>
                )}
              </tr>
            </thead>
            <tbody>
              {rows.map(article => (
                <tr key={article.id} className="border-t dark:border-gray-700">
                  <td className="p-4">
                    <p className="font-semibold">{article.title}</p>
                    <p className="text-xs text-gray-500">{article.slug}</p>
                    <div className="mt-1 flex gap-1 text-xs">
                      {article.isBreaking && <span className="text-red-600">Breaking</span>}
                      {article.isFeatured && <span className="text-blue-600">Featured</span>}
                      {article.isTrending && <span className="text-orange-600">Trending</span>}
                    </div>
                  </td>
                  <td className="p-4">{article.author?.name ?? "Unknown"}</td>
                  <td className="p-4">{article.category?.name ?? "Unknown"}</td>
                  <td className="p-4">{article.viewCount}</td>
                  <td className="p-4">
                    <select
                      value={article.status}
                      onChange={e => updateStatus(article.id, e.target.value)}
                      className="rounded border p-2 dark:bg-gray-800"
                    >
                      {["DRAFT", "PENDING", "PUBLISHED", "ARCHIVED"].map(s =>
                        <option key={s} value={s}>{s}</option>
                      )}
                    </select>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <a className="rounded bg-blue-50 px-3 py-2 text-blue-700" href={`/admin/articles/${article.id}/edit`}>Edit</a>
                      <button onClick={() => deleteArticle(article)} className="rounded bg-red-50 px-3 py-2 text-red-700">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && <tr><td colSpan={6} className="p-8 text-center">No articles found.</td></tr>}
            </tbody>
          </table>
        )}
        <div className="flex items-center justify-between border-t p-4 dark:border-gray-700">
          <span className="text-sm text-gray-500">{filtered.length} articles</span>
          <div className="flex gap-2">
            <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="rounded border px-3 py-2 disabled:opacity-40">Previous</button>
            <span className="px-2 py-2 text-sm">{page}/{totalPages}</span>
            <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="rounded border px-3 py-2 disabled:opacity-40">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ title, value }: { title: string; value: number }) {
  return (
    <div className="rounded-xl border bg-white p-5 dark:bg-gray-900">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="mt-2 text-3xl font-bold">{value}</p>
    </div>
  );
}
