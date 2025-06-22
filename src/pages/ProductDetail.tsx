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

    if (!displayProduct) return;

    try {
      setIsAddingToCart(true);
      await api.addToCart(displayProduct.id, quantity);
      toast({
        title: "Added to Cart",
        description: `${quantity} ${displayProduct.name}(s) added to your cart`,
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

    if (!displayProduct) return;

    try {
      setIsProcessing(true);
      // Add to cart first
      await api.addToCart(displayProduct.id, quantity);

      toast({
        title: "Proceeding to Checkout",
        description: `${quantity} ${displayProduct.name}(s) added to cart`,
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
      description: `${displayProduct?.name} ${isWishlisted ? "removed from" : "added to"} your wishlist`,
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <LoadingSpinner />
      </div>
    );
  }

  // Use fallback product data if no product is loaded
  const displayProduct = product || {
    id: Number(id),
    name: "Product Preview",
    description:
      "Product details are temporarily unavailable. Please try again or contact support.",
    price: "0.00",
    quantity: 0,
    low_stock_threshold: 5,
    image: "/placeholder.svg",
    status: true,
    created_at: new Date().toISOString(),
  };

  if (!product && !isLoading) {
    // Show fallback UI with buy button
    const fallbackPrice = 99.99; // Default price for demo

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
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <Package className="w-16 h-16 mx-auto mb-4" />
                  <p>Product image unavailable</p>
                </div>
              </div>
            </div>
          </div>

          {/* Product Information */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Product #{id}</h1>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-3xl font-bold text-primary">
                  ${fallbackPrice.toFixed(2)}
                </span>
                <Badge variant="secondary">Demo Mode</Badge>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground leading-relaxed">
                This product is currently unavailable for preview. Please check
                back later or contact support for more information.
              </p>
            </div>

            <Separator />

            {/* Always Show Buy Section */}
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <h3 className="text-xl font-bold text-gray-900">
                    Ready to Purchase?
                  </h3>
                  <p className="text-gray-600">
                    Sign in to proceed with your purchase
                  </p>

                  <div className="space-y-3">
                    {/* Primary Buy Now Button */}
                    <Link to="/auth/login" className="block">
                      <Button
                        size="lg"
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4"
                      >
                        <ShoppingCart className="w-5 h-5 mr-2" />
                        Buy Now - ${fallbackPrice.toFixed(2)}
                      </Button>
                    </Link>

                    {/* Secondary Sign Up Button */}
                    <Link to="/auth/register" className="block">
                      <Button
                        variant="outline"
                        size="lg"
                        className="w-full border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold py-4"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Create Account & Buy
                      </Button>
                    </Link>
                  </div>

                  <div className="flex justify-center gap-4 text-sm">
                    <Link
                      to="/auth/login"
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      Already have an account? Sign in
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  const price =
    typeof displayProduct.price === "string"
      ? parseFloat(displayProduct.price)
      : displayProduct.price;
  const stock = displayProduct.quantity || displayProduct.stock_quantity || 0;
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
            {displayProduct.image || displayProduct.image_url ? (
              <img
                src={displayProduct.image || displayProduct.image_url}
                alt={displayProduct.name}
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
            <h1 className="text-3xl font-bold mb-2">{displayProduct.name}</h1>
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
              {displayProduct.description || "No description available."}
            </p>
          </div>

          {/* Categories */}
          {displayProduct.categories &&
            displayProduct.categories.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {displayProduct.categories.map((category) => (
                    <Badge key={category.id} variant="secondary">
                      {category.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

          <Separator />

          {/* Buy Section - Always visible */}
          {user?.role === "customer" ? (
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
          ) : (
            // Show buy button even for non-authenticated users
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <h3 className="text-xl font-bold text-gray-900">
                    Ready to Purchase?
                  </h3>
                  <p className="text-gray-600">
                    Sign in to add this item to your cart and proceed to
                    checkout
                  </p>

                  <div className="space-y-3">
                    {/* Primary Buy Now Button */}
                    <Link to="/auth/login" className="block">
                      <Button
                        size="lg"
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4"
                      >
                        <ShoppingCart className="w-5 h-5 mr-2" />
                        Buy Now - ${(price * 1).toFixed(2)}
                      </Button>
                    </Link>

                    {/* Secondary Sign Up Button */}
                    <Link to="/auth/register" className="block">
                      <Button
                        variant="outline"
                        size="lg"
                        className="w-full border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold py-4"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Create Account & Buy
                      </Button>
                    </Link>
                  </div>

                  <div className="flex justify-center gap-4 text-sm">
                    <Link
                      to="/auth/login"
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      Already have an account? Sign in
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
                <span>{displayProduct.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Stock:</span>
                <span>{stock} units</span>
              </div>
              {displayProduct.low_stock_threshold && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Low Stock Threshold:
                  </span>
                  <span>{displayProduct.low_stock_threshold} units</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <Badge
                  variant={displayProduct.status ? "default" : "secondary"}
                >
                  {displayProduct.status ? "Active" : "Inactive"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
