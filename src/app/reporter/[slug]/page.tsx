
import Link from "next/link";
import { Suspense } from "react";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "সাংবাদিক পরিচিতি | দৈনিক দিনলিপি",
  description: "দৈনিক দিনলিপির সাংবাদিকদের পরিচিতি ও প্রকাশিত প্রতিবেদন পড়ুন।",
};

const PAGE_SIZE = 12;

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
};

function formatDate(date: Date | null) {
  if (!date) return "তারিখ পাওয়া যায়নি";

  return new Intl.DateTimeFormat("bn-BD", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(date);
}

function getRoleName(role: string) {
  const roles: Record<string, string> = {
    SUPER_ADMIN: "সুপার অ্যাডমিন",
    ADMIN: "অ্যাডমিন",
    EDITOR: "সম্পাদক",
    REPORTER: "সাংবাদিক",
  };

  return roles[role] || "প্রতিবেদক";
}

function ReporterLoading() {
  return (
    <main className="min-h-screen bg-gray-50 py-12 dark:bg-gray-950">
      <div className="container-main mx-auto px-4">
        <div className="mb-8 animate-pulse rounded-2xl bg-white p-8 dark:bg-gray-900">
          <div className="flex items-center gap-5">
            <div className="h-24 w-24 rounded-full bg-gray-200 dark:bg-gray-800" />
            <div className="space-y-3">
              <div className="h-6 w-48 rounded bg-gray-200 dark:bg-gray-800" />
              <div className="h-4 w-32 rounded bg-gray-200 dark:bg-gray-800" />
            </div>
          </div>
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
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

async function ReporterContent({ params, searchParams }: PageProps) {
  await connection();

  const { slug } = await params;
  const query = await searchParams;

  const currentPage = Math.max(1, Number(query.page) || 1);
  const now = new Date();

  // Find reporter
  const reporter = await prisma.user.findFirst({
    where: {
      slug,
      isActive: true,
      role: "REPORTER",
    },
    select: {
      id: true,
      name: true,
      slug: true,
      avatar: true,
      bio: true,
      role: true,
    },
  });

  if (!reporter) {
    notFound();
  }

  // Find reporter's published articles
  const articleWhere = {
    authorId: reporter.id,
    status: "PUBLISHED" as const,
    publishedAt: {
      lte: now,
    },
  };

  const [articles, totalArticles] = await Promise.all([
    prisma.article.findMany({
      where: articleWhere,
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
      where: articleWhere,
    }),
  ]);

  const totalPages = Math.ceil(totalArticles / PAGE_SIZE);

  return (
    <main className="min-h-screen bg-gray-50 py-8 dark:bg-gray-950">
      <div className="container-main mx-auto px-4">

        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="transition hover:text-red-600">
            প্রচ্ছদ
          </Link>
          <span>/</span>
          <span className="font-semibold text-gray-800 dark:text-gray-200">
            সাংবাদিক পরিচিতি
          </span>
        </div>

        {/* Reporter Profile */}
        <section className="mb-10 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="h-32 bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-600 md:h-40" />

          <div className="px-6 pb-7 md:px-10">
            <div className="-mt-14 flex flex-col gap-5 sm:-mt-16 sm:flex-row sm:items-end">

              {/* Avatar */}
              <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-gray-100 text-4xl font-bold text-blue-600 shadow-md dark:border-gray-900 dark:bg-gray-800 md:h-32 md:w-32">
                {reporter.avatar ? (
                  <img
                    src={reporter.avatar}
                    alt={reporter.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  reporter.name.charAt(0)
                )}
              </div>

              {/* Information */}
              <div className="flex-1 pb-1">
                <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
                  <span>✍️</span>
                  {getRoleName(reporter.role)}
                </div>

                <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white md:text-3xl">
                  {reporter.name}
                </h1>

                <p className="mt-2 text-sm text-gray-500">
                  দৈনিক দিনলিপি
                </p>
              </div>

              {/* Article Count */}
              <div className="rounded-xl bg-gray-50 px-5 py-4 text-center dark:bg-gray-800">
                <p className="text-2xl font-extrabold text-blue-600">
                  {totalArticles.toLocaleString("bn-BD")}
                </p>
                <p className="mt-1 text-xs font-medium text-gray-500">
                  প্রকাশিত প্রতিবেদন
                </p>
              </div>
            </div>

            {/* Bio */}
            {reporter.bio && (
              <div className="mt-7 max-w-3xl border-t border-gray-100 pt-5 dark:border-gray-800">
                <h2 className="mb-2 text-sm font-bold text-gray-900 dark:text-white">
                  সাংবাদিক পরিচিতি
                </h2>

                <p className="whitespace-pre-line text-sm leading-7 text-gray-600 dark:text-gray-400">
                  {reporter.bio}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Articles Heading */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 pb-5 dark:border-gray-800">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">
              প্রকাশিত প্রতিবেদন
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {reporter.name}-এর সকল প্রকাশিত সংবাদ
            </p>
          </div>

          <span className="rounded-lg bg-blue-50 px-4 py-2 text-sm font-bold text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
            মোট {totalArticles.toLocaleString("bn-BD")} টি
          </span>
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
                <div className="aspect-video overflow-hidden bg-gray-100 dark:bg-gray-800">
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
                </div>

                <div className="p-5">
                  {article.category && (
                    <span className="mb-3 inline-block rounded bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
                      {article.category.name}
                    </span>
                  )}

                  <h3 className="line-clamp-2 text-lg font-bold leading-7 text-gray-900 transition group-hover:text-blue-600 dark:text-white">
                    {article.title}
                  </h3>

                  {article.excerpt && (
                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-600 dark:text-gray-400">
                      {article.excerpt}
                    </p>
                  )}

                  <div className="mt-4 flex items-center justify-between gap-2 border-t border-gray-100 pt-3 text-xs text-gray-500 dark:border-gray-800">
                    <span>{formatDate(article.publishedAt)}</span>
                    <span className="font-semibold text-blue-600">
                      পড়ুন →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white px-5 py-16 text-center dark:border-gray-700 dark:bg-gray-900">
            <div className="mb-4 text-5xl">📰</div>

            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
              এই সাংবাদিকের কোনো প্রতিবেদন পাওয়া যায়নি
            </h2>

            <p className="mt-2 text-gray-500">
              নতুন প্রতিবেদন প্রকাশিত হলে এখানে দেখা যাবে।
            </p>

            <Link
              href="/"
              className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
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
                href={`/reporter/${reporter.slug}?page=${currentPage - 1}`}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
              >
                ← আগের পৃষ্ঠা
              </Link>
            )}

            <span className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">
              পৃষ্ঠা {currentPage.toLocaleString("bn-BD")} / {totalPages.toLocaleString("bn-BD")}
            </span>

            {currentPage < totalPages && (
              <Link
                href={`/reporter/${reporter.slug}?page=${currentPage + 1}`}
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

export default function ReporterPage(props: PageProps) {
  return (
    <Suspense fallback={<ReporterLoading />}>
      <ReporterContent
        params={props.params}
        searchParams={props.searchParams}
      />
    </Suspense>
  );
}
