import mongoose, { Schema, model, models } from "mongoose";

const ProductSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
  },
  { timestamps: true }
);

// Avoid recompiling the model if it already exists
const Product = models.Product || model("Product", ProductSchema);

export default Product;
