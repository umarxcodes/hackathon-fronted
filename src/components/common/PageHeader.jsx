export default function PageHeader({ title, subtitle, action }) {
  const Icon = action?.icon;
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-extrabold tracking-normal text-slate-50 md:text-3xl">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-1 text-sm text-slate-400">{subtitle}</p>
        ) : null}
      </div>
      {action ? (
        <button
          className="btn-primary w-full sm:w-auto"
          onClick={action.onClick}
        >
          {Icon ? <Icon className="h-4 w-4" /> : null}
          {action.label}
        </button>
      ) : null}
    </div>
  );
}
