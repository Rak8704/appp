import Link from "next/link";

const navigation = [
  {
    title: "Overview",
    items: [{ label: "Dashboard", href: "/admin" }],
  },
  {
    title: "Content Management",
    items: [
      { label: "Articles", href: "/admin/articles" },
      { label: "Categories", href: "/admin/categories" },
      { label: "Authors / Reporters", href: "/admin/authors" },
      { label: "Comments", href: "/admin/comments" },
      { label: "Media Library", href: "/admin/media" },
      { label: "Gallery", href: "/admin/gallery" },
      { label: "Videos", href: "/admin/videos" },
      { label: "E-paper", href: "/admin/epaper" },
    ],
  },
  {
    title: "Operations",
    items: [
      { label: "Users", href: "/admin/users" },
      { label: "Advertisements", href: "/admin/ads" },
      { label: "Careers", href: "/admin/careers" },
      { label: "Applications", href: "/admin/applications" },
      { label: "News Submissions", href: "/admin/submissions" },
      { label: "Newsletter", href: "/admin/newsletter" },
      { label: "Contact Messages", href: "/admin/contacts" },
    ],
  },
  {
    title: "System",
    items: [
      { label: "Site Settings", href: "/admin/settings" },
      { label: "SEO Settings", href: "/admin/seo" },
     { label: "Permission Management", href: "/admin/permissions" },
      { label: "Admin Profile", href: "/admin/profile" },
      { label: "Audit Logs", href: "/admin/audit-logs" },
    ],
  },
];

export default function AdminSidebar() {
  return (
    <aside className="flex h-full min-h-screen w-64 shrink-0 flex-col border-r border-slate-200 bg-slate-950 text-white">
      <div className="border-b border-white/10 px-5 py-6">
        <Link href="/admin" className="text-xl font-bold tracking-tight">
          দৈনিক দিনলিপি
        </Link>
        <p className="mt-1 text-xs text-slate-400">Administration Panel</p>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
        {navigation.map((group) => (
          <div key={group.title}>
            <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              {group.title}
            </p>
            <div className="space-y-1">
              {group.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block rounded-lg px-3 py-2 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-white/10 p-4 text-xs text-slate-500">
        Daily Dinlipi Admin
      </div>
    </aside>
  );
}
