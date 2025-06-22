import React, { useState } from "react";
import { Link } from "react-router-dom";
import { api, type Product } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { formatCurrency } from "@/lib/utils";
import { ShoppingCart, Heart, Eye, Package, AlertTriangle } from "lucide-react";

interface ProductCardProps {
  product: Product;
  viewMode?: "grid" | "list";
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  viewMode = "grid",
}) => {
  const { isAuthenticated } = useAuth();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isWishlistedProduct, setIsWishlistedProduct] = useState(false);
  const { toast } = useToast();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please login to add items to cart",
        variant: "destructive",
      });
      return;
    }

    if (product.quantity === 0) {
      toast({
        title: "Out of Stock",
        description: "This product is currently out of stock",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsAddingToCart(true);
      await api.addToCart(product.id, 1);
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add product to cart",
        variant: "destructive",
      });
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please login to add items to wishlist",
        variant: "destructive",
      });
      return;
    }

    // This would connect to a wishlist API endpoint
    setIsWishlistedProduct(!isWishlistedProduct);
    toast({
      title: isWishlistedProduct
        ? "Removed from wishlist"
        : "Added to wishlist",
      description: `${product.name} ${isWishlistedProduct ? "removed from" : "added to"} your wishlist`,
    });
  };

  const getStockStatus = () => {
    if (product.stock_quantity === 0) {
      return { label: "Out of Stock", color: "bg-red-100 text-red-800" };
    }
    if (product.stock_quantity <= 5) {
      return { label: "Low Stock", color: "bg-yellow-100 text-yellow-800" };
    }
    return { label: "In Stock", color: "bg-green-100 text-green-800" };
  };

  const stockStatus = getStockStatus();

  if (viewMode === "list") {
    return (
      <Link to={`/products/${product.id}`}>
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex gap-6">
              {/* Product Image */}
              <div className="w-32 h-32 bg-metallic-bg rounded-lg flex items-center justify-center flex-shrink-0">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <Package className="h-12 w-12 text-metallic-accent" />
                )}
              </div>

              {/* Product Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-metallic-primary mb-2">
                      {product.name}
                    </h3>
                    <p className="text-metallic-accent text-sm mb-3 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex items-center gap-2 mb-3">
                      <Badge className={stockStatus.color}>
                        {stockStatus.label}
                      </Badge>
                      <span className="text-sm text-metallic-accent">
                        {product.stock_quantity} available
                      </span>
                    </div>
                  </div>

                  <div className="text-right ml-4">
                    <p className="text-2xl font-bold text-metallic-primary">
                      {formatCurrency(product.price)}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between mt-4">
                  <div className="flex gap-2">
                    <Button
                      onClick={handleAddToCart}
                      disabled={isAddingToCart || product.stock_quantity === 0}
                      className="bg-metallic-primary hover:bg-metallic-primary/90"
                    >
                      {isAddingToCart ? (
                        <LoadingSpinner size="sm" />
                      ) : (
                        <>
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Add to Cart
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleToggleWishlist}
                      className={
                        isWishlistedProduct ? "border-red-500 text-red-500" : ""
                      }
                    >
                      <Heart
                        className={`h-4 w-4 ${isWishlistedProduct ? "fill-current" : ""}`}
                      />
                    </Button>
                  </div>

                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  }

  return (
    <Link to={`/products/${product.id}`}>
      <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
        <CardContent className="p-0">
          {/* Product Image */}
          <div className="relative aspect-square bg-metallic-bg rounded-t-lg overflow-hidden">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package className="h-16 w-16 text-metallic-accent" />
              </div>
            )}

            {/* Stock indicator */}
            {product.stock_quantity === 0 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Out of Stock
                </div>
              </div>
            )}

            {/* Wishlist button */}
            <Button
              variant="secondary"
              size="icon"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={handleToggleWishlist}
            >
              <Heart
                className={`h-4 w-4 ${isWishlistedProduct ? "fill-current text-red-500" : ""}`}
              />
            </Button>
          </div>

          {/* Product Info */}
          <div className="p-4">
            <h3 className="font-semibold text-metallic-primary mb-2 line-clamp-1 group-hover:text-metallic-secondary transition-colors">
              {product.name}
            </h3>
            <p className="text-sm text-metallic-accent mb-3 line-clamp-2">
              {product.description}
            </p>

            <div className="flex items-center justify-between mb-3">
              <Badge className={`text-xs ${stockStatus.color}`}>
                {stockStatus.label}
              </Badge>
              <span className="text-xs text-metallic-accent">
                {product.stock_quantity} left
              </span>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-xl font-bold text-metallic-primary">
                {formatCurrency(product.price)}
              </p>
              <Button
                size="sm"
                onClick={handleAddToCart}
                disabled={isAddingToCart || product.stock_quantity === 0}
                className="bg-metallic-primary hover:bg-metallic-primary/90"
              >
                {isAddingToCart ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <ShoppingCart className="h-4 w-4" />
                )}
              </Button>
            </div>

            {/* Low stock warning */}
            {product.stock_quantity > 0 && product.stock_quantity <= 5 && (
              <div className="flex items-center gap-1 mt-2 text-xs text-yellow-600">
                <AlertTriangle className="h-3 w-3" />
                <span>Only {product.stock_quantity} left!</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
