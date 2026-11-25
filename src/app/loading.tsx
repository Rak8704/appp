
export default function Loading() {
  return (
    <main className="min-h-screen bg-white px-5 py-12">
      <div className="mx-auto max-w-7xl animate-pulse">

        {/* Header Skeleton */}
        <div className="mb-10 flex items-center justify-between border-b border-slate-200 pb-5">
          <div className="h-8 w-40 rounded-lg bg-slate-200" />
          <div className="hidden gap-4 sm:flex">
            <div className="h-5 w-16 rounded bg-slate-200" />
            <div className="h-5 w-16 rounded bg-slate-200" />
            <div className="h-5 w-16 rounded bg-slate-200" />
          </div>
        </div>

        {/* Page Title */}
        <div className="mb-8">
          <div className="h-8 w-52 rounded-lg bg-slate-200" />
          <div className="mt-3 h-4 w-72 max-w-full rounded bg-slate-100" />
        </div>

        {/* News Skeleton */}
        <div className="grid gap-6 md:grid-cols-3">
          <div className="space-y-4 md:col-span-2">
            <div className="aspect-video rounded-2xl bg-slate-200" />
            <div className="h-7 w-4/5 rounded bg-slate-200" />
            <div className="h-4 w-full rounded bg-slate-100" />
            <div className="h-4 w-3/4 rounded bg-slate-100" />
          </div>

          <div className="space-y-5">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="flex gap-3">
                <div className="h-20 w-24 shrink-0 rounded-xl bg-slate-200" />
                <div className="flex-1 space-y-3 pt-2">
                  <div className="h-4 w-full rounded bg-slate-200" />
                  <div className="h-3 w-3/4 rounded bg-slate-100" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex items-center justify-center gap-3 text-sm text-slate-500">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
          সংবাদ লোড হচ্ছে...
        </div>

      </div>
    </main>
  );
}
