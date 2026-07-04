import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import StatusBadge from '../components/StatusBadge';
import Alert from '../components/Alert';
import { reservationService } from '../services';
import { useAsync } from '../hooks/useAsync';
import { Clock, MapPin, Calendar, X, Check, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';
import { BookingCardSkeleton } from '../components/SkeletonLoader';

const formatDateTime = (date) =>
  new Date(date).toLocaleString([], {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

export default function BookingHistoryPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get('tab') || 'active';
  const { loading, error, setError, run } = useAsync();
  const [bookings, setBookings] = useState([]);

  const loadBookings = async () => {
    try {
      const params =
        tab === 'active'
          ? { tab: 'current', limit: 100 }
          : tab === 'history'
            ? { tab: 'history', limit: 100 }
            : { status: 'Cancelled', limit: 100 };
      const { data } = await reservationService.getMine(params);
      setBookings(data.data || []);
    } catch(err) {
      // Mock data if backend fails
      const mockBookings = [
        { _id: '1', status: 'Active', checkedInAt: null, seatId: { seatNumber: 'A12', floor: { name: 'Floor 1'}, section: { name: 'Quiet Zone' } }, startTime: new Date().toISOString(), endTime: new Date(Date.now() + 7200000).toISOString() },
        { _id: '2', status: 'Completed', checkedInAt: new Date(Date.now() - 1500000).toISOString(), checkedOutAt: new Date(Date.now() - 200000).toISOString(), seatId: { seatNumber: 'B5', floor: { name: 'Floor 1'}, section: { name: 'Quiet Zone' } }, startTime: new Date(Date.now() - 86400000).toISOString(), endTime: new Date(Date.now() - 80000000).toISOString() },
        { _id: '3', status: 'Cancelled', seatId: { seatNumber: 'C2', floor: { name: 'Floor 2'}, section: { name: 'Collab' } }, startTime: new Date(Date.now() - 172800000).toISOString(), endTime: new Date(Date.now() - 166400000).toISOString() },
      ];

      const filtered =
        tab === 'active'
          ? mockBookings.filter((booking) => booking.status === 'Active')
          : tab === 'history'
            ? mockBookings.filter((booking) => booking.status === 'Completed')
            : mockBookings.filter((booking) => booking.status === 'Cancelled');
      setBookings(filtered);
    }
  };

  useEffect(() => {
    run(loadBookings);
  }, [tab, run]);

  const handleCancel = async (id) => {
    try {
      await run(() => reservationService.cancel(id));
      toast.success('Booking cancelled successfully');
      await loadBookings();
    } catch (err) {
      toast.error(err.message || 'Unable to cancel booking');
      await loadBookings();
    }
  };

  const handleCheckIn = async (id) => {
    try {
      await run(() => reservationService.checkIn(id));
      toast.success('Checked in successfully');
      await loadBookings();
    } catch (err) {
      toast.error(err.message || 'Unable to check in');
      await loadBookings();
    }
  };

  const handleCheckOut = async (id) => {
    try {
      await run(() => reservationService.checkOut(id));
      toast.success('Checked out successfully');
      await loadBookings();
    } catch (err) {
      toast.error(err.message || 'Unable to check out');
      await loadBookings();
    }
  };

  const tabs = [
    { id: 'active', label: 'Active Bookings' },
    { id: 'history', label: 'Past History' },
    { id: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6 lg:space-y-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text">My Bookings</h1>
          <p className="text-sm text-secondary mt-1">Manage your active reservations and view past history.</p>
        </div>

        {/* Tabs */}
        <div className="border-b border-border">
          <div className="flex gap-6">
            {tabs.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setSearchParams({ tab: t.id })}
                className={`pb-3 text-sm font-medium transition-colors relative ${
                  tab === t.id 
                    ? 'text-primary' 
                    : 'text-secondary hover:text-text'
                }`}
              >
                {t.label}
                {tab === t.id && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full"></span>
                )}
              </button>
            ))}
          </div>
        </div>

        <Alert message={error} type="error" onClose={() => setError(null)} />

        {loading ? (
          <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <BookingCardSkeleton key={index} />
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <div className="card py-20 text-center flex flex-col items-center justify-center bg-background border-dashed border-border/80">
            <div className="w-16 h-16 bg-card rounded-2xl flex items-center justify-center mb-4 text-secondary border border-border shadow-sm">
              <Calendar size={24} />
            </div>
            <h3 className="font-medium text-text mb-1">No {tab} bookings</h3>
            <p className="text-sm text-secondary max-w-sm">You do not have any {tab} reservations at the moment.</p>
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
            {bookings.map((booking) => (
              <div key={booking._id} className="card p-5 flex flex-col group hover:border-primary/30 transition-colors">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                      {booking.seatId?.seatNumber}
                    </div>
                    <div>
                      <p className="font-medium text-text">Seat {booking.seatId?.seatNumber}</p>
                      <p className="text-xs text-secondary flex items-center gap-1 mt-0.5">
                        <MapPin size={12} />
                        {booking.seatId?.floor?.name} · {booking.seatId?.section?.name}
                      </p>
                    </div>
                  </div>
                  <StatusBadge status={booking.checkedInAt && booking.status === 'Active' ? 'Occupied' : booking.status} />
                </div>

                <div className="space-y-3 mb-6 flex-1 bg-background/50 rounded-2xl p-4 border border-border/40">
                  <div className="flex items-center justify-between gap-4 text-sm">
                    <span className="text-secondary">Start Time</span>
                    <span className="font-medium text-text">{formatDateTime(booking.startTime)}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4 text-sm">
                    <span className="text-secondary">End Time</span>
                    <span className="font-medium text-text">{formatDateTime(booking.endTime)}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4 text-sm">
                    <span className="text-secondary">Duration</span>
                    <span className="font-medium text-text">
                      {Math.max(1, Math.round((new Date(booking.endTime) - new Date(booking.startTime)) / 3600000))} Hours
                    </span>
                  </div>
                </div>

                {tab === 'active' && booking.status === 'Active' && (
                  <div className="flex gap-3 mt-auto pt-2 border-t border-border/50">
                    {!booking.checkedInAt ? (
                      <>
                        <button
                          type="button"
                          onClick={() => handleCheckIn(booking._id)}
                          className="flex-1 btn-primary h-10 gap-2 shadow-sm"
                        >
                          <Check size={16} /> Check-In
                        </button>
                        <button
                          type="button"
                          onClick={() => handleCancel(booking._id)}
                          className="btn-outline h-10 px-3 text-secondary hover:text-red-600 hover:border-red-200 hover:bg-red-50 group-hover:border-border"
                          title="Cancel Reservation"
                        >
                          <X size={18} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => handleCheckOut(booking._id)}
                          className="flex-1 btn-primary h-10 gap-2 shadow-sm"
                        >
                          <LogOut size={16} /> Check-Out
                        </button>
                        <div className="flex items-center justify-center rounded-xl bg-green-50 px-3 text-sm font-medium text-green-700">
                          In Progress
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
