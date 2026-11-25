
"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type VideoItem = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  videoUrl: string;
  thumbnail: string | null;
  duration: number | null;
  isPublished: boolean;
  publishedAt: string | null;
  articleId: string | null;
  createdAt: string;
  uploadedBy?: {
    id: string;
    name: string;
  };
};

type VideoForm = {
  title: string;
  slug: string;
  description: string;
  videoUrl: string;
  thumbnail: string;
  articleId: string;
  isPublished: boolean;
  publishedAt: string;
  duration: string;
};

const emptyForm: VideoForm = {
  title: "",
  slug: "",
  description: "",
  videoUrl: "",
  thumbnail: "",
  articleId: "",
  isPublished: false,
  publishedAt: "",
  duration: "",
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function getFullUrl(url: string) {
  if (!url) return "";
  return new URL(url, window.location.origin).toString();
}

export default function AdminVideosPage() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [form, setForm] = useState<VideoForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");

  const videoInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  const loadVideos = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/admin/videos?page=1&limit=100", {
        credentials: "include",
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "ভিডিও লোড করা যায়নি");
      }

      setVideos(result.data || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "ভিডিও লোড করা যায়নি"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadVideos();
  }, [loadVideos]);

  function updateField<K extends keyof VideoForm>(
    key: K,
    value: VideoForm[K]
  ) {
    setForm((previous) => ({
      ...previous,
      [key]: value,
    }));
  }

  async function uploadFile(file: File, type: "video" | "image") {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/admin/media/upload", {
      method: "POST",
      body: formData,
      credentials: "include",
    });

    const result = await response.json();

    if (!response.ok || !result.success || !result.data?.fileUrl) {
      throw new Error(result.message || "ফাইল আপলোড ব্যর্থ হয়েছে");
    }

    return getFullUrl(result.data.fileUrl);
  }

  async function handleVideoUpload(file?: File) {
    if (!file) return;

    try {
      setUploadingVideo(true);
      setError("");
      setSuccess("");

      const videoUrl = await uploadFile(file, "video");

      updateField("videoUrl", videoUrl);
      setSuccess("ভিডিও সফলভাবে আপলোড হয়েছে");

    } catch (err) {
      setError(
        err instanceof Error ? err.message : "ভিডিও আপলোড করা যায়নি"
      );
    } finally {
      setUploadingVideo(false);

      if (videoInputRef.current) {
        videoInputRef.current.value = "";
      }
    }
  }

  async function handleThumbnailUpload(file?: File) {
    if (!file) return;

    try {
      setUploadingThumbnail(true);
      setError("");
      setSuccess("");

      const thumbnail = await uploadFile(file, "image");

      updateField("thumbnail", thumbnail);
      setSuccess("Thumbnail সফলভাবে আপলোড হয়েছে");

    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Thumbnail আপলোড করা যায়নি"
      );
    } finally {
      setUploadingThumbnail(false);

      if (thumbnailInputRef.current) {
        thumbnailInputRef.current.value = "";
      }
    }
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
    setError("");
    setSuccess("");
  }

  function editVideo(video: VideoItem) {
    setEditingId(video.id);

    setForm({
      title: video.title,
      slug: video.slug,
      description: video.description || "",
      videoUrl: video.videoUrl,
      thumbnail: video.thumbnail || "",
      articleId: video.articleId || "",
      isPublished: video.isPublished,
      publishedAt: video.publishedAt
        ? new Date(video.publishedAt).toISOString().slice(0, 16)
        : "",
      duration: video.duration?.toString() || "",
    });

    setError("");
    setSuccess("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!form.title.trim() || !form.slug.trim() || !form.videoUrl.trim()) {
      setError("Title, Slug এবং Video URL অবশ্যই দিতে হবে");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        title: form.title.trim(),
        slug: form.slug.trim(),
        description: form.description.trim() || null,
        videoUrl: form.videoUrl.trim(),
        thumbnail: form.thumbnail.trim() || null,
        articleId: form.articleId.trim() || null,
        isPublished: form.isPublished,
        publishedAt: form.isPublished
          ? form.publishedAt || new Date().toISOString()
          : null,
        duration: form.duration.trim()
          ? Number(form.duration)
          : null,
      };

      if (
        payload.duration !== null &&
        (!Number.isInteger(payload.duration) || payload.duration < 0)
      ) {
        throw new Error("Duration সঠিকভাবে দিতে হবে");
      }

      const endpoint = editingId
        ? `/api/admin/videos/${editingId}`
        : "/api/admin/videos";

      const response = await fetch(endpoint, {
        method: editingId ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "ভিডিও সংরক্ষণ করা যায়নি");
      }

      setSuccess(
        editingId
          ? "ভিডিও সফলভাবে আপডেট হয়েছে"
          : "নতুন ভিডিও সফলভাবে তৈরি হয়েছে"
      );

      resetForm();
      await loadVideos();

    } catch (err) {
      setError(
        err instanceof Error ? err.message : "ভিডিও সংরক্ষণ করা যায়নি"
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteVideo(id: string) {
    const confirmed = window.confirm(
      "আপনি কি নিশ্চিত এই ভিডিওটি Delete করতে চান?"
    );

    if (!confirmed) return;

    try {
      setError("");
      setSuccess("");

      const response = await fetch(`/api/admin/videos/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "ভিডিও Delete করা যায়নি");
      }

      setSuccess("ভিডিও Delete হয়েছে");

      if (editingId === id) {
        resetForm();
      }

      await loadVideos();

    } catch (err) {
      setError(
        err instanceof Error ? err.message : "ভিডিও Delete করা যায়নি"
      );
    }
  }

  const filteredVideos = videos.filter((video) => {
    const keyword = search.toLowerCase();

    return (
      video.title.toLowerCase().includes(keyword) ||
      video.slug.toLowerCase().includes(keyword)
    );
  });

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Video Management
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            ভিডিও আপলোড, সম্পাদনা এবং প্রকাশ নিয়ন্ত্রণ করুন।
          </p>
        </div>

        <button
          type="button"
          onClick={loadVideos}
          className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          Refresh Videos
        </button>
      </div>

      {/* Messages */}
      {error && (
        <div className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-lg border border-green-300 bg-green-50 p-3 text-sm text-green-700">
          {success}
        </div>
      )}

      {/* Form */}
      <section className="rounded-xl border bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <div className="mb-5 flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">
            {editingId ? "Edit Video" : "Add New Video"}
          </h2>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-lg border px-3 py-2 text-sm"
            >
              Cancel Edit
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title and Slug */}
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Video Title *
              </label>

              <input
                value={form.title}
                onChange={(e) => {
                  const title = e.target.value;

                  setForm((previous) => ({
                    ...previous,
                    title,
                    slug: editingId
                      ? previous.slug
                      : slugify(title),
                  }));
                }}
                required
                maxLength={250}
                placeholder="ভিডিওর Title"
                className="w-full rounded-lg border px-3 py-2.5 outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Slug *
              </label>

              <input
                value={form.slug}
                onChange={(e) =>
                  updateField("slug", slugify(e.target.value))
                }
                required
                maxLength={250}
                placeholder="video-title"
                className="w-full rounded-lg border px-3 py-2.5 outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Description
            </label>

            <textarea
              value={form.description}
              onChange={(e) =>
                updateField("description", e.target.value)
              }
              maxLength={5000}
              rows={4}
              placeholder="ভিডিওর বিস্তারিত..."
              className="w-full rounded-lg border px-3 py-2.5 outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800"
            />
          </div>

          {/* Video Upload */}
          <div className="rounded-lg border border-dashed p-4 dark:border-gray-700">
            <label className="mb-3 block font-medium">
              Upload Video
            </label>

            <input
              ref={videoInputRef}
              type="file"
              accept="video/mp4,video/webm,video/quicktime"
              onChange={(e) =>
                handleVideoUpload(e.target.files?.[0])
              }
              disabled={uploadingVideo}
              className="block w-full text-sm"
            />

            <p className="mt-2 text-xs text-gray-500">
              MP4, WebM, MOV | সর্বোচ্চ ২০০ MB
            </p>

            {uploadingVideo && (
              <p className="mt-3 text-sm text-blue-600">
                ভিডিও আপলোড হচ্ছে, অপেক্ষা করুন...
              </p>
            )}

            {form.videoUrl && (
              <div className="mt-4 space-y-2">
                <video
                  src={form.videoUrl}
                  controls
                  preload="metadata"
                  className="max-h-64 w-full rounded-lg bg-black"
                />

                <button
                  type="button"
                  onClick={() => updateField("videoUrl", "")}
                  className="text-sm text-red-600"
                >
                  Remove Video
                </button>
              </div>
            )}

            <div className="mt-4">
              <label className="mb-2 block text-sm font-medium">
                অথবা Video URL
              </label>

              <input
                type="url"
                value={form.videoUrl}
                onChange={(e) =>
                  updateField("videoUrl", e.target.value)
                }
                placeholder="https://example.com/video.mp4"
                className="w-full rounded-lg border px-3 py-2.5 dark:border-gray-700 dark:bg-gray-800"
              />
            </div>
          </div>

          {/* Thumbnail */}
          <div className="rounded-lg border border-dashed p-4 dark:border-gray-700">
            <label className="mb-3 block font-medium">
              Thumbnail Upload
            </label>

            <input
              ref={thumbnailInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) =>
                handleThumbnailUpload(e.target.files?.[0])
              }
              disabled={uploadingThumbnail}
              className="block w-full text-sm"
            />

            <p className="mt-2 text-xs text-gray-500">
              JPG, PNG, WebP | সর্বোচ্চ ১০ MB
            </p>

            {uploadingThumbnail && (
              <p className="mt-2 text-sm text-blue-600">
                Thumbnail আপলোড হচ্ছে...
              </p>
            )}

            {form.thumbnail && (
              <div className="mt-4 space-y-2">
                <img
                  src={form.thumbnail}
                  alt="Video thumbnail preview"
                  className="max-h-52 rounded-lg object-cover"
                />

                <button
                  type="button"
                  onClick={() => updateField("thumbnail", "")}
                  className="block text-sm text-red-600"
                >
                  Remove Thumbnail
                </button>
              </div>
            )}

            <div className="mt-4">
              <label className="mb-2 block text-sm font-medium">
                অথবা Thumbnail URL
              </label>

              <input
                type="url"
                value={form.thumbnail}
                onChange={(e) =>
                  updateField("thumbnail", e.target.value)
                }
                placeholder="https://example.com/thumbnail.jpg"
                className="w-full rounded-lg border px-3 py-2.5 dark:border-gray-700 dark:bg-gray-800"
              />
            </div>
          </div>

          {/* Other fields */}
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Related Article ID
              </label>

              <input
                value={form.articleId}
                onChange={(e) =>
                  updateField("articleId", e.target.value)
                }
                placeholder="Article ID (optional)"
                className="w-full rounded-lg border px-3 py-2.5 dark:border-gray-700 dark:bg-gray-800"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Duration (Seconds)
              </label>

              <input
                type="number"
                min="0"
                step="1"
                value={form.duration}
                onChange={(e) =>
                  updateField("duration", e.target.value)
                }
                placeholder="120"
                className="w-full rounded-lg border px-3 py-2.5 dark:border-gray-700 dark:bg-gray-800"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Publish Date
            </label>

            <input
              type="datetime-local"
              value={form.publishedAt}
              onChange={(e) =>
                updateField("publishedAt", e.target.value)
              }
              className="w-full rounded-lg border px-3 py-2.5 dark:border-gray-700 dark:bg-gray-800"
            />
          </div>

          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={form.isPublished}
              onChange={(e) =>
                updateField("isPublished", e.target.checked)
              }
              className="h-4 w-4"
            />

            <span className="text-sm font-medium">
              Publish this video
            </span>
          </label>

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={
                saving ||
                uploadingVideo ||
                uploadingThumbnail
              }
              className="rounded-lg bg-blue-600 px-6 py-2.5 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : editingId
                  ? "Update Video"
                  : "Create Video"}
            </button>

            <button
              type="button"
              onClick={resetForm}
              className="rounded-lg border px-6 py-2.5 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
            >
              Reset
            </button>
          </div>
        </form>
      </section>

      {/* Video List */}
      <section className="rounded-xl border bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-lg font-semibold">
              All Videos
            </h2>

            <p className="text-sm text-gray-500">
              Total: {videos.length} videos
            </p>
          </div>

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search videos..."
            className="w-full rounded-lg border px-3 py-2 sm:max-w-xs dark:border-gray-700 dark:bg-gray-800"
          />
        </div>

        {loading ? (
          <div className="py-12 text-center text-gray-500">
            Loading videos...
          </div>
        ) : filteredVideos.length === 0 ? (
          <div className="py-12 text-center text-gray-500">
            কোনো ভিডিও পাওয়া যায়নি।
          </div>
        ) : (
          <div className="space-y-4">
            {filteredVideos.map((video) => (
              <div
                key={video.id}
                className="flex flex-col gap-4 rounded-lg border p-4 dark:border-gray-700 md:flex-row"
              >
                <div className="w-full shrink-0 md:w-52">
                  {video.thumbnail ? (
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="h-32 w-full rounded-lg bg-gray-100 object-cover"
                    />
                  ) : (
                    <div className="flex h-32 items-center justify-center rounded-lg bg-gray-100 text-gray-500 dark:bg-gray-800">
                      No Thumbnail
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="break-words font-semibold">
                    {video.title}
                  </h3>

                  <p className="mt-1 break-all text-sm text-gray-500">
                    /{video.slug}
                  </p>

                  <p className="mt-2 text-sm text-gray-500">
                    {video.uploadedBy?.name || "Unknown"} ·{" "}
                    {video.createdAt
                      ? new Date(video.createdAt).toLocaleDateString()
                      : ""}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs ${
                        video.isPublished
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {video.isPublished ? "Published" : "Draft"}
                    </span>

                    {video.duration !== null && (
                      <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700">
                        {video.duration}s
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex shrink-0 gap-2 md:flex-col">
                  <button
                    type="button"
                    onClick={() => editVideo(video)}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => deleteVideo(video.id)}
                    className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
