
"use client";

import Link from "next/link";

export default function SavedNewsPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <section className="bg-slate-900 py-12 text-white">
        <div className="mx-auto max-w-6xl px-4">
          <p className="text-sm font-semibold text-red-400">
            পাঠক অ্যাকাউন্ট
          </p>
          <h1 className="mt-2 text-3xl font-bold">সংরক্ষিত সংবাদ</h1>
          <p className="mt-2 text-gray-300">
            পরে পড়ার জন্য সংরক্ষণ করা সংবাদগুলো এখানে পাবেন।
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-7 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              আমার বুকমার্ক
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              আপনার পছন্দের সংবাদ এক জায়গায়।
            </p>
          </div>

          <Link
            href="/"
            className="rounded-lg bg-red-600 px-5 py-3 text-sm font-semibold text-white hover:bg-red-700"
          >
            সংবাদ পড়ুন →
          </Link>
        </div>

        <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-50 text-4xl">
            🔖
          </div>

          <h2 className="mt-6 text-xl font-bold text-gray-900">
            এখনো কোনো সংবাদ সংরক্ষণ করা হয়নি
          </h2>

          <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-gray-500">
            গুরুত্বপূর্ণ সংবাদ পড়ার সময় বুকমার্ক অপশন ব্যবহার করে
            সংরক্ষণ করুন। পরে যেকোনো সময় এখান থেকে পড়তে পারবেন।
          </p>

          <Link
            href="/latest-news"
            className="mt-7 inline-flex rounded-lg bg-red-600 px-6 py-3 font-semibold text-white hover:bg-red-700"
          >
            সর্বশেষ সংবাদ দেখুন
          </Link>
        </div>
      </section>
    </main>
  );
}
