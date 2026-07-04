export default function StatCard({ label, value, subtext }) {
  return (
    <div className="card">
      <p className="text-sm text-secondary">{label}</p>
      <p className="mt-1 text-2xl font-semibold tracking-tight">{value}</p>
      {subtext && <p className="mt-1 text-xs text-secondary">{subtext}</p>}
    </div>
  );
}
