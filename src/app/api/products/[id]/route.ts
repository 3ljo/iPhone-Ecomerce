import { NextRequest, NextResponse } from "next/server";
import {
  getProduct,
  getProducts,
  updateProduct,
  deleteProduct,
} from "@/lib/store";

// GET /api/products/[id] - Get single product
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const product = getProduct(Number(params.id));

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

// PUT /api/products/[id] - Update product
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { title, brand, category, price, stock, heroImage, description } =
      body;

    const updatedProduct = updateProduct(Number(params.id), {
      title,
      brand,
      category,
      price: Number(price),
      stock: Number(stock),
      heroImage,
      description,
    });

    if (!updatedProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(updatedProduct);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

// DELETE /api/products/[id] - Delete product
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log("=== API DELETE DEBUG ===");
    console.log("Received ID parameter:", params.id);

    const productId = Number(params.id);
    console.log("Converted to number:", productId);

    const product = getProduct(productId);
    console.log("Found product:", product ? product.title : "NOT FOUND");

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const success = deleteProduct(productId);
    console.log("Delete result:", success);

    if (!success) {
      return NextResponse.json(
        { error: "Failed to delete product" },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Delete API error:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
