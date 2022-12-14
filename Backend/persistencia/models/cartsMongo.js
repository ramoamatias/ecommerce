import { Schema, model } from "mongoose";

const nameCollection = "carts";

const cartsSchema = Schema({
  timestamp: { type: String, required: true },
  products: [
    {
      code: { type: String, required: true },
      name: { type: String, required: true },  
      price: {
        type: Number,
        required: true,
        min: [0, "Price must be greater than 0"],
      },
      urlPhoto: { type: String, required: true },
      quantity: {
        type: Number,
        required: true,
        min: [0, "Stock must be greater than 0"],
      }
    }
  ],
});

export const modelCarts = model(nameCollection, cartsSchema);
