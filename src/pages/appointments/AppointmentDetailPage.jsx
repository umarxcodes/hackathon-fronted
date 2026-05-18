import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";
import StatusBadge from "../../components/common/StatusBadge";
import {
  useGetAppointmentQuery,
  useUpdateAppointmentMutation,
} from "../../features/appointments/appointmentsApi";
import { useRoleAccess } from "../../hooks/useRoleAccess";
import { formatDate } from "../../utils/formatDate";
import {
  doctorName,
  getApiError,
  getPayload,
  patientName,
} from "../../utils/formatters";

export default function AppointmentDetailPage() {
  const { id } = useParams();
  const { isDoctor, isAdmin, isReceptionist } = useRoleAccess();
  const { data } = useGetAppointmentQuery(id);
  const [updateAppointment, { isLoading }] = useUpdateAppointmentMutation();
  const appointment = getPayload(data);
  const setStatus = async (status) => {
    try {
      await updateAppointment({ id, status }).unwrap();
      toast.success("Appointment updated");
    } catch (error) {
      toast.error(getApiError(error, "Update failed"));
    }
  };
  const statuses = isDoctor
    ? ["confirmed", "completed", "cancelled"]
    : isAdmin || isReceptionist
      ? ["confirmed", "cancelled"]
      : [];
  return (
    <>
      <PageHeader
        title="Appointment Details"
        action={{ label: "Back", onClick: () => history.back() }}
      />
      <div className="panel p-5">
        <div className="grid gap-4 md:grid-cols-2">
          <Info label="Patient" value={patientName(appointment)} />
          <Info label="Doctor" value={doctorName(appointment)} />
          <Info label="Date" value={formatDate(appointment.date)} />
          <Info label="Time Slot" value={appointment.timeSlot} />
          <Info label="Notes" value={appointment.notes || "No notes"} />
          <div>
            <p className="text-sm text-slate-400">Status</p>
            <div className="mt-1">
              <StatusBadge status={appointment.status} />
            </div>
          </div>
        </div>
        {statuses.length ? (
          <div className="mt-6 flex flex-wrap gap-3">
            {statuses.map((status) => (
              <button
                key={status}
                className={
                  status === "cancelled" ? "btn-danger" : "btn-primary"
                }
                disabled={isLoading}
                onClick={() => setStatus(status)}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : null}{" "}
                Mark {status}
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </>
  );
}
function Info({ label, value }) {
  return (
    <div className="rounded-lg bg-navy-secondary p-4">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-1 font-semibold">{value}</p>
    </div>
  );
}
