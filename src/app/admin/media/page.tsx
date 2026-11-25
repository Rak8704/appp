
"use client";

import { useCallback, useEffect, useState } from "react";

type MediaItem = {
  id: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  altText: string | null;
  createdAt: string;
  uploadedBy?: {
    id: string;
    name: string;
    email: string;
  };
};

type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

const initialPagination: Pagination = {
  page: 1,
  limit: 20,
  total: 0,
  totalPages: 1,
};

export default function MediaPage() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [pagination, setPagination] =
    useState<Pagination>(initialPagination);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);

  const [fileName, setFileName] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [fileType, setFileType] = useState("IMAGE");
  const [fileSize, setFileSize] = useState("0");
  const [altText, setAltText] = useState("");

  const loadMedia = useCallback(async () => {
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
        `/api/admin/media?${params.toString()}`,
        {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Media লোড করা যায়নি"
        );
      }

      setMedia(Array.isArray(result.data) ? result.data : []);

      setPagination({
        page: result.pagination?.page ?? page,
        limit: result.pagination?.limit ?? 20,
        total: result.pagination?.total ?? 0,
        totalPages: Math.max(
          result.pagination?.totalPages ?? 1,
          1
        ),
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Media লোড করতে সমস্যা হয়েছে"
      );
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    loadMedia();
  }, [loadMedia]);

  function resetForm() {
    setFileName("");
    setFileUrl("");
    setFileType("IMAGE");
    setFileSize("0");
    setAltText("");
  }

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setSaving(true);
    setError("");
    setNotice("");

    const parsedSize = Number(fileSize);

    if (!Number.isSafeInteger(parsedSize) || parsedSize < 0) {
      setError("File size সঠিকভাবে দিতে হবে।");
      setSaving(false);
      return;
    }

    try {
      const response = await fetch("/api/admin/media", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fileName: fileName.trim(),
          fileUrl: fileUrl.trim(),
          fileType,
          fileSize: parsedSize,
          altText: altText.trim() || null,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        const fieldErrors = result.errors?.fieldErrors;

        if (fieldErrors) {
          const messages = Object.values(fieldErrors)
            .flat()
            .filter(Boolean);

          throw new Error(
            messages.join(", ") || result.message
          );
        }

        throw new Error(
          result.message || "Media তৈরি করা যায়নি"
        );
      }

      setNotice("Media সফলভাবে যোগ হয়েছে।");
      resetForm();
      setShowForm(false);
      setPage(1);

      await loadMedia();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Media তৈরি করতে সমস্যা হয়েছে"
      );
    } finally {
      setSaving(false);
    }
  }

  async function copyUrl(url: string) {
    try {
      await navigator.clipboard.writeText(url);
      setNotice("Media URL কপি হয়েছে।");
    } catch {
      setError("URL কপি করা যায়নি।");
    }
  }

  function formatSize(bytes: number) {
    if (!Number.isFinite(bytes) || bytes <= 0) {
      return "0 Bytes";
    }

    const units = ["Bytes", "KB", "MB", "GB"];
    const index = Math.min(
      Math.floor(Math.log(bytes) / Math.log(1024)),
      units.length - 1
    );

    return `${(bytes / Math.pow(1024, index)).toFixed(2)} ${units[index]}`;
  }

  function isImage(type: string) {
    return (
      type.toLowerCase().includes("image") ||
      type.toLowerCase() === "jpg" ||
      type.toLowerCase() === "png" ||
      type.toLowerCase() === "jpeg" ||
      type.toLowerCase() === "webp"
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-medium text-blue-600">
            দৈনিক দিনলিপি / Admin
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            Media Library
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Manage images, videos, documents and media records.
          </p>
        </div>

        <button
          onClick={() => {
            setShowForm(!showForm);
            setError("");
            setNotice("");
          }}
          className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
        >
          {showForm ? "Close Form" : "+ Add Media"}
        </button>
      </div>

      {/* Notifications */}
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

      {/* Statistics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Total Media</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">
            {pagination.total}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Current Page Items</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">
            {media.length}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Total Pages</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">
            {pagination.totalPages}
          </p>
        </div>
      </div>

      {/* Add Media Form */}
      {showForm && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-900">
              Add New Media
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              আগে থেকে আপলোড করা ফাইলের URL দিয়ে Media record তৈরি করুন।
            </p>
          </div>

          <form onSubmit={handleCreate} className="space-y-5">
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  File Name *
                </label>

                <input
                  required
                  maxLength={255}
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  placeholder="example-image.jpg"
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  File Type *
                </label>

                <select
                  value={fileType}
                  onChange={(e) => setFileType(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
                >
                  <option value="IMAGE">Image</option>
                  <option value="VIDEO">Video</option>
                  <option value="DOCUMENT">Document</option>
                  <option value="PDF">PDF</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  File URL *
                </label>

                <input
                  required
                  type="url"
                  maxLength={2000}
                  value={fileUrl}
                  onChange={(e) => setFileUrl(e.target.value)}
                  placeholder="https://example.com/uploads/image.jpg"
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  File Size (Bytes) *
                </label>

                <input
                  required
                  type="number"
                  min="0"
                  step="1"
                  value={fileSize}
                  onChange={(e) => setFileSize(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Alt Text
                </label>

                <input
                  maxLength={500}
                  value={altText}
                  onChange={(e) => setAltText(e.target.value)}
                  placeholder="Describe this media..."
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {fileUrl && (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="mb-3 text-sm font-semibold text-slate-700">
                  URL Preview
                </p>

                {fileType === "IMAGE" && (
                  <img
                    src={fileUrl}
                    alt={altText || "Media preview"}
                    className="max-h-48 max-w-full rounded-lg object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                )}

                <p className="mt-2 break-all text-xs text-slate-500">
                  {fileUrl}
                </p>
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Media"}
              </button>

              <button
                type="button"
                onClick={() => {
                  resetForm();
                  setShowForm(false);
                }}
                className="rounded-lg border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="search"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search media by file name..."
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
        />

        <button
          onClick={loadMedia}
          disabled={loading}
          className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
        >
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      {/* Media Grid */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">
            All Media
          </h2>

          <span className="text-sm text-slate-500">
            {pagination.total} records
          </span>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-500">
            Loading media...
          </div>
        ) : media.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <div className="text-4xl">🖼️</div>
            <h3 className="mt-4 font-semibold text-slate-800">
              No Media Found
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              কোনো Media record পাওয়া যায়নি।
            </p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {media.map((item) => (
              <div
                key={item.id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
              >
                <div className="flex h-44 items-center justify-center overflow-hidden bg-slate-100">
                  {isImage(item.fileType) ? (
                    <img
                      src={item.fileUrl}
                      alt={item.altText || item.fileName}
                      className="h-full w-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="text-center">
                      <div className="text-5xl">
                        {item.fileType.toLowerCase().includes("video")
                          ? "🎬"
                          : item.fileType.toLowerCase().includes("pdf")
                            ? "📕"
                            : "📄"}
                      </div>
                      <p className="mt-2 text-xs font-semibold text-slate-500">
                        {item.fileType}
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-3 p-4">
                  <div>
                    <h3
                      className="truncate font-semibold text-slate-900"
                      title={item.fileName}
                    >
                      {item.fileName}
                    </h3>

                    <p className="mt-1 text-xs text-slate-500">
                      {formatSize(item.fileSize)}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                      {item.fileType}
                    </span>

                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500">
                    Uploaded by: {item.uploadedBy?.name || "Unknown"}
                  </p>

                  <div className="flex gap-2 border-t border-slate-100 pt-3">
                    <button
                      onClick={() => copyUrl(item.fileUrl)}
                      className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      Copy URL
                    </button>

                    <a
                      href={item.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 rounded-lg bg-blue-600 px-3 py-2 text-center text-xs font-semibold text-white hover:bg-blue-700"
                    >
                      Open File
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4">
        <p className="text-sm text-slate-500">
          Page {pagination.page} of {pagination.totalPages}
        </p>

        <div className="flex gap-2">
          <button
            disabled={page <= 1 || loading}
            onClick={() => setPage((current) => current - 1)}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium disabled:opacity-40"
          >
            Previous
          </button>

          <button
            disabled={page >= pagination.totalPages || loading}
            onClick={() => setPage((current) => current + 1)}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
