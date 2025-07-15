import { Product, Order } from "@/types";

// Start with empty data - admin will add products
let products: Product[] = [];
let orders: Order[] = [];
let nextProductId = 1;
let nextOrderId = 1000;

// Product CRUD Operations
export const getProducts = (): Product[] => products;

export const getProduct = (id: number): Product | undefined =>
  products.find((p) => p.id === id);

export const addProduct = (
  productData: Omit<Product, "id" | "createdAt" | "updatedAt">
): Product => {
  const now = new Date().toISOString();

  // Use the current nextProductId and then increment it
  const newProduct: Product = {
    ...productData,
    id: nextProductId,
    createdAt: now,
    updatedAt: now,
    sku: productData.sku || `IP-${String(nextProductId).padStart(4, "0")}`,
  };

  // Increment after using the ID
  nextProductId++;

  // Add to products array
  products.push(newProduct);

  console.log("Added product:", newProduct);
  console.log("Total products:", products.length);

  return newProduct;
};

export const updateProduct = (
  id: number,
  updates: Partial<Product>
): Product | null => {
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) return null;

  products[index] = {
    ...products[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  return products[index];
};

export const deleteProduct = (id: number): boolean => {
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) return false;

  products.splice(index, 1);
  return true;
};

// Order Operations
export const getOrders = (): Order[] => orders;

export const addOrder = (
  orderData: Omit<Order, "id" | "orderNumber" | "date">
): Order => {
  const now = new Date().toISOString();
  const newOrder: Order = {
    ...orderData,
    id: nextOrderId,
    orderNumber: `iPhone-${String(nextOrderId).padStart(6, "0")}`,
    date: now,
  };
  nextOrderId++;
  orders.push(newOrder);
  return newOrder;
};

// Debug function to check products
export const debugProducts = () => {
  console.log("Current products:", products);
  console.log("Next ID:", nextProductId);
};
