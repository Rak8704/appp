
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { connection } from "next/server";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "ভিডিও সংবাদ | দৈনিক দিনলিপি",
  description: "দৈনিক দিনলিপির সর্বশেষ ভিডিও সংবাদ ও প্রতিবেদন দেখুন।",
};

function getYoutubeId(content: string) {
  const match = content.match(
    /(?:youtube(?:-nocookie)?\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/
  );

  return match?.[1] || null;
}

async function VideosContent() {
  await connection();

  const now = new Date();

  const articles = await prisma.article.findMany({
    where: {
      status: "PUBLISHED",
      publishedAt: { lte: now },
      OR: [
        {
          content: {
            contains: "youtube.com",
            mode: "insensitive",
          },
        },
        {
          content: {
            contains: "youtu.be",
            mode: "insensitive",
          },
        },
      ],
    },
    orderBy: {
      publishedAt: "desc",
    },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      content: true,
      coverImage: true,
      publishedAt: true,
      viewCount: true,
      category: {
        select: {
          name: true,
          slug: true,
        },
      },
    },
    take: 30,
  });

  const videos = articles
    .map((article) => ({
      ...article,
      youtubeId: getYoutubeId(article.content),
    }))
    .filter((article) => article.youtubeId !== null);

  return (
    <main className="min-h-screen bg-gray-50 py-10 dark:bg-gray-950">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-8">
          <div className="mb-3 text-sm text-gray-500">
            <Link href="/" className="hover:text-red-600">
              প্রচ্ছদ
            </Link>
            <span className="mx-2">/</span>
            <span className="text-red-600">ভিডিও সংবাদ</span>
          </div>

          <div className="flex flex-col justify-between gap-4 border-b border-gray-200 pb-5 dark:border-gray-800 sm:flex-row sm:items-end">
            <div>
              <span className="text-sm font-bold text-red-600">
                DAILY DINLIPI TV
              </span>
              <h1 className="mt-2 text-3xl font-black text-gray-900 dark:text-white">
                ভিডিও সংবাদ
              </h1>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                দেশ-বিদেশের গুরুত্বপূর্ণ ঘটনা দেখুন ভিডিও প্রতিবেদনে।
              </p>
            </div>

            <span className="rounded-full bg-red-50 px-4 py-2 text-sm font-bold text-red-600 dark:bg-red-950/30">
              মোট ভিডিও: {videos.length}টি
            </span>
          </div>
        </div>

        {videos.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-5 py-20 text-center dark:border-gray-700 dark:bg-gray-900">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-50 text-4xl dark:bg-red-950/30">
              ▶️
            </div>

            <h2 className="mt-5 text-xl font-bold text-gray-900 dark:text-white">
              এখনো কোনো ভিডিও প্রকাশিত হয়নি
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-gray-500 dark:text-gray-400">
              নতুন ভিডিও সংবাদ প্রকাশিত হলে এখানে দেখা যাবে। ভিডিও প্রকাশের সময়
              সংবাদটির Content-এর মধ্যে YouTube লিংক যুক্ত করতে হবে।
            </p>

            <Link
              href="/"
              className="mt-6 inline-flex rounded-lg bg-red-600 px-5 py-3 text-sm font-bold text-white hover:bg-red-700"
            >
              প্রচ্ছদে ফিরে যান
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
            {videos.map((video) => (
              <article
                key={video.id}
                className="overflow-hidden rounded-2xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:bg-gray-900"
              >
                <div className="relative aspect-video bg-black">
                  <iframe
                    src={`https://www.youtube.com/embed/${video.youtubeId}`}
                    title={video.title}
                    className="h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                </div>

                <div className="p-5">
                  <Link
                    href={`/category/${video.category.slug}`}
                    className="inline-block rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-600 dark:bg-red-950/30"
                  >
                    {video.category.name}
                  </Link>

                  <Link href={`/news/${video.slug}`}>
                    <h2 className="mt-3 line-clamp-2 text-lg font-bold leading-8 text-gray-900 hover:text-red-600 dark:text-white">
                      {video.title}
                    </h2>
                  </Link>

                  {video.excerpt && (
                    <p className="mt-2 line-clamp-2 text-sm leading-7 text-gray-500 dark:text-gray-400">
                      {video.excerpt}
                    </p>
                  )}

                  <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4 text-xs text-gray-500 dark:border-gray-800">
                    <span>
                      {video.publishedAt
                        ? new Date(video.publishedAt).toLocaleDateString("bn-BD")
                        : ""}
                    </span>
                    <span>👁 {video.viewCount.toLocaleString("bn-BD")} বার দেখা</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

function VideosLoading() {
  return (
    <div className="mx-auto grid max-w-7xl grid-cols-1 gap-7 px-4 py-10 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="animate-pulse overflow-hidden rounded-2xl">
          <div className="aspect-video bg-gray-200 dark:bg-gray-800" />
          <div className="mt-3 h-24 rounded bg-gray-200 dark:bg-gray-800" />
        </div>
      ))}
    </div>
  );
}

export default function VideosPage() {
  return (
    <Suspense fallback={<VideosLoading />}>
      <VideosContent />
    </Suspense>
  );
}
