import { Home } from "lucide-react";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <div className="panel max-w-md p-8 text-center">
        <h1 className="text-5xl font-extrabold text-teal">404</h1>
        <p className="mt-3 text-slate-300">That clinic page does not exist.</p>
        <Link className="btn-primary mt-6" to="/dashboard">
          <Home className="h-4 w-4" /> Dashboard
        </Link>
      </div>
    </div>
  );
}
