# Laravel API Integration

This document describes the integration with the Laravel API at `https://laravel-wtc.onrender.com/api`.

## Features

✅ **Complete API Service Layer** - Type-safe TypeScript integration
✅ **Authentication System** - Login, register, logout, and token management
✅ **Product Management** - CRUD operations for products
✅ **Order Management** - Order creation, tracking, and status updates
✅ **Cart Functionality** - Shopping cart operations
✅ **Request Orders** - Supply chain request management
✅ **Notifications** - User notification system
✅ **Dashboard Analytics** - Statistics and insights
✅ **Error Handling** - Comprehensive error management with user feedback
✅ **Loading States** - Smooth UX with loading indicators
✅ **Search & Filtering** - Real-time product search with debouncing

## Files Created

### Core API Service

- `src/lib/api.ts` - Main API service with all endpoints
- `src/lib/utils.ts` - Utility functions including className merger

### Components

- `src/components/LaravelApiDemo.tsx` - Comprehensive demo component
- `src/components/MyComponent.tsx` - Simple integration example

### Integration

- Updated `src/App.tsx` to include demo route at `/api-demo`

## Usage Examples

### Basic Product Fetching

```typescript
import { api } from "@/lib/api";

// Fetch all products
const response = await api.getProducts();
console.log(response.data); // Product[]

// Search products
const searchResults = await api.getProducts({
  search: "headphones",
  per_page: 10,
});
```

### Authentication

```typescript
// Login
const authResponse = await api.login({
  email: "user@example.com",
  password: "password",
});

// Register
const newUser = await api.register({
  name: "John Doe",
  email: "john@example.com",
  password: "password123",
  role: "customer",
});

// Get current user
const user = await api.getUser();
```

### Error Handling

```typescript
try {
  const products = await api.getProducts();
  setProducts(products.data);
} catch (error) {
  console.error("Failed to fetch products:", error.message);
  // Show user-friendly error message
}
```

## Available API Endpoints

### Authentication

- `POST /api/login` - User login
- `POST /api/register` - User registration
- `POST /api/logout` - User logout
- `GET /api/user` - Get current user (authenticated)

### Products

- `GET /api/products` - List products with search/pagination
- `GET /api/products/{id}` - Get single product
- `POST /api/products` - Create product (admin)
- `PUT /api/products/{id}` - Update product (admin)
- `DELETE /api/products/{id}` - Delete product (admin)

### Orders

- `GET /api/orders` - List user orders
- `GET /api/orders/{id}` - Get order details
- `POST /api/orders` - Create new order
- `PUT /api/orders/{id}/status` - Update order status

### Cart

- `GET /api/cart` - Get cart items
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/{id}` - Update cart item
- `DELETE /api/cart/{id}` - Remove cart item
- `DELETE /api/cart` - Clear cart

### Request Orders

- `GET /api/request-orders` - List request orders
- `POST /api/request-orders` - Create request order
- `PUT /api/request-orders/{id}` - Update request order

### Notifications

- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/{id}/read` - Mark notification as read
- `PUT /api/notifications/read-all` - Mark all as read

### Dashboard

- `GET /api/dashboard/stats` - Get dashboard statistics

## Type Definitions

The integration includes comprehensive TypeScript types for all API responses:

```typescript
interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  quantity: number;
  low_stock_threshold: number;
  image: string;
  status: boolean;
  created_at: string;
  updated_at?: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: "customer" | "admin" | "warehouse" | "staff";
  email_verified_at?: string;
  created_at: string;
  updated_at: string;
}

// ... and many more
```

## Component Integration

### Using the Demo Component

Visit `/api-demo` to see the full integration in action, or use the simple component:

```typescript
import MyComponent from "@/components/MyComponent";

function App() {
  return <MyComponent />;
}
```

### Custom Integration

```typescript
import { useEffect, useState } from "react";
import { api, type Product } from "@/lib/api";

function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getProducts()
      .then(response => setProducts(response.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {products.map(product => (
        <div key={product.id}>{product.name}</div>
      ))}
    </div>
  );
}
```

## Configuration

The API base URL is configured in `src/lib/api.ts`:

```typescript
const API_BASE_URL = "https://laravel-wtc.onrender.com/api";
```

To change the API endpoint, update this constant.

## Authentication Flow

1. **Login/Register** - User provides credentials
2. **Token Storage** - JWT token stored in localStorage
3. **Auto-Injection** - Token automatically added to all authenticated requests
4. **Auto-Logout** - Invalid tokens automatically cleared

## Error Handling

The integration includes comprehensive error handling:

- **Network Errors** - Connection issues
- **HTTP Errors** - 400, 401, 403, 404, 500 responses
- **Validation Errors** - Laravel validation error formatting
- **Authentication Errors** - Token expiration handling

## Testing

The project includes unit tests for utility functions. Run tests with:

```bash
npm test
```

## API Validation

Use the API validation tool to test all endpoints:

```bash
# Visit the validation page
/api-validation
```

This comprehensive tool tests all Laravel API endpoints and shows:

- ✅ Endpoint status (working/failing)
- 🔐 Authentication requirements
- 📊 Response data
- ❌ Error messages
- 📈 Success/failure statistics

## Current Status

**✅ WORKING ENDPOINTS:**

- `GET /api/products` - Product listing
- `GET /api/products/{id}` - Single product
- `POST /api/register` - User registration (with password_confirmation)
- `POST /api/login` - User authentication

**🔐 PROTECTED ENDPOINTS READY:**

- Cart operations (`/api/cart/*`)
- Order management (`/api/orders/*`)
- Notifications (`/api/notifications/*`)
- Dashboard endpoints (`/api/dashboard/*`)
- Request orders (`/api/request-orders/*`)
- Product management (admin)

## Next Steps

1. **API Validation** - Use `/api-validation` to test all endpoints
2. **Authentication Testing** - Test protected routes with valid tokens
3. **Role-based Access** - Implement role-specific route protection
4. **Error Handling** - Enhanced error messaging
5. **Caching** - Implement React Query for better caching
6. **Real-time Updates** - Integrate WebSocket for live updates

## Troubleshooting

### Common Issues

1. **CORS Errors** - Ensure Laravel API has proper CORS configuration
2. **Token Issues** - Check localStorage for auth_token
3. **Network Errors** - Verify API URL is accessible
4. **Type Errors** - Ensure TypeScript types match API responses

### Debug Tips

```typescript
// Enable API debugging
console.log("API Request:", endpoint, options);
console.log("API Response:", response);
```

For more help, check the demo component at `/api-demo` for working examples.
