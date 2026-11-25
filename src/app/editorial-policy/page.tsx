
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "সম্পাদকীয় নীতিমালা | দৈনিক দিনলিপি",
  description:
    "দৈনিক দিনলিপির সংবাদ যাচাই, সাংবাদিকতার নৈতিকতা, সংশোধন নীতি ও সম্পাদকীয় স্বাধীনতা সম্পর্কে জানুন।",
};

const policies = [
  {
    title: "১. আমাদের সম্পাদকীয় অঙ্গীকার",
    content: `দৈনিক দিনলিপি দায়িত্বশীল, নিরপেক্ষ ও তথ্যনির্ভর সাংবাদিকতায় বিশ্বাসী।

আমাদের উদ্দেশ্য হলো পাঠকদের কাছে গুরুত্বপূর্ণ ঘটনা, সংবাদ ও তথ্য যথাসম্ভব নির্ভুলভাবে তুলে ধরা।

সংবাদ প্রকাশের ক্ষেত্রে সত্যতা, জনস্বার্থ, নৈতিকতা এবং পাঠকের আস্থাকে গুরুত্ব দেওয়া হয়।`,
  },
  {
    title: "২. সংবাদ যাচাই ও তথ্যের নির্ভরযোগ্যতা",
    content: `সংবাদ প্রকাশের আগে তথ্যের সত্যতা যাচাই করার চেষ্টা করা হয়।

• সম্ভব হলে একাধিক নির্ভরযোগ্য সূত্র থেকে তথ্য যাচাই করা হয়।
• সরকারি ঘোষণা ও সংশ্লিষ্ট প্রতিষ্ঠানের তথ্য বিবেচনা করা হয়।
• ছবি, ভিডিও ও নথির সত্যতা যাচাইয়ের চেষ্টা করা হয়।
• সন্দেহজনক বা অসম্পূর্ণ তথ্যকে নিশ্চিত সংবাদ হিসেবে প্রকাশ করা থেকে বিরত থাকা হয়।
• প্রয়োজন অনুযায়ী সংশ্লিষ্ট ব্যক্তি বা প্রতিষ্ঠানের বক্তব্য নেওয়ার চেষ্টা করা হয়।

যাচাই করা সম্ভব হয়নি এমন তথ্য প্রকাশের ক্ষেত্রে তার সীমাবদ্ধতা স্পষ্টভাবে উল্লেখ করা উচিত।`,
  },
  {
    title: "৩. নিরপেক্ষতা ও ভারসাম্য",
    content: `আমরা সংবাদ পরিবেশনে পক্ষপাত এড়িয়ে চলার চেষ্টা করি।

কোনো ব্যক্তি, প্রতিষ্ঠান, রাজনৈতিক দল বা গোষ্ঠীর প্রতি অযৌক্তিক পক্ষপাত দেখানো আমাদের সম্পাদকীয় নীতির সঙ্গে সামঞ্জস্যপূর্ণ নয়।

বিতর্কিত বা অভিযোগসংক্রান্ত সংবাদে সংশ্লিষ্ট পক্ষের বক্তব্য নেওয়ার চেষ্টা করা হয়।

তবে নিরপেক্ষতার নামে প্রমাণিত তথ্য ও ভিত্তিহীন দাবিকে সমান গুরুত্ব দেওয়া হবে না।`,
  },
  {
    title: "৪. সংবাদ ও মতামতের পার্থক্য",
    content: `সংবাদ, প্রতিবেদন, বিশ্লেষণ, সম্পাদকীয় এবং ব্যক্তিগত মতামতের মধ্যে পার্থক্য বজায় রাখার চেষ্টা করা হয়।

সংবাদে যাচাইযোগ্য তথ্যকে অগ্রাধিকার দেওয়া হয়।

মতামত বা কলামে লেখকের ব্যক্তিগত দৃষ্টিভঙ্গি থাকতে পারে। এ ধরনের কনটেন্ট যথাসম্ভব আলাদাভাবে চিহ্নিত করা হবে।

কোনো লেখকের মতামত সবসময় দৈনিক দিনলিপির আনুষ্ঠানিক অবস্থানকে প্রতিনিধিত্ব করে না।`,
  },
  {
    title: "৫. শিরোনাম ও সংবাদ উপস্থাপন",
    content: `সংবাদের শিরোনাম মূল ঘটনার সঙ্গে সামঞ্জস্যপূর্ণ হওয়া উচিত।

পাঠকের দৃষ্টি আকর্ষণের জন্য বিভ্রান্তিকর, অতিরঞ্জিত বা মিথ্যা শিরোনাম ব্যবহার করা উচিত নয়।

সংবাদের গুরুত্বপূর্ণ তথ্য আড়াল করে পাঠককে ভুল ধারণা দেওয়ার উদ্দেশ্যে কনটেন্ট তৈরি করা হবে না।

শিরোনাম ও সংবাদের মূল বক্তব্যের মধ্যে সামঞ্জস্য বজায় রাখা আমাদের লক্ষ্য।`,
  },
  {
    title: "৬. ছবি, ভিডিও ও মাল্টিমিডিয়া",
    content: `সংবাদে ব্যবহৃত ছবি, ভিডিও ও অন্যান্য উপকরণের সত্যতা এবং প্রাসঙ্গিকতা যাচাই করার চেষ্টা করা হয়।

• ছবি বা ভিডিওর প্রেক্ষাপট বিকৃত করা উচিত নয়।
• পুরোনো ছবি নতুন ঘটনার ছবি হিসেবে উপস্থাপন করা যাবে না।
• প্রয়োজন হলে ছবি বা ভিডিওর সময় ও প্রেক্ষাপট উল্লেখ করা হবে।
• অনুমতি ও প্রযোজ্য কপিরাইটের বিষয় বিবেচনা করা হবে।
• সম্পাদিত বা AI-নির্মিত ভিজ্যুয়ালকে বাস্তব ঘটনার আসল ছবি হিসেবে উপস্থাপন করা উচিত নয়।

সংবাদের সঙ্গে সম্পর্কহীন ছবি ব্যবহার করে পাঠককে বিভ্রান্ত করা যাবে না।`,
  },
  {
    title: "৭. সূত্র ও তথ্যদাতার গোপনীয়তা",
    content: `সংবাদ সংগ্রহের ক্ষেত্রে তথ্যদাতা ও সূত্রের নিরাপত্তা এবং গোপনীয়তাকে গুরুত্ব দেওয়া হয়।

যেখানে প্রয়োজন এবং যুক্তিসংগত কারণ রয়েছে, সেখানে সূত্রের পরিচয় গোপন রাখার বিষয়টি বিবেচনা করা হবে।

তবে কোনো তথ্য প্রকাশের আগে তার নির্ভরযোগ্যতা যাচাইয়ের চেষ্টা করা হবে।

আইনগত বাধ্যবাধকতা বা গুরুতর জনস্বার্থের বিষয় থাকলে সংশ্লিষ্ট পরিস্থিতি বিবেচনা করে সিদ্ধান্ত নেওয়া হবে।`,
  },
  {
    title: "৮. শিশু ও সংবেদনশীল ব্যক্তিদের বিষয়ে সংবাদ",
    content: `শিশু, নির্যাতনের শিকার ব্যক্তি এবং অন্যান্য ঝুঁকিপূর্ণ ব্যক্তিদের বিষয়ে সংবাদ প্রকাশের ক্ষেত্রে বিশেষ সতর্কতা অবলম্বন করা উচিত।

• অপ্রয়োজনে পরিচয় প্রকাশ করা হবে না।
• ব্যক্তিগত মর্যাদা ও নিরাপত্তাকে গুরুত্ব দেওয়া হবে।
• সংবেদনশীল ছবি বা তথ্য প্রকাশের ক্ষেত্রে সতর্কতা অবলম্বন করা হবে।
• ভুক্তভোগীকে দোষারোপ করে এমন ভাষা পরিহার করা হবে।
• প্রযোজ্য আইন ও নৈতিক নির্দেশনা বিবেচনা করা হবে।`,
  },
  {
    title: "৯. ভুল সংবাদ সংশোধন নীতি",
    content: `প্রকাশিত সংবাদে ভুল, অসম্পূর্ণ বা বিভ্রান্তিকর তথ্য পাওয়া গেলে তা পর্যালোচনা করা হবে।

যাচাইয়ের পর প্রয়োজন অনুযায়ী সংবাদ সংশোধন, হালনাগাদ বা ব্যাখ্যা প্রকাশ করা হতে পারে।

গুরুত্বপূর্ণ সংশোধনের ক্ষেত্রে পাঠকদের কাছে পরিবর্তনের বিষয়টি স্পষ্টভাবে তুলে ধরার চেষ্টা করা হবে।

সংশোধনের অনুরোধ জানাতে আমাদের যোগাযোগ পেজ ব্যবহার করতে পারেন।`,
  },
  {
    title: "১০. বিজ্ঞাপন ও স্পনসরড কনটেন্ট",
    content: `সম্পাদকীয় কনটেন্ট ও বিজ্ঞাপনের মধ্যে পার্থক্য বজায় রাখার চেষ্টা করা হয়।

বিজ্ঞাপন বা স্পনসরড কনটেন্টকে সংবাদ হিসেবে বিভ্রান্তিকরভাবে উপস্থাপন করা উচিত নয়।

বাণিজ্যিক স্বার্থের কারণে সংবাদ যাচাই বা সম্পাদকীয় সিদ্ধান্ত প্রভাবিত হওয়া উচিত নয়।

স্পনসরড কনটেন্ট যথাসম্ভব আলাদাভাবে চিহ্নিত করা হবে।`,
  },
  {
    title: "১১. স্বার্থের সংঘাত",
    content: `সংবাদ প্রকাশ বা সম্পাদকীয় সিদ্ধান্তে ব্যক্তিগত, রাজনৈতিক, আর্থিক কিংবা অন্য কোনো স্বার্থের সংঘাত থাকলে তা বিবেচনা করা উচিত।

সাংবাদিক ও সম্পাদকীয় সংশ্লিষ্ট ব্যক্তিদের পেশাগত দায়িত্ব পালনের ক্ষেত্রে ব্যক্তিগত স্বার্থকে প্রাধান্য দেওয়া উচিত নয়।

যেখানে স্বার্থের সংঘাত সংবাদকে প্রভাবিত করতে পারে, সেখানে প্রয়োজনীয় সতর্কতা অবলম্বন করা হবে।`,
  },
  {
    title: "১২. AI ও প্রযুক্তির ব্যবহার",
    content: `সংবাদ সংগ্রহ, সম্পাদনা, অনুবাদ, তথ্য বিশ্লেষণ বা অন্যান্য সহায়ক কাজে AI ও প্রযুক্তি ব্যবহার করা হতে পারে।

তবে AI-উৎপাদিত তথ্য যাচাই ছাড়া নির্ভরযোগ্য সংবাদ হিসেবে প্রকাশ করা উচিত নয়।

AI দিয়ে তৈরি ছবি, ভিডিও বা কনটেন্ট বাস্তব ঘটনার দৃশ্য হিসেবে বিভ্রান্তিকরভাবে উপস্থাপন করা যাবে না।

সংবাদ প্রকাশের চূড়ান্ত দায়িত্ব সম্পাদকীয় প্রক্রিয়ার ওপর নির্ভরশীল।`,
  },
  {
    title: "১৩. পাঠকের অভিযোগ ও প্রতিক্রিয়া",
    content: `পাঠকদের মতামত, অভিযোগ, সংশোধনের অনুরোধ এবং পরামর্শকে গুরুত্ব দেওয়া হয়।

কোনো সংবাদে ভুল, পক্ষপাত বা নীতিমালা লঙ্ঘনের অভিযোগ থাকলে সংশ্লিষ্ট সংবাদ লিংক ও বিস্তারিত তথ্যসহ যোগাযোগ করতে পারেন।

প্রাপ্ত অভিযোগ পর্যালোচনা করে প্রয়োজনীয় ব্যবস্থা নেওয়ার চেষ্টা করা হবে।`,
  },
  {
    title: "১৪. নীতিমালার পরিবর্তন",
    content: `সংবাদমাধ্যমের কার্যক্রম, প্রযুক্তি এবং প্রযোজ্য আইন পরিবর্তনের সঙ্গে সামঞ্জস্য রেখে এই সম্পাদকীয় নীতিমালা হালনাগাদ করা হতে পারে।

পরিবর্তিত নীতিমালা এই পেজে প্রকাশ করা হবে।

দৈনিক দিনলিপির সম্পাদকীয় কার্যক্রমের সঙ্গে সংশ্লিষ্ট সবাইকে প্রযোজ্য নীতিমালা অনুসরণ করার প্রত্যাশা করা হয়।`,
  },
];

export default function EditorialPolicyPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-10 dark:bg-gray-950">
      <div className="container-main mx-auto max-w-5xl px-4">

        {/* Breadcrumb */}
        <div className="mb-8 text-sm text-gray-500 dark:text-gray-400">
          <Link href="/" className="hover:text-red-600">
            প্রচ্ছদ
          </Link>
          <span className="mx-2">/</span>
          সম্পাদকীয় নীতিমালা
        </div>

        {/* Hero */}
        <section className="relative overflow-hidden rounded-3xl bg-gray-950 px-6 py-16 text-center text-white md:px-12">
          <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-red-600/20 blur-3xl" />
          <div className="absolute -bottom-20 -left-16 h-64 w-64 rounded-full bg-red-600/20 blur-3xl" />

          <div className="relative">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl border border-red-400/30 bg-red-600/20">
              <span className="text-3xl font-black text-red-400">
                EP
              </span>
            </div>

            <h1 className="mt-7 text-3xl font-extrabold md:text-5xl">
              সম্পাদকীয় নীতিমালা
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-sm leading-8 text-gray-300 md:text-base">
              সত্য, নিরপেক্ষতা, দায়িত্বশীলতা এবং পাঠকের
              আস্থাকে সামনে রেখে আমাদের সাংবাদিকতার নীতিমালা।
            </p>

            <span className="mt-7 inline-flex rounded-full border border-white/20 bg-white/10 px-5 py-2 text-xs text-gray-300">
              দৈনিক দিনলিপি
            </span>
          </div>
        </section>

        {/* Introduction */}
        <section className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 md:p-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            আমাদের সম্পাদকীয় দর্শন
          </h2>

          <p className="mt-4 text-sm leading-8 text-gray-600 dark:text-gray-400">
            একটি দায়িত্বশীল সংবাদমাধ্যমের প্রধান শক্তি হলো
            পাঠকের আস্থা। সেই আস্থা অর্জন ও বজায় রাখতে
            তথ্য যাচাই, নিরপেক্ষতা, নৈতিকতা এবং ভুল সংশোধনের
            প্রতি আমাদের অঙ্গীকার গুরুত্বপূর্ণ।
          </p>
        </section>

        {/* Policy Highlights */}
        <section className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            {
              number: "01",
              title: "সত্যতা",
              description: "তথ্য যাচাই ও নির্ভরযোগ্য সূত্র",
            },
            {
              number: "02",
              title: "নিরপেক্ষতা",
              description: "ভারসাম্যপূর্ণ সংবাদ পরিবেশন",
            },
            {
              number: "03",
              title: "দায়িত্বশীলতা",
              description: "ভুল সংশোধন ও নৈতিক সাংবাদিকতা",
            },
          ].map((item) => (
            <div
              key={item.number}
              className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900"
            >
              <span className="text-sm font-extrabold text-red-600">
                {item.number}
              </span>

              <h3 className="mt-3 text-xl font-bold text-gray-900 dark:text-white">
                {item.title}
              </h3>

              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {item.description}
              </p>
            </div>
          ))}
        </section>

        {/* All Policies */}
        <div className="mt-10 space-y-5">
          {policies.map((policy, index) => (
            <section
              key={policy.title}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-gray-800 dark:bg-gray-900 md:p-8"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-sm font-extrabold text-red-600 dark:bg-red-950/40 dark:text-red-400">
                  {String(index + 1).padStart(2, "0")}
                </div>

                <div className="min-w-0 flex-1">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white md:text-xl">
                    {policy.title}
                  </h2>

                  <p className="mt-4 whitespace-pre-line text-sm leading-8 text-gray-600 dark:text-gray-400">
                    {policy.content}
                  </p>
                </div>
              </div>
            </section>
          ))}
        </div>

        {/* Related Pages */}
        <section className="mt-10 rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 md:p-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            সম্পর্কিত পেজ
          </h2>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Link
              href="/terms"
              className="rounded-xl border border-gray-200 p-5 transition hover:border-red-500 dark:border-gray-700"
            >
              <h3 className="font-bold text-gray-900 dark:text-white">
                ব্যবহারের শর্তাবলি →
              </h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                ওয়েবসাইট ব্যবহারের নিয়ম ও শর্তাবলি।
              </p>
            </Link>

            <Link
              href="/disclaimer"
              className="rounded-xl border border-gray-200 p-5 transition hover:border-red-500 dark:border-gray-700"
            >
              <h3 className="font-bold text-gray-900 dark:text-white">
                দায়মুক্তি ঘোষণা →
              </h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                সংবাদ ও তথ্য ব্যবহারের সীমাবদ্ধতা।
              </p>
            </Link>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="mt-10 rounded-3xl bg-red-600 px-6 py-12 text-center text-white md:px-12">
          <h2 className="text-2xl font-extrabold md:text-3xl">
            সংবাদ সম্পর্কে আপনার মতামত জানান
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-red-100">
            কোনো সংবাদে ভুল, অসম্পূর্ণ তথ্য বা সম্পাদকীয়
            নীতিমালা সংক্রান্ত অভিযোগ থাকলে আমাদের জানান।
          </p>

          <Link
            href="/contact"
            className="mt-7 inline-flex rounded-lg bg-white px-7 py-3 font-bold text-red-600 transition hover:bg-gray-100"
          >
            যোগাযোগ করুন →
          </Link>
        </section>

      </div>
    </main>
  );
}
