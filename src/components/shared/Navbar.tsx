import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  ShoppingBag,
  User,
  LogOut,
  Menu,
  ShoppingCart,
  Package,
  BarChart3,
  Warehouse,
  Users,
  Bell,
  Home,
} from "lucide-react";
import { NotificationPanel } from "./NotificationPanel";

export const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const getNavItems = () => {
    if (!user) return [];

    const baseItems = [
      { href: "/", icon: Home, label: "Home" },
      { href: "/products", icon: Package, label: "Products" },
    ];

    switch (user.role) {
      case "customer":
        return [
          ...baseItems,
          { href: "/customer/dashboard", icon: BarChart3, label: "Dashboard" },
          { href: "/customer/cart", icon: ShoppingCart, label: "Cart" },
          { href: "/customer/orders", icon: Package, label: "My Orders" },
        ];
      case "admin":
        return [
          { href: "/admin/dashboard", icon: BarChart3, label: "Dashboard" },
          { href: "/admin/products", icon: Package, label: "Products" },
          { href: "/admin/orders", icon: ShoppingCart, label: "Orders" },
          { href: "/admin/low-stock", icon: Warehouse, label: "Low Stock" },
          { href: "/admin/users", icon: Users, label: "Users" },
        ];
      case "warehouse":
        return [
          {
            href: "/warehouse/dashboard",
            icon: BarChart3,
            label: "Dashboard",
          },
          {
            href: "/warehouse/stock-requests",
            icon: Package,
            label: "Stock Requests",
          },
        ];
      case "staff":
        return [
          { href: "/staff/dashboard", icon: BarChart3, label: "Dashboard" },
          {
            href: "/staff/order-approval",
            icon: ShoppingCart,
            label: "Order Approval",
          },
        ];
      default:
        return baseItems;
    }
  };

  const navItems = getNavItems();

  if (!isAuthenticated) {
    return (
      <nav className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="p-2 bg-metallic-primary rounded-lg">
                <ShoppingBag className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-metallic-primary">
                  ShopSync
                </h1>
              </div>
            </Link>

            <div className="flex items-center gap-4">
              <Link to="/products">
                <Button variant="ghost" className="text-metallic-accent">
                  Products
                </Button>
              </Link>
              <Link to="/auth/login">
                <Button
                  variant="outline"
                  className="border-metallic-primary text-metallic-primary"
                >
                  Sign In
                </Button>
              </Link>
              <Link to="/auth/register">
                <Button className="bg-metallic-primary hover:bg-metallic-primary/90">
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  const isActive = (href: string) => {
    if (href === "/") return location.pathname === "/";
    return location.pathname.startsWith(href);
  };

  return (
    <nav className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="p-2 bg-metallic-primary rounded-lg">
              <ShoppingBag className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-metallic-primary">
                ShopSync
              </h1>
              <Badge
                variant="secondary"
                className="text-xs bg-metallic-accent/20 text-metallic-primary"
              >
                {user.role}
              </Badge>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.href} to={item.href}>
                  <Button
                    variant={isActive(item.href) ? "default" : "ghost"}
                    className={
                      isActive(item.href)
                        ? "bg-metallic-primary hover:bg-metallic-primary/90"
                        : "text-metallic-accent hover:text-metallic-primary"
                    }
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            {/* Notifications */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              className="relative"
            >
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500">
                3
              </Badge>
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col gap-4 mt-8">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link key={item.href} to={item.href}>
                        <Button
                          variant={isActive(item.href) ? "default" : "ghost"}
                          className={`w-full justify-start ${
                            isActive(item.href)
                              ? "bg-metallic-primary hover:bg-metallic-primary/90"
                              : "text-metallic-accent hover:text-metallic-primary"
                          }`}
                        >
                          <Icon className="h-4 w-4 mr-2" />
                          {item.label}
                        </Button>
                      </Link>
                    );
                  })}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Notification Panel */}
      {isNotificationOpen && (
        <NotificationPanel onClose={() => setIsNotificationOpen(false)} />
      )}
    </nav>
  );
};
