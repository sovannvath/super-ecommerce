import React, { useEffect, useState } from "react";
import { api, type Product } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Package, Search, RefreshCw } from "lucide-react";
import { cn, formatCurrency, debounce } from "@/lib/utils";

export default function LaravelApiDemo() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Debounced search function
  const debouncedSearch = debounce(async (search: string) => {
    await loadProducts(search);
  }, 500);

  const loadProducts = async (search?: string) => {
    try {
      setError(null);
      const response = await api.getProducts({
        search: search || undefined,
        per_page: 20,
      });
      setProducts(response.data);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to load products from Laravel API";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadProducts(searchTerm);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    if (value.trim()) {
      debouncedSearch(value);
    } else {
      loadProducts();
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const ProductCard = ({ product }: { product: Product }) => (
    <Card className="hover:shadow-lg transition-all duration-200">
      <CardContent className="p-4">
        <div className="aspect-square bg-gray-100 rounded-lg mb-4 overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = "/placeholder.svg";
            }}
          />
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold text-lg line-clamp-2">{product.name}</h3>

          <p className="text-gray-600 text-sm line-clamp-2">
            {product.description}
          </p>

          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-green-600">
              {formatCurrency(product.price)}
            </span>
            <Badge
              variant={product.status ? "default" : "secondary"}
              className={cn(
                product.status
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-800",
              )}
            >
              {product.status ? "Active" : "Inactive"}
            </Badge>
          </div>

          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>Stock: {product.quantity}</span>
            <span
              className={cn(
                "font-medium",
                product.quantity <= product.low_stock_threshold
                  ? "text-red-600"
                  : "text-green-600",
              )}
            >
              {product.quantity <= product.low_stock_threshold
                ? "Low Stock"
                : "In Stock"}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const LoadingSkeleton = () => (
    <Card>
      <CardContent className="p-4">
        <Skeleton className="aspect-square rounded-lg mb-4" />
        <Skeleton className="h-6 mb-2" />
        <Skeleton className="h-4 mb-2" />
        <div className="flex justify-between">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-16" />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Package className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold">Laravel API Integration</h1>
        </div>
        <p className="text-gray-600">
          Demonstrating integration with Laravel API at{" "}
          <code className="bg-gray-100 px-2 py-1 rounded text-sm">
            https://laravel-wtc.onrender.com/api
          </code>
        </p>
      </div>

      {/* Search and Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          onClick={handleRefresh}
          disabled={isRefreshing}
          variant="outline"
          className="shrink-0"
        >
          <RefreshCw
            className={cn("h-4 w-4 mr-2", isRefreshing && "animate-spin")}
          />
          Refresh
        </Button>
      </div>

      {/* API Status */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div
              className={cn(
                "w-3 h-3 rounded-full",
                error ? "bg-red-500" : "bg-green-500",
              )}
            />
            API Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium">Endpoint:</span>{" "}
              <code className="bg-gray-100 px-2 py-1 rounded">
                GET /api/products
              </code>
            </div>
            <div>
              <span className="font-medium">Status:</span>{" "}
              <Badge variant={error ? "destructive" : "default"}>
                {error ? "Error" : "Connected"}
              </Badge>
            </div>
            {error && (
              <div className="flex items-start gap-2 text-red-600">
                <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <LoadingSkeleton key={index} />
          ))}
        </div>
      ) : error ? (
        <Card className="text-center py-12">
          <CardContent>
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              Failed to load products
            </h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={handleRefresh} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      ) : products.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No products found</h3>
            <p className="text-gray-600">
              {searchTerm
                ? `No products match "${searchTerm}"`
                : "No products available"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">
              Products ({products.length})
            </h2>
            {searchTerm && (
              <Badge variant="outline">Filtered by: "{searchTerm}"</Badge>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </>
      )}

      {/* API Integration Info */}
      <Card className="mt-12">
        <CardHeader>
          <CardTitle>Integration Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">Features Demonstrated:</h4>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                <li>Fetching data from Laravel API</li>
                <li>Error handling and user feedback</li>
                <li>Loading states and skeletons</li>
                <li>Search functionality with debouncing</li>
                <li>Real-time API status monitoring</li>
                <li>Responsive grid layout</li>
                <li>Type-safe API integration</li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-2">Available API Endpoints:</h4>
              <div className="space-y-1 font-mono text-xs">
                <div>GET /api/products</div>
                <div>POST /api/register</div>
                <div>POST /api/login</div>
                <div>GET /api/user (authenticated)</div>
                <div>... and more</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
