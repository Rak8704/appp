
"use client";

import { useCallback, useEffect, useState } from "react";

type ApplicationStatus =
  | "PENDING"
  | "REVIEWING"
  | "SHORTLISTED"
  | "REJECTED"
  | "HIRED";

type Application = {
  id: string;
  careerId: string;
  name: string;
  email: string;
  phone: string;
  resumeUrl: string | null;
  coverLetter: string | null;
  status: ApplicationStatus;
  adminNotes: string | null;
  createdAt: string;
  career: {
    id: string;
    title: string;
    slug: string;
  };
};

const statuses: ApplicationStatus[] = [
  "PENDING",
  "REVIEWING",
  "SHORTLISTED",
  "REJECTED",
  "HIRED",
];

const statusStyle: Record<ApplicationStatus, string> = {
  PENDING: "bg-amber-50 text-amber-700",
  REVIEWING: "bg-blue-50 text-blue-700",
  SHORTLISTED: "bg-purple-50 text-purple-700",
  REJECTED: "bg-red-50 text-red-700",
  HIRED: "bg-green-50 text-green-700",
};

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Application | null>(null);
  const [notes, setNotes] = useState("");
  const [newStatus, setNewStatus] = useState<ApplicationStatus>("PENDING");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const loadApplications = useCallback(async () => {
    setLoading(true);

    try {
      const query = new URLSearchParams({
        page: String(page),
        limit: "20",
      });

      if (filter !== "ALL") query.set("status", filter);

      const response = await fetch(
        `/api/admin/applications?${query.toString()}`,
        { cache: "no-store" }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Applications লোড করা যায়নি");
      }

      setApplications(result.data || []);
      setTotal(result.pagination?.total || 0);
      setTotalPages(result.pagination?.totalPages || 1);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  }, [page, filter]);

  useEffect(() => {
    loadApplications();
  }, [loadApplications]);

  const openDetails = (application: Application) => {
    setSelected(application);
    setNotes(application.adminNotes || "");
    setNewStatus(application.status);
  };

  const updateApplication = async () => {
    if (!selected) return;

    setSaving(true);
    setMessage("");

    try {
      const response = await fetch("/api/admin/applications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selected.id,
          status: newStatus,
          adminNotes: notes || null,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Application আপডেট হয়নি");
      }

      setSelected(null);
      setMessage("Application সফলভাবে আপডেট হয়েছে");
      await loadApplications();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "সমস্যা হয়েছে");
    } finally {
      setSaving(false);
    }
  };

  const filteredApplications = applications.filter((application) => {
    const term = search.toLowerCase();

    return (
      application.name.toLowerCase().includes(term) ||
      application.email.toLowerCase().includes(term) ||
      application.career.title.toLowerCase().includes(term) ||
      application.phone.toLowerCase().includes(term)
    );
  });

  const countByStatus = (status: ApplicationStatus) =>
    applications.filter((item) => item.status === status).length;

  const cardItems = [
    { label: "মোট Applications", value: total, color: "text-gray-900" },
    { label: "Pending", value: countByStatus("PENDING"), color: "text-amber-600" },
    { label: "Reviewing", value: countByStatus("REVIEWING"), color: "text-blue-600" },
    { label: "Shortlisted", value: countByStatus("SHORTLISTED"), color: "text-purple-600" },
    { label: "Hired", value: countByStatus("HIRED"), color: "text-green-600" },
  ];

  const inputClass =
    "w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

  return (
    <div className="min-h-screen space-y-6 bg-gray-50 p-4 md:p-7">
      <div>
        <p className="text-sm font-medium text-blue-600">ADMIN / RECRUITMENT</p>
        <h1 className="mt-1 text-2xl font-bold text-gray-900">
          Career Applications
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          আবেদনকারীদের তথ্য, Resume এবং নিয়োগের অবস্থা পরিচালনা করুন।
        </p>
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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {cardItems.map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
          >
            <p className="text-sm text-gray-500">{item.label}</p>
            <p className={`mt-3 text-3xl font-bold ${item.color}`}>
              {item.value}
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="নাম, Email, Phone বা Job খুঁজুন..."
            className={`${inputClass} lg:max-w-sm`}
          />

          <div className="flex flex-wrap gap-2">
            {["ALL", ...statuses].map((status) => (
              <button
                key={status}
                onClick={() => {
                  setFilter(status);
                  setPage(1);
                }}
                className={`rounded-lg px-3 py-2 text-xs font-semibold ${
                  filter === status
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {status === "ALL" ? "সব আবেদন" : status}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-xs uppercase text-gray-500">
                <th className="px-4 py-3">Applicant</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Applied Job</th>
                <th className="px-4 py-3">Resume</th>
                <th className="px-4 py-3">Applied Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Details</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-gray-500">
                    Applications লোড হচ্ছে...
                  </td>
                </tr>
              ) : filteredApplications.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-gray-500">
                    কোনো Application পাওয়া যায়নি।
                  </td>
                </tr>
              ) : (
                filteredApplications.map((application) => (
                  <tr key={application.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <p className="font-semibold text-gray-900">
                        {application.name}
                      </p>
                      <p className="mt-1 text-xs text-gray-400">
                        ID: {application.id.slice(0, 10)}
                      </p>
                    </td>
                    <td className="px-4 py-4 text-gray-600">
                      <p>{application.email}</p>
                      <p className="mt-1 text-xs text-gray-400">
                        {application.phone}
                      </p>
                    </td>
                    <td className="px-4 py-4 font-medium text-gray-700">
                      {application.career.title}
                    </td>
                    <td className="px-4 py-4">
                      {application.resumeUrl ? (
                        <a
                          href={application.resumeUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="font-semibold text-blue-600 hover:underline"
                        >
                          View Resume ↗
                        </a>
                      ) : (
                        <span className="text-gray-400">Not provided</span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-gray-600">
                      {new Date(application.createdAt).toLocaleDateString("en-GB")}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyle[application.status]}`}
                      >
                        {application.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <button
                        onClick={() => openDetails(application)}
                        className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-100"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
          <p className="text-sm text-gray-500">
            মোট {total}টি Application · Page {page} / {totalPages}
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

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
          <div className="my-8 w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b p-5">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Applicant Details
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  {selected.career.title}
                </p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="rounded-lg px-3 py-2 text-xl text-gray-500 hover:bg-gray-100"
              >
                ×
              </button>
            </div>

            <div className="space-y-5 p-5">
              <div className="grid gap-4 rounded-xl bg-gray-50 p-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-gray-500">Candidate Name</p>
                  <p className="mt-1 font-semibold text-gray-900">{selected.name}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="mt-1 break-all font-medium text-gray-800">{selected.email}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Phone</p>
                  <p className="mt-1 font-medium text-gray-800">{selected.phone}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Applied Date</p>
                  <p className="mt-1 font-medium text-gray-800">
                    {new Date(selected.createdAt).toLocaleString("en-GB")}
                  </p>
                </div>
              </div>

              <div>
                <p className="mb-2 text-sm font-semibold text-gray-700">
                  Resume
                </p>
                {selected.resumeUrl ? (
                  <a
                    href={selected.resumeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex rounded-xl bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-700 hover:bg-blue-100"
                  >
                    Open / Download Resume ↗
                  </a>
                ) : (
                  <p className="text-sm text-gray-400">Resume দেওয়া হয়নি।</p>
                )}
              </div>

              <div>
                <p className="mb-2 text-sm font-semibold text-gray-700">
                  Cover Letter
                </p>
                <div className="max-h-48 overflow-y-auto whitespace-pre-wrap rounded-xl border border-gray-200 p-4 text-sm leading-7 text-gray-600">
                  {selected.coverLetter || "Cover Letter দেওয়া হয়নি।"}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-2 text-sm font-semibold text-gray-700">
                  Application Status
                  <select
                    value={newStatus}
                    onChange={(event) =>
                      setNewStatus(event.target.value as ApplicationStatus)
                    }
                    className={inputClass}
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="space-y-2 text-sm font-semibold text-gray-700">
                  Admin Notes
                  <textarea
                    rows={4}
                    maxLength={5000}
                    value={notes}
                    onChange={(event) => setNotes(event.target.value)}
                    className={inputClass}
                    placeholder="Internal notes..."
                  />
                </label>
              </div>

              <div className="flex justify-end gap-3 border-t pt-4">
                <button
                  onClick={() => setSelected(null)}
                  className="rounded-xl border px-5 py-2.5 text-sm font-semibold text-gray-600"
                >
                  Close
                </button>
                <button
                  onClick={updateApplication}
                  disabled={saving}
                  className="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
