
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

type Props = {
  params: Promise<{ slug: string }>;
};

async function getArticle(slug: string) {
  return prisma.article.findFirst({
    where: {
      slug,
      status: "PUBLISHED",
      publishedAt: {
        lte: new Date(),
      },
    },
    include: {
      category: true,
      author: true,
    },
  });
}

// SEO Metadata
export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    return {
      title: "সংবাদ পাওয়া যায়নি | দৈনিক দিনলিপি",
    };
  }

  return {
    title: `${article.title} | দৈনিক দিনলিপি`,
    description: article.excerpt || article.title,
    openGraph: {
      title: article.title,
      description: article.excerpt || article.title,
      images: article.coverImage ? [article.coverImage] : [],
    },
  };
}

export default async function NewsDetailsPage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    notFound();
  }

  // Increase news view count
  await prisma.article.update({
    where: {
      id: article.id,
    },
    data: {
      viewCount: {
        increment: 1,
      },
    },
  });

  // Related News
  const relatedNews = article.categoryId
    ? await prisma.article.findMany({
        where: {
          categoryId: article.categoryId,
          id: {
            not: article.id,
          },
          status: "PUBLISHED",
          publishedAt: {
            lte: new Date(),
          },
        },
        orderBy: {
          publishedAt: "desc",
        },
        take: 4,
        include: {
          category: true,
        },
      })
    : [];

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const articleUrl = `${siteUrl}/news/${article.slug}`;

  const formattedDate = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString("bn-BD", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="container-main mx-auto max-w-7xl px-4 py-8">

        {/* Breadcrumb */}
        <div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-red-600">
            প্রচ্ছদ
          </Link>

          <span>/</span>

          <Link
            href={`/category/${article.category.slug}`}
            className="hover:text-red-600"
          >
            {article.category.name}
          </Link>

          <span>/</span>

          <span className="text-gray-700 dark:text-gray-300">
            সংবাদ
          </span>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">

          {/* Main Article */}
          <article className="lg:col-span-2">

            <div className="rounded-xl bg-white p-5 shadow-sm dark:bg-gray-900 md:p-8">

              {/* Category */}
              <Link
                href={`/category/${article.category.slug}`}
                className="mb-4 inline-block rounded-md bg-red-600 px-3 py-1 text-sm font-semibold text-white"
              >
                {article.category.name}
              </Link>

              {/* Title */}
              <h1 className="mb-5 text-2xl font-bold leading-relaxed text-gray-900 dark:text-white md:text-4xl">
                {article.title}
              </h1>

              {/* Excerpt */}
              {article.excerpt && (
                <p className="mb-6 border-l-4 border-red-600 pl-4 text-lg leading-relaxed text-gray-600 dark:text-gray-300">
                  {article.excerpt}
                </p>
              )}

              {/* Author and Date */}
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-y border-gray-200 py-4 text-sm text-gray-500 dark:border-gray-700">

                <div>
                  <span className="font-semibold text-gray-800 dark:text-gray-200">
                    প্রতিবেদক:
                  </span>{" "}
                  {article.author?.name || "দৈনিক দিনলিপি"}
                </div>

                <div>
                  {formattedDate}
                </div>

                <div>
                  <span className="font-semibold">
                    পাঠক:
                  </span>{" "}
                  {article.viewCount + 1}
                </div>

              </div>

              {/* Cover Image */}
              {article.coverImage && (
                <div className="mb-8 overflow-hidden rounded-xl">
                  <img
                    src={article.coverImage}
                    alt={article.title}
                    className="h-auto max-h-[550px] w-full object-cover"
                  />
                </div>
              )}

              {/* Share Buttons */}
              <div className="mb-8 flex flex-wrap items-center gap-3 border-b border-gray-200 pb-6 dark:border-gray-700">

                <span className="font-semibold text-gray-700 dark:text-gray-300">
                  শেয়ার করুন:
                </span>

                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(articleUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Facebook
                </a>

                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(article.title + " " + articleUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
                >
                  WhatsApp
                </a>

                <a
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(articleUrl)}&text=${encodeURIComponent(article.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg bg-gray-800 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-900"
                >
                  X
                </a>

              </div>

              {/* Article Content */}
              <div className="whitespace-pre-wrap break-words text-lg leading-9 text-gray-800 dark:text-gray-200">
                {article.content}
              </div>

            </div>

          </article>

          {/* Sidebar */}
          <aside className="space-y-6">

            <div className="rounded-xl bg-white p-5 shadow-sm dark:bg-gray-900">

              <h2 className="mb-5 border-b-2 border-red-600 pb-3 text-xl font-bold text-gray-900 dark:text-white">
                সম্পর্কিত সংবাদ
              </h2>

              {relatedNews.length > 0 ? (
                <div className="space-y-5">
                  {relatedNews.map((news) => (
                    <Link
                      key={news.id}
                      href={`/news/${news.slug}`}
                      className="group flex gap-3"
                    >
                      {news.coverImage && (
                        <img
                          src={news.coverImage}
                          alt={news.title}
                          className="h-20 w-24 shrink-0 rounded-lg object-cover"
                        />
                      )}

                      <div>
                        <h3 className="line-clamp-3 font-semibold leading-6 text-gray-800 group-hover:text-red-600 dark:text-gray-200">
                          {news.title}
                        </h3>

                        <p className="mt-2 text-xs text-gray-500">
                          {news.category.name}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  এখনো সম্পর্কিত সংবাদ পাওয়া যায়নি।
                </p>
              )}

            </div>

            <div className="rounded-xl bg-white p-5 shadow-sm dark:bg-gray-900">
              <h2 className="mb-3 text-xl font-bold text-gray-900 dark:text-white">
                দৈনিক দিনলিপি
              </h2>

              <p className="text-sm leading-7 text-gray-600 dark:text-gray-400">
                সর্বশেষ সংবাদ, গুরুত্বপূর্ণ আপডেট এবং নির্ভরযোগ্য তথ্যের জন্য
                আমাদের সাথেই থাকুন।
              </p>

              <Link
                href="/"
                className="mt-4 inline-block rounded-lg bg-red-600 px-5 py-2 text-sm font-semibold text-white hover:bg-red-700"
              >
                প্রচ্ছদে ফিরে যান
              </Link>
            </div>

          </aside>

        </div>
      </div>
    </main>
  );
}
