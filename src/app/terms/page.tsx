
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "ব্যবহারের শর্তাবলি | দৈনিক দিনলিপি",
  description:
    "দৈনিক দিনলিপি ওয়েবসাইট ব্যবহারের নিয়ম, শর্তাবলি ও ব্যবহারকারীর দায়িত্ব সম্পর্কে জানুন।",
};

const sections = [
  {
    title: "১. শর্তাবলির গ্রহণযোগ্যতা",
    content: `দৈনিক দিনলিপি ওয়েবসাইটে আপনাকে স্বাগতম।

এই ওয়েবসাইট ব্যবহার করার মাধ্যমে আপনি এখানে উল্লেখিত ব্যবহারের শর্তাবলি মেনে চলতে সম্মত হচ্ছেন।

আপনি যদি এই শর্তাবলির কোনো অংশের সঙ্গে একমত না হন, তাহলে ওয়েবসাইট ব্যবহার করা থেকে বিরত থাকতে পারেন।`,
  },
  {
    title: "২. ওয়েবসাইটের উদ্দেশ্য",
    content: `দৈনিক দিনলিপি একটি অনলাইন সংবাদমাধ্যম।

এই ওয়েবসাইটে জাতীয়, আন্তর্জাতিক, রাজনীতি, অর্থনীতি, খেলাধুলা, বিনোদন, প্রযুক্তি, শিক্ষা, স্বাস্থ্যসহ বিভিন্ন বিষয়ে সংবাদ, প্রতিবেদন ও তথ্য প্রকাশ করা হয়।

আমরা পাঠকদের কাছে তথ্য পৌঁছে দিতে এবং দায়িত্বশীল সাংবাদিকতা চর্চা করতে প্রতিশ্রুতিবদ্ধ।`,
  },
  {
    title: "৩. সংবাদ ও তথ্যের ব্যবহার",
    content: `আমাদের ওয়েবসাইটে প্রকাশিত সংবাদ ও তথ্য সাধারণ তথ্যের উদ্দেশ্যে সরবরাহ করা হয়।

আমরা তথ্যের নির্ভুলতা ও নির্ভরযোগ্যতা বজায় রাখার চেষ্টা করি। তবে সব তথ্য সব সময় সম্পূর্ণ বা হালনাগাদ থাকবে—এমন নিশ্চয়তা দেওয়া হয় না।

গুরুত্বপূর্ণ সিদ্ধান্ত নেওয়ার আগে পাঠকদের প্রয়োজন অনুযায়ী তথ্যের সত্যতা যাচাই করার পরামর্শ দেওয়া হচ্ছে।`,
  },
  {
    title: "৪. কপিরাইট ও মেধাস্বত্ব",
    content: `দৈনিক দিনলিপির নিজস্বভাবে তৈরি লেখা, ডিজাইন, লোগো, গ্রাফিক্স এবং অন্যান্য উপকরণ প্রযোজ্য মেধাস্বত্ব আইনের অধীন সুরক্ষিত হতে পারে।

আমাদের অনুমতি ছাড়া নিজস্ব কনটেন্ট সম্পূর্ণ বা উল্লেখযোগ্য অংশ পুনঃপ্রকাশ, বাণিজ্যিক ব্যবহার বা বিতরণ করা যাবে না।

অন্য কোনো উৎসের কনটেন্ট প্রকাশিত হলে সংশ্লিষ্ট উৎস বা মালিকের অধিকার যথাযথভাবে সম্মান করা হবে।

সংবাদ শেয়ার করার ক্ষেত্রে মূল সংবাদ লিংক ব্যবহার করার অনুরোধ করা হচ্ছে।`,
  },
  {
    title: "৫. ব্যবহারকারীর দায়িত্ব",
    content: `ওয়েবসাইট ব্যবহার করার সময় আপনি সম্মত হচ্ছেন যে:

• কোনো বেআইনি উদ্দেশ্যে ওয়েবসাইট ব্যবহার করবেন না।
• মিথ্যা, বিভ্রান্তিকর বা মানহানিকর তথ্য জমা দেবেন না।
• অন্যের ব্যক্তিগত তথ্য অনুমতি ছাড়া প্রকাশ করবেন না।
• ওয়েবসাইটের নিরাপত্তা নষ্ট করার চেষ্টা করবেন না।
• স্প্যাম, ক্ষতিকর কোড বা অননুমোদিত বিজ্ঞাপন পাঠাবেন না।
• অন্য ব্যবহারকারীর অধিকার ও গোপনীয়তা সম্মান করবেন।`,
  },
  {
    title: "৬. মন্তব্য ও পাঠকের মতামত",
    content: `ওয়েবসাইটে মন্তব্য বা মতামত দেওয়ার সুবিধা চালু থাকলে ব্যবহারকারীদের দায়িত্বশীল আচরণ করতে হবে।

নিম্নলিখিত ধরনের মন্তব্য গ্রহণযোগ্য নয়:

• অশালীন বা আপত্তিকর ভাষা।
• ব্যক্তিগত আক্রমণ বা হয়রানি।
• ধর্মীয়, সামাজিক বা গোষ্ঠীগত বিদ্বেষ ছড়ানো।
• মিথ্যা বা মানহানিকর অভিযোগ।
• স্প্যাম ও অননুমোদিত প্রচারণা।

নীতিমালা লঙ্ঘনকারী মন্তব্য অপসারণ বা সংশ্লিষ্ট ব্যবহারকারীর প্রবেশাধিকার সীমিত করার অধিকার কর্তৃপক্ষ সংরক্ষণ করে।`,
  },
  {
    title: "৭. তৃতীয় পক্ষের লিংক",
    content: `আমাদের সংবাদ বা ওয়েবসাইটে অন্য ওয়েবসাইটের লিংক থাকতে পারে।

এসব তৃতীয় পক্ষের ওয়েবসাইটের কনটেন্ট, নিরাপত্তা, গোপনীয়তা নীতি বা কার্যক্রমের জন্য দৈনিক দিনলিপি দায়ী নয়।

কোনো বাহ্যিক ওয়েবসাইট ব্যবহার করার আগে তার নিজস্ব শর্তাবলি ও গোপনীয়তা নীতি পড়ে নেওয়ার পরামর্শ দেওয়া হচ্ছে।`,
  },
  {
    title: "৮. বিজ্ঞাপন ও স্পনসরড কনটেন্ট",
    content: `আমাদের ওয়েবসাইটে বিজ্ঞাপন, স্পনসরড কনটেন্ট বা তৃতীয় পক্ষের প্রচারণা প্রদর্শিত হতে পারে।

বিজ্ঞাপনদাতার নিজস্ব পণ্য, সেবা বা প্রতিশ্রুতির জন্য সংশ্লিষ্ট বিজ্ঞাপনদাতা দায়ী থাকবেন।

বিজ্ঞাপন প্রদর্শিত হওয়ার অর্থ এই নয় যে দৈনিক দিনলিপি সংশ্লিষ্ট পণ্য বা সেবার সব দাবি যাচাই বা অনুমোদন করেছে।

স্পনসরড কনটেন্ট থাকলে যথাসম্ভব তা আলাদাভাবে চিহ্নিত করা হবে।`,
  },
  {
    title: "৯. ওয়েবসাইটের প্রাপ্যতা",
    content: `ওয়েবসাইটটি নিরবচ্ছিন্নভাবে সচল রাখার চেষ্টা করা হয়।

তবে রক্ষণাবেক্ষণ, প্রযুক্তিগত সমস্যা, সার্ভার ত্রুটি বা নিয়ন্ত্রণের বাইরের কারণে সাময়িকভাবে ওয়েবসাইট বন্ধ থাকতে পারে।

প্রয়োজনে ওয়েবসাইটের কোনো ফিচার পরিবর্তন, স্থগিত বা বন্ধ করার অধিকার কর্তৃপক্ষ সংরক্ষণ করে।`,
  },
  {
    title: "১০. দায়বদ্ধতার সীমা",
    content: `ওয়েবসাইট ব্যবহারের ফলে প্রত্যক্ষ বা পরোক্ষভাবে কোনো ক্ষতি হলে প্রযোজ্য আইন অনুযায়ী দায় নির্ধারিত হবে।

আমরা যথাসম্ভব নির্ভুল তথ্য ও নিরাপদ সেবা দেওয়ার চেষ্টা করি। তবে প্রযুক্তিগত ত্রুটি, তৃতীয় পক্ষের কার্যক্রম বা অনিয়ন্ত্রিত পরিস্থিতির জন্য সর্বাবস্থায় দায়মুক্তির নিশ্চয়তা দেওয়া হচ্ছে না।

এই শর্তাবলির কোনো কিছুই প্রযোজ্য আইনে নিষিদ্ধ কোনো দায় বাদ দেওয়ার উদ্দেশ্যে প্রযোজ্য হবে না।`,
  },
  {
    title: "১১. গোপনীয়তা নীতিমালা",
    content: `আপনার ব্যক্তিগত তথ্য কীভাবে সংগ্রহ, ব্যবহার ও সংরক্ষণ করা হয়, তা জানতে আমাদের গোপনীয়তা নীতিমালা দেখুন।

গোপনীয়তা নীতিমালা এই ব্যবহারের শর্তাবলির একটি গুরুত্বপূর্ণ পরিপূরক।`,
    link: {
      label: "গোপনীয়তা নীতিমালা পড়ুন",
      href: "/privacy-policy",
    },
  },
  {
    title: "১২. শর্তাবলির পরিবর্তন",
    content: `প্রয়োজন অনুযায়ী দৈনিক দিনলিপি এই ব্যবহারের শর্তাবলি পরিবর্তন, সংশোধন বা হালনাগাদ করতে পারে।

পরিবর্তিত শর্তাবলি এই পেজে প্রকাশ করা হবে।

পরিবর্তনের পর ওয়েবসাইট ব্যবহার অব্যাহত রাখার ক্ষেত্রে হালনাগাদ শর্তাবলি প্রযোজ্য হবে, তবে প্রযোজ্য আইনে প্রয়োজনীয় অতিরিক্ত সম্মতি থাকলে তা আলাদাভাবে নেওয়া হবে।`,
  },
  {
    title: "১৩. প্রযোজ্য আইন",
    content: `এই শর্তাবলি বাংলাদেশের প্রযোজ্য আইন ও বিধিবিধানের সঙ্গে সামঞ্জস্য রেখে পরিচালিত হবে।

কোনো বিরোধ দেখা দিলে প্রযোজ্য আইন অনুযায়ী তা সমাধানের চেষ্টা করা হবে।`,
  },
  {
    title: "১৪. যোগাযোগ",
    content: `এই ব্যবহারের শর্তাবলি সম্পর্কে কোনো প্রশ্ন, অভিযোগ বা পরামর্শ থাকলে আমাদের সঙ্গে যোগাযোগ করুন।

ওয়েবসাইট: দৈনিক দিনলিপি
ঠিকানা: ঢাকা, বাংলাদেশ`,
    link: {
      label: "যোগাযোগ করুন",
      href: "/contact",
    },
  },
];

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-10 dark:bg-gray-950">
      <div className="container-main mx-auto max-w-5xl px-4">

        {/* Breadcrumb */}
        <div className="mb-8 text-sm text-gray-500 dark:text-gray-400">
          <Link href="/" className="transition hover:text-red-600">
            প্রচ্ছদ
          </Link>
          <span className="mx-2">/</span>
          ব্যবহারের শর্তাবলি
        </div>

        {/* Hero */}
        <section className="relative overflow-hidden rounded-3xl bg-gray-950 px-6 py-14 text-center text-white md:px-12 md:py-20">
          <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-red-600/20 blur-3xl" />
          <div className="absolute -bottom-20 -left-16 h-64 w-64 rounded-full bg-red-600/20 blur-3xl" />

          <div className="relative">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl border border-red-400/30 bg-red-600/20 text-4xl">
              ⚖️
            </div>

            <h1 className="mt-7 text-3xl font-extrabold md:text-5xl">
              ব্যবহারের শর্তাবলি
            </h1>

            <p className="mx-auto mt-5 max-w-2xl leading-8 text-gray-300">
              দৈনিক দিনলিপি ওয়েবসাইট ব্যবহারের নিয়ম,
              শর্তাবলি ও আপনার দায়িত্ব সম্পর্কে বিস্তারিত জানুন।
            </p>

            <div className="mt-7 inline-flex rounded-full border border-white/20 bg-white/10 px-5 py-2 text-xs text-gray-300">
              দৈনিক দিনলিপি
            </div>
          </div>
        </section>

        {/* Important Notice */}
        <section className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-6 dark:border-red-950 dark:bg-red-950/20">
          <h2 className="font-bold text-gray-900 dark:text-white">
            গুরুত্বপূর্ণ বিজ্ঞপ্তি
          </h2>

          <p className="mt-3 text-sm leading-8 text-gray-700 dark:text-gray-300">
            এই পেজে প্রকাশিত শর্তাবলি একটি প্রাথমিক খসড়া।
            ওয়েবসাইটের প্রকৃত কার্যক্রম, বিজ্ঞাপন, মন্তব্য ব্যবস্থা,
            তৃতীয় পক্ষের সেবা এবং প্রযোজ্য আইন অনুযায়ী এটি
            পর্যালোচনা ও হালনাগাদ করা প্রয়োজন।
          </p>
        </section>

        {/* Introduction */}
        <section className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 md:p-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            ভূমিকা
          </h2>

          <p className="mt-4 text-sm leading-8 text-gray-600 dark:text-gray-400">
            দৈনিক দিনলিপির ওয়েবসাইট ব্যবহার করার আগে
            অনুগ্রহ করে নিচের শর্তাবলি মনোযোগ দিয়ে পড়ুন।
            এই শর্তাবলি ওয়েবসাইটের পাঠক ও ব্যবহারকারীদের
            জন্য প্রযোজ্য।
          </p>
        </section>

        {/* Terms Sections */}
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

                  {"link" in section && section.link && (
                    <Link
                      href={section.link.href}
                      className="mt-4 inline-flex font-semibold text-red-600 transition hover:text-red-700"
                    >
                      {section.link.label} →
                    </Link>
                  )}
                </div>
              </div>
            </section>
          ))}
        </div>

        {/* Bottom Contact */}
        <section className="mt-10 rounded-3xl bg-red-600 px-6 py-12 text-center text-white md:px-12">
          <h2 className="text-2xl font-extrabold md:text-3xl">
            আরও কিছু জানতে চান?
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-red-100">
            ব্যবহারের শর্তাবলি সম্পর্কে কোনো প্রশ্ন থাকলে
            আমাদের সঙ্গে যোগাযোগ করুন।
          </p>

          <Link
            href="/contact"
            className="mt-7 inline-flex rounded-lg bg-white px-7 py-3 font-bold text-red-600 transition hover:bg-gray-100"
          >
            যোগাযোগ করুন →
          </Link>
        </section>

        {/* Footer Link */}
        <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-gray-500 dark:text-gray-400">
          <Link href="/" className="hover:text-red-600">
            প্রচ্ছদ
          </Link>

          <Link href="/about" className="hover:text-red-600">
            আমাদের সম্পর্কে
          </Link>

          <Link href="/privacy-policy" className="hover:text-red-600">
            গোপনীয়তা নীতিমালা
          </Link>

          <Link href="/contact" className="hover:text-red-600">
            যোগাযোগ
          </Link>
        </div>

      </div>
    </main>
  );
}
