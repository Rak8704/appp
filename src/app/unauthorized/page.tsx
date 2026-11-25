
import Link from "next/link";
import { ShieldAlert, Home, ArrowLeft, LockKeyhole } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-5 py-16">
      <div className="w-full max-w-xl text-center">
        <div className="mx-auto mb-7 flex h-24 w-24 items-center justify-center rounded-full bg-red-100 text-red-600">
          <ShieldAlert size={48} />
        </div>

        <p className="mb-3 text-sm font-bold uppercase tracking-widest text-red-600">
          Access Denied
        </p>

        <h1 className="mb-5 text-3xl font-extrabold text-slate-900 sm:text-4xl">
          প্রবেশের অনুমতি নেই!
        </h1>

        <p className="mx-auto mb-8 max-w-md leading-8 text-slate-600">
          দুঃখিত, এই পেজটি দেখার জন্য আপনার প্রয়োজনীয়
          অনুমতি নেই। অনুগ্রহ করে সঠিক অ্যাকাউন্ট দিয়ে
          প্রবেশ করুন অথবা প্রশাসকের সঙ্গে যোগাযোগ করুন।
        </p>

        <div className="mb-8 flex items-center justify-center gap-2 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">
          <LockKeyhole size={18} />
          আপনার অ্যাকাউন্টের অনুমতি সীমাবদ্ধ।
        </div>

        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-3 font-semibold text-white transition hover:bg-red-700"
          >
            <Home size={18} />
            হোমপেজে ফিরুন
          </Link>

          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            <ArrowLeft size={18} />
            লগইন করুন
          </Link>
        </div>

        <p className="mt-10 text-sm text-slate-400">
          © {new Date().getFullYear()} দৈনিক দিনলিপি
        </p>
      </div>
    </main>
  );
}
