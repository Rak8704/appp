
import Link from "next/link";
import { Suspense } from "react";
import { connection } from "next/server";
import { prisma } from "@/lib/prisma";

function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 text-center text-gray-500">
      লেখকদের তথ্য লোড হচ্ছে...
    </div>
  );
}

async function AuthorsContent() {
  await connection();

  const authors = await prisma.user.findMany({
    where: {
      isActive: true,
      role: {
        in: ["EDITOR", "REPORTER"],
      },
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
      <section className="bg-slate-900 px-4 py-16 text-center text-white">
        <div className="mx-auto max-w-7xl">
          <p className="mb-3 text-sm font-semibold text-red-400">
            দৈনিক দিনলিপি
          </p>
          <h1 className="text-3xl font-bold md:text-5xl">
            আমাদের লেখকবৃন্দ
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-gray-300">
            আমাদের সংবাদ ও প্রতিবেদন তৈরিতে যুক্ত লেখক, সম্পাদক
            এবং সাংবাদিকদের সঙ্গে পরিচিত হোন।
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-2xl font-bold text-gray-900">
            সকল লেখক
          </h2>
          <span className="rounded-full bg-red-50 px-4 py-2 text-sm font-semibold text-red-600">
            মোট {authors.length} জন
          </span>
        </div>

        {authors.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white py-16 text-center">
            <div className="mb-3 text-5xl">✍️</div>
            <h3 className="text-xl font-bold text-gray-800">
              কোনো লেখক পাওয়া যায়নি
            </h3>
            <p className="mt-2 text-gray-500">
              লেখকদের তথ্য যুক্ত হলে এখানে দেখা যাবে।
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {authors.map((author) => (
              <Link
                key={author.id}
                href={`/author/${author.id}`}
                className="group rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-gray-100 text-3xl font-bold text-gray-500">
                  {author.avatar ? (
                    <img
                      src={author.avatar}
                      alt={author.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    author.name?.charAt(0) || "ল"
                  )}
                </div>

                <h3 className="text-lg font-bold text-gray-900 group-hover:text-red-600">
                  {author.name}
                </h3>

                <p className="mt-1 text-sm text-red-600">
                  {author.role === "EDITOR" ? "সম্পাদক" : "লেখক ও সাংবাদিক"}
                </p>

                <p className="mt-3 line-clamp-3 min-h-12 text-sm leading-6 text-gray-500">
                  {author.bio || "দৈনিক দিনলিপির একজন নিয়মিত লেখক।"}
                </p>

                <div className="mt-5 border-t border-gray-100 pt-4">
                  <span className="text-sm font-semibold text-gray-700">
                    প্রকাশিত সংবাদ: {author._count.articles}
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

export default function AuthorsPage() {
  return (
    <Suspense fallback={<Loading />}>
      <AuthorsContent />
    </Suspense>
  );
}
