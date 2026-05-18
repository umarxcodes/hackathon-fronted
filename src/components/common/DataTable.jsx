import EmptyState from "./EmptyState";
import SkeletonTable from "./SkeletonTable";

export default function DataTable({
  columns,
  data = [],
  loading,
  pagination,
  onPageChange,
}) {
  if (loading) return <SkeletonTable />;
  if (!data.length)
    return (
      <EmptyState
        title="No data found"
        message="Try changing filters or create a new record."
      />
    );
  return (
    <div className="panel overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-navy-secondary">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-4 py-3 text-left text-xs font-bold uppercase text-slate-400"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data.map((row, rowIndex) => (
              <tr
                key={row._id || row.id || rowIndex}
                className="transition hover:bg-slate-800/30"
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className="whitespace-nowrap px-4 py-3 text-sm text-slate-200"
                  >
                    {column.render
                      ? column.render(row, rowIndex)
                      : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {pagination ? (
        <div className="flex flex-col gap-3 border-t border-border px-4 py-3 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <span>
            Showing {data.length} of {pagination.total || data.length} results
          </span>
          <div className="flex items-center gap-2">
            <button
              className="btn-secondary px-3 py-1.5"
              disabled={pagination.page <= 1}
              onClick={() => onPageChange?.(pagination.page - 1)}
            >
              Prev
            </button>
            <span className="rounded-lg bg-navy-secondary px-3 py-1.5 text-slate-100">
              {pagination.page} / {pagination.totalPages || 1}
            </span>
            <button
              className="btn-secondary px-3 py-1.5"
              disabled={pagination.page >= (pagination.totalPages || 1)}
              onClick={() => onPageChange?.(pagination.page + 1)}
            >
              Next
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
