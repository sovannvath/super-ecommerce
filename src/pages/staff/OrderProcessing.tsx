import React, { useEffect, useState } from "react";
import { api, type Order } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  CreditCard,
  MapPin,
  Eye,
  CheckSquare,
  XCircle,
  AlertCircle,
} from "lucide-react";

export default function OrderProcessing() {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [actionType, setActionType] = useState<
    "approve" | "deliver" | "cancel" | "payment" | null
  >(null);
  const [processingNotes, setProcessingNotes] = useState("");

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setIsLoading(true);
      const response = await api.getOrders();
      setOrders(response.data || []);
    } catch (error) {
      console.error("Error loading orders:", error);
      toast({
        title: "Error",
        description: "Failed to load orders",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOrderAction = async () => {
    if (!selectedOrder || !actionType) return;

    try {
      setIsProcessing(true);

      switch (actionType) {
        case "approve":
          await api.updateOrderStatus(selectedOrder.id, {
            status: "approved",
          });
          break;
        case "deliver":
          await api.updateOrderStatus(selectedOrder.id, {
            status: "delivered",
          });
          break;
        case "cancel":
          await api.updateOrderStatus(selectedOrder.id, {
            status: "cancelled",
          });
          break;
        case "payment":
          await api.updateOrderPayment(selectedOrder.id, {
            payment_status: "paid",
          });
          break;
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
                      : actionType === "cancel"
                        ? "cancelled"
                        : order.status,
                payment_status:
                  actionType === "payment" ? "paid" : order.payment_status,
              }
            : order,
        ),
      );

      toast({
        title: "Order Updated",
        description: `Order ${actionType === "approve" ? "approved" : actionType === "deliver" ? "marked as delivered" : actionType === "cancel" ? "cancelled" : "payment confirmed"} successfully`,
        variant: actionType === "cancel" ? "destructive" : "default",
      });

      setSelectedOrder(null);
      setActionType(null);
      setProcessingNotes("");
    } catch (error) {
      console.error("Error processing order:", error);
      toast({
        title: "Error",
        description: "Failed to process order",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "warning";
      case "approved":
        return "default";
      case "delivered":
        return "success";
      case "cancelled":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "success";
      case "pending":
        return "warning";
      case "failed":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-5 h-5" />;
      case "approved":
        return <CheckSquare className="w-5 h-5" />;
      case "delivered":
        return <CheckCircle className="w-5 h-5" />;
      case "cancelled":
        return <XCircle className="w-5 h-5" />;
      default:
        return <Package className="w-5 h-5" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const openActionDialog = (
    order: Order,
    action: "approve" | "deliver" | "cancel" | "payment",
  ) => {
    setSelectedOrder(order);
    setActionType(action);
    setProcessingNotes("");
  };

  const pendingOrders = orders.filter((o) => o.status === "pending");
  const approvedOrders = orders.filter((o) => o.status === "approved");
  const deliveredOrders = orders.filter((o) => o.status === "delivered");
  const cancelledOrders = orders.filter((o) => o.status === "cancelled");

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Package className="w-8 h-8" />
          Order Processing Center
        </h1>
        <p className="text-muted-foreground">
          Process orders, update statuses, and manage fulfillment
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Pending Orders
                </p>
                <p className="text-2xl font-bold">{pendingOrders.length}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Approved
                </p>
                <p className="text-2xl font-bold">{approvedOrders.length}</p>
              </div>
              <CheckSquare className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Delivered
                </p>
                <p className="text-2xl font-bold">{deliveredOrders.length}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Orders
                </p>
                <p className="text-2xl font-bold">{orders.length}</p>
              </div>
              <Package className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Orders */}
      {pendingOrders.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-yellow-500" />
            Pending Orders ({pendingOrders.length})
          </h2>
          <div className="space-y-4">
            {pendingOrders.map((order) => (
              <Card key={order.id} className="border-l-4 border-l-yellow-500">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg flex items-center gap-2">
                        {getStatusIcon(order.status)}
                        Order #{order.id}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Placed on {formatDate(order.created_at)}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant={getStatusColor(order.status) as any}>
                          {order.status.charAt(0).toUpperCase() +
                            order.status.slice(1)}
                        </Badge>
                        <Badge
                          variant={
                            getPaymentStatusColor(order.payment_status) as any
                          }
                        >
                          {order.payment_status === "paid"
                            ? "Paid"
                            : order.payment_status === "pending"
                              ? "Payment Pending"
                              : "Payment Failed"}
                        </Badge>
                      </div>
                      <p className="text-lg font-bold">
                        ${order.total_amount.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm capitalize">
                        {order.payment_method}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground truncate">
                        {order.shipping_address}
                      </span>
                    </div>
                  </div>

                  {/* Order Items Summary */}
                  {order.items && order.items.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-medium mb-2">
                        Items ({order.items.length}):
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {order.items.slice(0, 3).map((item) => (
                          <Badge key={item.id} variant="outline">
                            {item.product.name} x {item.quantity}
                          </Badge>
                        ))}
                        {order.items.length > 3 && (
                          <Badge variant="outline">
                            +{order.items.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  <Separator className="my-4" />

                  <div className="flex items-center gap-2 flex-wrap">
                    <Button
                      onClick={() => openActionDialog(order, "approve")}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckSquare className="w-4 h-4 mr-2" />
                      Approve Order
                    </Button>

                    {order.payment_status === "pending" &&
                      order.payment_method === "cash" && (
                        <Button
                          onClick={() => openActionDialog(order, "payment")}
                          size="sm"
                          variant="outline"
                        >
                          <CreditCard className="w-4 h-4 mr-2" />
                          Confirm Payment
                        </Button>
                      )}

                    <Button
                      onClick={() => openActionDialog(order, "cancel")}
                      variant="destructive"
                      size="sm"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Cancel Order
                    </Button>

                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Approved Orders */}
      {approvedOrders.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Truck className="w-5 h-5 text-blue-500" />
            Ready for Delivery ({approvedOrders.length})
          </h2>
          <div className="space-y-4">
            {approvedOrders.map((order) => (
              <Card key={order.id} className="border-l-4 border-l-blue-500">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg flex items-center gap-2">
                        {getStatusIcon(order.status)}
                        Order #{order.id}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Approved • {formatDate(order.created_at)}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="default">Approved</Badge>
                        <Badge
                          variant={
                            getPaymentStatusColor(order.payment_status) as any
                          }
                        >
                          {order.payment_status === "paid"
                            ? "Paid"
                            : "Payment Pending"}
                        </Badge>
                      </div>
                      <p className="text-lg font-bold">
                        ${order.total_amount.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{order.shipping_address}</span>
                  </div>

                  <Separator className="my-4" />

                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => openActionDialog(order, "deliver")}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Mark as Delivered
                    </Button>

                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Recently Processed Orders */}
      {(deliveredOrders.length > 0 || cancelledOrders.length > 0) && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Recently Processed</h2>
          <div className="space-y-4">
            {[...deliveredOrders, ...cancelledOrders]
              .sort(
                (a, b) =>
                  new Date(b.updated_at || b.created_at).getTime() -
                  new Date(a.updated_at || a.created_at).getTime(),
              )
              .slice(0, 5)
              .map((order) => (
                <Card key={order.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {getStatusIcon(order.status)}
                        <div>
                          <h3 className="font-semibold">Order #{order.id}</h3>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(order.created_at)} •{" "}
                            {order.items?.length || 0} items
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={getStatusColor(order.status) as any}>
                          {order.status.charAt(0).toUpperCase() +
                            order.status.slice(1)}
                        </Badge>
                        <p className="text-sm text-muted-foreground mt-1">
                          ${order.total_amount.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      )}

      {orders.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold mb-2">No orders found</h2>
            <p className="text-muted-foreground">
              No orders have been placed yet.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Action Dialog */}
      <Dialog
        open={!!selectedOrder && !!actionType}
        onOpenChange={() => {
          setSelectedOrder(null);
          setActionType(null);
          setProcessingNotes("");
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === "approve"
                ? "Approve Order"
                : actionType === "deliver"
                  ? "Mark as Delivered"
                  : actionType === "cancel"
                    ? "Cancel Order"
                    : "Confirm Payment"}
            </DialogTitle>
            <DialogDescription>
              {actionType === "approve"
                ? "Approve this order for processing and delivery preparation."
                : actionType === "deliver"
                  ? "Confirm that this order has been successfully delivered to the customer."
                  : actionType === "cancel"
                    ? "Cancel this order. This action cannot be undone."
                    : "Confirm that payment has been received for this order."}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-2 mb-4">
              <p>
                <strong>Order ID:</strong> #{selectedOrder?.id}
              </p>
              <p>
                <strong>Total Amount:</strong> $
                {selectedOrder?.total_amount.toFixed(2)}
              </p>
              <p>
                <strong>Payment Method:</strong> {selectedOrder?.payment_method}
              </p>
              <p>
                <strong>Items:</strong> {selectedOrder?.items?.length || 0}
              </p>
            </div>

            {(actionType === "cancel" || actionType === "deliver") && (
              <div className="space-y-2">
                <Label htmlFor="notes">
                  {actionType === "cancel" ? "Cancellation" : "Delivery"} Notes
                  (Optional)
                </Label>
                <Textarea
                  id="notes"
                  placeholder={`Add any ${actionType === "cancel" ? "cancellation" : "delivery"} notes...`}
                  value={processingNotes}
                  onChange={(e) => setProcessingNotes(e.target.value)}
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setSelectedOrder(null);
                setActionType(null);
                setProcessingNotes("");
              }}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              onClick={handleOrderAction}
              disabled={isProcessing}
              variant={
                actionType === "cancel"
                  ? "destructive"
                  : actionType === "deliver"
                    ? "default"
                    : actionType === "approve"
                      ? "default"
                      : "default"
              }
            >
              {isProcessing
                ? "Processing..."
                : actionType === "approve"
                  ? "Approve Order"
                  : actionType === "deliver"
                    ? "Mark as Delivered"
                    : actionType === "cancel"
                      ? "Cancel Order"
                      : "Confirm Payment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
