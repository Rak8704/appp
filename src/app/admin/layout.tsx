
"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import AdminSidebar from "@/components/admin/admin-sidebar";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-slate-100 md:flex">
      <div className="md:fixed md:inset-y-0 md:left-0 md:z-30">
        <AdminSidebar />
      </div>

      <div className="min-w-0 flex-1 md:ml-64">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-5 shadow-sm">
          <div>
            <p className="font-semibold text-slate-800">
              Admin Dashboard
            </p>
            <p className="text-xs text-slate-500">
              দৈনিক দিনলিপি ব্যবস্থাপনা
            </p>
          </div>

          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Visit Website ↗
          </a>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
