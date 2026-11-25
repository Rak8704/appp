"use client";

import { useEffect, useState } from "react";

type Setting = { id?: string; key: string; value: string; updatedAt?: string };

export default function SettingsPage() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [search, setSearch] = useState("");

  async function loadSettings() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/settings", { cache: "no-store" });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message || "Settings লোড হয়নি");
      setSettings(result.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Settings লোড করতে সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadSettings(); }, []);

  function updateSetting(index: number, value: string) {
    setSettings((current) => current.map((item, i) => i === index ? { ...item, value } : item));
  }

  function addSetting() {
    setSettings((current) => [...current, { key: "", value: "" }]);
  }

  function updateKey(index: number, key: string) {
    setSettings((current) => current.map((item, i) => i === index ? { ...item, key } : item));
  }

  function removeSetting(index: number) {
    setSettings((current) => current.filter((_, i) => i !== index));
  }

  async function saveSettings() {
    setSaving(true);
    setError("");
    setNotice("");
    try {
      const cleaned = settings.map(({ key, value }) => ({ key: key.trim(), value }));
      if (cleaned.some((item) => !item.key)) throw new Error("প্রতিটি Setting-এর Key দিতে হবে");
      if (cleaned.some((item) => item.key.length > 150)) throw new Error("Setting Key সর্বোচ্চ ১৫০ অক্ষর হতে পারবে");
      if (cleaned.some((item) => item.value.length > 10000)) throw new Error("Setting Value সর্বোচ্চ ১০,০০০ অক্ষর হতে পারবে");
      if (cleaned.length === 0) throw new Error("কমপক্ষে একটি Setting থাকতে হবে");
      if (cleaned.length > 100) throw new Error("একসঙ্গে সর্বোচ্চ ১০০টি Setting save করা যাবে");

      const keys = cleaned.map((item) => item.key);
      if (new Set(keys).size !== keys.length) throw new Error("একই Key একাধিকবার দেওয়া যাবে না");

      const response = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings: cleaned }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message || "Settings save হয়নি");
      setNotice(result.message || "Settings সফলভাবে আপডেট হয়েছে");
      await loadSettings();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save করা যায়নি");
    } finally {
      setSaving(false);
    }
  }

  const filtered = settings
    .map((item, index) => ({ ...item, originalIndex: index }))
    .filter((item) => item.key.toLowerCase().includes(search.toLowerCase()));

  return (
    <main className="space-y-6 p-4 md:p-7">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Site Settings</h1>
          <p className="mt-1 text-sm text-gray-500">ওয়েবসাইটের সাধারণ Settings পরিচালনা করুন</p>
        </div>
        <div className="flex gap-2">
          <button onClick={loadSettings} className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50">↻ Refresh</button>
          <button onClick={addSetting} className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-700">+ Add Setting</button>
        </div>
      </div>

      {notice && <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">{notice}</div>}
      {error && <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

      <div className="rounded-xl border bg-white p-4">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-semibold">Configuration</h2>
            <p className="text-sm text-gray-500">{settings.length} টি Setting</p>
          </div>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Key দিয়ে খুঁজুন..." className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-blue-500 sm:max-w-xs" />
        </div>

        {loading ? (
          <div className="py-12 text-center text-gray-500">Loading settings...</div>
        ) : filtered.length === 0 ? (
          <div className="py-12 text-center text-gray-500">কোনো Setting পাওয়া যায়নি। Add Setting দিয়ে শুরু করুন।</div>
        ) : (
          <div className="mt-5 space-y-4">
            {filtered.map((item) => (
              <div key={`${item.originalIndex}-${item.id || item.key}`} className="grid gap-3 rounded-xl border p-4 md:grid-cols-[1fr_2fr_auto]">
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase text-gray-500">Setting Key</label>
                  <input value={item.key} onChange={(e) => updateKey(item.originalIndex, e.target.value)} maxLength={150} placeholder="site_name" className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase text-gray-500">Value</label>
                  <textarea value={item.value} onChange={(e) => updateSetting(item.originalIndex, e.target.value)} maxLength={10000} rows={2} placeholder="Setting value..." className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-blue-500" />
                  <p className="mt-1 text-right text-xs text-gray-400">{item.value.length}/10000</p>
                </div>
                <div className="flex items-end">
                  <button onClick={() => removeSetting(item.originalIndex)} className="w-full rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 md:w-auto">Remove</button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 flex flex-col justify-between gap-3 border-t pt-4 sm:flex-row sm:items-center">
          <p className="text-xs text-gray-500">Save করলে সব Setting একসঙ্গে আপডেট হবে।</p>
          <button disabled={saving || loading || settings.length === 0} onClick={saveSettings} className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50">
            {saving ? "Saving..." : "Save All Settings"}
          </button>
        </div>
      </div>
    </main>
  );
}