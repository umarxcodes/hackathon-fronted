import { Calendar, Download, FileText, Stethoscope } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import DataTable from "../../components/common/DataTable";
import EmptyState from "../../components/common/EmptyState";
import PageHeader from "../../components/common/PageHeader";
import StatusBadge from "../../components/common/StatusBadge";
import {
  useGetPatientQuery,
  useGetTimelineQuery,
} from "../../features/patients/patientsApi";
import { usePDFDownload } from "../../hooks/usePDFDownload";
import { formatDate } from "../../utils/formatDate";
import {
  doctorName,
  getItems,
  getPayload,
  initials,
} from "../../utils/formatters";

export default function PatientDetailPage() {
  const { id } = useParams();
  const [tab, setTab] = useState("overview");
  const { data, isLoading } = useGetPatientQuery(id);
  const { data: timelineData } = useGetTimelineQuery(id);
  const { downloadPDF, downloading } = usePDFDownload();
  const payload = getPayload(data);
  const patient = payload.patient || payload;
  const appointments = payload.appointments || [];
  const prescriptions = payload.prescriptions || [];
  const timeline = getItems(timelineData)
    .slice()
    .sort((a, b) => new Date(b.date) - new Date(a.date));
  if (isLoading)
    return (
      <EmptyState
        title="Loading patient"
        message="Fetching the medical record."
      />
    );
  return (
    <>
      <PageHeader
        title="Patient Profile"
        action={{ label: "Back", onClick: () => history.back() }}
      />
      <div className="panel p-5">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-teal text-xl font-extrabold text-navy">
            {initials(patient.name)}
          </div>
          <div>
            <h2 className="text-2xl font-extrabold">{patient.name}</h2>
            <p className="text-slate-400">
              {patient.age} years • {patient.gender} •{" "}
              {patient.bloodGroup || "Blood group N/A"} • {patient.contact}
            </p>
          </div>
        </div>
      </div>
      <div className="mt-6 flex flex-wrap gap-2">
        {["overview", "appointments", "prescriptions", "timeline"].map(
          (item) => (
            <button
              key={item}
              onClick={() => setTab(item)}
              className={`rounded-lg px-4 py-2 text-sm font-semibold capitalize ${tab === item ? "bg-teal text-navy" : "bg-navy-card text-slate-300"}`}
            >
              {item}
            </button>
          )
        )}
      </div>
      <div className="mt-4">
        {tab === "overview" ? (
          <div className="panel space-y-5 p-5">
            <div>
              <h3 className="font-heading font-bold">Allergies</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {patient.allergies?.length ? (
                  patient.allergies.map((a) => (
                    <span
                      key={a}
                      className="rounded-full bg-danger/15 px-3 py-1 text-sm text-danger"
                    >
                      {a}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-slate-400">None recorded</span>
                )}
              </div>
            </div>
            <div>
              <h3 className="font-heading font-bold">Medical History</h3>
              <p className="mt-2 text-slate-300">
                {patient.medicalHistory || "No history recorded."}
              </p>
            </div>
            <div>
              <h3 className="font-heading font-bold">Address</h3>
              <p className="mt-2 text-slate-300">{patient.address}</p>
            </div>
          </div>
        ) : null}
        {tab === "appointments" ? (
          <DataTable
            data={appointments}
            columns={[
              { key: "date", label: "Date", render: (r) => formatDate(r.date) },
              { key: "doctor", label: "Doctor", render: doctorName },
              { key: "timeSlot", label: "Time Slot" },
              {
                key: "status",
                label: "Status",
                render: (r) => <StatusBadge status={r.status} />,
              },
            ]}
          />
        ) : null}
        {tab === "prescriptions" ? (
          <DataTable
            data={prescriptions}
            columns={[
              {
                key: "date",
                label: "Date",
                render: (r) => formatDate(r.createdAt),
              },
              { key: "doctor", label: "Doctor", render: doctorName },
              {
                key: "medicines",
                label: "Medicines",
                render: (r) => r.medicines?.length || 0,
              },
              {
                key: "pdf",
                label: "PDF",
                render: (r) => (
                  <button
                    disabled={downloading}
                    className="btn-secondary py-1.5"
                    onClick={() => downloadPDF(r._id)}
                  >
                    <Download className="h-4 w-4" /> PDF
                  </button>
                ),
              },
            ]}
          />
        ) : null}
        {tab === "timeline" ? (
          <div className="panel p-5">
            {timeline.length ? (
              timeline.map((item) => (
                <div
                  key={
                    item._id || item.data?._id || `${item.type}-${item.date}`
                  }
                  className={`mb-4 border-l-4 pl-4 last:mb-0 ${
                    item.type === "prescription"
                      ? "border-success"
                      : item.type === "diagnosis"
                        ? "border-warning"
                        : "border-teal"
                  }`}
                >
                  <div className="flex items-center gap-2 text-teal">
                    {item.type === "prescription" ? (
                      <FileText className="h-4 w-4" />
                    ) : item.type === "diagnosis" ? (
                      <Stethoscope className="h-4 w-4" />
                    ) : (
                      <Calendar className="h-4 w-4" />
                    )}
                    <span className="text-sm font-bold capitalize">
                      {item.type || "event"}
                    </span>
                    <span className="text-xs text-slate-400">
                      {formatDate(item.date)}
                    </span>
                  </div>
                  <p className="mt-1 text-slate-200">
                    {item.summary ||
                      item.data?.notes ||
                      item.data?.status ||
                      item.data?.instructions ||
                      "Medical activity recorded."}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-400">No timeline records.</p>
            )}
          </div>
        ) : null}
      </div>
    </>
  );
}
