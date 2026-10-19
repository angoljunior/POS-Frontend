import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";

import { useAuth } from "@/context/AuthContext";

export default function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center gap-3 bg-[#fafafa]">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="text-sm text-[#666]">Checking your session...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location.pathname + location.search + location.hash,
        }}
      />
    );
  }

  return <Outlet />;
}
