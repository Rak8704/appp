
"use client";

import Link from "next/link";
import { useState } from "react";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    alert("Registration API এখনো সংযুক্ত করা হয়নি।");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-10">
        <div className="mb-8 text-center">
          <Link href="/" className="text-3xl font-extrabold text-red-600">
            দৈনিক দিনলিপি
          </Link>
          <h1 className="mt-6 text-2xl font-bold text-gray-900">
            নতুন অ্যাকাউন্ট তৈরি করুন
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            আমাদের সঙ্গে যুক্ত হয়ে নিয়মিত সংবাদ পড়ুন।
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              আপনার নাম
            </label>
            <input
              type="text"
              required
              placeholder="সম্পূর্ণ নাম লিখুন"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              ইমেইল ঠিকানা
            </label>
            <input
              type="email"
              required
              placeholder="example@email.com"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              পাসওয়ার্ড
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                minLength={8}
                placeholder="কমপক্ষে ৮ অক্ষরের পাসওয়ার্ড"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-20 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-sm font-semibold text-gray-500"
              >
                {showPassword ? "লুকান" : "দেখুন"}
              </button>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              পাসওয়ার্ড নিশ্চিত করুন
            </label>
            <input
              type="password"
              required
              minLength={8}
              placeholder="আবার পাসওয়ার্ড লিখুন"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
            />
          </div>

          <label className="flex items-start gap-2 text-sm text-gray-600">
            <input type="checkbox" required className="mt-1 accent-red-600" />
            <span>
              আমি <Link href="/terms" className="text-red-600 hover:underline">ব্যবহারের শর্তাবলি</Link> এবং{" "}
              <Link href="/privacy-policy" className="text-red-600 hover:underline">গোপনীয়তা নীতি</Link> মেনে নিচ্ছি।
            </span>
          </label>

          <button
            type="submit"
            className="w-full rounded-lg bg-red-600 py-3.5 font-bold text-white transition hover:bg-red-700"
          >
            অ্যাকাউন্ট তৈরি করুন
          </button>
        </form>

        <p className="mt-7 text-center text-sm text-gray-600">
          আগে থেকেই অ্যাকাউন্ট আছে?{" "}
          <Link href="/login" className="font-bold text-red-600 hover:underline">
            লগইন করুন
          </Link>
        </p>
      </div>
    </main>
  );
}
