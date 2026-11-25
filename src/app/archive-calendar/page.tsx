
import Link from "next/link";
import { Suspense } from "react";
import { connection } from "next/server";
import { prisma } from "@/lib/prisma";

function getDhakaMonth() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Dhaka",
    year: "numeric",
    month: "2-digit",
  }).format(new Date());
}

function ArchiveLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 text-center">
      সংবাদ লোড হচ্ছে...
    </div>
  );
}

async function ArchiveCalendarContent({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  await connection();

  const params = await searchParams;
  const currentMonth = getDhakaMonth();

  const selectedMonth =
    params.month && /^\d{4}-(0[1-9]|1[0-2])$/.test(params.month)
      ? params.month
      : currentMonth;

  const startDate = new Date(
    `${selectedMonth}-01T00:00:00+06:00`
  );

  const [year, month] = selectedMonth.split("-").map(Number);

  const endDate = new Date(
    `${year}-${String(month + 1 > 12 ? 1 : month + 1).padStart(2, "0")}-01T00:00:00+06:00`
  );

  if (month === 12) {
    endDate.setUTCFullYear(year + 1);
  }

  const articles = await prisma.article.findMany({
    where: {
      status: "PUBLISHED",
      publishedAt: {
        gte: startDate,
        lt: endDate,
      },
    },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      publishedAt: true,
      coverImage: true,
      category: {
        select: {
          name: true,
          slug: true,
        },
      },
    },
    orderBy: {
      publishedAt: "desc",
    },
  });

  const groupedArticles = new Map<string, typeof articles>();

  for (const article of articles) {
    if (!article.publishedAt) continue;

    const dateKey = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Dhaka",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(article.publishedAt);

    const existing = groupedArticles.get(dateKey) || [];
    existing.push(article);
    groupedArticles.set(dateKey, existing);
  }

  const monthLabel = startDate.toLocaleDateString("bn-BD", {
    month: "long",
    year: "numeric",
    timeZone: "Asia/Dhaka",
  });

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="bg-slate-900 py-12 text-white">
        <div className="mx-auto max-w-6xl px-4">
          <p className="text-sm font-semibold text-red-400">
            সংবাদ আর্কাইভ
          </p>
          <h1 className="mt-2 text-3xl font-bold md:text-4xl">
            তারিখ অনুযায়ী সংবাদ
          </h1>
          <p className="mt-3 text-gray-300">
            অতীতের গুরুত্বপূর্ণ সংবাদ খুঁজে নিন সহজেই।
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <form
            action="/archive-calendar"
            method="GET"
            className="flex flex-wrap items-end gap-4"
          >
            <div className="flex-1">
              <label
                htmlFor="month"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                মাস নির্বাচন করুন
              </label>
              <input
                id="month"
                type="month"
                name="month"
                defaultValue={selectedMonth}
                max={currentMonth}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-red-500"
              />
            </div>

            <button
              type="submit"
              className="rounded-lg bg-red-600 px-6 py-3 font-semibold text-white hover:bg-red-700"
            >
              সংবাদ খুঁজুন
            </button>
          </form>
        </div>

        <div className="mb-7 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {monthLabel}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              মোট {articles.length}টি সংবাদ পাওয়া গেছে
            </p>
          </div>

          <Link
            href="/archive"
            className="text-sm font-semibold text-red-600 hover:underline"
          >
            সাধারণ আর্কাইভ →
          </Link>
        </div>

        {groupedArticles.size === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
            <div className="text-5xl">📅</div>
            <h3 className="mt-5 text-xl font-bold text-gray-900">
              এই মাসে কোনো সংবাদ পাওয়া যায়নি
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              অন্য মাস নির্বাচন করে আবার চেষ্টা করুন।
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {Array.from(groupedArticles.entries()).map(
              ([date, dayArticles]) => (
                <div
                  key={date}
                  className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
                >
                  <div className="border-b border-gray-100 bg-gray-50 px-6 py-4">
                    <h3 className="font-bold text-gray-900">
                      {new Date(`${date}T12:00:00+06:00`).toLocaleDateString(
                        "bn-BD",
                        {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                          timeZone: "Asia/Dhaka",
                        }
                      )}
                    </h3>
                    <p className="mt-1 text-xs text-gray-500">
                      {dayArticles.length}টি সংবাদ
                    </p>
                  </div>

                  <div className="divide-y divide-gray-100">
                    {dayArticles.map((article) => (
                      <article
                        key={article.id}
                        className="flex flex-col gap-4 p-5 sm:flex-row"
                      >
                        {article.coverImage && (
                          <Link
                            href={`/news/${article.slug}`}
                            className="h-32 w-full shrink-0 overflow-hidden rounded-lg bg-gray-100 sm:w-44"
                          >
                            <img
                              src={article.coverImage}
                              alt={article.title}
                              className="h-full w-full object-cover"
                            />
                          </Link>
                        )}

                        <div className="flex-1">
                          <Link
                            href={`/category/${article.category.slug}`}
                            className="text-xs font-semibold text-red-600 hover:underline"
                          >
                            {article.category.name}
                          </Link>

                          <h4 className="mt-2 text-lg font-bold text-gray-900 hover:text-red-600">
                            <Link href={`/news/${article.slug}`}>
                              {article.title}
                            </Link>
                          </h4>

                          {article.excerpt && (
                            <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-500">
                              {article.excerpt}
                            </p>
                          )}

                          <p className="mt-3 text-xs text-gray-400">
                            {article.publishedAt?.toLocaleTimeString(
                              "bn-BD",
                              {
                                hour: "numeric",
                                minute: "2-digit",
                                timeZone: "Asia/Dhaka",
                              }
                            )}
                          </p>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </section>
    </main>
  );
}

export default function ArchiveCalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  return (
    <Suspense fallback={<ArchiveLoading />}>
      <ArchiveCalendarContent searchParams={searchParams} />
    </Suspense>
  );
}
