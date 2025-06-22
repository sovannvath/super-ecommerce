import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { api, type Order, type DashboardStats } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import {
  Package,
  ShoppingCart,
  ShoppingBag,
  User,
  CreditCard,
  MapPin,
  Clock,
  TrendingUp,
  Star,
  Plus,
  ArrowRight,
  Grid3X3,
} from "lucide-react";

export default function CustomerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [dashboardResponse, ordersResponse] = await Promise.all([
        api.getCustomerDashboard(),
        api.getOrders(),
      ]);

      setStats(dashboardResponse);
      setRecentOrders(ordersResponse.data.slice(0, 5)); // Show last 5 orders
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-blue-100 text-blue-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const sidebarItems = [
    {
      icon: Grid3X3,
      label: "Browse Products",
      href: "/products",
      description: "Explore our catalog",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: ShoppingCart,
      label: "My Cart",
      href: "/customer/cart",
      description: "Review items",
      color: "from-green-500 to-green-600",
    },
    {
      icon: Package,
      label: "My Orders",
      href: "/customer/orders",
      description: "Track purchases",
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: User,
      label: "Profile",
      href: "/customer/profile",
      description: "Account settings",
      color: "from-orange-500 to-orange-600",
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 min-h-screen p-6">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Welcome back, {user?.name}!
            </h2>
            <p className="text-gray-600">Manage your shopping experience</p>
          </div>

          <div className="space-y-4">
            {sidebarItems.map((item) => (
              <Link key={item.href} to={item.href}>
                <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-gray-100 hover:border-blue-200">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-4">
                      <div
                        className={`p-3 bg-gradient-to-r ${item.color} rounded-lg text-white group-hover:scale-110 transition-transform`}
                      >
                        <item.icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {item.label}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {item.description}
                        </p>
                      </div>
                      <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Quick Stats in Sidebar */}
          <Card className="mt-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2">Your Activity</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Total Orders:</span>
                  <span className="font-bold">{stats?.total_orders || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>This Month:</span>
                  <span className="font-bold">
                    {stats?.monthly_orders || 0}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* Welcome Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
            <p className="text-gray-600">Overview of your shopping activity</p>
          </div>

          {/* Quick Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card
              className="hover:shadow-lg transition-shadow cursor-pointer group"
              onClick={() => navigate("/products")}
            >
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <ShoppingBag className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition-colors">
                  Start Shopping
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Browse our latest products and find great deals
                </p>
                <Button className="w-full bg-blue-500 hover:bg-blue-600">
                  Browse Products
                  <Plus className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            <Card
              className="hover:shadow-lg transition-shadow cursor-pointer group"
              onClick={() => navigate("/customer/cart")}
            >
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <ShoppingCart className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold text-lg mb-2 group-hover:text-green-600 transition-colors">
                  Shopping Cart
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Review items and proceed to checkout
                </p>
                <Button
                  variant="outline"
                  className="w-full border-green-500 text-green-600 hover:bg-green-50"
                >
                  View Cart
                  <ShoppingCart className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            <Card
              className="hover:shadow-lg transition-shadow cursor-pointer group"
              onClick={() => navigate("/customer/orders")}
            >
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Package className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold text-lg mb-2 group-hover:text-purple-600 transition-colors">
                  Order History
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Track your orders and delivery status
                </p>
                <Button
                  variant="outline"
                  className="w-full border-purple-500 text-purple-600 hover:bg-purple-50"
                >
                  View Orders
                  <Package className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Orders</p>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {stats?.total_orders || 0}
                    </h3>
                  </div>
                  <Package className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Spent</p>
                    <h3 className="text-2xl font-bold text-gray-900">
                      ${stats?.total_spent || "0.00"}
                    </h3>
                  </div>
                  <CreditCard className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Pending Orders</p>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {stats?.pending_orders || 0}
                    </h3>
                  </div>
                  <Clock className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Saved Items</p>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {stats?.wishlist_items || 0}
                    </h3>
                  </div>
                  <Star className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-blue-500" />
                  Recent Orders
                </CardTitle>
                <Link to="/customer/orders">
                  <Button variant="outline" size="sm">
                    View All Orders
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {recentOrders.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No orders yet
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Start shopping to see your orders here
                  </p>
                  <Link to="/products">
                    <Button className="bg-blue-500 hover:bg-blue-600">
                      Browse Products
                      <ShoppingBag className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Package className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            Order #{order.id}
                          </p>
                          <p className="text-sm text-gray-600">
                            {new Date(order.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Badge className={getStatusColor(order.status)}>
                          {order.status.charAt(0).toUpperCase() +
                            order.status.slice(1)}
                        </Badge>
                        <p className="font-semibold text-gray-900">
                          ${Number(order.total_amount).toFixed(2)}
                        </p>
                        <Link to={`/customer/orders/${order.id}`}>
                          <Button variant="ghost" size="sm">
                            View
                            <ArrowRight className="h-4 w-4 ml-1" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
