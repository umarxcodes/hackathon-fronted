import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import PageHeader from "../../components/common/PageHeader";
import {
  useCreateUserMutation,
  useGetUserQuery,
  useUpdateUserMutation,
} from "../../features/users/usersApi";
import { getApiError, getPayload } from "../../utils/formatters";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().optional(),
  role: z.enum(["admin", "doctor", "receptionist", "patient"]),
  subscriptionPlan: z.enum(["free", "pro"]).optional(),
  isActive: z.coerce.boolean().optional(),
});

export default function UserFormPage() {
  const { id } = useParams();
  const edit = Boolean(id);
  const navigate = useNavigate();
  const { data } = useGetUserQuery(id, { skip: !edit });
  const [createUser, createState] = useCreateUserMutation();
  const [updateUser, updateState] = useUpdateUserMutation();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      role: "patient",
      subscriptionPlan: "free",
      isActive: true,
    },
  });
  useEffect(() => {
    const user = getPayload(data);
    if (edit && user?._id) reset({ ...user, password: "" });
  }, [data, edit, reset]);
  const onSubmit = async (values) => {
    try {
      const body = { ...values };
      if (edit && !body.password) delete body.password;
      edit
        ? await updateUser({ id, ...body }).unwrap()
        : await createUser(body).unwrap();
      toast.success(edit ? "User updated" : "User created");
      navigate("/users");
    } catch (error) {
      toast.error(getApiError(error, "Save failed"));
    }
  };
  const loading = createState.isLoading || updateState.isLoading;
  return (
    <>
      <PageHeader
        title={edit ? "Edit User" : "Add User"}
        action={{ label: "Back", onClick: () => navigate(-1) }}
      />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="panel grid gap-4 p-5 md:grid-cols-2"
      >
        <Field label="Name" error={errors.name?.message}>
          <input className="field" {...register("name")} />
        </Field>
        <Field label="Email" error={errors.email?.message}>
          <input className="field" type="email" {...register("email")} />
        </Field>
        <Field label={edit ? "Password (leave blank to keep)" : "Password"}>
          <input className="field" type="password" {...register("password")} />
        </Field>
        <Field label="Role">
          <select className="field" {...register("role")}>
            <option value="admin">Admin</option>
            <option value="doctor">Doctor</option>
            <option value="receptionist">Receptionist</option>
            <option value="patient">Patient</option>
          </select>
        </Field>
        <Field label="Plan">
          <select className="field" {...register("subscriptionPlan")}>
            <option value="free">Free</option>
            <option value="pro">Pro</option>
          </select>
        </Field>
        <Field label="Status">
          <select className="field" {...register("isActive")}>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </Field>
        <div className="md:col-span-2">
          <button className="btn-primary" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Save
            User
          </button>
        </div>
      </form>
    </>
  );
}
function Field({ label, error, children }) {
  return (
    <div>
      <label className="label">{label}</label>
      {children}
      {error ? <p className="mt-1 text-xs text-danger">{error}</p> : null}
    </div>
  );
}
