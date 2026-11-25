
import Link from "next/link";
import { Suspense } from "react";
import { connection } from "next/server";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "ব্রেকিং নিউজ | দৈনিক দিনলিপি",
  description: "সর্বশেষ ব্রেকিং নিউজ পড়ুন দৈনিক দিনলিপিতে।",
};

const PAGE_SIZE = 12;

type PageProps = {
  searchParams: Promise<{
    page?: string;
  }>;
};

function formatDate(date: Date | null) {
  if (!date) return "তারিখ পাওয়া যায়নি";

  return new Intl.DateTimeFormat("bn-BD", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(date);
}

// Loading UI
function BreakingNewsLoading() {
  return (
    <main className="min-h-screen bg-gray-50 py-12 dark:bg-gray-950">
      <div className="container-main mx-auto px-4">
        <div className="animate-pulse">
          <div className="mb-4 h-8 w-48 rounded bg-gray-200 dark:bg-gray-800" />
          <div className="mb-8 h-5 w-72 rounded bg-gray-200 dark:bg-gray-800" />

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-xl bg-white dark:bg-gray-900"
              >
                <div className="aspect-video bg-gray-200 dark:bg-gray-800" />
                <div className="space-y-3 p-5">
                  <div className="h-4 w-24 rounded bg-gray-200 dark:bg-gray-800" />
                  <div className="h-5 w-full rounded bg-gray-200 dark:bg-gray-800" />
                  <div className="h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-800" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

// Main page content
async function BreakingNewsContent({
  searchParams,
}: PageProps) {
  // Dynamic rendering must happen inside Suspense
  await connection();

  const params = await searchParams;

  const currentPage = Math.max(
    1,
    Number(params.page) || 1
  );

  const now = new Date();

  const where = {
    status: "PUBLISHED" as const,
    isBreaking: true,
    publishedAt: {
      lte: now,
    },
  };

  const [articles, totalArticles] = await Promise.all([
    prisma.article.findMany({
      where,
      orderBy: {
        publishedAt: "desc",
      },
      skip: (currentPage - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: {
        category: true,
      },
    }),

    prisma.article.count({
      where,
    }),
  ]);

  const totalPages = Math.ceil(totalArticles / PAGE_SIZE);

  return (
    <main className="min-h-screen bg-gray-50 py-8 dark:bg-gray-950">
      <div className="container-main mx-auto px-4">

        {/* Header */}
        <div className="mb-8 border-b border-gray-200 pb-6 dark:border-gray-800">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-red-100 px-4 py-2 text-sm font-bold text-red-600 dark:bg-red-950/40">
            <span className="h-2 w-2 animate-pulse rounded-full bg-red-600" />
            BREAKING NEWS
          </div>

          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white md:text-4xl">
            ব্রেকিং নিউজ
          </h1>

          <p className="mt-2 text-gray-600 dark:text-gray-400">
            দেশের ও বিশ্বের সর্বশেষ গুরুত্বপূর্ণ সংবাদ।
          </p>

          <p className="mt-3 text-sm text-gray-500">
            মোট সংবাদ: {totalArticles}
          </p>
        </div>

        {/* Articles */}
        {articles.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <Link
                key={article.id}
                href={`/news/${article.slug}`}
                className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900"
              >
                <div className="relative aspect-video overflow-hidden bg-gray-100 dark:bg-gray-800">
                  {article.coverImage ? (
                    <img
                      src={article.coverImage}
                      alt={article.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-5xl text-gray-400">
                      📰
                    </div>
                  )}

                  <span className="absolute left-3 top-3 rounded-md bg-red-600 px-3 py-1 text-xs font-bold text-white">
                    BREAKING
                  </span>
                </div>

                <div className="p-5">
                  {article.category && (
                    <span className="mb-3 inline-block rounded bg-red-50 px-3 py-1 text-xs font-semibold text-red-600 dark:bg-red-950/40">
                      {article.category.name}
                    </span>
                  )}

                  <h2 className="line-clamp-2 text-lg font-bold leading-7 text-gray-900 transition group-hover:text-red-600 dark:text-white">
                    {article.title}
                  </h2>

                  {article.excerpt && (
                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-600 dark:text-gray-400">
                      {article.excerpt}
                    </p>
                  )}

                  <div className="mt-4 border-t border-gray-100 pt-3 text-xs text-gray-500 dark:border-gray-800">
                    {formatDate(article.publishedAt)}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white px-5 py-16 text-center dark:border-gray-700 dark:bg-gray-900">
            <div className="mb-4 text-5xl">📰</div>

            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
              এখনো কোনো ব্রেকিং নিউজ প্রকাশিত হয়নি
            </h2>

            <p className="mt-2 text-gray-500">
              নতুন ব্রেকিং নিউজ প্রকাশিত হলে এখানে দেখতে পাবেন।
            </p>

            <Link
              href="/"
              className="mt-6 inline-block rounded-lg bg-red-600 px-6 py-3 font-semibold text-white transition hover:bg-red-700"
            >
              হোম পেজে ফিরে যান
            </Link>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
            {currentPage > 1 && (
              <Link
                href={`/breaking-news?page=${currentPage - 1}`}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
              >
                ← আগের পৃষ্ঠা
              </Link>
            )}

            <span className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">
              পৃষ্ঠা {currentPage} / {totalPages}
            </span>

            {currentPage < totalPages && (
              <Link
                href={`/breaking-news?page=${currentPage + 1}`}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
              >
                পরের পৃষ্ঠা →
              </Link>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

// Page component
export default function BreakingNewsPage(props: PageProps) {
  return (
    <Suspense fallback={<BreakingNewsLoading />}>
      <BreakingNewsContent searchParams={props.searchParams} />
    </Suspense>
  );
}
