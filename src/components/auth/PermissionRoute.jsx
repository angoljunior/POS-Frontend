import { Link, Navigate, Outlet } from "react-router-dom";
import { ShieldAlert } from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

export default function PermissionRoute({ permission, children }) {
  const { isAuthenticated, loading, hasPermission } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Checking permissions...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!hasPermission(permission)) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <ShieldAlert size={44} className="text-[#666]" />

        <h1 className="text-2xl font-bold text-black">Access Denied</h1>

        <p className="max-w-md text-sm text-[#666]">
          Your account does not have permission to access this section of
          NexaPOS.
        </p>

        <Button asChild>
          <Link to="/dashboard">Return to Dashboard</Link>
        </Button>
      </div>
    );
  }

  return children || <Outlet />;
}
