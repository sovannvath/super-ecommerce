import React, { useEffect, useState } from "react";
import { api, type Product } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, ExternalLink } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function MyComponent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.getProducts();
        setProducts(response.data.slice(0, 3)); // Show first 3 products
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (isLoading) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2">Loading products from Laravel API...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-red-600">
              <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">Connection Error</h3>
              <p>{error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Laravel API Integration
          </CardTitle>
          <p className="text-sm text-gray-600">
            Successfully connected to{" "}
            <code className="bg-gray-100 px-1 rounded">
              https://laravel-wtc.onrender.com/api
            </code>
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Featured Products</h3>
            <Badge variant="outline">{products.length} items</Badge>
          </div>

          <div className="grid gap-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-16 h-16 object-cover rounded"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.svg";
                  }}
                />
                <div className="flex-1">
                  <h4 className="font-medium">{product.name}</h4>
                  <p className="text-sm text-gray-600 line-clamp-1">
                    {product.description}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-semibold text-green-600">
                      {formatCurrency(product.price)}
                    </span>
                    <Badge
                      variant={product.status ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {product.status ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">Stock</div>
                  <div className="font-medium">{product.quantity}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t">
            <Button variant="outline" className="w-full" asChild>
              <a href="/api-demo" className="flex items-center gap-2">
                <ExternalLink className="h-4 w-4" />
                View Full API Demo
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
