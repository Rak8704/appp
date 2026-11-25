
import Link from "next/link";
import { Suspense } from "react";
import { connection } from "next/server";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "ট্রেন্ডিং নিউজ | দৈনিক দিনলিপি",
  description: "পাঠকদের আগ্রহের শীর্ষে থাকা ট্রেন্ডিং নিউজ পড়ুন দৈনিক দিনলিপিতে।",
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

function TrendingNewsLoading() {
  return (
    <main className="min-h-screen bg-gray-50 py-12 dark:bg-gray-950">
      <div className="container-main mx-auto px-4">
        <div className="mb-8 animate-pulse">
          <div className="mb-4 h-8 w-48 rounded bg-gray-200 dark:bg-gray-800" />
          <div className="h-5 w-72 rounded bg-gray-200 dark:bg-gray-800" />
        </div>

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
    </main>
  );
}

async function TrendingNewsContent({ searchParams }: PageProps) {
  await connection();

  const params = await searchParams;

  const currentPage = Math.max(1, Number(params.page) || 1);
  const now = new Date();

  const where = {
    status: "PUBLISHED" as const,
    isTrending: true,
    publishedAt: {
      lte: now,
    },
  };

  const [articles, totalArticles] = await Promise.all([
    prisma.article.findMany({
      where,
      orderBy: [
        { publishedAt: "desc" },
        { viewCount: "desc" },
      ],
      skip: (currentPage - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: {
        category: true,
        author: true,
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
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-orange-100 px-4 py-2 text-sm font-bold text-orange-600 dark:bg-orange-950/40">
            <span className="h-2 w-2 animate-pulse rounded-full bg-orange-500" />
            TRENDING NOW
          </div>

          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white md:text-4xl">
            ট্রেন্ডিং নিউজ
          </h1>

          <p className="mt-2 text-gray-600 dark:text-gray-400">
            পাঠকদের আগ্রহের শীর্ষে থাকা আলোচিত সংবাদগুলো এক জায়গায়।
          </p>

          <p className="mt-3 text-sm text-gray-500">
            মোট ট্রেন্ডিং সংবাদ: {totalArticles}
          </p>
        </div>

        {/* Articles */}
        {articles.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article, index) => {
              const rank =
                (currentPage - 1) * PAGE_SIZE + index + 1;

              return (
                <Link
                  key={article.id}
                  href={`/news/${article.slug}`}
                  className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900"
                >
                  {/* Image */}
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

                    <span className="absolute left-3 top-3 rounded-md bg-orange-500 px-3 py-1 text-xs font-bold text-white">
                      TRENDING
                    </span>

                    <span className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/70 text-sm font-bold text-white">
                      {rank}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    {article.category && (
                      <span className="mb-3 inline-block rounded bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-600 dark:bg-orange-950/40">
                        {article.category.name}
                      </span>
                    )}

                    <h2 className="line-clamp-2 text-lg font-bold leading-7 text-gray-900 transition group-hover:text-orange-600 dark:text-white">
                      {article.title}
                    </h2>

                    {article.excerpt && (
                      <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-600 dark:text-gray-400">
                        {article.excerpt}
                      </p>
                    )}

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-gray-100 pt-3 text-xs text-gray-500 dark:border-gray-800">
                      <span>
                        {formatDate(article.publishedAt)}
                      </span>

                      <span className="flex items-center gap-1 font-semibold text-orange-600">
                        <span>👁</span>
                        {article.viewCount.toLocaleString("bn-BD")} পাঠ
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white px-5 py-16 text-center dark:border-gray-700 dark:bg-gray-900">
            <div className="mb-4 text-5xl">🔥</div>

            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
              এখনো কোনো ট্রেন্ডিং নিউজ প্রকাশিত হয়নি
            </h2>

            <p className="mt-2 text-gray-500">
              Admin Panel থেকে কোনো প্রকাশিত নিউজকে Trending হিসেবে নির্বাচন করলে এখানে দেখা যাবে।
            </p>

            <Link
              href="/"
              className="mt-6 inline-block rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white transition hover:bg-orange-600"
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
                href={`/trending-news?page=${currentPage - 1}`}
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
                href={`/trending-news?page=${currentPage + 1}`}
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

export default function TrendingNewsPage(props: PageProps) {
  return (
    <Suspense fallback={<TrendingNewsLoading />}>
      <TrendingNewsContent searchParams={props.searchParams} />
    </Suspense>
  );
}
