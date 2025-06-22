import React, { useEffect, useState } from "react";
import { api, type RequestOrder } from "@/lib/api";
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
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import {
  Warehouse,
  Package,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  ThumbsUp,
  ThumbsDown,
  Truck,
  AlertTriangle,
} from "lucide-react";

export default function WarehouseRequestOrders() {
  const { toast } = useToast();
  const [requestOrders, setRequestOrders] = useState<RequestOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<RequestOrder | null>(
    null,
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(
    null,
  );

  useEffect(() => {
    loadRequestOrders();
  }, []);

  const loadRequestOrders = async () => {
    try {
      setIsLoading(true);
      const response = await api.getRequestOrders();
      setRequestOrders(response.data || []);
    } catch (error) {
      console.error("Error loading request orders:", error);
      toast({
        title: "Error",
        description: "Failed to load request orders",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleWarehouseApproval = async () => {
    if (!selectedRequest || !actionType) return;

    try {
      setIsProcessing(true);
      await api.approveRequestOrderWarehouse(selectedRequest.id, {
        approval: actionType === "approve" ? "approved" : "rejected",
      });

      setRequestOrders((prev) =>
        prev.map((request) =>
          request.id === selectedRequest.id
            ? {
                ...request,
                warehouse_approval:
                  actionType === "approve" ? "approved" : "rejected",
              }
            : request,
        ),
      );

      toast({
        title: `Request ${actionType === "approve" ? "Approved" : "Rejected"}`,
        description: `Warehouse ${actionType === "approve" ? "approval" : "rejection"} completed successfully`,
        variant: actionType === "approve" ? "default" : "destructive",
      });

      setSelectedRequest(null);
      setActionType(null);
    } catch (error) {
      console.error("Error processing request:", error);
      toast({
        title: "Error",
        description: "Failed to process warehouse approval",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const getApprovalBadgeVariant = (approval: string) => {
    switch (approval) {
      case "approved":
        return "success";
      case "rejected":
        return "destructive";
      default:
        return "warning";
    }
  };

  const getApprovalIcon = (approval: string) => {
    switch (approval) {
      case "approved":
        return <CheckCircle className="w-4 h-4" />;
      case "rejected":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
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

  const openApprovalDialog = (
    request: RequestOrder,
    action: "approve" | "reject",
  ) => {
    setSelectedRequest(request);
    setActionType(action);
  };

  // Filter requests that need warehouse attention (admin approved but warehouse pending)
  const readyForWarehouse = requestOrders.filter(
    (r) =>
      r.admin_approval === "approved" && r.warehouse_approval === "pending",
  );

  const pendingAdmin = requestOrders.filter(
    (r) => r.admin_approval === "pending",
  );

  const processedByWarehouse = requestOrders.filter(
    (r) => r.warehouse_approval !== "pending",
  );

  const rejectedByAdmin = requestOrders.filter(
    (r) => r.admin_approval === "rejected",
  );

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
          <Warehouse className="w-8 h-8" />
          Warehouse Request Management
        </h1>
        <p className="text-muted-foreground">
          Process approved request orders and manage inventory fulfillment
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Ready for Processing
                </p>
                <p className="text-2xl font-bold">{readyForWarehouse.length}</p>
              </div>
              <Truck className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Pending Admin
                </p>
                <p className="text-2xl font-bold">{pendingAdmin.length}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Processed
                </p>
                <p className="text-2xl font-bold">
                  {processedByWarehouse.length}
                </p>
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
                  Total Requests
                </p>
                <p className="text-2xl font-bold">{requestOrders.length}</p>
              </div>
              <Package className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ready for Warehouse Processing */}
      {readyForWarehouse.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Truck className="w-5 h-5 text-blue-500" />
            Ready for Warehouse Processing ({readyForWarehouse.length})
          </h2>
          <div className="space-y-4">
            {readyForWarehouse.map((request) => (
              <Card key={request.id} className="border-l-4 border-l-blue-500">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 rounded border bg-muted overflow-hidden">
                          {request.product.image ||
                          request.product.image_url ? (
                            <img
                              src={
                                request.product.image ||
                                request.product.image_url
                              }
                              alt={request.product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                              No image
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">
                            {request.product.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {request.product.description}
                          </p>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="text-sm">
                              <strong>Requested Quantity:</strong>{" "}
                              {request.quantity}
                            </span>
                            <span className="text-sm">
                              <strong>Current Stock:</strong>{" "}
                              {request.product.quantity ||
                                request.product.stock_quantity ||
                                0}
                            </span>
                            <span className="text-sm">
                              <strong>Product ID:</strong> {request.product_id}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mb-4">
                        <Badge variant="success">
                          {getApprovalIcon(request.admin_approval)}
                          Admin: Approved
                        </Badge>
                        <Badge
                          variant={
                            getApprovalBadgeVariant(
                              request.warehouse_approval,
                            ) as any
                          }
                        >
                          {getApprovalIcon(request.warehouse_approval)}
                          Warehouse: {request.warehouse_approval}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          Requested: {formatDate(request.created_at)}
                        </span>
                      </div>

                      {/* Stock Check */}
                      <div className="p-3 bg-muted rounded-lg mb-4">
                        <h4 className="font-semibold text-sm mb-2">
                          Inventory Check
                        </h4>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Requested</p>
                            <p className="font-semibold">{request.quantity}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Available</p>
                            <p className="font-semibold">
                              {request.product.quantity ||
                                request.product.stock_quantity ||
                                0}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Status</p>
                            <Badge
                              variant={
                                (request.product.quantity ||
                                  request.product.stock_quantity ||
                                  0) >= request.quantity
                                  ? "success"
                                  : "destructive"
                              }
                            >
                              {(request.product.quantity ||
                                request.product.stock_quantity ||
                                0) >= request.quantity
                                ? "In Stock"
                                : "Insufficient Stock"}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <Separator className="my-4" />

                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => openApprovalDialog(request, "approve")}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          disabled={
                            (request.product.quantity ||
                              request.product.stock_quantity ||
                              0) < request.quantity
                          }
                        >
                          <ThumbsUp className="w-4 h-4 mr-2" />
                          Fulfill Order
                        </Button>
                        <Button
                          onClick={() => openApprovalDialog(request, "reject")}
                          variant="destructive"
                          size="sm"
                        >
                          <ThumbsDown className="w-4 h-4 mr-2" />
                          Cannot Fulfill
                        </Button>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Pending Admin Approval */}
      {pendingAdmin.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-500" />
            Pending Admin Approval ({pendingAdmin.length})
          </h2>
          <div className="space-y-4">
            {pendingAdmin.map((request) => (
              <Card key={request.id} className="border-l-4 border-l-yellow-500">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded border bg-muted overflow-hidden">
                          {request.product.image ||
                          request.product.image_url ? (
                            <img
                              src={
                                request.product.image ||
                                request.product.image_url
                              }
                              alt={request.product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                              No image
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold">
                            {request.product.name}
                          </h3>
                          <div className="flex items-center gap-4 mt-1">
                            <span className="text-sm text-muted-foreground">
                              Qty: {request.quantity}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {formatDate(request.created_at)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Badge variant="warning">Waiting for Admin</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Processed Requests */}
      {processedByWarehouse.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            Processed by Warehouse ({processedByWarehouse.length})
          </h2>
          <div className="space-y-4">
            {processedByWarehouse.map((request) => (
              <Card key={request.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded border bg-muted overflow-hidden">
                          {request.product.image ||
                          request.product.image_url ? (
                            <img
                              src={
                                request.product.image ||
                                request.product.image_url
                              }
                              alt={request.product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                              No image
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold">
                            {request.product.name}
                          </h3>
                          <div className="flex items-center gap-4 mt-1">
                            <span className="text-sm text-muted-foreground">
                              Qty: {request.quantity}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {formatDate(request.created_at)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            getApprovalBadgeVariant(
                              request.admin_approval,
                            ) as any
                          }
                        >
                          {getApprovalIcon(request.admin_approval)}
                          Admin: {request.admin_approval}
                        </Badge>
                        <Badge
                          variant={
                            getApprovalBadgeVariant(
                              request.warehouse_approval,
                            ) as any
                          }
                        >
                          {getApprovalIcon(request.warehouse_approval)}
                          Warehouse: {request.warehouse_approval}
                        </Badge>
                      </div>
                    </div>
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

      {requestOrders.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Warehouse className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold mb-2">No request orders found</h2>
            <p className="text-muted-foreground">
              No product request orders have been submitted yet.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Warehouse Approval Dialog */}
      <Dialog
        open={!!selectedRequest && !!actionType}
        onOpenChange={() => {
          setSelectedRequest(null);
          setActionType(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === "approve" ? "Fulfill" : "Reject"} Request Order
            </DialogTitle>
            <DialogDescription>
              {actionType === "approve"
                ? "Confirm that you can fulfill this request order and update inventory accordingly."
                : "Mark this request order as unfulfillable from warehouse perspective."}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-2">
              <p>
                <strong>Product:</strong> {selectedRequest?.product.name}
              </p>
              <p>
                <strong>Requested Quantity:</strong> {selectedRequest?.quantity}
              </p>
              <p>
                <strong>Available Stock:</strong>{" "}
                {selectedRequest?.product.quantity ||
                  selectedRequest?.product.stock_quantity ||
                  0}
              </p>
              <p>
                <strong>Requested:</strong>{" "}
                {selectedRequest && formatDate(selectedRequest.created_at)}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setSelectedRequest(null);
                setActionType(null);
              }}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              onClick={handleWarehouseApproval}
              disabled={isProcessing}
              variant={actionType === "approve" ? "default" : "destructive"}
            >
              {isProcessing
                ? "Processing..."
                : actionType === "approve"
                  ? "Fulfill Order"
                  : "Cannot Fulfill"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
