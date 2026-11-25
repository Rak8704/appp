
"use client";

import { useEffect, useState } from "react";

type Profile = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export default function AdminProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      try {
        const response = await fetch("/api/admin/profile", {
          cache: "no-store",
        });
        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Profile লোড করা যায়নি");
        }

        setProfile(result.data);
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

    void loadProfile();
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setError(false);

    if (newPassword && newPassword !== confirmPassword) {
      setError(true);
      setMessage("নতুন Password এবং Confirm Password মিলছে না");
      return;
    }

    if (newPassword && !currentPassword) {
      setError(true);
      setMessage("Password পরিবর্তনের জন্য বর্তমান Password দিন");
      return;
    }

    try {
      setSaving(true);

      const response = await fetch("/api/admin/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          currentPassword,
          newPassword,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Profile আপডেট করা যায়নি");
      }

      setProfile(result.data);
      setName(result.data.name);
      setEmail(result.data.email);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setMessage("Profile সফলভাবে আপডেট হয়েছে");
    } catch (err) {
      setError(true);
      setMessage(
        err instanceof Error ? err.message : "সমস্যা হয়েছে"
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="p-6">Profile লোড হচ্ছে...</div>;
  }

  if (!profile) {
    return <div className="p-6 text-red-600">{message}</div>;
  }

  const inputClass =
    "mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          My Profile
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          নিজের Account Information ও Password পরিবর্তন করো।
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <div className="mb-5">
          <h2 className="font-semibold text-slate-900">
            Account Information
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Current Role: {profile.role}
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
              Change Password
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Email অথবা Password পরিবর্তন করতে বর্তমান Password প্রয়োজন।
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">
              Current Password
            </label>
            <input
              className={inputClass}
              type="password"
              autoComplete="current-password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="বর্তমান Password"
            />
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
              placeholder="কমপক্ষে ১০ অক্ষর"
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
              placeholder="নতুন Password আবার লিখুন"
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
            {saving ? "Saving..." : "Save Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}
