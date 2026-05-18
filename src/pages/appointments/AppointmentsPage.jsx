import { CalendarPlus, Eye } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DataTable from "../../components/common/DataTable";
import PageHeader from "../../components/common/PageHeader";
import StatusBadge from "../../components/common/StatusBadge";
import { useGetAppointmentsQuery } from "../../features/appointments/appointmentsApi";
import { useRoleAccess } from "../../hooks/useRoleAccess";
import { formatDate } from "../../utils/formatDate";
import { doctorName, getItems, patientName } from "../../utils/formatters";

export default function AppointmentsPage() {
  const navigate = useNavigate();
  const { canBookAppointment } = useRoleAccess();
  const [status, setStatus] = useState("all");
  const { data, isLoading } = useGetAppointmentsQuery();
  const appointments = getItems(data).filter(
    (item) => status === "all" || item.status === status
  );
  return (
    <>
      <PageHeader
        title="Appointments"
        action={
          canBookAppointment
            ? {
                label: "Book Appointment",
                icon: CalendarPlus,
                onClick: () => navigate("/appointments/book"),
              }
            : null
        }
      />
      <div className="mb-4 flex flex-wrap gap-2">
        {["all", "pending", "confirmed", "completed", "cancelled"].map((s) => (
          <button
            key={s}
            className={`rounded-lg px-4 py-2 text-sm font-semibold capitalize ${status === s ? "bg-teal text-navy" : "bg-navy-card text-slate-300"}`}
            onClick={() => setStatus(s)}
          >
            {s}
          </button>
        ))}
      </div>
      <DataTable
        loading={isLoading}
        data={appointments}
        columns={[
          { key: "patient", label: "Patient", render: patientName },
          { key: "doctor", label: "Doctor", render: doctorName },
          { key: "date", label: "Date", render: (r) => formatDate(r.date) },
          { key: "timeSlot", label: "Time Slot" },
          {
            key: "status",
            label: "Status",
            render: (r) => <StatusBadge status={r.status} />,
          },
          {
            key: "actions",
            label: "Actions",
            render: (r) => (
              <button
                className="btn-secondary py-1.5"
                onClick={() => navigate(`/appointments/${r._id}`)}
              >
                <Eye className="h-4 w-4" /> View
              </button>
            ),
          },
        ]}
      />
    </>
  );
}
