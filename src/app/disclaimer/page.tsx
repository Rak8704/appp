
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "দায়মুক্তি ঘোষণা | দৈনিক দিনলিপি",
  description:
    "দৈনিক দিনলিপির সংবাদ, তথ্য, মতামত, বিজ্ঞাপন ও তৃতীয় পক্ষের লিংক সম্পর্কিত দায়মুক্তি ঘোষণা।",
};

const sections = [
  {
    title: "১. সাধারণ তথ্য",
    content: `দৈনিক দিনলিপি একটি অনলাইন সংবাদমাধ্যম। এই ওয়েবসাইটে প্রকাশিত সংবাদ, প্রতিবেদন, ছবি, ভিডিও, বিশ্লেষণ ও অন্যান্য তথ্য সাধারণ তথ্য ও সংবাদ পরিবেশনের উদ্দেশ্যে প্রকাশ করা হয়।

আমরা যথাসম্ভব নির্ভুল, নিরপেক্ষ ও হালনাগাদ তথ্য প্রকাশের চেষ্টা করি। তবে সব তথ্য সর্বাবস্থায় সম্পূর্ণ, নির্ভুল বা সর্বশেষ বলে নিশ্চয়তা দেওয়া হয় না।`,
  },
  {
    title: "২. সংবাদ ও তথ্যের নির্ভুলতা",
    content: `সংবাদ প্রকাশের আগে তথ্য যাচাই করার চেষ্টা করা হয়। তবুও অনিচ্ছাকৃত ভুল, অসম্পূর্ণ তথ্য বা তথ্যের পরিবর্তন ঘটতে পারে।

কোনো সংবাদে ভুল বা বিভ্রান্তিকর তথ্য পাওয়া গেলে পাঠকদের আমাদের জানাতে অনুরোধ করা হচ্ছে।

যাচাইয়ের পর প্রয়োজন অনুযায়ী সংশোধন, হালনাগাদ বা ব্যাখ্যা প্রকাশ করা হতে পারে।`,
  },
  {
    title: "৩. মতামত ও বিশ্লেষণ",
    content: `ওয়েবসাইটে প্রকাশিত মতামত, কলাম, সম্পাদকীয় বা বিশ্লেষণ সংশ্লিষ্ট লেখক বা অবদানকারীর ব্যক্তিগত দৃষ্টিভঙ্গি প্রকাশ করতে পারে।

এসব মতামত সবসময় দৈনিক দিনলিপির সম্পাদকীয় অবস্থান বা প্রতিষ্ঠানের আনুষ্ঠানিক মতামতকে প্রতিনিধিত্ব করে না।

পাঠকদের নিজস্ব বিচারবুদ্ধি দিয়ে মতামত মূল্যায়ন করার অনুরোধ করা হচ্ছে।`,
  },
  {
    title: "৪. পেশাগত পরামর্শ নয়",
    content: `আমাদের ওয়েবসাইটে প্রকাশিত কোনো তথ্যকে চিকিৎসা, আইন, আর্থিক, বিনিয়োগ বা অন্য কোনো পেশাগত পরামর্শ হিসেবে বিবেচনা করা উচিত নয়।

গুরুত্বপূর্ণ সিদ্ধান্ত নেওয়ার আগে সংশ্লিষ্ট বিষয়ে যোগ্য ও অনুমোদিত পেশাজীবীর পরামর্শ গ্রহণ করুন।`,
  },
  {
    title: "৫. তৃতীয় পক্ষের ওয়েবসাইট",
    content: `দৈনিক দিনলিপির বিভিন্ন সংবাদ বা পেজে তৃতীয় পক্ষের ওয়েবসাইটের লিংক থাকতে পারে।

এসব ওয়েবসাইটের কনটেন্ট, নিরাপত্তা, গোপনীয়তা নীতি, পণ্য বা সেবার মান আমাদের নিয়ন্ত্রণে নেই।

কোনো বাহ্যিক ওয়েবসাইট ব্যবহারের ক্ষেত্রে সংশ্লিষ্ট ওয়েবসাইটের নিজস্ব নীতিমালা প্রযোজ্য হবে।`,
  },
  {
    title: "৬. বিজ্ঞাপন ও স্পনসরড কনটেন্ট",
    content: `ওয়েবসাইটে বিজ্ঞাপন, স্পনসরড কনটেন্ট বা তৃতীয় পক্ষের প্রচারণা প্রদর্শিত হতে পারে।

বিজ্ঞাপনদাতার পণ্য, সেবা, মূল্য, দাবি বা প্রতিশ্রুতির জন্য সংশ্লিষ্ট বিজ্ঞাপনদাতা দায়ী থাকবেন।

বিজ্ঞাপন প্রদর্শনের অর্থ এই নয় যে দৈনিক দিনলিপি বিজ্ঞাপনের সব দাবি যাচাই বা অনুমোদন করেছে। স্পনসরড কনটেন্ট যথাসম্ভব আলাদাভাবে চিহ্নিত করা হবে।`,
  },
  {
    title: "৭. ছবি, ভিডিও ও অন্যান্য উপকরণ",
    content: `ওয়েবসাইটে প্রকাশিত ছবি, ভিডিও, গ্রাফিক্স ও অন্যান্য উপকরণের অধিকার সংশ্লিষ্ট মালিক বা অধিকারধারীর হতে পারে।

কোনো উপকরণের মালিকানা বা ব্যবহারের অধিকার সম্পর্কে আপত্তি থাকলে প্রমাণসহ আমাদের সঙ্গে যোগাযোগ করুন।

যাচাইয়ের পর প্রযোজ্য আইন ও অধিকার বিবেচনায় প্রয়োজনীয় ব্যবস্থা নেওয়া হবে।`,
  },
  {
    title: "৮. প্রযুক্তিগত সমস্যা",
    content: `সার্ভার সমস্যা, ইন্টারনেট সংযোগ, রক্ষণাবেক্ষণ বা অন্যান্য প্রযুক্তিগত কারণে ওয়েবসাইট সাময়িকভাবে অপ্রাপ্য হতে পারে।

আমরা ওয়েবসাইট সচল ও নিরাপদ রাখার চেষ্টা করি, তবে নিরবচ্ছিন্ন সেবা প্রদানের নিশ্চয়তা দিতে পারি না।`,
  },
  {
    title: "৯. তথ্যের ব্যবহার ও পাঠকের দায়িত্ব",
    content: `এই ওয়েবসাইটের তথ্য পাঠক নিজ দায়িত্বে ব্যবহার করবেন।

কোনো তথ্যের ভিত্তিতে সিদ্ধান্ত নেওয়ার আগে প্রয়োজন অনুযায়ী স্বাধীনভাবে যাচাই করুন এবং সংশ্লিষ্ট নির্ভরযোগ্য উৎস বিবেচনা করুন।

প্রযোজ্য আইনে যে দায় বাদ দেওয়া যায় না, এই ঘোষণার মাধ্যমে তা বাদ দেওয়ার চেষ্টা করা হচ্ছে না।`,
  },
  {
    title: "১০. সংশোধন ও হালনাগাদ",
    content: `দৈনিক দিনলিপি প্রয়োজনে এই দায়মুক্তি ঘোষণা পরিবর্তন, সংশোধন বা হালনাগাদ করতে পারে।

পরিবর্তিত সংস্করণ এই পেজে প্রকাশ করা হবে। সর্বশেষ তথ্যের জন্য নিয়মিত এই পেজটি দেখার অনুরোধ করা হচ্ছে।`,
  },
  {
    title: "১১. যোগাযোগ",
    content: `এই দায়মুক্তি ঘোষণা সম্পর্কে কোনো প্রশ্ন, অভিযোগ, সংশোধনের অনুরোধ বা মতামত থাকলে আমাদের সঙ্গে যোগাযোগ করুন।

প্রয়োজনে সংশ্লিষ্ট সংবাদ বা কনটেন্টের লিংক এবং আপনার অভিযোগের বিস্তারিত তথ্য পাঠান।`,
  },
];

export default function DisclaimerPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-10 dark:bg-gray-950">
      <div className="container-main mx-auto max-w-5xl px-4">

        {/* Breadcrumb */}
        <div className="mb-8 text-sm text-gray-500 dark:text-gray-400">
          <Link href="/" className="transition hover:text-red-600">
            প্রচ্ছদ
          </Link>
          <span className="mx-2">/</span>
          দায়মুক্তি ঘোষণা
        </div>

        {/* Hero Section */}
        <section className="relative overflow-hidden rounded-3xl bg-gray-950 px-6 py-16 text-center text-white md:px-12">
          <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-red-600/20 blur-3xl" />
          <div className="absolute -bottom-20 -left-16 h-64 w-64 rounded-full bg-red-600/20 blur-3xl" />

          <div className="relative">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl border border-red-400/30 bg-red-600/20 text-4xl">
              ⚠️
            </div>

            <h1 className="mt-7 text-3xl font-extrabold md:text-5xl">
              দায়মুক্তি ঘোষণা
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-sm leading-8 text-gray-300 md:text-base">
              দৈনিক দিনলিপিতে প্রকাশিত সংবাদ, তথ্য, মতামত
              ও অন্যান্য কনটেন্ট ব্যবহারের শর্ত এবং সীমাবদ্ধতা
              সম্পর্কে জানুন।
            </p>

            <span className="mt-7 inline-flex rounded-full border border-white/20 bg-white/10 px-5 py-2 text-xs text-gray-300">
              দৈনিক দিনলিপি
            </span>
          </div>
        </section>

        {/* Important Notice */}
        <section className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-6 dark:border-amber-950 dark:bg-amber-950/20">
          <h2 className="font-bold text-gray-900 dark:text-white">
            গুরুত্বপূর্ণ বিজ্ঞপ্তি
          </h2>

          <p className="mt-3 text-sm leading-8 text-gray-700 dark:text-gray-300">
            এই পেজে উল্লেখিত বিষয়গুলো সাধারণ দায়মুক্তি ঘোষণার
            খসড়া। ওয়েবসাইটের প্রকৃত কার্যক্রম এবং বাংলাদেশের
            প্রযোজ্য আইন অনুযায়ী প্রকাশের আগে এটি পর্যালোচনা
            করা প্রয়োজন।
          </p>
        </section>

        {/* Introduction */}
        <section className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 md:p-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            আমাদের অবস্থান
          </h2>

          <p className="mt-4 text-sm leading-8 text-gray-600 dark:text-gray-400">
            দৈনিক দিনলিপি দায়িত্বশীল সংবাদ প্রকাশ ও তথ্যের
            নির্ভুলতা বজায় রাখার চেষ্টা করে। তবে সংবাদ ও তথ্য
            ব্যবহারের ক্ষেত্রে পাঠকদের সচেতনতা এবং নিজস্ব
            বিচারবুদ্ধির গুরুত্ব রয়েছে।
          </p>
        </section>

        {/* Disclaimer Sections */}
        <div className="mt-8 space-y-5">
          {sections.map((section, index) => (
            <section
              key={section.title}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-gray-800 dark:bg-gray-900 md:p-8"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-50 text-sm font-bold text-red-600 dark:bg-red-950/40 dark:text-red-400">
                  {String(index + 1).padStart(2, "0")}
                </div>

                <div className="min-w-0 flex-1">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white md:text-xl">
                    {section.title}
                  </h2>

                  <p className="mt-4 whitespace-pre-line text-sm leading-8 text-gray-600 dark:text-gray-400">
                    {section.content}
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
              href="/privacy-policy"
              className="rounded-xl border border-gray-200 p-5 transition hover:border-red-500 dark:border-gray-700"
            >
              <h3 className="font-bold text-gray-900 dark:text-white">
                গোপনীয়তা নীতিমালা →
              </h3>

              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                আপনার ব্যক্তিগত তথ্যের ব্যবহার সম্পর্কে জানুন।
              </p>
            </Link>

            <Link
              href="/terms"
              className="rounded-xl border border-gray-200 p-5 transition hover:border-red-500 dark:border-gray-700"
            >
              <h3 className="font-bold text-gray-900 dark:text-white">
                ব্যবহারের শর্তাবলি →
              </h3>

              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                ওয়েবসাইট ব্যবহারের নিয়ম ও শর্তাবলি পড়ুন।
              </p>
            </Link>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="mt-10 rounded-3xl bg-red-600 px-6 py-12 text-center text-white md:px-12">
          <h2 className="text-2xl font-extrabold md:text-3xl">
            কোনো ভুল তথ্য পেয়েছেন?
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-red-100">
            সংবাদ বা তথ্যের কোনো ভুল চোখে পড়লে আমাদের জানান।
            আমরা বিষয়টি পর্যালোচনা করার চেষ্টা করব।
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
