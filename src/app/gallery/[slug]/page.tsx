
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { connection } from "next/server";
import { prisma } from "@/lib/prisma";

type Props = {
  params: Promise<{ slug: string }>;
};

export const metadata: Metadata = {
  title: "ছবির বিস্তারিত | দৈনিক দিনলিপি",
  description: "দৈনিক দিনলিপির ছবির বিস্তারিত দেখুন।",
};

async function GalleryDetailsContent({ params }: Props) {
  await connection();

  const { slug } = await params;
  const now = new Date();

  const article = await prisma.article.findFirst({
    where: {
      slug,
      status: "PUBLISHED",
      publishedAt: { lte: now },
      coverImage: { not: null },
    },
    include: {
      category: true,
      author: true,
    },
  });

  if (!article) {
    notFound();
  }

  const relatedImages = await prisma.article.findMany({
    where: {
      status: "PUBLISHED",
      publishedAt: { lte: now },
      coverImage: { not: null },
      slug: { not: slug },
      categoryId: article.categoryId,
    },
    orderBy: { publishedAt: "desc" },
    take: 4,
    select: {
      id: true,
      title: true,
      slug: true,
      coverImage: true,
    },
  });

  return (
    <main className="min-h-screen bg-gray-50 py-8 dark:bg-gray-950">
      <div className="mx-auto max-w-5xl px-4">
        <div className="mb-6 text-sm text-gray-500">
          <Link href="/" className="hover:text-red-600">প্রচ্ছদ</Link>
          <span className="mx-2">/</span>
          <Link href="/gallery" className="hover:text-red-600">ছবির গ্যালারি</Link>
          <span className="mx-2">/</span>
          <span className="text-red-600">বিস্তারিত</span>
        </div>

        <article className="overflow-hidden rounded-2xl bg-white shadow-sm dark:bg-gray-900">
          <div className="border-b border-gray-100 p-5 dark:border-gray-800 sm:p-8">
            <Link
              href={`/category/${article.category.slug}`}
              className="inline-block rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-600 dark:bg-red-950/30"
            >
              {article.category.name}
            </Link>

            <h1 className="mt-4 text-2xl font-black leading-relaxed text-gray-900 dark:text-white sm:text-4xl">
              {article.title}
            </h1>

            {article.excerpt && (
              <p className="mt-4 text-base leading-8 text-gray-600 dark:text-gray-400">
                {article.excerpt}
              </p>
            )}

            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs text-gray-500">
              <span>✍️ {article.author?.name || "দৈনিক দিনলিপি"}</span>
              <span>
                📅 {article.publishedAt
                  ? new Date(article.publishedAt).toLocaleDateString("bn-BD")
                  : ""}
              </span>
            </div>
          </div>

          {article.coverImage && (
            <figure className="bg-black">
              <img
                src={article.coverImage}
                alt={article.title}
                className="mx-auto max-h-[750px] w-full object-contain"
              />
              <figcaption className="px-5 py-3 text-center text-xs text-gray-400">
                ছবি: দৈনিক দিনলিপি
              </figcaption>
            </figure>
          )}

          <div className="p-5 sm:p-8">
            <h2 className="mb-4 border-l-4 border-red-600 pl-3 text-xl font-bold text-gray-900 dark:text-white">
              ছবির সঙ্গে সংবাদ
            </h2>
            <div className="whitespace-pre-line text-base leading-8 text-gray-700 dark:text-gray-300">
              {article.content.replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ")}
            </div>

            <div className="mt-8 border-t border-gray-100 pt-5 dark:border-gray-800">
              <Link
                href={`/news/${article.slug}`}
                className="inline-flex rounded-lg bg-red-600 px-5 py-3 text-sm font-bold text-white hover:bg-red-700"
              >
                সম্পূর্ণ সংবাদ পড়ুন →
              </Link>
              <Link
                href="/gallery"
                className="ml-3 inline-flex rounded-lg border border-gray-300 px-5 py-3 text-sm font-bold text-gray-700 hover:border-red-600 hover:text-red-600 dark:border-gray-700 dark:text-gray-300"
              >
                ← গ্যালারিতে ফিরুন
              </Link>
            </div>
          </div>
        </article>

        {relatedImages.length > 0 && (
          <section className="mt-12">
            <h2 className="mb-5 text-2xl font-black text-gray-900 dark:text-white">
              আরও ছবির গ্যালারি
            </h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {relatedImages.map((item) => (
                <Link
                  key={item.id}
                  href={`/gallery/${item.slug}`}
                  className="group overflow-hidden rounded-xl bg-white shadow-sm dark:bg-gray-900"
                >
                  {item.coverImage && (
                    <img
                      src={item.coverImage}
                      alt={item.title}
                      className="h-36 w-full object-cover transition group-hover:scale-105"
                    />
                  )}
                  <h3 className="line-clamp-2 p-3 text-sm font-bold leading-6 text-gray-800 group-hover:text-red-600 dark:text-white">
                    {item.title}
                  </h3>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

function DetailsLoading() {
  return (
    <div className="mx-auto max-w-5xl animate-pulse px-4 py-10">
      <div className="h-10 w-2/3 rounded bg-gray-200 dark:bg-gray-800" />
      <div className="mt-6 h-[450px] rounded-2xl bg-gray-200 dark:bg-gray-800" />
      <div className="mt-6 h-32 rounded bg-gray-200 dark:bg-gray-800" />
    </div>
  );
}

export default function GalleryDetailsPage({ params }: Props) {
  return (
    <Suspense fallback={<DetailsLoading />}>
      <GalleryDetailsContent params={params} />
    </Suspense>
  );
}
