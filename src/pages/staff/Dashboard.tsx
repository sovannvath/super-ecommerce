import React, { useEffect, useState } from "react";
import { api, type Order, type DashboardStats } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ShoppingCart,
  Clock,
  CheckCircle,
  Truck,
  Search,
  Eye,
  Package,
} from "lucide-react";

export default function StaffDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [actionType, setActionType] = useState<
    "approve" | "deliver" | "view" | null
  >(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadDashboardData();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, searchQuery, statusFilter]);

  const loadDashboardData = async () => {
    try {
      const [dashboardResponse, ordersResponse] = await Promise.all([
        api.getStaffDashboard(),
        api.getOrders(),
      ]);

      setStats(dashboardResponse);
      setOrders(ordersResponse.data || []);
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

  const filterOrders = () => {
    let filtered = [...orders];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (order) =>
          order.id.toString().includes(searchQuery) ||
          order.user_id.toString().includes(searchQuery) ||
          order.shipping_address
            .toLowerCase()
            .includes(searchQuery.toLowerCase()),
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    setFilteredOrders(filtered);
  };

  const handleOrderAction = async () => {
    if (!selectedOrder || !actionType) return;

    try {
      setIsProcessing(true);

      if (actionType === "approve") {
        await api.updateOrderStatus(selectedOrder.id, { status: "approved" });
        toast({
          title: "Order Approved",
          description: `Order #${selectedOrder.id} has been approved`,
        });
      } else if (actionType === "deliver") {
        await api.updateOrderStatus(selectedOrder.id, { status: "delivered" });
        toast({
          title: "Order Delivered",
          description: `Order #${selectedOrder.id} has been marked as delivered`,
        });
      }

      // Update local state
      setOrders((prev) =>
        prev.map((order) =>
          order.id === selectedOrder.id
            ? {
                ...order,
                status:
                  actionType === "approve"
                    ? "approved"
                    : actionType === "deliver"
                      ? "delivered"
                      : order.status,
              }
            : order,
        ),
      );
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${actionType} order`,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setSelectedOrder(null);
      setActionType(null);
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

  const getStatusIcon = (status: string) => {
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const pendingOrders = orders.filter((order) => order.status === "pending");
  const approvedOrders = orders.filter((order) => order.status === "approved");
  const deliveredOrders = orders.filter(
    (order) => order.status === "delivered",
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-metallic-bg via-metallic-light/20 to-metallic-accent/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-metallic-primary mb-2">
            Staff Dashboard
          </h1>
          <p className="text-metallic-accent">
            Manage customer orders and delivery tracking
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-metallic-accent text-sm">Pending Orders</p>
                  <h3 className="text-2xl font-bold text-metallic-primary">
                    {pendingOrders.length}
                  </h3>
                </div>
                <div className="p-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg text-white">
                  <Clock className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-metallic-accent text-sm">
                    Approved Orders
                  </p>
                  <h3 className="text-2xl font-bold text-metallic-primary">
                    {approvedOrders.length}
                  </h3>
                </div>
                <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg text-white">
                  <CheckCircle className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-metallic-accent text-sm">
                    Delivered Today
                  </p>
                  <h3 className="text-2xl font-bold text-metallic-primary">
                    {deliveredOrders.length}
                  </h3>
                </div>
                <div className="p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-lg text-white">
                  <Truck className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-metallic-accent text-sm">Total Orders</p>
                  <h3 className="text-2xl font-bold text-metallic-primary">
                    {orders.length}
                  </h3>
                </div>
                <div className="p-3 bg-gradient-to-r from-metallic-primary to-metallic-secondary rounded-lg text-white">
                  <ShoppingCart className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-metallic-primary" />
              Order Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-metallic-accent" />
                <Input
                  placeholder="Search by order ID, customer ID, or address..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Orders</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Orders Table */}
            {filteredOrders.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-metallic-accent opacity-50" />
                <p className="text-metallic-accent">No orders found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell>
                          <p className="font-medium">#{order.id}</p>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">User {order.user_id}</p>
                            <p className="text-sm text-metallic-accent truncate max-w-32">
                              {order.shipping_address}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="font-medium">
                            ${order.total_amount.toFixed(2)}
                          </p>
                          <p className="text-sm text-metallic-accent">
                            {order.payment_method}
                          </p>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              order.payment_status === "paid"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }
                          >
                            {order.payment_status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(order.status)}
                            <Badge className={getStatusColor(order.status)}>
                              {order.status}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm">
                            {new Date(order.created_at).toLocaleDateString()}
                          </p>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedOrder(order);
                                setActionType("view");
                              }}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>

                            {order.status === "pending" && (
                              <Button
                                size="sm"
                                onClick={() => {
                                  setSelectedOrder(order);
                                  setActionType("approve");
                                }}
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                            )}

                            {order.status === "approved" && (
                              <Button
                                size="sm"
                                onClick={() => {
                                  setSelectedOrder(order);
                                  setActionType("deliver");
                                }}
                                className="bg-green-600 hover:bg-green-700 text-white"
                              >
                                <Truck className="h-4 w-4 mr-1" />
                                Deliver
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Confirmation Dialog */}
        <AlertDialog
          open={!!selectedOrder && actionType !== "view"}
          onOpenChange={() => {
            setSelectedOrder(null);
            setActionType(null);
          }}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {actionType === "approve"
                  ? "Approve Order"
                  : "Mark as Delivered"}
              </AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to {actionType} order #{selectedOrder?.id}
                ? This action will update the order status.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isProcessing}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleOrderAction}
                disabled={isProcessing}
                className={
                  actionType === "approve"
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-green-600 hover:bg-green-700"
                }
              >
                {isProcessing ? (
                  <div className="flex items-center gap-2">
                    <LoadingSpinner size="sm" />
                    Processing...
                  </div>
                ) : actionType === "approve" ? (
                  "Approve Order"
                ) : (
                  "Mark as Delivered"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Order Details Dialog */}
        <AlertDialog
          open={!!selectedOrder && actionType === "view"}
          onOpenChange={() => {
            setSelectedOrder(null);
            setActionType(null);
          }}
        >
          <AlertDialogContent className="max-w-2xl">
            <AlertDialogHeader>
              <AlertDialogTitle>
                Order Details #{selectedOrder?.id}
              </AlertDialogTitle>
            </AlertDialogHeader>
            {selectedOrder && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-metallic-accent">Customer ID</p>
                    <p className="font-medium">{selectedOrder.user_id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-metallic-accent">Total Amount</p>
                    <p className="font-medium">
                      ${selectedOrder.total_amount.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-metallic-accent">
                      Payment Method
                    </p>
                    <p className="font-medium">
                      {selectedOrder.payment_method}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-metallic-accent">
                      Payment Status
                    </p>
                    <Badge
                      className={
                        selectedOrder.payment_status === "paid"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }
                    >
                      {selectedOrder.payment_status}
                    </Badge>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-metallic-accent">
                    Shipping Address
                  </p>
                  <p className="font-medium">
                    {selectedOrder.shipping_address}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-metallic-accent">Order Date</p>
                  <p className="font-medium">
                    {new Date(selectedOrder.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
            )}
            <AlertDialogFooter>
              <AlertDialogCancel>Close</AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
