import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, X } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import PageHeader from "../../components/common/PageHeader";
import { useGetAppointmentsQuery } from "../../features/appointments/appointmentsApi";
import { useGetPatientsQuery } from "../../features/patients/patientsApi";
import { useCreatePrescriptionMutation } from "../../features/prescriptions/prescriptionsApi";
import { useAuth } from "../../hooks/useAuth";
import { getApiError, getItems, getPayload } from "../../utils/formatters";

const med = z.object({
  name: z.string().min(1),
  dosage: z.string().min(1),
  frequency: z.string().min(1),
  duration: z.string().min(1),
  instructions: z.string().optional(),
});
const schema = z.object({
  patientId: z.string().min(1),
  appointmentId: z.string().optional(),
  medicines: z.array(med).min(1),
  instructions: z.string().min(1),
});

export default function WritePrescriptionPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: patientsData } = useGetPatientsQuery({ limit: 100 });
  const { data: appointmentsData } = useGetAppointmentsQuery();
  const [createPrescription, { isLoading }] = useCreatePrescriptionMutation();
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      patientId: "",
      appointmentId: "",
      medicines: [
        { name: "", dosage: "", frequency: "", duration: "", instructions: "" },
      ],
      instructions: "",
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "medicines",
  });
  const selectedPatient = watch("patientId");
  const appointments = getItems(appointmentsData).filter(
    (a) =>
      !selectedPatient || (a.patientId?._id || a.patientId) === selectedPatient
  );
  const onSubmit = async (values) => {
    try {
      const body = { ...values, doctorId: user._id };
      if (!body.appointmentId) delete body.appointmentId;
      const res = await createPrescription(body).unwrap();
      toast.success("Prescription created!");
      navigate(`/prescriptions/${getPayload(res)._id}`);
    } catch (error) {
      toast.error(getApiError(error, "Prescription failed"));
    }
  };
  return (
    <>
      <PageHeader
        title="Write Prescription"
        action={{ label: "Back", onClick: () => navigate(-1) }}
      />
      <form onSubmit={handleSubmit(onSubmit)} className="panel space-y-5 p-5">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="label">Patient</label>
            <select className="field" {...register("patientId")}>
              <option value="">Select patient</option>
              {getItems(patientsData).map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name}
                </option>
              ))}
            </select>
            {errors.patientId ? (
              <p className="mt-1 text-xs text-danger">Patient is required</p>
            ) : null}
          </div>
          <div>
            <label className="label">Appointment</label>
            <select className="field" {...register("appointmentId")}>
              <option value="">No appointment reference</option>
              {appointments.map((a) => (
                <option key={a._id} value={a._id}>
                  {a.date?.slice(0, 10)} {a.timeSlot}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-heading text-xl font-bold">Medicines</h2>
            <button
              type="button"
              className="btn-secondary"
              onClick={() =>
                append({
                  name: "",
                  dosage: "",
                  frequency: "",
                  duration: "",
                  instructions: "",
                })
              }
            >
              <Plus className="h-4 w-4" /> Add Medicine
            </button>
          </div>
          <div className="space-y-3">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="grid gap-3 rounded-lg bg-navy-secondary p-3 md:grid-cols-5"
              >
                <input
                  className="field"
                  placeholder="Medicine"
                  {...register(`medicines.${index}.name`)}
                />
                <input
                  className="field"
                  placeholder="Dosage"
                  {...register(`medicines.${index}.dosage`)}
                />
                <input
                  className="field"
                  placeholder="Frequency"
                  {...register(`medicines.${index}.frequency`)}
                />
                <input
                  className="field"
                  placeholder="Duration"
                  {...register(`medicines.${index}.duration`)}
                />
                <div className="flex gap-2">
                  <input
                    className="field"
                    placeholder="Notes"
                    {...register(`medicines.${index}.instructions`)}
                  />
                  {fields.length > 1 ? (
                    <button
                      type="button"
                      className="btn-secondary px-2"
                      onClick={() => remove(index)}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  ) : null}
                </div>
                {errors.medicines?.[index] ? (
                  <div className="text-xs text-danger md:col-span-5">
                    Medicine, dosage, frequency, and duration are required.
                  </div>
                ) : null}
              </div>
            ))}
          </div>
          {errors.medicines?.root ? (
            <p className="mt-2 text-xs text-danger">
              {errors.medicines.root.message}
            </p>
          ) : null}
        </div>
        <div>
          <label className="label">Global Instructions</label>
          <textarea className="field min-h-28" {...register("instructions")} />
          {errors.instructions ? (
            <p className="mt-1 text-xs text-danger">
              Instructions are required.
            </p>
          ) : null}
        </div>
        <button className="btn-primary" disabled={isLoading}>
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}{" "}
          Create Prescription
        </button>
      </form>
    </>
  );
}
