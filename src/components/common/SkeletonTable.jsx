export default function SkeletonTable({ rows = 6 }) {
  return (
    <div className="panel overflow-hidden">
      {Array.from({ length: rows }).map((_, index) => (
        <div
          key={index}
          className="grid grid-cols-5 gap-4 border-b border-border p-4 last:border-0"
        >
          {Array.from({ length: 5 }).map((__, cell) => (
            <div
              key={cell}
              className="h-4 animate-pulse rounded bg-slate-700/60"
            />
          ))}
        </div>
      ))}
    </div>
  );
}
