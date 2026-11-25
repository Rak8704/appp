
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { connection } from "next/server";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "ছবির গ্যালারি | দৈনিক দিনলিপি",
  description: "দৈনিক দিনলিপির সংবাদ, ঘটনা ও বিশেষ মুহূর্তের ছবির গ্যালারি।",
};

async function GalleryContent() {
  await connection();

  const now = new Date();

  const images = await prisma.article.findMany({
    where: {
      status: "PUBLISHED",
      publishedAt: { lte: now },
      coverImage: { not: null },
    },
    orderBy: { publishedAt: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      coverImage: true,
      excerpt: true,
      publishedAt: true,
      category: {
        select: { name: true, slug: true },
      },
    },
    take: 48,
  });

  return (
    <main className="min-h-screen bg-gray-50 py-10 dark:bg-gray-950">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-8">
          <div className="mb-3 text-sm text-gray-500">
            <Link href="/" className="hover:text-red-600">প্রচ্ছদ</Link>
            <span className="mx-2">/</span>
            <span className="text-red-600">ছবির গ্যালারি</span>
          </div>

          <div className="flex flex-col justify-between gap-3 border-b border-gray-200 pb-5 dark:border-gray-800 sm:flex-row sm:items-end">
            <div>
              <span className="text-sm font-bold text-red-600">PHOTO GALLERY</span>
              <h1 className="mt-2 text-3xl font-black text-gray-900 dark:text-white">
                ছবির গ্যালারি
              </h1>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                সংবাদ ও ঘটনাপ্রবাহের গুরুত্বপূর্ণ মুহূর্তগুলো ছবিতে দেখুন।
              </p>
            </div>
            <span className="text-sm text-gray-500">
              মোট ছবি: {images.length}টি
            </span>
          </div>
        </div>

        {images.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white py-20 text-center dark:border-gray-700 dark:bg-gray-900">
            <div className="text-5xl">📷</div>
            <h2 className="mt-4 text-xl font-bold text-gray-800 dark:text-white">
              এখনো কোনো ছবি প্রকাশিত হয়নি
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              নতুন ছবি প্রকাশিত হলে এখানে দেখা যাবে।
            </p>
            <Link href="/" className="mt-6 inline-block rounded-lg bg-red-600 px-5 py-3 text-sm font-bold text-white hover:bg-red-700">
              প্রচ্ছদে ফিরে যান
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {images.map((item) => (
              <Link
                key={item.id}
                href={`/gallery/${item.slug}`}
                className="group overflow-hidden rounded-2xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:bg-gray-900"
              >
                <div className="relative h-64 overflow-hidden bg-gray-200 dark:bg-gray-800">
                  {item.coverImage && (
                    <img
                      src={item.coverImage}
                      alt={item.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                    />
                  )}
                  <span className="absolute left-3 top-3 rounded-full bg-black/70 px-3 py-1 text-xs font-semibold text-white">
                    📷 ছবি
                  </span>
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 pt-14">
                    <span className="text-xs font-semibold text-red-300">
                      {item.category.name}
                    </span>
                    <h2 className="mt-1 line-clamp-2 text-lg font-bold leading-7 text-white">
                      {item.title}
                    </h2>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 p-4">
                  <span className="text-xs text-gray-500">
                    {item.publishedAt
                      ? new Date(item.publishedAt).toLocaleDateString("bn-BD")
                      : ""}
                  </span>
                  <span className="text-sm font-bold text-red-600 group-hover:underline">
                    বিস্তারিত দেখুন →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

function GalleryLoading() {
  return (
    <div className="mx-auto grid max-w-7xl grid-cols-1 gap-5 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="h-72 animate-pulse rounded-2xl bg-gray-200 dark:bg-gray-800" />
      ))}
    </div>
  );
}

export default function GalleryPage() {
  return (
    <Suspense fallback={<GalleryLoading />}>
      <GalleryContent />
    </Suspense>
  );
}
