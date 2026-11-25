
import Link from "next/link";
import { Suspense } from "react";
import { connection } from "next/server";
import { Radio, Clock, Newspaper, ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";

async function LiveNewsContent() {
  await connection();

  const articles = await prisma.article.findMany({
    where: {
      status: "PUBLISHED",
      publishedAt: { not: null },
      isBreaking: true,
    },
    orderBy: { publishedAt: "desc" },
    take: 30,
    include: {
      category: true,
      author: true,
    },
  });

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="bg-slate-950 py-12 text-white">
        <div className="mx-auto max-w-7xl px-5">
          <Link href="/" className="mb-6 inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white">
            <ArrowLeft size={16} /> হোমপেজ
          </Link>

          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-600">
              <Radio size={26} />
            </span>
            <div>
              <p className="text-sm font-semibold text-red-400">LIVE NEWS</p>
              <h1 className="text-3xl font-extrabold sm:text-4xl">
                সরাসরি সংবাদ আপডেট
              </h1>
            </div>
          </div>

          <p className="mt-5 max-w-2xl leading-8 text-slate-300">
            দেশ-বিদেশের গুরুত্বপূর্ণ সংবাদ ও সর্বশেষ ব্রেকিং নিউজ এক জায়গায় পড়ুন।
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12">
        <div className="mb-7 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">
            সর্বশেষ ব্রেকিং নিউজ
          </h2>
          <span className="flex items-center gap-2 text-sm text-red-600">
            <span className="h-2 w-2 animate-pulse rounded-full bg-red-600" />
            আপডেট
          </span>
        </div>

        {articles.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white px-5 py-16 text-center">
            <Newspaper className="mx-auto mb-4 text-slate-300" size={48} />
            <h3 className="text-lg font-bold text-slate-800">
              এখনো কোনো ব্রেকিং নিউজ নেই
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              নতুন সংবাদ প্রকাশিত হলে এখানে দেখা যাবে।
            </p>
            <Link href="/latest-news" className="mt-5 inline-block font-semibold text-red-600 hover:underline">
              সর্বশেষ সংবাদ পড়ুন
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {articles.map((article) => (
              <article key={article.id} className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:shadow-md sm:p-6">
                <div className="mb-3 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                  <span className="rounded-full bg-red-50 px-3 py-1 font-bold text-red-600">
                    {article.category.name}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={13} />
                    {article.publishedAt
                      ? new Date(article.publishedAt).toLocaleString("bn-BD")
                      : ""}
                  </span>
                </div>

                <Link href={`/news/${article.slug}`}>
                  <h3 className="text-lg font-bold leading-8 text-slate-900 hover:text-red-600 sm:text-xl">
                    {article.title}
                  </h3>
                </Link>

                {article.excerpt && (
                  <p className="mt-2 line-clamp-2 leading-7 text-slate-600">
                    {article.excerpt}
                  </p>
                )}

                <p className="mt-3 text-xs text-slate-400">
                  প্রতিবেদক: {article.author.name}
                </p>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default function LiveNewsPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">সংবাদ লোড হচ্ছে...</div>}>
      <LiveNewsContent />
    </Suspense>
  );
}
