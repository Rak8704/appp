
import Link from "next/link";
import { FileSearch, ArrowLeft, Newspaper, Search } from "lucide-react";

export default function SpecialReportsPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="bg-slate-950 px-5 py-16 text-white">
        <div className="mx-auto max-w-7xl">
          <Link href="/" className="mb-7 inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white">
            <ArrowLeft size={16} /> হোমপেজ
          </Link>

          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-600">
              <FileSearch size={30} />
            </div>
            <div>
              <p className="text-sm font-semibold text-red-400">SPECIAL REPORTS</p>
              <h1 className="text-3xl font-extrabold sm:text-4xl">বিশেষ প্রতিবেদন</h1>
            </div>
          </div>

          <p className="mt-5 max-w-2xl leading-8 text-slate-300">
            অনুসন্ধানী সাংবাদিকতা, গভীর বিশ্লেষণ ও গুরুত্বপূর্ণ ঘটনার বিস্তারিত প্রতিবেদন।
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">বিশেষ প্রতিবেদনসমূহ</h2>
          <Link href="/search" className="flex items-center gap-2 text-sm font-semibold text-red-600 hover:underline">
            <Search size={16} /> খুঁজুন
          </Link>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-6 py-16 text-center">
          <Newspaper className="mx-auto mb-5 text-slate-300" size={52} />
          <h3 className="text-xl font-bold text-slate-800">প্রতিবেদন প্রকাশের অপেক্ষায়</h3>
          <p className="mx-auto mt-3 max-w-lg leading-7 text-slate-500">
            আমাদের বিশেষ প্রতিবেদনগুলো প্রকাশিত হলে এখানে বিস্তারিতভাবে পড়তে পারবেন।
          </p>
          <Link href="/latest-news" className="mt-6 inline-flex rounded-xl bg-red-600 px-6 py-3 font-semibold text-white hover:bg-red-700">
            সর্বশেষ সংবাদ
          </Link>
        </div>
      </section>
    </main>
  );
}
