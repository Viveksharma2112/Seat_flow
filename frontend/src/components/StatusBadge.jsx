const statusStyles = {
  Available: 'bg-available/10 text-available',
  Reserved: 'bg-reserved/10 text-reserved',
  Occupied: 'bg-occupied/10 text-occupied',
  Active: 'bg-primary/10 text-primary',
  Completed: 'bg-secondary/10 text-secondary',
  Cancelled: 'bg-occupied/10 text-occupied',
  Expired: 'bg-secondary/10 text-secondary',
};

export default function StatusBadge({ status }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[status] || 'bg-border text-secondary'}`}>
      {status}
    </span>
  );
}
