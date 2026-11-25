
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

type Account = {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
};

export default function UserAccountPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [account, setAccount] = useState<Account | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    async function loadAccount() {
      try {
        const response = await fetch(
          `/api/admin/users/${id}/account`,
          { cache: "no-store" }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Account লোড করা যায়নি");
        }

        setAccount(result.data);
        setName(result.data.name);
        setEmail(result.data.email);
      } catch (err) {
        setError(true);
        setMessage(
          err instanceof Error ? err.message : "সমস্যা হয়েছে"
        );
      } finally {
        setLoading(false);
      }
    }

    if (id) void loadAccount();
  }, [id]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setError(false);

    if (newPassword && newPassword !== confirmPassword) {
      setError(true);
      setMessage("Password দুটি মিলছে না");
      return;
    }

    if (newPassword && newPassword.length < 10) {
      setError(true);
      setMessage("Password কমপক্ষে ১০ অক্ষরের হতে হবে");
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(
        `/api/admin/users/${id}/account`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            email,
            newPassword,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Account আপডেট করা যায়নি");
      }

      setAccount(result.data);
      setName(result.data.name);
      setEmail(result.data.email);
      setNewPassword("");
      setConfirmPassword("");
      setMessage(result.message);
    } catch (err) {
      setError(true);
      setMessage(
        err instanceof Error ? err.message : "সমস্যা হয়েছে"
      );
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    "mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

  if (loading) {
    return <div className="p-6">Account লোড হচ্ছে...</div>;
  }

  if (!account) {
    return (
      <div className="space-y-4 p-6">
        <p className="text-red-600">{message || "Account পাওয়া যায়নি"}</p>
        <Link href="/admin/users" className="text-blue-600 underline">
          Back to Users
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-4 md:p-6">
      <div>
        <Link
          href={`/admin/users/${id}`}
          className="text-sm text-blue-600 hover:underline"
        >
          ← Back to User Details
        </Link>

        <h1 className="mt-3 text-2xl font-bold text-slate-900">
          Account & Password Management
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          SUPER_ADMIN হিসেবে এই Account-এর Email ও Password পরিচালনা করো।
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <div className="mb-5">
          <h2 className="font-semibold text-slate-900">
            {account.name}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {account.role} · {account.isActive ? "Active" : "Inactive"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-sm font-medium text-slate-700">
              Full Name
            </label>
            <input
              className={inputClass}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              minLength={2}
              maxLength={100}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">
              Email Address
            </label>
            <input
              className={inputClass}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="border-t border-slate-200 pt-5">
            <h3 className="font-semibold text-slate-900">
              Reset User Password
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              নতুন Password দিলে আগের Password বদলে যাবে।
              ফাঁকা রাখলে Password অপরিবর্তিত থাকবে।
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">
              New Password
            </label>
            <input
              className={inputClass}
              type="password"
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              minLength={10}
              placeholder="নতুন Password"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">
              Confirm New Password
            </label>
            <input
              className={inputClass}
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="আবার নতুন Password লিখুন"
            />
          </div>

          {message && (
            <div
              role="status"
              className={`rounded-lg p-3 text-sm ${
                error
                  ? "bg-red-50 text-red-700"
                  : "bg-green-50 text-green-700"
              }`}
            >
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Update Account"}
          </button>
        </form>
      </div>
    </div>
  );
}
