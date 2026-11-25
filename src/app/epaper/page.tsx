
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { connection } from "next/server";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "ই-পেপার | দৈনিক দিনলিপি",
  description: "দৈনিক দিনলিপির প্রকাশিত ই-পেপার পড়ুন।",
};

async function EpaperContent() {
  await connection();

  const now = new Date();

  const papers = await prisma.epaper.findMany({
    where: {
      publishedAt: { lte: now },
    },
    orderBy: {
      publishedAt: "desc",
    },
    take: 30,
  });

  return (
    <main className="min-h-screen bg-gray-50 py-10 dark:bg-gray-950">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-8">
          <div className="mb-3 text-sm text-gray-500">
            <Link href="/" className="hover:text-red-600">প্রচ্ছদ</Link>
            <span className="mx-2">/</span>
            <span className="text-red-600">ই-পেপার</span>
          </div>

          <div className="flex flex-col justify-between gap-4 border-b border-gray-200 pb-5 sm:flex-row sm:items-end dark:border-gray-800">
            <div>
              <span className="text-sm font-bold text-red-600">DIGITAL NEWSPAPER</span>
              <h1 className="mt-2 text-3xl font-black text-gray-900 dark:text-white">
                আজকের ই-পেপার
              </h1>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                পত্রিকার ডিজিটাল সংস্করণ পড়ুন যেকোনো সময়, যেকোনো জায়গা থেকে।
              </p>
            </div>
            <span className="rounded-full bg-red-50 px-4 py-2 text-sm font-bold text-red-600 dark:bg-red-950/30">
              মোট সংখ্যা: {papers.length}
            </span>
          </div>
        </div>

        {papers.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white py-20 text-center dark:border-gray-700 dark:bg-gray-900">
            <div className="text-6xl">📰</div>
            <h2 className="mt-5 text-xl font-bold text-gray-900 dark:text-white">
              এখনো কোনো ই-পেপার প্রকাশিত হয়নি
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              নতুন ই-পেপার প্রকাশিত হলে এখানে পাওয়া যাবে।
            </p>
            <Link href="/" className="mt-6 inline-block rounded-lg bg-red-600 px-5 py-3 text-sm font-bold text-white">
              প্রচ্ছদে ফিরে যান
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {papers.map((paper) => (
              <article key={paper.id} className="overflow-hidden rounded-2xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:bg-gray-900">
                <Link href={`/epaper/${paper.slug}`}>
                  <div className="flex h-64 items-center justify-center overflow-hidden bg-gray-100 dark:bg-gray-800">
                    {paper.coverImage ? (
                      <img
                        src={paper.coverImage}
                        alt={paper.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="text-center">
                        <div className="text-6xl">📰</div>
                        <p className="mt-3 text-sm text-gray-500">ই-পেপার</p>
                      </div>
                    )}
                  </div>
                </Link>

                <div className="p-5">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                    {paper.title}
                  </h2>

                  <p className="mt-2 text-xs text-gray-500">
                    {new Date(
  paper.publishedAt ?? paper.editionDate
).toLocaleDateString("bn-BD", {
  day: "numeric",
  month: "long",
  year: "numeric",
})}
                  </p>

                  <Link
                    href={`/epaper/${paper.slug}`}
                    className="mt-5 block rounded-lg bg-red-600 px-4 py-3 text-center text-sm font-bold text-white hover:bg-red-700"
                  >
                    ই-পেপার পড়ুন →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

function Loading() {
  return (
    <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="h-80 animate-pulse rounded-2xl bg-gray-200 dark:bg-gray-800" />
      ))}
    </div>
  );
}

export default function EpaperPage() {
  return (
    <Suspense fallback={<Loading />}>
      <EpaperContent />
    </Suspense>
  );
}
