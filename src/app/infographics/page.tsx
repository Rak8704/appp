
import Link from "next/link";
import { ChartNoAxesColumn, ArrowLeft, ImageIcon, Newspaper } from "lucide-react";

export default function InfographicsPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="bg-slate-950 px-5 py-16 text-white">
        <div className="mx-auto max-w-7xl">
          <Link href="/" className="mb-7 inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white">
            <ArrowLeft size={16} /> হোমপেজ
          </Link>

          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-600">
              <ChartNoAxesColumn size={30} />
            </div>
            <div>
              <p className="text-sm font-semibold text-red-400">INFOGRAPHICS</p>
              <h1 className="text-3xl font-extrabold sm:text-4xl">ইনফোগ্রাফিক</h1>
            </div>
          </div>

          <p className="mt-5 max-w-2xl leading-8 text-slate-300">
            গুরুত্বপূর্ণ তথ্য, পরিসংখ্যান ও সংবাদকে সহজবোধ্য ভিজ্যুয়াল উপস্থাপনায় দেখুন।
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900">সাম্প্রতিক ইনফোগ্রাফিক</h2>
          <p className="mt-2 text-slate-500">তথ্যভিত্তিক ভিজ্যুয়াল সংবাদ ও বিশ্লেষণ।</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center">
          <ImageIcon className="mx-auto mb-5 text-slate-300" size={54} />
          <h3 className="text-xl font-bold text-slate-800">ইনফোগ্রাফিক শিগগিরই প্রকাশিত হবে</h3>
          <p className="mx-auto mt-3 max-w-lg leading-7 text-slate-500">
            নতুন ইনফোগ্রাফিক প্রকাশিত হলে এখানে ছবি ও বিস্তারিত তথ্যসহ দেখা যাবে।
          </p>
          <Link href="/gallery" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-red-600 px-6 py-3 font-semibold text-white hover:bg-red-700">
            <ImageIcon size={18} /> ফটো গ্যালারি
          </Link>
        </div>

        <div className="mt-8 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-6">
          <Newspaper className="shrink-0 text-red-600" size={28} />
          <div>
            <h3 className="font-bold text-slate-900">সংবাদ পড়ুন</h3>
            <Link href="/latest-news" className="mt-1 inline-block text-sm font-semibold text-red-600 hover:underline">
              সর্বশেষ সংবাদ দেখুন
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
