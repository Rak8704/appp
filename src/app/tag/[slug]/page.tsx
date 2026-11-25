
import Link from "next/link";
import { Suspense } from "react";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

const PAGE_SIZE = 12;

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
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

function TagLoading() {
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

async function TagContent({ params, searchParams }: PageProps) {
  await connection();

  const { slug } = await params;
  const query = await searchParams;

  const currentPage = Math.max(1, Number(query.page) || 1);
  const now = new Date();

  // Find Tag
  const tag = await prisma.tag.findUnique({
    where: {
      slug,
    },
    select: {
      id: true,
      name: true,
      slug: true,
    },
  });

  if (!tag) {
    notFound();
  }

  // Find Published Articles connected to this Tag
  const articleWhere = {
    tagId: tag.id,
    article: {
      status: "PUBLISHED" as const,
      publishedAt: {
        lte: now,
      },
    },
  };

  const [taggedArticles, totalArticles] = await Promise.all([
    prisma.articleTag.findMany({
      where: articleWhere,
      orderBy: {
        article: {
          publishedAt: "desc",
        },
      },
      skip: (currentPage - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: {
        article: {
          include: {
            category: true,
          },
        },
      },
    }),

    prisma.articleTag.count({
      where: articleWhere,
    }),
  ]);

  const totalPages = Math.ceil(totalArticles / PAGE_SIZE);

  return (
    <main className="min-h-screen bg-gray-50 py-8 dark:bg-gray-950">
      <div className="container-main mx-auto px-4">

        {/* Header */}
        <div className="mb-8 rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 dark:border-blue-900/40 dark:from-blue-950/30 dark:to-indigo-950/30 md:p-10">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-bold text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
            <span>#</span>
            NEWS TAG
          </div>

          <p className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">
            এই বিষয়ে প্রকাশিত সংবাদ
          </p>

          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white md:text-4xl">
            #{tag.name}
          </h1>

          <p className="mt-3 text-gray-600 dark:text-gray-400">
            এই Tag-এর অধীনে প্রকাশিত সকল সংবাদ এখানে পাওয়া যাবে।
          </p>

          <div className="mt-5 inline-flex rounded-lg bg-white px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm dark:bg-gray-900 dark:text-blue-300">
            মোট সংবাদ: {totalArticles.toLocaleString("bn-BD")}
          </div>
        </div>

        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="transition hover:text-blue-600">
            প্রচ্ছদ
          </Link>

          <span>/</span>

          <span className="font-semibold text-gray-800 dark:text-gray-200">
            #{tag.name}
          </span>
        </div>

        {/* Articles */}
        {taggedArticles.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {taggedArticles.map(({ article }) => (
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

                  <span className="absolute left-3 top-3 rounded-md bg-blue-600 px-3 py-1 text-xs font-bold text-white">
                    #{tag.name}
                  </span>
                </div>

                {/* Content */}
                <div className="p-5">
                  {article.category && (
                    <span className="mb-3 inline-block rounded bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
                      {article.category.name}
                    </span>
                  )}

                  <h2 className="line-clamp-2 text-lg font-bold leading-7 text-gray-900 transition group-hover:text-blue-600 dark:text-white">
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
            <div className="mb-4 text-5xl">🏷️</div>

            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
              এই Tag-এর অধীনে কোনো সংবাদ পাওয়া যায়নি
            </h2>

            <p className="mt-2 text-gray-500">
              এই বিষয়ে নতুন সংবাদ প্রকাশিত হলে এখানে দেখা যাবে।
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
                href={`/tag/${tag.slug}?page=${currentPage - 1}`}
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
                href={`/tag/${tag.slug}?page=${currentPage + 1}`}
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

export default function TagPage(props: PageProps) {
  return (
    <Suspense fallback={<TagLoading />}>
      <TagContent
        params={props.params}
        searchParams={props.searchParams}
      />
    </Suspense>
  );
}
