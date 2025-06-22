import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, type CartItem } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { CreditCard, Banknote, MapPin, ShoppingBag } from "lucide-react";

export default function Checkout() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  // Form state
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [shippingAddress, setShippingAddress] = useState("");

  useEffect(() => {
    loadCheckoutData();
  }, []);

  const loadCheckoutData = async () => {
    try {
      setIsLoading(true);
      const [cartResponse, paymentMethodsResponse] = await Promise.all([
        api.getCart(),
        api.getPaymentMethods(),
      ]);

      setCartItems(cartResponse.items || []);
      setPaymentMethods(paymentMethodsResponse.methods || ["cash", "card"]);

      if (cartResponse.items?.length === 0) {
        toast({
          title: "Cart is Empty",
          description: "Please add items to your cart before checkout",
          variant: "destructive",
        });
        navigate("/customer/cart");
      }
    } catch (error) {
      console.error("Error loading checkout data:", error);
      toast({
        title: "Error",
        description: "Failed to load checkout information",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const price =
        typeof item.product.price === "string"
          ? parseFloat(item.product.price)
          : item.product.price;
      return total + price * item.quantity;
    }, 0);
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!shippingAddress.trim()) {
      toast({
        title: "Address Required",
        description: "Please enter your shipping address",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsProcessing(true);

      // Create order with cart items
      const orderItems = cartItems.map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity,
      }));

      const order = await api.createOrder({
        items: orderItems,
        payment_method: paymentMethod,
        shipping_address: shippingAddress,
        billing_address: shippingAddress,
      });

      toast({
        title: "Order Placed Successfully!",
        description: `Your order #${order.id} has been placed and is being processed.`,
      });

      // Clear cart and redirect to orders
      navigate("/customer/orders");
    } catch (error) {
      console.error("Error creating order:", error);
      toast({
        title: "Order Failed",
        description: "Failed to place your order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Checkout</h1>
        <p className="text-muted-foreground">Complete your order</p>
      </div>

      <form onSubmit={handleSubmitOrder}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="address">Full Address *</Label>
                  <Textarea
                    id="address"
                    placeholder="Enter your complete shipping address..."
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    required
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={paymentMethod}
                  onValueChange={setPaymentMethod}
                >
                  {paymentMethods.map((method) => (
                    <div
                      key={method}
                      className="flex items-center space-x-2 p-4 border rounded-lg"
                    >
                      <RadioGroupItem value={method} id={method} />
                      <Label
                        htmlFor={method}
                        className="flex items-center gap-2 flex-1 cursor-pointer"
                      >
                        {method === "cash" ? (
                          <>
                            <Banknote className="w-5 h-5" />
                            Cash on Delivery
                          </>
                        ) : (
                          <>
                            <CreditCard className="w-5 h-5" />
                            Credit/Debit Card
                          </>
                        )}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Order Items Review */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5" />
                  Order Items ({cartItems.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cartItems.map((item) => {
                  const price =
                    typeof item.product.price === "string"
                      ? parseFloat(item.product.price)
                      : item.product.price;

                  return (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 p-4 border rounded-lg"
                    >
                      <div className="w-16 h-16 rounded border bg-muted overflow-hidden">
                        {item.product.image || item.product.image_url ? (
                          <img
                            src={item.product.image || item.product.image_url}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                            No image
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">{item.product.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          ${(price * item.quantity).toFixed(2)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          ${price.toFixed(2)} each
                        </p>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${calculateTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span>Free</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax:</span>
                    <span>$0.00</span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span>${calculateTotal().toFixed(2)}</span>
                </div>

                <div className="space-y-2">
                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={isProcessing || !shippingAddress.trim()}
                  >
                    {isProcessing ? "Processing..." : "Place Order"}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => navigate("/customer/cart")}
                    disabled={isProcessing}
                  >
                    Back to Cart
                  </Button>
                </div>

                <div className="text-xs text-muted-foreground space-y-1">
                  <p>• Secure checkout</p>
                  <p>• Free shipping on all orders</p>
                  <p>• 30-day return policy</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
