
import Link from "next/link";
import { MessageSquareQuote, ArrowLeft, PenLine, Users } from "lucide-react";

export default function OpinionPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="bg-slate-950 px-5 py-16 text-white">
        <div className="mx-auto max-w-7xl">
          <Link href="/" className="mb-7 inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white">
            <ArrowLeft size={16} /> হোমপেজ
          </Link>

          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-600">
              <MessageSquareQuote size={30} />
            </div>
            <div>
              <p className="text-sm font-semibold text-red-400">OPINION</p>
              <h1 className="text-3xl font-extrabold sm:text-4xl">মতামত</h1>
            </div>
          </div>

          <p className="mt-5 max-w-2xl leading-8 text-slate-300">
            সমসাময়িক ঘটনা, সমাজ, রাজনীতি, অর্থনীতি ও বিভিন্ন বিষয়ে বিশ্লেষণধর্মী মতামত পড়ুন।
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-8">
            <PenLine className="mb-5 text-red-600" size={32} />
            <h2 className="text-xl font-bold text-slate-900">আপনার মতামত প্রকাশ করুন</h2>
            <p className="mt-3 leading-8 text-slate-600">
              গুরুত্বপূর্ণ বিষয় নিয়ে আপনার বিশ্লেষণ, অভিজ্ঞতা ও চিন্তাভাবনা আমাদের সঙ্গে ভাগ করে নিন।
            </p>
            <Link href="/contact" className="mt-6 inline-flex rounded-xl bg-red-600 px-6 py-3 font-semibold text-white hover:bg-red-700">
              লেখা পাঠান
            </Link>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-8">
            <Users className="mb-5 text-red-600" size={32} />
            <h2 className="text-xl font-bold text-slate-900">লেখক ও বিশ্লেষক</h2>
            <p className="mt-3 leading-8 text-slate-600">
              আমাদের লেখক, সাংবাদিক ও মতামত প্রদানকারীদের পরিচিতি দেখুন।
            </p>
            <Link href="/authors" className="mt-6 inline-flex rounded-xl border border-red-600 px-6 py-3 font-semibold text-red-600 hover:bg-red-50">
              লেখক দেখুন
            </Link>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-12 text-center">
          <MessageSquareQuote className="mx-auto mb-4 text-slate-300" size={48} />
          <h2 className="text-xl font-bold text-slate-800">মতামত বিভাগ প্রস্তুত হচ্ছে</h2>
          <p className="mt-3 text-slate-500">
            সম্পাদকীয় যাচাই শেষে মতামত ও বিশ্লেষণধর্মী লেখা এখানে প্রকাশিত হবে।
          </p>
        </div>
      </section>
    </main>
  );
}
