
import Link from "next/link";
import { Suspense } from "react";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

function EpaperDetailsLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 text-center">
      <p className="text-gray-500">ই-পেপার লোড হচ্ছে...</p>
    </div>
  );
}

async function EpaperDetailsContent({
  slug,
}: {
  slug: string;
}) {
  await connection();

  const epaper = await prisma.epaper.findFirst({
    where: {
      OR: [
        { id: slug },
        { slug: slug },
      ],
      isPublished: true,
    },
    select: {
      id: true,
      title: true,
      slug: true,
      coverImage: true,
      editionDate: true,
      pdfUrl: true,
      publishedAt: true,
    },
  });

  if (!epaper) {
    notFound();
  }

  const displayDate = epaper.publishedAt ?? epaper.editionDate;

  const formattedDate = new Date(displayDate).toLocaleDateString(
    "bn-BD",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="bg-slate-900 py-10 text-white">
        <div className="mx-auto max-w-6xl px-4">
          <Link
            href="/epaper"
            className="mb-5 inline-block text-sm text-gray-300 hover:text-white"
          >
            ← সকল ই-পেপার
          </Link>

          <h1 className="text-2xl font-bold md:text-4xl">
            {epaper.title}
          </h1>

          <p className="mt-3 text-gray-300">
            প্রকাশের তারিখ: {formattedDate}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white p-5">
          <div>
            <h2 className="font-bold text-gray-900">
              {epaper.title}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {formattedDate}
            </p>
          </div>

          <a
            href={epaper.pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            download
            className="rounded-lg bg-red-600 px-5 py-3 font-semibold text-white hover:bg-red-700"
          >
            PDF ডাউনলোড ↓
          </a>
        </div>

        {epaper.coverImage && (
          <div className="mb-8 overflow-hidden rounded-xl bg-white p-3 shadow-sm">
            <img
              src={epaper.coverImage}
              alt={epaper.title}
              className="mx-auto max-h-125 w-auto max-w-full object-contain"
            />
          </div>
        )}

        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 px-5 py-4">
            <h2 className="font-bold text-gray-900">
              সম্পূর্ণ ই-পেপার
            </h2>
          </div>

          <iframe
            src={epaper.pdfUrl}
            title={epaper.title}
            className="h-187.5 w-full"
          />

          <div className="p-4 text-center text-sm text-gray-500">
            PDF দেখতে সমস্যা হলে{" "}
            <a
              href={epaper.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-red-600 hover:underline"
            >
              এখানে ক্লিক করুন
            </a>
            ।
          </div>
        </div>
      </section>
    </main>
  );
}

export default async function EpaperDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <Suspense fallback={<EpaperDetailsLoading />}>
      <EpaperDetailsContent slug={slug} />
    </Suspense>
  );
}
