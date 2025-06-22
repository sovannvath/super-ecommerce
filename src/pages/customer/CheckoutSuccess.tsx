import React, { useEffect, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  Package,
  ArrowRight,
  Download,
  Share2,
  Home,
  ShoppingBag,
} from "lucide-react";

export default function CheckoutSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState(null);

  // Get order ID from URL params
  const orderId = searchParams.get("order_id");

  useEffect(() => {
    // If no order ID, redirect to orders page
    if (!orderId) {
      navigate("/customer/orders");
    }
  }, [orderId, navigate]);

  const handleDownloadReceipt = () => {
    // Implement receipt download functionality
    alert("Receipt download functionality would be implemented here");
  };

  const handleShareOrder = () => {
    // Implement share functionality
    if (navigator.share) {
      navigator.share({
        title: "My Order",
        text: `I just placed order #${orderId}`,
        url: window.location.href,
      });
    } else {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert("Order link copied to clipboard!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Success Animation */}
        <div className="text-center mb-8">
          <div className="relative inline-block">
            <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <CheckCircle className="h-12 w-12 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center animate-bounce">
              <span className="text-white text-sm font-bold">✓</span>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Order Successful! 🎉
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Thank you for your purchase
          </p>
          {orderId && (
            <p className="text-gray-500">
              Order #{orderId} has been placed successfully
            </p>
          )}
        </div>

        {/* Order Details Card */}
        <Card className="mb-6 border-green-200 bg-white/80 backdrop-blur">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-green-700">
              <Package className="h-5 w-5" />
              Order Confirmation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div>
                <p className="font-semibold text-gray-900">Payment Status</p>
                <p className="text-sm text-gray-600">
                  Your payment has been processed
                </p>
              </div>
              <Badge className="bg-green-100 text-green-800">✓ Confirmed</Badge>
            </div>

            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div>
                <p className="font-semibold text-gray-900">Order Status</p>
                <p className="text-sm text-gray-600">
                  Your order is being prepared
                </p>
              </div>
              <Badge className="bg-blue-100 text-blue-800">Processing</Badge>
            </div>

            <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
              <div>
                <p className="font-semibold text-gray-900">Delivery</p>
                <p className="text-sm text-gray-600">
                  Estimated delivery in 3-5 business days
                </p>
              </div>
              <Badge className="bg-purple-100 text-purple-800">Scheduled</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Button
            onClick={handleDownloadReceipt}
            variant="outline"
            className="flex items-center justify-center gap-2 h-12"
          >
            <Download className="h-4 w-4" />
            Download Receipt
          </Button>
          <Button
            onClick={handleShareOrder}
            variant="outline"
            className="flex items-center justify-center gap-2 h-12"
          >
            <Share2 className="h-4 w-4" />
            Share Order
          </Button>
        </div>

        {/* Navigation Options */}
        <div className="space-y-3">
          <Link to="/customer/orders" className="block">
            <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg">
              <Package className="h-5 w-5 mr-2" />
              Track Your Order
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </Link>

          <div className="grid grid-cols-2 gap-4">
            <Link to="/products">
              <Button variant="outline" className="w-full h-12">
                <ShoppingBag className="h-4 w-4 mr-2" />
                Continue Shopping
              </Button>
            </Link>
            <Link to="/customer/dashboard">
              <Button variant="outline" className="w-full h-12">
                <Home className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
            </Link>
          </div>
        </div>

        {/* What's Next */}
        <Card className="mt-6 bg-gray-50 border-gray-200">
          <CardHeader>
            <CardTitle className="text-center text-gray-700">
              What's Next?
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center text-sm text-gray-600 space-y-2">
            <p>• You'll receive an email confirmation shortly</p>
            <p>• We'll notify you when your order ships</p>
            <p>• Track your order anytime in your dashboard</p>
            <p>• Contact support if you have any questions</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
