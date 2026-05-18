import {
  Calendar,
  CheckCircle2,
  FileEdit,
  Percent,
  Activity,
  Brain,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";
import StatCard from "../../components/common/StatCard";
import StatusBadge from "../../components/common/StatusBadge";
import { useGetDoctorAnalyticsQuery } from "../../features/analytics/analyticsApi";
import { useGetAppointmentsQuery } from "../../features/appointments/appointmentsApi";
import { formatDate, todayISO } from "../../utils/formatDate";
import { getItems, getPayload, patientName } from "../../utils/formatters";

export default function DoctorDashboard() {
  const navigate = useNavigate();
  const { data } = useGetDoctorAnalyticsQuery();
  const { data: appointmentsData } = useGetAppointmentsQuery();
  const stats = getPayload(data);
  const today = getItems(appointmentsData).filter(
    (item) => formatDate(item.date, "yyyy-MM-dd") === todayISO()
  );
  const completionRate = parseFloat(stats.completionRate || 0);
  return (
    <>
      <PageHeader
        title="Doctor Dashboard"
        subtitle="Today's schedule, prescriptions, and AI actions from live backend records."
      />
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Total Appointments"
          value={
            stats.totalAppointments ||
            stats.appointments ||
            stats.monthlyAppointments ||
            0
          }
          icon={Calendar}
          color="#00D4C8"
        />
        <StatCard
          title="Completed"
          value={stats.completed || stats.completedAppointments || 0}
          icon={CheckCircle2}
          color="#06D6A0"
        />
        <StatCard
          title="Completion Rate"
          value={`${completionRate}%`}
          icon={Percent}
          color="#FFB830"
        />
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="panel p-5 lg:col-span-2">
          <h2 className="mb-4 font-heading text-xl font-bold">
            Today Schedule
          </h2>
          <div className="space-y-3">
            {today.length ? (
              today.map((item) => (
                <div
                  key={item._id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-navy-secondary p-3"
                >
                  <div>
                    <p className="font-semibold">{patientName(item)}</p>
                    <p className="text-sm text-slate-400">{item.timeSlot}</p>
                  </div>
                  <StatusBadge status={item.status} />
                  <button
                    className="btn-secondary py-1.5"
                    onClick={() => navigate(`/appointments/${item._id}`)}
                  >
                    View
                  </button>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-400">
                No appointments scheduled for today.
              </p>
            )}
          </div>
        </div>
        <div className="panel p-5">
          <h2 className="mb-4 font-heading text-xl font-bold">Quick Actions</h2>
          <div className="space-y-3">
            <button
              className="btn-primary w-full"
              onClick={() => navigate("/prescriptions/write")}
            >
              <FileEdit className="h-4 w-4" /> Write Prescription
            </button>
            <button
              className="btn-secondary w-full"
              onClick={() => navigate("/ai-tools")}
            >
              <Brain className="h-4 w-4" /> Check Symptoms
            </button>
            <button
              className="btn-secondary w-full"
              onClick={() => navigate("/analytics")}
            >
              <Activity className="h-4 w-4" /> View Analytics
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
