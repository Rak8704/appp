import Link from "next/link";
import { Suspense } from "react";
import { connection } from "next/server";
import { prisma } from "../../lib/prisma";

type CategoryNewsPageProps = {
  slug: string;
  title: string;
  subtitle: string;
};

function Loading() {
  return (
    <main className="mx-auto min-h-screen max-w-7xl px-4 py-10">
      <div className="mb-8 h-10 w-64 animate-pulse rounded bg-gray-200" />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="h-52 rounded-xl bg-gray-200" />
            <div className="mt-4 h-5 rounded bg-gray-200" />
            <div className="mt-2 h-4 w-2/3 rounded bg-gray-200" />
          </div>
        ))}
      </div>
    </main>
  );
}

async function CategoryNewsContent({
  slug,
  title,
  subtitle,
}: CategoryNewsPageProps) {
  await connection();

  const category = await prisma.category.findFirst({
    where: {
      slug,
      isActive: true,
    },
  });

  const articles = category
    ? await prisma.article.findMany({
        where: {
          categoryId: category.id,
          status: "PUBLISHED",
          publishedAt: { not: null },
        },
        include: {
          author: {
            select: { name: true },
          },
          category: {
            select: { name: true, slug: true },
          },
        },
        orderBy: {
          publishedAt: "desc",
        },
        take: 24,
      })
    : [];

  const dateFormatter = new Intl.DateTimeFormat("bn-BD", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Dhaka",
  });

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10">
          <div className="mb-3 text-sm text-gray-500">
            <Link href="/" className="hover:text-red-600">
              প্রচ্ছদ
            </Link>
            <span className="mx-2">/</span>
            <span>{title}</span>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
            {title}
          </h1>

          <p className="mt-3 max-w-2xl text-gray-600">{subtitle}</p>

          <div className="mt-5 h-1 w-20 rounded bg-red-600" />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10">
        {!category ? (
          <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-6 text-center">
            <h2 className="text-xl font-semibold text-gray-800">
              এই বিভাগের Category এখনো তৈরি করা হয়নি
            </h2>
            <p className="mt-2 text-gray-600">
              Admin Panel থেকে এই বিভাগের Category তৈরি করে slug হিসেবে{" "}
              <strong>{slug}</strong> ব্যবহার করো।
            </p>
          </div>
        ) : articles.length === 0 ? (
          <div className="rounded-xl border bg-white p-10 text-center">
            <h2 className="text-xl font-semibold text-gray-800">
              এই বিভাগে এখনো কোনো সংবাদ প্রকাশিত হয়নি
            </h2>
            <p className="mt-2 text-gray-500">
              নতুন সংবাদ প্রকাশিত হলে এখানে দেখা যাবে।
            </p>
            <Link
              href="/latest-news"
              className="mt-5 inline-block rounded-lg bg-red-600 px-5 py-2.5 font-medium text-white hover:bg-red-700"
            >
              সর্বশেষ সংবাদ দেখুন
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                সর্বশেষ {title}
              </h2>
              <span className="text-sm text-gray-500">
                মোট {articles.length}টি সংবাদ
              </span>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {articles.map((article) => (
                <article
                  key={article.id}
                  className="overflow-hidden rounded-xl border bg-white transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <Link href={`/news/${article.slug}`}>
                    <div className="aspect-video overflow-hidden bg-gray-200">
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
                    {article.category && (
                      <Link
                        href={`/category/${article.category.slug}`}
                        className="text-sm font-semibold text-red-600 hover:underline"
                      >
                        {article.category.name}
                      </Link>
                    )}

                    <h3 className="mt-2 line-clamp-2 text-lg font-bold leading-7 text-gray-900 hover:text-red-600">
                      <Link href={`/news/${article.slug}`}>
                        {article.title}
                      </Link>
                    </h3>

                    {article.excerpt && (
                      <p className="mt-2 line-clamp-3 text-sm leading-6 text-gray-600">
                        {article.excerpt}
                      </p>
                    )}

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t pt-3 text-xs text-gray-500">
                      <span>{article.author?.name ?? "নিজস্ব প্রতিবেদক"}</span>
                      <span>
                        {article.publishedAt
                          ? dateFormatter.format(article.publishedAt)
                          : ""}
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  );
}

export default function CategoryNewsPage(props: CategoryNewsPageProps) {
  return (
    <Suspense fallback={<Loading />}>
      <CategoryNewsContent {...props} />
    </Suspense>
  );
}