import { Schema, model } from "mongoose";

const nameCollection = "carts";

const cartsSchema = Schema({
  timestamp: { type: String, required: true },
  products: [
    {
      timestamp: { type: String, required: true },
      name: { type: String, required: true },
      description: { type: String, required: true },
      code: { type: String, required: true },
      photo: { type: String, required: true },
      price: {
        type: Number,
        required: true,
        min: [0, "Price must be greater than 0"],
      },
      stock: {
        type: Number,
        required: true,
        min: [0, "Stock must be greater than 0"],
      }
    }
  ],
});

export const modelCarts = model(nameCollection, cartsSchema);
