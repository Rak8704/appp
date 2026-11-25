
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "জনপ্রিয় সংবাদ | দৈনিক দিনলিপি",
  description: "দৈনিক দিনলিপির সর্বাধিক পঠিত জনপ্রিয় সংবাদ।",
};

const PAGE_SIZE = 12;

type PageProps = {
  searchParams: Promise<{
    page?: string;
  }>;
};

function formatDate(date: Date | null) {
  if (!date) return "প্রকাশের সময় পাওয়া যায়নি";

  return new Intl.DateTimeFormat("bn-BD", {
    dateStyle: "long",
  }).format(date);
}

export default async function PopularNewsPage({
  searchParams,
}: PageProps) {
  const params = await searchParams;

  const requestedPage = Number(params.page || 1);
  const currentPage =
    Number.isInteger(requestedPage) && requestedPage > 0
      ? requestedPage
      : 1;

  const now = new Date();

  const where = {
    status: "PUBLISHED" as const,
    publishedAt: {
      lte: now,
    },
  };

  const [articles, totalArticles] = await Promise.all([
    prisma.article.findMany({
      where,
      orderBy: [
        { viewCount: "desc" },
        { publishedAt: "desc" },
      ],
      skip: (currentPage - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: {
        category: true,
      },
    }),

    prisma.article.count({ where }),
  ]);

  const totalPages = Math.ceil(totalArticles / PAGE_SIZE);

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-[#101114]">
      {/* Header */}
      <section className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-[#17181d]">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-orange-100 px-4 py-2 text-sm font-bold text-orange-700 dark:bg-orange-950/40 dark:text-orange-400">
              MOST READ
            </span>

            <span className="text-sm text-gray-500 dark:text-gray-400">
              দৈনিক দিনলিপি
            </span>
          </div>

          <h1 className="mt-5 text-3xl font-black text-gray-900 dark:text-white sm:text-4xl">
            জনপ্রিয় সংবাদ
          </h1>

          <p className="mt-3 max-w-2xl leading-7 text-gray-600 dark:text-gray-400">
            পাঠকদের সবচেয়ে বেশি পড়া ও আলোচিত সংবাদগুলো এক জায়গায়।
          </p>

          <p className="mt-5 text-sm font-semibold text-gray-500 dark:text-gray-400">
            মোট সংবাদ: {totalArticles.toLocaleString("bn-BD")}
          </p>
        </div>
      </section>

      {/* Articles */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {articles.length > 0 ? (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {articles.map((article, index) => (
                <article
                  key={article.id}
                  className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-gray-800 dark:bg-[#191a20]"
                >
                  <Link
                    href={`/news/${article.slug}`}
                    className="block"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-gray-200 dark:bg-gray-800">
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

                      <span className="absolute left-3 top-3 flex size-10 items-center justify-center rounded-full bg-orange-600 text-sm font-black text-white shadow-lg">
                        {(index + 1 + (currentPage - 1) * PAGE_SIZE).toLocaleString("bn-BD")}
                      </span>
                    </div>

                    <div className="p-5">
                      {article.category && (
                        <span className="text-sm font-bold text-red-600">
                          {article.category.name}
                        </span>
                      )}

                      <h2 className="mt-2 line-clamp-2 text-xl font-bold leading-snug text-gray-900 transition group-hover:text-red-600 dark:text-white">
                        {article.title}
                      </h2>

                      {article.excerpt && (
                        <p className="mt-3 line-clamp-3 text-sm leading-7 text-gray-600 dark:text-gray-400">
                          {article.excerpt}
                        </p>
                      )}

                      <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4 text-xs text-gray-500 dark:border-gray-800 dark:text-gray-400">
                        <span>{formatDate(article.publishedAt)}</span>

                        <span className="flex items-center gap-1 font-bold text-orange-600">
                          <span>👁</span>
                          {article.viewCount.toLocaleString("bn-BD")} বার পঠিত
                        </span>
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex flex-wrap items-center justify-center gap-2">
                {currentPage > 1 && (
                  <Link
                    href={`/popular-news?page=${currentPage - 1}`}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:border-red-600 hover:text-red-600 dark:border-gray-700 dark:text-gray-300"
                  >
                    ← আগের পৃষ্ঠা
                  </Link>
                )}

                {Array.from(
                  { length: totalPages },
                  (_, index) => index + 1
                )
                  .filter(
                    (page) =>
                      page === 1 ||
                      page === totalPages ||
                      Math.abs(page - currentPage) <= 2
                  )
                  .map((page) => (
                    <Link
                      key={page}
                      href={`/popular-news?page=${page}`}
                      className={`rounded-lg px-4 py-2 text-sm font-bold ${
                        currentPage === page
                          ? "bg-red-600 text-white"
                          : "border border-gray-300 text-gray-700 hover:border-red-600 hover:text-red-600 dark:border-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {page.toLocaleString("bn-BD")}
                    </Link>
                  ))}

                {currentPage < totalPages && (
                  <Link
                    href={`/popular-news?page=${currentPage + 1}`}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:border-red-600 hover:text-red-600 dark:border-gray-700 dark:text-gray-300"
                  >
                    পরের পৃষ্ঠা →
                  </Link>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-5 py-20 text-center dark:border-gray-700 dark:bg-[#191a20]">
            <div className="text-6xl">📊</div>

            <h2 className="mt-5 text-2xl font-bold text-gray-900 dark:text-white">
              এখনো কোনো সংবাদ পাওয়া যায়নি
            </h2>

            <p className="mt-3 text-gray-600 dark:text-gray-400">
              সংবাদ প্রকাশিত হলে জনপ্রিয় সংবাদ এখানে দেখা যাবে।
            </p>

            <Link
              href="/"
              className="mt-7 inline-flex rounded-xl bg-red-600 px-6 py-3 font-bold text-white transition hover:bg-red-700"
            >
              প্রচ্ছদে ফিরে যান
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
