import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
  redirectTo = "/auth/login",
}) => {
  const { user, isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  // Convert role_id to role name for Laravel API compatibility
  const getUserRole = (user: any): string => {
    if (user.role) return user.role;

    // Map Laravel role_id to role names
    const roleMap: { [key: number]: string } = {
      1: "admin",
      2: "staff",
      3: "customer",
      4: "warehouse",
    };

    return roleMap[user.role_id] || "customer";
  };

  const userRole = user ? getUserRole(user) : null;

  if (allowedRoles && user && !allowedRoles.includes(userRole)) {
    // Redirect to appropriate dashboard based on user role
    const roleRedirects = {
      customer: "/customer/dashboard",
      admin: "/admin/dashboard",
      warehouse: "/warehouse/dashboard",
      staff: "/staff/dashboard",
    };
    return (
      <Navigate to={roleRedirects[userRole] || "/customer/dashboard"} replace />
    );
  }

  return <>{children}</>;
};
