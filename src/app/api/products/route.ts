import { NextResponse } from "next/server";
import { connectToDatabase } from "@/Lib/db";
import Product from "@/models/Product";

export async function GET() {
  try {
    // Connect to MongoDB
    await connectToDatabase();

    // Fetch all products
    const products = await Product.find();
    return NextResponse.json({ success: true, data: products });
  } catch (error: unknown) {
    console.error("Error in GET:", error); // Log the error for debugging

    const errorMessage =
      typeof error === "object" && error !== null && "message" in error
        ? (error as Error).message
        : "An unknown error occurred";

    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();

    // Create a new product
    const newProduct = await Product.create(body);
    return NextResponse.json({ success: true, data: newProduct });
  } catch (error: unknown) {
    console.error("Error in POST:", error); // Log the error for debugging

    const errorMessage =
      typeof error === "object" && error !== null && "message" in error
        ? (error as Error).message
        : "An unknown error occurred";

    return NextResponse.json({ success: false, error: errorMessage }, { status: 400 });
  }
}

export async function PATCH(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const { id, ...updates } = body;

    // Update a product
    const updatedProduct = await Product.findByIdAndUpdate(id, updates, { new: true });
    if (!updatedProduct) throw new Error("Product not found");

    return NextResponse.json({ success: true, data: updatedProduct });
  } catch (error: unknown) {
    console.error("Error in PATCH:", error); // Log the error for debugging

    const errorMessage =
      typeof error === "object" && error !== null && "message" in error
        ? (error as Error).message
        : "An unknown error occurred";

    return NextResponse.json({ success: false, error: errorMessage }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    // Delete a product
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) throw new Error("Product not found");

    return NextResponse.json({ success: true, data: deletedProduct });
  } catch (error: unknown) {
    console.error("Error in DELETE:", error); // Log the error for debugging

    const errorMessage =
      typeof error === "object" && error !== null && "message" in error
        ? (error as Error).message
        : "An unknown error occurred";

    return NextResponse.json({ success: false, error: errorMessage }, { status: 400 });
  }
}
