import { useEffect, useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import DataTable from '../components/DataTable';
import Alert from '../components/Alert';
import { userService } from '../services';
import { useAsync } from '../hooks/useAsync';
import toast from 'react-hot-toast';
import { TableSkeleton } from '../components/SkeletonLoader';

export default function ManageUsersPage() {
  const { loading, error, setError, run } = useAsync();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');

  const load = async (params = {}) => {
    const { data } = await userService.getAll({ limit: 50, ...params });
    setUsers(data.data);
  };

  useEffect(() => {
    run(() => load());
  }, [run]);

  const handleSearch = async (e) => {
    e.preventDefault();
    await run(() => load({ search }));
  };

  const toggleStatus = async (user) => {
    const next = user.status === 'Active' ? 'Inactive' : 'Active';
    await run(() => userService.update(user._id, { status: next }));
    toast.success(`User ${next.toLowerCase()}d`);
    await load({ search });
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role' },
    { key: 'status', label: 'Status' },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <button type="button" onClick={() => toggleStatus(row)} className="text-sm text-primary hover:underline">
          {row.status === 'Active' ? 'Deactivate' : 'Activate'}
        </button>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Manage users</h1>
          <p className="text-sm text-secondary">Search and update user accounts.</p>
        </div>

        <form onSubmit={handleSearch} className="flex gap-3">
          <input
            className="input-field max-w-md"
            placeholder="Search by name or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit" className="btn-outline">
            Search
          </button>
        </form>

        <Alert message={error} onClose={() => setError(null)} />

        {loading && !users.length ? (
          <TableSkeleton rows={5} columns={4} />
        ) : (
          <DataTable columns={columns} rows={users.map((u) => ({ ...u, id: u._id }))} />
        )}
      </div>
    </DashboardLayout>
  );
}
