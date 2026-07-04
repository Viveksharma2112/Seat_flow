export default function Alert({ type = 'error', message, onClose }) {
  if (!message) return null;

  const styles = {
    error: 'border-occupied/30 bg-occupied/5 text-occupied',
    success: 'border-available/30 bg-available/5 text-available',
    info: 'border-selected/30 bg-selected/5 text-selected',
  };

  return (
    <div className={`flex items-start justify-between rounded-lg border px-4 py-3 text-sm ${styles[type]}`}>
      <span>{message}</span>
      {onClose && (
        <button type="button" onClick={onClose} className="ml-3 opacity-70 hover:opacity-100">
          ×
        </button>
      )}
    </div>
  );
}
