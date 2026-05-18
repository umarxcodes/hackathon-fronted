import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import PageHeader from "../../components/common/PageHeader";
import { useCreateAppointmentMutation } from "../../features/appointments/appointmentsApi";
import { useGetPatientsQuery } from "../../features/patients/patientsApi";
import { useGetDoctorsQuery } from "../../features/users/usersApi";
import { TIME_SLOTS } from "../../utils/constants";
import { todayISO } from "../../utils/formatDate";
import { getApiError, getItems } from "../../utils/formatters";

const schema = z.object({
  patientId: z.string().min(1),
  doctorId: z.string().min(1),
  date: z.string().min(1),
  timeSlot: z.string().min(1),
});

export default function BookAppointmentPage() {
  const navigate = useNavigate();
  const { data: patientsData } = useGetPatientsQuery({ limit: 100 });
  const { data: doctorsData } = useGetDoctorsQuery();
  const [createAppointment, { isLoading }] = useCreateAppointmentMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { date: todayISO(), timeSlot: TIME_SLOTS[0] },
  });
  const onSubmit = async (values) => {
    try {
      await createAppointment(values).unwrap();
      toast.success("Appointment booked");
      navigate("/appointments");
    } catch (error) {
      toast.error(
        getApiError(error, "This time slot is already booked for this doctor")
      );
    }
  };
  return (
    <>
      <PageHeader
        title="Book Appointment"
        action={{ label: "Back", onClick: () => navigate(-1) }}
      />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="panel grid gap-4 p-5 md:grid-cols-2"
      >
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
            <p className="text-xs text-danger">Patient is required</p>
          ) : null}
        </div>
        <div>
          <label className="label">Doctor</label>
          <select className="field" {...register("doctorId")}>
            <option value="">Select doctor</option>
            {getItems(doctorsData).map((d) => (
              <option key={d._id} value={d._id}>
                {d.name} {d.specialization ? `- ${d.specialization}` : ""}
              </option>
            ))}
          </select>
          {errors.doctorId ? (
            <p className="text-xs text-danger">Doctor is required</p>
          ) : null}
        </div>
        <div>
          <label className="label">Date</label>
          <input
            className="field"
            type="date"
            min={todayISO()}
            {...register("date")}
          />
        </div>
        <div>
          <label className="label">Time Slot</label>
          <select className="field" {...register("timeSlot")}>
            {TIME_SLOTS.map((slot) => (
              <option key={slot}>{slot}</option>
            ))}
          </select>
        </div>
        <div className="md:col-span-2">
          <button className="btn-primary" disabled={isLoading}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}{" "}
            Book Appointment
          </button>
        </div>
      </form>
    </>
  );
}
