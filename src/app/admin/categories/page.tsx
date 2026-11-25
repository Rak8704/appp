
"use client";

import { useCallback, useEffect, useState } from "react";

type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  isActive: boolean;
  sortOrder: number;
  parentId: string | null;
  createdAt: string;
  updatedAt: string;
  parent?: {
    id: string;
    name: string;
  } | null;
  _count?: {
    articles: number;
    children: number;
  };
};

type CategoryForm = {
  name: string;
  slug: string;
  description: string;
  image: string;
  isActive: boolean;
  sortOrder: number;
  parentId: string;
};

const initialForm: CategoryForm = {
  name: "",
  slug: "",
  description: "",
  image: "",
  isActive: true,
  sortOrder: 0,
  parentId: "",
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState<CategoryForm>(initialForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showForm, setShowForm] = useState(false);

  const pageSize = 10;

  const loadCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/admin/categories", {
        method: "GET",
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Category load করা যায়নি");
      }

      const items = Array.isArray(data)
        ? data
        : data.categories ?? data.data ?? [];

      setCategories(items);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Category load করতে সমস্যা হয়েছে"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  function makeSlug(value: string) {
    return value
      .trim()
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\u0980-\u09ff]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  function openCreateForm() {
    setEditingId(null);
    setForm(initialForm);
    setError("");
    setMessage("");
    setShowForm(true);
  }

  function openEditForm(category: Category) {
    setEditingId(category.id);

    setForm({
      name: category.name,
      slug: category.slug,
      description: category.description ?? "",
      image: category.image ?? "",
      isActive: category.isActive,
      sortOrder: category.sortOrder,
      parentId: category.parentId ?? "",
    });

    setError("");
    setMessage("");
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingId(null);
    setForm(initialForm);
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!form.name.trim()) {
      setError("Category name দিতে হবে");
      return;
    }

    if (!form.slug.trim()) {
      setError("Slug দিতে হবে");
      return;
    }

    if (editingId && form.parentId === editingId) {
      setError("নিজেকে Parent Category করা যাবে না");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const payload = {
        name: form.name.trim(),
        slug: form.slug.trim(),
        description: form.description.trim() || null,
        image: form.image.trim() || null,
        isActive: form.isActive,
        sortOrder: Number(form.sortOrder),
        parentId: form.parentId || null,
      };

      const response = await fetch(
        editingId
          ? `/api/admin/categories/${editingId}`
          : "/api/admin/categories",
        {
          method: editingId ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Category save করা যায়নি"
        );
      }

      setMessage(
        editingId
          ? "Category সফলভাবে Update হয়েছে"
          : "Category সফলভাবে তৈরি হয়েছে"
      );

      closeForm();
      await loadCategories();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "সমস্যা হয়েছে"
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(category: Category) {
    const confirmed = window.confirm(
      `"${category.name}" Category Delete করতে চাও?`
    );

    if (!confirmed) return;

    try {
      setError("");
      setMessage("");

      const response = await fetch(
        `/api/admin/categories/${category.id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Category Delete করা যায়নি"
        );
      }

      setMessage("Category Delete হয়েছে");
      await loadCategories();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Delete করতে সমস্যা হয়েছে"
      );
    }
  }

  const filteredCategories = categories.filter((category) => {
    const query = search.toLowerCase();

    return (
      category.name.toLowerCase().includes(query) ||
      category.slug.toLowerCase().includes(query)
    );
  });

  const totalPages = Math.max(
    1,
    Math.ceil(filteredCategories.length / pageSize)
  );

  const paginatedCategories = filteredCategories.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  useEffect(() => {
    setPage(1);
  }, [search]);

  const activeCount = categories.filter(
    (item) => item.isActive
  ).length;

  const inactiveCount = categories.length - activeCount;

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Category Management
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            News categories তৈরি, Edit এবং Manage করুন।
          </p>
        </div>

        <button
          onClick={openCreateForm}
          className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
        >
          + Add Category
        </button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {message && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900">
          <p className="text-sm text-gray-500">Total Categories</p>
          <p className="mt-2 text-3xl font-bold">{categories.length}</p>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900">
          <p className="text-sm text-gray-500">Active Categories</p>
          <p className="mt-2 text-3xl font-bold text-green-600">
            {activeCount}
          </p>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900">
          <p className="text-sm text-gray-500">Inactive Categories</p>
          <p className="mt-2 text-3xl font-bold text-red-500">
            {inactiveCount}
          </p>
        </div>
      </div>

      {showForm && (
        <div className="rounded-xl border bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-bold">
              {editingId ? "Edit Category" : "Create Category"}
            </h2>

            <button
              onClick={closeForm}
              type="button"
              className="text-xl text-gray-500 hover:text-red-500"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Category Name *
                </label>

                <input
                  required
                  value={form.name}
                  onChange={(event) => {
                    const name = event.target.value;

                    setForm((previous) => ({
                      ...previous,
                      name,
                      slug: makeSlug(name),
                    }));
                  }}
                  className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800"
                  placeholder="বাংলাদেশ"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Slug *
                </label>

                <input
                  required
                  value={form.slug}
                  onChange={(event) =>
                    setForm((previous) => ({
                      ...previous,
                      slug: event.target.value,
                    }))
                  }
                  className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800"
                  placeholder="bangladesh"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Parent Category
                </label>

                <select
                  value={form.parentId}
                  onChange={(event) =>
                    setForm((previous) => ({
                      ...previous,
                      parentId: event.target.value,
                    }))
                  }
                  className="w-full rounded-lg border px-4 py-3 dark:border-gray-700 dark:bg-gray-800"
                >
                  <option value="">No Parent (Main Category)</option>

                  {categories
                    .filter((category) => category.id !== editingId)
                    .map((category) => (
                      <option
                        key={category.id}
                        value={category.id}
                      >
                        {category.name}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Sort Order
                </label>

                <input
                  type="number"
                  min="0"
                  value={form.sortOrder}
                  onChange={(event) =>
                    setForm((previous) => ({
                      ...previous,
                      sortOrder: Number(event.target.value),
                    }))
                  }
                  className="w-full rounded-lg border px-4 py-3 dark:border-gray-700 dark:bg-gray-800"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Image URL
                </label>

                <input
                  value={form.image}
                  onChange={(event) =>
                    setForm((previous) => ({
                      ...previous,
                      image: event.target.value,
                    }))
                  }
                  className="w-full rounded-lg border px-4 py-3 dark:border-gray-700 dark:bg-gray-800"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Status
                </label>

                <select
                  value={form.isActive ? "true" : "false"}
                  onChange={(event) =>
                    setForm((previous) => ({
                      ...previous,
                      isActive: event.target.value === "true",
                    }))
                  }
                  className="w-full rounded-lg border px-4 py-3 dark:border-gray-700 dark:bg-gray-800"
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Description
              </label>

              <textarea
                rows={3}
                value={form.description}
                onChange={(event) =>
                  setForm((previous) => ({
                    ...previous,
                    description: event.target.value,
                  }))
                }
                className="w-full rounded-lg border px-4 py-3 dark:border-gray-700 dark:bg-gray-800"
                placeholder="Category description..."
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                disabled={saving}
                type="submit"
                className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white disabled:opacity-50"
              >
                {saving
                  ? "Saving..."
                  : editingId
                    ? "Update Category"
                    : "Create Category"}
              </button>

              <button
                type="button"
                onClick={closeForm}
                className="rounded-lg border px-6 py-3 dark:border-gray-700"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="rounded-xl border bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row">
          <h2 className="text-lg font-bold">All Categories</h2>

          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search category..."
            className="w-full rounded-lg border px-4 py-2 outline-none focus:border-blue-500 sm:w-72 dark:border-gray-700 dark:bg-gray-800"
          />
        </div>

        {loading ? (
          <div className="py-12 text-center text-gray-500">
            Loading categories...
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="py-12 text-center text-gray-500">
            কোনো Category পাওয়া যায়নি।
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] text-left text-sm">
                <thead className="border-b bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
                  <tr>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Slug</th>
                    <th className="px-4 py-3">Parent</th>
                    <th className="px-4 py-3">Articles</th>
                    <th className="px-4 py-3">Order</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {paginatedCategories.map((category) => (
                    <tr
                      key={category.id}
                      className="border-b last:border-0 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                    >
                      <td className="px-4 py-4 font-medium">
                        {category.name}
                      </td>

                      <td className="px-4 py-4 text-gray-500">
                        {category.slug}
                      </td>

                      <td className="px-4 py-4">
                        {category.parent?.name || "Main Category"}
                      </td>

                      <td className="px-4 py-4">
                        {category._count?.articles ?? 0}
                      </td>

                      <td className="px-4 py-4">
                        {category.sortOrder}
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            category.isActive
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {category.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => openEditForm(category)}
                            className="rounded-md bg-blue-50 px-3 py-2 text-blue-600 hover:bg-blue-100"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => handleDelete(category)}
                            className="rounded-md bg-red-50 px-3 py-2 text-red-600 hover:bg-red-100"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-5 flex flex-col items-center justify-between gap-3 sm:flex-row">
              <p className="text-sm text-gray-500">
                Showing {paginatedCategories.length} of{" "}
                {filteredCategories.length} categories
              </p>

              <div className="flex items-center gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((previous) => previous - 1)}
                  className="rounded-lg border px-4 py-2 disabled:opacity-40 dark:border-gray-700"
                >
                  Previous
                </button>

                <span className="text-sm">
                  {page} / {totalPages}
                </span>

                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage((previous) => previous + 1)}
                  className="rounded-lg border px-4 py-2 disabled:opacity-40 dark:border-gray-700"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
