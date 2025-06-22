import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Navbar } from "@/components/shared/Navbar";
import { NetworkStatus } from "@/components/shared/NetworkStatus";
import { ErrorBoundary } from "@/components/ErrorBoundary";

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
import CheckoutSuccess from "./pages/customer/CheckoutSuccess";
import TestFlow from "./pages/TestFlow";

// Admin pages
import AdminDashboard from "./pages/admin/Dashboard";
import ProductManagement from "./pages/admin/ProductManagement";
import ProductForm from "./pages/admin/ProductForm";
import AdminProductDetail from "./pages/admin/ProductDetail";
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
    <div className="container mx-auto px-4">
      <NetworkStatus />
    </div>
    {children}
  </>
);

// Role-based redirect component
const RoleRedirect = () => {
  return <Navigate to="/" replace />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ErrorBoundary>
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

              {/* Cart route - redirect to customer cart if logged in */}
              <Route
                path="/cart"
                element={
                  <ProtectedRoute allowedRoles={["customer"]}>
                    <LayoutWrapper>
                      <Cart />
                    </LayoutWrapper>
                  </ProtectedRoute>
                }
              />

              {/* Test Flow Route */}
              <Route path="/test-flow" element={<TestFlow />} />

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
              <Route
                path="/customer/checkout/success"
                element={
                  <ProtectedRoute allowedRoles={["customer"]}>
                    <CheckoutSuccess />
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
                      <AdminProductDetail />
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
                path="/admin/orders"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <LayoutWrapper>
                      <OrderProcessing />
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
    </ErrorBoundary>
  </QueryClientProvider>
);

export default App;
