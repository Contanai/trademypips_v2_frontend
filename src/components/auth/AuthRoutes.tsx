import { Navigate } from "react-router-dom";
import type { ReactElement } from "react";
import { useUser } from "@/contexts/UserContext";

export function ProtectedRoute({ children }: { children: ReactElement }) {
  const { userId, loading } = useUser();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#131313]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#00D1FF] border-t-transparent" />
      </div>
    );
  }

  if (!userId) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export function PublicOnlyRoute({ children }: { children: ReactElement }) {
  const { userId, loading } = useUser();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#131313]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#00D1FF] border-t-transparent" />
      </div>
    );
  }

  if (userId) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
