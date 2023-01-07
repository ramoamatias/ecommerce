import { Schema, model } from "mongoose";

const nameCollection = "cartsUserHist";

const cartsUserHistSchema = Schema({
  idCart: { type: String, required: true },
  email: { type: String, required: true },
  timestamp: { type: String, required: true },
  products: [
    {
      _id: { type: String, required: true },
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

export const modelCartsUserHist = model(nameCollection, cartsUserHistSchema);
