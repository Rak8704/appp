
"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application Error:", error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-5 py-16">
      <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12">

        <div className="mx-auto mb-7 flex h-20 w-20 items-center justify-center rounded-full bg-red-100 text-red-600">
          <AlertTriangle size={40} />
        </div>

        <span className="text-sm font-bold uppercase tracking-widest text-red-600">
          Something Went Wrong
        </span>

        <h1 className="mt-4 text-3xl font-extrabold text-slate-900">
          দুঃখিত! একটি সমস্যা হয়েছে
        </h1>

        <p className="mt-4 leading-8 text-slate-500">
          পেজটি লোড করার সময় একটি অপ্রত্যাশিত সমস্যা হয়েছে।
          আপনি আবার চেষ্টা করতে পারেন।
        </p>

        {error.digest && (
          <p className="mt-4 text-xs text-slate-400">
            Error Reference: {error.digest}
          </p>
        )}

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            onClick={() => reset()}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-3 font-semibold text-white transition hover:bg-red-700"
          >
            <RefreshCw size={18} />
            আবার চেষ্টা করুন
          </button>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <Home size={18} />
            হোমপেজ
          </Link>
        </div>

      </div>
    </main>
  );
}
