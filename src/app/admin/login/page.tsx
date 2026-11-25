"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "same-origin",
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        setError(result.message || "Login সফল হয়নি।");
        return;
      }

      const allowedRoles = ["SUPER_ADMIN", "ADMIN", "EDITOR"];

      if (!allowedRoles.includes(result.user?.role)) {
        await fetch("/api/auth/logout", {
          method: "POST",
          credentials: "same-origin",
        });

        setError("আপনার Admin Panel ব্যবহারের অনুমতি নেই।");
        return;
      }

      router.replace("/admin");
      router.refresh();
    } catch {
      setError("সার্ভারের সঙ্গে যোগাযোগ করা যাচ্ছে না।");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-600 text-2xl font-bold text-white">
            দ
          </div>

          <h1 className="text-2xl font-bold text-white">
            দৈনিক দিনলিপি
          </h1>

          <p className="mt-2 text-sm tracking-widest text-slate-400">
            ADMINISTRATION PANEL
          </p>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-white">
            Admin Login
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            আপনার Admin Account দিয়ে Sign in করুন।
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              Email Address
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              autoComplete="username"
              required
              maxLength={254}
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
              maxLength={72}
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
            />
          </div>

          {error && (
            <div
              role="alert"
              className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400"
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-red-600 px-4 py-3 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "অপেক্ষা করুন..." : "Sign In"}
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} Daily Dinlipi. All rights reserved.
        </p>
      </div>
    </main>
  );
}
