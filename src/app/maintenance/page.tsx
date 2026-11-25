
import Link from "next/link";
import {
  Wrench,
  Clock,
  RefreshCw,
  Home,
  Newspaper,
} from "lucide-react";

export default function MaintenancePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-5 py-16">
      <div className="w-full max-w-2xl text-center">

        {/* Logo */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 mb-12"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-600">
            <Newspaper size={25} />
          </div>

          <span className="text-2xl font-bold">
            দৈনিক <span className="text-red-500">দিনলিপি</span>
          </span>
        </Link>

        {/* Illustration */}
        <div className="relative mx-auto mb-9 flex h-40 w-40 items-center justify-center rounded-full border border-slate-700 bg-slate-900">
          <div className="absolute inset-3 rounded-full border border-dashed border-red-500/40 animate-spin [animation-duration:15s]" />

          <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-red-600/15 text-red-500">
            <Wrench size={52} strokeWidth={1.5} />
          </div>
        </div>

        {/* Content */}
        <div className="mb-8">
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-sm font-medium text-amber-400">
            <Clock size={16} />
            সাময়িক রক্ষণাবেক্ষণ
          </span>

          <h1 className="mb-5 text-3xl font-extrabold leading-tight sm:text-5xl">
            আমরা আরও ভালোভাবে
            <br />
            <span className="text-red-500">
              ফিরে আসছি!
            </span>
          </h1>

          <p className="mx-auto max-w-xl text-base leading-8 text-slate-400 sm:text-lg">
            দৈনিক দিনলিপি ওয়েবসাইটে বর্তমানে কিছু
            গুরুত্বপূর্ণ উন্নয়ন ও রক্ষণাবেক্ষণের কাজ চলছে।
            খুব শিগগিরই আমরা আবার আপনাদের মাঝে ফিরে আসব।
          </p>
        </div>

        {/* Status */}
        <div className="mb-9 rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
          <div className="mb-3 flex items-center justify-between text-sm">
            <span className="text-slate-400">
              Website Status
            </span>
            <span className="flex items-center gap-2 text-amber-400">
              <span className="h-2 w-2 animate-pulse rounded-full bg-amber-400" />
              Maintenance চলছে
            </span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-slate-800">
            <div className="h-full w-2/3 rounded-full bg-red-600" />
          </div>

          <p className="mt-3 text-xs text-slate-500">
            আমাদের টিম ওয়েবসাইটের উন্নয়নে কাজ করছে।
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-7 py-3.5 font-semibold transition hover:bg-red-700"
          >
            <RefreshCw size={18} />
            আবার চেষ্টা করুন
          </button>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 px-7 py-3.5 font-semibold text-slate-300 transition hover:border-slate-500 hover:bg-slate-900"
          >
            <Home size={18} />
            হোমপেজ
          </Link>
        </div>

        <p className="mt-12 text-sm text-slate-600">
          © {new Date().getFullYear()} দৈনিক দিনলিপি। সর্বস্বত্ব সংরক্ষিত।
        </p>
      </div>
    </main>
  );
}
