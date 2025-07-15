export interface Product {
  id: number;
  title: string;
  description: string;
  shortDescription: string;
  brand: string;
  category: string;
  subcategory: string;
  price: number;
  stock: number;
  heroImage: string;
  tags: string[];
  status: "active" | "inactive" | "draft";
  featured: boolean;
  freeShipping: boolean;
  hasVariants: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: number;
  orderNumber: string;
  items: any[];
  total: number;
  customerEmail: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  date: string;
}
