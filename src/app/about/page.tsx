
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "আমাদের সম্পর্কে | দৈনিক দিনলিপি",
  description:
    "দৈনিক দিনলিপি সম্পর্কে জানুন। আমাদের লক্ষ্য, উদ্দেশ্য ও সম্পাদকীয় নীতি।",
};

const values = [
  {
    icon: "🎯",
    title: "আমাদের লক্ষ্য",
    description:
      "সত্য, নিরপেক্ষ ও বস্তুনিষ্ঠ সংবাদ পাঠকের কাছে দ্রুত পৌঁছে দেওয়া।",
  },
  {
    icon: "⚖️",
    title: "নিরপেক্ষতা",
    description:
      "কোনো পক্ষপাত ছাড়াই তথ্য যাচাই করে সংবাদ প্রকাশ করা।",
  },
  {
    icon: "🔍",
    title: "তথ্য যাচাই",
    description:
      "সংবাদ প্রকাশের আগে তথ্যের সত্যতা ও নির্ভরযোগ্যতা যাচাই করা।",
  },
  {
    icon: "🤝",
    title: "পাঠকের আস্থা",
    description:
      "পাঠকের বিশ্বাস ও দায়িত্বশীল সাংবাদিকতাকে সর্বোচ্চ গুরুত্ব দেওয়া।",
  },
];

const categories = [
  "জাতীয়",
  "রাজনীতি",
  "আন্তর্জাতিক",
  "অর্থনীতি",
  "খেলাধুলা",
  "বিনোদন",
  "প্রযুক্তি",
  "শিক্ষা",
  "স্বাস্থ্য",
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950">

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gray-950 py-20 text-white md:py-28">
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/50 via-gray-950 to-gray-950" />

        <div className="container-main relative mx-auto px-4 text-center">
          <span className="mb-5 inline-block rounded-full border border-red-400/30 bg-red-500/10 px-5 py-2 text-sm font-semibold text-red-300">
            আমাদের পরিচয়
          </span>

          <h1 className="text-4xl font-extrabold leading-tight md:text-6xl">
            দৈনিক <span className="text-red-500">দিনলিপি</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-gray-300 md:text-lg">
            সত্য ও নির্ভরযোগ্য সংবাদ পাঠকের কাছে পৌঁছে দেওয়ার
            প্রত্যয়ে আমরা প্রতিদিন কাজ করে যাচ্ছি।
          </p>

          <Link
            href="/"
            className="mt-8 inline-flex rounded-lg bg-red-600 px-7 py-3 font-semibold text-white transition hover:bg-red-700"
          >
            সংবাদ পড়ুন →
          </Link>
        </div>
      </section>

      <div className="container-main mx-auto px-4 py-16">

        {/* About Introduction */}
        <section className="grid items-center gap-10 md:grid-cols-2">
          <div>
            <span className="font-semibold text-red-600">
              আমাদের সম্পর্কে
            </span>

            <h2 className="mt-3 text-3xl font-extrabold leading-tight text-gray-900 dark:text-white md:text-4xl">
              সংবাদ নয়, সত্য তুলে ধরাই আমাদের অঙ্গীকার
            </h2>

            <div className="mt-6 space-y-4 text-base leading-8 text-gray-600 dark:text-gray-400">
              <p>
                দৈনিক দিনলিপি একটি অনলাইন সংবাদমাধ্যম। দেশ-বিদেশের
                গুরুত্বপূর্ণ ঘটনা, সমসাময়িক বিষয় এবং মানুষের
                জীবনঘনিষ্ঠ সংবাদ পাঠকদের সামনে তুলে ধরাই আমাদের
                প্রধান উদ্দেশ্য।
              </p>

              <p>
                জাতীয়, আন্তর্জাতিক, রাজনীতি, অর্থনীতি, খেলাধুলা,
                বিনোদন, প্রযুক্তি, শিক্ষা ও স্বাস্থ্যসহ বিভিন্ন
                বিষয়ে সংবাদ প্রকাশের মাধ্যমে পাঠকদের তথ্যসমৃদ্ধ
                রাখার চেষ্টা করি।
              </p>

              <p>
                আমরা দায়িত্বশীল সাংবাদিকতা, তথ্যের নির্ভুলতা এবং
                পাঠকের আস্থাকে সর্বোচ্চ গুরুত্ব দিতে প্রতিশ্রুতিবদ্ধ।
              </p>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-3xl bg-gradient-to-br from-red-600 to-red-900 p-8 text-white shadow-xl md:p-12">
              <div className="text-6xl">📰</div>

              <h3 className="mt-6 text-3xl font-extrabold">
                দৈনিক দিনলিপি
              </h3>

              <p className="mt-4 leading-8 text-red-100">
                প্রতিদিনের গুরুত্বপূর্ণ সংবাদ, নির্ভরযোগ্য তথ্য
                এবং সময়োপযোগী বিশ্লেষণ পৌঁছে দিতে আমাদের পথচলা।
              </p>

              <div className="mt-8 border-t border-white/20 pt-6">
                <p className="text-sm font-semibold text-red-100">
                  আমাদের অঙ্গীকার
                </p>
                <p className="mt-2 text-xl font-bold">
                  সত্যের সঙ্গে, মানুষের পাশে।
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Mission and Vision */}
        <section className="mt-20 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-red-100 text-3xl dark:bg-red-950/40">
              🚀
            </div>

            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              আমাদের মিশন
            </h3>

            <p className="mt-4 leading-8 text-gray-600 dark:text-gray-400">
              দ্রুত, নির্ভুল, নিরপেক্ষ ও বস্তুনিষ্ঠ সংবাদ
              প্রকাশের মাধ্যমে জনগণের কাছে সঠিক তথ্য পৌঁছে
              দেওয়া এবং সচেতন সমাজ গঠনে ভূমিকা রাখা।
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100 text-3xl dark:bg-blue-950/40">
              🌍
            </div>

            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              আমাদের ভিশন
            </h3>

            <p className="mt-4 leading-8 text-gray-600 dark:text-gray-400">
              প্রযুক্তিনির্ভর আধুনিক সংবাদমাধ্যম হিসেবে পাঠকদের
              কাছে একটি নির্ভরযোগ্য, দায়িত্বশীল ও গ্রহণযোগ্য
              সংবাদ প্ল্যাটফর্ম হয়ে ওঠা।
            </p>
          </div>
        </section>

        {/* Values */}
        <section className="mt-20">
          <div className="mb-10 text-center">
            <span className="font-semibold text-red-600">
              আমাদের মূলনীতি
            </span>

            <h2 className="mt-3 text-3xl font-extrabold text-gray-900 dark:text-white">
              যে মূল্যবোধে আমরা বিশ্বাসী
            </h2>

            <p className="mt-3 text-gray-600 dark:text-gray-400">
              আমাদের প্রতিটি কাজের ভিত্তি কয়েকটি গুরুত্বপূর্ণ নীতি।
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <div
                key={value.title}
                className="rounded-2xl border border-gray-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900"
              >
                <div className="text-4xl">{value.icon}</div>

                <h3 className="mt-5 text-xl font-bold text-gray-900 dark:text-white">
                  {value.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-gray-600 dark:text-gray-400">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* News Coverage */}
        <section className="mt-20 rounded-3xl bg-gray-900 p-8 text-white md:p-12">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold">
              আমাদের সংবাদ বিভাগ
            </h2>

            <p className="mt-4 text-gray-300">
              বিভিন্ন বিষয়ে নিয়মিত সংবাদ ও তথ্য জানতে আমাদের সঙ্গে থাকুন।
            </p>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <span
                key={category}
                className="rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold transition hover:border-red-500 hover:bg-red-600"
              >
                {category}
              </span>
            ))}
          </div>
        </section>

        {/* Contact CTA */}
        <section className="mt-16 rounded-3xl bg-red-600 px-6 py-12 text-center text-white md:px-12">
          <h2 className="text-3xl font-extrabold">
            আপনার মতামত আমাদের কাছে গুরুত্বপূর্ণ
          </h2>

          <p className="mx-auto mt-4 max-w-xl leading-7 text-red-100">
            কোনো সংবাদ, পরামর্শ, অভিযোগ বা বিজ্ঞাপন সংক্রান্ত
            বিষয়ে আমাদের সঙ্গে যোগাযোগ করুন।
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
