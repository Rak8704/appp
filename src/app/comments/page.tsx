
"use client";

import Link from "next/link";

export default function MyCommentsPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <section className="bg-slate-900 py-12 text-white">
        <div className="mx-auto max-w-6xl px-4">
          <p className="text-sm font-semibold text-red-400">
            পাঠক অ্যাকাউন্ট
          </p>
          <h1 className="mt-2 text-3xl font-bold">আমার মন্তব্য</h1>
          <p className="mt-2 text-gray-300">
            বিভিন্ন সংবাদে আপনার করা মন্তব্যের তালিকা।
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-7">
          <h2 className="text-xl font-bold text-gray-900">
            মন্তব্যের ইতিহাস
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            আপনার মন্তব্য এবং সেগুলোর অনুমোদনের অবস্থা।
          </p>
        </div>

        <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 text-4xl">
            💬
          </div>

          <h2 className="mt-6 text-xl font-bold text-gray-900">
            এখনো কোনো মন্তব্য নেই
          </h2>

          <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-gray-500">
            কোনো সংবাদে আপনার মতামত প্রকাশ করলে সেই মন্তব্যগুলো
            এখানে দেখা যাবে।
          </p>

          <Link
            href="/latest-news"
            className="mt-7 inline-flex rounded-lg bg-red-600 px-6 py-3 font-semibold text-white hover:bg-red-700"
          >
            সংবাদ পড়ুন ও মন্তব্য করুন
          </Link>
        </div>

        <div className="mt-8 rounded-xl border border-blue-100 bg-blue-50 p-5">
          <h3 className="font-bold text-blue-900">
            মন্তব্য প্রকাশের নিয়ম
          </h3>
          <p className="mt-2 text-sm leading-7 text-blue-800">
            পাঠকের মন্তব্য প্রকাশের আগে সম্পাদকীয় নীতিমালা অনুযায়ী
            যাচাই করা হতে পারে। অশালীন, বিদ্বেষমূলক বা বিভ্রান্তিকর
            মন্তব্য প্রকাশ করা হবে না।
          </p>
          <Link
            href="/editorial-policy"
            className="mt-3 inline-block text-sm font-semibold text-blue-700 hover:underline"
          >
            সম্পাদকীয় নীতিমালা পড়ুন →
          </Link>
        </div>
      </section>
    </main>
  );
}
