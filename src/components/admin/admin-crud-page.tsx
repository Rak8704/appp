
"use client";

import { useCallback, useEffect, useState } from "react";

type Field = {
  name: string;
  label: string;
  type?: "text" | "url" | "date" | "textarea" | "select" | "checkbox";
  required?: boolean;
  nullable?: boolean;
  options?: { label: string; value: string }[];
  placeholder?: string;
};

type CrudConfig = {
  title: string;
  description: string;
  endpoint: string;
  fields: Field[];
  columns: { key: string; label: string }[];
};

type RecordItem = Record<string, unknown> & {
  id: string;
};

type FormValues = Record<string, string | boolean>;

const emptyPagination = {
  page: 1,
  limit: 20,
  total: 0,
  totalPages: 1,
};

export default function AdminCrudPage({
  config,
}: {
  config: CrudConfig;
}) {
  const [items, setItems] = useState<RecordItem[]>([]);
  const [pagination, setPagination] = useState(emptyPagination);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormValues>({});

  const createEmptyForm = useCallback(() => {
    const values: FormValues = {};

    config.fields.forEach((field) => {
      values[field.name] =
        field.type === "checkbox" ? false : "";
    });

    return values;
  }, [config.fields]);

  const loadItems = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: "20",
      });

      const response = await fetch(
        `${config.endpoint}?${params.toString()}`,
        {
          credentials: "include",
          cache: "no-store",
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "ডেটা লোড করা যায়নি");
      }

      setItems(Array.isArray(result.data) ? result.data : []);

      setPagination({
        page: result.pagination?.page ?? page,
        limit: result.pagination?.limit ?? 20,
        total: result.pagination?.total ?? 0,
        totalPages: Math.max(result.pagination?.totalPages ?? 1, 1),
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "ডেটা লোড করতে সমস্যা হয়েছে"
      );
    } finally {
      setLoading(false);
    }
  }, [config.endpoint, page]);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  function openCreateForm() {
    setEditingId(null);
    setForm(createEmptyForm());
    setError("");
    setNotice("");
    setShowForm(true);
  }

  function openEditForm(item: RecordItem) {
    const values: FormValues = {};

    config.fields.forEach((field) => {
      const value = item[field.name];

      if (field.type === "checkbox") {
        values[field.name] = Boolean(value);
      } else if (
        field.type === "date" &&
        typeof value === "string" &&
        value
      ) {
        values[field.name] = value.slice(0, 10);
      } else {
        values[field.name] =
          value === null || value === undefined ? "" : String(value);
      }
    });

    setEditingId(item.id);
    setForm(values);
    setError("");
    setNotice("");
    setShowForm(true);
  }

  function updateField(name: string, value: string | boolean) {
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");

    try {
      const payload: Record<string, unknown> = {};

      config.fields.forEach((field) => {
        const value = form[field.name];

        if (field.type === "checkbox") {
          payload[field.name] = Boolean(value);
        } else if (
          field.nullable &&
          (value === "" || value === undefined)
        ) {
          payload[field.name] = null;
        } else {
          payload[field.name] = value;
        }
      });

      const response = await fetch(
        editingId
          ? `${config.endpoint}/${editingId}`
          : config.endpoint,
        {
          method: editingId ? "PATCH" : "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        const fieldErrors = result.errors?.fieldErrors;
        const messages = fieldErrors
          ? Object.values(fieldErrors).flat().filter(Boolean)
          : [];

        throw new Error(
          messages.length
            ? messages.join(", ")
            : result.message || "তথ্য সংরক্ষণ করা যায়নি"
        );
      }

      setNotice(
        editingId
          ? "তথ্য সফলভাবে আপডেট হয়েছে।"
          : "নতুন রেকর্ড সফলভাবে তৈরি হয়েছে।"
      );

      setShowForm(false);
      setEditingId(null);
      setForm(createEmptyForm());

      if (!editingId) {
        setPage(1);
      }

      await loadItems();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "সংরক্ষণ করতে সমস্যা হয়েছে"
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(item: RecordItem) {
    const confirmed = window.confirm(
      `আপনি কি "${String(item.title || item.name || item.id)}" মুছে ফেলতে চান?`
    );

    if (!confirmed) return;

    setError("");
    setNotice("");

    try {
      const response = await fetch(
        `${config.endpoint}/${item.id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Delete করা যায়নি");
      }

      setNotice(result.message || "রেকর্ড মুছে ফেলা হয়েছে।");

      if (items.length === 1 && page > 1) {
        setPage((current) => current - 1);
      } else {
        await loadItems();
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Delete করতে সমস্যা হয়েছে"
      );
    }
  }

  function displayValue(value: unknown) {
    if (value === null || value === undefined || value === "") return "—";
    if (typeof value === "boolean") return value ? "Active" : "Inactive";

    if (typeof value === "object") {
      return JSON.stringify(value);
    }

    return String(value);
  }

  const filteredItems = items.filter((item) => {
    const query = search.trim().toLowerCase();
    if (!query) return true;

    return config.columns.some(({ key }) =>
      displayValue(item[key]).toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-medium text-blue-600">
            দৈনিক দিনলিপি / Admin
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            {config.title}
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            {config.description}
          </p>
        </div>

        <button
          onClick={openCreateForm}
          className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
        >
          + Add New
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border bg-white p-5">
          <p className="text-sm text-slate-500">Total Records</p>
          <p className="mt-2 text-3xl font-bold">{pagination.total}</p>
        </div>
        <div className="rounded-xl border bg-white p-5">
          <p className="text-sm text-slate-500">Current Page Items</p>
          <p className="mt-2 text-3xl font-bold">{items.length}</p>
        </div>
        <div className="rounded-xl border bg-white p-5">
          <p className="text-sm text-slate-500">Total Pages</p>
          <p className="mt-2 text-3xl font-bold">
            {pagination.totalPages}
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {notice && (
        <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
          {notice}
        </div>
      )}

      {showForm && (
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                {editingId ? "Edit Record" : "Create New Record"}
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                প্রয়োজনীয় তথ্য পূরণ করে Save করুন।
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-lg border px-3 py-2 text-sm"
            >
              Close
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-5 md:grid-cols-2">
              {config.fields.map((field) => (
                <div
                  key={field.name}
                  className={
                    field.type === "textarea"
                      ? "md:col-span-2"
                      : ""
                  }
                >
                  {field.type === "checkbox" ? (
                    <label className="flex items-center gap-3 rounded-xl border p-4">
                      <input
                        type="checkbox"
                        checked={Boolean(form[field.name])}
                        onChange={(e) =>
                          updateField(field.name, e.target.checked)
                        }
                        className="h-4 w-4"
                      />
                      <span className="text-sm font-medium text-slate-700">
                        {field.label}
                      </span>
                    </label>
                  ) : (
                    <>
                      <label className="mb-2 block text-sm font-medium text-slate-700">
                        {field.label}
                        {field.required ? " *" : ""}
                      </label>

                      {field.type === "textarea" ? (
                        <textarea
                          required={field.required}
                          value={String(form[field.name] ?? "")}
                          onChange={(e) =>
                            updateField(field.name, e.target.value)
                          }
                          placeholder={field.placeholder}
                          rows={4}
                          className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500"
                        />
                      ) : field.type === "select" ? (
                        <select
                          required={field.required}
                          value={String(form[field.name] ?? "")}
                          onChange={(e) =>
                            updateField(field.name, e.target.value)
                          }
                          className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
                        >
                          <option value="">Select {field.label}</option>
                          {field.options?.map((option) => (
                            <option
                              key={option.value}
                              value={option.value}
                            >
                              {option.label}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={field.type || "text"}
                          required={field.required}
                          value={String(form[field.name] ?? "")}
                          onChange={(e) =>
                            updateField(field.name, e.target.value)
                          }
                          placeholder={field.placeholder}
                          className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500"
                        />
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 border-t pt-5">
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {saving
                  ? "Saving..."
                  : editingId
                    ? "Update Record"
                    : "Create Record"}
              </button>

              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-lg border px-6 py-3 text-sm font-semibold"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b p-5 sm:flex-row">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`Search ${config.title}...`}
            className="w-full rounded-lg border px-4 py-3 text-sm outline-none focus:border-blue-500"
          />

          <button
            onClick={loadItems}
            disabled={loading}
            className="rounded-lg border px-5 py-3 text-sm font-semibold hover:bg-slate-50 disabled:opacity-50"
          >
            Refresh
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="whitespace-nowrap p-4">#</th>
                {config.columns.map((column) => (
                  <th key={column.key} className="whitespace-nowrap p-4">
                    {column.label}
                  </th>
                ))}
                <th className="whitespace-nowrap p-4 text-right">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td
                    colSpan={config.columns.length + 2}
                    className="p-10 text-center text-slate-500"
                  >
                    Loading records...
                  </td>
                </tr>
              ) : filteredItems.length === 0 ? (
                <tr>
                  <td
                    colSpan={config.columns.length + 2}
                    className="p-10 text-center text-slate-500"
                  >
                    কোনো রেকর্ড পাওয়া যায়নি।
                  </td>
                </tr>
              ) : (
                filteredItems.map((item, index) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="p-4 text-slate-500">
                      {(page - 1) * pagination.limit + index + 1}
                    </td>

                    {config.columns.map((column) => (
                      <td
                        key={column.key}
                        className="max-w-xs whitespace-nowrap p-4 text-slate-700"
                      >
                        {column.key === "isActive" ||
                        column.key === "isPublished" ? (
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              item[column.key]
                                ? "bg-green-50 text-green-700"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {item[column.key] ? "Active" : "Inactive"}
                          </span>
                        ) : (
                          <span className="block max-w-xs truncate">
                            {displayValue(item[column.key])}
                          </span>
                        )}
                      </td>
                    ))}

                    <td className="whitespace-nowrap p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openEditForm(item)}
                          className="rounded-lg border border-blue-200 px-3 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-50"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(item)}
                          className="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-50"
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

        <div className="flex flex-wrap items-center justify-between gap-3 border-t p-4">
          <p className="text-sm text-slate-500">
            Total: {pagination.total} records
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
      </div>
    </div>
  );
}
