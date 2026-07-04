export function SkeletonLoader({ className = '' }) {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse bg-secondary/10 rounded-xl ${className}`}
    />
  );
}

export function SkeletonCard({ lines = 3 }) {
  return (
    <div className="card p-5 space-y-4">
      <SkeletonLoader className="h-6 w-1/3" />
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <SkeletonLoader key={i} className={`h-4 ${i === lines - 1 ? 'w-2/3' : 'w-full'}`} />
        ))}
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 8 }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonLoader key={i} className="aspect-square rounded-2xl" />
      ))}
    </div>
  );
}

export function DashboardStatSkeleton() {
  return (
    <div className="card p-5 space-y-3">
      <SkeletonLoader className="h-4 w-24" />
      <SkeletonLoader className="h-8 w-20" />
      <SkeletonLoader className="h-3 w-32" />
    </div>
  );
}

export function TableSkeleton({ rows = 5, columns = 4 }) {
  return (
    <div className="card overflow-hidden p-0">
      <div className="border-b border-border bg-background/60 px-4 py-3">
        <SkeletonLoader className="h-4 w-32" />
      </div>
      <div className="space-y-0">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div
            key={rowIndex}
            className="grid gap-3 border-b border-border/70 px-4 py-4 last:border-0"
            style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
          >
            {Array.from({ length: columns }).map((__, columnIndex) => (
              <SkeletonLoader
                key={columnIndex}
                className={`h-4 ${columnIndex === 0 ? 'w-3/4' : columnIndex === columns - 1 ? 'w-2/3' : 'w-full'}`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function SeatMapSkeleton() {
  return (
    <div className="space-y-8">
      <SkeletonLoader className="h-8 w-48" />
      <SkeletonLoader className="h-4 w-64" />
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="space-y-4">
          <SkeletonLoader className="h-5 w-36" />
          <div className="card p-6">
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3 sm:gap-4">
              {Array.from({ length: 20 }).map((__, seatIndex) => (
                <SkeletonLoader key={seatIndex} className="aspect-square rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function BookingCardSkeleton() {
  return (
    <div className="card p-5 space-y-4">
      <div className="flex items-center justify-between">
        <SkeletonLoader className="h-12 w-12 rounded-xl" />
        <SkeletonLoader className="h-6 w-20 rounded-full" />
      </div>
      <SkeletonLoader className="h-6 w-36" />
      <div className="space-y-3 rounded-xl border border-border/40 bg-background/50 p-4">
        <SkeletonLoader className="h-4 w-full" />
        <SkeletonLoader className="h-4 w-5/6" />
        <SkeletonLoader className="h-10 w-full rounded-xl" />
      </div>
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-[320px,1fr]">
      <div className="card p-6 space-y-4">
        <SkeletonLoader className="h-20 w-20 rounded-full" />
        <SkeletonLoader className="h-6 w-44" />
        <SkeletonLoader className="h-4 w-28" />
        <SkeletonLoader className="h-4 w-full" />
        <SkeletonLoader className="h-4 w-2/3" />
      </div>
      <div className="space-y-4">
        <SkeletonCard lines={4} />
        <SkeletonCard lines={3} />
      </div>
    </div>
  );
}
