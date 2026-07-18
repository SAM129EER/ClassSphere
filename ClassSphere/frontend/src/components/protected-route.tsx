import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/auth-context";

interface ProtectedRouteProps {
  allowedRoles?: string[];
  fallbackPath?: string;
  isPublicOnly?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  allowedRoles,
  fallbackPath = "/login",
  isPublicOnly = false,
}) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground animate-pulse">Loading ClassSphere...</p>
        </div>
      </div>
    );
  }

  if (isPublicOnly) {
    // If user is logged in, redirect away from login/register to dashboard
    if (user) {
      return <Navigate to="/" replace />;
    }
    return <Outlet />;
  }

  if (!user) {
    return <Navigate to={fallbackPath} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
