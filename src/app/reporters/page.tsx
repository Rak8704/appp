
import Link from "next/link";
import { Suspense } from "react";
import { connection } from "next/server";
import { prisma } from "@/lib/prisma";

function Loading() {
  return (
    <div className="py-16 text-center text-gray-500">
      সাংবাদিকদের তথ্য লোড হচ্ছে...
    </div>
  );
}

async function ReportersContent() {
  await connection();

  const reporters = await prisma.user.findMany({
    where: {
      role: "REPORTER",
      isActive: true,
      articles: {
        some: {
          status: "PUBLISHED",
          publishedAt: { not: null },
        },
      },
    },
    orderBy: {
      name: "asc",
    },
    include: {
      _count: {
        select: {
          articles: {
            where: {
              status: "PUBLISHED",
              publishedAt: { not: null },
            },
          },
        },
      },
    },
  });

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="bg-red-700 px-4 py-16 text-center text-white">
        <div className="mx-auto max-w-7xl">
          <p className="mb-3 text-sm font-semibold text-red-100">
            দৈনিক দিনলিপি
          </p>
          <h1 className="text-3xl font-bold md:text-5xl">
            আমাদের সংবাদকর্মী
          </h1>
          <p className="mx-auto mt-4 max-w-2xl leading-7 text-red-100">
            দেশের বিভিন্ন প্রান্ত থেকে সংবাদ সংগ্রহ ও পরিবেশনায়
            নিয়োজিত আমাদের সাংবাদিকদের পরিচিতি।
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-2xl font-bold text-gray-900">
            সকল সাংবাদিক
          </h2>
          <span className="rounded-full bg-red-50 px-4 py-2 text-sm font-semibold text-red-600">
            মোট {reporters.length} জন
          </span>
        </div>

        {reporters.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white py-16 text-center">
            <div className="mb-3 text-5xl">📰</div>
            <h3 className="text-xl font-bold text-gray-800">
              কোনো সাংবাদিক পাওয়া যায়নি
            </h3>
            <p className="mt-2 text-gray-500">
              সক্রিয় সাংবাদিকদের প্রকাশিত সংবাদ যুক্ত হলে এখানে দেখা যাবে।
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {reporters.map((reporter) => (
              <Link
                key={reporter.id}
                href={`/author/${reporter.id}`}
                className="group rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-red-50 text-3xl font-bold text-red-600">
                  {reporter.avatar ? (
                    <img
                      src={reporter.avatar}
                      alt={reporter.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    reporter.name?.charAt(0) || "স"
                  )}
                </div>

                <h3 className="text-lg font-bold text-gray-900 group-hover:text-red-600">
                  {reporter.name}
                </h3>

                <p className="mt-1 text-sm font-medium text-red-600">
                  সংবাদদাতা
                </p>

                <p className="mt-3 line-clamp-3 min-h-12 text-sm leading-6 text-gray-500">
                  {reporter.bio || "দৈনিক দিনলিপির একজন সংবাদকর্মী।"}
                </p>

                <div className="mt-5 border-t border-gray-100 pt-4">
                  <span className="text-sm font-semibold text-gray-700">
                    প্রকাশিত সংবাদ: {reporter._count.articles}
                  </span>
                </div>

                <div className="mt-4 inline-flex rounded-lg bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 group-hover:bg-red-600 group-hover:text-white">
                  প্রোফাইল দেখুন →
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default function ReportersPage() {
  return (
    <Suspense fallback={<Loading />}>
      <ReportersContent />
    </Suspense>
  );
}
