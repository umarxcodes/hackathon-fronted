import { AlertTriangle, Loader2, X } from "lucide-react";

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  loading,
}) {
  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        className="panel w-full max-w-md p-5 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-danger/15 p-2 text-danger">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-bold">{title}</h2>
          </div>
          <button
            className="rounded p-1 text-slate-400 hover:text-white"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <p className="mt-4 text-sm leading-6 text-slate-300">{message}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn-danger" onClick={onConfirm} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}{" "}
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
