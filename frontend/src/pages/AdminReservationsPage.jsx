import { useEffect, useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';
import { reservationService } from '../services';
import { useAsync } from '../hooks/useAsync';
import { TableSkeleton } from '../components/SkeletonLoader';

export default function AdminReservationsPage() {
  const { loading, run } = useAsync();
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    run(async () => {
      const { data } = await reservationService.getAll({ limit: 50 });
      setReservations(data.data);
    });
  }, [run]);

  const columns = [
    { key: 'user', label: 'User', render: (row) => row.userId?.name },
    { key: 'email', label: 'Email', render: (row) => row.userId?.email },
    { key: 'seat', label: 'Seat', render: (row) => row.seatId?.seatNumber },
    {
      key: 'location',
      label: 'Location',
      render: (row) =>
        row.seatId ? `${row.seatId.floor?.name}, ${row.seatId.section?.name}` : '—',
    },
    {
      key: 'start',
      label: 'Start',
      render: (row) => new Date(row.startTime).toLocaleString(),
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => <StatusBadge status={row.status} />,
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">All reservations</h1>
          <p className="text-sm text-secondary">Complete booking activity across the platform.</p>
        </div>

        {loading ? (
          <TableSkeleton rows={6} columns={6} />
        ) : (
          <DataTable
            columns={columns}
            rows={reservations.map((r) => ({ ...r, id: r._id }))}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
