
import Link from "next/link";
import { Suspense } from "react";
import { connection } from "next/server";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "সংবাদ আর্কাইভ | দৈনিক দিনলিপি",
  description: "তারিখ ও মাস অনুযায়ী দৈনিক দিনলিপির পুরোনো সংবাদ খুঁজে পড়ুন।",
};

const PAGE_SIZE = 12;

type PageProps = {
  searchParams: Promise<{
    page?: string;
    year?: string;
    month?: string;
  }>;
};

function formatDate(date: Date | null) {
  if (!date) return "তারিখ পাওয়া যায়নি";

  return new Intl.DateTimeFormat("bn-BD", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(date);
}

function ArchiveLoading() {
  return (
    <main className="min-h-screen bg-gray-50 py-12 dark:bg-gray-950">
      <div className="container-main mx-auto px-4">
        <div className="mb-8 animate-pulse">
          <div className="mb-4 h-8 w-48 rounded bg-gray-200 dark:bg-gray-800" />
          <div className="h-5 w-72 rounded bg-gray-200 dark:bg-gray-800" />
        </div>

        <div className="mb-8 h-28 rounded-xl bg-gray-200 dark:bg-gray-800" />

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

async function ArchiveContent({ searchParams }: PageProps) {
  await connection();

  const params = await searchParams;

  const currentPage = Math.max(1, Number(params.page) || 1);

  const selectedYear = /^\d{4}$/.test(params.year || "")
    ? Number(params.year)
    : null;

  const selectedMonth = /^\d{1,2}$/.test(params.month || "")
    ? Number(params.month)
    : null;

  const validMonth =
    selectedMonth !== null &&
    selectedMonth >= 1 &&
    selectedMonth <= 12
      ? selectedMonth
      : null;

  const now = new Date();

  const where: {
    status: "PUBLISHED";
    publishedAt: {
      lte: Date;
      gte?: Date;
      lt?: Date;
    };
  } = {
    status: "PUBLISHED",
    publishedAt: {
      lte: now,
    },
  };

  if (selectedYear !== null && selectedYear >= 2000 && selectedYear <= now.getFullYear()) {
    const start = validMonth
      ? new Date(selectedYear, validMonth - 1, 1)
      : new Date(selectedYear, 0, 1);

    const end = validMonth
      ? new Date(selectedYear, validMonth, 1)
      : new Date(selectedYear + 1, 0, 1);

    where.publishedAt.gte = start;
    where.publishedAt.lt = end;
  }

  const [articles, totalArticles, yearRecords] = await Promise.all([
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

    prisma.article.findMany({
      where: {
        status: "PUBLISHED",
        publishedAt: {
          lte: now,
        },
      },
      select: {
        publishedAt: true,
      },
      distinct: ["publishedAt"],
      orderBy: {
        publishedAt: "desc",
      },
    }),
  ]);

  const totalPages = Math.ceil(totalArticles / PAGE_SIZE);

  const availableYears = Array.from(
    new Set(
      yearRecords
        .filter((item) => item.publishedAt !== null)
        .map((item) => item.publishedAt!.getFullYear())
    )
  );

  const monthNames = [
    "জানুয়ারি",
    "ফেব্রুয়ারি",
    "মার্চ",
    "এপ্রিল",
    "মে",
    "জুন",
    "জুলাই",
    "আগস্ট",
    "সেপ্টেম্বর",
    "অক্টোবর",
    "নভেম্বর",
    "ডিসেম্বর",
  ];

  function archiveUrl(page: number) {
    const query = new URLSearchParams();

    if (selectedYear !== null) {
      query.set("year", String(selectedYear));
    }

    if (validMonth !== null) {
      query.set("month", String(validMonth));
    }

    if (page > 1) {
      query.set("page", String(page));
    }

    const queryString = query.toString();

    return queryString ? `/archive?${queryString}` : "/archive";
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8 dark:bg-gray-950">
      <div className="container-main mx-auto px-4">

        {/* Header */}
        <div className="mb-8 border-b border-gray-200 pb-6 dark:border-gray-800">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-bold text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
            <span>🗂️</span>
            NEWS ARCHIVE
          </div>

          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white md:text-4xl">
            সংবাদ আর্কাইভ
          </h1>

          <p className="mt-2 text-gray-600 dark:text-gray-400">
            তারিখ ও মাস অনুযায়ী আমাদের পুরোনো সংবাদ খুঁজে পড়ুন।
          </p>
        </div>

        {/* Archive Filter */}
        <div className="mb-8 rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h2 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">
            তারিখ অনুযায়ী সংবাদ খুঁজুন
          </h2>

          <form
            action="/archive"
            method="GET"
            className="grid gap-4 sm:grid-cols-3"
          >
            <div>
              <label
                htmlFor="year"
                className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300"
              >
                বছর নির্বাচন করুন
              </label>

              <select
                id="year"
                name="year"
                defaultValue={selectedYear?.toString() || ""}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-3 text-sm outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              >
                <option value="">সকল বছর</option>

                {availableYears.map((year) => (
                  <option key={year} value={year}>
                    {year.toLocaleString("bn-BD")}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="month"
                className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300"
              >
                মাস নির্বাচন করুন
              </label>

              <select
                id="month"
                name="month"
                defaultValue={validMonth?.toString() || ""}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-3 text-sm outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              >
                <option value="">সকল মাস</option>

                {monthNames.map((month, index) => (
                  <option key={index} value={index + 1}>
                    {month}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end gap-2">
              <button
                type="submit"
                className="flex-1 rounded-lg bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
              >
                সংবাদ খুঁজুন
              </button>

              <Link
                href="/archive"
                className="rounded-lg border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Reset
              </Link>
            </div>
          </form>
        </div>

        {/* Result Information */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              আর্কাইভ সংবাদ
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {selectedYear
                ? `${selectedYear.toLocaleString("bn-BD")} সালের `
                : "সকল বছরের "}
              {validMonth ? `${monthNames[validMonth - 1]} মাসের ` : ""}
              মোট {totalArticles.toLocaleString("bn-BD")} টি সংবাদ
            </p>
          </div>
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

                  <div className="mt-4 border-t border-gray-100 pt-3 text-xs text-gray-500 dark:border-gray-800">
                    {formatDate(article.publishedAt)}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white px-5 py-16 text-center dark:border-gray-700 dark:bg-gray-900">
            <div className="mb-4 text-5xl">🗂️</div>

            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
              এই তারিখে কোনো সংবাদ পাওয়া যায়নি
            </h2>

            <p className="mt-2 text-gray-500">
              অন্য বছর অথবা মাস নির্বাচন করে আবার চেষ্টা করুন।
            </p>

            <Link
              href="/archive"
              className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              সকল সংবাদ দেখুন
            </Link>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
            {currentPage > 1 && (
              <Link
                href={archiveUrl(currentPage - 1)}
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
                href={archiveUrl(currentPage + 1)}
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

export default function ArchivePage(props: PageProps) {
  return (
    <Suspense fallback={<ArchiveLoading />}>
      <ArchiveContent searchParams={props.searchParams} />
    </Suspense>
  );
}
