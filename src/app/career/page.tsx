
import Link from "next/link";

const positions = [
  {
    title: "স্টাফ রিপোর্টার",
    type: "পূর্ণকালীন",
    department: "নিউজ বিভাগ",
    description:
      "দেশের গুরুত্বপূর্ণ সংবাদ সংগ্রহ, যাচাই এবং প্রতিবেদন তৈরিতে কাজ করতে হবে।",
  },
  {
    title: "অনলাইন নিউজ এডিটর",
    type: "পূর্ণকালীন",
    department: "সম্পাদকীয় বিভাগ",
    description:
      "অনলাইন সংবাদ সম্পাদনা, শিরোনাম তৈরি এবং প্রকাশনার মান নিয়ন্ত্রণ করতে হবে।",
  },
  {
    title: "ভিডিও জার্নালিস্ট",
    type: "পূর্ণকালীন",
    department: "মাল্টিমিডিয়া বিভাগ",
    description:
      "ভিডিও সংবাদ তৈরি, ভিডিও ধারণ এবং মাল্টিমিডিয়া কনটেন্ট প্রস্তুত করতে হবে।",
  },
];

export default function CareersPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <section className="bg-slate-950 px-4 py-20 text-center text-white">
        <div className="mx-auto max-w-4xl">
          <p className="mb-3 text-sm font-semibold text-red-400">
            আমাদের সঙ্গে যুক্ত হোন
          </p>

          <h1 className="text-3xl font-bold md:text-5xl">
            ক্যারিয়ার গড়ুন দৈনিক দিনলিপির সঙ্গে
          </h1>

          <p className="mx-auto mt-5 max-w-2xl leading-8 text-gray-300">
            সত্যনিষ্ঠ সাংবাদিকতা, দায়িত্বশীল সংবাদ পরিবেশনা এবং
            মানসম্মত কনটেন্ট তৈরিতে আগ্রহী প্রতিভাবানদের আমরা স্বাগত জানাই।
          </p>

          <a
            href="#positions"
            className="mt-8 inline-flex rounded-lg bg-red-600 px-7 py-3 font-semibold text-white hover:bg-red-700"
          >
            চাকরির সুযোগ দেখুন
          </a>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
            কেন আমাদের সঙ্গে কাজ করবেন?
          </h2>

          <p className="mt-3 text-gray-500">
            দায়িত্বশীল সাংবাদিকতা ও পেশাগত দক্ষতা বিকাশের সুযোগ।
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {[
            {
              icon: "🎯",
              title: "অর্থবহ কাজ",
              text: "সঠিক তথ্য ও দায়িত্বশীল সংবাদ পরিবেশনায় অবদান রাখুন।",
            },
            {
              icon: "📚",
              title: "দক্ষতা উন্নয়ন",
              text: "সাংবাদিকতা ও মিডিয়া বিষয়ে অভিজ্ঞতা এবং দক্ষতা বাড়ান।",
            },
            {
              icon: "🤝",
              title: "টিমওয়ার্ক",
              text: "একটি পেশাদার সংবাদকর্মী দলের সঙ্গে কাজ করুন।",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-gray-100 bg-white p-7 text-center shadow-sm"
            >
              <div className="text-4xl">{item.icon}</div>

              <h3 className="mt-4 text-xl font-bold text-gray-900">
                {item.title}
              </h3>

              <p className="mt-3 leading-7 text-gray-500">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section
        id="positions"
        className="mx-auto max-w-5xl px-4 pb-16"
      >
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            সম্ভাব্য পদসমূহ
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            নিচের পদগুলো নমুনা। প্রকৃত নিয়োগ বিজ্ঞপ্তি প্রকাশের আগে
            এগুলো যাচাই করে নেবেন।
          </p>
        </div>

        <div className="space-y-5">
          {positions.map((position) => (
            <div
              key={position.title}
              className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
            >
              <div className="flex flex-col justify-between gap-4 sm:flex-row">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {position.title}
                  </h3>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600">
                      {position.department}
                    </span>

                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                      {position.type}
                    </span>
                  </div>

                  <p className="mt-4 leading-7 text-gray-600">
                    {position.description}
                  </p>
                </div>

                <div className="shrink-0">
                  <Link
                    href="/contact"
                    className="inline-flex rounded-lg bg-red-600 px-5 py-3 text-sm font-semibold text-white hover:bg-red-700"
                  >
                    যোগাযোগ করুন →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-2xl bg-slate-900 p-8 text-center text-white">
          <h3 className="text-xl font-bold">
            আপনার CV পাঠাতে চান?
          </h3>

          <p className="mt-3 text-gray-300">
            নিয়োগ সংক্রান্ত যোগাযোগের জন্য আমাদের Contact পেজ ব্যবহার করুন।
          </p>

          <Link
            href="/contact"
            className="mt-5 inline-flex rounded-lg bg-white px-6 py-3 font-semibold text-slate-900 hover:bg-gray-100"
          >
            যোগাযোগ করুন
          </Link>
        </div>
      </section>
    </main>
  );
}
