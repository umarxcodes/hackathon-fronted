import { Menu, Search } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

export default function TopBar({ onMenu }) {
  const { user } = useAuth();
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-navy/90 px-4 backdrop-blur lg:px-6">
      <button
        className="rounded-lg border border-border p-2 text-slate-200 lg:hidden"
        onClick={onMenu}
      >
        <Menu className="h-5 w-5" />
      </button>
      <div className="hidden max-w-md flex-1 items-center gap-2 rounded-lg border border-border bg-navy-secondary px-3 py-2 text-slate-500 md:flex">
        <Search className="h-4 w-4" />
        <span className="text-sm">
          Search patients, appointments, prescriptions
        </span>
      </div>
      <div className="text-right">
        <p className="text-sm font-bold text-slate-100">{user?.name}</p>
        <p className="text-xs capitalize text-slate-400">{user?.role}</p>
      </div>
    </header>
  );
}
