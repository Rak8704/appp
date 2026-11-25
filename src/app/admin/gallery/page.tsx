
"use client";

import { useCallback, useEffect, useState } from "react";

type Category = {
  id: string;
  name: string;
};

type GalleryImage = {
  id?: string;
  title: string;
  url: string;
  description: string;
  altText: string;
  caption: string;
  isFeatured: boolean;
  sortOrder: number;
};

type Gallery = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  coverImage: string | null;
  categoryId: string | null;
  category?: Category | null;
  isFeatured: boolean;
  isPublished: boolean;
  images: {
    id: string;
    title: string | null;
    description: string | null;
    altText: string | null;
    caption: string | null;
    isFeatured: boolean;
    sortOrder: number;
    media: {
      fileUrl: string;
      altText: string | null;
    };
  }[];
  _count?: { images: number };
};

const emptyImage = (): GalleryImage => ({
  title: "",
  url: "",
  description: "",
  altText: "",
  caption: "",
  isFeatured: false,
  sortOrder: 0,
});

const emptyForm = {
  title: "",
  slug: "",
  description: "",
  coverImage: "",
  categoryId: "",
  isFeatured: false,
  isPublished: false,
};

export default function AdminGalleryPage() {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    draft: 0,
    featured: 0,
  });

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [featuredFilter, setFeaturedFilter] = useState("all");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showEditor, setShowEditor] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [images, setImages] = useState<GalleryImage[]>([]);

  const [preview, setPreview] = useState<{
    url: string;
    title: string;
    altText: string;
  } | null>(null);

  const fetchGalleries = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: "12",
        search,
        status,
        categoryId: categoryFilter === "all" ? "" : categoryFilter,
        featured: featuredFilter,
      });

      const response = await fetch(`/api/admin/gallery?${params}`, {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Gallery লোড করা যায়নি।");
      }

      setGalleries(data.galleries || []);
      setCategories(data.categories || []);
      setStats(data.stats || {
        total: 0,
        published: 0,
        draft: 0,
        featured: 0,
      });
      setTotalPages(Math.max(1, data.pagination?.totalPages || 1));
    } catch (err) {
      setError(err instanceof Error ? err.message : "সমস্যা হয়েছে।");
    } finally {
      setLoading(false);
    }
  }, [page, search, status, categoryFilter, featuredFilter]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      fetchGalleries();
    }, 250);

    return () => window.clearTimeout(timer);
  }, [fetchGalleries]);

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setImages([]);
    setError("");
    setShowEditor(true);
  }

  function openEdit(gallery: Gallery) {
    setEditingId(gallery.id);

    setForm({
      title: gallery.title,
      slug: gallery.slug,
      description: gallery.description || "",
      coverImage: gallery.coverImage || "",
      categoryId: gallery.categoryId || "",
      isFeatured: gallery.isFeatured,
      isPublished: gallery.isPublished,
    });

    setImages(
      gallery.images.map((image, index) => ({
        id: image.id,
        title: image.title || "",
        url: image.media.fileUrl,
        description: image.description || "",
        altText: image.altText || image.media.altText || "",
        caption: image.caption || "",
        isFeatured: image.isFeatured,
        sortOrder: index,
      }))
    );

    setError("");
    setShowEditor(true);
  }

  function updateImage(
    index: number,
    field: keyof GalleryImage,
    value: string | boolean | number
  ) {
    setImages((current) =>
      current.map((image, i) =>
        i === index ? { ...image, [field]: value } : image
      )
    );
  }

  function addImage() {
    setImages((current) => [
      ...current,
      { ...emptyImage(), sortOrder: current.length },
    ]);
  }

  function removeImage(index: number) {
    setImages((current) =>
      current
        .filter((_, i) => i !== index)
        .map((image, i) => ({ ...image, sortOrder: i }))
    );
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      if (!form.title.trim()) {
        throw new Error("Gallery Title দিতে হবে।");
      }

      const validImages = images.filter((image) => image.url.trim());

      const invalidImage = validImages.find((image) => {
        try {
          new URL(image.url);
          return false;
        } catch {
          return true;
        }
      });

      if (invalidImage) {
        throw new Error("একটি Image URL সঠিক নয়।");
      }

      const payload = {
        ...form,
        categoryId: form.categoryId || null,
        coverImage: form.coverImage || null,
        images: validImages.map((image, index) => ({
          url: image.url.trim(),
          title: image.title,
          description: image.description,
          altText: image.altText,
          caption: image.caption,
          isFeatured: image.isFeatured,
          sortOrder: index,
        })),
      };

      const response = await fetch("/api/admin/gallery", {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          editingId ? { ...payload, id: editingId } : payload
        ),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Gallery Save করা যায়নি।");
      }

      setSuccess(data.message || "সফল হয়েছে।");
      setShowEditor(false);
      setEditingId(null);
      setForm(emptyForm);
      setImages([]);
      await fetchGalleries();
    } catch (err) {
      setError(err instanceof Error ? err.message : "সমস্যা হয়েছে।");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(gallery: Gallery) {
    const confirmed = window.confirm(
      `"${gallery.title}" Gallery Delete করতে চাও?`
    );

    if (!confirmed) return;

    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        `/api/admin/gallery?id=${encodeURIComponent(gallery.id)}`,
        { method: "DELETE" }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Delete করা যায়নি।");
      }

      setSuccess(data.message || "Delete হয়েছে।");
      await fetchGalleries();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete করা যায়নি।");
    }
  }

  async function quickUpdate(
    gallery: Gallery,
    field: "isPublished" | "isFeatured",
    value: boolean
  ) {
    const payload = {
      id: gallery.id,
      title: gallery.title,
      slug: gallery.slug,
      description: gallery.description,
      coverImage: gallery.coverImage,
      categoryId: gallery.categoryId,
      isFeatured: field === "isFeatured" ? value : gallery.isFeatured,
      isPublished: field === "isPublished" ? value : gallery.isPublished,
      images: gallery.images.map((image) => ({
        url: image.media.fileUrl,
        title: image.title || "",
        description: image.description || "",
        altText: image.altText || "",
        caption: image.caption || "",
        isFeatured: image.isFeatured,
        sortOrder: image.sortOrder,
      })),
    };

    try {
      const response = await fetch("/api/admin/gallery", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Update করা যায়নি।");
      }

      await fetchGalleries();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update করা যায়নি।");
    }
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Gallery Management
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            ছবি, অ্যালবাম ও প্রকাশনার সম্পূর্ণ ব্যবস্থাপনা
          </p>
        </div>

        <button
          onClick={openCreate}
          className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
        >
          + নতুন Gallery
        </button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
          <button onClick={() => setError("")} className="ml-3 font-bold">
            ×
          </button>
        </div>
      )}

      {success && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
          {success}
          <button onClick={() => setSuccess("")} className="ml-3 font-bold">
            ×
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          ["Total Albums", stats.total],
          ["Published", stats.published],
          ["Draft", stats.draft],
          ["Featured", stats.featured],
        ].map(([label, value]) => (
          <div
            key={label}
            className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900"
          >
            <p className="text-sm text-gray-500">{label}</p>
            <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
              {value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900 md:grid-cols-4">
        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Gallery খুঁজুন..."
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800"
        />

        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800"
        >
          <option value="all">সব Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>

        <select
          value={categoryFilter}
          onChange={(e) => {
            setCategoryFilter(e.target.value);
            setPage(1);
          }}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800"
        >
          <option value="all">সব Category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        <select
          value={featuredFilter}
          onChange={(e) => {
            setFeaturedFilter(e.target.value);
            setPage(1);
          }}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800"
        >
          <option value="all">Featured: সব</option>
          <option value="yes">শুধু Featured</option>
          <option value="no">Not Featured</option>
        </select>
      </div>

      {loading ? (
        <div className="rounded-xl border bg-white p-12 text-center text-gray-500 dark:border-gray-700 dark:bg-gray-900">
          Gallery লোড হচ্ছে...
        </div>
      ) : galleries.length === 0 ? (
        <div className="rounded-xl border border-dashed p-12 text-center text-gray-500 dark:border-gray-700">
          কোনো Gallery পাওয়া যায়নি।
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {galleries.map((gallery) => {
            const cover =
              gallery.coverImage || gallery.images[0]?.media.fileUrl;

            return (
              <div
                key={gallery.id}
                className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900"
              >
                <div className="relative aspect-video bg-gray-100 dark:bg-gray-800">
                  {cover ? (
                    <img
                      src={cover}
                      alt={gallery.title}
                      className="h-full w-full cursor-pointer object-cover"
                      onClick={() =>
                        setPreview({
                          url: cover,
                          title: gallery.title,
                          altText: gallery.title,
                        })
                      }
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-gray-400">
                      No Cover Image
                    </div>
                  )}

                  <span
                    className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-semibold ${
                      gallery.isPublished
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {gallery.isPublished ? "Published" : "Draft"}
                  </span>

                  {gallery.isFeatured && (
                    <span className="absolute right-3 top-3 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                      ★ Featured
                    </span>
                  )}
                </div>

                <div className="space-y-3 p-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {gallery.title}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-sm text-gray-500">
                      {gallery.description || "কোনো Description নেই"}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                    <span>{gallery._count?.images ?? gallery.images.length} ছবি</span>
                    <span>•</span>
                    <span>{gallery.category?.name || "Uncategorized"}</span>
                  </div>

                  <div className="flex flex-wrap gap-3 border-t pt-3 dark:border-gray-700">
                    <label className="flex items-center gap-2 text-xs">
                      <input
                        type="checkbox"
                        checked={gallery.isPublished}
                        onChange={(e) =>
                          quickUpdate(gallery, "isPublished", e.target.checked)
                        }
                      />
                      Published
                    </label>

                    <label className="flex items-center gap-2 text-xs">
                      <input
                        type="checkbox"
                        checked={gallery.isFeatured}
                        onChange={(e) =>
                          quickUpdate(gallery, "isFeatured", e.target.checked)
                        }
                      />
                      Featured
                    </label>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => openEdit(gallery)}
                      className="flex-1 rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100 dark:bg-blue-950 dark:text-blue-300"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(gallery)}
                      className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-100 dark:bg-red-950 dark:text-red-300"
                    >
                      Delete
                    </button>
                  </div>

                  {gallery.images.length > 0 && (
                    <div className="flex gap-2 overflow-x-auto pt-1">
                      {gallery.images.slice(0, 5).map((image) => (
                        <button
                          key={image.id}
                          onClick={() =>
                            setPreview({
                              url: image.media.fileUrl,
                              title: image.title || gallery.title,
                              altText: image.altText || "",
                            })
                          }
                          className="h-12 w-12 shrink-0 overflow-hidden rounded-md border"
                        >
                          <img
                            src={image.media.fileUrl}
                            alt={image.altText || ""}
                            className="h-full w-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-gray-500">
          Page {page} of {totalPages}
        </p>

        <div className="flex gap-2">
          <button
            disabled={page <= 1}
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            className="rounded-lg border px-4 py-2 text-sm disabled:opacity-40 dark:border-gray-700"
          >
            Previous
          </button>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
            className="rounded-lg border px-4 py-2 text-sm disabled:opacity-40 dark:border-gray-700"
          >
            Next
          </button>
        </div>
      </div>

      {showEditor && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 p-3 md:p-6">
          <div className="mx-auto my-6 max-w-4xl rounded-2xl bg-white p-5 shadow-xl dark:bg-gray-900 md:p-7">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-bold dark:text-white">
                {editingId ? "Gallery Edit" : "নতুন Gallery তৈরি"}
              </h2>
              <button
                onClick={() => setShowEditor(false)}
                className="rounded-lg px-3 py-1 text-2xl text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Gallery Title *
                  </label>
                  <input
                    required
                    value={form.title}
                    onChange={(e) =>
                      setForm({ ...form, title: e.target.value })
                    }
                    className="w-full rounded-lg border px-3 py-2 dark:border-gray-700 dark:bg-gray-800"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Slug
                  </label>
                  <input
                    value={form.slug}
                    onChange={(e) =>
                      setForm({ ...form, slug: e.target.value })
                    }
                    placeholder="খালি রাখলে Title থেকে তৈরি হবে"
                    className="w-full rounded-lg border px-3 py-2 dark:border-gray-700 dark:bg-gray-800"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Category
                  </label>
                  <select
                    value={form.categoryId}
                    onChange={(e) =>
                      setForm({ ...form, categoryId: e.target.value })
                    }
                    className="w-full rounded-lg border px-3 py-2 dark:border-gray-700 dark:bg-gray-800"
                  >
                    <option value="">Uncategorized</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Cover Image URL
                  </label>
                  <input
                    type="url"
                    value={form.coverImage}
                    onChange={(e) =>
                      setForm({ ...form, coverImage: e.target.value })
                    }
                    placeholder="https://example.com/image.jpg"
                    className="w-full rounded-lg border px-3 py-2 dark:border-gray-700 dark:bg-gray-800"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  className="w-full rounded-lg border px-3 py-2 dark:border-gray-700 dark:bg-gray-800"
                />
              </div>

              <div className="flex flex-wrap gap-5 rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.isFeatured}
                    onChange={(e) =>
                      setForm({ ...form, isFeatured: e.target.checked })
                    }
                  />
                  Featured Gallery
                </label>

                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.isPublished}
                    onChange={(e) =>
                      setForm({ ...form, isPublished: e.target.checked })
                    }
                  />
                  Publish Gallery
                </label>
              </div>

              <div className="border-t pt-5 dark:border-gray-700">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <h3 className="font-semibold dark:text-white">
                      Gallery Photos ({images.length})
                    </h3>
                    <p className="text-xs text-gray-500">
                      Image URL দিয়ে ছবি যোগ করুন
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={addImage}
                    className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white"
                  >
                    + Add Photo
                  </button>
                </div>

                <div className="space-y-4">
                  {images.map((image, index) => (
                    <div
                      key={image.id || index}
                      className="rounded-xl border p-4 dark:border-gray-700"
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <p className="text-sm font-semibold">
                          Photo {index + 1}
                        </p>
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="text-sm font-medium text-red-600"
                        >
                          Remove
                        </button>
                      </div>

                      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                        <input
                          type="url"
                          required
                          placeholder="Image URL *"
                          value={image.url}
                          onChange={(e) =>
                            updateImage(index, "url", e.target.value)
                          }
                          className="rounded-lg border px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 md:col-span-2"
                        />

                        {image.url && (
                          <div className="md:col-span-2">
                            <img
                              src={image.url}
                              alt={image.altText}
                              className="h-32 max-w-full rounded-lg border object-cover"
                            />
                          </div>
                        )}

                        <input
                          placeholder="Photo Title"
                          value={image.title}
                          onChange={(e) =>
                            updateImage(index, "title", e.target.value)
                          }
                          className="rounded-lg border px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
                        />

                        <input
                          placeholder="Alt Text"
                          value={image.altText}
                          onChange={(e) =>
                            updateImage(index, "altText", e.target.value)
                          }
                          className="rounded-lg border px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
                        />

                        <input
                          placeholder="Caption"
                          value={image.caption}
                          onChange={(e) =>
                            updateImage(index, "caption", e.target.value)
                          }
                          className="rounded-lg border px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
                        />

                        <label className="flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            checked={image.isFeatured}
                            onChange={(e) =>
                              updateImage(index, "isFeatured", e.target.checked)
                            }
                          />
                          Featured Photo
                        </label>

                        <textarea
                          rows={2}
                          placeholder="Photo Description"
                          value={image.description}
                          onChange={(e) =>
                            updateImage(index, "description", e.target.value)
                          }
                          className="rounded-lg border px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 md:col-span-2"
                        />
                      </div>
                    </div>
                  ))}

                  {images.length === 0 && (
                    <div className="rounded-lg border border-dashed p-8 text-center text-sm text-gray-500 dark:border-gray-700">
                      এখনো কোনো ছবি যোগ করা হয়নি।
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t pt-4 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => setShowEditor(false)}
                  className="rounded-lg border px-4 py-2 text-sm dark:border-gray-700"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white disabled:opacity-50"
                >
                  {saving
                    ? "Saving..."
                    : editingId
                      ? "Update Gallery"
                      : "Create Gallery"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {preview && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95 p-4"
          onClick={() => setPreview(null)}
        >
          <button
            onClick={() => setPreview(null)}
            className="absolute right-5 top-4 text-4xl text-white"
            aria-label="Close preview"
          >
            ×
          </button>

          <div
            className="flex max-h-full max-w-6xl flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={preview.url}
              alt={preview.altText}
              className="max-h-[82vh] max-w-full rounded-lg object-contain"
            />
            <p className="mt-3 text-center text-sm text-white">
              {preview.title}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
