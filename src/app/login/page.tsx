
"use client";

import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 dark:bg-gray-950">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-block text-3xl font-black text-gray-900 dark:text-white">
            দৈনিক <span className="text-red-600">দিনলিপি</span>
          </Link>
          <p className="mt-3 text-sm text-gray-500">
            আপনার অ্যাকাউন্টে লগইন করুন
          </p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xl dark:border-gray-800 dark:bg-gray-900 sm:p-8">
          <div className="mb-7">
            <h1 className="text-2xl font-black text-gray-900 dark:text-white">
              স্বাগতম!
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              দৈনিক দিনলিপির পাঠক অ্যাকাউন্টে প্রবেশ করুন।
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert("Login API এখনো সংযুক্ত করা হয়নি।");
            }}
            className="space-y-5"
          >
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                ইমেইল ঠিকানা
              </label>
              <input
                id="email"
                type="email"
                required
                placeholder="আপনার ইমেইল লিখুন"
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div>
              <div className="mb-2 flex justify-between">
                <label htmlFor="password" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  পাসওয়ার্ড
                </label>
                <Link href="/forgot-password" className="text-xs font-semibold text-red-600 hover:underline">
                  পাসওয়ার্ড ভুলে গেছেন?
                </Link>
              </div>

              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="আপনার পাসওয়ার্ড লিখুন"
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 pr-16 text-sm outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-red-600"
                >
                  {showPassword ? "লুকান" : "দেখুন"}
                </button>
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <input type="checkbox" className="h-4 w-4 accent-red-600" />
              আমাকে লগইন অবস্থায় রাখুন
            </label>

            <button
              type="submit"
              className="w-full rounded-xl bg-red-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-red-600/20 transition hover:bg-red-700"
            >
              লগইন করুন →
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
            <span className="text-xs text-gray-400">অথবা</span>
            <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
          </div>

          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            নতুন পাঠক?
            <Link href="/register" className="ml-2 font-bold text-red-600 hover:underline">
              অ্যাকাউন্ট তৈরি করুন
            </Link>
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-gray-500">
          <Link href="/" className="hover:text-red-600">
            ← প্রচ্ছদে ফিরে যান
          </Link>
        </p>
      </div>
    </main>
  );
}
