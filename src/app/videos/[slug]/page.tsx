
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { connection } from "next/server";
import { prisma } from "@/lib/prisma";

function getYouTubeId(content: string) {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtube\.com\/watch\/\?v=)([a-zA-Z0-9_-]{11})/,
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
    /youtube-nocookie\.com\/embed\/([a-zA-Z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = content.match(pattern);

    if (match) {
      return match[1];
    }
  }

  return null;
}

function Loading() {
  return (
    <div className="py-20 text-center text-gray-500">
      ভিডিও লোড হচ্ছে...
    </div>
  );
}

async function VideoContent({ slug }: { slug: string }) {
  await connection();

  const article = await prisma.article.findFirst({
    where: {
      slug,
      status: "PUBLISHED",
      publishedAt: { not: null },
    },
    include: {
      author: true,
      category: true,
    },
  });

  if (!article) {
    notFound();
  }

  const videoId = getYouTubeId(article.content);

  if (!videoId) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="bg-slate-950 px-4 py-12 text-white">
        <div className="mx-auto max-w-6xl">
          <Link
            href="/videos"
            className="mb-6 inline-block text-sm text-gray-300 hover:text-white"
          >
            ← সকল ভিডিও
          </Link>

          <p className="mb-3 text-sm font-semibold text-red-400">
            ভিডিও সংবাদ
          </p>

          <h1 className="max-w-4xl text-2xl font-bold leading-relaxed md:text-4xl">
            {article.title}
          </h1>

          <div className="mt-5 flex flex-wrap gap-4 text-sm text-gray-300">
            <span>লেখক: {article.author.name}</span>
            <span>বিভাগ: {article.category.name}</span>

            <span>
              {article.publishedAt?.toLocaleDateString("bn-BD", {
                day: "numeric",
                month: "long",
                year: "numeric",
                timeZone: "Asia/Dhaka",
              })}
            </span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="overflow-hidden rounded-2xl bg-black shadow-xl">
          <div className="aspect-video w-full">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${videoId}`}
              title={article.title}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
        </div>

        {article.excerpt && (
          <div className="mt-8 rounded-2xl border border-gray-100 bg-white p-6">
            <h2 className="mb-3 text-xl font-bold text-gray-900">
              ভিডিও সম্পর্কে
            </h2>

            <p className="leading-8 text-gray-600">
              {article.excerpt}
            </p>
          </div>
        )}

        <div className="mt-8 rounded-2xl border border-gray-100 bg-white p-6">
          <h2 className="text-xl font-bold text-gray-900">
            সম্পূর্ণ সংবাদ পড়ুন
          </h2>

          <p className="mt-2 text-gray-500">
            এই ভিডিওর সঙ্গে সম্পর্কিত সম্পূর্ণ প্রতিবেদনটি পড়তে নিচের
            বাটনে ক্লিক করুন।
          </p>

          <Link
            href={`/news/${article.slug}`}
            className="mt-5 inline-flex rounded-lg bg-red-600 px-6 py-3 font-semibold text-white hover:bg-red-700"
          >
            সম্পূর্ণ সংবাদ পড়ুন →
          </Link>
        </div>
      </section>
    </main>
  );
}

export default async function VideoDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <Suspense fallback={<Loading />}>
      <VideoContent slug={slug} />
    </Suspense>
  );
}
