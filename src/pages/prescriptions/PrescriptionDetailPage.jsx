import { Brain, Download, Loader2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";
import { usePrescriptionExplanationMutation } from "../../features/ai/aiApi";
import { useGetPrescriptionQuery } from "../../features/prescriptions/prescriptionsApi";
import { usePDFDownload } from "../../hooks/usePDFDownload";
import { formatDate } from "../../utils/formatDate";
import {
  doctorName,
  getApiError,
  getPayload,
  patientName,
} from "../../utils/formatters";

export default function PrescriptionDetailPage() {
  const { id } = useParams();
  const { data } = useGetPrescriptionQuery(id);
  const rx = getPayload(data);
  const [explanation, setExplanation] = useState("");
  const [explain, { isLoading }] = usePrescriptionExplanationMutation();
  const { downloadPDF, downloading } = usePDFDownload();
  const generate = async () => {
    try {
      const res = await explain({ prescriptionId: id }).unwrap();
      setExplanation(
        res.data?.explanation ||
          res.data?.aiExplanation ||
          res.data ||
          "Explanation generated."
      );
    } catch (error) {
      toast.error(getApiError(error, "AI explanation failed"));
    }
  };
  return (
    <>
      <PageHeader
        title="Prescription Details"
        action={{ label: "Back", onClick: () => history.back() }}
      />
      <div className="panel p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold">{patientName(rx)}</h2>
            <p className="text-slate-400">
              Dr. {doctorName(rx)} • {formatDate(rx.createdAt)}{" "}
              {rx.appointmentId
                ? `• Appointment ${rx.appointmentId._id || rx.appointmentId}`
                : ""}
            </p>
          </div>
          <button
            className="btn-primary"
            disabled={downloading}
            onClick={() => downloadPDF(id)}
          >
            {downloading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}{" "}
            Download PDF
          </button>
        </div>
      </div>
      <div className="panel mt-6 overflow-x-auto">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-navy-secondary">
            <tr>
              {["Medicine", "Dosage", "Frequency", "Duration", "Notes"].map(
                (h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs uppercase text-slate-400"
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {(rx.medicines || []).map((m, i) => (
              <tr key={`${m.name}-${i}`}>
                <td className="px-4 py-3">{m.name}</td>
                <td className="px-4 py-3">{m.dosage}</td>
                <td className="px-4 py-3">{m.frequency}</td>
                <td className="px-4 py-3">{m.duration}</td>
                <td className="px-4 py-3">{m.instructions || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="panel mt-6 p-5">
        <h2 className="mb-3 flex items-center gap-2 font-heading text-xl font-bold">
          <Brain className="h-5 w-5 text-teal" /> AI Explanation
        </h2>
        {rx.aiExplanation || explanation ? (
          <div className="rounded-lg border border-teal/40 bg-teal/10 p-4 text-slate-100">
            {rx.aiExplanation || explanation}
          </div>
        ) : (
          <button
            className="btn-primary"
            disabled={isLoading}
            onClick={generate}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Brain className="h-4 w-4" />
            )}{" "}
            Generate AI Explanation
          </button>
        )}
      </div>
    </>
  );
}
