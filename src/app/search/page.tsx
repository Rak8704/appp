
import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "সংবাদ অনুসন্ধান | দৈনিক দিনলিপি",
  description: "দৈনিক দিনলিপিতে প্রকাশিত সংবাদ অনুসন্ধান করুন।",
};

const PAGE_SIZE = 12;

type SearchPageProps = {
  searchParams: Promise<{
    q?: string;
    page?: string;
  }>;
};

export default async function SearchPage({
  searchParams,
}: SearchPageProps) {
  const params = await searchParams;

  const query = params.q?.trim() || "";

  const requestedPage = Number(params.page || 1);

  const currentPage =
    Number.isInteger(requestedPage) && requestedPage > 0
      ? requestedPage
      : 1;

  const where = {
    status: "PUBLISHED" as const,
    publishedAt: {
      lte: new Date(),
    },
    OR: [
      {
        title: {
          contains: query,
          mode: "insensitive" as const,
        },
      },
      {
        excerpt: {
          contains: query,
          mode: "insensitive" as const,
        },
      },
      {
        content: {
          contains: query,
          mode: "insensitive" as const,
        },
      },
    ],
  };

  const articles = query
    ? await prisma.article.findMany({
        where,
        orderBy: {
          publishedAt: "desc",
        },
        skip: (currentPage - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
        include: {
          category: true,
          author: true,
        },
      })
    : [];

  const totalArticles = query
    ? await prisma.article.count({ where })
    : 0;

  const totalPages = Math.ceil(totalArticles / PAGE_SIZE);

  return (
    <main className="min-h-screen bg-gray-50 py-8 dark:bg-gray-950">
      <div className="container-main mx-auto px-4">

        {/* Page Header */}
        <div className="mb-8">
          <div className="mb-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-red-600">
              প্রচ্ছদ
            </Link>
            <span className="mx-2">/</span>
            সংবাদ অনুসন্ধান
          </div>

          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            সংবাদ অনুসন্ধান
          </h1>

          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            আপনার পছন্দের সংবাদ খুঁজে নিন
          </p>
        </div>

        {/* Search Form */}
        <form
          action="/search"
          method="GET"
          className="mb-8 flex flex-col gap-3 sm:flex-row"
        >
          <input
            type="search"
            name="q"
            defaultValue={query}
            placeholder="সংবাদের শিরোনাম বা বিষয় লিখুন..."
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:ring-red-950"
          />

          <button
            type="submit"
            className="shrink-0 rounded-lg bg-red-600 px-8 py-3 font-semibold text-white transition hover:bg-red-700"
          >
            অনুসন্ধান করুন
          </button>
        </form>

        {/* Search Results */}
        {query ? (
          <>
            <div className="mb-6 border-b border-gray-200 pb-4 dark:border-gray-800">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                অনুসন্ধানের ফলাফল: "{query}"
              </h2>

              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                মোট {totalArticles} টি সংবাদ পাওয়া গেছে
              </p>
            </div>

            {articles.length > 0 ? (
              <>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {articles.map((article) => (
                    <article
                      key={article.id}
                      className="overflow-hidden rounded-xl border border-gray-200 bg-white transition hover:-translate-y-1 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900"
                    >
                      {/* Cover Image */}
                      <Link href={`/news/${article.slug}`}>
                        <div className="aspect-video overflow-hidden bg-gray-100 dark:bg-gray-800">
                          {article.coverImage ? (
                            <img
                              src={article.coverImage}
                              alt={article.title}
                              className="h-full w-full object-cover transition duration-300 hover:scale-105"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-gray-400">
                              কোনো ছবি নেই
                            </div>
                          )}
                        </div>
                      </Link>

                      <div className="p-5">
                        {/* Category */}
                        {article.category && (
                          <Link
                            href={`/category/${article.category.slug}`}
                            className="mb-3 inline-block rounded-md bg-red-50 px-3 py-1 text-xs font-semibold text-red-600 dark:bg-red-950/40 dark:text-red-400"
                          >
                            {article.category.name}
                          </Link>
                        )}

                        {/* Title */}
                        <h3 className="mb-3 line-clamp-2 text-lg font-bold leading-7 text-gray-900 dark:text-white">
                          <Link
                            href={`/news/${article.slug}`}
                            className="transition hover:text-red-600"
                          >
                            {article.title}
                          </Link>
                        </h3>

                        {/* Excerpt */}
                        {article.excerpt && (
                          <p className="mb-4 line-clamp-3 text-sm leading-6 text-gray-600 dark:text-gray-400">
                            {article.excerpt}
                          </p>
                        )}

                        {/* Author and Date */}
                        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-gray-100 pt-3 text-xs text-gray-500 dark:border-gray-800 dark:text-gray-400">
                          <span>
                            {article.author?.name || "দৈনিক দিনলিপি"}
                          </span>

                          <span>
                            {article.publishedAt
                              ? new Date(
                                  article.publishedAt
                                ).toLocaleDateString("bn-BD", {
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                })
                              : ""}
                          </span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
                    {currentPage > 1 && (
                      <Link
                        href={`/search?q=${encodeURIComponent(query)}&page=${currentPage - 1}`}
                        className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:border-red-500 hover:text-red-600 dark:border-gray-700 dark:text-gray-300"
                      >
                        পূর্ববর্তী
                      </Link>
                    )}

                    {Array.from(
                      { length: totalPages },
                      (_, index) => index + 1
                    ).map((page) => (
                      <Link
                        key={page}
                        href={`/search?q=${encodeURIComponent(query)}&page=${page}`}
                        className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                          currentPage === page
                            ? "bg-red-600 text-white"
                            : "border border-gray-300 text-gray-700 hover:border-red-500 hover:text-red-600 dark:border-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {page}
                      </Link>
                    ))}

                    {currentPage < totalPages && (
                      <Link
                        href={`/search?q=${encodeURIComponent(query)}&page=${currentPage + 1}`}
                        className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:border-red-500 hover:text-red-600 dark:border-gray-700 dark:text-gray-300"
                      >
                        পরবর্তী
                      </Link>
                    )}
                  </div>
                )}
              </>
            ) : (
              /* No Results */
              <div className="rounded-xl border border-gray-200 bg-white px-6 py-16 text-center dark:border-gray-800 dark:bg-gray-900">
                <div className="mb-4 text-5xl">🔎</div>

                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  কোনো সংবাদ পাওয়া যায়নি
                </h3>

                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  অন্য কোনো শব্দ দিয়ে আবার অনুসন্ধান করুন।
                </p>

                <Link
                  href="/"
                  className="mt-6 inline-block rounded-lg bg-red-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
                >
                  প্রচ্ছদে ফিরে যান
                </Link>
              </div>
            )}
          </>
        ) : (
          /* Empty Search */
          <div className="rounded-xl border border-gray-200 bg-white px-6 py-16 text-center dark:border-gray-800 dark:bg-gray-900">
            <div className="mb-4 text-5xl">📰</div>

            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              কী খুঁজতে চান?
            </h2>

            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              উপরের সার্চ বক্সে সংবাদের নাম বা বিষয় লিখে অনুসন্ধান করুন।
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
