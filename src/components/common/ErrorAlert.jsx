import { AlertTriangle } from "lucide-react";
import { getApiError } from "../../utils/formatters";

export default function ErrorAlert({ error, message }) {
  return (
    <div className="rounded-lg border border-danger/30 bg-danger/10 p-4 text-sm text-red-100">
      <div className="flex items-center gap-2 font-semibold text-danger">
        <AlertTriangle className="h-4 w-4" /> Error
      </div>
      <p className="mt-1 text-slate-200">{message || getApiError(error)}</p>
    </div>
  );
}
