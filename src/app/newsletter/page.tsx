
import Link from "next/link";
import { Mail, ArrowLeft, Bell, ShieldCheck } from "lucide-react";

export default function NewsletterPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="bg-slate-950 px-5 py-16 text-white">
        <div className="mx-auto max-w-4xl text-center">
          <Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white">
            <ArrowLeft size={16} /> হোমপেজে ফিরুন
          </Link>

          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-red-600">
            <Mail size={38} />
          </div>

          <h1 className="text-3xl font-extrabold sm:text-5xl">
            প্রতিদিনের সংবাদ থাকুক আপনার ইনবক্সে
          </h1>

          <p className="mx-auto mt-5 max-w-2xl leading-8 text-slate-300">
            দৈনিক দিনলিপির গুরুত্বপূর্ণ খবর, বিশেষ প্রতিবেদন ও দিনের আলোচিত সংবাদ পেতে আমাদের নিউজলেটারে যুক্ত থাকুন।
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-5 py-14">
        <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-10">
          <h2 className="text-2xl font-bold text-slate-900">
            নিউজলেটারে সাবস্ক্রাইব করুন
          </h2>

          <p className="mt-3 leading-7 text-slate-500">
            আপনার ইমেইল ঠিকানা দিয়ে সাবস্ক্রাইব করুন।
          </p>

          <form action="/api/newsletter" method="POST" className="mt-7 space-y-4">
            <label htmlFor="newsletter-email" className="block text-sm font-semibold text-slate-700">
              ইমেইল ঠিকানা
            </label>

            <input
              id="newsletter-email"
              name="email"
              type="email"
              required
              placeholder="আপনার ইমেইল লিখুন"
              className="w-full rounded-xl border border-slate-300 px-4 py-4 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
            />

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-4 font-bold text-white transition hover:bg-red-700"
            >
              <Mail size={19} />
              সাবস্ক্রাইব করুন
            </button>
          </form>

          <div className="mt-8 grid gap-4 border-t border-slate-100 pt-7 sm:grid-cols-2">
            <div className="flex gap-3">
              <Bell className="shrink-0 text-red-600" />
              <div>
                <h3 className="font-semibold text-slate-800">গুরুত্বপূর্ণ আপডেট</h3>
                <p className="mt-1 text-sm text-slate-500">
                  নির্বাচিত গুরুত্বপূর্ণ খবর।
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <ShieldCheck className="shrink-0 text-red-600" />
              <div>
                <h3 className="font-semibold text-slate-800">আপনার গোপনীয়তা</h3>
                <p className="mt-1 text-sm text-slate-500">
                  আপনার ইমেইল সুরক্ষিত থাকবে।
                </p>
              </div>
            </div>
          </div>

          <p className="mt-6 text-center text-xs leading-6 text-slate-400">
            সাবস্ক্রাইব করার মাধ্যমে আপনি আমাদের
            <Link href="/privacy-policy" className="mx-1 text-red-600 hover:underline">
              গোপনীয়তা নীতি
            </Link>
            মেনে নিচ্ছেন।
          </p>
        </div>
      </section>
    </main>
  );
}
