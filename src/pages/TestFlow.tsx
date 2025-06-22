import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ShoppingCart,
  ArrowRight,
  CheckCircle,
  Bell,
  Package,
  CreditCard,
} from "lucide-react";

export default function TestFlow() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🛍️ Complete Purchase Flow Test
          </h1>
          <p className="text-xl text-gray-600">
            Test the complete buying experience from product to admin
            notification
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Step 1: Product Detail */}
          <Card className="border-blue-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-700">
                <Package className="h-5 w-5" />
                Step 1: Product Detail
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                Visit any product page and click the <strong>Buy Now</strong>{" "}
                button
              </p>
              <Link to="/products">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Browse Products
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-blue-800">
                  ✅ <strong>Buy Now</strong> button is implemented
                </p>
                <p className="text-sm text-blue-600">
                  Instantly adds to cart and goes to checkout
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Step 2: Checkout */}
          <Card className="border-green-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700">
                <CreditCard className="h-5 w-5" />
                Step 2: Checkout
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                Fill shipping address, select payment method, and place order
              </p>
              <Link to="/customer/checkout">
                <Button
                  variant="outline"
                  className="w-full border-green-600 text-green-600 hover:bg-green-50"
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  View Checkout
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
              <div className="bg-green-50 p-3 rounded-lg">
                <p className="text-sm text-green-800">
                  ✅ Secure checkout form
                </p>
                <p className="text-sm text-green-600">
                  Address collection & payment methods
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Step 3: Success */}
          <Card className="border-purple-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-700">
                <CheckCircle className="h-5 w-5" />
                Step 3: Success
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                Order confirmation with tracking and receipt options
              </p>
              <Link to="/customer/checkout/success?order_id=123">
                <Button
                  variant="outline"
                  className="w-full border-purple-600 text-purple-600 hover:bg-purple-50"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  View Success Page
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
              <div className="bg-purple-50 p-3 rounded-lg">
                <p className="text-sm text-purple-800">
                  ✅ Order confirmation page
                </p>
                <p className="text-sm text-purple-600">
                  Download receipt & track order
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Step 4: Admin Notification */}
          <Card className="border-orange-200 hover:shadow-lg transition-shadow md:col-span-2 lg:col-span-3">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-700">
                <Bell className="h-5 w-5" />
                Step 4: Admin Notification
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600 mb-4">
                    When a customer places an order, admins receive automatic
                    notifications
                  </p>
                  <Link to="/admin/dashboard">
                    <Button className="w-full bg-orange-600 hover:bg-orange-700">
                      <Bell className="h-4 w-4 mr-2" />
                      View Admin Dashboard
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-orange-800 mb-2">
                    Notification Features:
                  </h4>
                  <ul className="text-sm text-orange-700 space-y-1">
                    <li>✅ Real-time order notifications</li>
                    <li>✅ Order details in notification</li>
                    <li>✅ Customer information</li>
                    <li>✅ Order total amount</li>
                    <li>✅ Notification bell badge</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* API Status */}
        <Card className="mt-8 bg-gradient-to-r from-green-500 to-blue-500 text-white">
          <CardHeader>
            <CardTitle className="text-center">
              🚀 API Integration Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
              <div className="bg-white/20 p-4 rounded-lg">
                <Badge className="bg-green-600 text-white mb-2">✅ READY</Badge>
                <p className="font-semibold">Order Creation</p>
                <p className="text-sm opacity-90">POST /api/orders</p>
              </div>
              <div className="bg-white/20 p-4 rounded-lg">
                <Badge className="bg-green-600 text-white mb-2">✅ READY</Badge>
                <p className="font-semibold">Notifications</p>
                <p className="text-sm opacity-90">POST /api/notifications</p>
              </div>
              <div className="bg-white/20 p-4 rounded-lg">
                <Badge className="bg-green-600 text-white mb-2">✅ READY</Badge>
                <p className="font-semibold">Cart System</p>
                <p className="text-sm opacity-90">GET/POST /api/cart</p>
              </div>
              <div className="bg-white/20 p-4 rounded-lg">
                <Badge className="bg-green-600 text-white mb-2">✅ READY</Badge>
                <p className="font-semibold">Admin Dashboard</p>
                <p className="text-sm opacity-90">GET /api/dashboard/admin</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Test */}
        <Card className="mt-6 border-2 border-dashed border-blue-300 bg-blue-50">
          <CardContent className="text-center py-8">
            <h3 className="text-2xl font-bold text-blue-800 mb-4">
              🎯 Quick Test Flow
            </h3>
            <p className="text-blue-700 mb-6">
              Test the complete flow in under 2 minutes!
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/products/2">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  1. Go to Product #2
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
              <Badge className="flex items-center gap-2 px-4 py-2 bg-white text-blue-800 text-sm">
                2. Click "Buy Now" → 3. Fill Checkout → 4. Check Admin
                Notifications
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
