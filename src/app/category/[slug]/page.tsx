
import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

// Next.js 16 Cache Components compatibility
export const instant = false;

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
};

const PAGE_SIZE = 12;

async function getCategory(slug: string) {
  return prisma.category.findFirst({
    where: {
      slug,
      isActive: true,
    },
  });
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { slug } = await params;

  if (slug === "home") {
    return { title: "প্রচ্ছদ | দৈনিক দিনলিপি" };
  }

  const category = await getCategory(slug);

  if (!category) {
    return { title: "ক্যাটাগরি পাওয়া যায়নি | দৈনিক দিনলিপি" };
  }

  return {
    title: `${category.name} সংবাদ | দৈনিক দিনলিপি`,
    description:
      category.description ||
      `${category.name} বিভাগের সর্বশেষ সংবাদ পড়ুন দৈনিক দিনলিপিতে।`,
  };
}

function formatDate(date: Date | null) {
  if (!date) return "তারিখ পাওয়া যায়নি";

  return new Intl.DateTimeFormat("bn-BD", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Dhaka",
  }).format(date);
}

type ArticleItem = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImage: string | null;
  viewCount: number;
  publishedAt: Date | null;
  createdAt: Date;
  category: {
    name: string;
    slug: string;
  };
  author: {
    name: string | null;
  };
};

function NewsImage({
  article,
  className = "",
}: {
  article: ArticleItem;
  className?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden bg-gradient-to-br from-slate-200 to-slate-400 ${className}`}
      style={
        article.coverImage
          ? {
              backgroundImage: `linear-gradient(0deg, rgba(0,0,0,.15), transparent), url("${article.coverImage}")`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : undefined
      }
    >
      {!article.coverImage && (
        <div className="flex h-full items-center justify-center text-5xl text-white/70">
          📰
        </div>
      )}
    </div>
  );
}

function NewsCard({ article }: { article: ArticleItem }) {
  return (
    <article className="group overflow-hidden rounded-xl border border-gray-200 bg-white transition hover:-translate-y-1 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900">
      <Link href={`/news/${article.slug}`} className="block">
        <NewsImage
          article={article}
          className="aspect-[16/10] w-full transition duration-500 group-hover:scale-[1.01]"
        />
      </Link>

      <div className="p-4">
        <Link
          href={`/news/${article.slug}`}
          className="line-clamp-2 text-lg font-bold leading-7 text-gray-900 transition hover:text-red-600 dark:text-white"
        >
          {article.title}
        </Link>

        {article.excerpt && (
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-600 dark:text-gray-400">
            {article.excerpt}
          </p>
        )}

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-gray-100 pt-3 text-xs text-gray-500 dark:border-gray-800 dark:text-gray-400">
          <span>{article.author.name || "দৈনিক দিনলিপি"}</span>
          <span>{formatDate(article.publishedAt)}</span>
        </div>
      </div>
    </article>
  );
}

function SectionTitle({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-5 flex items-end justify-between border-b-2 border-red-600 pb-3">
      <div>
        <h2 className="text-xl font-extrabold text-gray-900 dark:text-white md:text-2xl">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}

export default async function CategoryPage({
  params,
  searchParams,
}: Props) {
  const { slug } = await params;
  const { page: pageParam } = await searchParams;

  if (slug === "home") redirect("/");

  const category = await getCategory(slug);

  if (!category) notFound();

  const requestedPage = Number(pageParam || 1);

  const currentPage =
    Number.isInteger(requestedPage) && requestedPage > 0
      ? requestedPage
      : 1;

  const where = {
    categoryId: category.id,
    status: "PUBLISHED" as const,
    publishedAt: {
      lte: new Date(),
    },
  };

  const [
    latestArticles,
    featuredArticles,
    trendingArticles,
    popularArticles,
    totalArticles,
  ] = await Promise.all([
    prisma.article.findMany({
      where,
      orderBy: { publishedAt: "desc" },
      skip: (currentPage - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: {
        category: true,
        author: true,
      },
    }),

    prisma.article.findMany({
      where: {
        ...where,
        isFeatured: true,
      },
      orderBy: { publishedAt: "desc" },
      take: 4,
      include: {
        category: true,
        author: true,
      },
    }),

    prisma.article.findMany({
      where: {
        ...where,
        isTrending: true,
      },
      orderBy: [
        { viewCount: "desc" },
        { publishedAt: "desc" },
      ],
      take: 5,
      include: {
        category: true,
        author: true,
      },
    }),

    prisma.article.findMany({
      where,
      orderBy: [
        { viewCount: "desc" },
        { publishedAt: "desc" },
      ],
      take: 5,
      include: {
        category: true,
        author: true,
      },
    }),

    prisma.article.count({ where }),
  ]);

  const totalPages = Math.ceil(totalArticles / PAGE_SIZE);

  if (currentPage > 1 && currentPage > totalPages) {
    notFound();
  }

  const featuredArticle =
    featuredArticles[0] || latestArticles[0] || null;

  const remainingArticles = latestArticles.filter(
    (article) => article.id !== featuredArticle?.id
  );

  const hasArticles = totalArticles > 0;

  return (
    <main className="min-h-screen bg-gray-50 pb-16 dark:bg-gray-950">
      <div className="mx-auto max-w-7xl px-4 py-5 md:px-6">

        {/* Breadcrumb */}
        <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <Link href="/" className="transition hover:text-red-600">
            প্রচ্ছদ
          </Link>
          <span>/</span>
          <span className="font-semibold text-red-600">
            {category.name}
          </span>
        </nav>

        {/* Category Header */}
        <section className="mb-8 overflow-hidden rounded-2xl bg-gradient-to-r from-red-700 via-red-600 to-orange-500 px-6 py-9 text-white shadow-lg md:px-10">
          <div className="max-w-3xl">
            <div className="mb-3 inline-flex rounded-full bg-white/20 px-4 py-1.5 text-xs font-bold tracking-wide">
              দৈনিক দিনলিপি | সংবাদ বিভাগ
            </div>

            <h1 className="text-3xl font-extrabold md:text-5xl">
              {category.name}
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-white/90 md:text-base">
              {category.description ||
                `${category.name} বিভাগের দেশ-বিদেশের গুরুত্বপূর্ণ সংবাদ, সর্বশেষ আপডেট ও বিশ্লেষণ পড়ুন দৈনিক দিনলিপিতে।`}
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <span className="rounded-lg bg-white px-4 py-2 text-sm font-bold text-red-700">
                মোট সংবাদ: {totalArticles.toLocaleString("bn-BD")} টি
              </span>

              <span className="rounded-lg border border-white/40 px-4 py-2 text-sm font-semibold">
                সর্বশেষ সংবাদ ও আপডেট
              </span>
            </div>
          </div>
        </section>

        {hasArticles ? (
          <>
            {/* Featured News */}
            {featuredArticle && (
              <section className="mb-10">
                <SectionTitle
                  title="বিশেষ সংবাদ"
                  subtitle="এই বিভাগের গুরুত্বপূর্ণ খবর"
                />

                <div className="grid gap-6 lg:grid-cols-5">
                  <Link
                    href={`/news/${featuredArticle.slug}`}
                    className="group relative min-h-[300px] overflow-hidden rounded-2xl bg-gray-800 lg:col-span-3 lg:min-h-[390px]"
                  >
                    <NewsImage
                      article={featuredArticle}
                      className="absolute inset-0 h-full w-full transition duration-700 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                    <div className="absolute bottom-0 left-0 right-0 p-5 text-white md:p-8">
                      <span className="mb-3 inline-block rounded bg-red-600 px-3 py-1 text-xs font-bold">
                        বিশেষ সংবাদ
                      </span>

                      <h2 className="max-w-3xl text-2xl font-extrabold leading-tight md:text-3xl">
                        {featuredArticle.title}
                      </h2>

                      {featuredArticle.excerpt && (
                        <p className="mt-3 line-clamp-2 max-w-2xl text-sm leading-6 text-white/80">
                          {featuredArticle.excerpt}
                        </p>
                      )}

                      <div className="mt-4 flex flex-wrap gap-4 text-xs text-white/80">
                        <span>
                          {featuredArticle.author.name || "দৈনিক দিনলিপি"}
                        </span>
                        <span>
                          {formatDate(featuredArticle.publishedAt)}
                        </span>
                      </div>
                    </div>
                  </Link>

                  <div className="space-y-4 lg:col-span-2">
                    {featuredArticles
                      .filter(
                        (article) => article.id !== featuredArticle.id
                      )
                      .slice(0, 3)
                      .map((article) => (
                        <Link
                          key={article.id}
                          href={`/news/${article.slug}`}
                          className="group flex gap-4 overflow-hidden rounded-xl border border-gray-200 bg-white p-3 transition hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
                        >
                          <NewsImage
                            article={article}
                            className="h-24 w-28 shrink-0 rounded-lg sm:h-28 sm:w-36"
                          />

                          <div className="min-w-0 py-1">
                            <h3 className="line-clamp-3 font-bold leading-6 text-gray-900 group-hover:text-red-600 dark:text-white">
                              {article.title}
                            </h3>

                            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                              {formatDate(article.publishedAt)}
                            </p>
                          </div>
                        </Link>
                      ))}

                    {featuredArticles.length <= 1 && (
                      <div className="flex h-full min-h-36 items-center justify-center rounded-xl border border-dashed border-gray-300 p-5 text-center text-sm text-gray-500 dark:border-gray-700">
                        আরও বিশেষ সংবাদ প্রকাশিত হলে এখানে দেখা যাবে।
                      </div>
                    )}
                  </div>
                </div>
              </section>
            )}

            {/* Latest News + Sidebar */}
            <div className="grid items-start gap-8 lg:grid-cols-3">

              {/* Latest News */}
              <section className="lg:col-span-2">
                <SectionTitle
                  title="সর্বশেষ আন্তর্জাতিক সংবাদ"
                  subtitle="এই বিভাগের সর্বশেষ প্রকাশিত খবর"
                />

                {remainingArticles.length > 0 ? (
                  <div className="grid gap-5 sm:grid-cols-2">
                    {remainingArticles.map((article) => (
                      <NewsCard key={article.id} article={article} />
                    ))}
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center dark:border-gray-700 dark:bg-gray-900">
                    <p className="font-semibold text-gray-700 dark:text-gray-300">
                      এই পৃষ্ঠায় আরও সংবাদ নেই।
                    </p>
                  </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <nav
                    aria-label="সংবাদ পৃষ্ঠা"
                    className="mt-10 flex flex-wrap items-center justify-center gap-2"
                  >
                    {currentPage > 1 && (
                      <Link
                        href={`/category/${slug}?page=${currentPage - 1}`}
                        className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold hover:border-red-600 hover:text-red-600 dark:border-gray-700 dark:bg-gray-900"
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
                          href={
                            page === 1
                              ? `/category/${slug}`
                              : `/category/${slug}?page=${page}`
                          }
                          className={`rounded-lg border px-4 py-2 text-sm font-bold ${
                            currentPage === page
                              ? "border-red-600 bg-red-600 text-white"
                              : "border-gray-300 bg-white text-gray-700 hover:border-red-600 hover:text-red-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                          }`}
                        >
                          {page.toLocaleString("bn-BD")}
                        </Link>
                      ))}

                    {currentPage < totalPages && (
                      <Link
                        href={`/category/${slug}?page=${currentPage + 1}`}
                        className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold hover:border-red-600 hover:text-red-600 dark:border-gray-700 dark:bg-gray-900"
                      >
                        পরের পৃষ্ঠা →
                      </Link>
                    )}
                  </nav>
                )}
              </section>

              {/* Sidebar */}
              <aside className="space-y-8">

                {/* Trending */}
                <section>
                  <SectionTitle
                    title="ট্রেন্ডিং সংবাদ"
                    subtitle="পাঠকদের আলোচিত খবর"
                  />

                  {trendingArticles.length > 0 ? (
                    <div className="space-y-4">
                      {trendingArticles.map((article, index) => (
                        <Link
                          key={article.id}
                          href={`/news/${article.slug}`}
                          className="group flex gap-3"
                        >
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-600 text-sm font-extrabold text-white">
                            {(index + 1).toLocaleString("bn-BD")}
                          </div>

                          <div>
                            <h3 className="line-clamp-2 text-sm font-bold leading-6 text-gray-800 group-hover:text-red-600 dark:text-gray-200">
                              {article.title}
                            </h3>

                            <p className="mt-1 text-xs text-gray-500">
                              {article.viewCount.toLocaleString("bn-BD")} পাঠ
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="rounded-lg bg-white p-4 text-sm text-gray-500 dark:bg-gray-900">
                      এখনো কোনো ট্রেন্ডিং সংবাদ নেই।
                    </p>
                  )}
                </section>

                {/* Popular */}
                <section>
                  <SectionTitle
                    title="জনপ্রিয় সংবাদ"
                    subtitle="সর্বাধিক পঠিত খবর"
                  />

                  {popularArticles.length > 0 ? (
                    <div className="space-y-4">
                      {popularArticles.map((article) => (
                        <Link
                          key={article.id}
                          href={`/news/${article.slug}`}
                          className="group flex gap-3"
                        >
                          <NewsImage
                            article={article}
                            className="h-20 w-24 shrink-0 rounded-lg"
                          />

                          <div className="min-w-0">
                            <h3 className="line-clamp-3 text-sm font-bold leading-5 text-gray-800 group-hover:text-red-600 dark:text-gray-200">
                              {article.title}
                            </h3>

                            <p className="mt-2 text-xs text-gray-500">
                              {article.viewCount.toLocaleString("bn-BD")} পাঠ
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="rounded-lg bg-white p-4 text-sm text-gray-500 dark:bg-gray-900">
                      জনপ্রিয় সংবাদ এখনো পাওয়া যায়নি।
                    </p>
                  )}
                </section>

                {/* All News Count */}
                <div className="rounded-xl border border-red-100 bg-red-50 p-5 dark:border-red-900/40 dark:bg-red-950/30">
                  <h3 className="font-bold text-gray-900 dark:text-white">
                    {category.name} বিভাগ
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400">
                    এই বিভাগে প্রকাশিত সব সংবাদ এক জায়গায় পড়ুন।
                  </p>

                  <p className="mt-3 text-2xl font-extrabold text-red-600">
                    {totalArticles.toLocaleString("bn-BD")}
                    <span className="ml-2 text-sm font-semibold">
                      টি সংবাদ
                    </span>
                  </p>
                </div>
              </aside>
            </div>
          </>
        ) : (
          /* Empty State */
          <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
            <div className="mx-auto max-w-2xl px-5 py-16 text-center md:py-24">
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-red-50 text-5xl dark:bg-red-950/40">
                📰
              </div>

              <h2 className="mt-7 text-2xl font-extrabold text-gray-900 dark:text-white md:text-3xl">
                এখনো কোনো সংবাদ প্রকাশিত হয়নি
              </h2>

              <p className="mt-4 text-sm leading-7 text-gray-500 dark:text-gray-400 md:text-base">
                {category.name} বিভাগে নতুন সংবাদ প্রকাশিত হলে
                এখানে সর্বশেষ খবর, বিশেষ সংবাদ এবং জনপ্রিয়
                প্রতিবেদন দেখতে পাবেন।
              </p>

              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link
                  href="/"
                  className="rounded-lg bg-red-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-red-700"
                >
                  প্রচ্ছদে ফিরে যান
                </Link>

                <Link
                  href="/"
                  className="rounded-lg border border-gray-300 px-6 py-3 text-sm font-bold text-gray-700 transition hover:border-red-600 hover:text-red-600 dark:border-gray-700 dark:text-gray-300"
                >
                  সর্বশেষ সংবাদ দেখুন
                </Link>
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
