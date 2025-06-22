import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { api, type Product } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/customer/ProductCard";
import { Navbar } from "@/components/shared/Navbar";
import {
  ArrowRight,
  Shield,
  Zap,
  BarChart3,
  Package,
  ShoppingCart,
  ShoppingBag,
  Users,
  Star,
  CheckCircle,
} from "lucide-react";

export default function Index() {
  const { user, isAuthenticated, getUserRole } = useAuth();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadFeaturedProducts();
  }, []);

  const loadFeaturedProducts = async () => {
    try {
      const response = await api.getProducts({ per_page: 8 });
      setFeaturedProducts(response.data.slice(0, 4));
    } catch (error) {
      console.error("Failed to load featured products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    {
      icon: Package,
      title: "Product Management",
      description: "Comprehensive inventory and product catalog management",
    },
    {
      icon: ShoppingCart,
      title: "Order Processing",
      description: "Streamlined order management from placement to delivery",
    },
    {
      icon: Shield,
      title: "Role-Based Access",
      description: "Secure access control for different user types",
    },
    {
      icon: Zap,
      title: "Real-time Updates",
      description: "Live inventory and order status tracking",
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description: "Real-time insights and performance analytics",
    },
    {
      icon: Users,
      title: "Multi-User Support",
      description:
        "Support for customers, staff, admins, and warehouse managers",
    },
  ];

  const stats = [
    { label: "Active Users", value: "10,000+" },
    { label: "Products Managed", value: "50,000+" },
    { label: "Orders Processed", value: "1M+" },
    { label: "Customer Satisfaction", value: "99.9%" },
  ];

  if (isAuthenticated && user) {
    const userRole = getUserRole();

    // Redirect authenticated users to their respective dashboards
    const dashboardRedirects = {
      customer: "/customer/dashboard",
      admin: "/admin/dashboard",
      warehouse: "/warehouse/dashboard",
      staff: "/staff/dashboard",
    };

    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-metallic-primary mb-4">
              Welcome back, {user.name}!
            </h1>
            <p className="text-metallic-accent mb-6">
              You're logged in as {userRole}. Access your dashboard to get
              started.
            </p>
            <div className="flex gap-4 justify-center">
              <Link to={dashboardRedirects[userRole]}>
                <Button className="bg-metallic-primary hover:bg-metallic-primary/90">
                  Go to Dashboard
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
              {userRole === "customer" && (
                <Link to="/products">
                  <Button
                    variant="outline"
                    className="border-metallic-primary text-metallic-primary"
                  >
                    Shop Now
                    <ShoppingBag className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Quick Actions for authenticated users */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Link to="/products">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <Package className="h-8 w-8 mx-auto mb-4 text-metallic-primary" />
                  <h3 className="font-semibold mb-2">Browse Products</h3>
                  <p className="text-metallic-accent text-sm">
                    Explore our product catalog
                  </p>
                </CardContent>
              </Card>
            </Link>

            {userRole === "customer" && (
              <Link to="/customer/cart">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <ShoppingBag className="h-8 w-8 mx-auto mb-4 text-metallic-primary" />
                    <h3 className="font-semibold mb-2">Shopping Cart</h3>
                    <p className="text-metallic-accent text-sm">
                      View your cart items
                    </p>
                  </CardContent>
                </Card>
              </Link>
            )}

            <Link to={dashboardRedirects[userRole]}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <BarChart3 className="h-8 w-8 mx-auto mb-4 text-metallic-primary" />
                  <h3 className="font-semibold mb-2">Dashboard</h3>
                  <p className="text-metallic-accent text-sm">
                    Access your control panel
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>

          {/* Featured Products */}
          {featuredProducts.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-metallic-primary mb-6">
                Featured Products
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-metallic-bg via-metallic-light/20 to-metallic-accent/20">
      <Navbar />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 bg-metallic-primary rounded-xl">
              <ShoppingBag className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-metallic-primary to-metallic-secondary bg-clip-text text-transparent">
              ShopSync
            </h1>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-metallic-primary mb-6">
            Complete E-commerce & Supply Chain Solution
          </h2>
          <p className="text-xl text-metallic-accent mb-8 max-w-2xl mx-auto">
            Streamline your business operations with our comprehensive platform
            for inventory management, order processing, and customer engagement.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/products">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-8 py-4 text-lg"
              >
                Start Shopping
                <ShoppingBag className="h-5 w-5 ml-2" />
              </Button>
            </Link>
            <Link to="/auth/register">
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold px-8 py-4 text-lg"
              >
                Create Account
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center">
              <CardContent className="p-6">
                <p className="text-2xl md:text-3xl font-bold text-metallic-primary mb-2">
                  {stat.value}
                </p>
                <p className="text-metallic-accent">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-metallic-primary mb-4">
            Powerful Features
          </h2>
          <p className="text-metallic-accent max-w-2xl mx-auto">
            Everything you need to manage your e-commerce business and supply
            chain operations efficiently.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="hover:shadow-lg transition-shadow border-metallic-light/50"
            >
              <CardContent className="p-6">
                <div className="mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-metallic-primary to-metallic-secondary rounded-lg flex items-center justify-center">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-metallic-primary mb-2">
                  {feature.title}
                </h3>
                <p className="text-metallic-accent">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Quick Shop Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-8 mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Start Shopping Now! 🛍️
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Browse thousands of products, add to cart, and checkout securely
              in just a few clicks.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Browse Products</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Explore our vast catalog of quality products
                </p>
                <Link to="/products">
                  <Button className="w-full">Browse Now</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingCart className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Add to Cart</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Click any product to add it to your cart
                </p>
                <Link to="/products">
                  <Button variant="outline" className="w-full">
                    Shop Now
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Secure Checkout</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Fast and secure payment processing
                </p>
                <Link to="/auth/register">
                  <Button variant="outline" className="w-full">
                    Get Started
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      {featuredProducts.length > 0 && (
        <section className="container mx-auto px-4 py-16 bg-white/80 rounded-3xl mx-4 mb-16 backdrop-blur">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-metallic-primary mb-4">
              Featured Products
            </h2>
            <p className="text-metallic-accent max-w-2xl mx-auto">
              Discover our most popular products loved by customers worldwide.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="text-center">
            <Link to="/products">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-8"
              >
                View All Products
                <Package className="h-5 w-5 ml-2" />
              </Button>
            </Link>
          </div>
        </section>
      )}

      {/* Testimonials */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-metallic-primary mb-4">
            What Our Users Say
          </h2>
          <p className="text-metallic-accent max-w-2xl mx-auto">
            Trusted by businesses of all sizes across different industries.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              name: "Sarah Johnson",
              role: "Operations Manager",
              content:
                "ShopSync has revolutionized our inventory management. The real-time updates and analytics have helped us reduce costs by 30%.",
            },
            {
              name: "Mike Chen",
              role: "E-commerce Director",
              content:
                "The seamless integration between our store and warehouse operations has improved our efficiency tremendously.",
            },
            {
              name: "Emily Rodriguez",
              role: "Store Manager",
              content:
                "User-friendly interface and powerful features make managing our entire operation so much easier.",
            },
          ].map((testimonial, index) => (
            <Card key={index} className="border-metallic-light/50">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <p className="text-metallic-accent mb-4 italic">
                  "{testimonial.content}"
                </p>
                <div>
                  <p className="font-semibold text-metallic-primary">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-metallic-accent">
                    {testimonial.role}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="bg-gradient-to-r from-metallic-primary to-metallic-secondary text-white">
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Transform Your Business?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of businesses using ShopSync to streamline their
              operations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth/register">
                <Button size="lg" variant="secondary">
                  Start Free Trial
                  <CheckCircle className="h-5 w-5 ml-2" />
                </Button>
              </Link>
              <Link to="/products">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-metallic-primary"
                >
                  Explore Products
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
