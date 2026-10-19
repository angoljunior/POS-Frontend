import { LoginForm } from "@/components/auth/LoginForm";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function Login() {
  const { loading, isAuthenticated } = useAuth();
  if (loading) return <p role="status">Checking your session...</p>;
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f5f5f5] px-4 py-10">
      <div className="w-full max-w-[400px] border border-[#e0e0e0] bg-white p-7 shadow-sm sm:p-9">
        <LoginForm />
      </div>
    </div>
  );
}
