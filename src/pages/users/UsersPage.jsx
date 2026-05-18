import { Edit, Plus, Power } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import DataTable from "../../components/common/DataTable";
import PageHeader from "../../components/common/PageHeader";
import RoleBadge from "../../components/common/RoleBadge";
import StatusBadge from "../../components/common/StatusBadge";
import {
  useGetUsersQuery,
  useUpdateUserMutation,
} from "../../features/users/usersApi";
import { getApiError, getItems, initials } from "../../utils/formatters";

export default function UsersPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState("");
  const { data, isLoading } = useGetUsersQuery({ page: 1, limit: 100, role });
  const [updateUser] = useUpdateUserMutation();
  const toggle = async (user) => {
    try {
      await updateUser({ id: user._id, isActive: !user.isActive }).unwrap();
      toast.success("User updated");
    } catch (error) {
      toast.error(getApiError(error, "Update failed"));
    }
  };
  return (
    <>
      <PageHeader
        title="User Management"
        action={{
          label: "Add User",
          icon: Plus,
          onClick: () => navigate("/users/new"),
        }}
      />
      <div className="mb-4 flex flex-wrap gap-2">
        {["", "admin", "doctor", "receptionist", "patient"].map((r) => (
          <button
            key={r || "all"}
            onClick={() => setRole(r)}
            className={`rounded-lg px-4 py-2 text-sm font-semibold capitalize ${role === r ? "bg-teal text-navy" : "bg-navy-card text-slate-300"}`}
          >
            {r || "All"}
          </button>
        ))}
      </div>
      <DataTable
        loading={isLoading}
        data={getItems(data)}
        columns={[
          {
            key: "name",
            label: "Avatar + Name",
            render: (u) => (
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-teal text-sm font-bold text-navy">
                  {initials(u.name)}
                </div>
                <span className="font-semibold">{u.name}</span>
              </div>
            ),
          },
          { key: "email", label: "Email" },
          {
            key: "role",
            label: "Role",
            render: (u) => <RoleBadge role={u.role} />,
          },
          {
            key: "subscriptionPlan",
            label: "Plan",
            render: (u) => (
              <span className="rounded-full bg-slate-700 px-2.5 py-1 text-xs capitalize">
                {u.subscriptionPlan || "free"}
              </span>
            ),
          },
          {
            key: "status",
            label: "Status",
            render: (u) => (
              <StatusBadge
                status={u.isActive === false ? "inactive" : "active"}
              />
            ),
          },
          {
            key: "actions",
            label: "Actions",
            render: (u) => (
              <div className="flex gap-2">
                <button
                  className="btn-secondary py-1.5"
                  onClick={() => navigate(`/users/${u._id}/edit`)}
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  className="btn-secondary py-1.5"
                  onClick={() => toggle(u)}
                >
                  <Power className="h-4 w-4" />
                </button>
              </div>
            ),
          },
        ]}
      />
    </>
  );
}
