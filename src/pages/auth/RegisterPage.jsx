import { zodResolver } from "@hookform/resolvers/zod";
import { BarChart3, Brain, Loader2, Shield, Stethoscope } from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useDispatch } from "react-redux";
import { useRegisterMutation } from "../../features/auth/authApi";
import { setCredentials } from "../../features/auth/authSlice";
import { useAuth } from "../../hooks/useAuth";
import { parseAuthResponse } from "../../utils/authResponse";
import { getApiError } from "../../utils/formatters";

const schema = z.object({
  name: z.string().min(2, "Full name is required"),
  email: z.string().email("Enter a valid email"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .regex(/[A-Z]/, "Include an uppercase letter")
    .regex(/[0-9]/, "Include a number"),
  role: z.enum(["doctor", "receptionist", "patient"]),
});

export default function RegisterPage() {
  const { isAuthenticated } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [registerUser, { isLoading }] = useRegisterMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { role: "patient" },
  });
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  const onSubmit = async (values) => {
    try {
      const data = await registerUser(values).unwrap();
      const credentials = parseAuthResponse(data);
      if (!credentials.token)
        throw new Error(
          "Authorization token missing from registration response"
        );
      dispatch(setCredentials(credentials));
      toast.success("Account created");
      navigate("/dashboard");
    } catch (error) {
      toast.error(getApiError(error, "Registration failed"));
    }
  };
  return (
    <div className="flex min-h-screen bg-navy">
      <div className="relative hidden w-[45%] overflow-hidden bg-navy p-12 lg:flex lg:flex-col lg:justify-between">
        <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-teal/20 blur-3xl" />
        <div className="relative">
          <Stethoscope className="h-12 w-12 text-teal" />
          <h1 className="mt-5 text-3xl font-extrabold">ClinicAI</h1>
          <p className="mt-2 text-slate-400">Intelligent Clinic Management</p>
        </div>
        <div className="relative space-y-5">
          {[
            [Brain, "AI Diagnosis"],
            [Shield, "Secure & HIPAA"],
            [BarChart3, "Real-time Analytics"],
          ].map(([Icon, text]) => (
            <div key={text} className="flex items-center gap-3 text-slate-200">
              <Icon className="h-5 w-5 text-teal" />
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-1 items-center justify-center px-4 py-10">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="panel w-full max-w-md p-6 shadow-2xl"
        >
          <h2 className="text-3xl font-extrabold">Create Account</h2>
          <p className="mt-2 text-sm text-slate-400">
            Join your ClinicAI workspace.
          </p>
          {[
            ["name", "Full Name", "text"],
            ["email", "Email", "email"],
            ["password", "Password", "password"],
          ].map(([name, label, type]) => (
            <div key={name}>
              <label className="label mt-4">{label}</label>
              <input className="field" type={type} {...register(name)} />
              {errors[name] ? (
                <p className="mt-1 text-xs text-danger">
                  {errors[name].message}
                </p>
              ) : null}
            </div>
          ))}
          <label className="label mt-4">Role</label>
          <select className="field" {...register("role")}>
            <option value="doctor">Doctor</option>
            <option value="receptionist">Receptionist</option>
            <option value="patient">Patient</option>
          </select>
          {errors.role ? (
            <p className="mt-1 text-xs text-danger">{errors.role.message}</p>
          ) : null}
          <button className="btn-primary mt-6 w-full" disabled={isLoading}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}{" "}
            Register
          </button>
          <p className="mt-5 text-center text-sm text-slate-400">
            Already have an account?{" "}
            <Link className="font-semibold text-teal" to="/login">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
