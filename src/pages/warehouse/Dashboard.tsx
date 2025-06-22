import React, { useEffect, useState } from "react";
import { api, type RequestOrder, type DashboardStats } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
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
  Warehouse,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react";

export default function WarehouseDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [requestOrders, setRequestOrders] = useState<RequestOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<RequestOrder | null>(
    null,
  );
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(
    null,
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [dashboardResponse, requestOrdersResponse] = await Promise.all([
        api.getWarehouseDashboard(),
        api.getRequestOrders(),
      ]);

      setStats(dashboardResponse);
      setRequestOrders(requestOrdersResponse.data);
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

  const handleApprovalAction = async () => {
    if (!selectedRequest || !actionType) return;

    try {
      setIsProcessing(true);
      await api.approveRequestOrderWarehouse(selectedRequest.id, {
        approval: actionType === "approve" ? "approved" : "rejected",
      });

      setRequestOrders((prev) =>
        prev.map((req) =>
          req.id === selectedRequest.id
            ? {
                ...req,
                warehouse_approval:
                  actionType === "approve" ? "approved" : "rejected",
              }
            : req,
        ),
      );

      toast({
        title: "Success",
        description: `Request ${actionType === "approve" ? "approved" : "rejected"} successfully`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${actionType} request`,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setSelectedRequest(null);
      setActionType(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const pendingRequests = requestOrders.filter(
    (req) => req.warehouse_approval === "pending",
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-metallic-bg via-metallic-light/20 to-metallic-accent/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-metallic-primary mb-2">
            Warehouse Dashboard
          </h1>
          <p className="text-metallic-accent">
            Manage stock requests and warehouse operations
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-metallic-accent text-sm">
                    Pending Requests
                  </p>
                  <h3 className="text-2xl font-bold text-metallic-primary">
                    {pendingRequests.length}
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
                  <p className="text-metallic-accent text-sm">Approved Today</p>
                  <h3 className="text-2xl font-bold text-metallic-primary">
                    {
                      requestOrders.filter(
                        (req) => req.warehouse_approval === "approved",
                      ).length
                    }
                  </h3>
                </div>
                <div className="p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-lg text-white">
                  <CheckCircle className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-metallic-accent text-sm">Total Requests</p>
                  <h3 className="text-2xl font-bold text-metallic-primary">
                    {requestOrders.length}
                  </h3>
                </div>
                <div className="p-3 bg-gradient-to-r from-metallic-primary to-metallic-secondary rounded-lg text-white">
                  <Package className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-metallic-accent text-sm">Warehouse</p>
                  <h3 className="text-xl font-bold text-metallic-primary">
                    Active
                  </h3>
                </div>
                <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg text-white">
                  <Warehouse className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stock Requests */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-metallic-primary" />
              Stock Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            {requestOrders.length === 0 ? (
              <div className="text-center py-8">
                <Package className="h-12 w-12 mx-auto mb-4 text-metallic-accent opacity-50" />
                <p className="text-metallic-accent">No stock requests found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Request ID</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Admin Status</TableHead>
                      <TableHead>Warehouse Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {requestOrders.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell>
                          <p className="font-medium">#{request.id}</p>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">
                              {request.product.name}
                            </p>
                            <p className="text-sm text-metallic-accent">
                              ${request.product.price}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="font-medium">{request.quantity}</p>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(request.admin_approval)}
                            <Badge
                              className={getStatusColor(request.admin_approval)}
                            >
                              {request.admin_approval}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(request.warehouse_approval)}
                            <Badge
                              className={getStatusColor(
                                request.warehouse_approval,
                              )}
                            >
                              {request.warehouse_approval}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm">
                            {new Date(request.created_at).toLocaleDateString()}
                          </p>
                        </TableCell>
                        <TableCell>
                          {request.admin_approval === "approved" &&
                          request.warehouse_approval === "pending" ? (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => {
                                  setSelectedRequest(request);
                                  setActionType("approve");
                                }}
                                className="bg-green-600 hover:bg-green-700 text-white"
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setSelectedRequest(request);
                                  setActionType("reject");
                                }}
                                className="border-red-500 text-red-600 hover:bg-red-50"
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Reject
                              </Button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 text-metallic-accent">
                              {request.admin_approval === "pending" ? (
                                <>
                                  <AlertTriangle className="h-4 w-4" />
                                  Awaiting Admin
                                </>
                              ) : request.warehouse_approval !== "pending" ? (
                                <span className="text-sm">Processed</span>
                              ) : null}
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Confirmation Dialog */}
        <AlertDialog
          open={!!selectedRequest && !!actionType}
          onOpenChange={() => {
            setSelectedRequest(null);
            setActionType(null);
          }}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {actionType === "approve" ? "Approve" : "Reject"} Stock Request
              </AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to {actionType} the stock request for{" "}
                {selectedRequest?.product.name}? This action will update the
                warehouse approval status.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isProcessing}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleApprovalAction}
                disabled={isProcessing}
                className={
                  actionType === "approve"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                }
              >
                {isProcessing ? (
                  <div className="flex items-center gap-2">
                    <LoadingSpinner size="sm" />
                    Processing...
                  </div>
                ) : actionType === "approve" ? (
                  "Approve Request"
                ) : (
                  "Reject Request"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
