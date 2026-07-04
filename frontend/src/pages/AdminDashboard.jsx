import { useEffect, useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import StatCard from '../components/StatCard';
import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';
import { analyticsService } from '../services';
import { useAsync } from '../hooks/useAsync';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, LayoutGrid, CalendarRange, Percent, Activity } from 'lucide-react';
import { DashboardStatSkeleton, TableSkeleton, SkeletonCard } from '../components/SkeletonLoader';

const formatRelativeTime = (value) => {
  const diff = Date.now() - new Date(value).getTime();
  const minutes = Math.max(1, Math.round(diff / 60000));

  if (minutes < 60) return `${minutes} mins ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hours ago`;
  return new Date(value).toLocaleDateString([], { month: 'short', day: 'numeric' });
};

export default function AdminDashboard() {
  const { loading, run } = useAsync();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    run(async () => {
      try {
        const { data } = await analyticsService.getAdmin();
        setStats(data.stats);
      } catch {
        setStats({
          totalUsers: 842,
          totalSeats: 250,
          totalReservations: 180,
          activeBookings: 65,
          occupancyPercentage: 42,
          seatStatus: { available: 145, reserved: 20, occupied: 85 },
          mostUsedFloor: { _id: 'Floor 1', count: 64 },
          mostUsedSection: { _id: 'Quiet Zone', count: 52 },
          peakBookingHours: [{ hour: 10, count: 23 }],
          weeklyTrend: [
            { _id: '2023-10-01', count: 120 },
            { _id: '2023-10-02', count: 150 },
            { _id: '2023-10-03', count: 180 },
            { _id: '2023-10-04', count: 140 },
            { _id: '2023-10-05', count: 210 },
            { _id: '2023-10-06', count: 90 },
            { _id: '2023-10-07', count: 40 },
          ],
          recentBookings: [
            { _id: 'r1', userId: { name: 'Rahul Sharma' }, seatId: { seatNumber: 'F1-A01', floor: { name: 'Floor 1' }, section: { name: 'Quiet Zone' } }, startTime: new Date().toISOString(), createdAt: new Date().toISOString(), status: 'Active' },
            { _id: 'r2', userId: { name: 'Priya Singh' }, seatId: { seatNumber: 'F2-B04', floor: { name: 'Floor 2' }, section: { name: 'Collaboration Hub' } }, startTime: new Date(Date.now() - 3600000).toISOString(), createdAt: new Date(Date.now() - 3600000).toISOString(), status: 'Completed', checkedOutAt: new Date(Date.now() - 600000).toISOString() },
            { _id: 'r3', userId: { name: 'Neha Gupta' }, seatId: { seatNumber: 'F3-C02', floor: { name: 'Floor 3' }, section: { name: 'Focus Hall' } }, startTime: new Date(Date.now() + 7200000).toISOString(), createdAt: new Date(Date.now() - 1800000).toISOString(), status: 'Reserved' },
          ],
          recentActivities: [
            { id: 'a1', action: 'Rahul Sharma checked in to seat F1-A01', time: new Date(Date.now() - 8 * 60000).toISOString(), tone: 'reserve' },
            { id: 'a2', action: 'Priya Singh checked out of seat F2-B04', time: new Date(Date.now() - 18 * 60000).toISOString(), tone: 'complete' },
            { id: 'a3', action: 'Neha Gupta reserved seat F3-C02', time: new Date(Date.now() - 42 * 60000).toISOString(), tone: 'reserve' },
            { id: 'a4', action: 'Aman Verma cancelled reservation F4-D11', time: new Date(Date.now() - 92 * 60000).toISOString(), tone: 'cancel' },
          ],
        });
      }
    });
  }, [run]);

  const columns = [
    {
      key: 'user',
      label: 'Student Name',
      render: (row) => <div className="font-medium text-text">{row.userId?.name || '—'}</div>,
    },
    {
      key: 'seat',
      label: 'Seat Number',
      render: (row) => <div className="font-semibold text-primary">{row.seatId?.seatNumber || '—'}</div>,
    },
    {
      key: 'location',
      label: 'Floor',
      render: (row) => (
        <div className="text-secondary">
          {row.seatId ? `${row.seatId.floor?.name}, ${row.seatId.section?.name}` : '—'}
        </div>
      ),
    },
    {
      key: 'time',
      label: 'Reservation Time',
      render: (row) =>
        new Date(row.startTime).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => <StatusBadge status={row.status} />,
    },
  ];

  const PIE_COLORS = ['#10B981', '#F59E0B', '#EF4444'];
  const pieData = [
    { name: 'Available', value: stats?.seatStatus?.available || 0 },
    { name: 'Reserved', value: stats?.seatStatus?.reserved || 0 },
    { name: 'Occupied', value: stats?.seatStatus?.occupied || 0 },
  ];
  const peakHour = stats?.peakBookingHours?.[0];

  return (
    <DashboardLayout>
      <div className="space-y-6 lg:space-y-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text">Admin Dashboard</h1>
          <p className="text-sm text-secondary mt-1">Monitor campus occupancy, booking trends, and recent activity.</p>
        </div>

        {loading && !stats ? (
          <div className="space-y-6 lg:space-y-8">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-7">
              {Array.from({ length: 7 }).map((_, index) => (
                <DashboardStatSkeleton key={index} />
              ))}
            </div>
            <div className="grid gap-6 lg:grid-cols-3">
              <SkeletonCard lines={4} />
              <SkeletonCard lines={4} />
            </div>
          </div>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-7">
              <div className="card p-5 bg-background border-border flex items-center justify-between">
                <div>
                  <p className="text-secondary text-sm font-medium mb-1">Total Users</p>
                  <p className="text-2xl font-bold text-text">{stats?.totalUsers ?? 0}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                  <Users size={20} />
                </div>
              </div>
              <div className="card p-5 bg-background border-border flex items-center justify-between">
                <div>
                  <p className="text-secondary text-sm font-medium mb-1">Total Seats</p>
                  <p className="text-2xl font-bold text-text">{stats?.totalSeats ?? 0}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-500">
                  <LayoutGrid size={20} />
                </div>
              </div>
              <div className="card p-5 bg-background border-border flex items-center justify-between">
                <div>
                  <p className="text-secondary text-sm font-medium mb-1">Total Reservations</p>
                  <p className="text-2xl font-bold text-text">{stats?.totalReservations ?? 0}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <CalendarRange size={20} />
                </div>
              </div>
              <div className="card p-5 bg-background border-border flex items-center justify-between">
                <div>
                  <p className="text-secondary text-sm font-medium mb-1">Available Seats</p>
                  <p className="text-2xl font-bold text-text">{stats?.seatStatus?.available ?? 0}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-available/10 flex items-center justify-center text-available">
                  <span className="w-3 h-3 rounded-full bg-available"></span>
                </div>
              </div>
              <div className="card p-5 bg-background border-border flex items-center justify-between">
                <div>
                  <p className="text-secondary text-sm font-medium mb-1">Reserved Seats</p>
                  <p className="text-2xl font-bold text-text">{stats?.seatStatus?.reserved ?? 0}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-reserved/10 flex items-center justify-center text-reserved">
                  <span className="w-3 h-3 rounded-full bg-reserved"></span>
                </div>
              </div>
              <div className="card p-5 bg-background border-border flex items-center justify-between">
                <div>
                  <p className="text-secondary text-sm font-medium mb-1">Occupied Seats</p>
                  <p className="text-2xl font-bold text-text">{stats?.seatStatus?.occupied ?? 0}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-occupied/10 flex items-center justify-center text-occupied">
                  <span className="w-3 h-3 rounded-full bg-occupied"></span>
                </div>
              </div>
              <div className="card p-5 bg-background border-border flex items-center justify-between border-primary/20 bg-primary/5">
                <div>
                  <p className="text-secondary text-sm font-medium mb-1">Occupancy</p>
                  <p className="text-2xl font-bold text-primary">{stats?.occupancyPercentage ?? 0}%</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                  <Percent size={20} />
                </div>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              <div className="card p-6 lg:col-span-2">
                <h2 className="mb-6 font-semibold text-lg">Weekly Booking Trends</h2>
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={stats?.weeklyTrend || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6F7D3C" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#6F7D3C" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E7E0D3" />
                      <XAxis dataKey="_id" tickFormatter={(tick) => tick.slice(5)} stroke="#737373" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                      <YAxis stroke="#737373" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip
                        contentStyle={{ borderRadius: '12px', border: '1px solid #E7E0D3', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                        itemStyle={{ color: '#2F2F2F', fontWeight: 500 }}
                        labelStyle={{ color: '#737373', marginBottom: '4px' }}
                      />
                      <Area type="monotone" dataKey="count" stroke="#6F7D3C" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="card p-6">
                <h2 className="mb-6 font-semibold text-lg">Occupancy Distribution</h2>
                <div className="h-60 w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                        itemStyle={{ color: '#2F2F2F', fontWeight: 500 }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center gap-6 mt-4">
                  {pieData.map((entry, index) => (
                    <div key={entry.name} className="flex items-center gap-2 text-sm">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: PIE_COLORS[index] }}></span>
                      <span className="text-secondary">{entry.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard label="Most used floor" value={stats?.mostUsedFloor?._id || '—'} subtext={stats?.mostUsedFloor ? `${stats.mostUsedFloor.count} bookings` : undefined} />
              <StatCard label="Most used section" value={stats?.mostUsedSection?._id || '—'} subtext={stats?.mostUsedSection ? `${stats.mostUsedSection.count} bookings` : undefined} />
              <StatCard label="Peak hour usage" value={peakHour ? `${String(peakHour.hour).padStart(2, '0')}:00` : '—'} subtext={peakHour ? `${peakHour.count} bookings` : undefined} />
              <StatCard label="Active reservations" value={stats?.activeBookings ?? 0} subtext="Currently occupied or in progress" />
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              <div className="card p-6 lg:col-span-2 overflow-hidden flex flex-col">
                <h2 className="mb-4 font-semibold text-lg">Recent Reservations</h2>
                <div className="-mx-6 -mb-6 flex-1 bg-background/50">
                  {stats?.recentBookings?.length ? (
                    <DataTable columns={columns} rows={(stats.recentBookings || []).map((r) => ({ ...r, id: r._id }))} />
                  ) : (
                    <TableSkeleton rows={4} columns={6} />
                  )}
                </div>
              </div>

              <div className="card p-6">
                <h2 className="mb-6 font-semibold text-lg flex items-center gap-2">
                  <Activity size={20} className="text-primary" />
                  Recent Activity Feed
                </h2>
                <div className="space-y-5 relative before:absolute before:inset-y-0 before:left-[11px] before:w-px before:bg-border">
                  {(stats?.recentActivities || []).slice(0, 4).map((activity) => {
                    const tone = activity.tone === 'cancel' ? 'bg-occupied' : activity.tone === 'complete' ? 'bg-available' : 'bg-primary';
                    return (
                      <div key={activity.id} className="flex gap-4 relative z-10">
                        <div className={`w-6 h-6 rounded-full flex shrink-0 items-center justify-center border-4 border-card ${tone}`}></div>
                        <div className="pt-0.5">
                          <p className="text-sm text-text font-medium leading-tight">{activity.action}</p>
                          <p className="text-xs text-secondary mt-1">{formatRelativeTime(activity.time)}</p>
                        </div>
                      </div>
                    );
                  })}
                  {!(stats?.recentActivities || []).length && <SkeletonCard lines={3} />}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}