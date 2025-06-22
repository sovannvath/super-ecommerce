import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { api, type Order, type DashboardStats } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import {
  ShoppingCart,
  Package,
  Clock,
  CheckCircle,
  Truck,
  Heart,
  TrendingUp,
} from "lucide-react";

export default function CustomerDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

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

  const getOrderStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "approved":
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case "delivered":
        return <Truck className="h-4 w-4 text-green-500" />;
      default:
        return <Package className="h-4 w-4 text-gray-500" />;
    }
  };

  const getOrderStatusColor = (status: string) => {
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-metallic-bg via-metallic-light/20 to-metallic-accent/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-metallic-primary mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-metallic-accent">
            Here's what's happening with your orders and account
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Link to="/products">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-gradient-to-br from-metallic-primary to-metallic-secondary text-white">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-lg">
                    <Package className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm opacity-90">Browse</p>
                    <h3 className="font-semibold text-lg">Products</h3>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/cart">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-gradient-to-br from-metallic-secondary to-metallic-accent text-white">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-lg">
                    <ShoppingCart className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm opacity-90">View</p>
                    <h3 className="font-semibold text-lg">Cart</h3>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/customer/orders">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-gradient-to-br from-metallic-accent to-metallic-light text-metallic-primary">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-metallic-primary/20 rounded-lg">
                    <Clock className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm opacity-90">Track</p>
                    <h3 className="font-semibold text-lg">Orders</h3>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/customer/wishlist">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-gradient-to-br from-pink-400 to-red-400 text-white">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-lg">
                    <Heart className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm opacity-90">My</p>
                    <h3 className="font-semibold text-lg">Wishlist</h3>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Orders */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-metallic-primary" />
                  Recent Orders
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recentOrders.length === 0 ? (
                  <div className="text-center py-8 text-metallic-accent">
                    <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="mb-4">No orders yet</p>
                    <Link to="/products">
                      <Button className="bg-metallic-primary hover:bg-metallic-primary/90">
                        Start Shopping
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentOrders.map((order) => (
                      <div
                        key={order.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-metallic-bg/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          {getOrderStatusIcon(order.status)}
                          <div>
                            <p className="font-medium">Order #{order.id}</p>
                            <p className="text-sm text-metallic-accent">
                              {new Date(order.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <p className="font-semibold">
                              ${order.total_amount.toFixed(2)}
                            </p>
                            <Badge
                              className={`text-xs ${getOrderStatusColor(order.status)}`}
                            >
                              {order.status}
                            </Badge>
                          </div>
                          <Link to={`/customer/orders/${order.id}`}>
                            <Button variant="outline" size="sm">
                              View
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

          {/* Account Overview */}
          <div className="space-y-6">
            {/* Order Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-metallic-primary" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-metallic-accent">Total Orders</span>
                  <span className="font-semibold">
                    {stats?.total_orders || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-metallic-accent">Pending</span>
                  <Badge className="bg-yellow-100 text-yellow-800">
                    {stats?.pending_orders || 0}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-metallic-accent">Total Spent</span>
                  <span className="font-semibold text-metallic-primary">
                    ${stats?.total_income?.toFixed(2) || "0.00"}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link to="/customer/profile">
                  <Button variant="outline" className="w-full justify-start">
                    <span>Edit Profile</span>
                  </Button>
                </Link>
                <Link to="/customer/addresses">
                  <Button variant="outline" className="w-full justify-start">
                    <span>Manage Addresses</span>
                  </Button>
                </Link>
                <Link to="/customer/support">
                  <Button variant="outline" className="w-full justify-start">
                    <span>Contact Support</span>
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
