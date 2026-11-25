
"use client";

import { useCallback, useEffect, useState } from "react";

type Career = {
  id: string;
  title: string;
  slug: string;
  department: string | null;
  location: string | null;
  employmentType: string | null;
  description: string;
  requirements: string | null;
  salary: string | null;
  deadline: string | null;
  isActive: boolean;
  createdAt: string;
  _count?: { applications: number };
};

const emptyForm = {
  title: "",
  slug: "",
  department: "",
  location: "",
  employmentType: "",
  description: "",
  requirements: "",
  salary: "",
  deadline: "",
  isActive: true,
};

type FormData = typeof emptyForm;

export default function CareersPage() {
  const [jobs, setJobs] = useState<Career[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Career | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [message, setMessage] = useState("");

  const loadJobs = useCallback(async () => {
    setLoading(true);

    try {
      const response = await fetch(
        `/api/admin/careers?page=${page}&limit=20`,
        { cache: "no-store" }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Job লোড করা যায়নি");
      }

      setJobs(result.data || []);
      setTotal(result.pagination?.total || 0);
      setTotalPages(result.pagination?.totalPages || 1);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (job: Career) => {
    setEditing(job);
    setForm({
      title: job.title,
      slug: job.slug,
      department: job.department || "",
      location: job.location || "",
      employmentType: job.employmentType || "",
      description: job.description,
      requirements: job.requirements || "",
      salary: job.salary || "",
      deadline: job.deadline ? job.deadline.slice(0, 10) : "",
      isActive: job.isActive,
    });
    setModalOpen(true);
  };

  const updateField = (key: keyof FormData, value: string | boolean) => {
    setForm((previous) => ({ ...previous, [key]: value }));
  };

  const makeSlug = (value: string) =>
    value
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");

    const payload = {
      ...form,
      department: form.department || null,
      location: form.location || null,
      employmentType: form.employmentType || null,
      requirements: form.requirements || null,
      salary: form.salary || null,
      deadline: form.deadline
        ? new Date(`${form.deadline}T23:59:59`).toISOString()
        : null,
    };

    try {
      const response = await fetch(
        editing
          ? `/api/admin/careers/${editing.id}`
          : "/api/admin/careers",
        {
          method: editing ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "সংরক্ষণ করা যায়নি");
      }

      setModalOpen(false);
      setMessage(editing ? "Job সফলভাবে আপডেট হয়েছে" : "নতুন Job তৈরি হয়েছে");
      await loadJobs();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "সমস্যা হয়েছে");
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = async (job: Career) => {
    try {
      const response = await fetch(`/api/admin/careers/${job.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !job.isActive }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Status পরিবর্তন হয়নি");
      }

      await loadJobs();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "সমস্যা হয়েছে");
    }
  };

  const deleteJob = async (job: Career) => {
    if (!window.confirm(`"${job.title}" Job Delete করতে চাও?`)) return;

    try {
      const response = await fetch(`/api/admin/careers/${job.id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Delete করা যায়নি");
      }

      setMessage("Job Delete হয়েছে");
      await loadJobs();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "সমস্যা হয়েছে");
    }
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      (job.department || "").toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      activeFilter === "ALL" ||
      (activeFilter === "ACTIVE" && job.isActive) ||
      (activeFilter === "INACTIVE" && !job.isActive);

    return matchesSearch && matchesStatus;
  });

  const activeCount = jobs.filter((job) => job.isActive).length;
  const inactiveCount = jobs.length - activeCount;
  const applicationCount = jobs.reduce(
    (sum, job) => sum + (job._count?.applications || 0),
    0
  );

  const inputClass =
    "w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

  return (
    <div className="min-h-screen space-y-6 bg-gray-50 p-4 md:p-7">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-medium text-blue-600">ADMIN / CONTENT</p>
          <h1 className="mt-1 text-2xl font-bold text-gray-900">
            Career Management
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            চাকরির বিজ্ঞপ্তি তৈরি, সম্পাদনা ও পরিচালনা করুন।
          </p>
        </div>

        <button
          onClick={openCreate}
          className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
        >
          + নতুন Job তৈরি
        </button>
      </div>

      {message && (
        <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-800">
          {message}
          <button
            className="float-right font-bold"
            onClick={() => setMessage("")}
          >
            ×
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "মোট Job", value: total, icon: "▤" },
          { label: "এই পেজে Active", value: activeCount, icon: "✓" },
          { label: "এই পেজে Inactive", value: inactiveCount, icon: "◷" },
          { label: "এই পেজে Applications", value: applicationCount, icon: "♙" },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">{item.label}</p>
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-lg text-blue-600">
                {item.icon}
              </span>
            </div>
            <p className="mt-3 text-3xl font-bold text-gray-900">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Job Title বা Department খুঁজুন..."
            className={`${inputClass} md:max-w-sm`}
          />

          <div className="flex flex-wrap gap-2">
            {[
              ["ALL", "সব Job"],
              ["ACTIVE", "Active"],
              ["INACTIVE", "Inactive"],
            ].map(([value, label]) => (
              <button
                key={value}
                onClick={() => setActiveFilter(value)}
                className={`rounded-lg px-4 py-2 text-sm font-medium ${
                  activeFilter === value
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[850px] text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-xs uppercase text-gray-500">
                <th className="px-4 py-3">Job Information</th>
                <th className="px-4 py-3">Department</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Applications</th>
                <th className="px-4 py-3">Deadline</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-gray-500">
                    Job লোড হচ্ছে...
                  </td>
                </tr>
              ) : filteredJobs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-gray-500">
                    কোনো Job পাওয়া যায়নি।
                  </td>
                </tr>
              ) : (
                filteredJobs.map((job) => (
                  <tr key={job.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <p className="font-semibold text-gray-900">{job.title}</p>
                      <p className="mt-1 text-xs text-gray-400">{job.slug}</p>
                      <p className="mt-1 text-xs text-gray-500">
                        {job.employmentType || "Employment type নেই"}
                      </p>
                    </td>
                    <td className="px-4 py-4 text-gray-600">
                      {job.department || "—"}
                    </td>
                    <td className="px-4 py-4 text-gray-600">
                      {job.location || "—"}
                    </td>
                    <td className="px-4 py-4 font-semibold text-gray-700">
                      {job._count?.applications || 0}
                    </td>
                    <td className="px-4 py-4 text-gray-600">
                      {job.deadline
                        ? new Date(job.deadline).toLocaleDateString("en-GB")
                        : "No deadline"}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          job.isActive
                            ? "bg-green-50 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {job.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => toggleStatus(job)}
                          className="rounded-lg border border-gray-200 px-3 py-2 text-xs hover:bg-gray-100"
                        >
                          {job.isActive ? "Disable" : "Enable"}
                        </button>
                        <button
                          onClick={() => openEdit(job)}
                          className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-100"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteJob(job)}
                          className="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-100"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
          <p className="text-sm text-gray-500">
            মোট {total}টি Job · Page {page} / {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((value) => value - 1)}
              className="rounded-lg border px-4 py-2 text-sm disabled:opacity-40"
            >
              Previous
            </button>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((value) => value + 1)}
              className="rounded-lg border px-4 py-2 text-sm disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
          <div className="my-8 w-full max-w-3xl rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b p-5">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {editing ? "Job Edit করুন" : "নতুন Job তৈরি করুন"}
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Job-এর প্রয়োজনীয় তথ্য পূরণ করুন।
                </p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="rounded-lg px-3 py-2 text-xl text-gray-500 hover:bg-gray-100"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 p-5">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-1 text-sm font-medium text-gray-700">
                  Job Title *
                  <input
                    required
                    minLength={2}
                    value={form.title}
                    onChange={(e) => {
                      updateField("title", e.target.value);
                      if (!editing) updateField("slug", makeSlug(e.target.value));
                    }}
                    className={inputClass}
                    placeholder="যেমন: Senior Reporter"
                  />
                </label>

                <label className="space-y-1 text-sm font-medium text-gray-700">
                  Slug *
                  <input
                    required
                    minLength={2}
                    value={form.slug}
                    onChange={(e) => updateField("slug", makeSlug(e.target.value))}
                    className={inputClass}
                    placeholder="senior-reporter"
                  />
                </label>

                <label className="space-y-1 text-sm font-medium text-gray-700">
                  Department
                  <input
                    value={form.department}
                    onChange={(e) => updateField("department", e.target.value)}
                    className={inputClass}
                    placeholder="News"
                  />
                </label>

                <label className="space-y-1 text-sm font-medium text-gray-700">
                  Location
                  <input
                    value={form.location}
                    onChange={(e) => updateField("location", e.target.value)}
                    className={inputClass}
                    placeholder="Dhaka, Bangladesh"
                  />
                </label>

                <label className="space-y-1 text-sm font-medium text-gray-700">
                  Employment Type
                  <select
                    value={form.employmentType}
                    onChange={(e) => updateField("employmentType", e.target.value)}
                    className={inputClass}
                  >
                    <option value="">Select type</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                    <option value="Remote">Remote</option>
                  </select>
                </label>

                <label className="space-y-1 text-sm font-medium text-gray-700">
                  Salary
                  <input
                    value={form.salary}
                    onChange={(e) => updateField("salary", e.target.value)}
                    className={inputClass}
                    placeholder="Negotiable"
                  />
                </label>

                <label className="space-y-1 text-sm font-medium text-gray-700 md:col-span-2">
                  Application Deadline
                  <input
                    type="date"
                    value={form.deadline}
                    onChange={(e) => updateField("deadline", e.target.value)}
                    className={inputClass}
                  />
                </label>

                <label className="space-y-1 text-sm font-medium text-gray-700 md:col-span-2">
                  Job Description *
                  <textarea
                    required
                    minLength={10}
                    rows={5}
                    value={form.description}
                    onChange={(e) => updateField("description", e.target.value)}
                    className={inputClass}
                    placeholder="Job-এর বিস্তারিত বিবরণ..."
                  />
                </label>

                <label className="space-y-1 text-sm font-medium text-gray-700 md:col-span-2">
                  Requirements
                  <textarea
                    rows={4}
                    value={form.requirements}
                    onChange={(e) => updateField("requirements", e.target.value)}
                    className={inputClass}
                    placeholder="প্রয়োজনীয় যোগ্যতা..."
                  />
                </label>
              </div>

              <label className="flex items-center gap-3 rounded-xl bg-gray-50 p-3 text-sm font-medium text-gray-700">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => updateField("isActive", e.target.checked)}
                  className="h-4 w-4 accent-blue-600"
                />
                Job Active রাখুন
              </label>

              <div className="flex justify-end gap-3 border-t pt-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-xl border px-5 py-2.5 text-sm font-semibold text-gray-600"
                >
                  Cancel
                </button>
                <button
                  disabled={saving}
                  type="submit"
                  className="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {saving ? "Saving..." : editing ? "Update Job" : "Create Job"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
