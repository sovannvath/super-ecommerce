import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { api, type Product } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { ProductCard } from "@/components/customer/ProductCard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Search,
  Filter,
  Grid3X3,
  List,
  Package,
  SlidersHorizontal,
} from "lucide-react";

export default function ProductCatalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchParams, setSearchParams] = useSearchParams();
  const [isOffline, setIsOffline] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    // Initialize filters from URL params
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const minPrice = searchParams.get("min_price");
    const maxPrice = searchParams.get("max_price");

    if (category) setSelectedCategory(category);
    if (search) setSearchQuery(search);
    if (minPrice) setPriceRange((prev) => ({ ...prev, min: minPrice }));
    if (maxPrice) setPriceRange((prev) => ({ ...prev, max: maxPrice }));
  }, [searchParams]);

  useEffect(() => {
    filterProducts();
  }, [products, searchQuery, priceRange, selectedCategory, sortBy]);

  const loadProducts = async () => {
    console.log("Loading demo products...");

    // Load demo data immediately for reliable demo experience
    const mockProducts = [
      {
        id: 1,
        name: "Wireless Bluetooth Headphones",
        description:
          "Premium quality wireless headphones with noise cancellation and 30-hour battery life.",
        price: 129.99,
        stock_quantity: 15,
        category_id: 1,
        image_url: "",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 2,
        name: "Smart Fitness Watch",
        description:
          "Track your health and fitness with this advanced smartwatch featuring GPS and heart rate monitoring.",
        price: 249.99,
        stock_quantity: 8,
        category_id: 2,
        image_url: "",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 3,
        name: "Portable Phone Charger",
        description:
          "Compact 10,000mAh power bank with fast charging capabilities for all your devices.",
        price: 39.99,
        stock_quantity: 2,
        category_id: 1,
        image_url: "",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 4,
        name: "LED Desk Lamp",
        description:
          "Adjustable LED desk lamp with multiple brightness levels and USB charging port.",
        price: 59.99,
        stock_quantity: 12,
        category_id: 3,
        image_url: "",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 5,
        name: "Mechanical Gaming Keyboard",
        description:
          "RGB backlit mechanical keyboard with blue switches, perfect for gaming and typing.",
        price: 89.99,
        stock_quantity: 6,
        category_id: 2,
        image_url: "",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 6,
        name: "Wireless Mouse",
        description:
          "Ergonomic wireless mouse with precision tracking and long battery life.",
        price: 34.99,
        stock_quantity: 20,
        category_id: 2,
        image_url: "",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 7,
        name: "4K Webcam",
        description:
          "Professional 4K webcam with auto-focus and built-in microphone for video calls.",
        price: 149.99,
        stock_quantity: 7,
        category_id: 3,
        image_url: "",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 8,
        name: "Wireless Earbuds",
        description:
          "True wireless earbuds with active noise cancellation and premium sound quality.",
        price: 99.99,
        stock_quantity: 25,
        category_id: 1,
        image_url: "",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];

    setProducts(mockProducts);
    setIsOffline(true);
    setIsLoading(false);

    console.log(`✅ Loaded ${mockProducts.length} demo products successfully`);
  };

  const tryConnectToAPI = async () => {
    setIsLoading(true);
    try {
      console.log("🔄 Attempting to connect to real API...");
      const response = await api.getProducts();
      if (response && response.data) {
        setProducts(response.data);
        setIsOffline(false);
        console.log(
          `✅ Successfully loaded ${response.data.length} real products`,
        );
        toast({
          title: "✅ Connected to API",
          description: `Successfully loaded ${response.data.length} products from server`,
        });
      }
    } catch (error) {
      console.log("❌ API connection failed");
      toast({
        title: "Connection Failed",
        description:
          "Unable to connect to the server. Demo mode will continue.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterProducts = () => {
    if (!products || !Array.isArray(products)) {
      setFilteredProducts([]);
      return;
    }
    let filtered = [...products];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Category filter
    if (selectedCategory && selectedCategory !== "all") {
      filtered = filtered.filter(
        (product) => product.category_id?.toString() === selectedCategory,
      );
    }

    // Price range filter
    if (priceRange.min) {
      filtered = filtered.filter(
        (product) => product.price >= parseFloat(priceRange.min),
      );
    }
    if (priceRange.max) {
      filtered = filtered.filter(
        (product) => product.price <= parseFloat(priceRange.max),
      );
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price_low":
          return a.price - b.price;
        case "price_high":
          return b.price - a.price;
        case "name":
          return a.name.localeCompare(b.name);
        case "stock":
          return b.stock_quantity - a.stock_quantity;
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setPriceRange({ min: "", max: "" });
    setSelectedCategory("all");
    setSortBy("name");
    setSearchParams({});
  };

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (selectedCategory) params.set("category", selectedCategory);
    if (priceRange.min) params.set("min_price", priceRange.min);
    if (priceRange.max) params.set("max_price", priceRange.max);
    setSearchParams(params);
  };

  const getUniqueCategories = () => {
    if (!products || products.length === 0) return [];
    const categories = products
      .map((p) => p.category_id)
      .filter((id, index, arr) => id && arr.indexOf(id) === index);
    return categories;
  };

  const activeFiltersCount = [
    searchQuery,
    selectedCategory,
    priceRange.min,
    priceRange.max,
  ].filter(Boolean).length;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-metallic-bg via-metallic-light/20 to-metallic-accent/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-metallic-primary mb-2">
                Product Catalog
              </h1>
              <p className="text-metallic-accent">
                Discover our wide range of products
              </p>
            </div>

            {isOffline && (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-2 bg-yellow-100 text-yellow-800 rounded-lg">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm font-medium">Demo Mode</span>
                </div>
                <Button
                  onClick={tryConnectToAPI}
                  variant="outline"
                  className="border-metallic-primary text-metallic-primary"
                  disabled={isLoading}
                >
                  {isLoading ? "Connecting..." : "Connect to API"}
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-metallic-accent" />
                  <Input
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Quick filters */}
              <div className="flex gap-2">
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {getUniqueCategories()
                      .filter(
                        (categoryId) =>
                          categoryId !== null && categoryId !== undefined,
                      )
                      .map((categoryId) => (
                        <SelectItem
                          key={categoryId}
                          value={categoryId!.toString()}
                        >
                          Category {categoryId}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name A-Z</SelectItem>
                    <SelectItem value="price_low">
                      Price: Low to High
                    </SelectItem>
                    <SelectItem value="price_high">
                      Price: High to Low
                    </SelectItem>
                    <SelectItem value="stock">Stock Level</SelectItem>
                  </SelectContent>
                </Select>

                {/* Advanced Filters */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="relative">
                      <SlidersHorizontal className="h-4 w-4 mr-2" />
                      Filters
                      {activeFiltersCount > 0 && (
                        <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-metallic-primary">
                          {activeFiltersCount}
                        </Badge>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>Advanced Filters</SheetTitle>
                    </SheetHeader>
                    <div className="space-y-6 mt-6">
                      <div className="space-y-2">
                        <Label>Price Range</Label>
                        <div className="flex gap-2">
                          <Input
                            placeholder="Min"
                            value={priceRange.min}
                            onChange={(e) =>
                              setPriceRange((prev) => ({
                                ...prev,
                                min: e.target.value,
                              }))
                            }
                            type="number"
                          />
                          <Input
                            placeholder="Max"
                            value={priceRange.max}
                            onChange={(e) =>
                              setPriceRange((prev) => ({
                                ...prev,
                                max: e.target.value,
                              }))
                            }
                            type="number"
                          />
                        </div>
                      </div>

                      <Separator />

                      <div className="flex gap-2">
                        <Button onClick={applyFilters} className="flex-1">
                          Apply Filters
                        </Button>
                        <Button
                          variant="outline"
                          onClick={clearFilters}
                          className="flex-1"
                        >
                          Clear All
                        </Button>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>

                {/* View Mode Toggle */}
                <div className="flex border rounded-lg">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="icon"
                    onClick={() => setViewMode("grid")}
                    className="rounded-r-none"
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="icon"
                    onClick={() => setViewMode("list")}
                    className="rounded-l-none"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Active Filters Display */}
            {activeFiltersCount > 0 && (
              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
                {searchQuery && (
                  <Badge variant="secondary" className="gap-1">
                    Search: {searchQuery}
                    <button
                      onClick={() => setSearchQuery("")}
                      className="ml-1 hover:bg-black/20 rounded-full p-0.5"
                    >
                      ×
                    </button>
                  </Badge>
                )}
                {selectedCategory && selectedCategory !== "all" && (
                  <Badge variant="secondary" className="gap-1">
                    Category: {selectedCategory}
                    <button
                      onClick={() => setSelectedCategory("all")}
                      className="ml-1 hover:bg-black/20 rounded-full p-0.5"
                    >
                      ×
                    </button>
                  </Badge>
                )}
                {(priceRange.min || priceRange.max) && (
                  <Badge variant="secondary" className="gap-1">
                    Price: ${priceRange.min || "0"} - ${priceRange.max || "∞"}
                    <button
                      onClick={() => setPriceRange({ min: "", max: "" })}
                      className="ml-1 hover:bg-black/20 rounded-full p-0.5"
                    >
                      ×
                    </button>
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="h-6 text-xs"
                >
                  Clear All
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-metallic-accent">
            {filteredProducts.length} products found
          </p>
        </div>

        {/* Products Grid/List */}
        {filteredProducts.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Package className="h-16 w-16 mx-auto mb-4 text-metallic-accent opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No products found</h3>
              <p className="text-metallic-accent mb-4">
                Try adjusting your search criteria or filters
              </p>
              <Button onClick={clearFilters} variant="outline">
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "space-y-4"
            }
          >
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                viewMode={viewMode}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
