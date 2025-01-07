// src/app/api/products/route.ts
import { NextResponse } from 'next/server';
import { getDatabase } from '@/Lib/db';

export async function GET() {
  const db = await getDatabase();
  const products = await db.collection('products').find().toArray();
  return NextResponse.json(products);
}

export async function POST(request: Request) {
  const db = await getDatabase();
  const body = await request.json();
  const result = await db.collection('products').insertOne(body);
  return NextResponse.json({ message: 'Product added', product: result });
}

export async function PATCH(request: Request) {
  const db = await getDatabase();
  const body = await request.json();
  const { id, updateData } = body;
  const result = await db.collection('products').updateOne({ _id: id }, { $set: updateData });
  return NextResponse.json({ message: 'Product updated', result });
}

export async function DELETE(request: Request) {
  const db = await getDatabase();
  const body = await request.json();
  const { id } = body;
  const result = await db.collection('products').deleteOne({ _id: id });
  return NextResponse.json({ message: 'Product deleted', result });
}
