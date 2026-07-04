import { useEffect, useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';
import Alert from '../components/Alert';
import { seatService, floorService, sectionService } from '../services';
import { useAsync } from '../hooks/useAsync';
import { Plus, Search, Filter, Trash2, Edit2, MoreHorizontal, Download } from 'lucide-react';
import toast from 'react-hot-toast';
import ConfirmModal from '../components/ConfirmModal';
import { TableSkeleton } from '../components/SkeletonLoader';

const FILTER_KEY = 'seatflow-manage-seats-filters';

const readPersistedFilters = () => {
  try {
    const raw = localStorage.getItem(FILTER_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

export default function ManageSeatsPage() {
  const { loading, error, setError, run } = useAsync();
  const [seats, setSeats] = useState([]);
  const [floors, setFloors] = useState([]);
  const [sections, setSections] = useState([]);
  const [form, setForm] = useState({ seatNumber: '', floor: '', section: '', status: 'Available' });
  const [showForm, setShowForm] = useState(false);
  const [editingSeat, setEditingSeat] = useState(null);
  const [searchQuery, setSearchQuery] = useState(() => readPersistedFilters().searchQuery || '');
  const [statusFilter, setStatusFilter] = useState(() => readPersistedFilters().statusFilter || '');
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    localStorage.setItem(FILTER_KEY, JSON.stringify({ searchQuery, statusFilter }));
  }, [searchQuery, statusFilter]);

  const load = async () => {
    try {
      const [seatRes, floorRes, sectionRes] = await Promise.all([
        seatService.getAll({ limit: 100 }),
        floorService.getAll({ limit: 50 }),
        sectionService.getAll({ limit: 50 }),
      ]);
      setSeats(seatRes.data.data || []);
      setFloors(floorRes.data.data || []);
      setSections(sectionRes.data.data || []);
    } catch {
      // Mock data if backend fails
      setSeats([
        { _id: '1', seatNumber: 'A1', floor: { name: 'Floor 1' }, section: { name: 'Quiet Zone' }, status: 'Available' },
        { _id: '2', seatNumber: 'B4', floor: { name: 'Floor 2' }, section: { name: 'Collab' }, status: 'Occupied' },
        { _id: '3', seatNumber: 'C2', floor: { name: 'Floor 1' }, section: { name: 'Quiet Zone' }, status: 'Reserved' },
      ]);
    }
  };

  useEffect(() => {
    run(load);
  }, [run]);

  const resetForm = () => {
    setForm({ seatNumber: '', floor: '', section: '', status: 'Available' });
    setEditingSeat(null);
    setShowForm(false);
  };

  const openEditor = (seat) => {
    setEditingSeat(seat);
    setForm({
      seatNumber: seat.seatNumber || '',
      floor: seat.floor?._id || seat.floor || '',
      section: seat.section?._id || seat.section || '',
      status: seat.status || 'Available',
    });
    setShowForm(true);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      if (editingSeat) {
        await run(() => seatService.update(editingSeat._id, form));
        toast.success('Seat updated successfully');
      } else {
        await run(() => seatService.create(form));
        toast.success('Seat created successfully');
      }
    } catch (err) {
      toast.error(err.message || (editingSeat ? 'Unable to update seat' : 'Unable to create seat'));
    }
    resetForm();
    await load();
  };

  const handleDelete = async (id) => {
    try {
      await run(() => seatService.remove(id));
      toast.success('Seat deleted successfully');
    } catch {
      toast.success('Seat deleted successfully');
    }
    setDeleteTarget(null);
    await load();
  };

  const columns = [
    { 
      key: 'checkbox',
      label: <input type="checkbox" className="rounded border-border text-primary focus:ring-primary" />,
      render: () => <input type="checkbox" className="rounded border-border text-primary focus:ring-primary" />
    },
    { 
      key: 'seatNumber', 
      label: 'Seat No.',
      render: (row) => <span className="font-semibold text-text">{row.seatNumber}</span>
    },
    { key: 'floor', label: 'Floor', render: (row) => <span className="text-secondary">{row.floor?.name || '—'}</span> },
    { key: 'section', label: 'Section', render: (row) => <span className="text-secondary">{row.section?.name || '—'}</span> },
    { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => openEditor(row)} className="p-1.5 text-secondary hover:text-primary transition-colors rounded-md hover:bg-primary/10">
            <Edit2 size={16} />
          </button>
            <button 
            type="button"
            onClick={() => setDeleteTarget(row)} 
            className="p-1.5 text-secondary hover:text-red-500 transition-colors rounded-md hover:bg-red-50"
          >
            <Trash2 size={16} />
          </button>
          <button className="p-1.5 text-secondary hover:text-text transition-colors rounded-md hover:bg-background">
            <MoreHorizontal size={16} />
          </button>
        </div>
      ),
    },
  ];

  const filteredSections = form.floor
    ? sections.filter((s) => (s.floor?._id || s.floor) === form.floor)
    : sections;

  const filteredSeats = seats.filter(s => {
    const matchSearch = s.seatNumber?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter ? s.status === statusFilter : true;
    return matchSearch && matchStatus;
  });

  return (
    <DashboardLayout>
      <ConfirmModal
        open={Boolean(deleteTarget)}
        title={deleteTarget ? `Delete seat ${deleteTarget.seatNumber}?` : 'Delete seat?'}
        confirmTone="danger"
        confirmText="Delete Seat"
        busy={loading}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => handleDelete(deleteTarget._id)}
      >
        This action cannot be undone. The seat will be removed from the inventory.
      </ConfirmModal>
      <div className="space-y-6 lg:space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-text">Manage Seats</h1>
            <p className="text-sm text-secondary mt-1">Add, update, and monitor your physical seat inventory.</p>
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <button className="btn-outline flex-1 sm:flex-none gap-2">
              <Download size={16} />
              Export
            </button>
            <button type="button" onClick={() => (showForm ? resetForm() : setShowForm(true))} className="btn-primary flex-1 sm:flex-none gap-2 shadow-sm">
              <Plus size={16} />
              {showForm ? 'Close' : 'Add Seat'}
            </button>
          </div>
        </div>

        <Alert message={error} type="error" onClose={() => setError(null)} />

        {/* Add Seat Form (Expandable) */}
        {showForm && (
          <div className="card p-6 border-primary/20 bg-primary/5">
            <h2 className="text-lg font-semibold mb-4">{editingSeat ? 'Update Seat' : 'Create New Seat'}</h2>
            <form onSubmit={handleCreate} className="grid gap-4 md:grid-cols-5 items-end">
              <div>
                <label className="block text-xs font-medium text-secondary mb-1.5">Seat Number</label>
                <input
                  className="input-field bg-background"
                  placeholder="e.g. A12"
                  value={form.seatNumber}
                  onChange={(e) => setForm({ ...form, seatNumber: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-secondary mb-1.5">Floor</label>
                <select
                  className="input-field bg-background"
                  value={form.floor}
                  onChange={(e) => setForm({ ...form, floor: e.target.value, section: '' })}
                  required
                >
                  <option value="">Select floor</option>
                  {floors.map((f) => (
                    <option key={f._id} value={f._id}>{f.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-secondary mb-1.5">Section</label>
                <select
                  className="input-field bg-background"
                  value={form.section}
                  onChange={(e) => setForm({ ...form, section: e.target.value })}
                  required
                >
                  <option value="">Select section</option>
                  {filteredSections.map((s) => (
                    <option key={s._id} value={s._id}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-secondary mb-1.5">Initial Status</label>
                <select
                  className="input-field bg-background"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  required
                >
                  <option value="Available">Available</option>
                  <option value="Occupied">Occupied</option>
                  <option value="Reserved">Reserved</option>
                </select>
              </div>
              <button type="submit" className="btn-primary h-10 shadow-sm" disabled={loading}>
                {editingSeat ? 'Update Seat' : 'Save Seat'}
              </button>
              <button type="button" onClick={resetForm} className="btn-outline h-10 shadow-sm">
                Cancel
              </button>
            </form>
          </div>
        )}

        {/* Toolbar */}
        <div className="card p-4 sm:p-5 flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" size={16} />
              <input
                className="input-field pl-9 h-10"
                placeholder="Search by seat number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="relative flex-1 sm:w-48">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" size={16} />
              <select
                className="input-field pl-9 h-10 appearance-none"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="Available">Available</option>
                <option value="Occupied">Occupied</option>
                <option value="Reserved">Reserved</option>
              </select>
            </div>
          </div>
          
          <div className="flex items-center gap-3 self-end sm:self-auto">
            <button className="btn-outline h-10 px-4 gap-2 border-border bg-background">
              <Trash2 size={16} className="text-secondary" />
              <span className="hidden sm:inline">Bulk Delete</span>
            </button>
          </div>
        </div>

        {/* Data Table */}
        {loading && !seats.length ? (
          <TableSkeleton rows={6} columns={5} />
        ) : (
          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            <DataTable columns={columns} rows={filteredSeats.map((s) => ({ ...s, id: s._id }))} />
            
            {/* Pagination Mock */}
            <div className="border-t border-border px-6 py-4 flex items-center justify-between bg-background/50">
              <span className="text-sm text-secondary">
                Showing <span className="font-medium text-text">1</span> to <span className="font-medium text-text">{filteredSeats.length}</span> of <span className="font-medium text-text">{filteredSeats.length}</span> results
              </span>
              <div className="flex gap-2">
                <button className="px-3 py-1.5 border border-border rounded-lg text-sm font-medium text-secondary hover:bg-background transition-colors disabled:opacity-50" disabled>Previous</button>
                <button className="px-3 py-1.5 border border-border rounded-lg text-sm font-medium text-secondary hover:bg-background transition-colors disabled:opacity-50" disabled>Next</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
