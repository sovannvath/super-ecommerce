import React, { useState } from "react";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  CheckCircle,
  XCircle,
  Loader2,
  Play,
  Database,
  Shield,
  ShoppingCart,
  Bell,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface EndpointTest {
  name: string;
  category: string;
  endpoint: string;
  method: string;
  requiresAuth: boolean;
  testFunction: () => Promise<any>;
  status: "pending" | "running" | "success" | "error";
  result?: any;
  error?: string;
  icon: React.ComponentType<any>;
}

export default function ApiValidation() {
  const [testResults, setTestResults] = useState<Map<string, EndpointTest>>(
    new Map(),
  );
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [testToken, setTestToken] = useState<string>("");
  const { toast } = useToast();

  const endpoints: EndpointTest[] = [
    // Public endpoints
    {
      name: "Get Products",
      category: "Public",
      endpoint: "GET /api/products",
      method: "GET",
      requiresAuth: false,
      icon: Database,
      testFunction: () => api.getProducts(),
      status: "pending",
    },
    {
      name: "Get Single Product",
      category: "Public",
      endpoint: "GET /api/products/1",
      method: "GET",
      requiresAuth: false,
      icon: Database,
      testFunction: () => api.getProduct(1),
      status: "pending",
    },
    {
      name: "Register User",
      category: "Auth",
      endpoint: "POST /api/register",
      method: "POST",
      requiresAuth: false,
      icon: Shield,
      testFunction: () =>
        api.register({
          name: "Test User " + Date.now(),
          email: `test${Date.now()}@example.com`,
          password: "password123",
          password_confirmation: "password123",
        }),
      status: "pending",
    },
    {
      name: "Login User",
      category: "Auth",
      endpoint: "POST /api/login",
      method: "POST",
      requiresAuth: false,
      icon: Shield,
      testFunction: async () => {
        // First register a user for testing
        const registerResponse = await api.register({
          name: "Login Test " + Date.now(),
          email: `logintest${Date.now()}@example.com`,
          password: "password123",
          password_confirmation: "password123",
        });

        // Then try to login
        return api.login({
          email: `logintest${Date.now()}@example.com`,
          password: "password123",
        });
      },
      status: "pending",
    },

    // Protected endpoints (require authentication)
    {
      name: "Get Current User",
      category: "Auth",
      endpoint: "GET /api/user",
      method: "GET",
      requiresAuth: true,
      icon: Shield,
      testFunction: () => api.getUser(),
      status: "pending",
    },
    {
      name: "Get Cart",
      category: "Cart",
      endpoint: "GET /api/cart",
      method: "GET",
      requiresAuth: true,
      icon: ShoppingCart,
      testFunction: () => api.getCart(),
      status: "pending",
    },
    {
      name: "Add to Cart",
      category: "Cart",
      endpoint: "POST /api/cart/add",
      method: "POST",
      requiresAuth: true,
      icon: ShoppingCart,
      testFunction: () => api.addToCart(1, 2),
      status: "pending",
    },
    {
      name: "Get Orders",
      category: "Orders",
      endpoint: "GET /api/orders",
      method: "GET",
      requiresAuth: true,
      icon: Database,
      testFunction: () => api.getOrders(),
      status: "pending",
    },
    {
      name: "Get Payment Methods",
      category: "Orders",
      endpoint: "GET /api/payment-methods",
      method: "GET",
      requiresAuth: true,
      icon: Database,
      testFunction: () => api.getPaymentMethods(),
      status: "pending",
    },
    {
      name: "Get Notifications",
      category: "Notifications",
      endpoint: "GET /api/notifications",
      method: "GET",
      requiresAuth: true,
      icon: Bell,
      testFunction: () => api.getNotifications(),
      status: "pending",
    },
    {
      name: "Get Unread Notifications",
      category: "Notifications",
      endpoint: "GET /api/notifications/unread",
      method: "GET",
      requiresAuth: true,
      icon: Bell,
      testFunction: () => api.getUnreadNotifications(),
      status: "pending",
    },
    {
      name: "Customer Dashboard",
      category: "Dashboard",
      endpoint: "GET /api/dashboard/customer",
      method: "GET",
      requiresAuth: true,
      icon: BarChart3,
      testFunction: () => api.getCustomerDashboard(),
      status: "pending",
    },
    {
      name: "Admin Dashboard",
      category: "Dashboard",
      endpoint: "GET /api/dashboard/admin",
      method: "GET",
      requiresAuth: true,
      icon: BarChart3,
      testFunction: () => api.getAdminDashboard(),
      status: "pending",
    },
    {
      name: "Get Request Orders",
      category: "Request Orders",
      endpoint: "GET /api/request-orders",
      method: "GET",
      requiresAuth: true,
      icon: Database,
      testFunction: () => api.getRequestOrders(),
      status: "pending",
    },
    {
      name: "Get Low Stock Products",
      category: "Products",
      endpoint: "GET /api/products/low-stock",
      method: "GET",
      requiresAuth: true,
      icon: Database,
      testFunction: () => api.getLowStockProducts(),
      status: "pending",
    },
  ];

  const runSingleTest = async (endpointTest: EndpointTest) => {
    const updatedTest = { ...endpointTest, status: "running" as const };
    setTestResults((prev) => new Map(prev.set(endpointTest.name, updatedTest)));

    try {
      const result = await endpointTest.testFunction();
      setTestResults(
        (prev) =>
          new Map(
            prev.set(endpointTest.name, {
              ...updatedTest,
              status: "success",
              result,
            }),
          ),
      );
    } catch (error) {
      setTestResults(
        (prev) =>
          new Map(
            prev.set(endpointTest.name, {
              ...updatedTest,
              status: "error",
              error: error instanceof Error ? error.message : "Unknown error",
            }),
          ),
      );
    }
  };

  const runAllTests = async () => {
    setIsRunningTests(true);

    // Initialize all tests as pending
    const initialResults = new Map();
    endpoints.forEach((endpoint) => {
      initialResults.set(endpoint.name, { ...endpoint, status: "pending" });
    });
    setTestResults(initialResults);

    // First run public endpoints
    const publicEndpoints = endpoints.filter((e) => !e.requiresAuth);
    for (const endpoint of publicEndpoints) {
      await runSingleTest(endpoint);
    }

    // Try to get authentication token from a successful login
    try {
      const loginResult = testResults.get("Login User")?.result;
      if (loginResult?.token) {
        api.setToken(loginResult.token);
        setTestToken(loginResult.token);

        // Run protected endpoints
        const protectedEndpoints = endpoints.filter((e) => e.requiresAuth);
        for (const endpoint of protectedEndpoints) {
          await runSingleTest(endpoint);
        }
      }
    } catch (error) {
      toast({
        title: "Authentication failed",
        description: "Cannot test protected endpoints without valid token",
        variant: "destructive",
      });
    }

    setIsRunningTests(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "running":
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <div className="h-4 w-4 rounded-full border border-gray-300" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-800";
      case "error":
        return "bg-red-100 text-red-800";
      case "running":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const categories = [...new Set(endpoints.map((e) => e.category))];
  const summary = {
    total: endpoints.length,
    success: Array.from(testResults.values()).filter(
      (t) => t.status === "success",
    ).length,
    error: Array.from(testResults.values()).filter((t) => t.status === "error")
      .length,
    pending: Array.from(testResults.values()).filter(
      (t) => t.status === "pending",
    ).length,
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Laravel API Validation</h1>
        <p className="text-gray-600 mb-6">
          Testing all Laravel API endpoints to ensure frontend integration works
          correctly.
        </p>

        <div className="flex gap-4 mb-6">
          <Button
            onClick={runAllTests}
            disabled={isRunningTests}
            className="flex items-center gap-2"
          >
            {isRunningTests ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Play className="h-4 w-4" />
            )}
            Run All Tests
          </Button>

          {testToken && (
            <div className="flex items-center gap-2 text-sm text-green-600">
              <CheckCircle className="h-4 w-4" />
              Authenticated
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">{summary.total}</div>
              <div className="text-sm text-gray-600">Total Tests</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {summary.success}
              </div>
              <div className="text-sm text-gray-600">Passed</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">
                {summary.error}
              </div>
              <div className="text-sm text-gray-600">Failed</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-gray-600">
                {summary.pending}
              </div>
              <div className="text-sm text-gray-600">Pending</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Test Results by Category */}
      {categories.map((category) => (
        <Card key={category} className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {category === "Public" && <Database className="h-5 w-5" />}
              {category === "Auth" && <Shield className="h-5 w-5" />}
              {category === "Cart" && <ShoppingCart className="h-5 w-5" />}
              {category === "Orders" && <Database className="h-5 w-5" />}
              {category === "Notifications" && <Bell className="h-5 w-5" />}
              {category === "Dashboard" && <BarChart3 className="h-5 w-5" />}
              {category === "Request Orders" && (
                <Database className="h-5 w-5" />
              )}
              {category === "Products" && <Database className="h-5 w-5" />}
              {category} Endpoints
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {endpoints
                .filter((e) => e.category === category)
                .map((endpoint) => {
                  const result = testResults.get(endpoint.name) || endpoint;
                  return (
                    <div
                      key={endpoint.name}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <endpoint.icon className="h-4 w-4 text-gray-500" />
                        <div>
                          <div className="font-medium">{endpoint.name}</div>
                          <div className="text-sm text-gray-500">
                            {endpoint.endpoint}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            endpoint.requiresAuth ? "default" : "outline"
                          }
                        >
                          {endpoint.requiresAuth ? "Protected" : "Public"}
                        </Badge>
                        <Badge
                          className={cn(
                            "text-xs",
                            getStatusColor(result.status),
                          )}
                        >
                          {result.status}
                        </Badge>
                        {getStatusIcon(result.status)}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => runSingleTest(endpoint)}
                          disabled={result.status === "running"}
                        >
                          Test
                        </Button>
                      </div>
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Results Details */}
      {Array.from(testResults.values()).some((r) => r.result || r.error) && (
        <Card>
          <CardHeader>
            <CardTitle>Test Results Details</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-96">
              {Array.from(testResults.values())
                .filter((r) => r.result || r.error)
                .map((result) => (
                  <div key={result.name} className="mb-4 p-4 border rounded">
                    <div className="flex items-center gap-2 mb-2">
                      <result.icon className="h-4 w-4" />
                      <span className="font-medium">{result.name}</span>
                      {getStatusIcon(result.status)}
                    </div>

                    {result.error && (
                      <div className="text-red-600 text-sm font-mono bg-red-50 p-2 rounded">
                        {result.error}
                      </div>
                    )}

                    {result.result && (
                      <div className="text-green-600 text-sm">
                        <div className="font-medium mb-1">Response:</div>
                        <pre className="bg-green-50 p-2 rounded text-xs overflow-auto">
                          {JSON.stringify(result.result, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                ))}
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
