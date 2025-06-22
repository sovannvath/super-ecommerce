import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Navbar } from "@/components/shared/Navbar";

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Auth pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Public pages
import ProductCatalog from "./pages/ProductCatalog";

// Customer pages
import CustomerDashboard from "./pages/customer/Dashboard";

// Admin pages
import AdminDashboard from "./pages/admin/Dashboard";
import ProductManagement from "./pages/admin/ProductManagement";

// Warehouse pages
import WarehouseDashboard from "./pages/warehouse/Dashboard";

// Staff pages
import StaffDashboard from "./pages/staff/Dashboard";

const queryClient = new QueryClient();

// Layout wrapper for authenticated pages
const LayoutWrapper = ({ children }: { children: React.ReactNode }) => (
  <>
    <Navbar />
    {children}
  </>
);

// Role-based redirect component
const RoleRedirect = () => {
  return <Navigate to="/" replace />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route
              path="/products"
              element={
                <LayoutWrapper>
                  <ProductCatalog />
                </LayoutWrapper>
              }
            />

            {/* Auth routes */}
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/register" element={<Register />} />

            {/* Customer routes */}
            <Route
              path="/customer/dashboard"
              element={
                <ProtectedRoute allowedRoles={["customer"]}>
                  <LayoutWrapper>
                    <CustomerDashboard />
                  </LayoutWrapper>
                </ProtectedRoute>
              }
            />

            {/* Admin routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <LayoutWrapper>
                    <AdminDashboard />
                  </LayoutWrapper>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/products"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <LayoutWrapper>
                    <ProductManagement />
                  </LayoutWrapper>
                </ProtectedRoute>
              }
            />

            {/* Warehouse routes */}
            <Route
              path="/warehouse/dashboard"
              element={
                <ProtectedRoute allowedRoles={["warehouse"]}>
                  <LayoutWrapper>
                    <WarehouseDashboard />
                  </LayoutWrapper>
                </ProtectedRoute>
              }
            />

            {/* Staff routes */}
            <Route
              path="/staff/dashboard"
              element={
                <ProtectedRoute allowedRoles={["staff"]}>
                  <LayoutWrapper>
                    <StaffDashboard />
                  </LayoutWrapper>
                </ProtectedRoute>
              }
            />

            {/* Redirect route for authenticated users */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <RoleRedirect />
                </ProtectedRoute>
              }
            />

            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
