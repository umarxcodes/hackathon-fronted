import { useRoleAccess } from "../../hooks/useRoleAccess";
import AdminDashboard from "../dashboard/AdminDashboard";
import DoctorDashboard from "../dashboard/DoctorDashboard";

export default function AnalyticsPage() {
  const { isAdmin } = useRoleAccess();
  return isAdmin ? <AdminDashboard /> : <DoctorDashboard />;
}
