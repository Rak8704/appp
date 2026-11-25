
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "বিজ্ঞাপন দিন | দৈনিক দিনলিপি",
  description:
    "দৈনিক দিনলিপিতে আপনার ব্যবসা, ব্র্যান্ড, পণ্য ও প্রতিষ্ঠানের বিজ্ঞাপন দিন। Banner Ads, Sponsored Articles এবং Brand Promotion সুবিধা নিন।",
};

const advertisingOptions = [
  {
    number: "01",
    title: "ব্যানার বিজ্ঞাপন",
    subtitle: "Banner Advertising",
    description:
      "ওয়েবসাইটের গুরুত্বপূর্ণ স্থানে আকর্ষণীয় ব্যানার বিজ্ঞাপনের মাধ্যমে আপনার পণ্য ও সেবা পাঠকদের সামনে তুলে ধরুন।",
    features: [
      "হোমপেজে ব্যানার প্রদর্শন",
      "নিউজ পেজে বিজ্ঞাপন",
      "ক্যাটাগরি পেজে বিজ্ঞাপন",
      "মোবাইল ও ডেস্কটপ সাপোর্ট",
    ],
  },
  {
    number: "02",
    title: "স্পন্সরড আর্টিকেল",
    subtitle: "Sponsored Article",
    description:
      "আপনার প্রতিষ্ঠান, পণ্য বা সেবা সম্পর্কে বিস্তারিত স্পন্সরড আর্টিকেল প্রকাশের মাধ্যমে পাঠকদের কাছে পৌঁছে যান।",
    features: [
      "ব্র্যান্ড পরিচিতিমূলক কনটেন্ট",
      "পণ্য ও সেবার বিস্তারিত তথ্য",
      "ছবি ও প্রয়োজনীয় লিংক",
      "নির্ধারিত স্পন্সরড পরিচিতি",
    ],
  },
  {
    number: "03",
    title: "ব্র্যান্ড প্রমোশন",
    subtitle: "Brand Promotion",
    description:
      "আপনার ব্র্যান্ডের পরিচিতি, প্রচারণা এবং অনলাইন উপস্থিতি বাড়াতে আমাদের বিজ্ঞাপন সুবিধা ব্যবহার করুন।",
    features: [
      "ব্র্যান্ড ক্যাম্পেইন",
      "প্রোডাক্ট প্রমোশন",
      "প্রতিষ্ঠানের পরিচিতি",
      "কাস্টম বিজ্ঞাপন পরিকল্পনা",
    ],
  },
];

const steps = [
  {
    number: "01",
    title: "যোগাযোগ করুন",
    description: "আপনার বিজ্ঞাপনের প্রয়োজন ও লক্ষ্য আমাদের জানান।",
  },
  {
    number: "02",
    title: "পরিকল্পনা নির্ধারণ",
    description: "বিজ্ঞাপনের ধরন, অবস্থান ও সময়সীমা আলোচনা করুন।",
  },
  {
    number: "03",
    title: "কনটেন্ট জমা দিন",
    description: "আপনার বিজ্ঞাপনের ছবি, লেখা ও প্রয়োজনীয় তথ্য দিন।",
  },
  {
    number: "04",
    title: "প্রকাশ ও প্রচার",
    description: "অনুমোদনের পর নির্ধারিত পরিকল্পনা অনুযায়ী বিজ্ঞাপন প্রকাশ করা হবে।",
  },
];

export default function AdvertisePage() {
  return (
    <main className="min-h-screen bg-white text-gray-900 dark:bg-[#101114] dark:text-gray-100">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-gray-200 bg-gradient-to-br from-red-50 via-white to-orange-50 dark:border-gray-800 dark:from-[#241416] dark:via-[#101114] dark:to-[#211912]">
        <div className="container-main mx-auto px-4 py-16 text-center sm:py-20 lg:py-24">
          <span className="inline-flex rounded-full border border-red-200 bg-red-100 px-4 py-2 text-sm font-semibold text-red-700 dark:border-red-900 dark:bg-red-950/50 dark:text-red-300">
            ADVERTISE WITH US
          </span>

          <h1 className="mx-auto mt-6 max-w-4xl text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">
            আপনার ব্র্যান্ডকে পৌঁছে দিন
            <span className="block text-red-600 dark:text-red-500">
              আরও বেশি মানুষের কাছে
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-gray-600 dark:text-gray-400 sm:text-lg">
            দৈনিক দিনলিপির মাধ্যমে আপনার পণ্য, সেবা ও প্রতিষ্ঠানের প্রচারণা
            করুন। আপনার ব্যবসার জন্য বেছে নিন উপযুক্ত ডিজিটাল বিজ্ঞাপন
            সমাধান।
          </p>

          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/contact?subject=বিজ্ঞাপন%20সংক্রান্ত%20যোগাযোগ"
              className="rounded-xl bg-red-600 px-7 py-3.5 text-center font-bold text-white transition hover:bg-red-700"
            >
              বিজ্ঞাপনের জন্য যোগাযোগ করুন
            </Link>

            <a
              href="#advertising-options"
              className="rounded-xl border border-gray-300 px-7 py-3.5 text-center font-bold transition hover:border-red-500 hover:text-red-600 dark:border-gray-700"
            >
              বিজ্ঞাপনের ধরন দেখুন
            </a>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="container-main mx-auto px-4 py-14 sm:py-16">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-red-600">
            Why Advertise With Us
          </p>

          <h2 className="mt-3 text-2xl font-extrabold sm:text-3xl">
            কেন দৈনিক দিনলিপিতে বিজ্ঞাপন দেবেন?
          </h2>

          <p className="mt-5 leading-8 text-gray-600 dark:text-gray-400">
            আপনার ব্র্যান্ডের প্রচারণার জন্য প্রয়োজন সঠিক প্ল্যাটফর্ম।
            দৈনিক দিনলিপিতে বিজ্ঞাপন দিয়ে পাঠকদের কাছে আপনার পণ্য ও সেবার
            পরিচিতি তুলে ধরার সুযোগ পাবেন। আমরা বিজ্ঞাপনদাতাদের প্রয়োজন
            অনুযায়ী প্রচারণার পরিকল্পনা সাজাতে সহায়তা করি।
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          {[
            {
              title: "বিভিন্ন বিজ্ঞাপন ফরম্যাট",
              description:
                "ব্যানার, স্পন্সরড আর্টিকেল ও ব্র্যান্ড প্রমোশনের সুযোগ।",
              icon: "📢",
            },
            {
              title: "নির্দিষ্ট প্রচারণা পরিকল্পনা",
              description:
                "আপনার ব্যবসার লক্ষ্য অনুযায়ী বিজ্ঞাপনের অবস্থান ও সময় নির্ধারণ।",
              icon: "🎯",
            },
            {
              title: "সহজ যোগাযোগ",
              description:
                "বিজ্ঞাপন সংক্রান্ত আলোচনা ও সহযোগিতার জন্য সরাসরি যোগাযোগ।",
              icon: "🤝",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm dark:border-gray-800 dark:bg-[#181a1f]"
            >
              <div className="text-4xl">{item.icon}</div>
              <h3 className="mt-4 text-lg font-bold">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-gray-600 dark:text-gray-400">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Advertising Options */}
      <section
        id="advertising-options"
        className="border-y border-gray-200 bg-gray-50 py-16 dark:border-gray-800 dark:bg-[#15171b]"
      >
        <div className="container-main mx-auto px-4">
          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-red-600">
              Advertising Solutions
            </p>
            <h2 className="mt-3 text-2xl font-extrabold sm:text-3xl">
              আমাদের বিজ্ঞাপন সেবাসমূহ
            </h2>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              আপনার প্রয়োজন অনুযায়ী বিজ্ঞাপনের ধরন বেছে নিন।
            </p>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {advertisingOptions.map((option) => (
              <article
                key={option.number}
                className="flex flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-gray-800 dark:bg-[#101114]"
              >
                <span className="text-sm font-extrabold text-red-600">
                  {option.number}
                </span>

                <h3 className="mt-4 text-xl font-extrabold">
                  {option.title}
                </h3>

                <p className="mt-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                  {option.subtitle}
                </p>

                <p className="mt-5 text-sm leading-7 text-gray-600 dark:text-gray-400">
                  {option.description}
                </p>

                <div className="mt-6 border-t border-gray-200 pt-5 dark:border-gray-800">
                  <p className="mb-4 font-bold">সুবিধাসমূহ</p>

                  <ul className="space-y-3">
                    {option.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400"
                      >
                        <span className="font-bold text-green-600">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-auto pt-7">
                  <Link
                    href={`/contact?subject=${encodeURIComponent(option.title)}`}
                    className="block rounded-xl bg-red-600 px-5 py-3 text-center text-sm font-bold text-white transition hover:bg-red-700"
                  >
                    বিস্তারিত জানতে যোগাযোগ করুন
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="container-main mx-auto px-4 py-16">
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-red-600">
            How It Works
          </p>
          <h2 className="mt-3 text-2xl font-extrabold sm:text-3xl">
            বিজ্ঞাপন দেওয়ার প্রক্রিয়া
          </h2>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <div
              key={step.number}
              className="rounded-2xl border border-gray-200 p-6 dark:border-gray-800"
            >
              <span className="text-3xl font-black text-red-600">
                {step.number}
              </span>
              <h3 className="mt-4 text-lg font-bold">{step.title}</h3>
              <p className="mt-3 text-sm leading-7 text-gray-600 dark:text-gray-400">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container-main mx-auto px-4 pb-16">
        <div className="rounded-3xl bg-gradient-to-r from-red-700 to-red-600 px-6 py-12 text-center text-white sm:px-12 sm:py-16">
          <h2 className="text-2xl font-extrabold sm:text-3xl">
            আপনার বিজ্ঞাপন প্রচারণা শুরু করতে প্রস্তুত?
          </h2>

          <p className="mx-auto mt-5 max-w-2xl leading-8 text-red-100">
            আপনার বিজ্ঞাপনের ধরন, বাজেট ও প্রচারণার পরিকল্পনা নিয়ে আমাদের
            সঙ্গে যোগাযোগ করুন। আপনার প্রয়োজন অনুযায়ী আলোচনা করা হবে।
          </p>

          <Link
            href="/contact?subject=বিজ্ঞাপন%20সংক্রান্ত%20আলোচনা"
            className="mt-8 inline-flex rounded-xl bg-white px-8 py-3.5 font-bold text-red-700 transition hover:bg-gray-100"
          >
            আমাদের সঙ্গে যোগাযোগ করুন
          </Link>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="border-t border-gray-200 py-7 dark:border-gray-800">
        <div className="container-main mx-auto px-4">
          <p className="text-center text-xs leading-6 text-gray-500 dark:text-gray-500">
            বিজ্ঞাপনের মূল্য, অবস্থান, সময়সীমা ও প্রকাশের শর্ত আলোচনা সাপেক্ষে
            নির্ধারিত হবে। সকল বিজ্ঞাপন প্রকাশের আগে সম্পাদকীয় ও বিজ্ঞাপন
            নীতিমালা অনুযায়ী যাচাই করা হতে পারে।
          </p>
        </div>
      </section>
    </main>
  );
}
