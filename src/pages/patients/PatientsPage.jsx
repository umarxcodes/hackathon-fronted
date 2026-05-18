import { Edit, Eye, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import ConfirmModal from "../../components/common/ConfirmModal";
import DataTable from "../../components/common/DataTable";
import PageHeader from "../../components/common/PageHeader";
import {
  useDeletePatientMutation,
  useGetPatientsQuery,
} from "../../features/patients/patientsApi";
import { useRoleAccess } from "../../hooks/useRoleAccess";
import { formatDate } from "../../utils/formatDate";
import { getApiError, getItems } from "../../utils/formatters";

export default function PatientsPage() {
  const navigate = useNavigate();
  const { isAdmin, canCreatePatient } = useRoleAccess();
  const [page, setPage] = useState(1);
  const [term, setTerm] = useState("");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const { data, isLoading } = useGetPatientsQuery({ page, limit: 10, search });
  const [deletePatient, { isLoading: deleting }] = useDeletePatientMutation();
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(term);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [term]);
  const remove = async () => {
    try {
      await deletePatient(selected._id).unwrap();
      toast.success("Patient deleted");
      setSelected(null);
    } catch (error) {
      toast.error(getApiError(error, "Delete failed"));
    }
  };
  const columns = [
    {
      key: "index",
      label: "#",
      render: (_, index) => (page - 1) * 10 + index + 1,
    },
    { key: "name", label: "Name" },
    { key: "age", label: "Age" },
    { key: "gender", label: "Gender" },
    {
      key: "bloodGroup",
      label: "Blood Group",
      render: (r) => r.bloodGroup || "N/A",
    },
    { key: "contact", label: "Contact" },
    {
      key: "createdAt",
      label: "Created",
      render: (r) => formatDate(r.createdAt),
    },
    {
      key: "actions",
      label: "Actions",
      render: (r) => (
        <div className="flex gap-2">
          <button
            className="btn-secondary px-2 py-1.5"
            onClick={() => navigate(`/patients/${r._id}`)}
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            className="btn-secondary px-2 py-1.5"
            onClick={() => navigate(`/patients/${r._id}/edit`)}
          >
            <Edit className="h-4 w-4" />
          </button>
          {isAdmin ? (
            <button
              className="btn-secondary px-2 py-1.5 text-danger"
              onClick={() => setSelected(r)}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          ) : null}
        </div>
      ),
    },
  ];
  return (
    <>
      <PageHeader
        title="Patients"
        subtitle="Search, review, and manage patient records."
        action={
          canCreatePatient
            ? {
                label: "Add Patient",
                icon: Plus,
                onClick: () => navigate("/patients/new"),
              }
            : null
        }
      />
      <input
        className="field mb-4 max-w-md"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        placeholder="Search patients..."
      />
      <DataTable
        columns={columns}
        data={getItems(data)}
        loading={isLoading}
        pagination={{ page, total: data?.total, totalPages: data?.totalPages }}
        onPageChange={setPage}
      />
      <ConfirmModal
        isOpen={!!selected}
        onClose={() => setSelected(null)}
        onConfirm={remove}
        title="Delete patient"
        message={`Delete ${selected?.name}? This also removes related history.`}
        loading={deleting}
      />
    </>
  );
}
