import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import PageHeader from "../../components/common/PageHeader";
import {
  useCreatePatientMutation,
  useGetPatientQuery,
  useUpdatePatientMutation,
} from "../../features/patients/patientsApi";
import { BLOOD_GROUPS } from "../../utils/constants";
import { getApiError, getPayload } from "../../utils/formatters";

const schema = z.object({
  name: z.string().min(2),
  age: z.coerce.number().min(0).max(150),
  gender: z.enum(["male", "female", "other"]),
  contact: z.string().min(7),
  address: z.string().min(4),
  bloodGroup: z.string().optional(),
  allergiesText: z.string().optional(),
  medicalHistory: z.string().optional(),
});

export default function PatientFormPage() {
  const { id } = useParams();
  const edit = Boolean(id);
  const navigate = useNavigate();
  const { data } = useGetPatientQuery(id, { skip: !edit });
  const [createPatient, createState] = useCreatePatientMutation();
  const [updatePatient, updateState] = useUpdatePatientMutation();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { gender: "male", bloodGroup: "" },
  });
  useEffect(() => {
    const patient = getPayload(data);
    if (edit && patient?._id)
      reset({ ...patient, allergiesText: patient.allergies?.join(", ") || "" });
  }, [data, edit, reset]);
  const onSubmit = async (values) => {
    const body = {
      ...values,
      allergies:
        values.allergiesText
          ?.split(",")
          .map((a) => a.trim())
          .filter(Boolean) || [],
    };
    delete body.allergiesText;
    try {
      const res = edit
        ? await updatePatient({ id, ...body }).unwrap()
        : await createPatient(body).unwrap();
      toast.success(edit ? "Patient updated" : "Patient created");
      navigate(`/patients/${getPayload(res)._id || id}`);
    } catch (error) {
      toast.error(getApiError(error, "Save failed"));
    }
  };
  const loading = createState.isLoading || updateState.isLoading;
  return (
    <>
      <PageHeader
        title={edit ? "Edit Patient" : "Add Patient"}
        action={{ label: "Back", onClick: () => navigate(-1) }}
      />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="panel grid gap-4 p-5 md:grid-cols-2"
      >
        {["name", "age", "contact"].map((name) => (
          <div key={name}>
            <label className="label capitalize">{name}</label>
            <input
              className="field"
              type={name === "age" ? "number" : "text"}
              {...register(name)}
            />
            {errors[name] ? (
              <p className="mt-1 text-xs text-danger">{errors[name].message}</p>
            ) : null}
          </div>
        ))}
        <div>
          <label className="label">Gender</label>
          <select className="field" {...register("gender")}>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label className="label">Blood Group</label>
          <select className="field" {...register("bloodGroup")}>
            <option value="">Unknown</option>
            {BLOOD_GROUPS.map((g) => (
              <option key={g}>{g}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Allergies</label>
          <input
            className="field"
            placeholder="Comma separated"
            {...register("allergiesText")}
          />
        </div>
        <div className="md:col-span-2">
          <label className="label">Address</label>
          <textarea className="field min-h-24" {...register("address")} />
          {errors.address ? (
            <p className="mt-1 text-xs text-danger">{errors.address.message}</p>
          ) : null}
        </div>
        <div className="md:col-span-2">
          <label className="label">Medical History</label>
          <textarea
            className="field min-h-28"
            {...register("medicalHistory")}
          />
        </div>
        <div className="md:col-span-2">
          <button className="btn-primary" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Save
            Patient
          </button>
        </div>
      </form>
    </>
  );
}
