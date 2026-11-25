
import Link from "next/link";
import { notFound } from "next/navigation";

const positions = [
  {
    slug: "staff-reporter",
    title: "স্টাফ রিপোর্টার",
    type: "পূর্ণকালীন",
    department: "নিউজ বিভাগ",
    location: "ঢাকা, বাংলাদেশ",
    description:
      "দেশের গুরুত্বপূর্ণ সংবাদ সংগ্রহ, যাচাই এবং প্রতিবেদন তৈরিতে কাজ করতে হবে।",
    responsibilities: [
      "জাতীয় ও স্থানীয় সংবাদ সংগ্রহ করা।",
      "সংবাদের সত্যতা যাচাই করা।",
      "তথ্যসূত্র ও সাক্ষাৎকার সংগ্রহ করা।",
      "নির্ধারিত সময়ের মধ্যে প্রতিবেদন জমা দেওয়া।",
    ],
    requirements: [
      "সাংবাদিকতা বা সংশ্লিষ্ট বিষয়ে শিক্ষাগত যোগ্যতা।",
      "বাংলা ভাষায় ভালো লেখার দক্ষতা।",
      "সংবাদ সংগ্রহ ও গবেষণার অভিজ্ঞতা থাকলে অগ্রাধিকার।",
      "দায়িত্বশীলতা ও সময়ানুবর্তিতা।",
    ],
  },
  {
    slug: "online-news-editor",
    title: "অনলাইন নিউজ এডিটর",
    type: "পূর্ণকালীন",
    department: "সম্পাদকীয় বিভাগ",
    location: "ঢাকা, বাংলাদেশ",
    description:
      "অনলাইন সংবাদ সম্পাদনা, শিরোনাম তৈরি এবং প্রকাশনার মান নিয়ন্ত্রণ করতে হবে।",
    responsibilities: [
      "সংবাদ সম্পাদনা ও প্রুফরিডিং করা।",
      "সংবাদের উপযুক্ত শিরোনাম তৈরি করা।",
      "সংবাদ প্রকাশের আগে তথ্য যাচাই করা।",
      "অনলাইন প্রকাশনার মান বজায় রাখা।",
    ],
    requirements: [
      "বাংলা ভাষা ও ব্যাকরণে ভালো দক্ষতা।",
      "সংবাদ সম্পাদনার অভিজ্ঞতা।",
      "ডিজিটাল নিউজ প্রকাশনা সম্পর্কে ধারণা।",
      "দলগতভাবে কাজ করার মানসিকতা।",
    ],
  },
  {
    slug: "video-journalist",
    title: "ভিডিও জার্নালিস্ট",
    type: "পূর্ণকালীন",
    department: "মাল্টিমিডিয়া বিভাগ",
    location: "ঢাকা, বাংলাদেশ",
    description:
      "ভিডিও সংবাদ তৈরি, ভিডিও ধারণ এবং মাল্টিমিডিয়া কনটেন্ট প্রস্তুত করতে হবে।",
    responsibilities: [
      "সংবাদভিত্তিক ভিডিও ধারণ করা।",
      "ভিডিও এডিটিং ও পোস্ট-প্রোডাকশন করা।",
      "ভিডিওর জন্য প্রয়োজনীয় ফুটেজ সংগ্রহ করা।",
      "সামাজিক যোগাযোগমাধ্যমের উপযোগী ভিডিও তৈরি করা।",
    ],
    requirements: [
      "ভিডিও ধারণ ও এডিটিংয়ের দক্ষতা।",
      "ক্যামেরা ও ভিডিও এডিটিং সফটওয়্যার সম্পর্কে ধারণা।",
      "সৃজনশীলতা ও সময়ানুবর্তিতা।",
      "মাল্টিমিডিয়া সাংবাদিকতার অভিজ্ঞতা থাকলে অগ্রাধিকার।",
    ],
  },
];

export default async function CareerDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const job = positions.find((position) => position.slug === slug);

  if (!job) notFound();

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="bg-slate-950 px-4 py-16 text-white">
        <div className="mx-auto max-w-5xl">
          <Link
            href="/careers"
            className="mb-8 inline-block text-sm text-gray-300 hover:text-white"
          >
            ← সকল চাকরির বিজ্ঞপ্তি
          </Link>

          <p className="mb-3 text-sm font-semibold text-red-400">
            ক্যারিয়ার | দৈনিক দিনলিপি
          </p>

          <h1 className="text-3xl font-bold md:text-5xl">
            {job.title}
          </h1>

          <div className="mt-6 flex flex-wrap gap-3">
            <span className="rounded-full bg-white/10 px-4 py-2 text-sm">
              {job.department}
            </span>
            <span className="rounded-full bg-white/10 px-4 py-2 text-sm">
              {job.type}
            </span>
            <span className="rounded-full bg-white/10 px-4 py-2 text-sm">
              {job.location}
            </span>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-8 px-4 py-12 lg:grid-cols-[1fr_300px]">
        <div className="space-y-8">
          <div className="rounded-2xl border border-gray-100 bg-white p-7 shadow-sm">
            <h2 className="mb-4 text-xl font-bold text-gray-900">
              চাকরির বিবরণ
            </h2>
            <p className="leading-8 text-gray-600">
              {job.description}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-7 shadow-sm">
            <h2 className="mb-5 text-xl font-bold text-gray-900">
              দায়িত্ব ও কাজ
            </h2>
            <ul className="space-y-4">
              {job.responsibilities.map((item) => (
                <li key={item} className="flex gap-3 text-gray-600">
                  <span className="font-bold text-green-600">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-7 shadow-sm">
            <h2 className="mb-5 text-xl font-bold text-gray-900">
              যোগ্যতা ও অভিজ্ঞতা
            </h2>
            <ul className="space-y-4">
              {job.requirements.map((item) => (
                <li key={item} className="flex gap-3 text-gray-600">
                  <span className="font-bold text-red-600">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <aside>
          <div className="sticky top-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900">
              আবেদন করতে চান?
            </h2>

            <p className="mt-3 text-sm leading-7 text-gray-500">
              এই পদের জন্য আবেদন বা নিয়োগ সংক্রান্ত তথ্য জানতে
              আমাদের সঙ্গে যোগাযোগ করুন।
            </p>

            <Link
              href="/contact"
              className="mt-6 flex w-full justify-center rounded-lg bg-red-600 px-5 py-3 font-semibold text-white hover:bg-red-700"
            >
              আবেদন ও যোগাযোগ →
            </Link>

            <Link
              href="/careers"
              className="mt-3 flex w-full justify-center rounded-lg border border-gray-200 px-5 py-3 font-semibold text-gray-700 hover:bg-gray-50"
            >
              অন্যান্য চাকরি দেখুন
            </Link>
          </div>
        </aside>
      </section>
    </main>
  );
}
