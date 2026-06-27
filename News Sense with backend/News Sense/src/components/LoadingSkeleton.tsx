export default function LoadingSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div 
          key={index} 
          style={{ animationDelay: `${index * 100}ms` }}
          className="animate-slide-up rounded-3xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900 overflow-hidden"
        >
          <div className="relative h-56 w-full rounded-3xl bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-900">
            <div className="absolute inset-0 animate-shimmer"></div>
          </div>
          <div className="mt-5 space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-3 w-20 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse"></div>
            </div>
            <div className="h-6 w-3/4 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse"></div>
            <div className="space-y-2">
              <div className="h-4 w-full rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse"></div>
              <div className="h-4 w-5/6 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse"></div>
              <div className="h-4 w-4/6 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse"></div>
            </div>
          </div>
          <div className="mt-5 flex gap-3">
            <div className="h-10 w-24 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse"></div>
            <div className="h-10 w-24 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
