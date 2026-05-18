import { titleCase } from "../../utils/formatters";

const styles = {
  pending: "bg-warning/15 text-warning",
  confirmed: "bg-teal/15 text-teal",
  completed: "bg-success/15 text-success",
  cancelled: "bg-danger/15 text-danger",
  active: "bg-success/15 text-success",
  inactive: "bg-slate-500/15 text-slate-300",
};

export default function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${styles[status] || "bg-slate-500/15 text-slate-300"}`}
    >
      {titleCase(status)}
    </span>
  );
}
