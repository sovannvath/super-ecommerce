const API_BASE_URL = "https://laravel-wtc.onrender.com/api";

// Types for API responses
export interface User {
  id: number;
  name: string;
  email: string;
  role: "customer" | "admin" | "warehouse" | "staff";
  email_verified_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: string | number; // API returns string, we'll handle both
  quantity: number; // Real API uses 'quantity' not 'stock_quantity'
  stock_quantity?: number; // Keep for backward compatibility
  low_stock_threshold?: number;
  image?: string; // Real API uses 'image' not 'image_url'
  image_url?: string; // Keep for backward compatibility
  status?: boolean;
  category_id?: number;
  categories?: Array<{
    id: number;
    name: string;
    description?: string;
    parent_id?: number;
    created_at: string;
    updated_at: string;
    pivot?: any;
  }>;
  is_low_stock?: boolean;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  id: number;
  product_id: number;
  quantity: number;
  product: Product;
}

export interface Order {
  id: number;
  user_id: number;
  total_amount: number;
  status: "pending" | "approved" | "delivered" | "cancelled";
  payment_method: "cash" | "card";
  payment_status: "pending" | "paid" | "failed";
  shipping_address: string;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: number;
  product: Product;
}

export interface Notification {
  id: number;
  user_id: number;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  is_read: boolean;
  created_at: string;
}

export interface RequestOrder {
  id: number;
  product_id: number;
  quantity: number;
  admin_approval: "pending" | "approved" | "rejected";
  warehouse_approval: "pending" | "approved" | "rejected";
  created_at: string;
  updated_at: string;
  product: Product;
}

export interface DashboardStats {
  total_income?: number;
  low_stock_count?: number;
  todays_orders?: number;
  total_orders?: number;
  pending_orders?: number;
  popular_products?: Product[];
  sales_data?: Array<{ date: string; amount: number }>;
}

// API Client class
class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem("auth_token");
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    console.log(`API Request: ${options.method || "GET"} ${url}`);

   const headers: Record<string, string> = {
  "Content-Type": "application/json",
  Accept: "application/json",
  ...(options.headers as Record<string, string>), // cast to allow spreading safely
};


    try {
      const response = await fetch(url, {
        ...options,
        headers,
        mode: "cors", // Explicitly set CORS mode
      });

      console.log(`API Response: ${response.status} ${response.statusText}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API Error Response:`, errorText);

        let error;
        try {
          error = JSON.parse(errorText);
        } catch {
          error = {
            message:
              errorText || `HTTP ${response.status}: ${response.statusText}`,
          };
        }

        throw new Error(error.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      console.log(`API Success:`, data);
      return data;
    } catch (err) {
      console.error(`API Request Failed:`, err);
      throw err;
    }
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem("auth_token", token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem("auth_token");
  }

  // Auth endpoints
  async register(data: {
    name: string;
    email: string;
    password: string;
    role?: string;
  }) {
    return this.request<{ user: User; token: string }>("/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async login(data: { email: string; password: string }) {
    return this.request<{ user: User; token: string }>("/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async logout() {
    return this.request<{ message: string }>("/logout", {
      method: "POST",
    });
  }

  async getUser() {
    return this.request<User>("/user");
  }

  // Product endpoints
  async getProducts(params?: {
    category?: string;
    min_price?: number;
    max_price?: number;
  }) {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) searchParams.append(key, value.toString());
      });
    }
    const query = searchParams.toString() ? `?${searchParams.toString()}` : "";
    const response = await this.request<any>(`/products${query}`);

    console.log("Raw API Response:", response);

    // Handle real API response format: {"products": [...]}
    if (response.products && Array.isArray(response.products)) {
      // Normalize the data structure
      const normalizedProducts = response.products.map((product: any) => ({
        ...product,
        price:
          typeof product.price === "string"
            ? parseFloat(product.price)
            : product.price,
        stock_quantity: product.quantity || product.stock_quantity || 0,
        image_url: product.image || product.image_url,
        category_id: product.categories?.[0]?.id || product.category_id,
      }));
      return { data: normalizedProducts };
    }
    // Handle alternative formats
    else if (Array.isArray(response)) {
      return { data: response };
    } else if (response.data && Array.isArray(response.data)) {
      return response;
    } else {
      console.warn("Unexpected API response format:", response);
      return { data: [] };
    }
  }

  async getProduct(id: number) {
    return this.request<Product>(`/products/${id}`);
  }

  async createProduct(data: Partial<Product>) {
    return this.request<Product>("/products", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateProduct(id: number, data: Partial<Product>) {
    return this.request<Product>(`/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteProduct(id: number) {
    return this.request<{ message: string }>(`/products/${id}`, {
      method: "DELETE",
    });
  }

  async getLowStockProducts() {
    return this.request<{ data: Product[] }>("/products/low-stock");
  }

  // Cart endpoints
  async getCart() {
    return this.request<{ items: CartItem[] }>("/cart");
  }

  async addToCart(data: { product_id: number; quantity: number }) {
    return this.request<{ message: string }>("/cart/add", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateCartItem(id: number, data: { quantity: number }) {
    return this.request<{ message: string }>(`/cart/items/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async removeCartItem(id: number) {
    return this.request<{ message: string }>(`/cart/items/${id}`, {
      method: "DELETE",
    });
  }

  async clearCart() {
    return this.request<{ message: string }>("/cart/clear", {
      method: "DELETE",
    });
  }

  // Order endpoints
  async getOrders() {
    return this.request<{ data: Order[] }>("/orders");
  }

  async createOrder(data: {
    payment_method: string;
    shipping_address: string;
  }) {
    return this.request<Order>("/orders", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getOrder(id: number) {
    return this.request<Order>(`/orders/${id}`);
  }

  async updateOrderStatus(id: number, data: { status: string }) {
    return this.request<Order>(`/orders/${id}/status`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async updateOrderPayment(id: number, data: { payment_status: string }) {
    return this.request<Order>(`/orders/${id}/payment`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async getPaymentMethods() {
    return this.request<{ methods: string[] }>("/payment-methods");
  }

  // Notification endpoints
  async getNotifications() {
    return this.request<{ data: Notification[] }>("/notifications");
  }

  async getUnreadNotifications() {
    return this.request<{ data: Notification[] }>("/notifications/unread");
  }

  async markNotificationRead(id: number) {
    return this.request<{ message: string }>(`/notifications/${id}/read`, {
      method: "PUT",
    });
  }

  async markAllNotificationsRead() {
    return this.request<{ message: string }>("/notifications/read-all", {
      method: "PUT",
    });
  }

  async deleteNotification(id: number) {
    return this.request<{ message: string }>(`/notifications/${id}`, {
      method: "DELETE",
    });
  }

  // Dashboard endpoints
  async getCustomerDashboard() {
    return this.request<DashboardStats>("/dashboard/customer");
  }

  async getAdminDashboard() {
    return this.request<DashboardStats>("/dashboard/admin");
  }

  async getWarehouseDashboard() {
    return this.request<DashboardStats>("/dashboard/warehouse");
  }

  async getStaffDashboard() {
    return this.request<DashboardStats>("/dashboard/staff");
  }

  // Request Order endpoints
  async getRequestOrders() {
    return this.request<{ data: RequestOrder[] }>("/request-orders");
  }

  async createRequestOrder(data: { product_id: number; quantity: number }) {
    return this.request<RequestOrder>("/request-orders", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getRequestOrder(id: number) {
    return this.request<RequestOrder>(`/request-orders/${id}`);
  }

  async approveRequestOrderAdmin(
    id: number,
    data: { approval: "approved" | "rejected" },
  ) {
    return this.request<RequestOrder>(`/request-orders/${id}/admin-approval`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async approveRequestOrderWarehouse(
    id: number,
    data: { approval: "approved" | "rejected" },
  ) {
    return this.request<RequestOrder>(
      `/request-orders/${id}/warehouse-approval`,
      {
        method: "PUT",
        body: JSON.stringify(data),
      },
    );
  }
}

// Export a singleton instance
export const api = new ApiClient(API_BASE_URL);
export default api;
