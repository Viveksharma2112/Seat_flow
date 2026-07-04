import { useEffect, useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';
import Alert from '../components/Alert';
import { floorService, sectionService } from '../services';
import { useAsync } from '../hooks/useAsync';
import toast from 'react-hot-toast';
import { TableSkeleton } from '../components/SkeletonLoader';

export default function ManageFloorsPage() {
  const { loading, error, setError, run } = useAsync();
  const [floors, setFloors] = useState([]);
  const [sections, setSections] = useState([]);
  const [floorForm, setFloorForm] = useState({ name: '', description: '' });
  const [sectionForm, setSectionForm] = useState({ name: '', floor: '', description: '' });

  const load = async () => {
    const [f, s] = await Promise.all([
      floorService.getAll({ limit: 50 }),
      sectionService.getAll({ limit: 50 }),
    ]);
    setFloors(f.data.data);
    setSections(s.data.data);
  };

  useEffect(() => {
    run(load);
  }, [run]);

  const addFloor = async (e) => {
    e.preventDefault();
    await run(() => floorService.create(floorForm));
    toast.success('Floor created successfully');
    setFloorForm({ name: '', description: '' });
    await load();
  };

  const addSection = async (e) => {
    e.preventDefault();
    await run(() => sectionService.create(sectionForm));
    toast.success('Section created successfully');
    setSectionForm({ name: '', floor: '', description: '' });
    await load();
  };

  const floorColumns = [
    { key: 'name', label: 'Floor' },
    { key: 'description', label: 'Description' },
    {
      key: 'status',
      label: 'Status',
      render: (row) => (row.isActive ? 'Active' : 'Inactive'),
    },
  ];

  const sectionColumns = [
    { key: 'name', label: 'Section' },
    { key: 'floor', label: 'Floor', render: (row) => row.floor?.name },
    { key: 'description', label: 'Description' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-semibold">Floors & sections</h1>
          <p className="text-sm text-secondary">Organize your space hierarchy.</p>
        </div>

        <Alert message={error} onClose={() => setError(null)} />

        <div className="grid gap-6 lg:grid-cols-2">
          <form onSubmit={addFloor} className="card space-y-3">
            <h2 className="font-medium">Add floor</h2>
            <input
              className="input-field"
              placeholder="Floor name"
              value={floorForm.name}
              onChange={(e) => setFloorForm({ ...floorForm, name: e.target.value })}
              required
            />
            <input
              className="input-field"
              placeholder="Description"
              value={floorForm.description}
              onChange={(e) => setFloorForm({ ...floorForm, description: e.target.value })}
            />
            <button type="submit" className="btn-primary" disabled={loading}>
              Save floor
            </button>
          </form>

          <form onSubmit={addSection} className="card space-y-3">
            <h2 className="font-medium">Add section</h2>
            <select
              className="input-field"
              value={sectionForm.floor}
              onChange={(e) => setSectionForm({ ...sectionForm, floor: e.target.value })}
              required
            >
              <option value="">Select floor</option>
              {floors.map((f) => (
                <option key={f._id} value={f._id}>{f.name}</option>
              ))}
            </select>
            <input
              className="input-field"
              placeholder="Section name"
              value={sectionForm.name}
              onChange={(e) => setSectionForm({ ...sectionForm, name: e.target.value })}
              required
            />
            <button type="submit" className="btn-primary" disabled={loading}>
              Save section
            </button>
          </form>
        </div>

        {loading && !floors.length ? (
          <TableSkeleton rows={4} columns={3} />
        ) : (
          <>
            <DataTable columns={floorColumns} rows={floors.map((f) => ({ ...f, id: f._id }))} />
            <DataTable columns={sectionColumns} rows={sections.map((s) => ({ ...s, id: s._id }))} />
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
