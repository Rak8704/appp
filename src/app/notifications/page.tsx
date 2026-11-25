
"use client";

import Link from "next/link";

export default function NotificationsPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <section className="bg-slate-900 py-12 text-white">
        <div className="mx-auto max-w-6xl px-4">
          <p className="text-sm font-semibold text-red-400">
            পাঠক অ্যাকাউন্ট
          </p>
          <h1 className="mt-2 text-3xl font-bold">নোটিফিকেশন</h1>
          <p className="mt-2 text-gray-300">
            গুরুত্বপূর্ণ সংবাদ ও আপডেট সম্পর্কে জানুন।
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-7 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              সকল নোটিফিকেশন
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              আপনার জন্য গুরুত্বপূর্ণ আপডেট।
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-amber-50 text-4xl">
            🔔
          </div>

          <h2 className="mt-6 text-xl font-bold text-gray-900">
            নতুন কোনো নোটিফিকেশন নেই
          </h2>

          <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-gray-500">
            ব্রেকিং নিউজ, নতুন সংবাদ এবং গুরুত্বপূর্ণ আপডেটের
            নোটিফিকেশন এখানে দেখা যাবে।
          </p>

          <Link
            href="/breaking-news"
            className="mt-7 inline-flex rounded-lg bg-red-600 px-6 py-3 font-semibold text-white hover:bg-red-700"
          >
            ব্রেকিং নিউজ দেখুন
          </Link>
        </div>

        <div className="mt-8 rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-50 text-xl">
              📰
            </div>
            <div>
              <h3 className="font-bold text-gray-900">
                ব্রেকিং নিউজ আপডেট
              </h3>
              <p className="mt-1 text-sm leading-6 text-gray-500">
                গুরুত্বপূর্ণ সংবাদ প্রকাশিত হলে নোটিফিকেশনের
                মাধ্যমে পাঠকদের জানানো যাবে।
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
