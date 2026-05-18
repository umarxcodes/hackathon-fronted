import { TrendingDown, TrendingUp } from "lucide-react";

export default function StatCard({
  title,
  value,
  icon: Icon,
  color = "#00D4C8",
  trend,
}) {
  const isDown = trend?.direction === "down";
  return (
    <div className="panel p-5">
      <div className="flex items-start justify-between gap-3">
        <div
          className="rounded-lg p-3"
          style={{ backgroundColor: `${color}18`, color }}
        >
          {Icon ? <Icon className="h-5 w-5" /> : null}
        </div>
        {trend ? (
          <span
            className={`inline-flex items-center gap-1 text-xs font-semibold ${isDown ? "text-danger" : "text-success"}`}
          >
            {isDown ? (
              <TrendingDown className="h-3 w-3" />
            ) : (
              <TrendingUp className="h-3 w-3" />
            )}
            {trend.value}
          </span>
        ) : null}
      </div>
      <div className="mt-5 text-3xl font-extrabold font-heading">
        {value ?? 0}
      </div>
      <p className="mt-1 text-sm text-slate-400">{title}</p>
    </div>
  );
}
