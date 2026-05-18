import { Inbox } from "lucide-react";

export default function EmptyState({
  title = "No records found",
  message = "There is nothing to show yet.",
  action,
}) {
  return (
    <div className="panel flex flex-col items-center justify-center px-6 py-12 text-center">
      <Inbox className="mb-4 h-10 w-10 text-teal" />
      <h3 className="text-lg font-bold">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-slate-400">{message}</p>
      {action ? (
        <button className="btn-primary mt-5" onClick={action.onClick}>
          {action.label}
        </button>
      ) : null}
    </div>
  );
}
