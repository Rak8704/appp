
"use client";

import { useEffect, useState } from "react";

type Profile = {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string | null;
  isActive: boolean;
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
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function loadProfile() {
      try {
        const response = await fetch("/api/admin/profile", {
          cache: "no-store",
          credentials: "same-origin",
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Profile লোড করা যায়নি");
        }

        setProfile(result.data);
        setName(result.data.name);
        setEmail(result.data.email);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "একটি সমস্যা হয়েছে"
        );
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (name.trim().length < 2) {
      setError("Name কমপক্ষে ২ অক্ষরের হতে হবে");
      return;
    }

    if (!email.trim()) {
      setError("Email দিতে হবে");
      return;
    }

    if (newPassword && newPassword.length < 10) {
      setError("নতুন Password কমপক্ষে ১০ অক্ষরের হতে হবে");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New Password এবং Confirm Password মিলছে না");
      return;
    }

    const passwordChanged = newPassword.length > 0;
    const emailChanged = profile?.email !== email.trim();
    const nameChanged = profile?.name !== name.trim();

    if (!passwordChanged && !emailChanged && !nameChanged) {
      setError("কোনো পরিবর্তন করা হয়নি");
      return;
    }

    if ((passwordChanged || emailChanged) && !currentPassword) {
      setError("Email অথবা Password পরিবর্তনের জন্য Current Password দিতে হবে");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch("/api/admin/profile", {
        method: "PATCH",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          currentPassword: currentPassword || undefined,
          newPassword: newPassword || undefined,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Profile Update করা যায়নি");
      }

      setProfile(result.data);
      setName(result.data.name);
      setEmail(result.data.email);

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setSuccess(result.message || "Profile সফলভাবে Update হয়েছে");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "একটি সমস্যা হয়েছে"
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="rounded-xl border bg-white p-8 text-center">
        Profile লোড হচ্ছে...
      </div>
    );
  }

  if (!profile && error) {
    return (
      <div className="rounded-xl border bg-white p-6">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="mx-auto max-w-3xl space-y-6">

      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Admin Profile
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          নিজের ব্যক্তিগত তথ্য, Email এবং Password পরিবর্তন করুন।
        </p>
      </div>

      {/* Profile Information */}
      <div className="rounded-xl border bg-white p-6">
        <div className="flex items-center gap-4">
          {profile.avatar ? (
            <img
              src={profile.avatar}
              alt={profile.name}
              className="h-16 w-16 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-2xl font-bold text-blue-700">
              {profile.name.charAt(0).toUpperCase()}
            </div>
          )}

          <div>
            <h2 className="text-lg font-bold">{profile.name}</h2>
            <p className="text-sm text-slate-500">{profile.role}</p>
            <span className="mt-1 inline-block rounded-full bg-green-100 px-3 py-1 text-xs text-green-700">
              {profile.isActive ? "Active Account" : "Inactive Account"}
            </span>
          </div>
        </div>
      </div>

      {/* Edit Profile */}
      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-xl border bg-white p-6"
      >
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Personal Information
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            নিজের Name এবং Email পরিবর্তন করুন।
          </p>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Full Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            minLength={2}
            maxLength={100}
            className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
            placeholder="Your Name"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
            placeholder="your@email.com"
          />
        </div>

        <div className="border-t pt-6">
          <h2 className="text-lg font-bold text-slate-900">
            Change Password
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Password পরিবর্তন করতে নিচের তথ্য পূরণ করুন।
            Password পরিবর্তন না করলে নতুন Password-এর ঘর খালি রাখুন।
          </p>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Current Password
          </label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            autoComplete="current-password"
            className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
            placeholder="বর্তমান Password"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            New Password
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            minLength={10}
            autoComplete="new-password"
            className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
            placeholder="নতুন Password (কমপক্ষে ১০ অক্ষর)"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Confirm New Password
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
            className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
            placeholder="নতুন Password আবার লিখুন"
          />
        </div>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
            {success}
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-5">
          <p className="text-xs text-slate-500">
            Account Role: {profile.role}
          </p>

          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
