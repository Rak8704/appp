
"use client";

import { useEffect, useState } from "react";

type SEOSetting = {
  key: string;
  value: string;
  updatedAt?: string | null;
};

type SEOForm = {
  seo_title: string;
  seo_description: string;
  seo_keywords: string;
  seo_og_image: string;
  seo_twitter_handle: string;
  seo_canonical_url: string;
  seo_robots: string;
};

const initialForm: SEOForm = {
  seo_title: "",
  seo_description: "",
  seo_keywords: "",
  seo_og_image: "",
  seo_twitter_handle: "",
  seo_canonical_url: "",
  seo_robots: "index, follow",
};

const inputClass =
  "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-500/10 dark:border-gray-700 dark:bg-[#11151e] dark:text-gray-100";

const labelClass =
  "mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300";

export default function SEOSettingsPage() {
  const [form, setForm] = useState<SEOForm>(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState("");

  useEffect(() => {
    void loadSettings();
  }, []);

  async function loadSettings() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/seo", {
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "SEO settings load করা যায়নি");
      }

      const nextForm = { ...initialForm };

      (result.data as SEOSetting[] | undefined)?.forEach((item) => {
        if (item.key in nextForm) {
          nextForm[item.key as keyof SEOForm] = item.value || "";
          if (item.updatedAt) {
            setLastUpdated(
              new Date(item.updatedAt).toLocaleString("en-BD")
            );
          }
        }
      });

      setForm(nextForm);
    } catch (err) {
      setError(err instanceof Error ? err.message : "একটি সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  }

  function updateField(field: keyof SEOForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setNotice("");
    setError("");

    const settings = Object.entries(form).map(([key, value]) => ({
      key,
      value,
    }));

    try {
      const response = await fetch("/api/admin/seo", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "SEO settings save করা যায়নি");
      }

      setNotice("SEO settings সফলভাবে সংরক্ষণ হয়েছে");
      setLastUpdated(new Date().toLocaleString("en-BD"));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  const titleLength = form.seo_title.length;
  const descriptionLength = form.seo_description.length;

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-gray-50 text-gray-500 dark:bg-[#11151e]">
        SEO settings loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen space-y-6 bg-gray-50 p-4 text-gray-900 dark:bg-[#11151e] dark:text-gray-100 sm:p-6 lg:p-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-medium text-red-600">ADMIN / SEO</p>
          <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
            SEO Settings
          </h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Search engine ও social media-তে website-এর তথ্য নিয়ন্ত্রণ করুন।
          </p>
        </div>

        <button
          type="button"
          onClick={() => void loadSettings()}
          className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold hover:bg-gray-50 dark:border-gray-700 dark:bg-[#191e29] dark:hover:bg-gray-800"
        >
          ↻ Reload Settings
        </button>
      </div>

      {notice && <Notice type="success" text={notice} />}
      {error && <Notice type="error" text={error} />}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <form onSubmit={handleSubmit} className="space-y-6">
          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-[#191e29] sm:p-6">
            <div className="mb-6">
              <h2 className="text-lg font-bold">General SEO</h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Website-এর মূল SEO title ও description সেট করুন।
              </p>
            </div>

            <div className="space-y-5">
              <div>
                <div className="mb-2 flex items-center justify-between gap-2">
                  <label htmlFor="seo_title" className={labelClass}>
                    SEO Title
                  </label>
                  <span
                    className={`text-xs ${
                      titleLength > 60 ? "text-red-600" : "text-gray-400"
                    }`}
                  >
                    {titleLength}/60
                  </span>
                </div>
                <input
                  id="seo_title"
                  value={form.seo_title}
                  onChange={(event) =>
                    updateField("seo_title", event.target.value)
                  }
                  maxLength={300}
                  placeholder="দৈনিক দিনলিপি | সর্বশেষ বাংলা সংবাদ"
                  className={inputClass}
                />
                <p className="mt-2 text-xs text-gray-500">
                  Search result-এর জন্য সংক্ষিপ্ত ও প্রাসঙ্গিক title লিখুন।
                </p>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between gap-2">
                  <label htmlFor="seo_description" className={labelClass}>
                    Meta Description
                  </label>
                  <span
                    className={`text-xs ${
                      descriptionLength > 160
                        ? "text-red-600"
                        : "text-gray-400"
                    }`}
                  >
                    {descriptionLength}/160
                  </span>
                </div>
                <textarea
                  id="seo_description"
                  value={form.seo_description}
                  onChange={(event) =>
                    updateField("seo_description", event.target.value)
                  }
                  rows={4}
                  maxLength={1000}
                  placeholder="দৈনিক দিনলিপিতে পড়ুন দেশের ও বিশ্বের সর্বশেষ সংবাদ..."
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="seo_keywords" className={labelClass}>
                  SEO Keywords
                </label>
                <textarea
                  id="seo_keywords"
                  value={form.seo_keywords}
                  onChange={(event) =>
                    updateField("seo_keywords", event.target.value)
                  }
                  rows={3}
                  maxLength={2000}
                  placeholder="বাংলা সংবাদ, বাংলাদেশ সংবাদ, সর্বশেষ খবর"
                  className={inputClass}
                />
                <p className="mt-2 text-xs text-gray-500">
                  কমা দিয়ে আলাদা করে keyword লিখুন।
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-[#191e29] sm:p-6">
            <div className="mb-6">
              <h2 className="text-lg font-bold">Social Media SEO</h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Facebook ও অন্যান্য social platform-এ link share করলে যে
                তথ্য দেখাবে।
              </p>
            </div>

            <div className="space-y-5">
              <div>
                <label htmlFor="seo_og_image" className={labelClass}>
                  Open Graph Image URL
                </label>
                <input
                  id="seo_og_image"
                  type="url"
                  value={form.seo_og_image}
                  onChange={(event) =>
                    updateField("seo_og_image", event.target.value)
                  }
                  placeholder="https://example.com/images/og-image.jpg"
                  className={inputClass}
                />
                {form.seo_og_image && (
                  <div className="mt-3 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={form.seo_og_image}
                      alt="Open Graph preview"
                      className="max-h-52 w-full object-cover"
                      onError={(event) => {
                        event.currentTarget.style.display = "none";
                      }}
                    />
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="seo_twitter_handle" className={labelClass}>
                  Twitter / X Handle
                </label>
                <input
                  id="seo_twitter_handle"
                  value={form.seo_twitter_handle}
                  onChange={(event) =>
                    updateField("seo_twitter_handle", event.target.value)
                  }
                  placeholder="@dailydinlipi"
                  maxLength={100}
                  className={inputClass}
                />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-[#191e29] sm:p-6">
            <div className="mb-6">
              <h2 className="text-lg font-bold">Technical SEO</h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Canonical URL এবং search engine indexing নির্দেশনা।
              </p>
            </div>

            <div className="space-y-5">
              <div>
                <label htmlFor="seo_canonical_url" className={labelClass}>
                  Canonical URL
                </label>
                <input
                  id="seo_canonical_url"
                  type="url"
                  value={form.seo_canonical_url}
                  onChange={(event) =>
                    updateField("seo_canonical_url", event.target.value)
                  }
                  placeholder="https://example.com"
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="seo_robots" className={labelClass}>
                  Robots Directive
                </label>
                <select
                  id="seo_robots"
                  value={form.seo_robots}
                  onChange={(event) =>
                    updateField("seo_robots", event.target.value)
                  }
                  className={inputClass}
                >
                  <option value="index, follow">Index, Follow</option>
                  <option value="noindex, follow">Noindex, Follow</option>
                  <option value="index, nofollow">Index, Nofollow</option>
                  <option value="noindex, nofollow">Noindex, Nofollow</option>
                </select>
                <p className="mt-2 text-xs text-gray-500">
                  এটি শুধু settings-এ সংরক্ষণ হচ্ছে; website-এর metadata বা
                  robots output-এ প্রয়োগ করতে আলাদা integration লাগবে।
                </p>
              </div>
            </div>
          </section>

          <div className="flex flex-col justify-between gap-3 rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-[#191e29] sm:flex-row sm:items-center sm:px-6">
            <p className="text-xs text-gray-500">
              {lastUpdated ? `Last saved: ${lastUpdated}` : "এখনো save করা হয়নি"}
            </p>
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-red-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save SEO Settings"}
            </button>
          </div>
        </form>

        <aside className="space-y-5">
          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-[#191e29]">
            <h2 className="font-bold">Google Search Preview</h2>
            <div className="mt-4 rounded-xl border border-gray-100 p-4 dark:border-gray-700">
              <p className="text-xs text-gray-500">dailydinlipi.com</p>
              <p className="mt-1 line-clamp-2 text-lg text-blue-700 dark:text-blue-400">
                {form.seo_title || "আপনার SEO Title এখানে দেখা যাবে"}
              </p>
              <p className="mt-2 line-clamp-3 text-sm leading-6 text-gray-600 dark:text-gray-400">
                {form.seo_description ||
                  "আপনার Meta Description এখানে দেখা যাবে।"}
              </p>
            </div>
            <p className="mt-3 text-xs text-gray-500">
              এটি একটি আনুমানিক preview; Google নিজস্বভাবে search snippet
              পরিবর্তন করতে পারে।
            </p>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-[#191e29]">
            <h2 className="font-bold">SEO Checklist</h2>
            <div className="mt-4 space-y-3 text-sm">
              <ChecklistItem
                label="SEO Title লেখা হয়েছে"
                done={!!form.seo_title.trim()}
              />
              <ChecklistItem
                label="Meta Description লেখা হয়েছে"
                done={!!form.seo_description.trim()}
              />
              <ChecklistItem
                label="Keywords যোগ করা হয়েছে"
                done={!!form.seo_keywords.trim()}
              />
              <ChecklistItem
                label="Open Graph Image দেওয়া হয়েছে"
                done={!!form.seo_og_image.trim()}
              />
              <ChecklistItem
                label="Canonical URL দেওয়া হয়েছে"
                done={!!form.seo_canonical_url.trim()}
              />
            </div>
          </section>

          <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-900/60 dark:bg-amber-950/20">
            <h2 className="font-bold text-amber-800 dark:text-amber-300">
              গুরুত্বপূর্ণ
            </h2>
            <p className="mt-2 text-sm leading-6 text-amber-800 dark:text-amber-200">
              এই page SEO settings database-এ save করে। Public website-এ
              settings কার্যকর করতে root layout, metadata এবং robots
              configuration-এ এগুলো যুক্ত করতে হবে।
            </p>
          </section>
        </aside>
      </div>
    </div>
  );
}

function ChecklistItem({
  label,
  done,
}: {
  label: string;
  done: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <span
        className={`flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold ${
          done
            ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300"
            : "bg-gray-100 text-gray-400 dark:bg-gray-800"
        }`}
      >
        {done ? "✓" : "–"}
      </span>
      <span className={done ? "" : "text-gray-500"}>{label}</span>
    </div>
  );
}

function Notice({ type, text }: { type: "success" | "error"; text: string }) {
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
