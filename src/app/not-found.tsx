
import Link from "next/link";
import { Search, Home, ArrowLeft, Newspaper } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-5 py-16">
      <div className="w-full max-w-2xl text-center">

        <div className="mb-8 inline-flex items-center gap-2 text-xl font-extrabold text-slate-900">
          <Newspaper className="text-red-600" size={28} />
          দৈনিক <span className="text-red-600">দিনলিপি</span>
        </div>

        <h1 className="text-8xl font-black tracking-tight text-red-600 sm:text-9xl">
          404
        </h1>

        <h2 className="mt-5 text-2xl font-bold text-slate-900 sm:text-3xl">
          দুঃখিত! পেজটি খুঁজে পাওয়া যায়নি
        </h2>

        <p className="mx-auto mt-4 max-w-lg leading-8 text-slate-500">
          আপনি যে পেজটি খুঁজছেন সেটি সরিয়ে ফেলা হয়েছে,
          ঠিকানা পরিবর্তন হয়েছে অথবা লিংকটি ভুল।
        </p>

        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-7 py-3.5 font-semibold text-white transition hover:bg-red-700"
          >
            <Home size={18} />
            হোমপেজে যান
          </Link>

          <Link
            href="/search"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-7 py-3.5 font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <Search size={18} />
            সংবাদ খুঁজুন
          </Link>
        </div>

        <Link
          href="/latest-news"
          className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-red-600 hover:underline"
        >
          <ArrowLeft size={16} />
          সর্বশেষ সংবাদ দেখুন
        </Link>

      </div>
    </main>
  );
}
