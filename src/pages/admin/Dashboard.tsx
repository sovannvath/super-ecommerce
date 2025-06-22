import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, type DashboardStats, type Product } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { StatsCard } from "@/components/admin/StatsCard";
import { SalesChart } from "@/components/admin/SalesChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DollarSign,
  Package,
  ShoppingCart,
  AlertTriangle,
  Users,
  TrendingUp,
  Eye,
  Edit,
} from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [dashboardResponse, lowStockResponse] = await Promise.all([
        api.getAdminDashboard(),
        api.getLowStockProducts(),
      ]);

      setStats(dashboardResponse);
      setLowStockProducts(lowStockResponse.data);
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const mockSalesData = [
    { date: "2024-01-01", amount: 1200 },
    { date: "2024-01-02", amount: 1500 },
    { date: "2024-01-03", amount: 1800 },
    { date: "2024-01-04", amount: 1300 },
    { date: "2024-01-05", amount: 2100 },
    { date: "2024-01-06", amount: 1900 },
    { date: "2024-01-07", amount: 2400 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-metallic-bg via-metallic-light/20 to-metallic-accent/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-metallic-primary mb-2">
            Admin Dashboard
          </h1>
          <p className="text-metallic-accent">
            Monitor your store performance and manage operations
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Income"
            value={`$${stats?.total_income?.toLocaleString() || "0"}`}
            icon={DollarSign}
            trend="+12.5% from last month"
            color="from-green-500 to-green-600"
          />
          <StatsCard
            title="Low Stock Items"
            value={stats?.low_stock_count?.toString() || "0"}
            icon={AlertTriangle}
            trend={`${lowStockProducts.length} products need attention`}
            color="from-yellow-500 to-orange-500"
            alert={lowStockProducts.length > 0}
          />
          <StatsCard
            title="Today's Orders"
            value={stats?.todays_orders?.toString() || "0"}
            icon={ShoppingCart}
            trend="+8.2% from yesterday"
            color="from-blue-500 to-blue-600"
          />
          <StatsCard
            title="Total Orders"
            value={stats?.total_orders?.toString() || "0"}
            icon={Package}
            trend="All time orders"
            color="from-purple-500 to-purple-600"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sales Chart */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-metallic-primary" />
                  Sales Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SalesChart data={stats?.sales_data || mockSalesData} />
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link to="/admin/products/new">
                  <Button className="w-full justify-start bg-metallic-primary hover:bg-metallic-primary/90">
                    <Package className="h-4 w-4 mr-2" />
                    Add New Product
                  </Button>
                </Link>
                <Link to="/admin/orders">
                  <Button
                    variant="outline"
                    className="w-full justify-start border-metallic-primary text-metallic-primary"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Manage Orders
                  </Button>
                </Link>
                <Link to="/admin/low-stock">
                  <Button
                    variant="outline"
                    className="w-full justify-start border-yellow-500 text-yellow-600"
                  >
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    View Low Stock
                    {lowStockProducts.length > 0 && (
                      <Badge className="ml-auto bg-yellow-500">
                        {lowStockProducts.length}
                      </Badge>
                    )}
                  </Button>
                </Link>
                <Link to="/admin/users">
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="h-4 w-4 mr-2" />
                    Manage Users
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Popular Products */}
            <Card>
              <CardHeader>
                <CardTitle>Popular Products</CardTitle>
              </CardHeader>
              <CardContent>
                {stats?.popular_products &&
                stats.popular_products.length > 0 ? (
                  <div className="space-y-3">
                    {stats.popular_products
                      .slice(0, 5)
                      .map((product, index) => (
                        <div
                          key={product.id}
                          className="flex items-center gap-3"
                        >
                          <div className="w-8 h-8 rounded-full bg-metallic-primary text-white flex items-center justify-center text-sm font-medium">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-sm">
                              {product.name}
                            </p>
                            <p className="text-xs text-metallic-accent">
                              ${product.price.toFixed(2)}
                            </p>
                          </div>
                          <Link to={`/admin/products/${product.id}`}>
                            <Button variant="ghost" size="icon">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="text-center text-metallic-accent">
                    No popular products data available
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Low Stock Alert */}
        {lowStockProducts.length > 0 && (
          <Card className="mt-6 border-yellow-200 bg-yellow-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-800">
                <AlertTriangle className="h-5 w-5" />
                Low Stock Alert
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-yellow-700">
                  {lowStockProducts.length} products are running low on stock
                  and need immediate attention.
                </p>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Current Stock</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {lowStockProducts.slice(0, 5).map((product) => (
                        <TableRow key={product.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{product.name}</p>
                              <p className="text-sm text-metallic-accent">
                                ID: {product.id}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={
                                product.stock_quantity === 0
                                  ? "bg-red-100 text-red-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }
                            >
                              {product.stock_quantity}
                            </Badge>
                          </TableCell>
                          <TableCell>${product.price.toFixed(2)}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Link to={`/admin/products/${product.id}/edit`}>
                                <Button variant="outline" size="sm">
                                  <Edit className="h-4 w-4 mr-1" />
                                  Restock
                                </Button>
                              </Link>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                {lowStockProducts.length > 5 && (
                  <div className="text-center">
                    <Link to="/admin/low-stock">
                      <Button
                        variant="outline"
                        className="border-yellow-500 text-yellow-600"
                      >
                        View All Low Stock Products
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
