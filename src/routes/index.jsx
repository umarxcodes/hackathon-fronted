import { Navigate, createBrowserRouter } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import DashboardPage from "../pages/dashboard/DashboardPage";
import PatientsPage from "../pages/patients/PatientsPage";
import PatientDetailPage from "../pages/patients/PatientDetailPage";
import PatientFormPage from "../pages/patients/PatientFormPage";
import AppointmentsPage from "../pages/appointments/AppointmentsPage";
import AppointmentDetailPage from "../pages/appointments/AppointmentDetailPage";
import BookAppointmentPage from "../pages/appointments/BookAppointmentPage";
import PrescriptionsPage from "../pages/prescriptions/PrescriptionsPage";
import PrescriptionDetailPage from "../pages/prescriptions/PrescriptionDetailPage";
import WritePrescriptionPage from "../pages/prescriptions/WritePrescriptionPage";
import UsersPage from "../pages/users/UsersPage";
import UserFormPage from "../pages/users/UserFormPage";
import AIToolsPage from "../pages/ai/AIToolsPage";
import AnalyticsPage from "../pages/analytics/AnalyticsPage";
import NotFoundPage from "../pages/NotFoundPage";
import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";

const router = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { index: true, element: <Navigate to="/dashboard" replace /> },
          { path: "/dashboard", element: <DashboardPage /> },
          { path: "/patients", element: <PatientsPage /> },
          { path: "/patients/new", element: <PatientFormPage /> },
          { path: "/patients/:id", element: <PatientDetailPage /> },
          { path: "/patients/:id/edit", element: <PatientFormPage /> },
          { path: "/appointments", element: <AppointmentsPage /> },
          {
            element: (
              <RoleRoute allowedRoles={["admin", "receptionist", "patient"]} />
            ),
            children: [
              { path: "/appointments/book", element: <BookAppointmentPage /> },
            ],
          },
          { path: "/appointments/:id", element: <AppointmentDetailPage /> },
          { path: "/prescriptions", element: <PrescriptionsPage /> },
          {
            element: <RoleRoute allowedRoles={["doctor"]} />,
            children: [
              {
                path: "/prescriptions/write",
                element: <WritePrescriptionPage />,
              },
            ],
          },
          { path: "/prescriptions/:id", element: <PrescriptionDetailPage /> },
          {
            element: <RoleRoute allowedRoles={["admin"]} />,
            children: [
              { path: "/users", element: <UsersPage /> },
              { path: "/users/new", element: <UserFormPage /> },
              { path: "/users/:id/edit", element: <UserFormPage /> },
            ],
          },
          {
            element: (
              <RoleRoute allowedRoles={["admin", "doctor", "patient"]} />
            ),
            children: [{ path: "/ai-tools", element: <AIToolsPage /> }],
          },
          {
            element: <RoleRoute allowedRoles={["admin", "doctor"]} />,
            children: [{ path: "/analytics", element: <AnalyticsPage /> }],
          },
        ],
      },
    ],
  },
  { path: "*", element: <NotFoundPage /> },
]);

export default router;
