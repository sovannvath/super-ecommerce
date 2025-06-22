import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { api, type Product } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { ArrowLeft, ShoppingCart, Heart, Plus } from "lucide-react";
import { getMockProduct } from "@/data/mockData";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (id) {
      loadProduct();
    }
  }, [id]);

  const loadProduct = async () => {
    try {
      setIsLoading(true);
      const productData = await api.getProduct(Number(id));
      setProduct(productData);
    } catch (error) {
      console.error("Error loading product:", error);

      // More specific error handling
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";

      // Try to use mock data as fallback
      const mockProduct = getMockProduct(Number(id));
      if (mockProduct) {
        setProduct(mockProduct);
        toast({
          title: "Offline Mode",
          description:
            "Showing sample product data. Some features may be limited.",
          variant: "default",
        });
      } else {
        if (errorMessage.includes("Server is temporarily unavailable")) {
          toast({
            title: "Server Unavailable",
            description:
              "The product catalog is temporarily unavailable. Please try again later.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Product Not Found",
            description:
              "This product is not available. Please try another product.",
            variant: "destructive",
          });
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please login to add items to cart",
        variant: "destructive",
      });
      return;
    }

    if (!product) return;

    try {
      setIsAddingToCart(true);
      await api.addToCart(product.id, quantity);
      toast({
        title: "Added to Cart",
        description: `${quantity} ${product.name}(s) added to your cart`,
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      });
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please login to make a purchase",
        variant: "destructive",
      });
      return;
    }

    if (!product) return;

    try {
      setIsProcessing(true);
      // Add to cart first
      await api.addToCart(product.id, quantity);

      toast({
        title: "Proceeding to Checkout",
        description: `${quantity} ${product.name}(s) added to cart`,
      });

      // Navigate to checkout
      navigate("/customer/checkout");
    } catch (error) {
      console.error("Error processing purchase:", error);
      toast({
        title: "Error",
        description: "Failed to process purchase. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast({
      title: isWishlisted ? "Removed from Wishlist" : "Added to Wishlist",
      description: `${product?.name} ${isWishlisted ? "removed from" : "added to"} your wishlist`,
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
            <p className="text-muted-foreground mb-6">
              The product you're looking for doesn't exist.
            </p>
            <Link to="/products">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Products
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const price =
    typeof product.price === "string"
      ? parseFloat(product.price)
      : product.price;
  const stock = product.quantity || product.stock_quantity || 0;
  const isInStock = stock > 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/products">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="space-y-4">
          <div className="aspect-square rounded-lg border bg-muted overflow-hidden">
            {product.image || product.image_url ? (
              <img
                src={product.image || product.image_url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                No image available
              </div>
            )}
          </div>
        </div>

        {/* Product Information */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-3xl font-bold text-primary">
                ${price.toFixed(2)}
              </span>
              <Badge variant={isInStock ? "default" : "destructive"}>
                {isInStock ? `${stock} in stock` : "Out of stock"}
              </Badge>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-muted-foreground leading-relaxed">
              {product.description || "No description available."}
            </p>
          </div>

          {/* Categories */}
          {product.categories && product.categories.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Categories</h3>
              <div className="flex flex-wrap gap-2">
                {product.categories.map((category) => (
                  <Badge key={category.id} variant="secondary">
                    {category.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <Separator />

          {/* Add to Cart */}
          {user?.role === "customer" && (
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <Label htmlFor="quantity">Quantity</Label>
                      <Input
                        id="quantity"
                        type="number"
                        min="1"
                        max={stock}
                        value={quantity}
                        onChange={(e) =>
                          setQuantity(
                            Math.max(1, parseInt(e.target.value) || 1),
                          )
                        }
                        disabled={!isInStock}
                      />
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={toggleWishlist}
                      className={isWishlisted ? "text-red-500" : ""}
                    >
                      <Heart
                        className={`w-4 h-4 ${isWishlisted ? "fill-current" : ""}`}
                      />
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {/* Primary Buy Now Button */}
                    <Button
                      onClick={handleBuyNow}
                      disabled={!isInStock || isProcessing}
                      size="lg"
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4"
                    >
                      {isProcessing ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-5 h-5 mr-2" />
                          Buy Now - ${(price * quantity).toFixed(2)}
                        </>
                      )}
                    </Button>

                    {/* Secondary Add to Cart Button */}
                    <Button
                      onClick={handleAddToCart}
                      disabled={!isInStock || isAddingToCart}
                      variant="outline"
                      size="lg"
                      className="w-full border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold py-4"
                    >
                      {isAddingToCart ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                          Adding...
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4 mr-2" />
                          Add to Cart
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="flex justify-center gap-4 text-sm">
                    <Link
                      to="/customer/cart"
                      className="text-blue-600 hover:text-blue-800 underline flex items-center"
                    >
                      <ShoppingCart className="w-4 h-4 mr-1" />
                      View Cart
                    </Link>
                    <span className="text-gray-400">•</span>
                    <Link
                      to="/products"
                      className="text-gray-600 hover:text-gray-800 underline"
                    >
                      Continue Shopping
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Product Details */}
          <Card>
            <CardHeader>
              <CardTitle>Product Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Product ID:</span>
                <span>{product.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Stock:</span>
                <span>{stock} units</span>
              </div>
              {product.low_stock_threshold && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Low Stock Threshold:
                  </span>
                  <span>{product.low_stock_threshold} units</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <Badge variant={product.status ? "default" : "secondary"}>
                  {product.status ? "Active" : "Inactive"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
