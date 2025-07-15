import { NextRequest, NextResponse } from "next/server";
import { getProducts, addProduct } from "@/lib/store";

// GET /api/products - Get all products
export async function GET() {
  try {
    const products = getProducts();
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

// POST /api/products - Add new product
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, brand, category, price, stock, heroImage, description } =
      body;

    // Basic validation
    if (!title || !category || !price || !stock || !heroImage) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newProduct = addProduct({
      title,
      brand: brand || "Apple",
      category,
      price: Number(price),
      stock: Number(stock),
      heroImage,
      description: description || "",
      shortDescription: "",
      subcategory: "",
      tags: [],
      status: "active",
      featured: false,
      freeShipping: false,
      hasVariants: false,
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
