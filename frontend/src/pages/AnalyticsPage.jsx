import { useEffect, useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import StatCard from '../components/StatCard';
import { analyticsService } from '../services';
import { useAsync } from '../hooks/useAsync';
import { DashboardStatSkeleton, SkeletonCard } from '../components/SkeletonLoader';

export default function AnalyticsPage() {
  const { loading, run } = useAsync();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    run(async () => {
      const { data } = await analyticsService.getAdmin();
      setStats(data.stats);
    });
  }, [run]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Analytics</h1>
          <p className="text-sm text-secondary">Usage patterns and capacity insights.</p>
        </div>

        {loading && !stats ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <DashboardStatSkeleton key={index} />
            ))}
          </div>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <StatCard label="Total reservations" value={stats?.totalReservations ?? 0} />
              <StatCard
                label="Most used floor"
                value={stats?.mostUsedFloor?._id ?? '—'}
                subtext={stats?.mostUsedFloor ? `${stats.mostUsedFloor.count} bookings` : undefined}
              />
              <StatCard label="Occupancy rate" value={`${stats?.occupancyPercentage ?? 0}%`} />
            </div>

            <div className="card">
              <h2 className="mb-4 font-medium">Peak booking hours</h2>
              {stats?.peakBookingHours?.length ? (
                <div className="space-y-3">
                  {stats.peakBookingHours.map((slot) => (
                    <div key={slot.hour} className="flex items-center gap-4">
                      <span className="w-16 text-sm text-secondary">
                        {String(slot.hour).padStart(2, '0')}:00
                      </span>
                      <div className="h-2 flex-1 rounded-full bg-background">
                        <div
                          className="h-2 rounded-full bg-primary"
                          style={{
                            width: `${(slot.count / stats.peakBookingHours[0].count) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="w-8 text-right text-sm">{slot.count}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <SkeletonCard lines={2} />
              )}
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
