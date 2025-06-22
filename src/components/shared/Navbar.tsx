import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
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
  const { user, logout, isAuthenticated, getUserRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);

  // Load cart item count for customers
  useEffect(() => {
    if (user && getUserRole() === "customer") {
      loadCartCount();
    }
  }, [user, getUserRole]);

  const loadCartCount = async () => {
    try {
      const response = await api.getCart();
      const items = Array.isArray(response)
        ? response
        : response.items || response.data || [];
      setCartItemCount(items.length);
    } catch (error) {
      // Silently handle cart loading errors
      setCartItemCount(0);
    }
  };

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
          {
            href: "/customer/cart",
            icon: ShoppingCart,
            label: "Cart",
            badge: cartItemCount > 0 ? cartItemCount : null,
          },
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
            href: "/staff/orders",
            icon: ShoppingCart,
            label: "Order Processing",
          },
        ];
      default:
        return baseItems;
    }
  };

  const navItems = getNavItems();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <ShoppingBag className="h-6 w-6" />
            <span className="hidden font-bold sm:inline-block">E-Commerce</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {/* Always show Products for everyone */}
            <Link
              to="/products"
              className={`text-foreground/60 transition-colors hover:text-foreground/80 ${
                location.pathname === "/products" ? "text-foreground" : ""
              }`}
            >
              Products
            </Link>

            {/* Show specific nav items based on role */}
            {navItems
              .filter((item) => item.href !== "/products")
              .map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.label}
                    to={item.href}
                    className={`text-foreground/60 transition-colors hover:text-foreground/80 flex items-center gap-1 ${
                      location.pathname === item.href ? "text-foreground" : ""
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                    {item.badge && (
                      <Badge className="bg-red-500 text-white text-xs">
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                );
              })}
          </nav>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0">
            <Link to="/" className="flex items-center space-x-2">
              <ShoppingBag className="h-6 w-6" />
              <span className="font-bold">E-Commerce</span>
            </Link>
            <div className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
              <div className="flex flex-col space-y-3">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.label}
                      to={item.href}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${
                        location.pathname === item.href
                          ? "bg-muted text-primary"
                          : ""
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                      {item.badge && (
                        <Badge className="ml-auto bg-red-500 text-white">
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          </SheetContent>
        </Sheet>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <Link to="/products" className="md:hidden">
              <Button variant="ghost">Products</Button>
            </Link>
          </div>
          <nav className="flex items-center space-x-2">
            {/* Cart and Notifications - prominently displayed for all users */}
            {isAuthenticated && user?.role === "customer" && (
              <Link to="/customer/cart">
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  {cartItemCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs min-w-[20px] h-5 flex items-center justify-center rounded-full">
                      {cartItemCount}
                    </Badge>
                  )}
                  <span className="sr-only">Shopping cart</span>
                </Button>
              </Link>
            )}

            {isAuthenticated && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsNotificationOpen(true)}
                className="relative"
              >
                <Bell className="h-5 w-5" />
                {/* Notification badge - you can add unread count here */}
                <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs min-w-[20px] h-5 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="animate-pulse">•</span>
                </Badge>
                <span className="sr-only">Notifications</span>
              </Button>
            )}
            {!isAuthenticated ? (
              <>
                <Link to="/auth/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link to="/auth/register">
                  <Button>Sign Up</Button>
                </Link>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsNotificationOpen(true)}
                  className="relative"
                >
                  <Bell className="h-4 w-4" />
                  <span className="sr-only">Notifications</span>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <User className="h-4 w-4" />
                      <span className="sr-only">User menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      <span>{user?.name}</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <span className="text-sm text-muted-foreground">
                        {user?.email}
                      </span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
          </nav>
        </div>
      </div>
      {isNotificationOpen && (
        <NotificationPanel
          isOpen={isNotificationOpen}
          onClose={() => setIsNotificationOpen(false)}
        />
      )}
    </header>
  );
};
