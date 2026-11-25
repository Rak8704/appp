
"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setSuccess(false);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      subject: formData.get("subject"),
      message: formData.get("message"),
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "মেসেজ পাঠানো যায়নি।");
      }

      setSuccess(true);
      setMessage("আপনার মেসেজ সফলভাবে পাঠানো হয়েছে। ধন্যবাদ!");

      form.reset();
    } catch (error) {
      setSuccess(false);
      setMessage(
        error instanceof Error
          ? error.message
          : "কিছু সমস্যা হয়েছে। আবার চেষ্টা করুন।"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12 dark:bg-gray-950">
      <div className="container-main mx-auto px-4">

        {/* Breadcrumb */}
        <div className="mb-8 text-sm text-gray-500 dark:text-gray-400">
          <Link href="/" className="hover:text-red-600">
            প্রচ্ছদ
          </Link>
          <span className="mx-2">/</span>
          যোগাযোগ
        </div>

        {/* Heading */}
        <div className="mb-12 text-center">
          <span className="mb-3 inline-block rounded-full bg-red-100 px-4 py-2 text-sm font-semibold text-red-600 dark:bg-red-950/40 dark:text-red-400">
            আমরা আপনার কথা শুনতে চাই
          </span>

          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white md:text-4xl">
            যোগাযোগ করুন
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-gray-600 dark:text-gray-400">
            আপনার মতামত, পরামর্শ, সংবাদ বা যেকোনো প্রয়োজনে
            আমাদের সঙ্গে যোগাযোগ করুন।
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">

          {/* Contact Information */}
          <div className="space-y-5">

            <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-gray-900">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-2xl dark:bg-red-950/40">
                📍
              </div>

              <h3 className="mb-2 text-lg font-bold text-gray-900 dark:text-white">
                আমাদের ঠিকানা
              </h3>

              <p className="text-sm leading-6 text-gray-600 dark:text-gray-400">
                দৈনিক দিনলিপি
                <br />
                ঢাকা, বাংলাদেশ
              </p>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-gray-900">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-2xl dark:bg-red-950/40">
                ✉️
              </div>

              <h3 className="mb-2 text-lg font-bold text-gray-900 dark:text-white">
                ইমেইল
              </h3>

              <p className="text-sm text-gray-600 dark:text-gray-400">
                আপনার ইমেইল ঠিকানা Site Settings থেকে যুক্ত করুন।
              </p>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-gray-900">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-2xl dark:bg-red-950/40">
                📞
              </div>

              <h3 className="mb-2 text-lg font-bold text-gray-900 dark:text-white">
                ফোন
              </h3>

              <p className="text-sm text-gray-600 dark:text-gray-400">
                আপনার যোগাযোগ নম্বর Site Settings থেকে যুক্ত করুন।
              </p>
            </div>

            <div className="rounded-2xl bg-red-600 p-6 text-white">
              <h3 className="mb-2 text-lg font-bold">
                সংবাদ পাঠাতে চান?
              </h3>

              <p className="text-sm leading-6 text-red-100">
                আপনার এলাকার গুরুত্বপূর্ণ ঘটনা, সংবাদ বা তথ্য
                আমাদের কাছে পাঠাতে পারেন।
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-gray-900 sm:p-8 lg:col-span-2">
            <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
              আমাদের মেসেজ পাঠান
            </h2>

            <p className="mb-8 text-sm text-gray-500 dark:text-gray-400">
              নিচের ফর্মটি পূরণ করে Submit করুন।
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    আপনার নাম *
                  </label>

                  <input
                    type="text"
                    name="name"
                    required
                    maxLength={100}
                    placeholder="আপনার নাম লিখুন"
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-red-500 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    ইমেইল *
                  </label>

                  <input
                    type="email"
                    name="email"
                    required
                    maxLength={150}
                    placeholder="example@email.com"
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-red-500 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    ফোন নম্বর
                  </label>

                  <input
                    type="tel"
                    name="phone"
                    maxLength={30}
                    placeholder="01XXXXXXXXX"
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-red-500 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    মেসেজের বিষয় *
                  </label>

                  <select
                    name="subject"
                    required
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-red-500 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
                  >
                    <option value="">বিষয় নির্বাচন করুন</option>
                    <option value="সংবাদ পাঠানো">সংবাদ পাঠানো</option>
                    <option value="অভিযোগ">অভিযোগ</option>
                    <option value="মতামত ও পরামর্শ">মতামত ও পরামর্শ</option>
                    <option value="বিজ্ঞাপন">বিজ্ঞাপন</option>
                    <option value="অন্যান্য">অন্যান্য</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  আপনার মেসেজ *
                </label>

                <textarea
                  name="message"
                  required
                  minLength={5}
                  maxLength={5000}
                  rows={6}
                  placeholder="আপনার মেসেজ বিস্তারিত লিখুন..."
                  className="w-full resize-y rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-red-500 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
                />
              </div>

              {/* Response Message */}
              {message && (
                <div
                  className={`rounded-lg p-4 text-sm ${
                    success
                      ? "bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-400"
                      : "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400"
                  }`}
                >
                  {message}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-red-600 px-6 py-4 font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                {loading ? "পাঠানো হচ্ছে..." : "মেসেজ পাঠান →"}
              </button>

            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
