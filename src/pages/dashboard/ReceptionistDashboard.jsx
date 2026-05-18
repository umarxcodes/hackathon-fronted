import { CalendarPlus, Users, CalendarDays } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";
import StatCard from "../../components/common/StatCard";
import DataTable from "../../components/common/DataTable";
import { useGetPatientsQuery } from "../../features/patients/patientsApi";
import { useGetAppointmentsQuery } from "../../features/appointments/appointmentsApi";
import { getItems } from "../../utils/formatters";
import { formatDate } from "../../utils/formatDate";
import StatusBadge from "../../components/common/StatusBadge";

export default function ReceptionistDashboard() {
  const navigate = useNavigate();
  const { data: patientsData } = useGetPatientsQuery({ limit: 5 });
  const { data: appointmentsData } = useGetAppointmentsQuery();
  const appointments = getItems(appointmentsData).slice(0, 6);
  return (
    <>
      <PageHeader
        title="Reception Desk"
        subtitle="Patient intake and appointment coordination."
      />
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Patients"
          value={patientsData?.total || getItems(patientsData).length}
          icon={Users}
          color="#00D4C8"
        />
        <StatCard
          title="Appointments"
          value={getItems(appointmentsData).length}
          icon={CalendarDays}
          color="#FFB830"
        />
        <div className="panel flex items-center justify-center p-5">
          <button
            className="btn-primary w-full"
            onClick={() => navigate("/appointments/book")}
          >
            <CalendarPlus className="h-4 w-4" /> Book Appointment
          </button>
        </div>
      </div>
      <div className="mt-6">
        <h2 className="mb-3 font-heading text-xl font-bold">
          Recent Appointments
        </h2>
        <DataTable
          data={appointments}
          columns={[
            {
              key: "patient",
              label: "Patient",
              render: (r) => r.patientId?.name || "Patient",
            },
            {
              key: "doctor",
              label: "Doctor",
              render: (r) => r.doctorId?.name || "Doctor",
            },
            { key: "date", label: "Date", render: (r) => formatDate(r.date) },
            {
              key: "status",
              label: "Status",
              render: (r) => <StatusBadge status={r.status} />,
            },
          ]}
        />
      </div>
    </>
  );
}
