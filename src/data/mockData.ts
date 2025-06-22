import { type Product } from "@/lib/api";

export const mockProducts: Product[] = [
  {
    id: 1,
    name: "Wireless Bluetooth Headphones",
    description:
      "Premium quality wireless headphones with noise cancellation and 30-hour battery life. Perfect for music lovers and professionals.",
    price: "99.99",
    quantity: 25,
    low_stock_threshold: 5,
    image: "/placeholder.svg",
    status: true,
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-20T10:00:00Z",
  },
  {
    id: 2,
    name: "Gaming Mechanical Keyboard",
    description:
      "RGB backlit mechanical keyboard with cherry MX switches. Perfect for gaming and typing with customizable LED effects.",
    price: "149.99",
    quantity: 15,
    low_stock_threshold: 5,
    image: "/placeholder.svg",
    status: true,
    created_at: "2024-01-16T10:00:00Z",
    updated_at: "2024-01-21T10:00:00Z",
  },
  {
    id: 3,
    name: "4K Webcam with Auto Focus",
    description:
      "Ultra HD webcam with automatic focus and noise reduction. Ideal for video conferencing and content creation.",
    price: "79.99",
    quantity: 30,
    low_stock_threshold: 10,
    image: "/placeholder.svg",
    status: true,
    created_at: "2024-01-17T10:00:00Z",
    updated_at: "2024-01-22T10:00:00Z",
  },
  {
    id: 4,
    name: "Ergonomic Wireless Mouse",
    description:
      "Comfortable wireless mouse with precision tracking and long battery life. Designed for extended use without fatigue.",
    price: "39.99",
    quantity: 50,
    low_stock_threshold: 15,
    image: "/placeholder.svg",
    status: true,
    created_at: "2024-01-18T10:00:00Z",
    updated_at: "2024-01-23T10:00:00Z",
  },
  {
    id: 5,
    name: "Adjustable Laptop Stand",
    description:
      "Aluminum laptop stand with adjustable height and angle. Improves posture and provides better ventilation for your laptop.",
    price: "49.99",
    quantity: 20,
    low_stock_threshold: 8,
    image: "/placeholder.svg",
    status: true,
    created_at: "2024-01-19T10:00:00Z",
    updated_at: "2024-01-24T10:00:00Z",
  },
  {
    id: 6,
    name: "LED Desk Lamp with USB Charging",
    description:
      "Modern LED desk lamp with multiple brightness levels and USB charging port. Perfect for reading and working.",
    price: "34.99",
    quantity: 3,
    low_stock_threshold: 5,
    image: "/placeholder.svg",
    status: true,
    created_at: "2024-01-20T10:00:00Z",
    updated_at: "2024-01-25T10:00:00Z",
  },
];

export const getMockProduct = (id: number): Product | null => {
  return mockProducts.find((product) => product.id === id) || null;
};

export const getMockProducts = (): Product[] => {
  return mockProducts;
};
