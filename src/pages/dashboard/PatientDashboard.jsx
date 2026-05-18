import { Calendar, Download, FileText } from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import StatCard from "../../components/common/StatCard";
import StatusBadge from "../../components/common/StatusBadge";
import { useGetAppointmentsQuery } from "../../features/appointments/appointmentsApi";
import { useGetPrescriptionsQuery } from "../../features/prescriptions/prescriptionsApi";
import { usePDFDownload } from "../../hooks/usePDFDownload";
import { formatDate } from "../../utils/formatDate";
import { doctorName, getItems } from "../../utils/formatters";

export default function PatientDashboard() {
  const { data: appointmentData } = useGetAppointmentsQuery();
  const { data: prescriptionData } = useGetPrescriptionsQuery();
  const { downloadPDF, downloading } = usePDFDownload();
  const appointments = getItems(appointmentData);
  const prescriptions = getItems(prescriptionData);
  const upcoming = appointments.filter((item) =>
    ["pending", "confirmed"].includes(item.status)
  );
  const next = upcoming[0];
  return (
    <>
      <PageHeader
        title="My Care Dashboard"
        subtitle="Upcoming appointments and prescriptions."
      />
      <div className="grid gap-4 md:grid-cols-2">
        <StatCard
          title="Upcoming Appointments"
          value={upcoming.length}
          icon={Calendar}
          color="#00D4C8"
        />
        <StatCard
          title="Total Prescriptions"
          value={prescriptions.length}
          icon={FileText}
          color="#06D6A0"
        />
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="panel p-5">
          <h2 className="font-heading text-xl font-bold">Next Appointment</h2>
          {next ? (
            <div className="mt-4 space-y-2">
              <p className="text-lg font-semibold">
                {formatDate(next.date)} at {next.timeSlot}
              </p>
              <p className="text-slate-400">With {doctorName(next)}</p>
              <StatusBadge status={next.status} />
            </div>
          ) : (
            <p className="mt-4 text-sm text-slate-400">
              No upcoming appointment.
            </p>
          )}
        </div>
        <div className="panel p-5">
          <h2 className="font-heading text-xl font-bold">
            Recent Prescriptions
          </h2>
          <div className="mt-4 space-y-3">
            {prescriptions.slice(0, 3).map((rx) => (
              <div
                key={rx._id}
                className="flex items-center justify-between gap-3 rounded-lg bg-navy-secondary p-3"
              >
                <div>
                  <p className="font-semibold">{formatDate(rx.createdAt)}</p>
                  <p className="text-sm text-slate-400">{doctorName(rx)}</p>
                </div>
                <button
                  className="btn-secondary py-1.5"
                  disabled={downloading}
                  onClick={() => downloadPDF(rx._id)}
                >
                  <Download className="h-4 w-4" /> PDF
                </button>
              </div>
            ))}
            {!prescriptions.length ? (
              <p className="text-sm text-slate-400">No prescriptions yet.</p>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}
