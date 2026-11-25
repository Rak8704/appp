
import Link from "next/link";
import { FileText, ArrowLeft, Mail, Newspaper } from "lucide-react";

export default function PressReleasePage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="bg-slate-950 px-5 py-14 text-white">
        <div className="mx-auto max-w-7xl px-5">
          <Link href="/" className="mb-6 inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white">
            <ArrowLeft size={16} /> হোমপেজ
          </Link>

          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-600">
              <FileText size={30} />
            </div>
            <div>
              <p className="text-sm font-semibold text-red-400">PRESS & MEDIA</p>
              <h1 className="text-3xl font-extrabold sm:text-4xl">
                প্রেস বিজ্ঞপ্তি
              </h1>
            </div>
          </div>

          <p className="mt-5 max-w-2xl leading-8 text-slate-300">
            দৈনিক দিনলিপির আনুষ্ঠানিক ঘোষণা, মিডিয়া আপডেট ও প্রেস বিজ্ঞপ্তি।
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
              <Newspaper className="mx-auto mb-4 text-slate-300" size={50} />
              <h2 className="text-xl font-bold text-slate-800">
                প্রেস বিজ্ঞপ্তি শিগগিরই প্রকাশিত হবে
              </h2>
              <p className="mt-3 leading-7 text-slate-500">
                আমাদের আনুষ্ঠানিক প্রেস বিজ্ঞপ্তি ও মিডিয়া আপডেট এখানে পাওয়া যাবে।
              </p>
              <Link href="/latest-news" className="mt-6 inline-block rounded-xl bg-red-600 px-6 py-3 font-semibold text-white hover:bg-red-700">
                সর্বশেষ সংবাদ পড়ুন
              </Link>
            </div>
          </div>

          <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6">
            <Mail className="mb-4 text-red-600" size={28} />
            <h2 className="text-lg font-bold text-slate-900">
              মিডিয়া যোগাযোগ
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-500">
              প্রেস বিজ্ঞপ্তি, সংবাদ সহযোগিতা অথবা মিডিয়া সংক্রান্ত বিষয়ে আমাদের সঙ্গে যোগাযোগ করুন।
            </p>
            <Link href="/contact" className="mt-5 inline-flex rounded-xl border border-red-600 px-5 py-3 text-sm font-semibold text-red-600 hover:bg-red-50">
              যোগাযোগ করুন
            </Link>
          </aside>
        </div>
      </section>
    </main>
  );
}
