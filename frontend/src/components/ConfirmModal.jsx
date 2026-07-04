import { useEffect, useRef } from 'react';

export default function ConfirmModal({
  open,
  title,
  children,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmTone = 'primary',
  onConfirm,
  onCancel,
  busy = false,
}) {
  const confirmButtonRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        onCancel?.();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    const timer = window.setTimeout(() => confirmButtonRef.current?.focus(), 0);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.clearTimeout(timer);
    };
  }, [open, onCancel]);

  if (!open) return null;

  const confirmClasses =
    confirmTone === 'danger'
      ? 'btn-primary bg-occupied hover:bg-occupied/90 focus-visible:ring-occupied/20'
      : 'btn-primary focus-visible:ring-primary/20';

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close confirmation modal"
        className="absolute inset-0 bg-text/50 backdrop-blur-[2px]"
        onClick={onCancel}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        className="relative z-10 w-full max-w-lg overflow-hidden rounded-3xl border border-border bg-card shadow-2xl"
      >
        <div className="border-b border-border/60 bg-background/40 px-6 py-5">
          <h2 id="confirm-modal-title" className="text-lg font-semibold text-text">
            {title}
          </h2>
        </div>
        <div className="space-y-4 px-6 py-5 text-sm text-secondary">{children}</div>
        <div className="flex items-center justify-end gap-3 border-t border-border/60 bg-background/30 px-6 py-4">
          <button type="button" className="btn-outline" onClick={onCancel}>
            {cancelText}
          </button>
          <button
            ref={confirmButtonRef}
            type="button"
            className={confirmClasses}
            onClick={onConfirm}
            disabled={busy}
          >
            {busy ? 'Working...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}