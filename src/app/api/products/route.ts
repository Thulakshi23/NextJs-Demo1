// src/app/api/products/route.ts
import { NextResponse } from "next/server";
import DBconnect from "@/Lib/db"; // Ensure the import path is correct
import Product from "@/models/Product"; // Ensure Product model is defined properly

export async function GET() {
  try {
    await DBconnect(); // Connect to MongoDB
    const products = await Product.find(); // Fetch all products
    return NextResponse.json({ success: true, data: products });
  } catch (error: unknown) {
    console.error("Error in GET:", error);
    const errorMessage =
      typeof error === "object" && error !== null && "message" in error
        ? (error as Error).message
        : "An unknown error occurred";

    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await DBconnect(); // Connect to MongoDB
    const body = await request.json(); // Get request body
    const newProduct = await Product.create(body); // Create a new product
    return NextResponse.json({ success: true, data: newProduct });
  } catch (error: unknown) {
    console.error("Error in POST:", error);
    const errorMessage =
      typeof error === "object" && error !== null && "message" in error
        ? (error as Error).message
        : "An unknown error occurred";

    return NextResponse.json({ success: false, error: errorMessage }, { status: 400 });
  }
}

export async function PATCH(request: Request) {
  try {
    await DBconnect(); // Connect to MongoDB
    const body = await request.json(); // Get request body
    const { id, ...updates } = body; // Destructure id and updates from body

    const updatedProduct = await Product.findByIdAndUpdate(id, updates, { new: true }); // Update a product
    if (!updatedProduct) throw new Error("Product not found");

    return NextResponse.json({ success: true, data: updatedProduct });
  } catch (error: unknown) {
    console.error("Error in PATCH:", error);
    const errorMessage =
      typeof error === "object" && error !== null && "message" in error
        ? (error as Error).message
        : "An unknown error occurred";

    return NextResponse.json({ success: false, error: errorMessage }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    await DBconnect(); // Connect to MongoDB
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id"); // Get product ID from URL params

    const deletedProduct = await Product.findByIdAndDelete(id); // Delete a product
    if (!deletedProduct) throw new Error("Product not found");

    return NextResponse.json({ success: true, data: deletedProduct });
  } catch (error: unknown) {
    console.error("Error in DELETE:", error);
    const errorMessage =
      typeof error === "object" && error !== null && "message" in error
        ? (error as Error).message
        : "An unknown error occurred";

    return NextResponse.json({ success: false, error: errorMessage }, { status: 400 });
  }
}
