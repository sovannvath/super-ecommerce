# ShopSync - E-commerce & Supply Chain System

## 🎨 Theme & Design

The application uses a **Metallic Chic** color scheme:

- Primary: `#3D52A0` (Deep blue)
- Secondary: `#7091E6` (Medium blue)
- Accent: `#8697C4` (Light blue)
- Light: `#ADBBDA` (Very light blue)
- Background: `#EDE8F5` (Light lavender)

## 🚀 Features Overview

### 🔐 Authentication System

- **Login/Register** with role-based access
- **Multi-role support**: Customer, Admin, Warehouse Manager, Staff
- **Protected routes** with automatic redirection
- **JWT token-based authentication**

### 🛒 Customer Features

- **Product Catalog** with advanced filtering and search
- **Shopping Cart** with quantity management
- **Order Tracking** (Pending → Approved → Delivered)
- **Customer Dashboard** with order history
- **Responsive product cards** with wishlist functionality

### 🛠 Admin Features

- **Comprehensive Dashboard** with:
  - Revenue analytics and sales charts
  - Low stock alerts with notifications
  - Popular products tracking
  - Real-time statistics
- **Product Management**:
  - Full CRUD operations
  - Stock quantity monitoring
  - Bulk operations
  - Image upload support
- **Order Management** with filtering and status updates
- **Low Stock Alerts** with automated notifications

### 📦 Warehouse Manager Features

- **Stock Request Management**:
  - Approve/reject stock requests
  - Real-time status tracking
  - Confirmation dialogs for actions
- **Dashboard** with pending request analytics
- **Inventory oversight** and approval workflows

### 🚚 Staff Features

- **Order Processing Dashboard**:
  - Approve customer orders
  - Mark orders as delivered
  - Order filtering and search
- **Delivery Management** with status tracking
- **Customer service** order details view

## 🔗 API Integration

The system integrates with a Laravel backend at `https://laravel-wtc.onrender.com/api/` with the following endpoints:

### Authentication

- `POST /register` - User registration
- `POST /login` - User login
- `POST /logout` - User logout
- `GET /user` - Get current user

### Products

- `GET /products` - List products with filtering
- `GET /products/{id}` - Get product details
- `POST /products` - Create product (Admin)
- `PUT /products/{id}` - Update product (Admin)
- `DELETE /products/{id}` - Delete product (Admin)
- Note: Low stock products are available through dashboard stats endpoints

### Cart & Orders

- `GET /cart` - Get cart items
- `POST /cart/add` - Add item to cart
- `PUT /cart/items/{id}` - Update cart item
- `DELETE /cart/items/{id}` - Remove cart item
- `GET /orders` - List user orders
- `POST /orders` - Create new order
- `PUT /orders/{id}/status` - Update order status

### Notifications

- `GET /notifications` - Get user notifications
- `PUT /notifications/{id}/read` - Mark as read
- `PUT /notifications/read-all` - Mark all as read

### Dashboards

- `GET /dashboard/customer` - Customer analytics
- `GET /dashboard/admin` - Admin analytics
- `GET /dashboard/warehouse` - Warehouse analytics
- `GET /dashboard/staff` - Staff analytics

## 🛡 Role-Based Access Control

### Customer (`role: "customer"`)

- Access to product catalog and cart
- Can place and track orders
- Personal dashboard with order history
- Profile and address management

### Admin (`role: "admin"`)

- Full product management capabilities
- Order oversight and management
- User management and analytics
- System-wide statistics and reports
- Low stock monitoring and alerts

### Warehouse Manager (`role: "warehouse"`)

- Stock request approval/rejection
- Inventory management oversight
- Warehouse analytics dashboard
- Supply chain coordination

### Staff (`role: "staff"`)

- Order approval and processing
- Delivery status management
- Customer service functions
- Order tracking and updates

## 📱 Responsive Design

The system is fully responsive with:

- **Mobile-first** design approach
- **Tablet and desktop** optimizations
- **Touch-friendly** interfaces
- **Adaptive navigation** with mobile menu

## 🎯 Key Components

### Shared Components

- `Navbar` - Role-based navigation
- `NotificationPanel` - Real-time notifications
- `LoadingSpinner` - Loading states
- `ProtectedRoute` - Route protection

### Customer Components

- `ProductCard` - Product display with actions
- `CustomerDashboard` - Personal overview

### Admin Components

- `StatsCard` - Dashboard statistics
- `SalesChart` - Analytics visualization
- `ProductManagement` - CRUD interface

### Form Components

- `Login/Register` - Authentication forms
- Clean error handling and validation
- Responsive design with proper UX

## 🔄 Real-time Features

- **Live notifications** for order updates
- **Real-time stock** level monitoring
- **Instant cart updates** and synchronization
- **Dynamic dashboards** with live data

## 🎨 UI/UX Features

- **Smooth animations** and transitions
- **Modal dialogs** for confirmations
- **Toast notifications** for user feedback
- **Loading indicators** for async operations
- **Error handling** with user-friendly messages
- **Search and filtering** across all data

## 📈 Analytics & Reporting

### Admin Analytics

- Sales revenue tracking
- Popular product analysis
- Order volume metrics
- Low stock alerts

### Customer Analytics

- Order history and tracking
- Spending analysis
- Purchase patterns

### Warehouse Analytics

- Request processing metrics
- Approval workflow tracking
- Inventory turnover

### Staff Analytics

- Order processing statistics
- Delivery performance metrics
- Customer service metrics

## 🔧 Technical Architecture

### Frontend Stack

- **React 18** with TypeScript
- **Vite** for fast development
- **TailwindCSS** for styling
- **React Router 6** for navigation
- **React Query** for API state management
- **Recharts** for data visualization

### State Management

- **Context API** for authentication
- **Local state** for component data
- **React Query** for server state
- **LocalStorage** for token persistence

### API Client

- **Fetch-based** HTTP client
- **JWT token** authentication
- **Error handling** and retry logic
- **TypeScript interfaces** for type safety

## 🚀 Getting Started

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Start development server**:

   ```bash
   npm run dev
   ```

3. **Access the application**:

   - Open http://localhost:8080
   - Register a new account or login
   - Choose your role during registration

4. **Test different roles**:
   - Create accounts with different roles
   - Experience role-based dashboards
   - Test the complete workflow

## 🔐 Environment Configuration

The API endpoint is configured in `src/lib/api.ts`:

```typescript
const API_BASE_URL = "https://laravel-wtc.onrender.com/api";
```

Update this URL if using a different backend instance.

## 📝 Development Notes

- **Type Safety**: Full TypeScript integration
- **Error Boundaries**: Proper error handling
- **Performance**: Optimized for production
- **Accessibility**: ARIA labels and semantic HTML
- **SEO**: Proper meta tags and structure

This system provides a complete e-commerce and supply chain management solution with modern UI/UX, comprehensive role-based access control, and seamless integration with the Laravel backend.
