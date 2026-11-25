
"use client";

import Link from "next/link";

export default function ForgotPasswordPage() {
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    alert("Password reset API এখনো সংযুক্ত করা হয়নি।");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-7 shadow-sm sm:p-10">
        <div className="mb-8 text-center">
          <Link href="/" className="text-3xl font-extrabold text-red-600">
            দৈনিক দিনলিপি
          </Link>

          <div className="mx-auto mt-8 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-3xl">
            🔐
          </div>

          <h1 className="mt-5 text-2xl font-bold text-gray-900">
            পাসওয়ার্ড ভুলে গেছেন?
          </h1>

          <p className="mt-3 text-sm leading-6 text-gray-500">
            আপনার অ্যাকাউন্টের সঙ্গে যুক্ত ইমেইল ঠিকানা লিখুন।
            পাসওয়ার্ড রিসেট করার নির্দেশনা পাঠানোর ব্যবস্থা এখানে থাকবে।
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
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

          <button
            type="submit"
            className="w-full rounded-lg bg-red-600 py-3.5 font-bold text-white transition hover:bg-red-700"
          >
            রিসেট নির্দেশনা পাঠান
          </button>
        </form>

        <div className="mt-7 text-center">
          <Link
            href="/login"
            className="text-sm font-semibold text-red-600 hover:underline"
          >
            ← লগইন পেজে ফিরে যান
          </Link>
        </div>
      </div>
    </main>
  );
}
