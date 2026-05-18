import { NavLink } from "react-router-dom";
import {
  BarChart3,
  Brain,
  Calendar,
  FileText,
  Home,
  Users,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

const items = {
  admin: [
    ["Home", "/dashboard", Home],
    ["Users", "/users", Users],
    ["Visits", "/appointments", Calendar],
    ["AI", "/ai-tools", Brain],
    ["Stats", "/analytics", BarChart3],
  ],
  doctor: [
    ["Home", "/dashboard", Home],
    ["Patients", "/patients", Users],
    ["Visits", "/appointments", Calendar],
    ["Rx", "/prescriptions", FileText],
    ["AI", "/ai-tools", Brain],
  ],
  receptionist: [
    ["Home", "/dashboard", Home],
    ["Patients", "/patients", Users],
    ["Visits", "/appointments", Calendar],
  ],
  patient: [
    ["Home", "/dashboard", Home],
    ["Visits", "/appointments", Calendar],
    ["Rx", "/prescriptions", FileText],
  ],
};

export default function MobileNav() {
  const { user } = useAuth();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 grid h-16 grid-flow-col border-t border-border bg-navy-card lg:hidden">
      {(items[user?.role] || []).map(([label, to, Icon]) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-1 text-xs font-semibold ${isActive ? "text-teal" : "text-slate-400"}`
          }
        >
          <Icon className="h-5 w-5" />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
