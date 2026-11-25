
"use client";

import { useState } from "react";

const faqs = [
  {
    question: "দৈনিক দিনলিপি কী?",
    answer:
      "দৈনিক দিনলিপি একটি অনলাইন সংবাদমাধ্যম। এখানে জাতীয়, আন্তর্জাতিক, রাজনীতি, অর্থনীতি, খেলাধুলা, বিনোদনসহ বিভিন্ন বিষয়ের সংবাদ প্রকাশ করা হয়।",
  },
  {
    question: "কীভাবে সর্বশেষ সংবাদ পড়ব?",
    answer:
      "ওয়েবসাইটের সর্বশেষ সংবাদ বিভাগে প্রবেশ করলে সাম্প্রতিক প্রকাশিত সংবাদগুলো দেখতে পারবেন।",
  },
  {
    question: "দৈনিক দিনলিপিতে সংবাদ পাঠানো যাবে কি?",
    answer:
      "আপনার কাছে গুরুত্বপূর্ণ কোনো সংবাদ বা তথ্য থাকলে আমাদের যোগাযোগ পেজের মাধ্যমে সম্পাদকীয় বিভাগের সঙ্গে যোগাযোগ করতে পারেন।",
  },
  {
    question: "প্রকাশিত সংবাদে ভুল থাকলে কী করব?",
    answer:
      "সংবাদটির লিংক এবং ভুলের বিবরণ উল্লেখ করে আমাদের যোগাযোগ পেজের মাধ্যমে জানাতে পারেন। সম্পাদকীয় বিভাগ বিষয়টি পর্যালোচনা করবে।",
  },
  {
    question: "বিজ্ঞাপন দিতে চাইলে কী করতে হবে?",
    answer:
      "বিজ্ঞাপন সংক্রান্ত তথ্য ও সহযোগিতার জন্য আমাদের বিজ্ঞাপন পেজে যান অথবা যোগাযোগ করুন।",
  },
  {
    question: "দৈনিক দিনলিপির সঙ্গে কীভাবে যোগাযোগ করব?",
    answer:
      "যোগাযোগ পেজে গিয়ে আপনার নাম, ইমেইল এবং বার্তা পাঠিয়ে আমাদের সঙ্গে যোগাযোগ করতে পারবেন।",
  },
  {
    question: "ওয়েবসাইটে প্রকাশিত সংবাদ শেয়ার করা যাবে?",
    answer:
      "সংবাদের মূল লিংক উল্লেখ করে ব্যক্তিগতভাবে শেয়ার করতে পারবেন। সংবাদ পুনঃপ্রকাশের ক্ষেত্রে আমাদের নীতিমালা অনুসরণ করতে হবে।",
  },
  {
    question: "দৈনিক দিনলিপির গোপনীয়তা নীতি কোথায় পাব?",
    answer:
      "আমাদের ওয়েবসাইটের Privacy Policy পেজে তথ্য সংগ্রহ ও ব্যবহারের নীতিমালা সম্পর্কে জানতে পারবেন।",
  },
];

export default function FAQPage() {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="bg-slate-900 px-4 py-16 text-center text-white">
        <p className="mb-3 text-sm font-semibold text-red-400">
          সহায়তা কেন্দ্র
        </p>

        <h1 className="text-3xl font-bold md:text-5xl">
          সচরাচর জিজ্ঞাসা
        </h1>

        <p className="mx-auto mt-4 max-w-2xl leading-7 text-gray-300">
          দৈনিক দিনলিপি সম্পর্কে সাধারণ প্রশ্ন ও তার উত্তর এখানে পাবেন।
        </p>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-14">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900">
            আপনার প্রশ্নের উত্তর খুঁজুন
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            নিচের প্রশ্নগুলোর ওপর ক্লিক করে উত্তর দেখুন।
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
            >
              <button
                type="button"
                onClick={() =>
                  setActiveIndex(
                    activeIndex === index ? null : index
                  )
                }
                aria-expanded={activeIndex === index}
                className="flex w-full items-center justify-between gap-4 p-5 text-left"
              >
                <span className="font-semibold text-gray-900">
                  {faq.question}
                </span>

                <span className="shrink-0 text-2xl text-red-600">
                  {activeIndex === index ? "−" : "+"}
                </span>
              </button>

              {activeIndex === index && (
                <div className="border-t border-gray-100 px-5 py-5">
                  <p className="leading-8 text-gray-600">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-2xl bg-red-50 p-8 text-center">
          <h3 className="text-xl font-bold text-gray-900">
            আপনার প্রশ্নের উত্তর পাননি?
          </h3>

          <p className="mt-2 text-gray-600">
            আমাদের সঙ্গে যোগাযোগ করুন। আমরা সহযোগিতা করতে প্রস্তুত।
          </p>

          <a
            href="/contact"
            className="mt-5 inline-flex rounded-lg bg-red-600 px-6 py-3 font-semibold text-white hover:bg-red-700"
          >
            যোগাযোগ করুন →
          </a>
        </div>
      </section>
    </main>
  );
}
