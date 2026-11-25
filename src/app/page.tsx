
"use client";
import BDDate from "@/components/BDDate";
import { useEffect, useState } from "react";

type NewsItem = {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  content?: string;
  coverImage?: string | null;
  publishedAt?: string | null;
  viewCount?: number;
  category?: { id: string; name: string; slug: string };
  author?: { id?: string; name: string; avatar?: string | null };
};

type CategoryItem = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  _count?: { articles: number };
};

const fallbackColors = [
  "from-red-950 via-red-800 to-orange-600",
  "from-blue-950 via-blue-800 to-cyan-600",
  "from-emerald-950 via-green-800 to-teal-500",
  "from-violet-950 via-purple-800 to-fuchsia-600",
];

function formatNewsTime(value?: string | null) {
  if (!value) return "সর্বশেষ";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "সর্বশেষ";
  return new Intl.DateTimeFormat("bn-BD", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function getNewsColor(index: number) {
  return fallbackColors[index % fallbackColors.length];
}

function getNewsSymbol(category?: string) {
  const symbols: Record<string, string> = {
    জাতীয়: "🇧🇩",
    রাজনীতি: "🏛️",
    আন্তর্জাতিক: "🌍",
    অর্থনীতি: "📈",
    খেলাধুলা: "🏆",
    বিনোদন: "🎬",
    প্রযুক্তি: "💻",
    শিক্ষা: "📚",
    স্বাস্থ্য: "🩺",
  };
  return (category && symbols[category]) || "📰";
}

function ClockIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-4 w-4"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m16 16 4 4" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
    >
      <path d="M20.5 15.5A8.5 8.5 0 0 1 8.5 3.5 8.5 8.5 0 1 0 20.5 15.5Z" />
    </svg>
  );
}

function NewsArt({
  color,
  symbol,
  image,
  large = false,
}: {
  color: string;
  symbol: string;
  image?: string | null;
  large?: boolean;
}) {
  return (
    <div
      className={`news-art relative flex items-center justify-center overflow-hidden bg-gradient-to-br ${color} ${
        large ? "min-h-[300px]" : "h-48"
      }`}
    >
      {image ? (
        <img
          src={image}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : null}
      <div className="absolute -right-8 -top-10 h-48 w-48 rounded-full border border-white/20" />
      <div className="absolute -bottom-16 -left-8 h-48 w-48 rounded-full border border-white/20" />

      {!image && (
        <span className={large ? "text-8xl drop-shadow-lg" : "text-6xl drop-shadow-lg"}>
          {symbol}
        </span>
      )}

      <span className="absolute bottom-3 left-4 rounded-full border border-white/30 bg-black/20 px-3 py-1 text-xs font-medium text-white backdrop-blur">
        দৈনিক দিনলিপি
      </span>
    </div>
  );
}

export default function HomePage() {
  const [dark, setDark] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [featuredNews, setFeaturedNews] = useState<NewsItem[]>([]);
  const [latestNews, setLatestNews] = useState<NewsItem[]>([]);
  const [popularNews, setPopularNews] = useState<NewsItem[]>([]);
  const [breakingNews, setBreakingNews] = useState<NewsItem[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [newsLoading, setNewsLoading] = useState(true);
  const [newsError, setNewsError] = useState("");

  // Load homepage content from database APIs
  useEffect(() => {
    let cancelled = false;

    async function loadHomepageData() {
      try {
        const endpoints = [
          "/api/news/featured",
          "/api/news?limit=9",
          "/api/news/popular",
          "/api/news/breaking",
          "/api/categories",
        ];

        const responses = await Promise.all(
          endpoints.map((endpoint) => fetch(endpoint, { cache: "no-store" }))
        );

        if (responses.some((response) => !response.ok)) {
          throw new Error("সংবাদ লোড করা যায়নি। API route ও database connection পরীক্ষা করুন।");
        }

        const [featuredResult, latestResult, popularResult, breakingResult, categoryResult] =
          await Promise.all(responses.map((response) => response.json()));

        if (cancelled) return;

        setFeaturedNews(featuredResult.data ?? []);
        setLatestNews(latestResult.data ?? []);
        setPopularNews(popularResult.data ?? []);
        setBreakingNews(breakingResult.data ?? []);
        setCategories(categoryResult.data ?? []);
        setNewsError("");
      } catch (error) {
        console.error("Homepage data loading error:", error);
        if (!cancelled) {
          setNewsError(
            error instanceof Error ? error.message : "সংবাদ লোড করতে সমস্যা হয়েছে।"
          );
        }
      } finally {
        if (!cancelled) setNewsLoading(false);
      }
    }

    loadHomepageData();
    return () => {
      cancelled = true;
    };
  }, []);

  // Theme initialization
  useEffect(() => {
    const saved = localStorage.getItem("daily-dinlipi-theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    const useDark = saved ? saved === "dark" : prefersDark;

    setDark(useDark);
    document.documentElement.classList.toggle("dark", useDark);
  }, []);

  // Auto slider
  useEffect(() => {
    if (isPaused || featuredNews.length < 2) return;

    const timer = setInterval(() => {
      setActiveSlide((current) => (current + 1) % featuredNews.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [isPaused, featuredNews.length]);

  useEffect(() => {
    if (activeSlide >= featuredNews.length) setActiveSlide(0);
  }, [activeSlide, featuredNews.length]);

  function toggleTheme() {
    const next = !dark;

    setDark(next);
    document.documentElement.classList.toggle("dark", next);

    localStorage.setItem(
      "daily-dinlipi-theme",
      next ? "dark" : "light"
    );
  }

  function nextSlide() {
    if (!featuredNews.length) return;
    setActiveSlide((current) => (current + 1) % featuredNews.length);
  }

  function prevSlide() {
    if (!featuredNews.length) return;
    setActiveSlide(
      (current) => (current - 1 + featuredNews.length) % featuredNews.length
    );
  }

  const surface = "bg-white dark:bg-[#191e29]";
  const border = "border-gray-200 dark:border-gray-800";
  const muted = "text-gray-500 dark:text-gray-400";
  const heading = "text-gray-900 dark:text-white";

  return (
    <main className="min-h-screen bg-[#f7f8fa] text-gray-900 dark:bg-[#10131b] dark:text-gray-100">
      {/* Top Information Bar */}
      <div className="hidden border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-[#141923] md:block">
        <div className="container-main flex h-10 items-center justify-between text-xs">
          <div className="flex items-center gap-4 text-gray-500 dark:text-gray-400">
            <span><BDDate /></span>
            <span>ঢাকা, বাংলাদেশ</span>
          </div>

          <div className="flex items-center gap-4 text-gray-500 dark:text-gray-400">
            <a href="#about" className="hover:text-red-600">
              আমাদের সম্পর্কে
            </a>
            <a href="#contact" className="hover:text-red-600">
              যোগাযোগ
            </a>
            <a href="/privacy-policy" className="hover:text-red-600">
  গোপনীয়তা
            </a>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className={`sticky top-0 z-50 border-b ${border} ${surface}`}>
        <div className="container-main flex min-h-[82px] items-center justify-between gap-4">
          <a href="/" className="flex shrink-0 items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-600 text-2xl font-black text-white shadow-lg shadow-red-600/20">
              দ
            </div>

            <div>
              <h1 className="text-2xl font-black tracking-tight text-gray-950 dark:text-white sm:text-3xl">
                দৈনিক <span className="text-red-600">দিনলিপি</span>
              </h1>

              <p className={`text-[10px] font-medium tracking-[.15em] ${muted}`}>
                সত্যের সন্ধানে, প্রতিদিন
              </p>
            </div>
          </a>

          <div className="hidden flex-1 justify-center lg:flex">
            <span className={`text-sm ${muted}`}>
              নির্ভরযোগ্য সংবাদ, সবার আগে
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label="Search"
              className={`rounded-xl border p-2.5 ${border} ${heading} hover:bg-gray-100 dark:hover:bg-gray-800`}
            >
              <SearchIcon />
            </button>

            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className={`rounded-xl border p-2.5 ${border} ${heading} hover:bg-gray-100 dark:hover:bg-gray-800`}
            >
              {dark ? <SunIcon /> : <MoonIcon />}
            </button>

            <button
              onClick={() => setMobileMenu(!mobileMenu)}
              className={`rounded-xl border px-3 py-2 text-sm font-semibold lg:hidden ${border}`}
            >
              {mobileMenu ? "বন্ধ" : "মেনু"}
            </button>
          </div>
        </div>

        {/* Search */}
        {searchOpen && (
          <div className={`border-t ${border}`}>
            <div className="container-main flex gap-2 py-3">
              <input
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="আপনার পছন্দের সংবাদ খুঁজুন..."
                className={`min-w-0 flex-1 rounded-xl border ${border} bg-transparent px-4 py-3 text-sm outline-none focus:border-red-500`}
              />

              <button
                onClick={() => alert("Search API পরবর্তী ধাপে যুক্ত করা হবে।")}
                className="rounded-xl bg-red-600 px-5 text-sm font-bold text-white hover:bg-red-700"
              >
                খুঁজুন
              </button>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav
          className={`border-t ${border} ${
            mobileMenu ? "block" : "hidden"
          } lg:block`}
        >
          <div className="container-main flex flex-col gap-1 py-2 lg:flex-row lg:items-center lg:gap-7">
            <a
              href="/"
              onClick={() => setMobileMenu(false)}
              className="rounded-lg px-2 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 dark:hover:bg-red-950/30"
            >
              প্রচ্ছদ
            </a>
            {categories.map((item) => (
              <a
                key={item.id}
                href={`/category/${item.slug}`}
                onClick={() => setMobileMenu(false)}
                className={`rounded-lg px-2 py-2 text-sm font-semibold transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30 ${heading}`}
              >
                {item.name}
              </a>
            ))}
          </div>
        </nav>
      </header>

      {/* Breaking News */}
      <div className="bg-red-600 text-white">
        <div className="container-main flex min-h-11 items-center gap-3">
          <span className="shrink-0 rounded bg-white px-3 py-1 text-xs font-black text-red-600">
            ব্রেকিং নিউজ
          </span>

          <div className="overflow-hidden text-sm font-medium">
            <p className="truncate">
              {breakingNews.length
                ? breakingNews.map((item) => item.title).join("  •  ")
                : newsLoading
                  ? "ব্রেকিং নিউজ লোড হচ্ছে..."
                  : "এই মুহূর্তে কোনো ব্রেকিং নিউজ নেই।"}
            </p>
          </div>

          <span className="ml-auto hidden shrink-0 text-xs text-red-100 sm:block">
            সর্বশেষ আপডেট
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="container-main py-7">
        {newsError && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
            {newsError}
          </div>
        )}
        {/* Section Heading */}
        <div className="mb-5 flex items-end justify-between">
          <div>
            <p className="mb-1 text-xs font-bold uppercase tracking-widest text-red-600">
              Welcome to Daily Dinlipi
            </p>

            <h2 className={`text-2xl font-black sm:text-3xl ${heading}`}>
              আজকের <span className="text-red-600">শীর্ষ সংবাদ</span>
            </h2>
          </div>

          <span className={`hidden text-xs sm:block ${muted}`}>
            সর্বশেষ সংবাদ ও গুরুত্বপূর্ণ আপডেট
          </span>
        </div>

        {/* Featured News Slider + Popular News */}
        <section className="grid gap-5 lg:grid-cols-3">
          {/* Featured Slider */}
          <div
            className={`relative overflow-hidden rounded-2xl border ${border} ${surface} shadow-sm lg:col-span-2`}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {featuredNews.length ? featuredNews.map((news, index) => (
              <div
                key={news.id}
                className={`${
                  index === activeSlide ? "grid" : "hidden"
                } min-h-[350px] md:grid-cols-2`}
              >
                <NewsArt
                  color={getNewsColor(index)}
                  symbol={getNewsSymbol(news.category?.name)}
                  image={news.coverImage}
                  large
                />

                <div className="flex flex-col justify-center p-5 pb-16 sm:p-7 sm:pb-16">
                  <span className="mb-4 w-fit rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-600 dark:bg-red-950/40">
                    {news.category?.name ?? "সংবাদ"} · শীর্ষ সংবাদ
                  </span>

                  <h3 className={`mb-4 text-2xl font-black leading-snug sm:text-3xl ${heading}`}>
                    {news.title}
                  </h3>

                  <p className={`mb-5 text-sm leading-7 ${muted}`}>
                    {news.excerpt || news.content?.slice(0, 180) || "বিস্তারিত সংবাদ পড়তে ক্লিক করুন।"}
                  </p>

                  <div className={`flex flex-wrap items-center gap-2 text-xs ${muted}`}>
                    <ClockIcon />
                    <span>{formatNewsTime(news.publishedAt)}</span>
                    <span>•</span>
                    <span>{news.author?.name ?? "সম্পাদকীয় ডেস্ক"}</span>
                  </div>

                  <a
                    href={`/news/${news.slug}`}
                    className="mt-6 w-fit rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-700"
                  >
                    বিস্তারিত পড়ুন →
                  </a>
                </div>
              </div>
            )) : (
              <div className="flex min-h-[350px] items-center justify-center p-8 text-center">
                <div>
                  <p className={`text-lg font-bold ${heading}`}>
                    {newsLoading ? "শীর্ষ সংবাদ লোড হচ্ছে..." : "এখনো কোনো Featured News প্রকাশিত হয়নি"}
                  </p>
                  <p className={`mt-2 text-sm ${muted}`}>
                    Admin Panel থেকে কোনো সংবাদকে Featured হিসেবে প্রকাশ করুন।
                  </p>
                </div>
              </div>
            )}

            {/* Previous / Next Controls */}
            {featuredNews.length > 1 && (
            <div className="absolute bottom-4 right-4 flex items-center gap-2">
              <button
                onClick={prevSlide}
                aria-label="Previous slide"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-lg font-bold text-gray-900 shadow transition hover:bg-red-600 hover:text-white dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              >
                ←
              </button>

              <button
                onClick={nextSlide}
                aria-label="Next slide"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-lg font-bold text-gray-900 shadow transition hover:bg-red-600 hover:text-white dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              >
                →
              </button>
            </div>
            )}

            {/* Slider Dots */}
            {featuredNews.length > 1 && (
            <div className="absolute bottom-5 left-5 flex items-center gap-2">
              {featuredNews.map((news, index) => (
                <button
                  key={news.id}
                  onClick={() => setActiveSlide(index)}
                  aria-label={`Go to slide ${index + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    activeSlide === index
                      ? "w-8 bg-red-600"
                      : "w-2 bg-gray-300 dark:bg-gray-600"
                  }`}
                />
              ))}
            </div>
            )}
          </div>

          {/* Popular News Sidebar */}
          <aside className={`rounded-2xl border p-5 ${border} ${surface}`}>
            <div className="mb-5 flex items-center justify-between">
              <h3 className={`text-lg font-black ${heading}`}>
                জনপ্রিয় সংবাদ
              </h3>

              <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-bold text-red-600 dark:bg-red-950/40">
                পাঠকপ্রিয়
              </span>
            </div>

            <div className="space-y-4">
              {popularNews.map((item, index) => (
                <a href={`/news/${item.slug}`} key={item.id} className="group flex gap-3">
                  <span className="text-2xl font-black text-gray-200 dark:text-gray-700">
                    0{index + 1}
                  </span>

                  <div>
                    <p className={`text-sm font-bold leading-6 group-hover:text-red-600 ${heading}`}>
                      {item.title}
                    </p>

                    <p className={`mt-1 text-xs ${muted}`}>
                      {(item.viewCount ?? 0).toLocaleString("bn-BD")} ভিউ

                    </p>
                  </div>
                </a>
              ))}
              {!popularNews.length && (
                <p className={`text-sm ${muted}`}>
                  {newsLoading ? "জনপ্রিয় সংবাদ লোড হচ্ছে..." : "এখনো জনপ্রিয় সংবাদ পাওয়া যায়নি।"}
                </p>
              )}
            </div>
          </aside>
        </section>

        {/* Latest News */}
        <section id="latest" className="mt-12">
          <div className="mb-6 flex items-center justify-between border-b-2 border-red-600 pb-3">
            <div>
              <p className="mb-1 text-xs font-bold text-red-600">
                NEWS UPDATE
              </p>

              <h2 className={`text-2xl font-black ${heading}`}>
                সর্বশেষ সংবাদ
              </h2>
            </div>

            <a
              href="#latest"
              className="text-sm font-bold text-red-600 hover:text-red-700"
            >
              সব সংবাদ →
            </a>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {latestNews.map((news, index) => (
              <article
                key={news.id}
                className={`news-card overflow-hidden rounded-2xl border ${border} ${surface}`}
              >
                <NewsArt
                  color={getNewsColor(index)}
                  symbol={getNewsSymbol(news.category?.name)}
                  image={news.coverImage}
                />

                <div className="p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="rounded-md bg-red-50 px-2.5 py-1 text-xs font-bold text-red-600 dark:bg-red-950/40">
                      {news.category?.name ?? "সংবাদ"}
                    </span>

                    <span className={`text-xs ${muted}`}>
                      {(news.viewCount ?? 0).toLocaleString("bn-BD")} ভিউ
                    </span>
                  </div>

                  <h3 className={`mb-4 min-h-[56px] text-lg font-bold leading-7 ${heading}`}>
                    {news.title}
                  </h3>

                  <div className={`flex items-center justify-between border-t pt-3 text-xs ${border} ${muted}`}>
                    <span className="flex items-center gap-1.5">
                      <ClockIcon />
                      {formatNewsTime(news.publishedAt)}
                    </span>

                    <a href={`/news/${news.slug}`} className="font-bold text-red-600">
                      বিস্তারিত →
                    </a>
                  </div>
                </div>
              </article>
            ))}
            {!latestNews.length && (
              <div className={`col-span-full rounded-xl border p-8 text-center ${border} ${surface}`}>
                <p className={`font-semibold ${heading}`}>
                  {newsLoading ? "সর্বশেষ সংবাদ লোড হচ্ছে..." : "এখনো কোনো সংবাদ প্রকাশিত হয়নি"}
                </p>
                <p className={`mt-2 text-sm ${muted}`}>
                  Admin Panel থেকে সংবাদ Published করলে এখানে দেখা যাবে।
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Dynamic Category Sections */}
        <section className="mt-12 grid gap-6 lg:grid-cols-2">
          {categories.slice(0, 4).map((category) => (
            <div
              id={`category-${category.slug}`}
              key={category.id}
              className={`rounded-2xl border p-5 ${border} ${surface}`}
            >
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className={`text-xl font-black ${heading}`}>
                    {category.name}
                  </h3>
                  <p className={`mt-1 text-xs ${muted}`}>
                    {category.description || `${category.name} বিভাগের সর্বশেষ সংবাদ`}
                  </p>
                </div>
                <a href={`/category/${category.slug}`} className="text-sm font-bold text-red-600">
                  আরও →
                </a>
              </div>
              <div className={`rounded-xl bg-gray-50 p-4 dark:bg-gray-800/60`}>
                <p className={`text-sm font-semibold ${heading}`}>
                  মোট {category._count?.articles ?? 0}টি প্রকাশিত সংবাদ
                </p>
                <p className={`mt-2 text-xs ${muted}`}>
                  এই বিভাগের সব সংবাদ দেখতে আরও লিংকে ক্লিক করুন।
                </p>
              </div>
            </div>
          ))}
          {!categories.length && !newsLoading && (
            <div className={`col-span-full rounded-xl border p-6 text-center ${border} ${surface}`}>
              <p className={`text-sm ${muted}`}>কোনো Active Category পাওয়া যায়নি।</p>
            </div>
          )}
        </section>

        {/* Newsletter */}
        <section className="mt-12 overflow-hidden rounded-2xl bg-gradient-to-r from-red-700 to-red-500 p-7 text-white sm:p-10">
          <div className="mx-auto max-w-2xl text-center">
            <p className="mb-2 text-xs font-bold tracking-widest text-red-100">
              STAY UPDATED
            </p>

            <h2 className="text-2xl font-black sm:text-3xl">
              প্রতিদিনের গুরুত্বপূর্ণ সংবাদ থাকুক আপনার হাতের মুঠোয়
            </h2>

            <p className="mt-3 text-sm leading-6 text-red-100">
              দৈনিক দিনলিপির সঙ্গে থাকুন এবং দেশের ও বিশ্বের খবর জানুন।
            </p>

            <div className="mx-auto mt-6 flex max-w-md gap-2">
              <input
                type="email"
                placeholder="আপনার ইমেইল ঠিকানা"
                className="min-w-0 flex-1 rounded-xl border border-white/20 bg-white px-4 py-3 text-sm text-gray-900 outline-none placeholder:text-gray-400"
              />

              <button
                onClick={() => alert("Newsletter subscription পরবর্তী ধাপে যুক্ত হবে।")}
                className="rounded-xl bg-gray-950 px-4 py-3 text-sm font-bold text-white hover:bg-black"
              >
                সাবস্ক্রাইব
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer id="contact" className="mt-12 bg-[#171b25] text-white">
        <div className="container-main grid gap-10 py-12 md:grid-cols-3">
          <div>
            <h2 className="text-2xl font-black">
              দৈনিক <span className="text-red-500">দিনলিপি</span>
            </h2>

            <p className="mt-3 max-w-sm text-sm leading-7 text-gray-400">
              সত্যের সন্ধানে, প্রতিদিন। দেশ ও বিশ্বের নির্ভরযোগ্য সংবাদ পৌঁছে দেওয়াই আমাদের লক্ষ্য।
            </p>
          </div>

          <div>
            <h3 className="mb-4 font-bold">গুরুত্বপূর্ণ লিংক</h3>

            <div className="grid grid-cols-2 gap-3 text-sm text-gray-400">
              <a href="#about" className="hover:text-white">
                আমাদের সম্পর্কে
              </a>
              <a href="#contact" className="hover:text-white">
                যোগাযোগ
              </a>
              <a href="#privacy" className="hover:text-white">
                গোপনীয়তা নীতি
              </a>
              <a href="#latest" className="hover:text-white">
                সর্বশেষ সংবাদ
              </a>
            </div>
          </div>

          <div id="about">
            <h3 className="mb-4 font-bold">দৈনিক দিনলিপি</h3>

            <p className="text-sm leading-7 text-gray-400">
              একটি আধুনিক বাংলা সংবাদমাধ্যম। পাঠকের কাছে সঠিক ও দায়িত্বশীল তথ্য পৌঁছে দেওয়ার প্রত্যয়ে।
            </p>
          </div>
        </div>

        <div className="border-t border-white/10">
          <div className="container-main flex flex-col justify-between gap-2 py-5 text-xs text-gray-400 sm:flex-row">
            <p>© ২০২৬ দৈনিক দিনলিপি। সর্বস্বত্ব সংরক্ষিত।</p>
            <p>Designed with care for Daily Dinlipi</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
