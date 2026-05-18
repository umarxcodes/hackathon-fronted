import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Calendar, Stethoscope, TrendingUp, Users } from "lucide-react";
import StatCard from "../../components/common/StatCard";
import SkeletonCard from "../../components/common/SkeletonCard";
import DataTable from "../../components/common/DataTable";
import PageHeader from "../../components/common/PageHeader";
import { useGetAdminAnalyticsQuery } from "../../features/analytics/analyticsApi";
import { getPayload } from "../../utils/formatters";

export default function AdminDashboard() {
  const { data, isLoading } = useGetAdminAnalyticsQuery();
  const stats = getPayload(data);
  const monthTotal = stats.appointmentsByMonth?.at?.(-1)?.count || 0;
  if (isLoading)
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  const columns = [
    {
      key: "doctor",
      label: "Doctor Name",
      render: (row) =>
        row.doctorName || row.name || row.doctor?.name || "Doctor",
    },
    {
      key: "total",
      label: "Total",
      render: (row) => row.total || row.totalAppointments || 0,
    },
    {
      key: "completed",
      label: "Completed",
      render: (row) => row.completed || 0,
    },
    {
      key: "rate",
      label: "Rate",
      render: (row) => {
        const rate = parseFloat(row.rate || row.completionRate || 0);
        const color =
          rate > 90 ? "bg-success" : rate > 70 ? "bg-warning" : "bg-danger";
        return (
          <div className="flex min-w-[160px] items-center gap-2">
            <div className="h-2 flex-1 rounded bg-slate-700">
              <div
                className={`h-2 rounded ${color}`}
                style={{ width: `${Math.min(rate, 100)}%` }}
              />
            </div>
            <span>{rate}%</span>
          </div>
        );
      },
    },
  ];
  return (
    <>
      <PageHeader
        title="Admin Dashboard"
        subtitle="Clinic-wide performance and activity from live backend records."
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Patients"
          value={stats.totalPatients}
          icon={Users}
          color="#00D4C8"
        />
        <StatCard
          title="Total Doctors"
          value={stats.totalDoctors}
          icon={Stethoscope}
          color="#06D6A0"
        />
        <StatCard
          title="Total Appointments"
          value={stats.totalAppointments}
          icon={Calendar}
          color="#FFB830"
        />
        <StatCard
          title="This Month"
          value={monthTotal}
          icon={TrendingUp}
          color="#00D4C8"
        />
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="panel p-5">
          <h2 className="mb-4 font-heading text-lg font-bold">
            Monthly Appointments
          </h2>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={stats.appointmentsByMonth || []}>
              <CartesianGrid stroke="#2A3548" />
              <XAxis dataKey="month" stroke="#8B9CB0" />
              <YAxis stroke="#8B9CB0" />
              <Tooltip
                contentStyle={{
                  background: "#1A2235",
                  border: "1px solid #2A3548",
                }}
              />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#00D4C8"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="panel p-5">
          <h2 className="mb-4 font-heading text-lg font-bold">Top Diagnoses</h2>
          {stats.topDiagnoses?.length ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={(stats.topDiagnoses || []).slice(0, 5)}>
                <CartesianGrid stroke="#2A3548" />
                <XAxis dataKey="condition" stroke="#8B9CB0" />
                <YAxis stroke="#8B9CB0" />
                <Tooltip
                  contentStyle={{
                    background: "#1A2235",
                    border: "1px solid #2A3548",
                  }}
                />
                <Bar dataKey="count" fill="#00D4C8" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-[280px] items-center justify-center rounded-lg border border-dashed border-border text-center text-sm text-slate-400">
              Run AI Symptom Checker to create diagnosis records for this chart.
            </div>
          )}
        </div>
      </div>
      <div className="mt-6">
        <h2 className="mb-3 font-heading text-xl font-bold">
          Doctor Performance
        </h2>
        <DataTable columns={columns} data={stats.doctorPerformance || []} />
      </div>
    </>
  );
}
