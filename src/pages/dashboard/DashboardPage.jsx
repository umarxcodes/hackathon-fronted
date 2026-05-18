import { useAuth } from "../../hooks/useAuth";
import AdminDashboard from "./AdminDashboard";
import DoctorDashboard from "./DoctorDashboard";
import ReceptionistDashboard from "./ReceptionistDashboard";
import PatientDashboard from "./PatientDashboard";

export default function DashboardPage() {
  const { user } = useAuth();
  if (user?.role === "admin") return <AdminDashboard />;
  if (user?.role === "doctor") return <DoctorDashboard />;
  if (user?.role === "receptionist") return <ReceptionistDashboard />;
  return <PatientDashboard />;
}
