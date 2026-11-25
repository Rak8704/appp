
"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Category = {
  id: string;
  name: string;
  slug: string;
};

type ArticleStatus = "DRAFT" | "PENDING" | "PUBLISHED";

export default function CreateArticlePage() {
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    coverImage: "",
    categoryId: "",
    status: "DRAFT" as ArticleStatus,
    isFeatured: false,
    isBreaking: false,
    isTrending: false,
    seoTitle: "",
    seoDescription: "",
    seoKeywords: "",
  });

  useEffect(() => {
    let active = true;

    async function loadCategories() {
      try {
        const response = await fetch("/api/admin/categories", {
          credentials: "include",
          cache: "no-store",
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "ক্যাটাগরি লোড করা যায়নি");
        }

        if (active) {
          const items = Array.isArray(result)
            ? result
            : result.categories ?? result.data ?? [];

          setCategories(items);
        }
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "ক্যাটাগরি লোড করতে সমস্যা হয়েছে"
          );
        }
      } finally {
        if (active) setLoadingCategories(false);
      }
    }

    loadCategories();

    return () => {
      active = false;
    };
  }, []);

  function updateField(
    field: keyof typeof form,
    value: string | boolean
  ) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  function generateSlug(value: string) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^\p{L}\p{N}]+/gu, "-")
      .replace(/^-+|-+$/g, "");
  }

  function handleTitleChange(value: string) {
    setForm((previous) => ({
      ...previous,
      title: value,
      slug: previous.slug === "" ? generateSlug(value) : previous.slug,
    }));
  }

async function handleSubmit(event: FormEvent<HTMLFormElement>) {
  event.preventDefault();

  setError("");
  setSuccess("");

  if (form.title.trim().length < 5) {
    setError("শিরোনাম কমপক্ষে ৫ অক্ষরের হতে হবে");
    return;
  }

  if (form.slug.trim().length < 3) {
    setError("Slug কমপক্ষে ৩ অক্ষরের হতে হবে");
    return;
  }

  if (form.content.trim().length < 10) {
    setError("সংবাদের কনটেন্ট কমপক্ষে ১০ অক্ষরের হতে হবে");
    return;
  }

  if (!form.categoryId) {
    setError("একটি ক্যাটাগরি নির্বাচন করুন");
    return;
  }
if (form.slug.trim().length > 300) {
  setError("Slug সর্বোচ্চ ৩০০ অক্ষরের হতে পারবে");
  return;
}

if (form.coverImage.trim().length > 1000) {
  setError("Cover Image URL সর্বোচ্চ ১০০০ অক্ষরের হতে পারবে। Base64 image ব্যবহার কোরো না।");
  return;
}
  setSaving(true);

  try {
    const payload = {
      title: form.title.trim(),
      slug: form.slug.trim() || generateSlug(form.title),
      excerpt: form.excerpt.trim() || null,
      content: form.content.trim(),
      coverImage: form.coverImage.trim() || null,
      categoryId: form.categoryId,
      status: form.status,
      isFeatured: form.isFeatured,
      isBreaking: form.isBreaking,
      isTrending: form.isTrending,
      seoTitle: form.seoTitle.trim() || null,
      seoDescription: form.seoDescription.trim() || null,
      seoKeywords: form.seoKeywords.trim() || null,
    };

    console.log("ARTICLE CREATE PAYLOAD:", payload);

    const response = await fetch("/api/admin/articles", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    console.log("ARTICLE CREATE RESPONSE:", {
      status: response.status,
      result,
    });

    if (!response.ok) {
      const validationErrors = result.errors
        ? JSON.stringify(result.errors, null, 2)
        : "";

      throw new Error(
        `${result.message || result.error || "Article তৈরি করা যায়নি"}${
          validationErrors ? "\n" + validationErrors : ""
        }`
      );
    }

    setSuccess("আর্টিকেল সফলভাবে তৈরি হয়েছে");

    router.push("/admin/articles");
    router.refresh();
  } catch (err) {
    const message =
      err instanceof Error
        ? err.message
        : "আর্টিকেল তৈরি করতে সমস্যা হয়েছে";

    console.error("ARTICLE CREATE ERROR:", err);
    setError(message);
  } finally {
    setSaving(false);
  }
}

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              নতুন আর্টিকেল তৈরি
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              দৈনিক দিনলিপির জন্য নতুন সংবাদ প্রকাশ করুন।
            </p>
          </div>

          <Link
            href="/admin/articles"
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            ← আর্টিকেল তালিকায় ফিরে যান
          </Link>
        </div>

        {error && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-5 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
            <h2 className="mb-5 text-lg font-semibold text-slate-900">
              মূল সংবাদ তথ্য
            </h2>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  সংবাদ শিরোনাম *
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  required
                  placeholder="সংবাদের শিরোনাম লিখুন"
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  URL Slug *
                </label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => updateField("slug", e.target.value)}
                  required
                  placeholder="news-article-title"
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
                <p className="mt-1 text-xs text-slate-500">
                  URL-এ ব্যবহারের জন্য ইউনিক স্লাগ দিন।
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  সংক্ষিপ্ত বিবরণ
                </label>
                <textarea
                  value={form.excerpt}
                  onChange={(e) => updateField("excerpt", e.target.value)}
                  rows={3}
                  placeholder="সংবাদের সংক্ষিপ্ত বিবরণ লিখুন..."
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  সম্পূর্ণ সংবাদ *
                </label>
                <textarea
                  value={form.content}
                  onChange={(e) => updateField("content", e.target.value)}
                  rows={14}
                  required
                  placeholder="এখানে সম্পূর্ণ সংবাদ লিখুন..."
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm leading-7 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
                <p className="mt-1 text-xs text-slate-500">
                  এই ফিল্ডে সাধারণ টেক্সট পাঠানো হবে। Rich text editor এখনো যুক্ত করা হয়নি।
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
            <h2 className="mb-5 text-lg font-semibold text-slate-900">
              ক্যাটাগরি ও কভার ইমেজ
            </h2>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  ক্যাটাগরি *
                </label>
                <select
                  value={form.categoryId}
                  onChange={(e) => updateField("categoryId", e.target.value)}
                  required
                  disabled={loadingCategories}
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
                >
                  <option value="">
                    {loadingCategories
                      ? "ক্যাটাগরি লোড হচ্ছে..."
                      : "ক্যাটাগরি নির্বাচন করুন"}
                  </option>

                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>

                {!loadingCategories && categories.length === 0 && (
                  <p className="mt-1 text-xs text-red-600">
                    আগে একটি ক্যাটাগরি তৈরি করুন।
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  কভার ইমেজ URL
                </label>
                <input
                  type="url"
                  value={form.coverImage}
                  onChange={(e) => updateField("coverImage", e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {form.coverImage && (
              <div className="mt-4">
                <p className="mb-2 text-sm font-medium text-slate-700">
                  ইমেজ প্রিভিউ
                </p>
                <img
                  src={form.coverImage}
                  alt="Cover preview"
                  className="max-h-64 w-full rounded-lg border border-slate-200 object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
            )}
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
            <h2 className="mb-5 text-lg font-semibold text-slate-900">
              প্রকাশনা সেটিংস
            </h2>

            <div className="mb-5">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                আর্টিকেল স্ট্যাটাস
              </label>
              <select
                value={form.status}
                onChange={(e) =>
                  updateField("status", e.target.value as ArticleStatus)
                }
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 md:max-w-sm"
              >
                <option value="DRAFT">Draft — খসড়া</option>
                <option value="PENDING">Pending — অনুমোদনের অপেক্ষায়</option>
                <option value="PUBLISHED">Published — প্রকাশিত</option>
              </select>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 p-4">
                <input
                  type="checkbox"
                  checked={form.isFeatured}
                  onChange={(e) =>
                    updateField("isFeatured", e.target.checked)
                  }
                  className="h-4 w-4"
                />
                <span className="text-sm font-medium text-slate-700">
                  Featured News
                </span>
              </label>

              <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 p-4">
                <input
                  type="checkbox"
                  checked={form.isBreaking}
                  onChange={(e) =>
                    updateField("isBreaking", e.target.checked)
                  }
                  className="h-4 w-4"
                />
                <span className="text-sm font-medium text-slate-700">
                  Breaking News
                </span>
              </label>

              <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 p-4">
                <input
                  type="checkbox"
                  checked={form.isTrending}
                  onChange={(e) =>
                    updateField("isTrending", e.target.checked)
                  }
                  className="h-4 w-4"
                />
                <span className="text-sm font-medium text-slate-700">
                  Trending News
                </span>
              </label>
            </div>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
            <h2 className="mb-5 text-lg font-semibold text-slate-900">
              SEO সেটিংস
            </h2>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  SEO Title
                </label>
                <input
                  type="text"
                  value={form.seoTitle}
                  onChange={(e) => updateField("seoTitle", e.target.value)}
                  maxLength={255}
                  placeholder="SEO title লিখুন"
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  SEO Description
                </label>
                <textarea
                  value={form.seoDescription}
                  onChange={(e) =>
                    updateField("seoDescription", e.target.value)
                  }
                  rows={3}
                  maxLength={500}
                  placeholder="SEO description লিখুন"
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  SEO Keywords
                </label>
                <input
                  type="text"
                  value={form.seoKeywords}
                  onChange={(e) => updateField("seoKeywords", e.target.value)}
                  placeholder="news, bangladesh, politics"
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </section>

          <div className="flex flex-wrap justify-end gap-3">
            <Link
              href="/admin/articles"
              className="rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              বাতিল
            </Link>

            <button
              type="submit"
              disabled={saving || loadingCategories || categories.length === 0}
              className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? "সংরক্ষণ হচ্ছে..." : "আর্টিকেল তৈরি করুন"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
