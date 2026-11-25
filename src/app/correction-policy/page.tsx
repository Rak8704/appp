
import Link from "next/link";
import { ArrowLeft, FileCheck, ShieldCheck, Mail, SearchCheck } from "lucide-react";

const policies = [
  {
    title: "ভুল শনাক্তকরণ",
    description: "প্রকাশিত সংবাদে তথ্যগত ভুল, নাম, তারিখ, স্থান বা পরিসংখ্যানের অসঙ্গতি পাওয়া গেলে তা যাচাই করা হবে।",
  },
  {
    title: "তথ্য যাচাই",
    description: "সংশোধনের আগে সংশ্লিষ্ট সংবাদ, নির্ভরযোগ্য সূত্র ও প্রয়োজনীয় প্রমাণ পর্যালোচনা করা হবে।",
  },
  {
    title: "সংশোধন প্রকাশ",
    description: "ভুল নিশ্চিত হলে সংবাদে প্রয়োজনীয় সংশোধন করা হবে এবং প্রয়োজন অনুযায়ী সংশোধনের বিষয়টি উল্লেখ করা হবে।",
  },
  {
    title: "পাঠকের অভিযোগ",
    description: "পাঠকরা কোনো ভুল বা বিভ্রান্তিকর তথ্য সম্পর্কে আমাদের জানাতে পারবেন।",
  },
];

export default function CorrectionPolicyPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="bg-slate-950 px-5 py-14 text-white">
        <div className="mx-auto max-w-5xl">
          <Link href="/" className="mb-6 inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white">
            <ArrowLeft size={16} /> হোমপেজ
          </Link>

          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-600">
              <FileCheck size={30} />
            </div>
            <div>
              <p className="text-sm font-semibold text-red-400">OUR COMMITMENT</p>
              <h1 className="text-3xl font-extrabold sm:text-4xl">
                সংবাদ সংশোধন নীতিমালা
              </h1>
            </div>
          </div>

          <p className="mt-5 max-w-2xl leading-8 text-slate-300">
            সঠিক, নির্ভুল ও দায়িত্বশীল সংবাদ প্রকাশে আমাদের অঙ্গীকার।
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-12">
        <div className="mb-9 rounded-2xl border border-red-100 bg-red-50 p-6">
          <div className="flex items-start gap-4">
            <ShieldCheck className="shrink-0 text-red-600" size={30} />
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                নির্ভুলতা আমাদের অগ্রাধিকার
              </h2>
              <p className="mt-2 leading-8 text-slate-600">
                দৈনিক দিনলিপি সংবাদ প্রকাশের ক্ষেত্রে তথ্যের যথার্থতা বজায় রাখতে সচেষ্ট। কোনো অনিচ্ছাকৃত ভুল শনাক্ত হলে যথাযথ যাচাইয়ের পর সংশোধনের উদ্যোগ নেওয়া হবে।
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          {policies.map((policy, index) => (
            <article key={policy.title} className="rounded-2xl border border-slate-200 p-6">
              <div className="flex items-start gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 font-bold text-red-600">
                  {index + 1}
                </span>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {policy.title}
                  </h3>
                  <p className="mt-2 leading-8 text-slate-600">
                    {policy.description}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-7">
          <div className="flex items-center gap-3">
            <SearchCheck className="text-red-600" size={28} />
            <h2 className="text-xl font-bold text-slate-900">
              ভুল তথ্য পেয়েছেন?
            </h2>
          </div>

          <p className="mt-3 leading-8 text-slate-600">
            সংশ্লিষ্ট সংবাদটির লিংক ও সঠিক তথ্যের প্রমাণসহ আমাদের জানান।
          </p>

          <Link href="/contact" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-red-600 px-6 py-3 font-semibold text-white hover:bg-red-700">
            <Mail size={18} />
            সংশোধনের জন্য যোগাযোগ
          </Link>
        </div>
      </section>
    </main>
  );
}
