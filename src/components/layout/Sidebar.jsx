import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Activity,
  BarChart3,
  Brain,
  Calendar,
  ChevronLeft,
  ChevronRight,
  FileText,
  Home,
  LogOut,
  Stethoscope,
  Users,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import RoleBadge from "../common/RoleBadge";
import { initials } from "../../utils/formatters";

const nav = {
  admin: [
    ["Dashboard", "/dashboard", Home],
    ["Users", "/users", Users],
    ["Patients", "/patients", Activity],
    ["Appointments", "/appointments", Calendar],
    ["Prescriptions", "/prescriptions", FileText],
    ["AI Tools", "/ai-tools", Brain],
    ["Analytics", "/analytics", BarChart3],
  ],
  doctor: [
    ["Dashboard", "/dashboard", Home],
    ["Patients", "/patients", Activity],
    ["Appointments", "/appointments", Calendar],
    ["Prescriptions", "/prescriptions", FileText],
    ["AI Tools", "/ai-tools", Brain],
    ["My Stats", "/analytics", BarChart3],
  ],
  receptionist: [
    ["Dashboard", "/dashboard", Home],
    ["Patients", "/patients", Activity],
    ["Appointments", "/appointments", Calendar],
  ],
  patient: [
    ["Dashboard", "/dashboard", Home],
    ["My Appointments", "/appointments", Calendar],
    ["My Prescriptions", "/prescriptions", FileText],
  ],
};

export default function Sidebar({ onNavigate }) {
  const [collapsed, setCollapsed] = useState(false);
  const { user, handleLogout } = useAuth();
  const navigate = useNavigate();
  const items = nav[user?.role] || [];
  const logout = () => {
    handleLogout();
    navigate("/login");
  };
  return (
    <aside
      className={`flex h-full flex-col border-r border-border bg-navy-card transition-all duration-200 ${collapsed ? "w-[72px]" : "w-[260px]"}`}
    >
      <div className="flex h-16 items-center justify-between border-b border-border px-4">
        <div className="flex items-center gap-3 overflow-hidden">
          <Stethoscope className="h-7 w-7 shrink-0 text-teal" />
          {!collapsed ? (
            <span className="font-heading text-xl font-extrabold">
              ClinicAI
            </span>
          ) : null}
        </div>
        <button
          className="hidden rounded-lg border border-border p-1.5 text-slate-300 hover:text-teal lg:block"
          onClick={() => setCollapsed((value) => !value)}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {items.map(([label, to, Icon]) => (
          <NavLink
            key={to}
            to={to}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg border-l-4 px-3 py-3 text-sm font-semibold transition ${isActive ? "border-teal bg-teal/10 text-teal" : "border-transparent text-slate-300 hover:bg-slate-800/40 hover:text-teal"}`
            }
          >
            <Icon className="h-5 w-5 shrink-0" />
            {!collapsed ? <span>{label}</span> : null}
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-border p-3">
        <div className="mb-3 flex items-center gap-3 rounded-lg bg-navy-secondary p-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal font-bold text-navy">
            {initials(user?.name)}
          </div>
          {!collapsed ? (
            <div className="min-w-0">
              <p className="truncate text-sm font-bold">{user?.name}</p>
              <RoleBadge role={user?.role} />
            </div>
          ) : null}
        </div>
        <button className="btn-secondary w-full px-3" onClick={logout}>
          <LogOut className="h-4 w-4" />
          {!collapsed ? "Logout" : null}
        </button>
      </div>
    </aside>
  );
}
