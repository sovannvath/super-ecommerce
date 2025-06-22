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
  ShoppingBag,
  Package,
  Truck,
  Shield,
  Star,
  ArrowRight,
  Users,
  BarChart3,
} from "lucide-react";

export default function Index() {
  const { isAuthenticated, user, getUserRole } = useAuth();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadFeaturedProducts();
  }, []);

  const loadFeaturedProducts = async () => {
    try {
      const response = await api.getProducts();
      // Show first 4 products as featured
      setFeaturedProducts(response.data.slice(0, 4));
    } catch (error) {
      // Handle error silently on homepage
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    {
      icon: Package,
      title: "Product Management",
      description: "Comprehensive inventory management with real-time tracking",
    },
    {
      icon: Users,
      title: "Multi-Role Access",
      description: "Customer, Admin, Warehouse, and Staff role management",
    },
    {
      icon: Truck,
      title: "Order Tracking",
      description: "End-to-end order tracking from placement to delivery",
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description: "Real-time insights and performance analytics",
    },
    {
      icon: Shield,
      title: "Secure Platform",
      description: "Enterprise-grade security for all your data",
    },
    {
      icon: Star,
      title: "24/7 Support",
      description: "Round-the-clock customer support and assistance",
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
            <div className="flex gap-4">
              <Link to={dashboardRedirects[userRole]}>
                <Button className="bg-metallic-primary hover:bg-metallic-primary/90">
                  Go to Dashboard
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
              {userRole === "customer" && (
                <Link to="/products">
                  <Button variant="outline" className="border-metallic-primary text-metallic-primary">
                    Shop Now
                    <ShoppingBag className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              )}
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
              <Link to="/cart">
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
            designed for modern e-commerce and efficient supply chain
            management.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth/register">
              <Button
                size="lg"
                className="bg-metallic-primary hover:bg-metallic-primary/90 text-lg px-8 py-6"
              >
                Get Started
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
            <Link to="/products">
              <Button
                variant="outline"
                size="lg"
                className="border-metallic-primary text-metallic-primary text-lg px-8 py-6"
              >
                Browse Products
                <Package className="h-5 w-5 ml-2" />
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

      {/* Featured Products Section */}
      {featuredProducts.length > 0 && (
        <section className="container mx-auto px-4 py-16 bg-white/50 rounded-2xl mx-4 mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-metallic-primary mb-4">
              Featured Products
            </h2>
            <p className="text-metallic-accent">
              Discover our best-selling and most popular items
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
                variant="outline"
                className="border-metallic-primary text-metallic-primary"
              >
                View All Products
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <Card className="bg-gradient-to-r from-metallic-primary to-metallic-secondary text-white">
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Transform Your Business?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of businesses already using ShopSync to streamline
              their operations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth/register">
                <Button
                  size="lg"
                  variant="secondary"
                  className="bg-white text-metallic-primary hover:bg-white/90"
                >
                  Start Free Trial
                </Button>
              </Link>
              <Link to="/auth/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10"
                >
                  Sign In
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="bg-metallic-primary text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <ShoppingBag className="h-6 w-6" />
              <h3 className="text-xl font-bold">ShopSync</h3>
            </div>
            <p className="text-metallic-light">
              Complete E-commerce & Supply Chain Solution
            </p>
            <p className="text-metallic-light text-sm mt-4">
              © 2024 ShopSync. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}