
import Link from "next/link";
import { ShieldCheck, ArrowLeft, SearchCheck, FileCheck, Mail } from "lucide-react";

const steps = [
  {
    title: "দাবি শনাক্তকরণ",
    description: "সামাজিক যোগাযোগমাধ্যম বা বিভিন্ন মাধ্যমে ছড়িয়ে পড়া গুরুত্বপূর্ণ দাবিগুলো শনাক্ত করা।",
  },
  {
    title: "বিশ্বস্ত সূত্র যাচাই",
    description: "মূল তথ্য, নথি, ছবি, ভিডিও এবং নির্ভরযোগ্য সূত্রের সঙ্গে দাবির মিল পরীক্ষা করা।",
  },
  {
    title: "প্রমাণ বিশ্লেষণ",
    description: "প্রাপ্ত তথ্য ও প্রমাণের ভিত্তিতে দাবিটির সত্যতা মূল্যায়ন করা।",
  },
  {
    title: "ফলাফল প্রকাশ",
    description: "যাচাইয়ের ফলাফল ও প্রয়োজনীয় ব্যাখ্যা পাঠকদের সামনে তুলে ধরা।",
  },
];

export default function FactCheckPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="bg-slate-950 px-5 py-16 text-white">
        <div className="mx-auto max-w-7xl">
          <Link href="/" className="mb-7 inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white">
            <ArrowLeft size={16} /> হোমপেজ
          </Link>

          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-600">
              <ShieldCheck size={30} />
            </div>
            <div>
              <p className="text-sm font-semibold text-red-400">FACT CHECK</p>
              <h1 className="text-3xl font-extrabold sm:text-4xl">তথ্য যাচাই</h1>
            </div>
          </div>

          <p className="mt-5 max-w-2xl leading-8 text-slate-300">
            গুজব, বিভ্রান্তিকর তথ্য ও ভুল দাবির সত্যতা যাচাই করে সঠিক তথ্য তুলে ধরাই আমাদের লক্ষ্য।
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-12">
        <div className="rounded-2xl border border-red-100 bg-red-50 p-7">
          <div className="flex items-center gap-3">
            <SearchCheck className="text-red-600" size={30} />
            <h2 className="text-xl font-bold text-slate-900">কেন তথ্য যাচাই জরুরি?</h2>
          </div>
          <p className="mt-4 leading-8 text-slate-600">
            ভুল তথ্য দ্রুত ছড়িয়ে পড়তে পারে। তাই কোনো তথ্য শেয়ার করার আগে তার উৎস, প্রেক্ষাপট ও সত্যতা যাচাই করা গুরুত্বপূর্ণ।
          </p>
        </div>

        <h2 className="mb-6 mt-10 text-2xl font-bold text-slate-900">আমাদের যাচাই প্রক্রিয়া</h2>

        <div className="space-y-4">
          {steps.map((step, index) => (
            <article key={step.title} className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-6">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 font-bold text-red-600">
                {index + 1}
              </div>
              <div>
                <h3 className="font-bold text-slate-900">{step.title}</h3>
                <p className="mt-2 leading-7 text-slate-600">{step.description}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-7">
          <FileCheck className="mb-4 text-red-600" size={30} />
          <h2 className="text-xl font-bold text-slate-900">সন্দেহজনক তথ্য পেয়েছেন?</h2>
          <p className="mt-3 leading-7 text-slate-600">
            তথ্যটির লিংক ও প্রাসঙ্গিক প্রমাণসহ আমাদের জানাতে পারেন।
          </p>
          <Link href="/contact" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-red-600 px-6 py-3 font-semibold text-white hover:bg-red-700">
            <Mail size={18} /> তথ্য পাঠান
          </Link>
        </div>
      </section>
    </main>
  );
}
