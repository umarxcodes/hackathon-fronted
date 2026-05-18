import { zodResolver } from "@hookform/resolvers/zod";
import { BarChart3, Brain, Loader2, Shield, Stethoscope } from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useDispatch } from "react-redux";
import { useLoginMutation } from "../../features/auth/authApi";
import { setCredentials } from "../../features/auth/authSlice";
import { useAuth } from "../../hooks/useAuth";
import { parseAuthResponse } from "../../utils/authResponse";
import { getApiError } from "../../utils/formatters";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

function BrandPanel() {
  return (
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
  );
}

export default function LoginPage() {
  const { isAuthenticated } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  const onSubmit = async (values) => {
    try {
      const data = await login(values).unwrap();
      const credentials = parseAuthResponse(data);
      if (!credentials.token)
        throw new Error("Authorization token missing from login response");
      dispatch(setCredentials(credentials));
      toast.success("Welcome back");
      navigate("/dashboard");
    } catch (error) {
      toast.error(getApiError(error, "Login failed"));
    }
  };
  return (
    <div className="flex min-h-screen bg-navy">
      <BrandPanel />
      <div className="flex flex-1 items-center justify-center px-4 py-10">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="panel w-full max-w-md p-6 shadow-2xl"
        >
          <h2 className="text-3xl font-extrabold">Welcome Back</h2>
          <p className="mt-2 text-sm text-slate-400">
            Sign in to manage your clinic workspace.
          </p>
          <label className="label mt-6">Email</label>
          <input className="field" type="email" {...register("email")} />
          {errors.email ? (
            <p className="mt-1 text-xs text-danger">{errors.email.message}</p>
          ) : null}
          <label className="label mt-4">Password</label>
          <input className="field" type="password" {...register("password")} />
          {errors.password ? (
            <p className="mt-1 text-xs text-danger">
              {errors.password.message}
            </p>
          ) : null}
          <button className="btn-primary mt-6 w-full" disabled={isLoading}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}{" "}
            Login
          </button>
          <p className="mt-5 text-center text-sm text-slate-400">
            Do not have an account?{" "}
            <Link className="font-semibold text-teal" to="/register">
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
