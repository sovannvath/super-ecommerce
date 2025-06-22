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
import ProductDetail from "./pages/ProductDetail";
import Notifications from "./pages/Notifications";

// Auth pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Public pages
import ProductCatalog from "./pages/ProductCatalog";

// Customer pages
import CustomerDashboard from "./pages/customer/Dashboard";
import Cart from "./pages/customer/Cart";
import Checkout from "./pages/customer/Checkout";
import Orders from "./pages/customer/Orders";
import OrderDetail from "./pages/customer/OrderDetail";

// Admin pages
import AdminDashboard from "./pages/admin/Dashboard";
import ProductManagement from "./pages/admin/ProductManagement";
import ProductForm from "./pages/admin/ProductForm";
import ProductDetail from "./pages/admin/ProductDetail";
import RequestOrders from "./pages/admin/RequestOrders";

// Warehouse pages
import WarehouseDashboard from "./pages/warehouse/Dashboard";
import WarehouseRequestOrders from "./pages/warehouse/RequestOrders";

// Staff pages
import StaffDashboard from "./pages/staff/Dashboard";
import OrderProcessing from "./pages/staff/OrderProcessing";

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
            <Route
              path="/products/:id"
              element={
                <LayoutWrapper>
                  <ProductDetail />
                </LayoutWrapper>
              }
            />

            {/* Auth routes */}
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/register" element={<Register />} />

            {/* Notifications (all authenticated users) */}
            <Route
              path="/notifications"
              element={
                <ProtectedRoute>
                  <LayoutWrapper>
                    <Notifications />
                  </LayoutWrapper>
                </ProtectedRoute>
              }
            />

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
            <Route
              path="/customer/cart"
              element={
                <ProtectedRoute allowedRoles={["customer"]}>
                  <LayoutWrapper>
                    <Cart />
                  </LayoutWrapper>
                </ProtectedRoute>
              }
            />
            <Route
              path="/customer/checkout"
              element={
                <ProtectedRoute allowedRoles={["customer"]}>
                  <LayoutWrapper>
                    <Checkout />
                  </LayoutWrapper>
                </ProtectedRoute>
              }
            />
            <Route
              path="/customer/orders"
              element={
                <ProtectedRoute allowedRoles={["customer"]}>
                  <LayoutWrapper>
                    <Orders />
                  </LayoutWrapper>
                </ProtectedRoute>
              }
            />
            <Route
              path="/customer/orders/:id"
              element={
                <ProtectedRoute allowedRoles={["customer"]}>
                  <LayoutWrapper>
                    <OrderDetail />
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
            <Route
              path="/admin/products/new"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <LayoutWrapper>
                    <ProductForm />
                  </LayoutWrapper>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/products/:id"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <LayoutWrapper>
                    <ProductDetail />
                  </LayoutWrapper>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/products/:id/edit"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <LayoutWrapper>
                    <ProductForm />
                  </LayoutWrapper>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/request-orders"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <LayoutWrapper>
                    <RequestOrders />
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
            <Route
              path="/warehouse/request-orders"
              element={
                <ProtectedRoute allowedRoles={["warehouse"]}>
                  <LayoutWrapper>
                    <WarehouseRequestOrders />
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
            <Route
              path="/staff/orders"
              element={
                <ProtectedRoute allowedRoles={["staff"]}>
                  <LayoutWrapper>
                    <OrderProcessing />
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
