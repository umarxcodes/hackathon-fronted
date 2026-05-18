import { Download, Eye, FileEdit } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DataTable from "../../components/common/DataTable";
import PageHeader from "../../components/common/PageHeader";
import { useGetPrescriptionsQuery } from "../../features/prescriptions/prescriptionsApi";
import { usePDFDownload } from "../../hooks/usePDFDownload";
import { useRoleAccess } from "../../hooks/useRoleAccess";
import { formatDate } from "../../utils/formatDate";
import { doctorName, getItems, patientName } from "../../utils/formatters";

export default function PrescriptionsPage() {
  const navigate = useNavigate();
  const { canWritePrescription, canDownloadPDF } = useRoleAccess();
  const { data, isLoading } = useGetPrescriptionsQuery();
  const { downloadPDF, downloading } = usePDFDownload();
  return (
    <>
      <PageHeader
        title="Prescriptions"
        action={
          canWritePrescription
            ? {
                label: "Write Prescription",
                icon: FileEdit,
                onClick: () => navigate("/prescriptions/write"),
              }
            : null
        }
      />
      <DataTable
        loading={isLoading}
        data={getItems(data)}
        columns={[
          { key: "patient", label: "Patient", render: patientName },
          { key: "doctor", label: "Doctor", render: doctorName },
          {
            key: "date",
            label: "Date",
            render: (r) => formatDate(r.createdAt),
          },
          {
            key: "meds",
            label: "Medicines",
            render: (r) => r.medicines?.length || 0,
          },
          {
            key: "actions",
            label: "Actions",
            render: (r) => (
              <div className="flex gap-2">
                <button
                  className="btn-secondary py-1.5"
                  onClick={() => navigate(`/prescriptions/${r._id}`)}
                >
                  <Eye className="h-4 w-4" /> View
                </button>
                {canDownloadPDF ? (
                  <button
                    className="btn-secondary py-1.5"
                    disabled={downloading}
                    onClick={() => downloadPDF(r._id)}
                  >
                    <Download className="h-4 w-4" /> PDF
                  </button>
                ) : null}
              </div>
            ),
          },
        ]}
      />
    </>
  );
}
